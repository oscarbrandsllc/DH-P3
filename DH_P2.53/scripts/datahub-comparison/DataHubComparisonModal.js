import {
  MAX_COMPARISON_PLAYERS,
  formatComparisonValue,
  formatRank,
  getComparisonPosition,
  getComparisonRankColor,
  getOrdinalSuffix,
  getPlayerAccentColor,
  getPlayerName,
  getPlayerPalette,
  getRadarRankValue,
  getSeasonStatKeys,
  getStatDefinition,
  getStatLabel,
  getWeeklyComparisonEdges,
  getWeeklyStatOptions,
  normalizePlayerSearchText,
  toFiniteNumber,
} from "./comparisonStats.js";
import {
  buildWeeklyChartOption,
} from "./comparisonChartOptions.js";

const POSITION_FILTERS = Object.freeze([
  { key: "all", label: "All" },
  { key: "QB", label: "QB" },
  { key: "RB", label: "RB" },
  { key: "WR", label: "WR" },
  { key: "TE", label: "TE" },
  { key: "FLX", label: "FLX" },
]);

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getInitialSelectedIds(payload) {
  return Array.isArray(payload?.defaults?.selectedPlayerIds)
    ? payload.defaults.selectedPlayerIds.slice(0, MAX_COMPARISON_PLAYERS)
    : [];
}

function getSelectedPlayers(playersById, selectedIds) {
  return selectedIds
    .map((id) => playersById.get(id))
    .filter(Boolean);
}

function playerMatchesQuery(player, query) {
  if (!query) {
    return true;
  }
  return (player.searchText || normalizePlayerSearchText(player)).includes(query);
}

function playerMatchesPositionFilter(player, positionFilter) {
  const pos = String(player?.pos || "").trim().toUpperCase();
  if (!positionFilter || positionFilter === "all") {
    return true;
  }
  if (positionFilter === "FLX") {
    return pos === "RB" || pos === "WR" || pos === "TE";
  }
  return pos === positionFilter;
}

function sortSearchResults(left, right, selectedIds) {
  const leftSelected = selectedIds.includes(left.id);
  const rightSelected = selectedIds.includes(right.id);
  if (leftSelected !== rightSelected) {
    return leftSelected ? -1 : 1;
  }
  const leftFpts = toFiniteNumber(left.fpts) ?? -Infinity;
  const rightFpts = toFiniteNumber(right.fpts) ?? -Infinity;
  if (leftFpts !== rightFpts) {
    return rightFpts - leftFpts;
  }
  return getPlayerName(left).localeCompare(getPlayerName(right));
}

function getSearchResults(players, query, selectedIds, positionFilter) {
  const normalizedQuery = query.trim().toLowerCase();
  return players
    .filter((player) => playerMatchesPositionFilter(player, positionFilter))
    .filter((player) => playerMatchesQuery(player, normalizedQuery))
    .sort((left, right) => sortSearchResults(left, right, selectedIds));
}

function getWeeklyDisplayValue(player, statKey) {
  const values = (player?.weeklySeries || [])
    .filter((entry) => entry?.isPlayed || entry?.played)
    .map((entry) => toFiniteNumber(entry?.stats?.[statKey]))
    .filter((value) => value !== null);
  if (!values.length) {
    return null;
  }
  return statKey === "fpts"
    ? values.reduce((sum, value) => sum + value, 0)
    : values[values.length - 1];
}

function getWeeklyStatAverage(player, statKey) {
  // Summary-card weekly average:
  // include only played, non-skipped weeks with a real value for the active
  // stat so byes, injuries, and missing observations do not dilute the AVG.
  const values = (player?.weeklySeries || [])
    .filter((entry) => !entry?.isSkipped && !entry?.skipped && (entry?.isPlayed || entry?.played))
    .map((entry) => toFiniteNumber(entry?.stats?.[statKey]))
    .filter((value) => value !== null);
  if (!values.length) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatWeeklyStatAverage(player, statKey) {
  const definition = getStatDefinition(statKey);
  const defaultDecimals = Number.isFinite(definition?.decimals) ? definition.decimals : 1;
  return formatComparisonValue(statKey, getWeeklyStatAverage(player, statKey), {
    compact: true,
    decimals: Math.max(1, defaultDecimals),
  });
}

function getFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys }) {
  if (mode === "season") {
    return seasonStatKeys.slice(0, 6).map((statKey) => ({
      key: statKey,
      label: getStatLabel(statKey),
      values: selectedPlayers.map((player) => ({
        player,
        value: player?.seasonStats?.[statKey],
        rank: player?.seasonPosRanks?.[statKey],
      })),
    }));
  }
  return selectedPlayers.map((player) => ({
    key: player.id,
    label: getPlayerName(player),
    values: [{
      player,
      value: getWeeklyDisplayValue(player, weeklyStatKey),
      rank: null,
    }],
  }));
}

function getFallbackWeeklyStat(options) {
  return options.find((option) => option.key === "fpts") || options[0] || { key: "fpts", label: "FPTS" };
}

function getCompactPlayerName(player) {
  const fullName = getPlayerName(player).trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return fullName;
  }
  return `${parts[0].charAt(0)}. ${parts.slice(1).join(" ")}`;
}

function getPlayerPaletteIndex(players, playerIndex) {
  const player = players[playerIndex];
  const position = String(player?.pos || "").trim().toUpperCase();
  if (!player || !position) {
    return 0;
  }
  return players
    .slice(0, playerIndex)
    .filter((candidate) => String(candidate?.pos || "").trim().toUpperCase() === position)
    .length;
}

const SEASON_RADAR_LAYOUT = Object.freeze({
  width: 460,
  height: 360,
  centerX: 230,
  centerY: 172,
  radius: 112,
  labelRadius: 139,
});
const SEASON_RADAR_RING_LEVELS = Object.freeze([
  Object.freeze({ ratio: 0.95, fill: "rgba(44, 51, 79, 0.42)", stroke: "rgba(127, 146, 189, 0.19)" }),
  Object.freeze({ ratio: 0.75, fill: "rgba(45, 52, 81, 0.34)", stroke: "rgba(127, 146, 189, 0.14)" }),
  Object.freeze({ ratio: 0.55, fill: "rgba(47, 54, 82, 0.31)", stroke: "rgba(127, 146, 189, 0.13)" }),
  Object.freeze({ ratio: 0.35, fill: "rgba(48, 55, 84, 0.34)", stroke: "rgba(127, 146, 189, 0.14)" }),
  Object.freeze({ ratio: 0.18, fill: "rgba(49, 56, 85, 0.42)", stroke: "rgba(127, 146, 189, 0.18)" }),
]);
const SEASON_RADAR_AXIS_LABEL_OFFSETS = Object.freeze([16, 9, 8, 4, 8, 4, 8, 9]);
const SEASON_RADAR_RANK_OFFSETS = Object.freeze([14.5, 14.5, 16, 16, 16, 20, 23, 19.5]);

function getSeasonRadarPoint(index, total, radius) {
  const angle = (-Math.PI / 2) + ((Math.PI * 2 * index) / Math.max(1, total));
  return {
    angle,
    cos: Math.cos(angle),
    sin: Math.sin(angle),
    x: SEASON_RADAR_LAYOUT.centerX + (Math.cos(angle) * radius),
    y: SEASON_RADAR_LAYOUT.centerY + (Math.sin(angle) * radius),
  };
}

function getSeasonRadarPolygonPoints(total, radius) {
  return Array.from({ length: total }, (_, index) => {
    const point = getSeasonRadarPoint(index, total, radius);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(" ");
}

function getSeasonRadarTextAnchor(cos) {
  if (cos > 0.3) return "start";
  if (cos < -0.3) return "end";
  return "middle";
}

function getSeasonRadarId(playerId, suffix) {
  const safePlayerId = String(playerId || "player").replace(/[^a-z0-9_-]/gi, "-");
  return `dh-compare-radar-${safePlayerId}-${suffix}`;
}

function formatSeasonRadarValue(statKey, value) {
  // Season radar display values:
  // match the Game Logs Performance radar's labels so moving between the two
  // modal surfaces never changes units, precision, or missing-data language.
  const numericValue = toFiniteNumber(value);
  if (numericValue === null) return "N/A";
  if (["cmp_pct", "snp_pct", "ts_per_rr", "prs_pct"].includes(statKey)) {
    return `${numericValue.toFixed(1)}%`;
  }
  if (statKey === "cpoe") {
    const formatted = `${numericValue.toFixed(1)}%`;
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (statKey === "epa_per_db") {
    const formatted = numericValue.toFixed(2);
    return numericValue > 0 ? `+${formatted}` : formatted;
  }
  if (statKey === "first_down_rec_rate") return numericValue.toFixed(2);
  if (["fpts", "ppg", "pass_rtg", "rec_ypg"].includes(statKey)) return numericValue.toFixed(1);
  if (["rec", "rec_tgt", "yds_total"].includes(statKey)) return String(Math.round(numericValue));
  if (["ttt", "imp_per_g"].includes(statKey)) return numericValue.toFixed(2);
  return numericValue.toFixed(2);
}

export function createDataHubComparisonModal(React) {
  const {
    createElement: h,
    useEffect,
    useMemo,
    useRef,
    useState,
  } = React;

  function ChevronDownIcon({ className }) {
    return h(
      "svg",
      {
        className,
        viewBox: "0 0 20 20",
        fill: "none",
        "aria-hidden": "true",
        focusable: "false",
      },
      h("path", {
        d: "M5.5 7.5 10 12l4.5-4.5",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    );
  }

  function SearchIcon({ className }) {
    return h(
      "svg",
      {
        className,
        viewBox: "0 0 20 20",
        fill: "none",
        "aria-hidden": "true",
        focusable: "false",
      },
      h("path", {
        d: "m14.25 14.25 2.25 2.25M8.75 15.25a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z",
        stroke: "currentColor",
        strokeWidth: "1.9",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    );
  }

  function WeeklyEdgeIcon({ className }) {
    return h(
      "svg",
      {
        className,
        viewBox: "0 0 20 20",
        fill: "none",
        "aria-hidden": "true",
        focusable: "false",
      },
      h("path", {
        d: "M3 13.8 7.2 9.6l3 2.8L16.8 5.8",
        stroke: "currentColor",
        strokeWidth: "1.7",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
      h("path", {
        d: "M12.8 5.8h4v4M3 16.5h14",
        stroke: "currentColor",
        strokeWidth: "1.55",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    );
  }

  function EmptyCompareIcon({ className }) {
    return h(
      "svg",
      {
        className,
        viewBox: "0 0 48 48",
        fill: "none",
        "aria-hidden": "true",
        focusable: "false",
      },
      h("path", {
        d: "M8 31.5 17.5 22l7 7L40 13.5",
        stroke: "currentColor",
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
      h("path", {
        d: "M9 38h30M9 10v28",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        opacity: "0.45",
      }),
      h("circle", { cx: "17.5", cy: "22", r: "3.2", fill: "currentColor", opacity: "0.88" }),
      h("circle", { cx: "24.5", cy: "29", r: "3.2", fill: "currentColor", opacity: "0.68" }),
      h("circle", { cx: "40", cy: "13.5", r: "3.2", fill: "currentColor", opacity: "0.88" }),
    );
  }

  function ModeButton({ value, active, onSelect, children }) {
    return h(
      "button",
      {
        type: "button",
        className: cx("dh-compare-mode", active && "is-active"),
        "aria-pressed": String(active),
        onClick: () => onSelect(value),
      },
      children,
    );
  }

  function PlayerChip({ player, index, onRemove }) {
    const color = getPlayerAccentColor(player, index);
    return h(
      "span",
      {
        className: "dh-compare-player-chip",
        style: { "--compare-player-color": color },
      },
      h("span", { className: "dh-compare-player-chip__dot", "aria-hidden": "true" }),
      player.teamLogoSrc
        ? h("img", {
          className: "dh-compare-player-chip__logo",
          src: player.teamLogoSrc,
          alt: "",
          loading: "eager",
        })
        : null,
      h("span", { className: "dh-compare-player-chip__name" }, getPlayerName(player)),
      h("span", { className: "dh-compare-player-chip__pos" }, player.pos || "FA"),
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-player-chip__remove",
          "aria-label": `Remove ${getPlayerName(player)}`,
          onClick: () => onRemove(player.id),
        },
        "×",
      ),
    );
  }

  function PlayerSearchOption({ player, selected, disabled, active, onToggle }) {
    return h(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": String(selected),
        "aria-disabled": String(disabled),
        className: cx(
          "dh-compare-search-option",
          selected && "is-selected",
          disabled && "is-disabled",
        ),
        // Player selector state:
        // keyboard focus is kept for Enter selection, but it no longer borrows
        // selected-row styling when filters reorder the visible option list.
        "data-keyboard-active": active ? "true" : undefined,
        disabled,
        onClick: () => onToggle(player.id),
      },
      h(
        "span",
        { className: "dh-compare-search-option__main" },
        h(
          "span",
          { className: "dh-compare-search-option__logo-wrap", "aria-hidden": "true" },
          player.teamLogoSrc
            ? h("img", {
              className: "dh-compare-search-option__logo",
              src: player.teamLogoSrc,
              alt: "",
              loading: "lazy",
            })
            : h("span", { className: "dh-compare-search-option__logo-fallback" }, player.team || "FA"),
        ),
        h(
          "span",
          { className: "dh-compare-search-option__copy" },
          h("span", { className: "dh-compare-search-option__name" }, player.fullName || player.name),
          h("span", { className: "dh-compare-search-option__meta" }, `${player.pos || "FA"} · ${player.team || "FA"}`),
        ),
      ),
      h(
        "span",
        { className: "dh-compare-search-option__stats" },
        h("span", { className: "dh-compare-search-option__fpts" }, formatComparisonValue("fpts", player.fpts, { compact: true })),
        h("span", { className: "dh-compare-search-option__status" }, selected ? "Selected" : (disabled ? `Max ${MAX_COMPARISON_PLAYERS}` : "Add")),
      ),
    );
  }

  function PositionFilters({ activeFilter, onFilterChange, selectedCount, onClearAll, onClose }) {
    return h(
      "div",
      { className: "dh-compare-search-tools" },
      h(
        "div",
        { className: "dh-compare-position-filters", role: "group", "aria-label": "Filter players by position" },
        POSITION_FILTERS.map((filter) => h(
          "button",
          {
            key: filter.key,
            type: "button",
            className: cx("dh-compare-position-filter", filter.key === activeFilter && "is-active"),
            "aria-pressed": String(filter.key === activeFilter),
            onClick: () => onFilterChange(filter.key),
          },
          filter.label,
        )),
      ),
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-search-close",
          "aria-label": "Close player selector",
          onClick: onClose,
        },
        "×",
      ),
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-clear-all",
          disabled: selectedCount === 0,
          onClick: onClearAll,
        },
        "Clear All",
      ),
    );
  }

  function StatDropdown({ options, activeKey, isOpen, onOpenChange, onSelect, shellRef }) {
    const activeOption = options.find((option) => option.key === activeKey) || getFallbackWeeklyStat(options);
    return h(
      "div",
      { className: "dh-compare-stat-select", ref: shellRef },
      h(
        "button",
        {
          type: "button",
          className: "dh-compare-stat-trigger",
          "aria-haspopup": "listbox",
          "aria-expanded": String(isOpen),
          onClick: () => onOpenChange(!isOpen),
          onKeyDown: (event) => {
            if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenChange(true);
            }
            if (event.key === "Escape") {
              onOpenChange(false);
            }
          },
        },
        h("strong", null, activeOption.label),
        h(ChevronDownIcon, { className: "dh-compare-stat-trigger__chevron" }),
      ),
      isOpen
        ? h(
          "div",
          {
            className: "dh-compare-stat-menu",
            role: "listbox",
            "aria-label": "Weekly stat",
          },
          options.map((stat) => h(
            "button",
            {
              key: stat.key,
              type: "button",
              role: "option",
              className: cx("dh-compare-stat-option", stat.key === activeOption.key && "is-active"),
              "aria-selected": String(stat.key === activeOption.key),
              onClick: () => {
                onSelect(stat.key);
                onOpenChange(false);
              },
            },
            stat.label,
          )),
        )
        : null,
    );
  }

  function SummaryCard({ player, playerIndex, statKey }) {
    const color = getPlayerAccentColor(player, playerIndex);
    const weeklyAverage = formatWeeklyStatAverage(player, statKey);
    return h(
      "article",
      {
        className: "dh-compare-summary-card",
        style: { "--compare-player-color": color },
      },
      h(
        "div",
        { className: "dh-compare-summary-card__player" },
        player.teamLogoSrc
          ? h("img", { src: player.teamLogoSrc, alt: "", loading: "eager" })
          : h("span", { className: "dh-compare-summary-card__logo-fallback" }, player.team || "FA"),
        h(
          "span",
          { className: "dh-compare-summary-card__identity" },
          h("strong", null,
            h("span", { className: "dh-compare-summary-card__name-full" }, getPlayerName(player)),
            h("span", { className: "dh-compare-summary-card__name-compact" }, getCompactPlayerName(player)),
          ),
          h("span", null, `${player.pos || "FA"} · ${player.team || "FA"}`),
        ),
      ),
      h(
        "div",
        { className: "dh-compare-summary-card__metric" },
        h("span", null, `${getStatLabel(statKey)} Season`),
        h("strong", null, formatComparisonValue(statKey, player?.seasonStats?.[statKey], { compact: true })),
      ),
      h(
        "div",
        { className: "dh-compare-summary-card__ranks" },
        h(
          "span",
          { className: "dh-compare-summary-card__rank-pair" },
          h("span", null, `OVR ${formatRank(player?.seasonOverallRanks?.[statKey])}`),
          h("span", { className: "dh-compare-summary-card__rank-separator", "aria-hidden": "true" }, "|"),
          h("span", null, `${player.pos || "POS"}·${formatRank(player?.seasonPosRanks?.[statKey])}`),
        ),
        h(
          "span",
          {
            className: "dh-compare-summary-card__average",
            title: `${getStatLabel(statKey)} weekly average`,
          },
          h("span", null, "AVG"),
          h("strong", null, weeklyAverage),
        ),
      ),
    );
  }

  function PlayerChartHeader({ mode, player, weeklyStatKey, weeklyEdge }) {
    const edgeLabel = weeklyEdge
      ? `${weeklyEdge.betterWeeks} ${weeklyEdge.betterWeeks === 1 ? "week" : "weeks"} with the better ${getStatLabel(weeklyStatKey)} value across ${weeklyEdge.compared} comparable weeks`
      : "Weekly comparison unavailable";
    return h(
      "div",
      { className: "dh-compare-player-chart__header" },
      h("span", { className: "dh-compare-player-chart__stat" }, mode === "season" ? "Season" : getStatLabel(weeklyStatKey)),
      h(
        "span",
        { className: "dh-compare-player-chart__identity" },
        h("span", { className: "dh-compare-player-chart__dot", "aria-hidden": "true" }),
        player.teamLogoSrc
          ? h("img", {
            className: "dh-compare-player-chart__logo",
            src: player.teamLogoSrc,
            alt: "",
            loading: "eager",
          })
          : h("span", { className: "dh-compare-player-chart__logo-fallback" }, player.team || "FA"),
        h("strong", { className: "dh-compare-player-chart__name" }, getPlayerName(player)),
      ),
      mode === "weekly" && weeklyEdge
        ? h(
          "span",
          {
            className: cx("dh-compare-weekly-edge", `is-${weeklyEdge.status}`),
            title: `${getPlayerName(player)}: ${edgeLabel}`,
            "aria-label": `${getPlayerName(player)}: ${edgeLabel}`,
          },
          h(WeeklyEdgeIcon, { className: "dh-compare-weekly-edge__icon" }),
          h("strong", null, weeklyEdge.betterWeeks),
          h("span", null, "better wks"),
        )
        : h("span", { className: "dh-compare-player-chart__meta" }, `${player.pos || "FA"} · ${player.team || "FA"}`),
    );
  }

  function ChartFallback({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys }) {
    const rows = getFallbackRows({ mode, selectedPlayers, weeklyStatKey, seasonStatKeys });
    return h(
      "div",
      { className: "dh-compare-fallback" },
      h("div", { className: "dh-compare-warning" }, "Chart renderer unavailable"),
      h(
        "div",
        { className: "dh-compare-fallback__grid" },
        rows.map((row) => h(
          "div",
          { key: row.key, className: "dh-compare-fallback__card" },
          h("span", { className: "dh-compare-fallback__label" }, row.label),
          row.values.map(({ player, value, rank }, index) => h(
            "span",
            {
              key: `${row.key}-${player.id}`,
              className: "dh-compare-fallback__value",
              style: { "--compare-player-color": getPlayerAccentColor(player, index) },
            },
            mode === "season"
              ? `${getPlayerName(player)} ${formatComparisonValue(row.key, value, { compact: true })} (${player.pos}·${formatRank(rank)})`
              : `${getPlayerName(player)} ${formatComparisonValue(weeklyStatKey, value, { compact: true })}`,
          )),
        )),
      ),
    );
  }

  function SeasonRadarChart({ player, colorIndex }) {
    const statKeys = getSeasonStatKeys([player]);
    if (!statKeys.length) {
      return h(ChartFallback, {
        mode: "season",
        selectedPlayers: [player],
        weeklyStatKey: "fpts",
        seasonStatKeys: [],
      });
    }

    const palette = getPlayerPalette(player, colorIndex);
    const gradientId = getSeasonRadarId(player.id, `fill-${colorIndex}`);
    const glowId = getSeasonRadarId(player.id, `glow-${colorIndex}`);
    const totalAxes = statKeys.length;
    const dataPoints = statKeys.map((statKey, index) => {
      const rawValue = player?.seasonStats?.[statKey];
      const rank = toFiniteNumber(player?.seasonPosRanks?.[statKey]);
      const score = getRadarRankValue(rank, player.pos);
      const pointRadius = SEASON_RADAR_LAYOUT.radius * (score / 100);
      const point = getSeasonRadarPoint(index, totalAxes, pointRadius);
      const rankOffset = SEASON_RADAR_RANK_OFFSETS[index] || 16;
      const rankPoint = getSeasonRadarPoint(index, totalAxes, Math.max(34, pointRadius + rankOffset));
      const labelRadius = SEASON_RADAR_LAYOUT.labelRadius + (SEASON_RADAR_AXIS_LABEL_OFFSETS[index] || 0);
      const labelPoint = getSeasonRadarPoint(index, totalAxes, labelRadius);
      const rankNumber = rank === null ? null : Math.round(rank);
      return {
        statKey,
        rawValue,
        formattedValue: formatSeasonRadarValue(statKey, rawValue),
        rank,
        rankNumber,
        rankColor: getComparisonRankColor(rank, player.pos),
        point,
        rankPoint,
        labelPoint,
        textAnchor: getSeasonRadarTextAnchor(labelPoint.cos),
      };
    });
    const polygonPoints = dataPoints
      .map(({ point }) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ");
    const accessibleDetails = dataPoints
      .map((item) => `${getStatLabel(item.statKey)} ${item.formattedValue}, ${player.pos} rank ${item.rankNumber ?? "not available"}`)
      .join("; ");

    return h(
      "div",
      {
        className: "dh-compare-chart dh-compare-chart--season",
        role: "img",
        "aria-label": `${getPlayerName(player)} season position-ranking radar. ${accessibleDetails}`,
      },
      h(
        "svg",
        {
          className: "dh-compare-season-radar",
          viewBox: `0 0 ${SEASON_RADAR_LAYOUT.width} ${SEASON_RADAR_LAYOUT.height}`,
          preserveAspectRatio: "xMidYMid meet",
          "aria-hidden": "true",
          focusable: "false",
        },
        // Season performance radar:
        // reproduce the Game Logs hierarchy with the raw stat outside each axis
        // and the ordinal positional rank attached to the plotted data point.
        h(
          "defs",
          null,
          h(
            "linearGradient",
            { id: gradientId, x1: "0%", y1: "100%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: palette.low, stopOpacity: "0.42" }),
            h("stop", { offset: "52%", stopColor: palette.highMid, stopOpacity: "0.56" }),
            h("stop", { offset: "100%", stopColor: palette.high, stopOpacity: "0.68" }),
          ),
          h(
            "radialGradient",
            { id: getSeasonRadarId(player.id, `core-${colorIndex}`), cx: "50%", cy: "50%", r: "50%" },
            h("stop", { offset: "0%", stopColor: palette.highMid, stopOpacity: "0.14" }),
            h("stop", { offset: "68%", stopColor: palette.lowMid, stopOpacity: "0.055" }),
            h("stop", { offset: "100%", stopColor: palette.low, stopOpacity: "0" }),
          ),
          h(
            "filter",
            { id: glowId, x: "-50%", y: "-50%", width: "200%", height: "200%" },
            h("feGaussianBlur", { stdDeviation: "2.8", result: "blur" }),
            h(
              "feMerge",
              null,
              h("feMergeNode", { in: "blur" }),
              h("feMergeNode", { in: "SourceGraphic" }),
            ),
          ),
        ),
        h("circle", {
          className: "dh-compare-season-radar__core",
          cx: SEASON_RADAR_LAYOUT.centerX,
          cy: SEASON_RADAR_LAYOUT.centerY,
          r: SEASON_RADAR_LAYOUT.radius * 1.12,
          fill: `url(#${getSeasonRadarId(player.id, `core-${colorIndex}`)})`,
        }),
        ...SEASON_RADAR_RING_LEVELS.map((level, index) => h("polygon", {
          key: `ring-${index}`,
          className: "dh-compare-season-radar__ring",
          points: getSeasonRadarPolygonPoints(totalAxes, SEASON_RADAR_LAYOUT.radius * level.ratio),
          fill: level.fill,
          stroke: level.stroke,
        })),
        ...statKeys.map((statKey, index) => {
          const axisEnd = getSeasonRadarPoint(index, totalAxes, SEASON_RADAR_LAYOUT.radius * 0.95);
          return h("line", {
            key: `axis-${statKey}`,
            className: "dh-compare-season-radar__axis",
            x1: SEASON_RADAR_LAYOUT.centerX,
            y1: SEASON_RADAR_LAYOUT.centerY,
            x2: axisEnd.x,
            y2: axisEnd.y,
          });
        }),
        h("polygon", {
          className: "dh-compare-season-radar__shape",
          points: polygonPoints,
          fill: `url(#${gradientId})`,
          stroke: palette.high,
          filter: `url(#${glowId})`,
        }),
        ...dataPoints.map((item) => h(
          "g",
          { key: `point-${item.statKey}`, className: "dh-compare-season-radar__point-group" },
          h("title", null, `${getStatLabel(item.statKey)} ${item.formattedValue} · ${player.pos} rank ${item.rankNumber ?? "NA"}`),
          h("circle", {
            className: "dh-compare-season-radar__point-halo",
            cx: item.point.x,
            cy: item.point.y,
            r: 7.2,
            fill: item.rankColor,
          }),
          h("circle", {
            className: "dh-compare-season-radar__point",
            cx: item.point.x,
            cy: item.point.y,
            r: 4.1,
            fill: item.rankColor,
          }),
          h(
            "text",
            {
              className: cx(
                "dh-compare-season-radar__rank",
                item.rankNumber === null && "is-unavailable",
              ),
              x: item.rankPoint.x,
              y: item.rankPoint.y,
              textAnchor: getSeasonRadarTextAnchor(item.rankPoint.cos),
              dominantBaseline: "middle",
              fill: item.rankColor,
            },
            h("tspan", null, item.rankNumber === null ? "NA" : String(item.rankNumber)),
            item.rankNumber === null
              ? null
              : h(
                "tspan",
                { className: "dh-compare-season-radar__rank-suffix", dx: "1", dy: "-4" },
                getOrdinalSuffix(item.rankNumber),
              ),
          ),
        )),
        ...dataPoints.map((item) => h(
          "g",
          { key: `label-${item.statKey}`, className: "dh-compare-season-radar__axis-copy" },
          h(
            "text",
            {
              className: "dh-compare-season-radar__axis-stat",
              x: item.labelPoint.x,
              y: item.labelPoint.y,
              textAnchor: item.textAnchor,
            },
            getStatLabel(item.statKey),
          ),
          h(
            "text",
            {
              className: "dh-compare-season-radar__axis-value",
              x: item.labelPoint.x,
              y: item.labelPoint.y + 15,
              textAnchor: item.textAnchor,
              fill: item.rankColor,
            },
            `• ${item.formattedValue} •`,
          ),
        )),
      ),
    );
  }

  function PlayerChart({ mode, player, playerIndex, selectedPlayers, weeklyStatKey, weeks, thresholds, isCompact, showXAxis, weeklyEdge }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [hasEcharts, setHasEcharts] = useState(() => Boolean(window.echarts));
    const paletteIndex = getPlayerPaletteIndex(selectedPlayers, playerIndex);
    const chartOption = useMemo(() => {
      if (!player || mode === "season") {
        return null;
      }
      return buildWeeklyChartOption({
        players: [player],
        axisPlayers: selectedPlayers,
        statKey: weeklyStatKey,
        weeks,
        thresholds,
        colorIndex: paletteIndex,
        isCompact,
        showXAxis,
      });
    }, [isCompact, mode, paletteIndex, player, selectedPlayers, showXAxis, thresholds, weeklyStatKey, weeks]);

    useEffect(() => {
      setHasEcharts(Boolean(window.echarts));
    }, []);

    useEffect(() => {
      const element = chartRef.current;
      if (!element || !window.echarts || !chartOption) {
        // Chart lifecycle after Clear All:
        // the empty selected-player state removes the chart node, so dispose
        // the old ECharts instance before the next player selection creates a
        // fresh node for the rebuilt comparison.
        if (!chartOption && chartInstanceRef.current && !chartInstanceRef.current.isDisposed?.()) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
        return undefined;
      }
      const currentDom = chartInstanceRef.current?.getDom?.();
      if (chartInstanceRef.current && currentDom && currentDom !== element && !chartInstanceRef.current.isDisposed?.()) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
      const chart = chartInstanceRef.current && !chartInstanceRef.current.isDisposed?.()
        ? chartInstanceRef.current
        : window.echarts.init(element, null, { renderer: "svg" });
      chartInstanceRef.current = chart;
      chart.setOption(chartOption, true);
      const resizeObserver = typeof ResizeObserver === "function"
        ? new ResizeObserver(() => chart.resize())
        : null;
      resizeObserver?.observe(element);
      const handleResize = () => chart.resize();
      window.addEventListener("resize", handleResize, { passive: true });
      requestAnimationFrame(() => chart.resize());
      return () => {
        resizeObserver?.disconnect();
        window.removeEventListener("resize", handleResize);
      };
    }, [chartOption]);

    useEffect(() => () => {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed?.()) {
        chartInstanceRef.current.dispose();
      }
      chartInstanceRef.current = null;
    }, []);

    return h(
      "div",
      {
        className: "dh-compare-player-chart",
        style: { "--compare-player-color": getPlayerAccentColor(player, paletteIndex) },
        "data-player-chart": player.id,
      },
      h(PlayerChartHeader, { mode, player, weeklyStatKey, weeklyEdge }),
      mode === "season"
        ? h(SeasonRadarChart, { player, colorIndex: paletteIndex })
        : hasEcharts && chartOption
        ? h("div", {
          className: "dh-compare-chart",
          ref: chartRef,
          role: "img",
          "aria-label": `${getPlayerName(player)} weekly comparison chart`,
        })
        : h(ChartFallback, { mode: "weekly", selectedPlayers: [player], weeklyStatKey, seasonStatKeys: [] }),
    );
  }

  function ComparisonChart({ mode, selectedPlayers, weeklyStatKey, weeks, thresholds }) {
    const [isStackedLayout, setIsStackedLayout] = useState(() => window.matchMedia("(max-width: 719px)").matches);

    useEffect(() => {
      // Responsive chart treatment:
      // the stacked mobile pair uses the compact chart contract, including a
      // very shallow week axis on both charts. Desktop keeps its full axis.
      const mediaQuery = window.matchMedia("(max-width: 719px)");
      const handleChange = (event) => setIsStackedLayout(event.matches);
      setIsStackedLayout(mediaQuery.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      mediaQuery.addListener?.(handleChange);
      return () => mediaQuery.removeListener?.(handleChange);
    }, []);

    const weeklyEdges = useMemo(
      () => getWeeklyComparisonEdges(selectedPlayers, weeklyStatKey, weeks),
      [selectedPlayers, weeklyStatKey, weeks],
    );

    if (!selectedPlayers.length) {
      // Compare chart empty state: guide the first selection and explain the two-player requirement.
      return h(
        "section",
        { className: cx("dh-compare-chart-shell", mode === "season" && "dh-compare-chart-shell--season") },
        h(
          "div",
          { className: "dh-compare-empty" },
          h(
            "div",
            { className: "dh-compare-empty__panel" },
            h(EmptyCompareIcon, { className: "dh-compare-empty__icon" }),
            h("strong", null, "Select a player to get started"),
            h("span", null, "Select 2 players to compare"),
          ),
        ),
      );
    }

    return h(
      "section",
      { className: cx("dh-compare-chart-shell", mode === "season" && "dh-compare-chart-shell--season") },
      h(
        "div",
        {
          className: cx(
            "dh-compare-chart-grid",
            selectedPlayers.length === 1 && "dh-compare-chart-grid--single",
            mode === "season" && "dh-compare-chart-grid--season",
          ),
        },
        selectedPlayers.map((player, playerIndex) => h(PlayerChart, {
          key: player.id,
          mode,
          player,
          playerIndex,
          selectedPlayers,
          weeklyStatKey,
          weeks,
          thresholds,
          isCompact: isStackedLayout,
          showXAxis: true,
          weeklyEdge: weeklyEdges.get(player.id),
        })),
      ),
    );
  }

  function DataHubComparisonModal({ payload, onClose }) {
    const players = payload?.players || [];
    const weeks = payload?.weeks || [];
    const thresholds = payload?.thresholds || {};
    const playersById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);
    const [selectedIds, setSelectedIds] = useState(() => getInitialSelectedIds(payload));
    const [mode, setMode] = useState(payload?.defaults?.mode || "weekly");
    const [weeklyStatKey, setWeeklyStatKey] = useState(payload?.defaults?.weeklyStat || "fpts");
    const [query, setQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(true);
    const [isStatOpen, setIsStatOpen] = useState(false);
    const [positionFilter, setPositionFilter] = useState("all");
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const searchInputRef = useRef(null);
    const searchShellRef = useRef(null);
    const statShellRef = useRef(null);
    const dialogRef = useRef(null);
    const selectedPlayers = useMemo(() => getSelectedPlayers(playersById, selectedIds), [playersById, selectedIds]);
    const weeklyStatOptions = useMemo(() => getWeeklyStatOptions(selectedPlayers, thresholds), [selectedPlayers, thresholds]);
    const searchResults = useMemo(
      () => getSearchResults(players, query, selectedIds, positionFilter),
      [players, positionFilter, query, selectedIds],
    );
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const isAtMax = selectedIds.length >= MAX_COMPARISON_PLAYERS;
    const selectedPosition = getComparisonPosition(selectedPlayers);
    const summaryStatKey = mode === "weekly" ? weeklyStatKey : "fpts";
    const focusDialogWithoutKeyboard = () => {
      requestAnimationFrame(() => dialogRef.current?.focus?.({ preventScroll: true }));
    };

    useEffect(() => {
      setSelectedIds(getInitialSelectedIds(payload));
      setMode(payload?.defaults?.mode || "weekly");
      setWeeklyStatKey(payload?.defaults?.weeklyStat || "fpts");
      setQuery("");
      setIsSearchOpen(true);
      setIsStatOpen(false);
      setPositionFilter("all");
      setActiveOptionIndex(0);
    }, [payload?.revision]);

    useEffect(() => {
      if (!weeklyStatOptions.some((option) => option.key === weeklyStatKey)) {
        setWeeklyStatKey(getFallbackWeeklyStat(weeklyStatOptions).key);
      }
    }, [weeklyStatKey, weeklyStatOptions]);

    useEffect(() => {
      // DataHub comparison initial focus:
      // keep the selector expanded without focusing its search input. This
      // gives keyboard users a modal focus target while preventing mobile
      // browsers from opening the software keyboard until search is tapped.
      const frame = requestAnimationFrame(() => dialogRef.current?.focus?.({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
      const handleKeydown = (event) => {
        if (event.key !== "Escape") {
          return;
        }
        if (isStatOpen) {
          setIsStatOpen(false);
          return;
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
          return;
        }
        onClose();
      };
      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    }, [isSearchOpen, isStatOpen, onClose]);

    useEffect(() => {
      // Heading dropdown outside-close:
      // close the player menu whenever the pointer lands outside the actual
      // search/dropdown shell. The broader selector also contains chips and
      // stat controls, so using it here left too many tappable areas open.
      const handlePointerDown = (event) => {
        const target = event.target;
        if (isSearchOpen && searchShellRef.current && !searchShellRef.current.contains(target)) {
          setIsSearchOpen(false);
        }
        if (isStatOpen && statShellRef.current && !statShellRef.current.contains(target)) {
          setIsStatOpen(false);
        }
      };
      document.addEventListener("pointerdown", handlePointerDown, true);
      return () => document.removeEventListener("pointerdown", handlePointerDown, true);
    }, [isSearchOpen, isStatOpen]);

    useEffect(() => {
      setActiveOptionIndex(0);
    }, [positionFilter, query]);

    const removePlayer = (playerId) => {
      setSelectedIds((current) => current.filter((id) => id !== playerId));
    };

    const clearAllPlayers = () => {
      // Heading player selector:
      // reset the active comparison without closing the menu so the next
      // selected player immediately repopulates summaries and chart data.
      setSelectedIds([]);
      setWeeklyStatKey("fpts");
      setQuery("");
      setActiveOptionIndex(0);
      setIsSearchOpen(true);
    };

    const togglePlayer = (playerId) => {
      const isSelected = selectedSet.has(playerId);
      const addingFromEmptySelection = !isSelected && selectedIds.length === 0;
      if (addingFromEmptySelection) {
        // Clear-all recovery:
        // ensure the rebuilt comparison starts from a threshold-backed stat so
        // charts repopulate immediately when the next player is selected.
        setWeeklyStatKey("fpts");
      }
      if (isSelected) {
        setSelectedIds(selectedIds.filter((id) => id !== playerId));
      } else if (selectedIds.length < MAX_COMPARISON_PLAYERS) {
        const nextSelectedIds = [...selectedIds, playerId];
        setSelectedIds(nextSelectedIds);
        // Player selector completion:
        // leave the menu open after player one, then collapse it immediately
        // when the head-to-head reaches its two-player limit.
        setIsSearchOpen(nextSelectedIds.length < MAX_COMPARISON_PLAYERS);
        if (nextSelectedIds.length === MAX_COMPARISON_PLAYERS) {
          focusDialogWithoutKeyboard();
        }
      }
      setQuery("");
      setActiveOptionIndex(0);
    };

    const handleInputKeydown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setIsSearchOpen(true);
        setActiveOptionIndex((index) => Math.min(index + 1, Math.max(0, searchResults.length - 1)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveOptionIndex((index) => Math.max(0, index - 1));
        return;
      }
      if (event.key === "Enter" && isSearchOpen) {
        event.preventDefault();
        const player = searchResults[activeOptionIndex];
        if (!player || (!selectedSet.has(player.id) && isAtMax)) {
          return;
        }
        togglePlayer(player.id);
        return;
      }
      if (event.key === "Backspace" && !query && selectedIds.length) {
        removePlayer(selectedIds[selectedIds.length - 1]);
      }
    };

    return h(
      "div",
      { className: "dh-compare-modal" },
      // DataHub comparison backdrop:
      // closes only this lazy React modal and leaves the existing DataHub chart
      // and game-log modal event wiring untouched.
      h("div", { className: "dh-compare-modal__overlay", "aria-hidden": "true", onMouseDown: onClose }),
      h(
        "section",
        {
          className: "dh-compare-modal__dialog",
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "dh-compare-title",
          tabIndex: -1,
          onMouseDown: (event) => event.stopPropagation(),
        },
        h(
          "header",
          { className: "dh-compare-header" },
          h(
            "div",
            { className: "dh-compare-heading" },
            h(
              "div",
              { className: "dh-compare-eyebrow-row" },
              h("span", { className: "dh-compare-eyebrow" }, "PLAYER COMPARISON"),
              h("span", { className: "dh-compare-beta" }, "BETA"),
            ),
            h("h2", { id: "dh-compare-title" }, mode === "season" ? "Season Radar" : "Weekly Single-Stat"),
          ),
          h(
            "div",
            { className: "dh-compare-header__actions" },
            h(
              "div",
              { className: "dh-compare-mode-group", role: "group", "aria-label": "Comparison mode" },
              h(ModeButton, { value: "weekly", active: mode === "weekly", onSelect: setMode }, "Weekly"),
              h(ModeButton, { value: "season", active: mode === "season", onSelect: setMode }, "Season"),
            ),
            h(
              "button",
              {
                type: "button",
                className: "dh-compare-close",
                "aria-label": "Close comparison",
                onClick: onClose,
              },
              "×",
            ),
          ),
          h(
            "div",
            { className: "dh-compare-selector" },
            h(
              "div",
              { className: "dh-compare-selected", "aria-label": "Selected players" },
              selectedPlayers.map((player, index) => h(PlayerChip, {
                key: player.id,
                player,
                index,
                onRemove: removePlayer,
              })),
            ),
            h(
              "div",
              { className: "dh-compare-control-row" },
              mode === "weekly"
                ? h(StatDropdown, {
                  options: weeklyStatOptions,
                  activeKey: weeklyStatKey,
                  isOpen: isStatOpen,
                  onOpenChange: setIsStatOpen,
                  onSelect: setWeeklyStatKey,
                  shellRef: statShellRef,
                })
                : h(
                  "div",
                  { className: "dh-compare-season-context" },
                  selectedPosition
                    ? `${selectedPosition} radar`
                    : (selectedPlayers.length ? "Per-position" : "Select players"),
              ),
              h(
                "div",
                { className: "dh-compare-search", ref: searchShellRef },
                isSearchOpen
                  ? [
                    h(SearchIcon, { key: "search-icon", className: "dh-compare-search__icon" }),
                    h("input", {
                      key: "search-input",
                      ref: searchInputRef,
                      className: "dh-compare-search__input",
                      type: "search",
                      placeholder: "Search players...",
                      value: query,
                      "aria-label": "Search players to compare",
                      "aria-expanded": "true",
                      "aria-controls": "dh-compare-search-results",
                      autoComplete: "off",
                      onFocus: () => setIsSearchOpen(true),
                      onChange: (event) => {
                        setQuery(event.target.value);
                        setIsSearchOpen(true);
                      },
                      onKeyDown: handleInputKeydown,
                    }),
                    h(
                      "button",
                      {
                        key: "search-toggle",
                        type: "button",
                        className: "dh-compare-search__toggle is-open",
                        "aria-label": "Close player search results",
                        "aria-controls": "dh-compare-search-results",
                        "aria-expanded": "true",
                        // Player-search close control:
                        // pointer-down stays on the button and never transfers
                        // focus to the input, avoiding an accidental keyboard.
                        onPointerDown: (event) => event.preventDefault(),
                        onClick: () => {
                          setIsSearchOpen(false);
                          focusDialogWithoutKeyboard();
                        },
                      },
                      h(ChevronDownIcon, { className: "dh-compare-search__chevron" }),
                    ),
                  ]
                  : h(
                    "button",
                    {
                      type: "button",
                      className: "dh-compare-search__launcher",
                      "aria-haspopup": "listbox",
                      "aria-expanded": "false",
                      "aria-controls": "dh-compare-search-results",
                      onClick: () => {
                        // Closed player-selector launcher:
                        // reveal the current search/toggle UI but preserve
                        // button focus until the user explicitly taps search.
                        setIsSearchOpen(true);
                        setIsStatOpen(false);
                        focusDialogWithoutKeyboard();
                      },
                    },
                    h(SearchIcon, { className: "dh-compare-search__launcher-icon" }),
                    h("span", { className: "dh-compare-search__launcher-label" }, "Player Select / Search"),
                    h(ChevronDownIcon, { className: "dh-compare-search__launcher-chevron" }),
                  ),
                isSearchOpen
                  ? h(
                    "div",
                    {
                      id: "dh-compare-search-results",
                      className: "dh-compare-search__menu",
                      role: "listbox",
                      "aria-label": "Player search results",
                    },
                    h(PositionFilters, {
                      activeFilter: positionFilter,
                      onFilterChange: setPositionFilter,
                      selectedCount: selectedIds.length,
                      onClearAll: clearAllPlayers,
                      onClose: () => {
                        setIsSearchOpen(false);
                        focusDialogWithoutKeyboard();
                      },
                    }),
                    searchResults.length
                      ? h(
                        "div",
                        { className: "dh-compare-search__results" },
                        searchResults.map((player, index) => {
                          const selected = selectedSet.has(player.id);
                          const disabled = !selected && isAtMax;
                          return h(PlayerSearchOption, {
                            key: player.id,
                            player,
                            selected,
                            disabled,
                            active: index === activeOptionIndex,
                            onToggle: togglePlayer,
                          });
                        }),
                      )
                      : h("div", { className: "dh-compare-search__empty" }, "No matching players"),
                    isAtMax
                      ? h("div", { className: "dh-compare-search__limit" }, `Max ${MAX_COMPARISON_PLAYERS} active players`)
                      : null,
                  )
                  : null,
              ),
            ),
          ),
        ),
        h(
          "section",
          { className: "dh-compare-summary-grid", "aria-label": "Selected stat summary" },
          selectedPlayers.map((player, index) => h(SummaryCard, {
            key: player.id,
            player,
            playerIndex: getPlayerPaletteIndex(selectedPlayers, index),
            statKey: summaryStatKey,
          })),
        ),
        h(
          "main",
          { className: "dh-compare-body" },
          h(ComparisonChart, {
            mode,
            selectedPlayers,
            weeklyStatKey,
            weeks,
            thresholds,
          }),
        ),
      ),
    );
  }

  return DataHubComparisonModal;
}
