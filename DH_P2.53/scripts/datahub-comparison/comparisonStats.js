// DataHub comparison stat contract:
// this module is loaded only with the lazy React comparison island. It keeps
// stat labels, threshold semantics, player colors, and radar bundles out of
// the main DataHub page startup path.
// Comparison selection limit:
// keep the modal intentionally focused on a direct head-to-head so each
// player can own a dedicated chart at every responsive breakpoint.
export const MAX_COMPARISON_PLAYERS = 2;

export const COMPARISON_POSITION_TONES = Object.freeze({
  QB: "#ff7a8f",
  RB: "#34f0cc",
  WR: "#67a7ff",
  TE: "#bf7cff",
});

export const COMPARISON_GRADIENT_PALETTES = Object.freeze({
  QB: Object.freeze([
    Object.freeze({ low: "#FFA947", lowMid: "#FF916B", highMid: "#FF666B", high: "#F94095" }),
    Object.freeze({ low: "#00DDFA", lowMid: "#7866FF", highMid: "#D747FF", high: "#FF0AA5" }),
  ]),
  RB: Object.freeze([
    Object.freeze({ low: "#004CFF", lowMid: "#00B3FF", highMid: "#00EDFF", high: "#00FFCB" }),
    Object.freeze({ low: "#BE0AFF", lowMid: "#3700FF", highMid: "#00FF91", high: "#2EFF6D" }),
  ]),
  WR: Object.freeze([
    Object.freeze({ low: "#5300FF", lowMid: "#4947FF", highMid: "#0066FF", high: "#0099FF" }),
    Object.freeze({ low: "#FF0AA5", lowMid: "#D747FF", highMid: "#8766FF", high: "#00DDFA" }),
  ]),
  TE: Object.freeze([
    Object.freeze({ low: "#FF0088", lowMid: "#D400FF", highMid: "#5D00FF", high: "#4C00FF" }),
    Object.freeze({ low: "#FF666B", lowMid: "#FF94C2", highMid: "#AD3EAC", high: "#8838FF" }),
  ]),
});

export const COMPARISON_PLAYER_FALLBACK_COLORS = Object.freeze([
  "#72efff",
  "#d97dff",
  "#66fccc",
]);

export const COMPARISON_LOWER_IS_BETTER = Object.freeze({
  QB: Object.freeze(["ttt", "prs_pct", "pass_sack", "pass_int"]),
});

export const COMPARISON_RADAR_MAX_RANK_BY_POS = Object.freeze({
  QB: 36,
  RB: 48,
  WR: 72,
  TE: 24,
});

// Season comparison radar bundles:
// choose one shared, clockwise stat set for the matchup, starting with FPTS.
// Only QB/QB and RB/RB have new position-specific sets. Other matchups retain
// the original comparison stats, with TGT replacing OPP in the skill set.
// These bundles are independent of both Game Logs and the weekly stat menu.
export const COMPARISON_RADAR_BUNDLES = Object.freeze({
  QB: Object.freeze([
    "fpts",
    "ceiling",
    "csty_pct",
    "cmp_pct",
    "pass_rtg",
    "epa_per_db",
    "cpoe",
    "ttt",
    "rush_td",
    "rush_yd",
    "yds_total",
    "ppg",
  ]),
  RB: Object.freeze([
    "fpts",
    "ceiling",
    "csty_pct",
    "snp_pct",
    "ypc",
    "mtf_per_att",
    "yco_per_att",
    "expl_ru_pct",
    "ts_per_rr",
    "imp",
    "yds_total",
    "ppg",
  ]),
  QB_MIXED: Object.freeze([
    "fpts",
    "ppg",
    "yds_total",
    "imp",
    "csty_pct",
    "ceiling",
    "rush_att",
    "rush_yd",
    "rush_td",
    "ypc",
    "snp_pct",
    "imp_per_g",
  ]),
  SKILL: Object.freeze([
    "fpts",
    "ppg",
    "yds_total",
    "imp",
    "rec_tgt",
    "ts_per_rr",
    "rec",
    "yprr",
    "rec_yar",
    "snp_pct",
    "csty_pct",
    "ceiling",
  ]),
});

const COMPARISON_WEEKLY_STATS_BY_POS = Object.freeze({
  QB: Object.freeze([
    "fpts",
    "pass_att",
    "pass_cmp",
    "cmp_pct",
    "pass_yd",
    "pass_td",
    "pass_fd",
    "pass_int",
    "pass_sack",
    "pass_rtg",
    "epa_per_db",
    "cpoe",
    "ttt",
    "prs_pct",
    "rush_att",
    "rush_yd",
    "rush_td",
    "rush_fd",
    "ypc",
    "rush_yac",
    "yco_per_att",
    "mtf",
    "mtf_per_att",
    "snp_pct",
    "yds_total",
    "imp",
    "imp_per_g",
    "fpoe",
    "csty_pct",
    "ceiling",
  ]),
  RB: Object.freeze([
    "fpts",
    "rush_att",
    "rush_yd",
    "rush_td",
    "rush_fd",
    "ypc",
    "rush_yac",
    "yco_per_att",
    "mtf",
    "mtf_per_att",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rec_fd",
    "rec_yar",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "yds_total",
    "imp",
    "opp",
    "imp_per_g",
    "fpoe",
    "csty_pct",
    "ceiling",
  ]),
  WR: Object.freeze([
    "fpts",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rec_fd",
    "rec_yar",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "yds_total",
    "imp",
    "opp",
    "imp_per_g",
    "fpoe",
    "csty_pct",
    "ceiling",
  ]),
  TE: Object.freeze([
    "fpts",
    "rec_tgt",
    "rec",
    "rec_yd",
    "rec_td",
    "rec_fd",
    "rec_yar",
    "rr",
    "ypr",
    "yprr",
    "ts_per_rr",
    "first_down_rec_rate",
    "snp_pct",
    "yds_total",
    "imp",
    "opp",
    "imp_per_g",
    "fpoe",
    "csty_pct",
    "ceiling",
  ]),
});

const STAT_DEFINITIONS = Object.freeze({
  fpts: Object.freeze({ key: "fpts", label: "FPTS", unit: "pts", decimals: 1 }),
  ppg: Object.freeze({ key: "ppg", label: "PPG", unit: "pts", decimals: 1 }),
  games_played: Object.freeze({ key: "games_played", label: "G", decimals: 0 }),
  snp_pct: Object.freeze({ key: "snp_pct", label: "SNP%", unit: "%", decimals: 1, percent: true }),
  yds_total: Object.freeze({ key: "yds_total", label: "YDS(t)", decimals: 0 }),
  imp: Object.freeze({ key: "imp", label: "IMP", decimals: 0 }),
  opp: Object.freeze({ key: "opp", label: "OPP", decimals: 0 }),
  imp_per_g: Object.freeze({ key: "imp_per_g", label: "IMP/G", decimals: 2 }),
  fpoe: Object.freeze({ key: "fpoe", label: "FPOE", decimals: 1, signed: true }),
  csty_pct: Object.freeze({ key: "csty_pct", label: "CSTY%", unit: "%", decimals: 1, percent: true }),
  ceiling: Object.freeze({ key: "ceiling", label: "CL", decimals: 1 }),
  pass_att: Object.freeze({ key: "pass_att", label: "paATT", decimals: 0 }),
  pass_cmp: Object.freeze({ key: "pass_cmp", label: "CMP", decimals: 0 }),
  cmp_pct: Object.freeze({ key: "cmp_pct", label: "CMP%", unit: "%", decimals: 1, percent: true }),
  pass_yd: Object.freeze({ key: "pass_yd", label: "paYDS", decimals: 0 }),
  pass_td: Object.freeze({ key: "pass_td", label: "paTD", decimals: 0 }),
  pass_fd: Object.freeze({ key: "pass_fd", label: "pa1D", decimals: 0 }),
  pass_int: Object.freeze({ key: "pass_int", label: "INT", decimals: 0 }),
  pass_sack: Object.freeze({ key: "pass_sack", label: "SAC", decimals: 0 }),
  pass_rtg: Object.freeze({ key: "pass_rtg", label: "paRTG", decimals: 1 }),
  pa_ypg: Object.freeze({ key: "pa_ypg", label: "paYPG", decimals: 1 }),
  epa_per_db: Object.freeze({ key: "epa_per_db", label: "EPA/DB", decimals: 2, signed: true }),
  cpoe: Object.freeze({ key: "cpoe", label: "CPOE", unit: "%", decimals: 1, percent: true, signed: true }),
  ttt: Object.freeze({ key: "ttt", label: "TTT", unit: "s", decimals: 2 }),
  prs_pct: Object.freeze({ key: "prs_pct", label: "PRS%", unit: "%", decimals: 1, percent: true }),
  rush_att: Object.freeze({ key: "rush_att", label: "CAR", decimals: 0 }),
  rush_yd: Object.freeze({ key: "rush_yd", label: "ruYDS", decimals: 0 }),
  rush_td: Object.freeze({ key: "rush_td", label: "ruTD", decimals: 0 }),
  rush_fd: Object.freeze({ key: "rush_fd", label: "ru1D", decimals: 0 }),
  ypc: Object.freeze({ key: "ypc", label: "YPC", decimals: 2 }),
  rush_yac: Object.freeze({ key: "rush_yac", label: "YCO", decimals: 0 }),
  yco_per_att: Object.freeze({ key: "yco_per_att", label: "YCO/A", decimals: 2 }),
  mtf: Object.freeze({ key: "mtf", label: "MTF", decimals: 0 }),
  mtf_per_att: Object.freeze({ key: "mtf_per_att", label: "MTF/A", decimals: 2 }),
  expl_ru_pct: Object.freeze({ key: "expl_ru_pct", label: "EXPLSV%", unit: "%", decimals: 2, percent: true }),
  rec_tgt: Object.freeze({ key: "rec_tgt", label: "TGT", decimals: 0 }),
  rec: Object.freeze({ key: "rec", label: "REC", decimals: 0 }),
  rec_yd: Object.freeze({ key: "rec_yd", label: "recYDS", decimals: 0 }),
  rec_td: Object.freeze({ key: "rec_td", label: "recTD", decimals: 0 }),
  rec_fd: Object.freeze({ key: "rec_fd", label: "rec1D", decimals: 0 }),
  rec_yar: Object.freeze({ key: "rec_yar", label: "YAC", decimals: 0 }),
  rec_ypg: Object.freeze({ key: "rec_ypg", label: "recYPG", decimals: 1 }),
  rr: Object.freeze({ key: "rr", label: "RR", decimals: 0 }),
  ypr: Object.freeze({ key: "ypr", label: "YPR", decimals: 2 }),
  yprr: Object.freeze({ key: "yprr", label: "YPRR", decimals: 2 }),
  ts_per_rr: Object.freeze({ key: "ts_per_rr", label: "TS%", unit: "%", decimals: 1, percent: true }),
  first_down_rec_rate: Object.freeze({ key: "first_down_rec_rate", label: "1DRR", decimals: 2 }),
});

export const COMPARISON_STAT_DEFINITIONS = STAT_DEFINITIONS;

function uniqueStatKeys(keys) {
  return Array.from(new Set(keys)).filter((key) => STAT_DEFINITIONS[key]);
}

export function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export function getStatDefinition(key) {
  return STAT_DEFINITIONS[key] || Object.freeze({ key, label: String(key || "").toUpperCase(), decimals: 1 });
}

export function getStatLabel(key) {
  return getStatDefinition(key).label;
}

export function getPlayerName(player) {
  return player?.name || player?.fullName || "Player";
}

export function getComparisonPositions(players) {
  return Array.from(new Set(
    (players || [])
      .map((player) => String(player?.pos || "").trim().toUpperCase())
      .filter(Boolean),
  ));
}

export function getComparisonPosition(players) {
  const positions = getComparisonPositions(players);
  return positions.length === 1 ? positions[0] : "";
}

export function isLowerBetterForPosition(pos, statKey) {
  const keys = COMPARISON_LOWER_IS_BETTER[String(pos || "").toUpperCase()] || [];
  return keys.includes(statKey);
}

export function getWeeklyComparisonEdges(players, statKey, weeks) {
  // Weekly head-to-head score:
  // count only weeks where both selected players recorded a valid value for
  // the active stat. Skipped/non-played weeks and ties do not add a better week.
  if (!Array.isArray(players) || players.length !== 2) {
    return new Map();
  }
  const safeWeeks = Array.isArray(weeks) && weeks.length
    ? weeks
    : Array.from({ length: 18 }, (_, index) => index + 1);
  const lowerBetter = players.every((player) => isLowerBetterForPosition(player.pos, statKey));
  const results = players.map((player) => ({ playerId: player.id, betterWeeks: 0, compared: 0 }));

  safeWeeks.forEach((week) => {
    const values = players.map((player) => {
      const entry = (player.weeklySeries || []).find((candidate) => Number(candidate?.week) === Number(week));
      if (!entry || entry.isSkipped || entry.skipped || !(entry.isPlayed || entry.played)) {
        return null;
      }
      return toFiniteNumber(entry?.stats?.[statKey]);
    });
    if (values.some((value) => value === null)) {
      return;
    }
    results.forEach((result) => {
      result.compared += 1;
    });
    if (values[0] === values[1]) {
      return;
    }
    const betterValueIndex = lowerBetter
      ? (values[0] < values[1] ? 0 : 1)
      : (values[0] > values[1] ? 0 : 1);
    results[betterValueIndex].betterWeeks += 1;
  });

  const [first, second] = results;
  first.status = first.betterWeeks === second.betterWeeks ? "even" : (first.betterWeeks > second.betterWeeks ? "ahead" : "behind");
  second.status = first.betterWeeks === second.betterWeeks ? "even" : (second.betterWeeks > first.betterWeeks ? "ahead" : "behind");
  return new Map(results.map((result) => [result.playerId, result]));
}

export function getThresholdConfig(thresholds, pos, statKey) {
  return thresholds?.[String(pos || "").toUpperCase()]?.[statKey] || null;
}

export function getWeeklyStatOptions(players, thresholds) {
  const positions = getComparisonPositions(players);
  if (!positions.length) {
    return [STAT_DEFINITIONS.fpts];
  }
  const sourcePositions = positions.length ? positions : ["QB", "RB", "WR", "TE"];
  const statSets = sourcePositions
    .map((pos) => {
      const allowed = COMPARISON_WEEKLY_STATS_BY_POS[pos]
        ? new Set(COMPARISON_WEEKLY_STATS_BY_POS[pos])
        : null;
      return Object.keys(thresholds?.[pos] || {})
        .filter((key) => !allowed || allowed.has(key));
    })
    .filter((keys) => keys.length);

  if (!statSets.length) {
    return [STAT_DEFINITIONS.fpts];
  }

  const sharedKeys = statSets.length === 1
    ? statSets[0]
    : statSets.reduce((shared, keys) => shared.filter((key) => keys.includes(key)));
  const ordered = ["fpts", ...sharedKeys.filter((key) => key !== "fpts")];
  return uniqueStatKeys(ordered).map((key) => STAT_DEFINITIONS[key]);
}

export function getSeasonStatKeys(players) {
  // Resolve from the entire selection so both radars use identical axes,
  // regardless of selection order. A lone QB/RB previews its same-position set.
  const positions = getComparisonPositions(players);
  if (!positions.length) return [];
  const position = getComparisonPosition(players);
  const bundle = position === "QB" || position === "RB"
    ? COMPARISON_RADAR_BUNDLES[position]
    : positions.includes("QB")
      ? COMPARISON_RADAR_BUNDLES.QB_MIXED
      : COMPARISON_RADAR_BUNDLES.SKILL;
  return uniqueStatKeys(bundle);
}

export function getPlayerPalette(player, playerIndex) {
  const pos = String(player?.pos || "").toUpperCase();
  const palettes = COMPARISON_GRADIENT_PALETTES[pos] || null;
  if (!palettes) {
    const fallback = COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length];
    return { low: fallback, lowMid: fallback, highMid: fallback, high: fallback };
  }
  if (playerIndex < 2) {
    return palettes[playerIndex];
  }
  const base = palettes[playerIndex % 2];
  return {
    low: base.lowMid,
    lowMid: base.highMid,
    highMid: base.high,
    high: COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length],
  };
}

export function getPlayerAccentColor(player, playerIndex) {
  return getPlayerPalette(player, playerIndex).high || COMPARISON_PLAYER_FALLBACK_COLORS[playerIndex % COMPARISON_PLAYER_FALLBACK_COLORS.length];
}

export function getRadarRankValue(rank, pos) {
  const numericRank = toFiniteNumber(rank);
  const maxRank = COMPARISON_RADAR_MAX_RANK_BY_POS[String(pos || "").toUpperCase()] || 72;
  if (numericRank === null || numericRank <= 0) {
    return 10;
  }
  if (numericRank <= 1) {
    return 85;
  }
  if (numericRank >= maxRank) {
    return 10;
  }
  if (numericRank <= 7) {
    return 85 - (((numericRank - 1) / 6) * 12);
  }
  return 73 - (((numericRank - 7) / Math.max(1, maxRank - 7)) * 63);
}

export function getComparisonRankColor(rank, position) {
  const numericRank = toFiniteNumber(rank);
  if (numericRank === null || numericRank <= 0) {
    return "#767693";
  }
  const pos = String(position || "").trim().toUpperCase();
  const thresholds = pos === "WR"
    ? [
      { value: 12, color: "#51cba5" },
      { value: 24, color: "#34aabf" },
      { value: 36, color: "#4798fc" },
      { value: 48, color: "#957cff" },
      { value: 60, color: "#ff6fe1" },
      { value: 72, color: "#ff2eb9" },
    ]
    : [
      { value: 8, color: "#51cba5" },
      { value: 16, color: "#34aabf" },
      { value: 24, color: "#4798fc" },
      { value: 32, color: "#957cff" },
      { value: 44, color: "#ff6fe1" },
      { value: 60, color: "#ff2eb2" },
    ];
  return thresholds.find((entry) => numericRank <= entry.value)?.color || "#767693";
}

export function getOrdinalSuffix(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "";
  }
  const absoluteValue = Math.abs(Math.round(numericValue));
  const tens = absoluteValue % 100;
  if (tens >= 11 && tens <= 13) {
    return "th";
  }
  const ones = absoluteValue % 10;
  if (ones === 1) return "st";
  if (ones === 2) return "nd";
  if (ones === 3) return "rd";
  return "th";
}

export function normalizePlayerSearchText(player) {
  return [
    player?.name,
    player?.fullName,
    player?.pos,
    player?.team,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatRank(rank, prefix = "") {
  const numericRank = toFiniteNumber(rank);
  if (numericRank === null || numericRank <= 0) {
    return "NA";
  }
  return `${prefix}${Math.round(numericRank)}`;
}

export function formatComparisonValue(key, value, options = {}) {
  const { compact = false, decimals: decimalsOverride = null } = options;
  const definition = getStatDefinition(key);
  const numberValue = toFiniteNumber(value);
  if (numberValue === null) {
    return "NA";
  }

  // Comparison summary averages:
  // callers can preserve a meaningful decimal for per-week averages of
  // counting stats without changing the normal whole-number stat display.
  const defaultDecimals = Number.isFinite(definition.decimals) ? definition.decimals : 1;
  const decimals = Number.isFinite(decimalsOverride)
    ? Math.max(0, Math.floor(decimalsOverride))
    : defaultDecimals;
  let text;
  if (compact && Math.abs(numberValue) >= 1000) {
    text = `${(numberValue / 1000).toFixed(Math.abs(numberValue) >= 10000 ? 0 : 1)}k`;
  } else if (decimals === 0) {
    text = `${Math.round(numberValue)}`;
  } else {
    // FPTS display:
    // keep the required trailing decimal for fantasy points, while preserving
    // compact no-trailing-zero formatting for the rest of the comparison stats.
    const fixedText = numberValue.toFixed(decimals);
    text = definition.key === "fpts" ? fixedText : fixedText.replace(/\.0+$/, "");
  }

  if (definition.signed && numberValue > 0) {
    text = `+${text}`;
  }
  if (definition.unit === "%" && !text.endsWith("%")) {
    text = `${text}%`;
  } else if (definition.unit && definition.unit !== "%" && !compact) {
    text = `${text} ${definition.unit}`;
  }
  return text;
}
