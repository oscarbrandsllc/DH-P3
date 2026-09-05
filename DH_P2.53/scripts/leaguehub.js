(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'leaguehub') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialUsername = params.get('username');
    const initialLeagueId = params.get('leagueId');

    const elements = {
      usernameInput: document.getElementById('usernameInput'),
      leagueSelect: document.getElementById('leagueSelect'),
      loading: document.getElementById('loading'),
      analysisTab: document.getElementById('leagueAnalysisTab'),
      tradesTab: document.getElementById('leagueTradesTab'),
      tabButtons: document.querySelectorAll('.leaguehub-tab-button'),
      analysisPanel: document.getElementById('leagueAnalysisPanel'),
      tradesPanel: document.getElementById('leagueTradesPanel'),
      tradeToolbar: document.getElementById('leagueTradesToolbar'),
      heroPill: document.getElementById('leagueHubHeroPill'),
      heroHeading: document.getElementById('analyzer-hero-heading'),
      heroUsername: document.getElementById('leagueHubHeroUsername'),
      changeUserButton: document.getElementById('leagueHubChangeUserButton'),
      summaryStats: document.getElementById('summaryStats'),
      content: document.getElementById('infographicContent'),
      lineupToggle: document.querySelectorAll('#lineup-panel .toggle-option'),
      radarToggle: document.querySelectorAll('#radar-panel .toggle-option'),
      startersCanvas: document.getElementById('startersValueChart'),
      overallCanvas: document.getElementById('overallValueChart'),
      radarCanvas: document.getElementById('radarChart'),
      standingsTable: document.getElementById('analyzerStandingsTable'),
      standingsFrozenTable: document.getElementById('analyzerStandingsFrozenTable'),
      standingsBody: document.getElementById('standingsTableBody'),
      standingsFrozenBody: document.getElementById('standingsFrozenBody'),
      leaderboardBody: document.getElementById('leaderboardTableBody'),
      leaderboardFilters: document.querySelectorAll('.analyzer-filter-group .filter-chip'),
      tradesStatus: document.getElementById('leagueTradesStatus'),
      tradesEmptyState: document.getElementById('leagueTradesEmptyState'),
      tradesAnalytics: document.getElementById('leagueTradesAnalytics'),
      tradesSummaryCards: document.getElementById('leagueTradesSummaryCards'),
      tradesAnalysisHeading: document.getElementById('leagueTradesAnalysisHeading'),
      tradesAnalysisSubheading: document.getElementById('leagueTradesAnalysisSubheading'),
      tradesAnalysisTable: document.getElementById('leagueTradesAnalysisTable'),
      tradesAnalysisHead: document.getElementById('leagueTradesAnalysisHead'),
      tradesAnalysisBody: document.getElementById('leagueTradesAnalysisBody'),
      tradesMobileTable: document.getElementById('leagueTradesMobileTable'),
      tradesMobileFrozenTable: document.getElementById('leagueTradesMobileFrozenTable'),
      tradesMobileFrozenHead: document.getElementById('leagueTradesMobileFrozenHead'),
      tradesMobileFrozenBody: document.getElementById('leagueTradesMobileFrozenBody'),
      tradesMobileScrollTable: document.getElementById('leagueTradesMobileScrollTable'),
      tradesMobileScrollHead: document.getElementById('leagueTradesMobileScrollHead'),
      tradesMobileScrollBody: document.getElementById('leagueTradesMobileScrollBody'),
      tradesFeed: document.getElementById('leagueTradesFeed'),
      tradesFeedMeta: document.getElementById('leagueTradesFeedMeta'),
      tradesSearchInput: document.getElementById('leagueTradesSearch'),
      tradeSelects: {
        member: {
          control: document.getElementById('leagueTradesMemberButton')?.closest('.leaguehub-trades-control'),
          button: document.getElementById('leagueTradesMemberButton'),
          value: document.getElementById('leagueTradesMemberValue'),
          menu: document.getElementById('leagueTradesMemberMenu'),
        },
        season: {
          control: document.getElementById('leagueTradesSeasonButton')?.closest('.leaguehub-trades-control'),
          button: document.getElementById('leagueTradesSeasonButton'),
          value: document.getElementById('leagueTradesSeasonValue'),
          menu: document.getElementById('leagueTradesSeasonMenu'),
        },
        asset: {
          control: document.getElementById('leagueTradesAssetButton')?.closest('.leaguehub-trades-control'),
          button: document.getElementById('leagueTradesAssetButton'),
          value: document.getElementById('leagueTradesAssetValue'),
          menu: document.getElementById('leagueTradesAssetMenu'),
        },
      },
    };

    const SLOT_ORDER = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
    const SLOT_LABELS = {
      QB: 'QB',
      RB: 'RB',
      WR: 'WR',
      TE: 'TE',
      FLEX: 'FLX',
      SUPER_FLEX: 'SFLX',
      Picks: 'Draft Picks',
    };

    const SLOT_ALIASES = {
      'WR/RB': 'FLEX',
      'RB/WR': 'FLEX',
      'WR/RB/TE': 'FLEX',
      'RB/WR/TE': 'FLEX',
      'W/R/T': 'FLEX',
      'FLEX': 'FLEX',
      'SUPER_FLEX': 'SUPER_FLEX',
      'QB/RB/WR/TE': 'SUPER_FLEX',
      'Q/W/R/T': 'SUPER_FLEX',
    };

    const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE'];

    const LINEUP_VALUE_COLORS = {
      QB: '#15607a',
      RB: '#0c8184',
      WR: '#0da0a4',
      TE: '#09bb9f',
      FLEX: '#2ad2a0',
      SUPER_FLEX: '#37ebb5',
    };

    const LINEUP_PPG_COLORS = {
      QB: '#003c63',
      RB: '#005d91',
      WR: '#006da2',
      TE: '#007bb4',
      FLEX: '#008cd1',
      SUPER_FLEX: '#00a3ff',
    };

    const OVERALL_VALUE_COLORS = {
      QB: '#3700B3',
      RB: '#4c02de',
      WR: '#6300ff',
      TE: '#7100ff',
      FLEX: '#8700ff',
      Picks: '#9400ff',
    };

    const RADAR_SLOT_TYPES = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
    const RADAR_FLEX_ELIGIBLE = ['RB', 'WR', 'TE'];
    const TRADE_FETCH_LEGS = Array.from({ length: 19 }, (_, index) => index);
    const TRADE_MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const TRADE_ASSET_OPTIONS = [
      { value: 'ALL', label: 'All Assets' },
      { value: 'player', label: 'Players' },
      { value: 'pick', label: 'Draft Picks' },
      { value: 'faab', label: 'FAAB' },
    ];
    const TRADE_CAREER_CSV_URL = new URL('../data/NFL16-25/NFL-PlayerData_16-25.csv', window.location.href).toString();
    // Historical multi-team lookup:
    // derived offline from nflverse weekly roster/snap releases, this keeps the
    // runtime payload tiny while preserving both team identities for every 2TM
    // season row in the local 2016-25 production archive.
    const TRADE_MULTI_TEAM_CSV_URL = new URL('../data/NFL16-25/NFL-PlayerTeams_16-25.csv', window.location.href).toString();
    const TRADE_TEAM_LOGO_KEY_MAP = Object.freeze({
      JAC: 'jax',
      LA: 'lar',
      LAR: 'lar',
      LV: 'lv',
      OAK: 'lv',
      SD: 'lac',
      STL: 'lar',
      WAS: 'was',
      WSH: 'was',
    });

    const radarBackgroundPlugin = {
      id: 'analyzerRadarBackground',
      beforeDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale || !options?.levels?.length || !chart.data.labels?.length) return;

        const { ctx } = chart;
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const angleStep = (Math.PI * 2) / chart.data.labels.length;
        const startAngle = scale.getIndexAngle(0);
        const maxRadius = scale.drawingArea;

        ctx.save();
        options.levels.forEach((level) => {
          const radius = maxRadius * (level.ratio ?? 1);
          if (radius <= 0) return;
          ctx.beginPath();
          chart.data.labels.forEach((label, index) => {
            const angle = startAngle + angleStep * index;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          if (level.fill) {
            ctx.fillStyle = level.fill;
            ctx.fill();
          }
          if (level.stroke) {
            ctx.strokeStyle = level.stroke;
            ctx.lineWidth = level.lineWidth ?? 1;
            ctx.stroke();
          }
        });
        ctx.restore();
      },
    };

    const radarPointLabelsPlugin = {
      id: 'analyzerRadarLabels',
      afterDatasetsDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale) return;
        const datasets = chart.data.datasets || [];
        datasets.forEach((dataset, datasetIndex) => {
          if (!dataset?.analyzerLabels) return;
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta?.data) return;

          const font = dataset.labelFont || options?.font || '11px "Product Sans", "Google Sans", sans-serif';
          const defaultColor = dataset.labelColor || options?.color || dataset.borderColor || '#EAEBF0';
          const formatter =
            dataset.labelFormatter || options?.formatter || ((val) => `${Number(val).toFixed(0)}`);

          meta.data.forEach((point, index) => {
            const value = dataset.data?.[index];
            if (!Number.isFinite(value)) return;
            const rawLabel = formatter(value, index, dataset, chart.data.labels?.[index]);
            if (!rawLabel) return;
            const lines = Array.isArray(rawLabel)
              ? rawLabel.map((line) => String(line ?? '')).filter(Boolean)
              : String(rawLabel).split('\n').map((line) => line.trim()).filter(Boolean);
            if (!lines.length) return;

            const { x, y } = point.tooltipPosition();
            const angle = Math.atan2(y - scale.yCenter, x - scale.xCenter);
            const offsetX = Math.cos(angle) * (options?.offset ?? 18);
            const offsetY = Math.sin(angle) * (options?.offset ?? 18);

            const ctx = chart.ctx;
            ctx.save();
            ctx.font = font;
            const color = Array.isArray(dataset.labelColors)
              ? dataset.labelColors[index] || defaultColor
              : defaultColor;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const fontMatch = font.match(/(\d+(?:\.\d+)?)px/);
            const fontSize = fontMatch ? parseFloat(fontMatch[1]) : 11;
            const lineHeightSetting = dataset.labelLineHeight ?? options?.lineHeight ?? 1.1;
            const lineHeight = lineHeightSetting > 4 ? lineHeightSetting : fontSize * lineHeightSetting;
            const startY = (y + offsetY) - ((lines.length - 1) * lineHeight) / 2;

            lines.forEach((line, lineIndex) => {
              ctx.fillText(line, x + offsetX, startY + lineIndex * lineHeight);
            });
            ctx.restore();
          });
        });
      },
    };

    const RANK_GLYPHS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'];

    const formatRankGlyph = (rank) => {
      if (!Number.isFinite(rank) || rank <= 0) return '';
      if (rank <= RANK_GLYPHS.length) {
        return RANK_GLYPHS[rank - 1];
      }
      return `${rank}.`;
    };

    const getCssFontValue = (variableName) => {
      if (!variableName) return null;
      const target = document.body || document.documentElement;
      if (!target) return null;
      const styles = getComputedStyle(target);
      if (!styles) return null;
      const value = styles.getPropertyValue(variableName);
      return value ? value.trim() || null : null;
    };

    const scaleFontSize = (fontString, scale) => {
      if (!fontString || typeof fontString !== 'string' || !Number.isFinite(scale)) {
        return fontString;
      }
      const match = fontString.match(/(\d+(?:\.\d+)?)px/);
      if (!match) return fontString;
      const size = parseFloat(match[1]);
      if (!Number.isFinite(size) || size <= 0) return fontString;
      const scaled = size * scale;
      const rounded = Math.round(scaled * 10) / 10;
      return fontString.replace(match[0], `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}px`);
    };

    // LeagueHub chart raster quality:
    // Chart.js defaults to the browser DPR, which can look soft on desktop when users
    // zoom in. These helpers render LeagueHub canvases at a higher internal pixel
    // ratio while keeping the same CSS size, then refresh that ratio after zoom/resize.
    function getAnalyzerChartDevicePixelRatio() {
      const rawRatio = Number(window.devicePixelRatio) || 1;
      const desktopMinRatio = 2.5;
      const mobileMinRatio = 2;
      const maxRatio = 3;
      const minRatio = window.matchMedia('(max-width: 640px)').matches
        ? mobileMinRatio
        : desktopMinRatio;
      return Math.min(maxRatio, Math.max(rawRatio, minRatio));
    }

    function applyAnalyzerChartRenderQuality(options = {}) {
      return {
        ...options,
        devicePixelRatio: getAnalyzerChartDevicePixelRatio(),
        resizeDelay: 80,
      };
    }

    let chartResolutionFrame = null;
    function refreshAnalyzerChartResolution() {
      const nextRatio = getAnalyzerChartDevicePixelRatio();
      Object.values(state.charts || {}).forEach((chart) => {
        if (!chart) return;
        chart.options.devicePixelRatio = nextRatio;
        chart.resize();
        chart.update('none');
      });
    }

    function scheduleAnalyzerChartResolutionRefresh() {
      if (chartResolutionFrame !== null) {
        cancelAnimationFrame(chartResolutionFrame);
      }
      chartResolutionFrame = requestAnimationFrame(() => {
        chartResolutionFrame = null;
        refreshAnalyzerChartResolution();
      });
    }

    const barTotalsPlugin = {
      id: 'analyzerBarTotals',
      afterDatasetsDraw(chart, args, options) {
        if (!options || options.enabled === false) return;

        const datasets = chart.data?.datasets || [];
        if (!datasets.length) return;

        const metas = datasets
          .map((dataset, index) => ({ meta: chart.getDatasetMeta(index), dataset }))
          .filter(({ meta }) => meta && !meta.hidden);

        if (!metas.length) return;

        const isHorizontal = chart.options?.indexAxis === 'y';
        const primaryScale = isHorizontal ? chart.scales?.x : chart.scales?.y;
        if (!primaryScale) return;

        const labelCount = chart.data?.labels?.length || 0;
        if (!labelCount) return;

        const totals = new Array(labelCount).fill(0);
        const positions = new Array(labelCount).fill(null);

        metas.forEach(({ meta, dataset }) => {
          meta.data.forEach((element, index) => {
            if (!element) return;
            const value = Number(dataset.data?.[index]) || 0;
            totals[index] += value;
            if (!positions[index]) {
              positions[index] = element;
            }
          });
        });

        const rankedTotals = totals
          .map((value, index) => ({ value, index }))
          .filter(({ value }) => Number.isFinite(value))
          .sort((a, b) => {
            if (b.value === a.value) {
              return a.index - b.index;
            }
            return b.value - a.value;
          });

        const ranks = new Array(labelCount).fill(null);
        let previousValue = null;
        let previousRank = 0;
        rankedTotals.forEach(({ value, index }, position) => {
          if (!Number.isFinite(value)) return;
          if (previousValue !== null && value === previousValue) {
            ranks[index] = previousRank;
            return;
          }
          const rank = position + 1;
          ranks[index] = rank;
          previousRank = rank;
          previousValue = value;
        });

        const ctx = chart.ctx;
        const offset = options.offset ?? 12;
        const font = options.font || '10px "Product Sans", "Google Sans", sans-serif';
        const mobileFont = options.mobileFont || '9px "Product Sans", "Google Sans", sans-serif';
        const color = options.color || '#EAEBF0';
        const formatter = options.formatter || ((val) => val.toFixed(0));
        const isMobileViewport = window.matchMedia('(max-width: 640px)').matches;
        const labelFont = isMobileViewport ? mobileFont : font;
        const cssGlyphFont = getCssFontValue(options.rankFontCssVar);
        const glyphFont = cssGlyphFont
          || (isMobileViewport ? options.rankMobileFont : options.rankFont)
          || scaleFontSize(labelFont, options.rankFontScale ?? 1.6);
        const glyphColor = options.rankColor || color;
        const glyphSpacing = options.rankSpacing ?? (isHorizontal ? 7 : 5);

        totals.forEach((total, index) => {
          if (!Number.isFinite(total) || total === 0) return;
          const element = positions[index];
          if (!element) return;

          const formatted = formatter(total, index);
          if (!formatted) return;
          const rankGlyph = formatRankGlyph(ranks[index]);

          const center = isHorizontal ? element.y : element.x;
          const primaryPixel = primaryScale.getPixelForValue(total);
          const chartArea = chart.chartArea;

          ctx.save();
          ctx.textBaseline = isHorizontal ? 'middle' : 'bottom';

          const layoutPadding = chart.options?.layout?.padding || 0;
          const resolvePadding = (side) =>
            (typeof layoutPadding === 'number' ? layoutPadding : layoutPadding?.[side] ?? 0);
          const paddingRight = resolvePadding('right');
          const paddingLeft = resolvePadding('left');

          let glyphWidth = 0;
          let labelWidth = 0;
          let totalWidth = 0;
          let glyphMetrics = null;
          let glyphLeftBearing = 0;

          if (rankGlyph) {
            ctx.font = glyphFont;
            glyphMetrics = ctx.measureText(rankGlyph);
            const actualLeft = glyphMetrics.actualBoundingBoxLeft ?? 0;
            const actualRight = glyphMetrics.actualBoundingBoxRight ?? 0;
            glyphLeftBearing = actualLeft;
            glyphWidth = actualLeft + actualRight;
            if (!glyphWidth || glyphWidth <= 0) {
              glyphWidth = glyphMetrics.width;
            }
            ctx.font = labelFont;
            labelWidth = ctx.measureText(formatted).width;
            totalWidth = glyphWidth + glyphSpacing + labelWidth;
          } else {
            ctx.font = labelFont;
            labelWidth = ctx.measureText(formatted).width;
            totalWidth = labelWidth;
          }

          const glyphGap = rankGlyph ? options.rankGlyphGap ?? (isHorizontal ? -4 : -4) : 0;
          let x = isHorizontal ? primaryPixel + offset + glyphGap : center;
          let y = isHorizontal ? center : primaryPixel - offset;

          if (isHorizontal) {
            const maxX = chart.width - paddingRight - 4;
            const minX = chartArea.left + paddingLeft + 4;
            const maxStart = maxX - totalWidth;
            if (Number.isFinite(maxStart)) {
              x = Math.min(x, maxStart);
            }
            const minStart = Math.max(minX, primaryPixel + offset + glyphGap);
            if (x < minStart) {
              x = minStart;
            }
            y = center;
          } else if (y < chartArea.top + 12) {
            y = chartArea.top + 12;
          }

          if (rankGlyph) {
            ctx.textAlign = 'left';

            if (isHorizontal) {
              ctx.font = glyphFont;
              ctx.fillStyle = glyphColor;
              const glyphStart = x - glyphLeftBearing;
              ctx.fillText(rankGlyph, glyphStart, y);

              ctx.font = labelFont;
              ctx.fillStyle = color;
              ctx.fillText(formatted, x + glyphWidth + glyphSpacing, y);
            } else {
              const minStart = chartArea.left + paddingLeft + 4;
              const maxStart = chartArea.right - paddingRight - 4 - totalWidth;
              let startX = x - totalWidth / 2;
              if (Number.isFinite(maxStart)) {
                startX = Math.min(startX, maxStart);
              }
              if (startX < minStart) {
                startX = minStart;
              }

              ctx.font = glyphFont;
              ctx.fillStyle = glyphColor;
              const glyphStart = startX - glyphLeftBearing;
              ctx.fillText(rankGlyph, glyphStart, y);

              ctx.font = labelFont;
              ctx.fillStyle = color;
              ctx.fillText(formatted, startX + glyphWidth + glyphSpacing, y);
            }
          } else {
            ctx.font = labelFont;
            ctx.fillStyle = color;
            ctx.textAlign = isHorizontal ? 'left' : 'center';

            if (isHorizontal) {
              const maxX = chart.width - paddingRight - 4 - totalWidth;
              const minX = chartArea.left + paddingLeft + 4;
              let startX = x;
              if (Number.isFinite(maxX)) {
                startX = Math.min(startX, maxX);
              }
              if (startX < minX) {
                startX = minX;
              }
              ctx.fillText(formatted, startX, y);
            } else {
              ctx.fillText(formatted, x, y);
            }
          }
          ctx.restore();
        });
      },
    };

    Chart.register(radarBackgroundPlugin, radarPointLabelsPlugin, barTotalsPlugin);

    const state = {
      userId: null,
      leagues: [],
      players: {},
      ktcOneQb: {},
      ktcSflx: {},
      playerStats: {},
      playerStatsSeason: null,
      leaguePlayerStats: {},
      currentLeagueId: null,
      currentLineupMetric: 'value',
      currentRadarMetric: 'ppg',
      isSuperflex: false,
      cache: {},
      championCache: {},
      leagueHistoryCache: {},
      careerStatsCache: {},
      careerStatsByOwner: {},
      textCache: {},
      tradeCareerStatsBySeason: null,
      tradeTeamHistoryBySeason: null,
      connectedUsername: '',
      usernameReturnSnapshot: null,
      charts: {
        lineup: null,
        overall: null,
        radar: null,
      },
      lineupData: null,
      teams: [],
      standingsTeams: [],
      standingsSort: {
        key: null,
        direction: null,
      },
      leaderboards: { ALL: [], QB: [], RB: [], WR: [], TE: [] },
      activeLeaderboard: 'ALL',
      radarSlots: [],
      trades: {
        activeTab: 'analysis',
        requestToken: 0,
        isLoading: false,
        loadedLeagueId: null,
        selectedMember: 'ALL',
        selectedSeason: 'ALL',
        selectedAssetType: 'ALL',
        searchTerm: '',
        archiveCache: {},
        currentMembers: [],
        currentMemberMap: {},
        seasonBundles: [],
        allTrades: [],
        openSelect: null,
      },
    };

    const normalizeLeagueUsername = (value) => String(value || '').trim().toLowerCase();
    const syncStoredUsername = (value) => {
      const normalizedUsername = normalizeLeagueUsername(value);
      if (elements.usernameInput) {
        elements.usernameInput.value = normalizedUsername;
      }
      try {
        if (normalizedUsername) localStorage.setItem('sleeper_username', normalizedUsername);
        else localStorage.removeItem('sleeper_username');
      } catch (error) { }
      return normalizedUsername;
    };
    const getLeagueHubGateErrorMessage = (error) => {
      const rawMessage = String(error?.message || '').trim();
      const normalizedMessage = rawMessage.toLowerCase();
      if (normalizedMessage.includes('not found')) {
        return 'That Sleeper username was not found. Double-check the spelling and try again.';
      }
      if (normalizedMessage.includes('no active dynasty leagues')) {
        return 'We found the username, but there are no active dynasty leagues available right now.';
      }
      if (normalizedMessage.includes('request failed') || normalizedMessage.includes('network')) {
        return 'LeagueHub could not reach Sleeper right now. Please try again in a moment.';
      }
      return 'LeagueHub could not finish connecting that username. Please try again.';
    };
    const updateLeagueHubSessionDisplay = () => {
      if (elements.heroUsername) {
        elements.heroUsername.textContent = state.connectedUsername
          ? `@${state.connectedUsername}`
          : 'Not connected';
      }
      if (elements.changeUserButton) {
        elements.changeUserButton.disabled = !state.connectedUsername;
      }
    };
    const showLeagueHubGate = ({
      username = '',
      errorMessage = '',
      focusInput = true,
      allowReturn,
      returnUsername = '',
    } = {}) => {
      try {
        window.__dhUsernameGate?.show?.({
          page: 'leaguehub',
          username,
          errorMessage,
          focusInput,
          ...(typeof allowReturn === 'boolean' ? { allowReturn } : {}),
          returnUsername,
        });
      } catch (error) { }
    };

    function captureUsernameReturnSnapshot() {
      return {
        username: state.connectedUsername,
        userId: state.userId,
        leagues: state.leagues,
        currentLeagueId: state.currentLeagueId,
        currentLineupMetric: state.currentLineupMetric,
        currentRadarMetric: state.currentRadarMetric,
        playerStats: state.playerStats,
        playerStatsSeason: state.playerStatsSeason,
        leaguePlayerStats: state.leaguePlayerStats,
        isSuperflex: state.isSuperflex,
        careerStatsByOwner: state.careerStatsByOwner,
        lineupData: state.lineupData,
        teams: state.teams,
        standingsTeams: state.standingsTeams,
        leaderboards: state.leaderboards,
        activeLeaderboard: state.activeLeaderboard,
        radarSlots: state.radarSlots,
        trades: { ...state.trades },
        contentWasHidden: elements.content?.classList.contains('hidden') ?? true,
        summaryWasHidden: elements.summaryStats?.classList.contains('hidden') ?? true,
      };
    }

    function restoreUsernameReturnSnapshot() {
      const snapshot = state.usernameReturnSnapshot;
      if (!snapshot?.username) return false;

      // LeagueHub username rollback:
      // restores the prior data references and visible league immediately when
      // Go back is selected, without another Sleeper request or archive rebuild.
      state.userId = snapshot.userId;
      state.leagues = snapshot.leagues;
      state.currentLeagueId = snapshot.currentLeagueId;
      state.currentLineupMetric = snapshot.currentLineupMetric;
      state.currentRadarMetric = snapshot.currentRadarMetric;
      state.playerStats = snapshot.playerStats;
      state.playerStatsSeason = snapshot.playerStatsSeason;
      state.leaguePlayerStats = snapshot.leaguePlayerStats;
      state.isSuperflex = snapshot.isSuperflex;
      state.careerStatsByOwner = snapshot.careerStatsByOwner;
      state.lineupData = snapshot.lineupData;
      state.teams = snapshot.teams;
      state.standingsTeams = snapshot.standingsTeams;
      state.leaderboards = snapshot.leaderboards;
      state.activeLeaderboard = snapshot.activeLeaderboard;
      state.radarSlots = snapshot.radarSlots;
      state.trades = snapshot.trades;
      state.connectedUsername = snapshot.username;
      state.usernameReturnSnapshot = null;

      syncStoredUsername(snapshot.username);
      populateLeagueSelect(snapshot.leagues || []);
      syncLeagueSelectValues(snapshot.currentLeagueId || '');
      elements.content?.classList.toggle('hidden', snapshot.contentWasHidden);
      elements.summaryStats?.classList.toggle('hidden', snapshot.summaryWasHidden);
      updateLeagueHubSessionDisplay();
      return true;
    }

    // LeagueHub gate bridge:
    // lets the shared username overlay in app.js submit directly into the
    // LeagueHub fetch flow without coupling this page to shared app.js logic.
    if (typeof window !== 'undefined') {
      window.__dhLeagueHubBridge = {
        submitUsername: async ({ username = '', leagueId = '' } = {}) => {
          const normalizedUsername = syncStoredUsername(username);
          if (!normalizedUsername) {
            showLeagueHubGate({
              username: '',
              errorMessage: 'Enter your Sleeper username to continue.',
            });
            return false;
          }
          return handleFetchData(leagueId, {
            preserveExistingContent: Boolean(state.usernameReturnSnapshot),
          });
        },
        cancelUsernameChange: async () => restoreUsernameReturnSnapshot(),
      };
    }

    elements.usernameInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleFetchData();
      }
    });

    elements.leagueSelect?.addEventListener('change', () => {
      const leagueId = elements.leagueSelect.value;
      if (leagueId) {
        syncLeagueSelectValues(leagueId);
        analyzeLeague(leagueId);
      }
    });

    elements.changeUserButton?.addEventListener('click', () => {
      if (!state.connectedUsername) return;
      state.usernameReturnSnapshot = captureUsernameReturnSnapshot();
      showLeagueHubGate({
        username: state.connectedUsername,
        allowReturn: true,
        returnUsername: state.connectedUsername,
      });
    });

    elements.tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveLeagueHubTab(button.dataset.leaguehubTab);
      });
      button.addEventListener('keydown', handleLeagueHubTabKeydown);
    });

    elements.tradesSearchInput?.addEventListener('input', () => {
      state.trades.searchTerm = elements.tradesSearchInput.value || '';
      renderTradeWorkspace();
    });

    // LeagueHub trade filters:
    // uses custom listbox controls so the archive avoids native dropdown styling
    // while keeping filter state local to this page.
    wireTradeSelect('member', (value) => {
      state.trades.selectedMember = value || 'ALL';
      renderTradeWorkspace();
    });
    wireTradeSelect('season', (value) => {
      state.trades.selectedSeason = value || 'ALL';
      renderTradeWorkspace();
    });
    wireTradeSelect('asset', (value) => {
      state.trades.selectedAssetType = value || 'ALL';
      renderTradeWorkspace();
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest?.('.leaguehub-trades-select')) {
        closeTradeSelect();
      }
    });

    elements.lineupToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        if (!metric || metric === state.currentLineupMetric) return;
        state.currentLineupMetric = metric;
        elements.lineupToggle.forEach((btn) => {
          const isActive = btn.dataset.metric === metric;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        updateLineupChart();
      });
    });

    elements.radarToggle.forEach((button) => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        if (!metric || metric === state.currentRadarMetric) return;
        state.currentRadarMetric = metric;
        elements.radarToggle.forEach((btn) => {
          const isActive = btn.dataset.metric === metric;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        updateRadarChart();
      });
    });

    elements.leaderboardFilters.forEach((button) => {
      button.addEventListener('click', () => {
        const pos = button.dataset.pos;
        if (!pos || pos === state.activeLeaderboard) return;
        state.activeLeaderboard = pos;
        elements.leaderboardFilters.forEach((btn) => {
          const isActive = btn.dataset.pos === pos;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        renderLeagueLeaders();
      });
    });

    populateTradeAssetFilter();
    setActiveLeagueHubTab('analysis', { skipTradeLoad: true });
    updateLeagueHubSessionDisplay();

    // Analyzer split league table sorting:
    // cycles sortable headers in both the frozen SZN table and the horizontal
    // scroll table through high-to-low, low-to-high, then reset.
    const handleStandingsSortClick = (event) => {
      const sortButton = event.target.closest('.analyzer-standings-sort');
      if (!sortButton) return;

      const sortKey = sortButton.dataset.sortKey;
      if (!sortKey) return;

      const nextSort = { ...state.standingsSort };
      if (nextSort.key !== sortKey) {
        nextSort.key = sortKey;
        nextSort.direction = 'desc';
      } else if (nextSort.direction === 'desc') {
        nextSort.direction = 'asc';
      } else if (nextSort.direction === 'asc') {
        nextSort.key = null;
        nextSort.direction = null;
      } else {
        nextSort.direction = 'desc';
      }

      state.standingsSort = nextSort;
      renderStandings(state.standingsTeams);
    };
    elements.standingsFrozenTable?.addEventListener('click', handleStandingsSortClick);
    elements.standingsTable?.addEventListener('click', handleStandingsSortClick);

    window.addEventListener('resize', () => {
      syncStandingsSplitRowHeights();
      scheduleAnalyzerChartResolutionRefresh();
    });
    window.visualViewport?.addEventListener?.('resize', scheduleAnalyzerChartResolutionRefresh);

    const normalizedInitialUsername = normalizeLeagueUsername(initialUsername);
    let locallyStoredUsername = '';
    try {
      locallyStoredUsername = localStorage.getItem('sleeper_username') || '';
    } catch (error) { }
    const storedUsername = normalizeLeagueUsername(elements.usernameInput?.value || locallyStoredUsername);

    if (normalizedInitialUsername) {
      syncStoredUsername(initialUsername);
      // If arriving via nav with username in query, blur to avoid mobile keyboard
      setTimeout(() => { try { elements.usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { } }, 50);
      handleFetchData(initialLeagueId);
    } else if (storedUsername) {
      syncStoredUsername(storedUsername);
      handleFetchData(initialLeagueId);
    } else {
      showLeagueHubGate({ focusInput: false });
    }

    async function handleFetchData(targetLeagueId, { preserveExistingContent = false } = {}) {
      const username = syncStoredUsername(elements.usernameInput.value);
      if (!username) {
        showLeagueHubGate({
          username: '',
          errorMessage: 'Enter your Sleeper username to continue.',
        });
        return false;
      }

      setLoading(true, 'Finding your dynasty leagues...');
      if (!preserveExistingContent) hideContent();
      let wasSuccessful = false;

      try {
        await Promise.all([fetchSleeperPlayers(), fetchKTCData()]);
        await fetchUserAndLeagues(username);

        if (state.leagues.length === 0) {
          throw new Error('No active dynasty leagues found for this user in the current season.');
        }

        setLoading(true, 'Analyzing league value and production...');

        if (targetLeagueId) {
          const target = state.leagues.find((league) => league.league_id === targetLeagueId);
          if (target) {
            elements.leagueSelect.value = targetLeagueId;
            wasSuccessful = await analyzeLeague(targetLeagueId, { preserveExistingContent });
            if (wasSuccessful) finalizeConnectedUsername(username);
            return wasSuccessful;
          }
        }

        elements.leagueSelect.selectedIndex = 1;
        wasSuccessful = await analyzeLeague(state.leagues[0].league_id, { preserveExistingContent });
        if (wasSuccessful) finalizeConnectedUsername(username);
      } catch (error) {
        console.error('Analyzer fetch error:', error);
        showLeagueHubGate({
          username,
          errorMessage: getLeagueHubGateErrorMessage(error),
          allowReturn: Boolean(state.usernameReturnSnapshot),
          returnUsername: state.usernameReturnSnapshot?.username || '',
        });
      } finally {
        setLoading(false);
      }

      return wasSuccessful;
    }

    function finalizeConnectedUsername(username) {
      state.connectedUsername = normalizeLeagueUsername(username);
      state.usernameReturnSnapshot = null;
      syncStoredUsername(state.connectedUsername);
      updateLeagueHubSessionDisplay();
    }

    function hideContent() {
      elements.content.classList.add('hidden');
      elements.summaryStats.classList.add('hidden');
    }

    function handleLeagueHubTabKeydown(event) {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabOrder = ['analysis', 'trades'];
      const currentIndex = tabOrder.indexOf(state.trades.activeTab);
      let nextIndex = currentIndex === -1 ? 0 : currentIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (nextIndex + 1) % tabOrder.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (nextIndex - 1 + tabOrder.length) % tabOrder.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabOrder.length - 1;
      }
      setActiveLeagueHubTab(tabOrder[nextIndex]);
      const nextButton = tabOrder[nextIndex] === 'trades' ? elements.tradesTab : elements.analysisTab;
      nextButton?.focus();
    }

    // LeagueHub tab workspace:
    // toggles the archive command deck with its matching panel, leaves the
    // existing analysis DOM mounted, and lazy-loads history only when requested.
    async function setActiveLeagueHubTab(nextTab, { skipTradeLoad = false } = {}) {
      const tabName = nextTab === 'trades' ? 'trades' : 'analysis';
      state.trades.activeTab = tabName;
      const isAnalysis = tabName === 'analysis';

      updateLeagueHubHero(isAnalysis);

      elements.analysisTab?.classList.toggle('active', isAnalysis);
      elements.analysisTab?.setAttribute('aria-selected', isAnalysis ? 'true' : 'false');
      elements.analysisTab?.setAttribute('tabindex', isAnalysis ? '0' : '-1');
      elements.tradesTab?.classList.toggle('active', !isAnalysis);
      elements.tradesTab?.setAttribute('aria-selected', !isAnalysis ? 'true' : 'false');
      elements.tradesTab?.setAttribute('tabindex', !isAnalysis ? '0' : '-1');
      elements.analysisPanel?.classList.toggle('hidden', !isAnalysis);
      elements.analysisPanel?.setAttribute('aria-hidden', isAnalysis ? 'false' : 'true');
      elements.tradesPanel?.classList.toggle('hidden', isAnalysis);
      elements.tradesPanel?.setAttribute('aria-hidden', isAnalysis ? 'true' : 'false');
      elements.tradeToolbar?.classList.toggle('hidden', isAnalysis);
      elements.tradeToolbar?.setAttribute('aria-hidden', isAnalysis ? 'true' : 'false');

      if (!isAnalysis && !skipTradeLoad && state.currentLeagueId) {
        await ensureTradeArchiveLoaded();
      }
    }

    // LeagueHub hero context:
    // keeps the compact product identity stable while giving each workspace a
    // concise title that still fits the desktop masthead and mobile title row.
    function updateLeagueHubHero(isAnalysis) {
      if (elements.heroPill) elements.heroPill.textContent = 'DH League Hub';
      if (elements.heroHeading) {
        elements.heroHeading.textContent = isAnalysis
          ? 'League Analysis'
          : 'Trade Archive';
      }
    }

    function wireTradeSelect(type, onSelect) {
      const select = elements.tradeSelects?.[type];
      if (!select?.button || !select?.menu) return;
      select.button.addEventListener('click', () => {
        const shouldOpen = state.trades.openSelect !== type;
        closeTradeSelect();
        if (shouldOpen) openTradeSelect(type);
      });
      select.button.addEventListener('keydown', (event) => {
        if (!['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        openTradeSelect(type);
        const options = [...select.menu.querySelectorAll('[role="option"]')];
        const selected = options.find((option) => option.getAttribute('aria-selected') === 'true') || options[0];
        selected?.focus();
      });
      select.menu.addEventListener('click', (event) => {
        const option = event.target.closest('[role="option"]');
        if (!option) return;
        commitTradeSelectOption(select, option, onSelect);
      });
      select.menu.addEventListener('keydown', (event) => {
        const options = [...select.menu.querySelectorAll('[role="option"]')];
        const currentIndex = options.indexOf(document.activeElement);
        if (event.key === 'Escape') {
          event.preventDefault();
          closeTradeSelect();
          select.button.focus();
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const option = document.activeElement?.closest?.('[role="option"]');
          if (option) {
            commitTradeSelectOption(select, option, onSelect);
            select.button.focus();
          }
          return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const nextIndex = event.key === 'ArrowDown'
          ? Math.min(options.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
        options[nextIndex]?.focus();
      });
    }

    function commitTradeSelectOption(select, option, onSelect) {
      // Trade Archive custom dropdown commit:
      // synchronizes filter state, visible button text, and ARIA-selected state
      // because these controls are custom listboxes rather than native selects.
      const value = option.dataset.value || 'ALL';
      onSelect(value);
      select.value.textContent = option.querySelector('span')?.textContent?.trim()
        || option.textContent?.trim()
        || '';
      select.menu.querySelectorAll('[role="option"]').forEach((menuOption) => {
        const isSelected = menuOption === option;
        menuOption.classList.toggle('is-selected', isSelected);
        menuOption.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
      closeTradeSelect();
    }

    function openTradeSelect(type) {
      const select = elements.tradeSelects?.[type];
      if (!select?.button || !select?.menu) return;
      state.trades.openSelect = type;
      // Trade Archive dropdown stacking:
      // marks the full filter control as open so its mobile stacking context
      // stays above neighboring Season and Assets controls without relying on focus.
      select.control?.classList.add('is-select-open');
      select.button.setAttribute('aria-expanded', 'true');
      select.menu.classList.remove('hidden');
    }

    function closeTradeSelect() {
      const openType = state.trades.openSelect;
      if (openType) {
        const select = elements.tradeSelects?.[openType];
        select?.control?.classList.remove('is-select-open');
        select?.button?.setAttribute('aria-expanded', 'false');
        select?.menu?.classList.add('hidden');
      }
      state.trades.openSelect = null;
    }

    function renderTradeSelectOptions(type, options, selectedValue) {
      const select = elements.tradeSelects?.[type];
      if (!select?.menu || !select?.value) return;
      const selected = options.find((option) => option.value === selectedValue) || options[0];
      select.value.textContent = selected?.label || '';
      select.menu.innerHTML = options.map((option) => {
        const isSelected = option.value === selectedValue;
        return `
          <button type="button" class="leaguehub-trades-select-option${isSelected ? ' is-selected' : ''}"
            role="option" aria-selected="${isSelected ? 'true' : 'false'}" data-value="${escapeHtml(option.value)}"
            tabindex="-1">
            <span>${escapeHtml(option.label)}</span>
            ${option.meta ? `<small>${escapeHtml(option.meta)}</small>` : ''}
          </button>`;
      }).join('');
    }

    function populateTradeAssetFilter() {
      renderTradeSelectOptions('asset', TRADE_ASSET_OPTIONS, state.trades.selectedAssetType || 'ALL');
    }

    function populateTradeMemberFilter() {
      const options = [
        { value: 'ALL', label: 'All League Members', meta: 'Every completed trade' },
        ...state.trades.currentMembers.map((member) => ({
          value: member.ownerId,
          label: member.teamName,
          meta: member.displayName,
        })),
      ];
      const validValues = new Set(options.map((option) => option.value));
      if (!validValues.has(state.trades.selectedMember)) state.trades.selectedMember = 'ALL';
      renderTradeSelectOptions('member', options, state.trades.selectedMember);
    }

    function populateTradeSeasonFilter() {
      const options = [
        { value: 'ALL', label: 'All Seasons', meta: `${state.trades.seasonBundles.length || 0} linked seasons` },
        ...state.trades.seasonBundles.map((bundle) => ({
          value: String(bundle.season),
          label: String(bundle.season),
          meta: `${bundle.trades.length} trade${bundle.trades.length === 1 ? '' : 's'}`,
        })),
      ];
      const validValues = new Set(options.map((option) => option.value));
      if (!validValues.has(state.trades.selectedSeason)) state.trades.selectedSeason = 'ALL';
      renderTradeSelectOptions('season', options, state.trades.selectedSeason);
    }

    function setTradeStatus(message) {
      if (elements.tradesStatus) elements.tradesStatus.textContent = message || '';
    }

    function setTradeEmptyState(message = '') {
      if (!elements.tradesEmptyState) return;
      elements.tradesEmptyState.textContent = message;
      elements.tradesEmptyState.classList.toggle('hidden', !message);
    }

    function clearTradeArchiveUi() {
      elements.tradesAnalytics?.classList.add('hidden');
      elements.tradesSummaryCards?.classList.add('hidden');
      if (elements.tradesSummaryCards) elements.tradesSummaryCards.innerHTML = '';
      // Trade analytics reset:
      // clear the unified desktop table and both physical mobile panes together
      // so a league switch cannot leave stale frozen or scrolling rows behind.
      [
        elements.tradesAnalysisHead,
        elements.tradesAnalysisBody,
        elements.tradesMobileFrozenHead,
        elements.tradesMobileFrozenBody,
        elements.tradesMobileScrollHead,
        elements.tradesMobileScrollBody,
      ].filter(Boolean).forEach((element) => {
        element.innerHTML = '';
      });
      if (elements.tradesFeed) elements.tradesFeed.innerHTML = '';
      if (elements.tradesFeedMeta) elements.tradesFeedMeta.textContent = 'No trades loaded yet.';
    }

    function resetTradeArchiveForLeague(leagueInfo, users = [], rosters = []) {
      state.trades.requestToken += 1;
      state.trades.isLoading = false;
      state.trades.loadedLeagueId = null;
      state.trades.selectedMember = 'ALL';
      state.trades.selectedSeason = 'ALL';
      state.trades.selectedAssetType = 'ALL';
      state.trades.searchTerm = '';
      state.trades.seasonBundles = [];
      state.trades.allTrades = [];
      state.trades.currentMembers = buildCurrentTradeMembers(rosters, users);
      state.trades.currentMemberMap = state.trades.currentMembers.reduce((acc, member) => {
        acc[member.ownerId] = member;
        return acc;
      }, {});
      if (elements.tradesSearchInput) elements.tradesSearchInput.value = '';
      populateTradeMemberFilter();
      populateTradeSeasonFilter();
      populateTradeAssetFilter();
      clearTradeArchiveUi();
      setTradeEmptyState('');
      setTradeStatus(leagueInfo?.name
        ? `Trade archive ready for ${leagueInfo.name}. Open League Trade Archive to load completed Sleeper deals.`
        : 'Select a league to load the trade archive.');
    }

    function buildCurrentTradeMembers(rosters = [], users = []) {
      const userMap = {};
      (Array.isArray(users) ? users : []).forEach((user) => {
        if (user?.user_id) userMap[String(user.user_id)] = user;
      });
      const seen = new Set();
      return (Array.isArray(rosters) ? rosters : [])
        .map((roster) => {
          const ownerId = roster?.owner_id || roster?.co_owner_id;
          if (!ownerId) return null;
          const ownerKey = String(ownerId);
          if (seen.has(ownerKey)) return null;
          seen.add(ownerKey);
          const user = userMap[ownerKey] || {};
          const displayName = user.display_name || user.username || `Manager ${ownerKey}`;
          const rawTeamName = roster?.metadata?.team_name;
          const teamName = typeof rawTeamName === 'string' && rawTeamName.trim() ? rawTeamName.trim() : displayName;
          return {
            ownerId: ownerKey,
            rosterId: String(roster?.roster_id ?? ''),
            teamName,
            displayName,
            label: teamName === displayName ? teamName : `${teamName} · ${displayName}`,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.teamName.localeCompare(b.teamName));
    }

    async function ensureTradeArchiveLoaded() {
      const leagueId = state.currentLeagueId;
      const leagueInfo = state.leagues.find((league) => league.league_id === leagueId);
      if (!leagueId || !leagueInfo) {
        setTradeStatus('Select a league to load the trade archive.');
        return;
      }

      if (state.trades.loadedLeagueId === leagueId) {
        renderTradeWorkspace();
        return;
      }

      if (state.trades.archiveCache[leagueId]) {
        hydrateTradeArchiveFromCache(leagueId, state.trades.archiveCache[leagueId]);
        renderTradeWorkspace();
        return;
      }

      if (state.trades.isLoading) return;
      state.trades.isLoading = true;
      const requestToken = state.trades.requestToken + 1;
      state.trades.requestToken = requestToken;
      clearTradeArchiveUi();
      setTradeStatus('Loading trade archive...');
      setTradeEmptyState('Loading completed Sleeper trade history across linked seasons...');

      try {
        await ensureTradeCareerStats();
        const leagueHistory = await fetchAnalyzerLeagueHistory(leagueInfo);
        const seasonBundles = [];

        for (let index = 0; index < leagueHistory.length; index += 1) {
          if (requestToken !== state.trades.requestToken || leagueId !== state.currentLeagueId) return;
          const historyLeague = leagueHistory[index];
          setTradeStatus(`Loading trade archive... ${index + 1}/${leagueHistory.length} seasons scanned.`);
          seasonBundles.push(await fetchTradeSeasonBundle(historyLeague));
        }

        if (requestToken !== state.trades.requestToken || leagueId !== state.currentLeagueId) return;
        const archive = buildTradeArchivePayload(seasonBundles);
        state.trades.archiveCache[leagueId] = archive;
        hydrateTradeArchiveFromCache(leagueId, archive);
        setTradeEmptyState(archive.allTrades.length ? '' : 'No completed Sleeper trades were found in this linked league history.');
      } catch (error) {
        console.error('Trade archive load failed:', error);
        setTradeStatus('Trade archive failed to load.');
        setTradeEmptyState(`Failed to load trade history: ${error.message}`);
      } finally {
        if (requestToken === state.trades.requestToken) {
          state.trades.isLoading = false;
        }
        renderTradeWorkspace();
      }
    }

    function hydrateTradeArchiveFromCache(leagueId, archive) {
      state.trades.loadedLeagueId = leagueId;
      state.trades.seasonBundles = archive?.seasonBundles || [];
      state.trades.allTrades = archive?.allTrades || [];
      populateTradeSeasonFilter();
      setTradeStatus(state.trades.allTrades.length
        ? `Loaded ${state.trades.allTrades.length} completed trades across ${state.trades.seasonBundles.length} linked seasons.`
        : 'No completed Sleeper trades were found in the linked archive.');
    }

    function buildTradeArchivePayload(seasonBundles = []) {
      const orderedSeasonBundles = [...seasonBundles].sort((a, b) => Number(b.season) - Number(a.season));
      return {
        seasonBundles: orderedSeasonBundles,
        allTrades: orderedSeasonBundles
          .flatMap((bundle) => bundle.trades || [])
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      };
    }

    async function fetchTradeSeasonBundle(historyLeague) {
      const [rosters, users, transactionLists] = await Promise.all([
        fetchWithCache(`https://api.sleeper.app/v1/league/${historyLeague.league_id}/rosters`),
        fetchWithCache(`https://api.sleeper.app/v1/league/${historyLeague.league_id}/users`),
        Promise.all(
          TRADE_FETCH_LEGS.map((leg) =>
            fetchWithCache(`https://api.sleeper.app/v1/league/${historyLeague.league_id}/transactions/${leg}`)
              .catch(() => []),
          ),
        ),
      ]);

      const rosterContext = buildTradeRosterContext(rosters, users);
      const dedupedTrades = new Map();
      (transactionLists || []).flat().forEach((transaction) => {
        if (!transaction || transaction.type !== 'trade' || transaction.status !== 'complete') return;
        const transactionId = String(transaction.transaction_id || '');
        if (!transactionId || dedupedTrades.has(transactionId)) return;
        const normalized = normalizeTradeTransaction(transaction, historyLeague, rosterContext);
        if (normalized) dedupedTrades.set(transactionId, normalized);
      });

      return {
        season: String(historyLeague?.season || ''),
        leagueId: String(historyLeague?.league_id || ''),
        leagueName: historyLeague?.name || `Season ${historyLeague?.season || ''}`,
        trades: Array.from(dedupedTrades.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      };
    }

    function buildTradeRosterContext(rosters = [], users = []) {
      const userMap = {};
      (Array.isArray(users) ? users : []).forEach((user) => {
        if (user?.user_id) userMap[String(user.user_id)] = user;
      });
      const rostersById = {};
      (Array.isArray(rosters) ? rosters : []).forEach((roster) => {
        const ownerId = roster?.owner_id || roster?.co_owner_id || null;
        const ownerKey = ownerId ? String(ownerId) : '';
        const user = ownerKey ? userMap[ownerKey] : null;
        const displayName = user?.display_name || user?.username || (ownerKey ? `Manager ${ownerKey}` : `Roster ${roster?.roster_id}`);
        const rawTeamName = roster?.metadata?.team_name;
        const teamName = typeof rawTeamName === 'string' && rawTeamName.trim() ? rawTeamName.trim() : displayName;
        rostersById[String(roster?.roster_id)] = {
          rosterId: String(roster?.roster_id ?? ''),
          ownerId: ownerKey,
          displayName,
          teamName,
          label: teamName === displayName ? teamName : `${teamName} · ${displayName}`,
        };
      });
      return { rostersById, userMap };
    }

    function normalizeTradeTransaction(transaction, historyLeague, rosterContext) {
      const txRosterIds = collectTradeRosterIds(transaction);
      if (!txRosterIds.length) return null;

      const tradeSides = new Map();
      const movements = [];
      const season = String(historyLeague?.season || '');
      const createdAt = Number(transaction?.created) || 0;

      const getOrCreateSide = (rosterId) => {
        const rosterKey = String(rosterId);
        if (!tradeSides.has(rosterKey)) {
          const rosterMeta = rosterContext.rostersById[rosterKey] || null;
          tradeSides.set(rosterKey, {
            rosterId: rosterKey,
            ownerId: rosterMeta?.ownerId || '',
            teamName: rosterMeta?.teamName || `Roster ${rosterKey}`,
            displayName: rosterMeta?.displayName || `Roster ${rosterKey}`,
            label: rosterMeta?.label || `Roster ${rosterKey}`,
            outgoingAssets: [],
            incomingAssets: [],
            receivedPlayers: 0,
            sentPlayers: 0,
            receivedPicks: 0,
            sentPicks: 0,
            receivedFaab: 0,
            sentFaab: 0,
            receivedFpts: 0,
            sentFpts: 0,
            receivedPpgValues: [],
          });
        }
        return tradeSides.get(rosterKey);
      };

      const addAssetCount = (side, direction, asset) => {
        const prefix = direction === 'received' ? 'received' : 'sent';
        if (asset.type === 'player') {
          side[`${prefix}Players`] += 1;
          const fpts = Number(asset.stats?.fpts);
          const ppg = Number(asset.stats?.ppg);
          if (Number.isFinite(fpts)) side[`${prefix}Fpts`] += fpts;
          if (prefix === 'received' && Number.isFinite(ppg)) side.receivedPpgValues.push(ppg);
        } else if (asset.type === 'pick') {
          side[`${prefix}Picks`] += 1;
        } else if (asset.type === 'faab') {
          side[`${prefix}Faab`] += 1;
        }
      };

      const registerMovement = (fromRosterId, toRosterId, asset) => {
        if (!Number.isFinite(fromRosterId)) return;
        const sender = getOrCreateSide(fromRosterId);
        const receiver = Number.isFinite(toRosterId) ? getOrCreateSide(toRosterId) : null;
        sender.outgoingAssets.push(asset);
        addAssetCount(sender, 'sent', asset);
        if (receiver) {
          receiver.incomingAssets.push(asset);
          addAssetCount(receiver, 'received', asset);
        }
        movements.push({
          asset,
          fromRosterId: String(fromRosterId),
          toRosterId: Number.isFinite(toRosterId) ? String(toRosterId) : '',
          fromOwnerId: sender.ownerId || '',
          toOwnerId: receiver?.ownerId || '',
          fromTeamName: sender.teamName,
          toTeamName: receiver?.teamName || '',
        });
      };

      txRosterIds.forEach((rosterId) => getOrCreateSide(rosterId));
      const addMap = transaction?.adds || {};
      const dropMap = transaction?.drops || {};

      Object.entries(addMap).forEach(([playerId, toRosterIdValue]) => {
        const toRosterId = parseTradeRosterId(toRosterIdValue);
        const fromRosterId = parseTradeRosterId(dropMap?.[playerId]);
        const fallbackFromRosterId = !Number.isFinite(fromRosterId) && txRosterIds.length === 2
          ? txRosterIds.find((candidateId) => candidateId !== toRosterId)
          : fromRosterId;
        if (!Number.isFinite(fallbackFromRosterId)) return;
        registerMovement(fallbackFromRosterId, toRosterId, buildTradePlayerAsset(playerId, season, createdAt));
      });

      (Array.isArray(transaction?.draft_picks) ? transaction.draft_picks : []).forEach((pick) => {
        const fromRosterId = parseTradeRosterId(pick?.previous_owner_id);
        const toRosterId = parseTradeRosterId(pick?.owner_id);
        if (!Number.isFinite(fromRosterId)) return;
        registerMovement(fromRosterId, toRosterId, buildTradePickAsset(pick, rosterContext));
      });

      (Array.isArray(transaction?.waiver_budget) ? transaction.waiver_budget : []).forEach((budgetMove) => {
        const fromRosterId = parseTradeRosterId(budgetMove?.sender ?? budgetMove?.sender_id ?? budgetMove?.sender_roster_id ?? budgetMove?.from);
        const toRosterId = parseTradeRosterId(budgetMove?.receiver ?? budgetMove?.receiver_id ?? budgetMove?.receiver_roster_id ?? budgetMove?.to);
        if (!Number.isFinite(fromRosterId)) return;
        registerMovement(fromRosterId, toRosterId, buildTradeFaabAsset(budgetMove));
      });

      if (!movements.length) return null;
      const sides = Array.from(tradeSides.values())
        .map((side) => ({
          ...side,
          incomingAssets: side.incomingAssets.sort(sortTradeAssets),
          outgoingAssets: side.outgoingAssets.sort(sortTradeAssets),
          receivedAvgPpg: averageNumbers(side.receivedPpgValues),
        }))
        .sort((a, b) => txRosterIds.indexOf(Number(a.rosterId)) - txRosterIds.indexOf(Number(b.rosterId)));
      const participantOwnerIds = sides.map((side) => side.ownerId).filter(Boolean);
      const participantsLabel = sides.map((side) => side.teamName).join(' vs ');
      const searchTokens = [
        season,
        historyLeague?.name,
        participantsLabel,
        ...sides.flatMap((side) => [side.teamName, side.displayName, side.label]),
        ...movements.flatMap((movement) => movement.asset.searchTokens || []),
      ].join(' ').toLowerCase();

      return {
        id: String(transaction.transaction_id || `${historyLeague?.league_id}-${createdAt}`),
        season,
        leagueId: String(historyLeague?.league_id || ''),
        createdAt,
        dateLabel: formatTradeDate(createdAt),
        participantsLabel,
        participantOwnerIds,
        sides,
        movements,
        searchTokens,
        assetTypes: Array.from(new Set(movements.map((movement) => movement.asset.type))),
        assetCount: movements.length,
      };
    }

    function collectTradeRosterIds(transaction) {
      const rosterIds = new Set();
      const registerRosterId = (value) => {
        const parsed = parseTradeRosterId(value);
        if (Number.isFinite(parsed)) rosterIds.add(parsed);
      };
      (Array.isArray(transaction?.roster_ids) ? transaction.roster_ids : []).forEach(registerRosterId);
      Object.values(transaction?.adds || {}).forEach(registerRosterId);
      Object.values(transaction?.drops || {}).forEach(registerRosterId);
      (Array.isArray(transaction?.draft_picks) ? transaction.draft_picks : []).forEach((pick) => {
        registerRosterId(pick?.owner_id);
        registerRosterId(pick?.previous_owner_id);
      });
      (Array.isArray(transaction?.waiver_budget) ? transaction.waiver_budget : []).forEach((budgetMove) => {
        registerRosterId(budgetMove?.sender ?? budgetMove?.sender_id ?? budgetMove?.sender_roster_id ?? budgetMove?.from);
        registerRosterId(budgetMove?.receiver ?? budgetMove?.receiver_id ?? budgetMove?.receiver_roster_id ?? budgetMove?.to);
      });
      return Array.from(rosterIds);
    }

    function parseTradeRosterId(value) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : null;
    }

    function getTradeProductionSeason(season) {
      const tradeSeason = String(season || '');

      // 2026 preseason bridge:
      // show the latest complete 2025 production beside 2026 trades until the
      // career archive actually contains 2026 rows, then switch automatically.
      if (tradeSeason === '2026') {
        const seasonRows = state.tradeCareerStatsBySeason?.['2026'];
        if (seasonRows) {
          // Exit on the first own row so this check stays constant-time in
          // practice even after the full 2026 player archive is populated.
          for (const playerId in seasonRows) {
            if (Object.prototype.hasOwnProperty.call(seasonRows, playerId)) return '2026';
          }
        }
        return '2025';
      }

      // All completed seasons retain the production from their exact trade year.
      return tradeSeason;
    }

    function buildTradePlayerAsset(playerId, season, createdAt) {
      const playerInfo = state.players[playerId] || {};
      const tradeSeason = String(season || '');
      const productionSeason = getTradeProductionSeason(tradeSeason);
      const careerRow = state.tradeCareerStatsBySeason?.[productionSeason]?.[playerId] || null;
      const position = (careerRow?.pos || playerInfo.position || 'PLYR').toUpperCase();
      const title = careerRow?.name || formatPlayerName(playerInfo);
      const tradeAge = getPlayerAge(playerInfo, createdAt ? new Date(createdAt) : new Date());
      const age = Number.isFinite(tradeAge) ? tradeAge : careerRow?.age;
      const team = careerRow?.team || playerInfo.team || '--';
      const teams = Array.isArray(careerRow?.teams) && careerRow.teams.length
        ? careerRow.teams
        : team && team !== '2TM' && team !== '--' ? [team] : [];
      return {
        type: 'player',
        sortOrder: 0,
        id: String(playerId),
        badge: position,
        title,
        subtitle: position,
        team,
        teams,
        ktc: getKtcValue(playerId),
        tradeSeason,
        productionSeason,
        stats: careerRow ? { ...careerRow, age } : { age: Number.isFinite(age) ? age : null },
        hasSeasonData: Boolean(careerRow),
        searchTokens: [title, position, team, ...teams, tradeSeason, productionSeason, playerId].filter(Boolean),
      };
    }

    function buildTradePickAsset(pick, rosterContext) {
      const round = Number.parseInt(pick?.round, 10) || 0;
      const season = String(pick?.season || '');
      const roundLabel = round ? ordinal(round) : 'Pick';
      const ktcLabel = `${season} Mid ${roundLabel}`;
      const originRosterId = String(pick?.roster_id ?? '');
      const origin = rosterContext?.rostersById?.[originRosterId];
      return {
        type: 'pick',
        sortOrder: 1,
        badge: `R${round || '?'}`,
        title: `${season} ${roundLabel} Round Pick`,
        subtitle: origin ? `Origin | ${origin.teamName}` : 'Draft pick',
        ktc: getKtcValue(ktcLabel),
        searchTokens: [
          `${season} ${roundLabel}`,
          ktcLabel,
          `${season} round ${round}`,
          `${season} r${round}`,
          origin?.teamName,
          origin?.displayName,
          'draft pick',
          'pick',
        ].filter(Boolean),
      };
    }

    function buildTradeFaabAsset(budgetMove) {
      const amount = toNumber(budgetMove?.amount ?? budgetMove?.budget ?? budgetMove?.waiver_budget ?? budgetMove?.value ?? 0);
      return {
        type: 'faab',
        sortOrder: 2,
        badge: 'FAAB',
        title: `$${amount.toLocaleString()} FAAB`,
        subtitle: 'Waiver budget transfer',
        amount,
        searchTokens: [`${amount}`, 'faab', 'waiver budget'],
      };
    }

    function sortTradeAssets(a, b) {
      const orderDiff = (a?.sortOrder ?? 99) - (b?.sortOrder ?? 99);
      if (orderDiff !== 0) return orderDiff;
      const ktcDiff = (Number(b?.ktc) || 0) - (Number(a?.ktc) || 0);
      if (ktcDiff !== 0) return ktcDiff;
      const ppgDiff = (Number(b?.stats?.ppg) || 0) - (Number(a?.stats?.ppg) || 0);
      if (ppgDiff !== 0) return ppgDiff;
      return String(a?.title || '').localeCompare(String(b?.title || ''));
    }

    function renderTradeWorkspace() {
      if (!elements.tradesPanel) return;
      if (state.trades.loadedLeagueId !== state.currentLeagueId) {
        elements.tradesAnalytics?.classList.add('hidden');
        if (state.trades.isLoading) {
          setTradeEmptyState('Loading completed Sleeper trade history across linked seasons...');
        }
        return;
      }
      if (!state.trades.allTrades.length) {
        elements.tradesAnalytics?.classList.add('hidden');
        if (elements.tradesFeed) elements.tradesFeed.innerHTML = '';
        if (elements.tradesFeedMeta) elements.tradesFeedMeta.textContent = 'No completed trades found.';
        if (!state.trades.isLoading) setTradeEmptyState('No completed Sleeper trades were found in this linked league history.');
        return;
      }

      renderTradeAnalytics();
      renderTradeFeed();
    }

    function getFilteredTrades() {
      const selectedOwnerId = state.trades.selectedMember;
      const selectedSeason = state.trades.selectedSeason;
      const selectedAssetType = state.trades.selectedAssetType;
      const searchTerm = (state.trades.searchTerm || '').trim().toLowerCase();
      return state.trades.allTrades.filter((trade) => {
        if (selectedOwnerId && selectedOwnerId !== 'ALL' && !trade.participantOwnerIds.includes(String(selectedOwnerId))) {
          return false;
        }
        if (selectedSeason && selectedSeason !== 'ALL' && String(trade.season) !== String(selectedSeason)) {
          return false;
        }
        if (selectedAssetType && selectedAssetType !== 'ALL' && !trade.assetTypes.includes(selectedAssetType)) {
          return false;
        }
        if (searchTerm && !trade.searchTokens.includes(searchTerm)) {
          return false;
        }
        return true;
      });
    }

    function renderTradeAnalytics() {
      const currentMembers = state.trades.currentMembers || [];
      if (!currentMembers.length) {
        elements.tradesAnalytics?.classList.add('hidden');
        return;
      }
      elements.tradesAnalytics?.classList.remove('hidden');
      if (state.trades.selectedMember && state.trades.selectedMember !== 'ALL') {
        renderSelectedMemberTradeAnalytics(state.trades.selectedMember);
      } else {
        renderAllMemberTradeAnalytics(currentMembers);
      }
    }

    function setTradeTableColumns(table, columns, fillAvailable = false) {
      if (!table) return 0;
      const colgroup = table.querySelector('colgroup');
      if (colgroup) {
        colgroup.innerHTML = columns.map((column) => `<col style="width:${column.width}">`).join('');
      }
      const minWidth = columns.reduce((sum, column) => sum + column.pxWidth, 0);
      table.style.width = fillAvailable ? '100%' : `${minWidth}px`;
      table.style.minWidth = `${minWidth}px`;
      return minWidth;
    }

    // Responsive Trade Activity table anatomy:
    // desktop receives every column in one table, while mobile receives a
    // physically separate identity table plus a horizontal metrics table.
    function setTradeAnalyticsColumns(columns, frozenColumnCount, mobileColumns = null) {
      setTradeTableColumns(elements.tradesAnalysisTable, columns, true);
      // Mobile owns a complete width map so the frozen identity table and the
      // independently scrolling metrics table can be tuned without changing desktop.
      const resolvedMobileColumns = mobileColumns || columns;
      const frozenColumns = resolvedMobileColumns.slice(0, frozenColumnCount);
      const scrollingColumns = resolvedMobileColumns.slice(frozenColumnCount);
      const frozenWidth = setTradeTableColumns(elements.tradesMobileFrozenTable, frozenColumns);
      setTradeTableColumns(elements.tradesMobileScrollTable, scrollingColumns);
      elements.tradesMobileTable?.style.setProperty('--leaguehub-frozen-table-width', `${frozenWidth}px`);
    }

    function setTradeAnalyticsMode(mode) {
      [
        elements.tradesAnalysisTable,
        elements.tradesMobileFrozenTable,
        elements.tradesMobileScrollTable,
      ].filter(Boolean).forEach((table) => {
        table.dataset.mode = mode;
      });
      if (elements.tradesMobileTable) elements.tradesMobileTable.dataset.mode = mode;
    }

    function getTradeVolumeClass(rowIndex) {
      const rankIndex = Math.max(0, Number(rowIndex) || 0);
      if (rankIndex < 3) return 'is-volume-high';
      if (rankIndex < 6) return 'is-volume-medium';
      if (rankIndex < 9) return 'is-volume-low';
      return 'is-volume-very-low';
    }

    // Trades-column conditional formatting:
    // sorted rows advance through fixed three-manager tiers so desktop and the
    // split mobile table always assign High / Medium / Low / Very Low identically.
    function renderTradeCountMetric(tradeCount, rowIndex) {
      const count = Number(tradeCount) || 0;
      const volumeClass = getTradeVolumeClass(rowIndex);
      const label = `${count} trade${count === 1 ? '' : 's'}`;
      return `<span class="leaguehub-table-metric is-trade-count ${volumeClass}" aria-label="${label}">${count}</span>`;
    }

    // Preserve the factual League Share label while giving the compact visual
    // track more presence: the fill alone uses (actual percent * 1.3) + 5 points.
    function getLeagueShareFillPercent(actualPercent) {
      const value = Number(actualPercent) || 0;
      return Math.min(100, Math.max(0, (value * 1.3) + 5));
    }

    function renderAllMemberTradeAnalytics(currentMembers) {
      const visibleTrades = getFilteredTrades();
      setTradeAnalyticsMode('league');
      const visibleSeasonCount = state.trades.selectedSeason !== 'ALL'
        ? 1
        : Math.max(1, state.trades.seasonBundles.length || new Set(visibleTrades.map((trade) => trade.season)).size || 1);
      setTradeAnalyticsColumns([
        { width: '36px', pxWidth: 36 },
        { width: '136px', pxWidth: 136 },
        { width: '96px', pxWidth: 96 },
        { width: '126px', pxWidth: 126 },
        { width: '130px', pxWidth: 130 },
        { width: '150px', pxWidth: 150 },
        { width: '62px', pxWidth: 62 },
        { width: '76px', pxWidth: 76 },
        { width: '82px', pxWidth: 82 },
        { width: '96px', pxWidth: 96 },
      ], 2, [
        // Mobile's explicit two-line labels allow narrower metric columns.
        // Keep enough room for values and the single-column Trade Network group.
        { width: '40px', pxWidth: 40 },
        { width: '126px', pxWidth: 126 },
        { width: '64px', pxWidth: 64 },
        { width: '80px', pxWidth: 80 },
        // Mobile AVG / SEASON needs only room for SEASON and its calendar icon.
        { width: '72px', pxWidth: 72 },
        { width: '140px', pxWidth: 140 },
        { width: '72px', pxWidth: 72 },
        { width: '56px', pxWidth: 56 },
        { width: '78px', pxWidth: 78 },
        { width: '104px', pxWidth: 104 },
      ]);
      const rows = currentMembers.map((member) => {
        const memberTrades = visibleTrades.filter((trade) => trade.participantOwnerIds.includes(member.ownerId));
        const memberSides = memberTrades.map((trade) => getTradeSideForOwner(trade, member.ownerId)).filter(Boolean);
        const partnerCounts = new Map();
        // Trade Activity partner summary:
        // counts each partner once per trade so the Top Trade Partner column
        // reflects transaction frequency, not the number of assets moved.
        memberTrades.forEach((trade) => {
          const partnerOwnerIds = new Set((trade.participantOwnerIds || [])
            .map((ownerId) => String(ownerId || ''))
            .filter((ownerId) => ownerId && ownerId !== String(member.ownerId)));
          partnerOwnerIds.forEach((partnerOwnerId) => {
            const partnerSide = (trade.sides || []).find((side) => side.ownerId === partnerOwnerId);
            const partnerMember = state.trades.currentMemberMap[partnerOwnerId];
            const label = partnerMember?.teamName || partnerSide?.teamName || partnerSide?.displayName || 'Unknown';
            const current = partnerCounts.get(partnerOwnerId) || { label, count: 0 };
            current.label = current.label || label;
            current.count += 1;
            partnerCounts.set(partnerOwnerId, current);
          });
        });
        const topPartner = Array.from(partnerCounts.values())
          .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))[0] || null;
        const ktcIn = memberSides.reduce((sum, side) => sum + getTradeSideReceivedValue(side), 0);
        return {
          member,
          tradeCount: memberTrades.length,
          leagueShare: 0,
          avgPerYear: visibleSeasonCount ? memberTrades.length / visibleSeasonCount : 0,
          topPartnerName: topPartner?.label || '—',
          topPartnerCount: topPartner?.count || null,
          playersIn: memberSides.reduce((sum, side) => sum + side.receivedPlayers, 0),
          picksIn: memberSides.reduce((sum, side) => sum + side.receivedPicks, 0),
          ktcIn,
          avgKtcPerTrade: memberTrades.length ? ktcIn / memberTrades.length : 0,
        };
      }).sort((a, b) => b.tradeCount - a.tradeCount || b.playersIn - a.playersIn || a.member.teamName.localeCompare(b.member.teamName));
      const totalTradeParticipations = rows.reduce((sum, row) => sum + row.tradeCount, 0);
      rows.forEach((row) => {
        // League Share:
        // percentage of the displayed Trades column total, not unique league
        // transactions, so the visible shares add up to 100%.
        row.leagueShare = totalTradeParticipations ? (row.tradeCount / totalTradeParticipations) * 100 : 0;
      });

      elements.tradesSummaryCards?.classList.add('hidden');
      if (elements.tradesSummaryCards) elements.tradesSummaryCards.innerHTML = '';
      if (elements.tradesAnalysisHeading) elements.tradesAnalysisHeading.textContent = 'Trade activity';
      if (elements.tradesAnalysisSubheading) {
        elements.tradesAnalysisSubheading.textContent = `${visibleTrades.length} trade${visibleTrades.length === 1 ? '' : 's'} match the current filters.`;
      }
      if (elements.tradesAnalysisHead) {
        elements.tradesAnalysisHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup" colspan="2"><span><i class="fa-solid fa-address-card" aria-hidden="true"></i> Manager</span></th>
            <th scope="colgroup" colspan="3"><span><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Trade activity</span></th>
            <th scope="colgroup"><span><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Trade network</span></th>
            <th scope="colgroup" colspan="4"><span><i class="fa-solid fa-box-open" aria-hidden="true"></i> Assets received</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-ranking-star" aria-hidden="true"></i> RK</span></th>
            <th scope="col"><span><i class="fa-solid fa-user-group" aria-hidden="true"></i> Team</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-right-left" aria-hidden="true"></i> TRADE COUNT</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-chart-pie" aria-hidden="true"></i><span><span class="leaguehub-trades-header-percent">%</span> LEAGUE TRADES</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> AVG TRADES / SZN</span></th>
            <th scope="col"><span><i class="fa-solid fa-link" aria-hidden="true"></i> TOP TRADE PARTNER</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-plus" aria-hidden="true"></i> PLAYERS IN</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-ticket" aria-hidden="true"></i> PICKS IN</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-coins" aria-hidden="true"></i> KTC in</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> AVG KTC IN / TRADE</span></th>
          </tr>`;
      }
      if (elements.tradesMobileFrozenHead) {
        elements.tradesMobileFrozenHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup" colspan="2"><span><i class="fa-solid fa-address-card" aria-hidden="true"></i> Manager</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-ranking-star" aria-hidden="true"></i> RK</span></th>
            <th scope="col"><span><i class="fa-solid fa-user-group" aria-hidden="true"></i> Team</span></th>
          </tr>`;
      }
      if (elements.tradesMobileScrollHead) {
        // Only the mobile table receives manual line breaks and SEASON wording;
        // its separate desktop header retains the original single-line labels.
        elements.tradesMobileScrollHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup" colspan="3"><span><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Trade activity</span></th>
            <th scope="colgroup"><span><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Trade network</span></th>
            <th scope="colgroup" colspan="4"><span><i class="fa-solid fa-box-open" aria-hidden="true"></i> Assets received</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-right-left" aria-hidden="true"></i><span class="leaguehub-trades-header-label">TRADE<br> COUNT</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-chart-pie" aria-hidden="true"></i><span class="leaguehub-trades-header-label"><span class="leaguehub-trades-header-percent">%</span> LEAGUE<br> TRADES</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-calendar-days" aria-hidden="true"></i><span class="leaguehub-trades-header-label">AVG /<br> SEASON</span></span></th>
            <th scope="col"><span><i class="fa-solid fa-link" aria-hidden="true"></i><span class="leaguehub-trades-header-label">TOP TRADE<br> PARTNER</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-plus" aria-hidden="true"></i><span class="leaguehub-trades-header-label">PLAYERS<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-ticket" aria-hidden="true"></i><span class="leaguehub-trades-header-label">PICKS<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-coins" aria-hidden="true"></i><span class="leaguehub-trades-header-label">KTC<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i><span class="leaguehub-trades-header-label">AVG KTC IN /<br> TRADE</span></span></th>
          </tr>`;
      }
      if (elements.tradesAnalysisBody) {
        elements.tradesAnalysisBody.innerHTML = rows.map((row, index) => `
          <tr data-row-index="${index}">
            <td class="is-numeric leaguehub-trades-rank-cell"><span>${index + 1}</span></td>
            <td class="leaguehub-trades-team-cell">
              <strong>${escapeHtml(row.member.teamName)}</strong>
              ${row.member.teamName !== row.member.displayName ? `<small>${escapeHtml(row.member.displayName)}</small>` : ''}
            </td>
            <td class="is-numeric">${renderTradeCountMetric(row.tradeCount, index)}</td>
            <td class="is-numeric">
              <span class="leaguehub-trades-share-value">${formatOptionalNumber(row.leagueShare, 1)}%</span>
              <span class="leaguehub-trades-share-track" aria-hidden="true"><i style="--league-share:${getLeagueShareFillPercent(row.leagueShare).toFixed(2)}%"></i></span>
            </td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${formatOptionalNumber(row.avgPerYear, 1)}</span></td>
            <td class="leaguehub-trades-top-partner-cell">
              <span class="leaguehub-trades-top-partner-text">
                ${row.topPartnerCount ? `<span class="leaguehub-trades-top-partner-count">${row.topPartnerCount}x</span>` : ''}
                <span class="leaguehub-trades-top-partner-name">${escapeHtml(row.topPartnerName)}</span>
              </span>
            </td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcIn)}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(Math.round(row.avgKtcPerTrade))}</span></td>
          </tr>`).join('');
      }
      if (elements.tradesMobileFrozenBody) {
        elements.tradesMobileFrozenBody.innerHTML = rows.map((row, index) => `
          <tr data-row-index="${index}">
            <td class="is-numeric leaguehub-trades-rank-cell"><span>${index + 1}</span></td>
            <td class="leaguehub-trades-team-cell">
              <strong>${escapeHtml(row.member.teamName)}</strong>
              ${row.member.teamName !== row.member.displayName ? `<small>${escapeHtml(row.member.displayName)}</small>` : ''}
            </td>
          </tr>`).join('');
      }
      if (elements.tradesMobileScrollBody) {
        elements.tradesMobileScrollBody.innerHTML = rows.map((row, index) => `
          <tr data-row-index="${index}">
            <td class="is-numeric">${renderTradeCountMetric(row.tradeCount, index)}</td>
            <td class="is-numeric">
              <span class="leaguehub-trades-share-value">${formatOptionalNumber(row.leagueShare, 1)}%</span>
              <span class="leaguehub-trades-share-track" aria-hidden="true"><i style="--league-share:${getLeagueShareFillPercent(row.leagueShare).toFixed(2)}%"></i></span>
            </td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${formatOptionalNumber(row.avgPerYear, 1)}</span></td>
            <td class="leaguehub-trades-top-partner-cell">
              <span class="leaguehub-trades-top-partner-text">
                ${row.topPartnerCount ? `<span class="leaguehub-trades-top-partner-count">${row.topPartnerCount}x</span>` : ''}
                <span class="leaguehub-trades-top-partner-name">${escapeHtml(row.topPartnerName)}</span>
              </span>
            </td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcIn)}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(Math.round(row.avgKtcPerTrade))}</span></td>
          </tr>`).join('');
      }
    }

    function renderSelectedMemberTradeAnalytics(selectedOwnerId) {
      const selectedMember = state.trades.currentMemberMap[selectedOwnerId];
      setTradeAnalyticsMode('member');
      const visibleTrades = getFilteredTrades();
      const selectedTrades = visibleTrades.filter((trade) => trade.participantOwnerIds.includes(String(selectedOwnerId)));
      const selectedSides = selectedTrades.map((trade) => getTradeSideForOwner(trade, selectedOwnerId)).filter(Boolean);
      const partnerStats = new Map();

      selectedTrades.forEach((trade) => {
        const touchedPartners = new Set();
        (trade.movements || []).forEach((movement) => {
          const fromOwnerKey = String(movement.fromOwnerId || '');
          const toOwnerKey = String(movement.toOwnerId || '');
          const isIncoming = toOwnerKey === String(selectedOwnerId) && fromOwnerKey && fromOwnerKey !== String(selectedOwnerId);
          const isOutgoing = fromOwnerKey === String(selectedOwnerId) && toOwnerKey && toOwnerKey !== String(selectedOwnerId);
          if (!isIncoming && !isOutgoing) return;
          const partnerKey = isIncoming ? fromOwnerKey : toOwnerKey;
          const partnerLabel = isIncoming ? movement.fromTeamName : movement.toTeamName;
          if (!partnerStats.has(partnerKey)) {
            partnerStats.set(partnerKey, {
              partnerKey,
              partnerLabel,
              tradeCount: 0,
              playersIn: 0,
              playersOut: 0,
              picksIn: 0,
              picksOut: 0,
              ktcIn: 0,
              ktcOut: 0,
            });
          }
          const stats = partnerStats.get(partnerKey);
          touchedPartners.add(partnerKey);
          if (movement.asset.type === 'player') stats[isIncoming ? 'playersIn' : 'playersOut'] += 1;
          if (movement.asset.type === 'pick') stats[isIncoming ? 'picksIn' : 'picksOut'] += 1;
          stats[isIncoming ? 'ktcIn' : 'ktcOut'] += Number(movement.asset?.ktc) || 0;
        });
        touchedPartners.forEach((partnerKey) => {
          const stats = partnerStats.get(partnerKey);
          if (stats) stats.tradeCount += 1;
        });
      });

      const totals = {
        trades: selectedTrades.length,
        partners: partnerStats.size,
        playersIn: selectedSides.reduce((sum, side) => sum + side.receivedPlayers, 0),
        playersOut: selectedSides.reduce((sum, side) => sum + side.sentPlayers, 0),
        picksIn: selectedSides.reduce((sum, side) => sum + side.receivedPicks, 0),
        ktcIn: selectedSides.reduce((sum, side) => sum + getTradeSideReceivedValue(side), 0),
      };
      const rows = Array.from(partnerStats.values())
        .sort((a, b) => b.tradeCount - a.tradeCount || a.partnerLabel.localeCompare(b.partnerLabel));
      const summaryCards = [
        { label: 'Trades', value: totals.trades, meta: `${totals.partners} partner${totals.partners === 1 ? '' : 's'}` },
        { label: 'Players In', value: totals.playersIn, meta: `${totals.playersOut} sent` },
        { label: 'Picks In', value: totals.picksIn, meta: 'Draft assets received' },
        { label: 'KTC In', value: formatNumber(totals.ktcIn), meta: 'Current package value' },
        { label: 'Avg KTC / Trade', value: formatNumber(selectedTrades.length ? Math.round(totals.ktcIn / selectedTrades.length) : 0), meta: 'Received value per deal' },
      ];

      if (elements.tradesSummaryCards) {
        elements.tradesSummaryCards.classList.remove('hidden');
        elements.tradesSummaryCards.innerHTML = summaryCards.map((card) => `
          <article class="leaguehub-trades-summary-card">
            <span class="leaguehub-trades-summary-label">${escapeHtml(card.label)}</span>
            <span class="leaguehub-trades-summary-value">${escapeHtml(card.value)}</span>
            <span class="leaguehub-trades-summary-meta">${escapeHtml(card.meta)}</span>
          </article>`).join('');
      }
      if (elements.tradesAnalysisHeading) elements.tradesAnalysisHeading.textContent = selectedMember?.teamName || 'Selected trade partner';
      if (elements.tradesAnalysisSubheading) {
        elements.tradesAnalysisSubheading.textContent = `${selectedTrades.length} completed trade${selectedTrades.length === 1 ? '' : 's'} in the current filter view.`;
      }
      setTradeAnalyticsColumns([
        { width: '170px', pxWidth: 170 },
        { width: '96px', pxWidth: 96 },
        { width: '72px', pxWidth: 72 },
        { width: '72px', pxWidth: 72 },
        { width: '64px', pxWidth: 64 },
        { width: '64px', pxWidth: 64 },
        { width: '88px', pxWidth: 88 },
        { width: '88px', pxWidth: 88 },
      ], 1, [
        // Compact the same incoming metrics in member mode. Trade Count keeps
        // room for its Activity group heading; outgoing columns retain their widths.
        { width: '170px', pxWidth: 170 },
        { width: '96px', pxWidth: 96 },
        { width: '72px', pxWidth: 72 },
        { width: '84px', pxWidth: 84 },
        { width: '56px', pxWidth: 56 },
        { width: '70px', pxWidth: 70 },
        { width: '78px', pxWidth: 78 },
        { width: '92px', pxWidth: 92 },
      ]);
      if (elements.tradesAnalysisHead) {
        elements.tradesAnalysisHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup" colspan="2"><span><i class="fa-solid fa-handshake" aria-hidden="true"></i> Partner activity</span></th>
            <th scope="colgroup" colspan="6"><span><i class="fa-solid fa-arrow-right-arrow-left" aria-hidden="true"></i> Asset movement</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col"><span><i class="fa-solid fa-user-group" aria-hidden="true"></i> Partner</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-right-left" aria-hidden="true"></i> TRADE COUNT</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-plus" aria-hidden="true"></i> Players in</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-minus" aria-hidden="true"></i> Players out</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-circle-down" aria-hidden="true"></i> Picks in</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-circle-up" aria-hidden="true"></i> Picks out</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-coins" aria-hidden="true"></i> KTC in</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-money-bill-transfer" aria-hidden="true"></i> KTC out</span></th>
          </tr>`;
      }
      if (elements.tradesMobileFrozenHead) {
        elements.tradesMobileFrozenHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup"><span><i class="fa-solid fa-handshake" aria-hidden="true"></i> Network</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col"><span><i class="fa-solid fa-user-group" aria-hidden="true"></i> Partner</span></th>
          </tr>`;
      }
      if (elements.tradesMobileScrollHead) {
        elements.tradesMobileScrollHead.innerHTML = `
          <tr class="leaguehub-trades-table-group-row">
            <th scope="colgroup"><span><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Activity</span></th>
            <th scope="colgroup" colspan="6"><span><i class="fa-solid fa-arrow-right-arrow-left" aria-hidden="true"></i> Asset movement</span></th>
          </tr>
          <tr class="leaguehub-trades-table-column-row">
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-right-left" aria-hidden="true"></i><span class="leaguehub-trades-header-label">TRADE<br> COUNT</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-plus" aria-hidden="true"></i><span class="leaguehub-trades-header-label">PLAYERS<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-user-minus" aria-hidden="true"></i> Players out</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-circle-down" aria-hidden="true"></i><span class="leaguehub-trades-header-label">PICKS<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-circle-up" aria-hidden="true"></i> Picks out</span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-coins" aria-hidden="true"></i><span class="leaguehub-trades-header-label">KTC<br> IN</span></span></th>
            <th scope="col" class="is-numeric"><span><i class="fa-solid fa-money-bill-transfer" aria-hidden="true"></i> KTC out</span></th>
          </tr>`;
      }
      if (elements.tradesAnalysisBody) {
        elements.tradesAnalysisBody.innerHTML = rows.length ? rows.map((row, index) => `
          <tr data-row-index="${index}">
            <td class="leaguehub-trades-partner-cell"><span class="leaguehub-trades-partner-name">${escapeHtml(row.partnerLabel || '—')}</span></td>
            <td class="is-numeric">${renderTradeCountMetric(row.tradeCount, index)}</td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersOut}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksIn}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksOut}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcIn)}</span></td>
            <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcOut)}</span></td>
          </tr>`).join('') : '<tr><td colspan="8" class="leaguehub-trades-empty-cell">No partner rows match these filters.</td></tr>';
      }
      if (elements.tradesMobileFrozenBody) {
        elements.tradesMobileFrozenBody.innerHTML = rows.length
          ? rows.map((row, index) => `
            <tr data-row-index="${index}">
              <td class="leaguehub-trades-partner-cell"><span class="leaguehub-trades-partner-name">${escapeHtml(row.partnerLabel || '—')}</span></td>
            </tr>`).join('')
          : '<tr><td class="leaguehub-trades-empty-cell">No partners</td></tr>';
      }
      if (elements.tradesMobileScrollBody) {
        elements.tradesMobileScrollBody.innerHTML = rows.length
          ? rows.map((row, index) => `
            <tr data-row-index="${index}">
              <td class="is-numeric">${renderTradeCountMetric(row.tradeCount, index)}</td>
              <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersIn}</span></td>
              <td class="is-numeric"><span class="leaguehub-table-metric">${row.playersOut}</span></td>
              <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksIn}</span></td>
              <td class="is-numeric"><span class="leaguehub-table-metric">${row.picksOut}</span></td>
              <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcIn)}</span></td>
              <td class="is-numeric"><span class="leaguehub-table-metric is-ktc">${formatNumber(row.ktcOut)}</span></td>
            </tr>`).join('')
          : '<tr><td colspan="7" class="leaguehub-trades-empty-cell">No partner rows match these filters.</td></tr>';
      }
    }

    function renderTradeFeed() {
      if (!elements.tradesFeed || !elements.tradesFeedMeta) return;
      const selectedMember = state.trades.selectedMember !== 'ALL'
        ? state.trades.currentMemberMap[state.trades.selectedMember]
        : null;
      const filteredTrades = getFilteredTrades();
      const bundles = state.trades.seasonBundles
        .filter((bundle) => state.trades.selectedSeason === 'ALL' || String(bundle.season) === String(state.trades.selectedSeason))
        .map((bundle) => ({
          ...bundle,
          trades: filteredTrades.filter((trade) => String(trade.season) === String(bundle.season)),
        }))
        .filter((bundle) => bundle.trades.length || state.trades.selectedSeason !== 'ALL');
      const totalTrades = bundles.reduce((sum, bundle) => sum + bundle.trades.length, 0);

      if (!totalTrades) {
        elements.tradesFeed.innerHTML = '';
        elements.tradesFeedMeta.textContent = 'No completed trades match the current filters.';
        setTradeEmptyState('No completed trades match the selected trade partner, season, asset, or search filters.');
        return;
      }

      setTradeEmptyState('');
      elements.tradesFeedMeta.textContent = `${totalTrades} completed trade${totalTrades === 1 ? '' : 's'} shown across ${bundles.length} season${bundles.length === 1 ? '' : 's'}.`;
      elements.tradesFeed.innerHTML = bundles.map((bundle) => renderTradeSeasonBundle(bundle, selectedMember)).join('');
    }

    function renderTradeSeasonBundle(seasonBundle, selectedMember) {
      const seasonHue = getTradeSeasonHue(seasonBundle.season);
      const insights = getTradeSeasonInsights(seasonBundle);
      return `
        <section class="leaguehub-trades-season">
          <header class="leaguehub-trades-season-head" style="--lh-season-hue:${seasonHue}">
            <div class="leaguehub-trades-season-year">
              <span>Season</span>
              <strong>${escapeHtml(seasonBundle.season)}</strong>
            </div>
            <div class="leaguehub-trades-season-label">
              <span class="leaguehub-trades-season-overline">Trade ledger</span>
              <span class="leaguehub-trades-season-name">${escapeHtml(seasonBundle.leagueName || `Season ${seasonBundle.season}`)}</span>
            </div>
            <!-- Desktop season context owns the open horizontal lane to the
                 right of the league name; mobile intentionally hides it. -->
            <span class="leaguehub-trades-season-insights" aria-label="Season trade insights">
              <span><i class="fa-solid fa-people-group" aria-hidden="true"></i><strong>${insights.activeTeams}</strong><small>active teams</small></span>
              <span><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i><strong>${insights.assetsMoved}</strong><small>assets moved</small></span>
              <span><i class="fa-solid fa-calendar-check" aria-hidden="true"></i><strong>${escapeHtml(insights.busiestMonth)}</strong><small>busiest month</small></span>
            </span>
            <span class="leaguehub-trades-season-count">
              <strong>${seasonBundle.trades.length}</strong>
              <span>completed trade${seasonBundle.trades.length === 1 ? '' : 's'}</span>
            </span>
          </header>
          ${seasonBundle.trades.length
            ? seasonBundle.trades.map((trade, index) => renderTradeCard(trade, index)).join('')
            : `<p class="leaguehub-trade-empty-note">No completed trades${selectedMember ? ` involving ${escapeHtml(selectedMember.teamName)}` : ''} in ${escapeHtml(seasonBundle.season)}.</p>`}
        </section>`;
    }

    // Desktop season-ledger insight strip:
    // derives concise information from the already-filtered bundle, adding
    // useful context to the roomy header without another request or data pass.
    function getTradeSeasonInsights(seasonBundle) {
      const trades = Array.isArray(seasonBundle?.trades) ? seasonBundle.trades : [];
      const activeRosterIds = new Set();
      const monthCounts = new Map();
      let assetsMoved = 0;

      trades.forEach((trade) => {
        assetsMoved += Number(trade?.assetCount) || 0;
        (trade?.sides || []).forEach((side) => {
          if (side?.rosterId !== undefined && side?.rosterId !== null) {
            activeRosterIds.add(String(side.rosterId));
          }
        });
        const createdAt = Number(trade?.createdAt);
        if (!Number.isFinite(createdAt) || createdAt <= 0) return;
        const month = TRADE_MONTH_FORMATTER.format(new Date(createdAt));
        monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
      });

      const busiestMonth = Array.from(monthCounts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '—';
      return {
        activeTeams: activeRosterIds.size,
        assetsMoved,
        busiestMonth,
      };
    }

    // Season timeline color identity:
    // assigns each linked year a nearby but distinct blue-to-violet hue so the
    // sticky header and year pill remain cohesive without every season matching.
    function getTradeSeasonHue(season) {
      const year = Number.parseInt(season, 10);
      if (!Number.isFinite(year)) return 215;
      const yearOffset = ((year - 2016) % 18 + 18) % 18;
      return 185 + (yearOffset * 7);
    }

    function renderTradeCard(trade, index = 0) {
      const renderSides = getTradeRenderSides(trade);
      const isMultiRoster = renderSides.length > 2;
      const greaterReceivedSide = getGreaterReceivedTradeSide(trade);
      // Trade card separator:
      // adds a visible divider before later cards in a season without changing
      // the transaction content or analysis-side DOM.
      const divider = index > 0
        ? '<div class="leaguehub-trade-entry-divider" aria-hidden="true"><span></span></div>'
        : '';
      return `
        <article class="leaguehub-trade-entry">
          ${divider}
          <header class="leaguehub-trade-entry-head">
            <p class="leaguehub-trade-entry-stamp">${escapeHtml(trade.dateLabel)} | ${trade.assetCount} asset${trade.assetCount === 1 ? '' : 's'} | ${escapeHtml(trade.season)}</p>
            <h4 class="leaguehub-trade-entry-title">${escapeHtml(renderSides.map((side) => side.teamName).join(' vs '))}</h4>
          </header>
          <div class="leaguehub-trade-entry-body ${isMultiRoster ? 'is-multi-team' : ''}">
            ${renderSides.map((side, sideIndex) => renderTradeSide(side, sideIndex, trade, side === greaterReceivedSide)).join('')}
          </div>
        </article>`;
    }

    // Trade-side received-value comparison:
    // evaluates every season with total KTC across the complete package so
    // archive filters never move the highlight. Exact ties stay unhighlighted.
    function getGreaterReceivedTradeSide(trade) {
      const evaluatedSides = (trade?.sides || [])
        .map((side) => ({ side, value: getTradeSideReceivedValue(side) }))
        .filter((entry) => Number.isFinite(entry.value));
      if (evaluatedSides.length < 2) return null;
      const greatestValue = Math.max(...evaluatedSides.map((entry) => entry.value));
      const leaders = evaluatedSides.filter((entry) => Math.abs(entry.value - greatestValue) < 0.0001);
      return leaders.length === 1 ? leaders[0].side : null;
    }

    function getTradeSideReceivedValue(side) {
      const incomingAssets = side?.incomingAssets || [];
      return incomingAssets.reduce((sum, asset) => sum + (Number(asset?.ktc) || 0), 0);
    }

    function getTradeRenderSides(trade) {
      const selectedOwnerId = state.trades.selectedMember;
      if (!selectedOwnerId || selectedOwnerId === 'ALL') return trade.sides;
      const selectedIndex = trade.sides.findIndex((side) => side.ownerId === String(selectedOwnerId));
      if (selectedIndex <= 0) return trade.sides;
      return [
        trade.sides[selectedIndex],
        ...trade.sides.filter((side, index) => index !== selectedIndex),
      ];
    }

    function renderTradeSide(side, index, trade, hasGreaterReceivedValue = false) {
      const selectedOwnerId = state.trades.selectedMember;
      const isSelected = selectedOwnerId !== 'ALL' && side.ownerId === String(selectedOwnerId);
      const visibleAssets = getVisibleAssetsForSide(side);
      const completeIncomingAssets = side?.incomingAssets || [];
      const avgPpg = averageNumbers(completeIncomingAssets
        .filter((asset) => asset.type === 'player' && asset.hasSeasonData)
        .map((asset) => asset.stats?.ppg));
      const totalKtc = getTradeSideReceivedValue(side);
      const productionSeason = getTradeProductionSeason(trade?.season);
      const sideClass = [
        index % 2 === 0 ? 'is-primary' : 'is-secondary',
        isSelected ? 'is-selected-member' : '',
        hasGreaterReceivedValue ? 'has-greater-received-value' : '',
      ].filter(Boolean).join(' ');
      const meta = [
        side.receivedPlayers ? `${side.receivedPlayers} player${side.receivedPlayers === 1 ? '' : 's'}` : '',
        side.receivedPicks ? `${side.receivedPicks} pick${side.receivedPicks === 1 ? '' : 's'}` : '',
        side.receivedFaab ? `${side.receivedFaab} FAAB` : '',
      ].filter(Boolean).join(' | ') || 'No visible receives';
      const productionSummary = Number.isFinite(avgPpg)
        ? `${formatOptionalNumber(avgPpg, 1)} PPG · ${productionSeason}`
        : `${productionSeason} stats unavailable`;
      const packageTotal = `
            <span class="leaguehub-trade-package-total-label">Received KTC</span>
            <span class="leaguehub-trade-package-total-value" style="color:${getTradeKtcColor(totalKtc)}">${formatNumber(totalKtc)}</span>
            <span class="leaguehub-trade-package-total-sub">${escapeHtml(productionSummary)}</span>`;

      return `
        <section class="leaguehub-trade-package ${sideClass}">
          <header class="leaguehub-trade-package-head">
            <div class="leaguehub-trade-package-title">
              <strong>${escapeHtml(side.teamName)}</strong>
              <span>${escapeHtml(meta)}</span>
            </div>
            <div class="leaguehub-trade-package-total">
              ${isSelected ? '<span class="leaguehub-trade-selected-pill">Selected Team</span>' : ''}
              ${packageTotal}
            </div>
          </header>
          <div class="leaguehub-trade-package-assets">
            ${visibleAssets.length
              ? visibleAssets.map((asset) => renderTradeAsset(asset)).join('')
              : '<p class="leaguehub-trade-empty-note">No visible assets match the current filters.</p>'}
          </div>
        </section>`;
    }

    function getVisibleAssetsForSide(side) {
      const assetType = state.trades.selectedAssetType;
      const searchTerm = (state.trades.searchTerm || '').trim().toLowerCase();
      const incomingAssets = side.incomingAssets || [];
      const filtered = incomingAssets.filter((asset) => {
        if (assetType && assetType !== 'ALL' && asset.type !== assetType) return false;
        if (searchTerm && !(asset.searchTokens || []).join(' ').toLowerCase().includes(searchTerm)) return false;
        return true;
      });
      if (filtered.length || assetType !== 'ALL') return filtered;
      return searchTerm ? incomingAssets : filtered;
    }

    function renderTradeAsset(asset) {
      if (asset.type === 'player') return renderTradePlayerAsset(asset);
      if (asset.type === 'pick') return renderTradePickAsset(asset);
      return renderTradeFaabAsset(asset);
    }

    function renderTradePlayerAsset(asset) {
      const stats = asset.stats || {};
      const pos = String(asset.badge || '').toUpperCase();
      const ppgColor = getTradePositionRankColor(stats.ppgPosRank, pos);
      const fptsColor = getTradePositionRankColor(stats.fptsPosRank, pos);
      const ppgOverallColor = getTradeOverallRankColor(stats.ppgOverallRank);
      const fptsOverallColor = getTradeOverallRankColor(stats.fptsOverallRank);
      const ageColor = getTradeAgeColor(pos, stats.age);
      const mainValueColor = getTradeKtcColor(asset.ktc);
      const mainValue = `${formatNumber(Number(asset.ktc) || 0)} KTC`;
      return `
        <div class="leaguehub-trade-asset-row is-player">
          <span class="leaguehub-trade-asset-badge ${pos}">${escapeHtml(pos || 'PLYR')}</span>
          <div class="leaguehub-trade-asset-content">
            <div class="leaguehub-trade-asset-line">
              <span class="leaguehub-trade-asset-identity">
                <span class="leaguehub-trade-asset-name">${escapeHtml(asset.title)}</span>
                ${renderTradePlayerSubtitle(asset, pos)}
              </span>
              <span class="leaguehub-trade-asset-main" style="color:${mainValueColor}">${escapeHtml(mainValue)}</span>
            </div>
            <div class="leaguehub-trade-stat-grid">
              ${renderTradeMetricChip('FPTS', formatOptionalNumber(stats.fpts, 1), fptsColor)}
              ${renderTradeMetricChip('FPTS RK', formatRankText(stats.fptsOverallRank), fptsOverallColor)}
              ${renderTradeMetricChip('PPG RK', formatRankText(stats.ppgOverallRank), ppgOverallColor)}
              ${renderTradeMetricChip('POS FPTS', stats.fptsPosRankText || '—', fptsColor)}
              ${renderTradeMetricChip('POS PPG', stats.ppgPosRankText || '—', ppgColor)}
              ${renderTradeMetricChip('AGE', formatOptionalNumber(stats.age, 1), ageColor)}
            </div>
          </div>
        </div>`;
    }

    function renderTradePlayerSubtitle(asset, position) {
      const teams = Array.isArray(asset?.teams) ? asset.teams.filter(Boolean) : [];
      const teamLabel = teams.length ? teams.join(' and ') : (asset?.team || 'Free agent');
      const teamMarkup = teams.length
        ? teams.map((team) => renderTradeTeamLogo(team)).join('')
        : `<span class="leaguehub-trade-team-fallback">${escapeHtml(asset?.team === '2TM' ? '2 teams' : asset?.team || 'FA')}</span>`;
      const seasonLabel = asset?.hasSeasonData
        ? `${asset.productionSeason} stats`
        : `${asset.productionSeason || asset.tradeSeason} stats unavailable`;
      return `
        <span class="leaguehub-trade-asset-subtitle">
          <span class="leaguehub-trade-meta-position">${escapeHtml(position || 'PLYR')}</span>
          <span class="leaguehub-trade-meta-separator" aria-hidden="true">•</span>
          <span class="leaguehub-trade-team-logos" aria-label="${escapeHtml(teamLabel)}">${teamMarkup}</span>
          <span class="leaguehub-trade-meta-separator" aria-hidden="true">•</span>
          <span class="leaguehub-trade-meta-season">${escapeHtml(seasonLabel)}</span>
        </span>`;
    }

    function renderTradeTeamLogo(teamAbbr) {
      const team = String(teamAbbr || '').trim().toUpperCase();
      const logoKey = TRADE_TEAM_LOGO_KEY_MAP[team] || team.toLowerCase();
      return `<img class="leaguehub-trade-team-logo" src="../assets/NFL_logos_svg/${escapeHtml(logoKey)}.svg" alt="${escapeHtml(team)}" title="${escapeHtml(team)}" width="18" height="18" loading="lazy" decoding="async">`;
    }

    function renderTradePickAsset(asset) {
      const ktcColor = getTradeKtcColor(asset.ktc);
      return `
        <div class="leaguehub-trade-asset-row is-pick">
          <span class="leaguehub-trade-asset-badge is-pick">${escapeHtml(asset.badge)}</span>
          <div class="leaguehub-trade-asset-content">
            <div class="leaguehub-trade-asset-line">
              <span class="leaguehub-trade-asset-name">${escapeHtml(asset.title)}</span>
              <span class="leaguehub-trade-asset-main" style="color:${ktcColor}">${formatNumber(Number(asset.ktc) || 0)} KTC</span>
            </div>
            <div class="leaguehub-trade-asset-subtitle">${escapeHtml(asset.subtitle)}</div>
          </div>
        </div>`;
    }

    function renderTradeFaabAsset(asset) {
      return `
        <div class="leaguehub-trade-asset-row is-faab">
          <span class="leaguehub-trade-asset-badge is-faab">FAAB</span>
          <div class="leaguehub-trade-asset-content">
            <div class="leaguehub-trade-asset-line">
              <span class="leaguehub-trade-asset-name">${escapeHtml(asset.title)}</span>
            </div>
            <div class="leaguehub-trade-asset-subtitle">${escapeHtml(asset.subtitle)}</div>
          </div>
        </div>`;
    }

    function renderTradeMetricChip(label, value, color) {
      return `
        <span class="leaguehub-trade-stat-chip">
          <small>${escapeHtml(label)}</small>
          <strong style="color:${color || 'inherit'}">${escapeHtml(value)}</strong>
        </span>`;
    }

    function getTradeSideForOwner(trade, ownerId) {
      const ownerKey = String(ownerId || '');
      return (trade?.sides || []).find((side) => side.ownerId === ownerKey) || null;
    }

    function formatTradeDate(timestamp) {
      if (!Number.isFinite(Number(timestamp)) || Number(timestamp) <= 0) return 'Unknown date';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(Number(timestamp)));
    }

    function formatOptionalNumber(value, decimals = 1) {
      return Number.isFinite(value) ? value.toFixed(decimals) : '—';
    }

    function formatRankText(rank) {
      return Number.isFinite(rank) && rank > 0 ? `#${rank}` : '—';
    }

    function getTradeOverallRankColor(rank) {
      if (!Number.isFinite(rank) || rank <= 0) return 'rgba(213, 221, 248, 0.72)';
      const thresholds = [
        { v: 24, c: '#8BEBCDbb' },
        { v: 48, c: '#97EBE3ab' },
        { v: 72, c: '#7dd1ffaa' },
        { v: 96, c: '#48a6ffaa' },
        { v: 120, c: '#957cffbb' },
        { v: 156, c: '#a642ffbb' },
        { v: 180, c: '#cf60ffcc' },
        { v: 204, c: '#ff6fe1cc' },
        { v: 250, c: '#ff2eb2' },
      ];
      for (const threshold of thresholds) {
        if (rank <= threshold.v) return threshold.c;
      }
      return rank >= 300 ? '#656565' : '#ff0080';
    }

    function getTradePositionRankColor(rank, position) {
      if (!Number.isFinite(rank) || rank <= 0) return 'rgba(213, 221, 248, 0.72)';
      const thresholds = position === 'WR'
        ? [
          { v: 12, c: '#51CBA5' },
          { v: 24, c: '#34aabf' },
          { v: 36, c: '#4798fc' },
          { v: 48, c: '#957CFF' },
          { v: 60, c: '#FF6FE1' },
          { v: 72, c: '#FF2EB9' },
        ]
        : [
          { v: 8, c: '#51CBA5' },
          { v: 16, c: '#34aabf' },
          { v: 24, c: '#4798fc' },
          { v: 32, c: '#957CFF' },
          { v: 44, c: '#FF6FE1' },
          { v: 60, c: '#FF2EB2' },
        ];
      for (const threshold of thresholds) {
        if (rank <= threshold.v) return threshold.c;
      }
      return '#767693';
    }

    function getTradeKtcColor(value) {
      const scale = [
        { v: 9000, c: '#72edd0B3' },
        { v: 8000, c: '#58d5ceB3' },
        { v: 7000, c: '#5bdae8B3' },
        { v: 6000, c: '#6eb4ebB3' },
        { v: 5000, c: '#848bffB3' },
        { v: 4000, c: '#964effB3' },
        { v: 3000, c: '#ee42ffB3' },
        { v: 2000, c: '#d032aaB3' },
        { v: 0, c: '#f94ea4B3' },
      ];
      const numeric = Number(value) || 0;
      for (const tier of scale) {
        if (numeric >= tier.v) return tier.c;
      }
      return '#e0e6ed';
    }

    function getTradeAgeColor(position, age) {
      if (!Number.isFinite(age) || age <= 0) return 'rgba(213, 221, 248, 0.72)';
      const scale = position === 'QB'
        ? [
          { v: 25.5, c: '#00ffc4' },
          { v: 28, c: '#85fff3' },
          { v: 31, c: '#48a6ff' },
          { v: 36, c: '#a642ff' },
          { v: 44, c: '#ff6fe1' },
        ]
        : position === 'RB'
          ? [
            { v: 22.5, c: '#00ffc4' },
            { v: 24, c: '#85fff3' },
            { v: 26, c: '#7dd1ff' },
            { v: 28, c: '#957cff' },
            { v: 31, c: '#ff6fe1' },
          ]
          : [
            { v: 22.5, c: '#00ffc4' },
            { v: 25, c: '#85fff3' },
            { v: 27, c: '#7dd1ff' },
            { v: 30, c: '#957cff' },
            { v: 33, c: '#ff6fe1' },
          ];
      for (const tier of scale) {
        if (age <= tier.v) return tier.c;
      }
      return '#ff6fe1';
    }

    async function fetchWithCache(url) {
      if (state.cache[url]) {
        return state.cache[url];
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      state.cache[url] = data;
      return data;
    }

    async function fetchTextWithCache(url) {
      if (state.textCache[url]) {
        return state.textCache[url];
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      state.textCache[url] = text;
      return text;
    }

    function parseCsvRows(csvText) {
      if (!csvText) return [];
      const rows = [];
      let current = '';
      let row = [];
      let inQuotes = false;

      for (let index = 0; index < csvText.length; index += 1) {
        const char = csvText[index];
        const nextChar = csvText[index + 1];

        if (inQuotes) {
          if (char === '"' && nextChar === '"') {
            current += '"';
            index += 1;
          } else if (char === '"') {
            inQuotes = false;
          } else {
            current += char;
          }
          continue;
        }

        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(current);
          current = '';
        } else if (char === '\n') {
          row.push(current);
          rows.push(row);
          row = [];
          current = '';
        } else if (char !== '\r') {
          current += char;
        }
      }

      if (current || row.length) {
        row.push(current);
        rows.push(row);
      }

      const headers = (rows.shift() || []).map((header) => header.trim());
      return rows
        .filter((values) => values.some((value) => String(value || '').trim()))
        .map((values) => headers.reduce((acc, header, index) => {
          acc[header] = values[index] !== undefined ? String(values[index]).trim() : '';
          return acc;
        }, {}));
    }

    async function ensureTradeCareerStats() {
      if (state.tradeCareerStatsBySeason) return state.tradeCareerStatsBySeason;
      const [csvText, multiTeamCsvText] = await Promise.all([
        fetchTextWithCache(TRADE_CAREER_CSV_URL),
        fetchTextWithCache(TRADE_MULTI_TEAM_CSV_URL),
      ]);
      const bySeason = {};
      const teamHistoryBySeason = {};

      // Historical 2TM resolution:
      // the compact companion CSV is keyed by the same Sleeper ID + season as
      // the production file and supplies the two logo identities for that year.
      parseCsvRows(multiTeamCsvText).forEach((row) => {
        const season = String(row.SZN || '').trim();
        const playerId = String(row.SLPR_ID || '').trim();
        const teams = String(row.TEAMS || '')
          .split('|')
          .map((team) => team.trim().toUpperCase())
          .filter(Boolean);
        if (!season || !playerId || !teams.length) return;
        if (!teamHistoryBySeason[season]) teamHistoryBySeason[season] = {};
        teamHistoryBySeason[season][playerId] = teams;
      });

      parseCsvRows(csvText).forEach((row) => {
        const season = String(row.SZN || '').trim();
        const playerId = String(row.SLPR_ID || '').trim();
        if (!season || !playerId) return;
        if (!bySeason[season]) bySeason[season] = {};
        const team = String(row.TM || '').trim().toUpperCase();
        const teams = teamHistoryBySeason?.[season]?.[playerId]
          || (team && team !== '2TM' ? [team] : []);
        bySeason[season][playerId] = {
          playerId,
          season,
          name: row.PLAYER || '',
          pos: String(row.POS || '').toUpperCase(),
          team,
          teams,
          games: parseOptionalNumber(row.G),
          fpts: parseOptionalNumber(row.FPTS),
          ppg: parseOptionalNumber(row.PPG),
          fptsOverallRank: parseOptionalNumber(row['FPTS RK']),
          ppgOverallRank: parseOptionalNumber(row['PPG RK']),
          fptsPosRankText: normalizeTradePosRankText(row['FPTS POS RK']),
          ppgPosRankText: normalizeTradePosRankText(row['PPG POS RK']),
          fptsPosRank: parsePosRankNumber(row['FPTS POS RK']),
          ppgPosRank: parsePosRankNumber(row['PPG POS RK']),
          age: parseOptionalNumber(row.Age),
        };
      });

      state.tradeTeamHistoryBySeason = teamHistoryBySeason;
      state.tradeCareerStatsBySeason = bySeason;
      return bySeason;
    }

    async function fetchSleeperPlayers() {
      if (Object.keys(state.players).length > 0) return;
      state.players = await fetchWithCache('/api/sleeper/players/nfl');
    }

    async function fetchKTCData() {
      if (Object.keys(state.ktcOneQb).length > 0) return;

      const GOOGLE_SHEET_ID = '1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0';
      const parseCsvData = async (sheet) => {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`);
        if (!response.ok) throw new Error('Failed to load KTC data.');
        return response.text();
      };

      const [oneQbCsv, sflxCsv] = await Promise.all([
        parseCsvData('KTC_1QB'),
        parseCsvData('KTC_SFLX'),
      ]);

      state.ktcOneQb = parseKtcCsv(oneQbCsv);
      state.ktcSflx = parseKtcCsv(sflxCsv);
    }

    function parseKtcCsv(csvText) {
      if (!csvText) return {};
      const lines = csvText.split('\n').filter(Boolean);
      if (lines.length <= 1) return {};

      const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
          const char = line[i];
          if (inQuotes) {
            if (char === '"' && line[i + 1] === '"') {
              current += '"';
              i += 1;
            } else if (char === '"') {
              inQuotes = false;
            } else {
              current += char;
            }
          } else if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const normalize = (header) => header.replace(/[\u00a0\u202f]/g, ' ').trim().toUpperCase();
      const headers = parseLine(lines[0]);
      const headerIndex = new Map();
      headers.forEach((header, idx) => {
        headerIndex.set(normalize(header), idx);
      });

      const getValue = (columns, names) => {
        const keys = Array.isArray(names) ? names : [names];
        for (const key of keys) {
          const index = headerIndex.get(normalize(key));
          if (index !== undefined && columns[index] !== undefined) {
            return columns[index].trim();
          }
        }
        return '';
      };

      const toInt = (value) => {
        const num = parseInt(value, 10);
        return Number.isNaN(num) ? null : num;
      };

      const dataMap = {};
      lines.slice(1).forEach((line) => {
        const columns = parseLine(line);
        if (!columns.length) return;

        const pos = getValue(columns, 'POS');
        const sleeperId = getValue(columns, 'SLPR_ID');
        const ktcValue = toInt(getValue(columns, ['VALUE', 'KTC']));

        if (pos === 'RDP') {
          const pickName = getValue(columns, 'PLAYER NAME');
          if (pickName) {
            dataMap[pickName] = { ktc: ktcValue ?? 0 };
          }
          return;
        }

        if (!sleeperId || sleeperId === 'NA') return;
        dataMap[sleeperId] = { ktc: ktcValue ?? 0 };
      });

      return dataMap;
    }

    async function fetchUserAndLeagues(username) {
      const user = await fetchWithCache(`https://api.sleeper.app/v1/user/${username}`);
      if (!user || !user.user_id) {
        throw new Error('Sleeper user not found.');
      }
      const nextUserId = user.user_id;

      const currentYear = new Date().getFullYear();
      const leagues = await fetchWithCache(`https://api.sleeper.app/v1/user/${nextUserId}/leagues/nfl/${currentYear}`);
      if (!Array.isArray(leagues) || leagues.length === 0) {
        throw new Error('No active leagues found for this user in the current season.');
      }

      // Analyzer league source:
      // targets the analyzer dropdown and every chart/table driven by the selected league.
      // Reuse the shared dynasty-only filter from `app.js` when available so analyzer stays
      // in sync with Rosters, Ownership, and the Stats modal; fall back to the same Sleeper
      // `settings.type = 2` rule if the shared helper is unavailable.
      const dynastyOnlyLeagues = (typeof window !== 'undefined' && typeof window.filterDynastyLeagues === 'function')
        ? window.filterDynastyLeagues(leagues)
        : leagues.filter((league) => Number.parseInt(league?.settings?.type, 10) === 2);
      if (dynastyOnlyLeagues.length === 0) {
        throw new Error('No active dynasty leagues found for this user in the current season.');
      }

      // Username switch commit point:
      // do not replace the active LeagueHub identity until Sleeper has returned
      // a valid dynasty league set, allowing Change user -> Go back to be lossless.
      state.userId = nextUserId;
      state.leagues = dynastyOnlyLeagues.sort((a, b) => a.name.localeCompare(b.name));
      populateLeagueSelect(state.leagues);
    }

    async function ensurePlayerStats(season) {
      if (state.playerStatsSeason === season && Object.keys(state.playerStats).length > 0) {
        return;
      }
      const url = `https://api.sleeper.app/v1/stats/nfl/regular/${season}`;
      const rawStats = await fetchWithCache(url);
      state.playerStats = transformSeasonStats(rawStats);
      state.playerStatsSeason = season;
    }

    /**
     * Fetch league-specific FPTS & PPG by aggregating per-player points
     * from every regular-season matchup week (1–18).
     * Each matchup entry contains a `players_points` object keyed by
     * player ID with the fantasy points scored under that league's
     * scoring settings.
     */
    async function fetchLeaguePlayerStats(leagueId) {
      const TOTAL_WEEKS = 18;
      const weekPromises = [];
      for (let week = 1; week <= TOTAL_WEEKS; week += 1) {
        weekPromises.push(
          fetchWithCache(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
            .catch(() => null),
        );
      }
      const allWeeks = await Promise.all(weekPromises);

      const aggregated = {}; // playerId -> { total, games }

      allWeeks.forEach((weekMatchups) => {
        if (!Array.isArray(weekMatchups)) return;
        weekMatchups.forEach((entry) => {
          const pointsMap = entry.players_points;
          if (!pointsMap || typeof pointsMap !== 'object') return;
          Object.entries(pointsMap).forEach(([playerId, pts]) => {
            const points = toNumber(pts);
            if (!aggregated[playerId]) {
              aggregated[playerId] = { total: 0, games: 0 };
            }
            aggregated[playerId].total += points;
            // Count a game played if the player scored any non-zero points
            if (points !== 0) {
              aggregated[playerId].games += 1;
            }
          });
        });
      });

      // Compute PPG
      const result = {};
      Object.entries(aggregated).forEach(([playerId, data]) => {
        const ppg = data.games > 0 ? data.total / data.games : 0;
        result[playerId] = {
          total: data.total,
          games: data.games,
          ppg,
        };
      });

      state.leaguePlayerStats = result;
    }

    function transformSeasonStats(rawStats) {
      const result = {};
      if (!rawStats) return result;

      const processEntry = (playerId, stats) => {
        if (!playerId || !stats) return;
        const total = toNumber(stats.pts_ppr ?? stats.fpts_ppr ?? stats.fpts ?? 0);
        const games = toNumber(stats.gp ?? stats.games_played ?? stats.gm ?? 0);
        const ppg = games > 0 ? total / games : 0;
        result[playerId] = {
          total,
          games,
          ppg,
        };
      };

      if (Array.isArray(rawStats)) {
        rawStats.forEach((entry) => {
          if (!entry) return;
          const playerId = entry.player_id || entry.playerId || entry.id;
          processEntry(playerId, entry);
        });
      } else if (typeof rawStats === 'object') {
        Object.entries(rawStats).forEach(([playerId, stats]) => {
          processEntry(playerId, stats);
        });
      }

      return result;
    }

    function toNumber(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function parseOptionalNumber(value) {
      const cleaned = String(value ?? '').replace(/,/g, '').trim();
      if (!cleaned || cleaned === '-' || cleaned.toUpperCase() === 'NA') return null;
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : null;
    }

    function parsePosRankNumber(value) {
      const match = String(value ?? '').match(/(\d+)/);
      if (!match) return null;
      const parsed = Number.parseInt(match[1], 10);
      return Number.isFinite(parsed) ? parsed : null;
    }

    function normalizeTradePosRankText(value) {
      const text = String(value ?? '').replace(/[\u202f\u00a0]/g, ' ').trim();
      if (!text || text === '-' || text.toUpperCase() === 'NA') return '—';
      return text.replace(/\s*·\s*/g, '·').replace(/\s+/g, '');
    }

    function getPlayerAge(playerInfo, asOfDate = new Date()) {
      if (!playerInfo) return null;

      const birthDateValue = playerInfo.birth_date;
      if (birthDateValue) {
        const birthDate = new Date(`${birthDateValue}T00:00:00Z`);
        const asOf = asOfDate instanceof Date ? asOfDate : new Date(asOfDate);
        const birthTime = birthDate.getTime();
        const asOfTime = asOf.getTime();
        if (Number.isFinite(birthTime) && Number.isFinite(asOfTime) && asOfTime > birthTime) {
          const age = (asOfTime - birthTime) / (365.2425 * 24 * 60 * 60 * 1000);
          return age > 0 ? age : null;
        }
      }

      const sleeperAge = Number(playerInfo.age);
      return Number.isFinite(sleeperAge) && sleeperAge > 0 ? sleeperAge : null;
    }

    function averageNumbers(values) {
      const validValues = (values || []).filter((value) => Number.isFinite(value));
      if (!validValues.length) return null;
      return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
    }

    function averagePlayerAge(playerIds = [], asOfDate = new Date()) {
      return averageNumbers(
        playerIds
          .map((playerId) => getPlayerAge(state.players[playerId], asOfDate))
          .filter((age) => Number.isFinite(age)),
      );
    }

    // LeagueHub derived lineup age helpers:
    // targets summary cards and league-table age columns so those values use the
    // same starter selection as the Starting Lineup Overview chart toggles.
    function getDerivedLineupPlayerIds(lineup) {
      return (lineup?.assignments || [])
        .map((assignment) => assignment?.player?.id)
        .filter(Boolean);
    }

    function countDerivedLineupPlayers(lineup) {
      return getDerivedLineupPlayerIds(lineup).length;
    }

    function averageDerivedLineupAge(lineup, asOfDate = new Date()) {
      return averagePlayerAge(getDerivedLineupPlayerIds(lineup), asOfDate);
    }

    function formatRecordLine(wins, losses, ties) {
      return ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
    }

    function formatWinPctDisplay(wins, losses, ties) {
      return `${(computeWinPct(wins, losses, ties) * 100).toFixed(1)}%`;
    }

    function compareOptionalNumbers(a, b, direction = 'desc') {
      const aValid = Number.isFinite(a);
      const bValid = Number.isFinite(b);
      if (!aValid && !bValid) return 0;
      if (!aValid) return 1;
      if (!bValid) return -1;
      return direction === 'asc' ? a - b : b - a;
    }

    function compareTextValues(a, b, direction = 'desc') {
      const left = String(a || '');
      const right = String(b || '');
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    }

    function compareRecordFields(a, b, direction, prefix) {
      const prefixKey = prefix || 'season';
      const pctResult = compareOptionalNumbers(a[`${prefixKey}WinPctValue`], b[`${prefixKey}WinPctValue`], direction);
      if (pctResult !== 0) return pctResult;

      const winsResult = compareOptionalNumbers(a[`${prefixKey}Wins`], b[`${prefixKey}Wins`], direction);
      if (winsResult !== 0) return winsResult;

      const lossesResult = compareOptionalNumbers(a[`${prefixKey}Losses`], b[`${prefixKey}Losses`], direction === 'asc' ? 'desc' : 'asc');
      if (lossesResult !== 0) return lossesResult;

      return compareOptionalNumbers(a[`${prefixKey}Ties`], b[`${prefixKey}Ties`], direction);
    }

    // Analyzer league table sorting helpers:
    // apply client-side ordering to the rendered standings rows while preserving each
    // row's original season rank value for the RK column.
    function sortRenderedStandingsRows(rows = []) {
      const sortKey = state.standingsSort?.key || null;
      const sortDirection = state.standingsSort?.direction || null;
      if (!sortKey || !sortDirection) return rows;

      return [...rows].sort((a, b) => {
        let result = 0;

        switch (sortKey) {
          case 'rank':
            result = compareOptionalNumbers(a.seasonRank, b.seasonRank, sortDirection);
            break;
          case 'teamName':
            result = compareTextValues(a.teamName, b.teamName, sortDirection);
            break;
          case 'seasonRecord':
            result = compareRecordFields(a, b, sortDirection, 'season');
            break;
          case 'pf':
            result = compareOptionalNumbers(a.pf, b.pf, sortDirection);
            break;
          case 'pa':
            result = compareOptionalNumbers(a.pa, b.pa, sortDirection);
            break;
          case 'careerRecord':
            result = compareRecordFields(a, b, sortDirection, 'career');
            break;
          case 'careerWinPct':
            result = compareOptionalNumbers(a.careerWinPctValue, b.careerWinPctValue, sortDirection);
            break;
          case 'championships':
            result = compareOptionalNumbers(a.championships, b.championships, sortDirection);
            break;
          case 'teamAvgAge':
            result = compareOptionalNumbers(a.teamAvgAge, b.teamAvgAge, sortDirection);
            break;
          case 'startersAvgAge':
            result = compareOptionalNumbers(a.startersAvgAge, b.startersAvgAge, sortDirection);
            break;
          default:
            result = 0;
        }

        if (result !== 0) return result;
        return a.seasonRank - b.seasonRank;
      });
    }

    function syncStandingsSortHeaders() {
      const standingsTables = [elements.standingsFrozenTable, elements.standingsTable].filter(Boolean);
      if (!standingsTables.length) return;
      const activeKey = state.standingsSort?.key || null;
      const activeDirection = state.standingsSort?.direction || null;

      standingsTables.forEach((standingsTable) => {
        standingsTable.querySelectorAll('th[data-sort-key]').forEach((headerCell) => {
          const headerKey = headerCell.dataset.sortKey || null;
          const isActive = activeKey && activeKey === headerKey;
          const ariaSort = isActive
            ? (activeDirection === 'asc' ? 'ascending' : 'descending')
            : 'none';
          headerCell.setAttribute('aria-sort', ariaSort);

          const button = headerCell.querySelector('.analyzer-standings-sort');
          if (!button) return;

          button.classList.toggle('is-active', Boolean(isActive));
          button.dataset.sortDirection = isActive ? activeDirection : 'none';
        });
      });
    }

    function resolveWinnerRosterId(winnersBracket) {
      if (!Array.isArray(winnersBracket) || !winnersBracket.length) return null;
      const maxRound = Math.max(...winnersBracket.map((match) => Number(match?.r) || 0));
      const finals = winnersBracket.filter((match) => (Number(match?.r) || 0) === maxRound);
      const champMatch = finals.find((match) => Number(match?.p) === 1);
      if (champMatch?.w) return champMatch.w;
      if (finals.length === 1 && finals[0]?.w) return finals[0].w;
      return null;
    }

    // Analyzer data-source routing:
    // keeps current rosters/current ownership for roster-based visuals, while preserving
    // the completed-season source for standings plus 2025 scoring data in offseason leagues.
    function resolveAnalyzerSources(leagueInfo) {
      const rosterLeagueId = leagueInfo?.league_id || null;
      const season = Number.parseInt(leagueInfo?.season, 10);
      const previousLeagueId = leagueInfo?.previous_league_id || null;
      const statsSeason = Number.isFinite(season) && season <= 2025 ? season : 2025;
      const usePreviousSeason = Boolean(previousLeagueId && Number.isFinite(season) && season > statsSeason);
      const completedSeasonLeagueId = usePreviousSeason ? previousLeagueId : rosterLeagueId;

      return {
        rosterLeagueId,
        ppgLeagueId: completedSeasonLeagueId,
        standingsLeagueId: completedSeasonLeagueId,
        statsSeason,
      };
    }

    function resolveChampionSourceLeagueId(leagueInfo) {
      return resolveAnalyzerSources(leagueInfo).standingsLeagueId;
    }

    // Analyzer league history lookup:
    // walks the selected league's previous_league_id chain so the standings card can
    // aggregate career totals without relying on shared app.js history helpers.
    async function fetchAnalyzerLeagueHistory(leagueInfo) {
      const rootLeagueId = leagueInfo?.league_id;
      if (!rootLeagueId) return [];

      if (state.leagueHistoryCache[rootLeagueId]) {
        return state.leagueHistoryCache[rootLeagueId];
      }

      const history = [];
      const visitedLeagueIds = new Set();
      let currentLeague = leagueInfo;

      while (currentLeague?.league_id && !visitedLeagueIds.has(currentLeague.league_id)) {
        history.push(currentLeague);
        visitedLeagueIds.add(currentLeague.league_id);

        if (!currentLeague.previous_league_id) break;

        try {
          currentLeague = await fetchWithCache(`https://api.sleeper.app/v1/league/${currentLeague.previous_league_id}`);
        } catch (error) {
          console.warn('Analyzer league history lookup failed:', error);
          break;
        }
      }

      state.leagueHistoryCache[rootLeagueId] = history;
      return history;
    }

    // Analyzer career stats aggregation:
    // sums all-time record and titles across the selected league's linked history chain,
    // keyed to the standings rows by owner_id so the new career section can render inline.
    async function fetchAnalyzerCareerStats(leagueInfo) {
      const rootLeagueId = leagueInfo?.league_id;
      if (!rootLeagueId) return {};

      if (state.careerStatsCache[rootLeagueId]) {
        return state.careerStatsCache[rootLeagueId];
      }

      const leagueHistory = await fetchAnalyzerLeagueHistory(leagueInfo);
      const seasonResults = await Promise.all(
        leagueHistory.map(async (historyLeague) => {
          try {
            const [rosters, winnersBracket] = await Promise.all([
              fetchWithCache(`https://api.sleeper.app/v1/league/${historyLeague.league_id}/rosters`),
              fetchWithCache(`https://api.sleeper.app/v1/league/${historyLeague.league_id}/winners_bracket`)
                .catch(() => []),
            ]);

            return {
              rosters: Array.isArray(rosters) ? rosters : [],
              winnerRosterId: resolveWinnerRosterId(winnersBracket),
            };
          } catch (error) {
            console.warn(`Analyzer career stats failed for league ${historyLeague?.league_id}:`, error);
            return null;
          }
        }),
      );

      const careerStatsByOwner = {};
      seasonResults.forEach((seasonResult) => {
        if (!seasonResult) return;

        seasonResult.rosters.forEach((roster) => {
          const ownerId = roster?.owner_id;
          if (!ownerId) return;

          const settings = roster.settings || {};
          const wins = toNumber(settings.wins);
          const losses = toNumber(settings.losses);
          const ties = toNumber(settings.ties);
          const existing = careerStatsByOwner[ownerId] || {
            wins: 0,
            losses: 0,
            ties: 0,
            championships: 0,
            hasData: false,
          };

          existing.wins += wins;
          existing.losses += losses;
          existing.ties += ties;
          existing.hasData = true;

          if (seasonResult.winnerRosterId && seasonResult.winnerRosterId === roster.roster_id) {
            existing.championships += 1;
          }

          careerStatsByOwner[ownerId] = existing;
        });
      });

      state.careerStatsCache[rootLeagueId] = careerStatsByOwner;
      return careerStatsByOwner;
    }

    // Analyzer champion lookup:
    // mirrors the rosters bracket winner lookup but stays self-contained so the
    // standings crown does not rely on app.js or shared roster rendering state.
    async function fetchAnalyzerChampionData(leagueInfo) {
      const sourceLeagueId = resolveChampionSourceLeagueId(leagueInfo);
      if (!sourceLeagueId) return null;

      if (state.championCache[sourceLeagueId]) {
        return state.championCache[sourceLeagueId];
      }

      try {
        const [rosters, winnersBracket] = await Promise.all([
          fetchWithCache(`https://api.sleeper.app/v1/league/${sourceLeagueId}/rosters`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${sourceLeagueId}/winners_bracket`),
        ]);

        const winnerRosterId = resolveWinnerRosterId(winnersBracket);

        const rostersByOwner = {};
        (Array.isArray(rosters) ? rosters : []).forEach((roster) => {
          if (!roster?.owner_id) return;
          rostersByOwner[roster.owner_id] = roster;
        });

        const result = { sourceLeagueId, rostersByOwner, winnerRosterId };
        state.championCache[sourceLeagueId] = result;
        return result;
      } catch (error) {
        console.warn('Analyzer champion lookup failed:', error);
        const fallback = { sourceLeagueId, rostersByOwner: {}, winnerRosterId: null };
        state.championCache[sourceLeagueId] = fallback;
        return fallback;
      }
    }

    function applyChampionFlags(teams, championData) {
      return (teams || []).map((team) => {
        const previousRoster = championData?.rostersByOwner?.[team?.roster?.owner_id];
        const isChamp = Boolean(
          previousRoster
          && championData?.winnerRosterId
          && championData.winnerRosterId === previousRoster.roster_id,
        );
        return {
          ...team,
          isChamp,
        };
      });
    }

    async function analyzeLeague(leagueId, { preserveExistingContent = false } = {}) {
      try {
        setLoading(true, 'Analyzing league value and production...');
        if (!preserveExistingContent) hideContent();

        const leagueInfo = state.leagues.find((league) => league.league_id === leagueId);
        if (!leagueInfo) throw new Error('League not found.');
        const analyzerSources = resolveAnalyzerSources(leagueInfo);

        syncLeagueSelectValues(leagueId);
        state.currentLeagueId = leagueId;
        const qbSlots = leagueInfo.roster_positions.filter((slot) => slot === 'QB').length;
        const superflexSlots = leagueInfo.roster_positions.filter((slot) => slot === 'SUPER_FLEX').length;
        state.isSuperflex = qbSlots > 1 || superflexSlots > 0;

        await ensurePlayerStats(analyzerSources.statsSeason);
        await fetchLeaguePlayerStats(analyzerSources.ppgLeagueId);

        // Analyzer league fetch split:
        // current-season rosters drive ownership, values, and lineup construction, while the
        // completed-season source preserves standings plus 2025 PPG/FPTS context.
        const standingsDataPromise = analyzerSources.standingsLeagueId === analyzerSources.rosterLeagueId
          ? Promise.resolve([null, null])
          : Promise.all([
            fetchWithCache(`https://api.sleeper.app/v1/league/${analyzerSources.standingsLeagueId}/rosters`),
            fetchWithCache(`https://api.sleeper.app/v1/league/${analyzerSources.standingsLeagueId}/users`),
          ]);

        const [rosters, users, tradedPicks, championData, standingsData, careerStatsByOwner] = await Promise.all([
          fetchWithCache(`https://api.sleeper.app/v1/league/${analyzerSources.rosterLeagueId}/rosters`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${analyzerSources.rosterLeagueId}/users`),
          fetchWithCache(`https://api.sleeper.app/v1/league/${analyzerSources.rosterLeagueId}/traded_picks`),
          fetchAnalyzerChampionData(leagueInfo),
          standingsDataPromise,
          fetchAnalyzerCareerStats(leagueInfo),
        ]);

        resetTradeArchiveForLeague(leagueInfo, users, rosters);

        const radarSlots = buildRadarSlots(leagueInfo.roster_positions || []);
        const processed = processLeagueData(rosters, users, tradedPicks, leagueInfo, radarSlots);
        const [standingsRosters, standingsUsers] = standingsData;
        const standingsTeams = applyChampionFlags(
          processStandingsData(
            standingsRosters || rosters,
            standingsUsers || users,
          ),
          championData,
        );

        state.teams = processed.teams;
        state.standingsTeams = standingsTeams;
        state.careerStatsByOwner = careerStatsByOwner;
        state.leaderboards = processed.leaderboards;
        state.radarSlots = processed.radarSlots;

        renderSummaryStats(state.teams, state.standingsTeams);
        renderLineupChart(state.teams);
        renderOverallChart(state.teams);
        renderRadarChart(state.teams, state.radarSlots);
        renderStandings(state.standingsTeams);
        renderLeagueLeaders();

        elements.content.classList.remove('hidden');
        if (!elements.summaryStats.classList.contains('hidden')) {
          // already visible
        } else {
          elements.summaryStats.classList.remove('hidden');
        }
        if (state.trades.activeTab === 'trades') {
          await ensureTradeArchiveLoaded();
        }
        return true;
      } catch (error) {
        console.error('Analyze league error:', error);
        if (window.__dhUsernameGate?.isSubmitting?.()) {
          showLeagueHubGate({
            username: elements.usernameInput?.value || '',
            errorMessage: getLeagueHubGateErrorMessage(error),
            allowReturn: Boolean(state.usernameReturnSnapshot),
            returnUsername: state.usernameReturnSnapshot?.username || '',
          });
        } else {
          alert(`Failed to analyze league: ${error.message}`);
        }
        return false;
      } finally {
        setLoading(false);
      }
    }

    function processLeagueData(rosters, users, tradedPicks, leagueInfo, radarSlots = []) {
      const userMap = Array.isArray(users)
        ? users.reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {})
        : {};

      const leaderboards = { ALL: [], QB: [], RB: [], WR: [], TE: [] };
      const globalTotals = [];
      const slotSequence = Array.isArray(radarSlots) && radarSlots.length
        ? radarSlots
        : buildRadarSlots(leagueInfo?.roster_positions || []);
      const ageAsOfDate = new Date();

      const teams = (Array.isArray(rosters) ? rosters : []).map((roster) => {
        const owner = userMap[roster.owner_id] || userMap[roster.co_owner_id];
        const teamName = roster.metadata?.team_name || owner?.display_name || `Team ${roster.roster_id}`;

        const startersBySlot = {};
        SLOT_ORDER.forEach((slot) => {
          startersBySlot[slot] = { value: 0, ppg: 0, players: [] };
        });

        const startersValueByPos = { QB: 0, RB: 0, WR: 0, TE: 0 };
        const starterIds = roster.starters || [];
        const rosterPositions = leagueInfo.roster_positions || [];
        let topScorer = null;

        starterIds.forEach((playerId, index) => {
          const slotRaw = rosterPositions[index] || 'BN';
          const slot = normalizeSlot(slotRaw);
          if (!slot) return;
          if (!startersBySlot[slot]) {
            startersBySlot[slot] = { value: 0, ppg: 0, players: [] };
          }

          const playerInfo = state.players[playerId];
          const leagueStats = state.leaguePlayerStats[playerId] || {};
          const playerStats = state.playerStats[playerId] || {};
          const ktc = getKtcValue(playerId);
          const ppg = leagueStats.ppg ?? playerStats.ppg ?? 0;

          startersBySlot[slot].value += ktc;
          startersBySlot[slot].ppg += ppg;

          const playerName = formatPlayerName(playerInfo);
          startersBySlot[slot].players.push({ name: playerName, value: ktc, ppg });

          const pos = playerInfo?.position;
          if (pos && startersValueByPos[pos] !== undefined) {
            startersValueByPos[pos] += ktc;
          }
        });

        const overallPositional = { QB: 0, RB: 0, WR: 0, TE: 0, Picks: 0 };
        const allPlayers = (roster.players || [])
          .map((playerId) => {
            const playerInfo = state.players[playerId];
            const leagueStats = state.leaguePlayerStats[playerId] || {};
            const stats = state.playerStats[playerId] || {};
            const ktc = getKtcValue(playerId);
            const pos = playerInfo?.position;
            const ppg = leagueStats.ppg ?? stats.ppg ?? (stats.games ? stats.total / stats.games : 0);
            if (pos && overallPositional[pos] !== undefined) {
              overallPositional[pos] += ktc;
            }
            return {
              id: playerId,
              pos,
              ktc,
              ppg,
              name: formatPlayerName(playerInfo),
            };
          })
          .sort((a, b) => b.ktc - a.ktc);

        getOwnedPicks(roster.roster_id, rosters, tradedPicks, leagueInfo).forEach((pick) => {
          overallPositional.Picks += getKtcValue(pick.label);
        });

        // Analyzer lineup derivation:
        // rebuilds the lineup charts from league starter settings instead of Sleeper's
        // manual starter slots. FLEX pulls from leftover RB/WR/TE options, while
        // SUPER_FLEX only consumes the next remaining QB for the selected metric.
        const derivedLineups = {
          value: buildDerivedLineup(allPlayers, leagueInfo?.roster_positions || [], slotSequence, 'value'),
          ppg: buildDerivedLineup(allPlayers, leagueInfo?.roster_positions || [], slotSequence, 'ppg'),
        };

        const totalValue = Object.values(overallPositional).reduce((sum, value) => sum + value, 0);
        // LeagueHub summary starters:
        // reuse the chart-derived lineups so Starter Value follows the Value toggle,
        // while Starter PPG and its per-player average follow the PPG toggle.
        const derivedValueLineup = derivedLineups.value;
        const derivedPpgLineup = derivedLineups.ppg;
        const startersValueTotal = Number(derivedValueLineup?.totals?.value) || 0;
        const starterPpgTotal = Number(derivedPpgLineup?.totals?.ppg) || 0;
        const starterPlayerCount = countDerivedLineupPlayers(derivedPpgLineup);
        const starterPpgPerPlayer = starterPlayerCount > 0 ? starterPpgTotal / starterPlayerCount : 0;
        // LeagueHub roster age summaries:
        // target the summary-card strip and use Sleeper player birth dates from the
        // current roster/player source; starter age follows the value-derived chart lineup.
        const teamAvgAge = averagePlayerAge(roster.players || [], ageAsOfDate);
        const startersAvgAge = averageDerivedLineupAge(derivedValueLineup, ageAsOfDate);

        const settings = roster.settings || {};
        const wins = toNumber(settings.wins);
        const losses = toNumber(settings.losses);
        const ties = toNumber(settings.ties);
        const pf = combineScore(settings.fpts, settings.fpts_decimal);
        const pa = combineScore(settings.fpts_against, settings.fpts_against_decimal);
        const gamesPlayed = wins + losses + ties;
        const teamPpg = gamesPlayed > 0 ? pf / gamesPlayed : 0;

        const record = ties ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;

        (roster.players || []).forEach((playerId) => {
          const playerInfo = state.players[playerId];
          if (!playerInfo) return;
          const pos = playerInfo.position;
          if (!leaderboards[pos]) return;
          const leagueStats = state.leaguePlayerStats[playerId] || {};
          const stats = state.playerStats[playerId] || {};
          const total = leagueStats.total ?? stats.total ?? 0;
          const ppg = leagueStats.ppg ?? stats.ppg ?? (stats.games ? stats.total / stats.games : 0);
          if (total <= 0) return;
          if (!topScorer || total > topScorer.total) {
            topScorer = {
              playerId,
              name: formatPlayerName(playerInfo),
              total,
              ppg,
            };
          }
          globalTotals.push({ playerId, total });
          const entry = {
            playerId,
            name: formatPlayerName(playerInfo),
            pos,
            owner: teamName,
            nflTeam: playerInfo.team || '--',
            total,
            ppg,
          };
          leaderboards[pos].push(entry);
          leaderboards.ALL.push(entry);
        });

        return {
          teamName,
          roster,
          overallPositional,
          startersBySlot,
          startersValueByPos,
          allPlayers,
          derivedLineups,
          totalValue,
          startersValueTotal,
          starterPpgTotal,
          starterPlayerCount,
          starterPpgPerPlayer,
          teamAvgAge,
          startersAvgAge,
          wins,
          losses,
          ties,
          record,
          totalFpts: pf,
          pointsAgainst: pa,
          teamPpg,
          isUserTeam: roster.owner_id === state.userId,
          topScorer,
        };
      });

      const rankMap = {};
      globalTotals
        .filter((entry) => entry.total > 0)
        .sort((a, b) => b.total - a.total)
        .forEach((entry, index) => {
          if (!rankMap[entry.playerId]) {
            rankMap[entry.playerId] = index + 1;
          }
        });

      teams.forEach((team) => {
        if (team.topScorer?.playerId) {
          team.topScorer.rank = rankMap[team.topScorer.playerId] || null;
        }
      });

      Object.keys(leaderboards).forEach((pos) => {
        leaderboards[pos] = leaderboards[pos]
          .sort((a, b) => {
            if (b.total !== a.total) return b.total - a.total;
            if (b.ppg !== a.ppg) return b.ppg - a.ppg;
            return a.name.localeCompare(b.name);
          })
          .slice(0, 100);
      });

      teams.sort((a, b) => b.totalValue - a.totalValue);
      return { teams, leaderboards, radarSlots: slotSequence };
    }

    // Analyzer standings processing:
    // builds the standings-only dataset from the completed season so the standings table
    // and standings-based summary chips stay unchanged while roster ownership updates elsewhere.
    function processStandingsData(rosters, users) {
      const userMap = Array.isArray(users)
        ? users.reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {})
        : {};

      return (Array.isArray(rosters) ? rosters : []).map((roster) => {
        const owner = userMap[roster.owner_id] || userMap[roster.co_owner_id];
        const teamName = roster.metadata?.team_name || owner?.display_name || `Team ${roster.roster_id}`;
        const settings = roster.settings || {};
        const wins = toNumber(settings.wins);
        const losses = toNumber(settings.losses);
        const ties = toNumber(settings.ties);
        const pf = combineScore(settings.fpts, settings.fpts_decimal);
        const pa = combineScore(settings.fpts_against, settings.fpts_against_decimal);
        const record = formatRecordLine(wins, losses, ties);

        return {
          teamName,
          roster,
          wins,
          losses,
          ties,
          record,
          totalFpts: pf,
          pointsAgainst: pa,
          isUserTeam: roster.owner_id === state.userId,
        };
      });
    }

    function normalizeSlot(slot) {
      if (!slot) return null;
      if (SLOT_ORDER.includes(slot)) return slot;
      const normalized = SLOT_ALIASES[slot];
      if (normalized) return normalized;
      if (slot.includes('FLEX')) return 'FLEX';
      if (slot.includes('QB')) return 'QB';
      if (slot.includes('RB')) return 'RB';
      if (slot.includes('WR')) return 'WR';
      if (slot.includes('TE')) return 'TE';
      return null;
    }

    function buildRadarSlots(rosterPositions = []) {
      const counts = {};
      const slots = [];

      (rosterPositions || []).forEach((slot) => {
        const normalized = normalizeSlot(slot);
        if (!normalized || !RADAR_SLOT_TYPES.includes(normalized)) return;
        counts[normalized] = (counts[normalized] || 0) + 1;
        slots.push({
          type: normalized,
          label: buildRadarLabel(normalized, counts[normalized]),
        });
      });

      if (!slots.length) {
        ['QB', 'RB', 'WR', 'TE'].forEach((type) => {
          slots.push({ type, label: buildRadarLabel(type, 1) });
        });
      }

      return slots;
    }

    function buildRadarLabel(type, count) {
      switch (type) {
        case 'QB':
          return count > 1 ? `QB${count}` : 'QB';
        case 'RB':
          return `RB${count}`;
        case 'WR':
          return `WR${count}`;
        case 'TE':
          return count > 1 ? `TE${count}` : 'TE';
        case 'FLEX':
          return count > 1 ? `Flex ${count}` : 'Flex';
        case 'SUPER_FLEX':
          return count > 1 ? `SFlex ${count}` : 'SFlex';
        default:
          return type;
      }
    }

    function createDerivedSlotTotals() {
      const slotTotals = {};
      SLOT_ORDER.forEach((slot) => {
        slotTotals[slot] = { value: 0, ppg: 0, players: [] };
      });
      return slotTotals;
    }

    function compareDerivedCandidates(a, b, metricKey) {
      const primaryDiff = (Number(b?.[metricKey]) || 0) - (Number(a?.[metricKey]) || 0);
      if (primaryDiff !== 0) return primaryDiff;

      const secondaryKey = metricKey === 'ppg' ? 'ktc' : 'ppg';
      const secondaryDiff = (Number(b?.[secondaryKey]) || 0) - (Number(a?.[secondaryKey]) || 0);
      if (secondaryDiff !== 0) return secondaryDiff;

      return (a?.name || '').localeCompare(b?.name || '');
    }

    function buildDerivedLineup(players = [], rosterPositions = [], slotSequence = [], metric = 'value') {
      const orderedSlots = Array.isArray(slotSequence) && slotSequence.length
        ? slotSequence
        : buildRadarSlots(rosterPositions || []);
      const startersBySlot = createDerivedSlotTotals();
      const assignments = orderedSlots.map((slot) => ({ ...slot, score: 0, player: null }));
      const totals = { value: 0, ppg: 0 };

      if (!orderedSlots.length) {
        return { startersBySlot, assignments, totals };
      }

      const metricKey = metric === 'ppg' ? 'ppg' : 'ktc';
      const availableByPos = { QB: [], RB: [], WR: [], TE: [] };

      (players || []).forEach((player) => {
        if (!player?.pos || !availableByPos[player.pos]) return;
        availableByPos[player.pos].push({
          ...player,
          ktc: Number(player.ktc) || 0,
          ppg: Number(player.ppg) || 0,
        });
      });

      Object.keys(availableByPos).forEach((pos) => {
        availableByPos[pos].sort((a, b) => compareDerivedCandidates(a, b, metricKey));
      });

      const used = new Set();
      const indices = {};

      const takeAt = (pos, forcedIndex) => {
        const list = availableByPos[pos] || [];
        if (!list.length) return null;

        let idx = forcedIndex ?? indices[pos] ?? 0;
        while (idx < list.length && used.has(list[idx]?.id)) {
          idx += 1;
        }

        if (idx >= list.length) return null;
        indices[pos] = idx + 1;

        const player = list[idx];
        used.add(player.id);
        return player;
      };

      const peekNext = (pos) => {
        const list = availableByPos[pos] || [];
        let idx = indices[pos] ?? 0;
        while (idx < list.length && used.has(list[idx]?.id)) {
          idx += 1;
        }
        return { player: list[idx], index: idx };
      };

      const takeBestFlex = () => {
        let bestPlayer = null;
        let bestPos = null;
        let bestIndex = null;

        RADAR_FLEX_ELIGIBLE.forEach((pos) => {
          const { player, index } = peekNext(pos);
          if (!player) return;
          if (!bestPlayer || compareDerivedCandidates(player, bestPlayer, metricKey) < 0) {
            bestPlayer = player;
            bestPos = pos;
            bestIndex = index;
          }
        });

        if (!bestPlayer || !bestPos) return null;
        return takeAt(bestPos, bestIndex);
      };

      const applySelection = (slot, idx, selected) => {
        const playerValue = Number(selected.ktc) || 0;
        const playerPpg = Number(selected.ppg) || 0;
        const score = metric === 'ppg' ? playerPpg : playerValue;

        startersBySlot[slot.type].value += playerValue;
        startersBySlot[slot.type].ppg += playerPpg;
        startersBySlot[slot.type].players.push({
          name: selected.name,
          value: playerValue,
          ppg: playerPpg,
        });

        totals.value += playerValue;
        totals.ppg += playerPpg;

        assignments[idx] = {
          ...slot,
          score,
          player: {
            id: selected.id,
            name: selected.name,
            value: playerValue,
            ppg: playerPpg,
            score,
          },
        };
      };

      // Analyzer lineup slot filling:
      // exact position requirements are always filled before FLEX leftovers, so the chart
      // follows league starter counts even if Sleeper's slot array order varies.
      const fillSlots = (slotMatcher, takePlayer) => {
        orderedSlots.forEach((slot, idx) => {
          if (!slotMatcher(slot)) return;

          const selected = takePlayer(slot);
          if (!selected) {
            assignments[idx] = { ...slot, score: 0, player: null };
            return;
          }

          applySelection(slot, idx, selected);
        });
      };

      fillSlots((slot) => POSITION_ORDER.includes(slot.type), (slot) => takeAt(slot.type));
      fillSlots((slot) => slot.type === 'FLEX', () => takeBestFlex());
      fillSlots((slot) => slot.type === 'SUPER_FLEX', () => takeAt('QB'));

      return { startersBySlot, assignments, totals };
    }

    function formatPlayerName(playerInfo) {
      if (!playerInfo) return 'Unknown Player';
      if (playerInfo.full_name) return playerInfo.full_name;
      const first = playerInfo.first_name ? `${playerInfo.first_name} ` : '';
      const last = playerInfo.last_name || '';
      const name = `${first}${last}`.trim();
      return name || 'Unknown Player';
    }

    function combineScore(base, decimal) {
      const whole = toNumber(base);
      const fraction = typeof decimal === 'string' || typeof decimal === 'number'
        ? toNumber(decimal) / 100
        : 0;
      return whole + fraction;
    }

    function getKtcValue(id) {
      if (!id) return 0;
      const source = state.isSuperflex ? state.ktcSflx : state.ktcOneQb;
      return source[id]?.ktc ?? 0;
    }

    function getOwnedPicks(rosterId, allRosters, tradedPicks, leagueInfo) {
      const currentYear = new Date().getFullYear();
      const picks = [];
      const draftRounds = leagueInfo?.settings?.draft_rounds || 4;

      (allRosters || []).forEach((roster) => {
        for (let year = 1; year <= 4; year += 1) {
          const season = String(currentYear + year);
          for (let round = 1; round <= draftRounds; round += 1) {
            picks.push({
              season,
              round,
              roster_id: roster.roster_id,
              owner_id: roster.roster_id,
            });
          }
        }
      });

      (tradedPicks || []).forEach((trade) => {
        const pickIndex = picks.findIndex(
          (pick) => pick.season === trade.season && pick.round === trade.round && pick.roster_id === trade.roster_id,
        );
        if (pickIndex !== -1) {
          picks[pickIndex].owner_id = trade.owner_id;
        }
      });

      return picks
        .filter((pick) => pick.owner_id === rosterId)
        .sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round)
        .map((pick) => ({ ...pick, label: `${pick.season} Mid ${ordinal(pick.round)}` }));
    }

    function ordinal(i) {
      const j = i % 10;
      const k = i % 100;
      if (j === 1 && k !== 11) return `${i}st`;
      if (j === 2 && k !== 12) return `${i}nd`;
      if (j === 3 && k !== 13) return `${i}rd`;
      return `${i}th`;
    }

    function abbreviateFirstName(fullName) {
      if (typeof fullName !== 'string') return fullName || '';
      const trimmed = fullName.trim();
      if (!trimmed) return '';
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1) {
        return parts[0];
      }
      const [first, ...rest] = parts;
      const initial = first ? `${first.charAt(0).toUpperCase()}.` : '';
      const remainder = rest.join(' ');
      return remainder ? `${initial} ${remainder}`.trim() : initial;
    }

    function formatAge(value) {
      return Number.isFinite(value) ? value.toFixed(1) : '—';
    }

    // LeagueHub summary value markup:
    // targets the summary-card strip so visual prefixes/suffixes can be styled
    // independently without changing the underlying numeric text content.
    function formatRankingValue(rank) {
      return rank ? `<span class="chip-value-prefix">#</span><span class="chip-value-number">${rank}</span>` : '—';
    }

    function formatNumberWithSuffixMarkup(value, suffixClassName = 'chip-value-suffix') {
      const formatted = formatNumber(value);
      return formatted.replace(/([kMB])$/, `<span class="${suffixClassName}">$1</span>`);
    }

    function formatStarterPpgValue(totalPpg, perPlayerPpg) {
      return `<span class="chip-value-primary">${formatPpg(totalPpg)}</span><span class="chip-value-divider"> | </span><span class="chip-value-detail" aria-label="${formatPpg(perPlayerPpg)} average per starter"><span class="chip-value-detail-number">${formatPpg(perPlayerPpg)}</span><span class="chip-value-detail-suffix">avg</span></span>`;
    }

    function formatLeagueAverage(valueMarkup) {
      return `<span class="chip-avg-label">League Avg: </span><span class="chip-avg-value">${valueMarkup}</span>`;
    }

    function formatStarterPpgLeagueAverage(totalPpg, perPlayerPpg) {
      return `<span class="chip-avg-label">League Avg: </span><span class="chip-avg-value">${formatPpg(totalPpg)}</span><span class="chip-avg-separator"> | </span><span class="chip-avg-ppg"><span class="chip-avg-ppg-number">${formatPpg(perPlayerPpg)}</span></span>`;
    }

    // Analyzer summary chips:
    // combine current-roster analysis with preserved standings context so ownership/value
    // reflects the current league, while ranking and total FPTS remain tied to the completed season.
    function renderSummaryStats(teams, standingsTeams = teams) {
      const userTeam = teams.find((team) => team.isUserTeam);
      const standingsUserTeam = standingsTeams.find((team) => team.isUserTeam) || userTeam;
      if (!userTeam || !standingsUserTeam) {
        elements.summaryStats.classList.add('hidden');
        return;
      }

      const totalTeams = standingsTeams.length || teams.length;
      const standingsOrder = sortTeamsByStandings(standingsTeams);
      const overallRank = computeRank(standingsOrder, (team) => team.isUserTeam);

      const starterValueRank = computeRank(
        [...teams].sort((a, b) => b.startersValueTotal - a.startersValueTotal),
        (team) => team.isUserTeam,
      );

      const totalValueRank = computeRank(
        [...teams].sort((a, b) => b.totalValue - a.totalValue),
        (team) => team.isUserTeam,
      );

      const fptsRank = computeRank(
        [...standingsTeams].sort((a, b) => b.totalFpts - a.totalFpts),
        (team) => team.isUserTeam,
      );

      const starterPpgRank = computeRank(
        [...teams].sort((a, b) => b.starterPpgTotal - a.starterPpgTotal),
        (team) => team.isUserTeam,
      );

      const teamAvgAgeRank = computeRank(
        [...teams]
          .filter((team) => Number.isFinite(team.teamAvgAge))
          .sort((a, b) => a.teamAvgAge - b.teamAvgAge),
        (team) => team.isUserTeam,
      );

      const startersAvgAgeRank = computeRank(
        [...teams]
          .filter((team) => Number.isFinite(team.startersAvgAge))
          .sort((a, b) => a.startersAvgAge - b.startersAvgAge),
        (team) => team.isUserTeam,
      );

      const rankingValue = formatRankingValue(overallRank);
      // Ranking chip context:
      // presents the season record in the same meta row used by rank labels, and
      // moves team count into the footer row so the card matches the other summaries.
      const rankingRecord = standingsUserTeam.record || '—';
      const rankingMeta = `<span class="chip-meta-label">Record </span><span class="chip-meta-value">${escapeHtml(rankingRecord)}</span>`;
      const rankingTeamCount = totalTeams ? String(totalTeams) : '—';

      // Summary chip averages:
      // compute league-wide averages for each metric so each chip can show a contextual
      // average below the rank line. Ranking chip is excluded (no meaningful avg).
      const avgTotalValue = teams.length
        ? teams.reduce((s, t) => s + (t.totalValue || 0), 0) / teams.length
        : 0;
      const avgStarterValue = teams.length
        ? teams.reduce((s, t) => s + (t.startersValueTotal || 0), 0) / teams.length
        : 0;
      const avgTotalFpts = standingsTeams.length
        ? standingsTeams.reduce((s, t) => s + (t.totalFpts || 0), 0) / standingsTeams.length
        : 0;
      const avgStarterPpg = teams.length
        ? teams.reduce((s, t) => s + (t.starterPpgTotal || 0), 0) / teams.length
        : 0;
      const avgStarterPpgPerPlayer = averageNumbers(teams.map((t) => t.starterPpgPerPlayer)) ?? 0;
      const avgTeamAge = averageNumbers(teams.map((t) => t.teamAvgAge));
      const avgStartersAge = averageNumbers(teams.map((t) => t.startersAvgAge));
      const avgTopScorerFpts = (() => {
        const valid = teams.filter((t) => t.topScorer?.total > 0);
        return valid.length ? valid.reduce((s, t) => s + t.topScorer.total, 0) / valid.length : null;
      })();

      const topScorer = userTeam.topScorer;
      // Top scorer meta: FPTS label wrapped in a smaller span for visual hierarchy.
      const topScorerMeta = topScorer?.total
        ? `${topScorer.rank ? `Rank ${topScorer.rank}` : 'Rank NA'} • ${topScorer.total.toFixed(1)} <span class="chip-meta-unit">FPTS</span>`
        : 'No scoring data';

      const chips = [
        {
          label: 'Ranking',
          value: rankingValue,
          meta: rankingMeta,
          avg: `<span class="chip-avg-label">Teams: </span><span class="chip-avg-value">${rankingTeamCount}</span>`,
          accent: overallRank ? getRankColor(overallRank, totalTeams) : undefined,
          className: 'analyzer-chip--ranking',
        },
        {
          label: 'TTL Team Value',
          value: formatNumberWithSuffixMarkup(userTeam.totalValue),
          meta: totalValueRank ? `Rank ${totalValueRank}/${totalTeams}` : 'KTC',
          avg: formatLeagueAverage(formatNumberWithSuffixMarkup(avgTotalValue, 'chip-avg-value-suffix')),
          accent: totalValueRank ? getRankColor(totalValueRank, totalTeams) : undefined,
          className: 'analyzer-chip--total-value analyzer-chip--value-card',
        },
        {
          label: 'Starter Value',
          value: formatNumberWithSuffixMarkup(userTeam.startersValueTotal),
          meta: starterValueRank ? `Rank ${starterValueRank}/${totalTeams}` : 'Rank NA',
          avg: formatLeagueAverage(formatNumberWithSuffixMarkup(avgStarterValue, 'chip-avg-value-suffix')),
          accent: starterValueRank ? getRankColor(starterValueRank, totalTeams) : undefined,
          className: 'analyzer-chip--starter-value analyzer-chip--value-card',
        },
        {
          label: 'Total FPTS',
          value: standingsUserTeam.totalFpts.toFixed(1),
          meta: fptsRank ? `Rank ${fptsRank}/${totalTeams}` : 'Rank NA',
          avg: formatLeagueAverage(avgTotalFpts.toFixed(1)),
          accent: fptsRank ? getRankColor(fptsRank, totalTeams) : undefined,
          className: 'analyzer-chip--total-fpts',
        },
        {
          label: 'Starter PPG',
          value: formatStarterPpgValue(userTeam.starterPpgTotal, userTeam.starterPpgPerPlayer),
          valueClassName: 'chip-value--compound',
          meta: starterPpgRank ? `Rank ${starterPpgRank}/${totalTeams}` : 'Rank NA',
          avg: formatStarterPpgLeagueAverage(avgStarterPpg, avgStarterPpgPerPlayer),
          accent: starterPpgRank ? getRankColor(starterPpgRank, totalTeams) : undefined,
          className: 'analyzer-chip--starter-ppg',
        },
        {
          label: 'Team Avg Age',
          value: formatAge(userTeam.teamAvgAge),
          meta: teamAvgAgeRank ? `Rank ${teamAvgAgeRank}/${totalTeams}` : 'Rank NA',
          avg: formatLeagueAverage(formatAge(avgTeamAge)),
          accent: teamAvgAgeRank ? getRankColor(teamAvgAgeRank, totalTeams) : undefined,
          className: 'analyzer-chip--avg-age analyzer-chip--team-avg-age',
        },
        {
          label: 'Starters Avg Age',
          value: formatAge(userTeam.startersAvgAge),
          meta: startersAvgAgeRank ? `Rank ${startersAvgAgeRank}/${totalTeams}` : 'Rank NA',
          avg: formatLeagueAverage(formatAge(avgStartersAge)),
          accent: startersAvgAgeRank ? getRankColor(startersAvgAgeRank, totalTeams) : undefined,
          className: 'analyzer-chip--avg-age analyzer-chip--starters-avg-age',
        },
        {
          label: 'Top Scorer',
          value: topScorer?.name ? abbreviateFirstName(topScorer.name) : '—',
          meta: topScorerMeta,
          avg: avgTopScorerFpts != null ? formatLeagueAverage(avgTopScorerFpts.toFixed(1)) : null,
          accent: topScorer?.total ? 'var(--color-accent-secondary)' : undefined,
          className: 'analyzer-chip--top-scorer',
        },
      ];

      elements.summaryStats.innerHTML = chips
        .map((chip) => `
          <article class="analyzer-chip${chip.className ? ` ${chip.className}` : ''}">
            <span class="chip-label">${chip.label}</span>
            <span class="chip-value${chip.valueClassName ? ` ${chip.valueClassName}` : ''}"${chip.accent ? ` style="color: ${chip.accent};"` : ''}>${chip.value}</span>
            <span class="chip-meta">${chip.meta}</span>
            ${chip.avg ? `<span class="chip-avg">${chip.avg}</span>` : ''}
          </article>
        `)
        .join('');

      elements.summaryStats.classList.remove('hidden');
    }

    function renderLineupChart(teams) {
      state.lineupData = buildLineupDatasets(teams);
      if (state.charts.lineup) {
        state.charts.lineup.destroy();
      }
      const metricConfig = state.lineupData[state.currentLineupMetric];
      state.charts.lineup = createStackedBarChart(
        elements.startersCanvas,
        teams.map((team) => truncateLabel(team.teamName)),
        metricConfig.datasets,
        buildLineupOptions(metricConfig.max, state.currentLineupMetric, teams),
      );
    }

    function updateLineupChart() {
      if (!state.charts.lineup || !state.lineupData) return;
      const metricConfig = state.lineupData[state.currentLineupMetric];
      state.charts.lineup.data.datasets = metricConfig.datasets;
      const teamLabels = (state.teams || []).map((team) => truncateLabel(team.teamName));
      if (teamLabels.length) {
        state.charts.lineup.data.labels = teamLabels;
      }
      state.charts.lineup.options = applyAnalyzerChartRenderQuality(
        buildLineupOptions(
          metricConfig.max,
          state.currentLineupMetric,
          state.teams || [],
        ),
      );
      state.charts.lineup.update();
    }

    function updateRadarChart() {
      if (!state.teams?.length) return;
      renderRadarChart(state.teams, state.radarSlots);
    }

    function buildLineupDatasets(teams) {
      const createDatasetForMetric = (metric) => {
        const datasets = [];
        SLOT_ORDER.forEach((slot) => {
          const values = teams.map((team) => team.derivedLineups?.[metric]?.startersBySlot?.[slot]?.[metric] ?? 0);
          if (!values.some((value) => value > 0)) return;
          const colorSource = metric === 'value' ? LINEUP_VALUE_COLORS : LINEUP_PPG_COLORS;
          const hex = colorSource[slot] || colorSource.FLEX || '#37ebb5';
          const gradientPair = buildGradientPair(hex);
          datasets.push({
            label: SLOT_LABELS[slot] || slot,
            slotKey: slot,
            data: values,
            backgroundColor: (context) => createGradient(context, gradientPair),
            borderColor: hexToRgba(hex, 0.95),
            borderWidth: 1,
            borderRadius: 10,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            stack: 'lineup',
          });
        });

        const maxValue = Math.max(
          0,
          ...teams.map((team) => team.derivedLineups?.[metric]?.totals?.[metric] ?? 0),
        );

        return { datasets, max: maxValue };
      };

      return {
        value: createDatasetForMetric('value'),
        ppg: createDatasetForMetric('ppg'),
      };
    }

    function buildLineupOptions(max, metric, teams) {
      const formatter = metric === 'value' ? formatNumber : formatPpg;
      const paddedMax = max > 0 ? max * 1.06 : max;
      const axisMax = metric === 'value'
        ? roundUpTo(paddedMax, 5000)
        : roundUpTo(paddedMax, 5);
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        interaction: { mode: 'nearest', intersect: false },
        onClick: (evt, elements, chart) => {
          const tooltip = chart.tooltip;
          if (!tooltip) return;

          const activeElements = tooltip.getActiveElements();

          if (activeElements.length > 0) {
            const lastActiveElement = activeElements[0];
            tooltip.setActiveElements([], { x: 0, y: 0 });

            if (elements.length > 0) {
              const newElement = elements[0];
              if (lastActiveElement.datasetIndex !== newElement.datasetIndex || lastActiveElement.index !== newElement.index) {
                tooltip.setActiveElements(elements, evt);
              }
            }
          } else if (elements.length > 0) {
            tooltip.setActiveElements(elements, evt);
          }

          chart.update();
        },
        layout: {
          padding: {
            left: isMobile ? 2 : 4,
            right: isMobile ? 34 : 46,
            top: 6,
            bottom: 6,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(234, 235, 240, 0.08)' },
            ticks: {
              color: '#EAEBF0',
              callback: (value) => formatter(value),
              font: {
                size: isMobile ? 10 : 12,
                family: "'Product Sans', 'Google Sans', sans-serif",
              },
            },
            max: axisMax,
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: {
              color: '#EAEBF0',
              padding: isMobile ? 1 : 2,
              font: {
                size: isMobile ? 10 : 12,
                family: "'Product Sans', 'Google Sans', sans-serif",
                weight: '600',
              },
              callback(value) {
                const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
                return truncateLabel(label);
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#EAEBF0',
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(13, 14, 35, 0.92)',
            borderColor: 'rgba(118, 109, 255, 0.5)',
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                if (!items?.length) return '';
                const index = items[0].dataIndex;
                return teams[index]?.teamName || '';
              },
              label: (context) => {
                const value = context.raw ?? 0;
                return `${context.dataset.label}: ${formatter(value)}`;
              },
              footer: (tooltipItems) => {
                if (!tooltipItems.length) return '';
                const teamIndex = tooltipItems[0].dataIndex;
                const slotKey = tooltipItems[0].dataset.slotKey;
                const team = teams[teamIndex];
                const players = team?.derivedLineups?.[metric]?.startersBySlot?.[slotKey]?.players || [];
                const valueKey = metric === 'value' ? 'value' : 'ppg';
                return players
                  .slice()
                  .sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0))
                  .slice(0, 3)
                  .map((player) => `${player.name}: ${formatter(player[valueKey] || 0)}`)
                  .join('\n');
              },
            },
          },
          analyzerBarTotals: {
            enabled: true,
            offset: isMobile ? 10 : 18,
            formatter: (value) => formatter(value),
            mobileFont: '9px "Product Sans", "Google Sans", sans-serif',
            rankFontCssVar: '--analyzer-rank-glyph-font',
          },
        },
      };
    }

    function createGradient(context, colors = ['rgba(118, 109, 255, 0.8)', 'rgba(118, 109, 255, 0.4)']) {
      const { chart } = context;
      const { ctx, chartArea } = chart;
      if (!chartArea) return colors[0];
      const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1] ?? colors[0]);
      return gradient;
    }

    function hexToRgba(hex, alpha = 1) {
      if (!hex) return `rgba(255, 255, 255, ${alpha})`;
      let sanitized = hex.replace('#', '');
      if (sanitized.length === 3) {
        sanitized = sanitized
          .split('')
          .map((char) => char + char)
          .join('');
      }
      const bigint = parseInt(sanitized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function buildGradientPair(hex) {
      return [hexToRgba(hex, 0.8), hexToRgba(hex, 0.32)];
    }

    function createStackedBarChart(canvas, labels, datasets, options) {
      return new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets },
        options: applyAnalyzerChartRenderQuality(options),
      });
    }

    function renderOverallChart(teams) {
      if (state.charts.overall) {
        state.charts.overall.destroy();
      }

      const labels = teams.map((team) => truncateLabel(team.teamName));
      const positions = ['QB', 'RB', 'WR', 'TE', 'Picks'];
      const datasets = positions
        .map((pos) => {
          const values = teams.map((team) => team.overallPositional[pos] || 0);
          if (!values.some((value) => value > 0)) return null;
          const hex = OVERALL_VALUE_COLORS[pos] || '#3700B3';
          const gradientPair = buildGradientPair(hex);
          return {
            label: SLOT_LABELS[pos] || pos,
            slotKey: pos,
            data: values,
            backgroundColor: (context) => createGradient(context, gradientPair),
            borderColor: hexToRgba(hex, 0.92),
            borderWidth: 1,
            borderRadius: 10,
            barPercentage: 0.9,
            categoryPercentage: 0.7,
            stack: 'overall',
          };
        })
        .filter(Boolean);

      const maxValue = Math.max(0, ...teams.map((team) => team.totalValue));
      const paddedMaxValue = maxValue > 0 ? maxValue * 1.06 : maxValue;
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      const totalsPluginOffset = isMobile ? 10 : 18;

      state.charts.overall = createStackedBarChart(
        elements.overallCanvas,
        labels,
        datasets,
        {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          interaction: { mode: 'nearest', intersect: false },
          onClick: (evt, elements, chart) => {
            const tooltip = chart.tooltip;
            if (!tooltip) return;

            const activeElements = tooltip.getActiveElements();

            if (activeElements.length > 0) {
              const lastActiveElement = activeElements[0];
              tooltip.setActiveElements([], { x: 0, y: 0 });

              if (elements.length > 0) {
                const newElement = elements[0];
                if (lastActiveElement.datasetIndex !== newElement.datasetIndex || lastActiveElement.index !== newElement.index) {
                  tooltip.setActiveElements(elements, evt);
                }
              }
            } else if (elements.length > 0) {
              tooltip.setActiveElements(elements, evt);
            }

            chart.update();
          },
          layout: {
            padding: {
              left: isMobile ? 2 : 4,
              right: isMobile ? 34 : 46,
              top: 6,
              bottom: 6,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: { color: 'rgba(234, 235, 240, 0.08)' },
              ticks: {
                color: '#EAEBF0',
                callback: (value) => formatNumber(value),
                font: {
                  size: isMobile ? 10 : 12,
                  family: "'Product Sans', 'Google Sans', sans-serif",
                },
              },
              max: roundUpTo(paddedMaxValue, 10000),
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: {
                color: '#EAEBF0',
                padding: isMobile ? 1 : 2,
                font: {
                  size: isMobile ? 10 : 12,
                  family: "'Product Sans', 'Google Sans', sans-serif",
                  weight: '600',
                },
                callback(value) {
                  const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
                  return truncateLabel(label);
                },
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#EAEBF0', usePointStyle: true },
            },
            tooltip: {
              backgroundColor: 'rgba(13, 14, 35, 0.92)',
              borderColor: 'rgba(118, 109, 255, 0.5)',
              borderWidth: 1,
              callbacks: {
                title: (items) => {
                  if (!items?.length) return '';
                  const index = items[0].dataIndex;
                  return teams[index]?.teamName || '';
                },
                label: (context) => {
                  const value = context.raw ?? 0;
                  return `${context.dataset.label}: ${formatNumber(value)}`;
                },
                footer: (tooltipItems) => {
                  if (!tooltipItems.length) return '';
                  const teamIndex = tooltipItems[0].dataIndex;
                  const slotKey = tooltipItems[0].dataset.slotKey;
                  const players = teams[teamIndex]?.allPlayers || [];
                  const list = players.filter((player) => player.pos === slotKey).slice(0, 3);
                  return list
                    .map((player) => `${player.name}: ${formatNumber(player.ktc)}`)
                    .join('\n');
                },
              },
            },
            analyzerBarTotals: {
              enabled: true,
              offset: totalsPluginOffset,
              formatter: (value) => formatNumber(value),
              mobileFont: '9px "Product Sans", "Google Sans", sans-serif',
              rankFontCssVar: '--analyzer-rank-glyph-font',
            },
          },
        },
      );
    }

    function renderRadarChart(teams, radarSlots = state.radarSlots) {
      const userTeam = teams.find((team) => team.isUserTeam);
      if (!userTeam) return;

      const slots = Array.isArray(radarSlots) && radarSlots.length ? radarSlots : buildRadarSlots();
      const labels = slots.map((slot) => slot.label);
      const radarMetric = state.currentRadarMetric === 'value' ? 'value' : 'ppg';
      const isMobileRadar = window.matchMedia('(max-width: 640px)').matches;
      const radarMetricLabel = radarMetric === 'value' ? 'Value' : 'PPG';
      const radarValueFormatter = radarMetric === 'value' ? formatNumber : formatPpg;

      // Analyzer radar data labels:
      // desktop uses a larger label size for both metrics, while mobile PPG stacks
      // the unit beneath the value so labels fit without pushing wider.
      const radarDataLabelFormatter = radarMetric === 'value'
        ? (value) => formatNumber(value).replace(/k$/, 'K')
        : (value) => (isMobileRadar ? [formatPpg(value), 'PPG'] : `${formatPpg(value)} PPG`);
      const radarDataLabelFont = radarMetric === 'value'
        ? (isMobileRadar
          ? '700 10px "Product Sans", "Google Sans", sans-serif'
          : '700 13px "Product Sans", "Google Sans", sans-serif')
        : (isMobileRadar
          ? '700 10px "Product Sans", "Google Sans", sans-serif'
          : '700 13px "Product Sans", "Google Sans", sans-serif');
      const radarDataLabelLineHeight = isMobileRadar && radarMetric === 'ppg' ? 0.98 : 1.1;
      const comparisonTeams = teams.filter((team) => !team.isUserTeam);
      const leagueAverageTeams = comparisonTeams.length ? comparisonTeams : teams;
      const usingRestOfLeague = comparisonTeams.length > 0;

      // Analyzer positional strength radar:
      // reuses the shared derived lineup selections for both Value and PPG, and averages
      // each slot against the rest of the league so position-by-position comparisons stay aligned.
      const userAssignments = userTeam.derivedLineups?.[radarMetric]?.assignments || [];
      const userData = slots.map((slot, index) => userAssignments[index]?.score ?? 0);

      const leagueAverageDetails = slots.map((slot, index) => {
        const totalMetric = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.score ?? 0),
          0,
        );
        const totalValue = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player?.value ?? 0),
          0,
        );
        const totalPpg = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player?.ppg ?? 0),
          0,
        );
        const populatedCount = leagueAverageTeams.reduce(
          (sum, team) => sum + (team.derivedLineups?.[radarMetric]?.assignments?.[index]?.player ? 1 : 0),
          0,
        );
        const teamCount = leagueAverageTeams.length;
        return {
          metricAverage: teamCount ? totalMetric / teamCount : 0,
          valueAverage: teamCount ? totalValue / teamCount : 0,
          ppgAverage: teamCount ? totalPpg / teamCount : 0,
          teamCount,
          populatedCount,
          comparisonLabel: usingRestOfLeague ? `Across ${teamCount} other teams` : `Across ${teamCount} teams`,
        };
      });
      const leagueAverages = leagueAverageDetails.map((detail) => detail.metricAverage);

      const maxValue = Math.max(0, ...userData, ...leagueAverages);
      const fixedValueRadarMax = 11500;
      const scaleMax = radarMetric === 'value'
        ? fixedValueRadarMax
        : (maxValue > 0 ? roundUpTo(maxValue * 1.05, 5) : 10);
      const labelColors = userData.map((value, index) =>
        getRadarLabelColor(value, leagueAverages[index]),
      );

      // Positional strength slot ranks:
      // for each radar slot, ranks the user team among all teams by that slot's derived score
      // so the chart labels can show rank in parentheses (e.g. "QB (#3)").
      const slotRanks = slots.map((slot, slotIndex) => {
        const sorted = [...teams].sort(
          (a, b) =>
            (b.derivedLineups?.[radarMetric]?.assignments?.[slotIndex]?.score ?? 0) -
            (a.derivedLineups?.[radarMetric]?.assignments?.[slotIndex]?.score ?? 0),
        );
        const idx = sorted.findIndex((t) => t.isUserTeam);
        return idx === -1 ? null : idx + 1;
      });

      // Positional strength overall rank:
      // sums each team's derived lineup scores across all slots for the current metric,
      // then ranks the user among all teams for the panel title badge.
      const teamMetricTotals = teams.map((t) => ({
        isUserTeam: t.isUserTeam,
        total: slots.reduce(
          (sum, _, slotIndex) =>
            sum + (t.derivedLineups?.[radarMetric]?.assignments?.[slotIndex]?.score ?? 0),
          0,
        ),
      }));
      const radarRank = (() => {
        const sorted = [...teamMetricTotals].sort((a, b) => b.total - a.total);
        const idx = sorted.findIndex((t) => t.isUserTeam);
        return idx === -1 ? null : idx + 1;
      })();

      // Update the Positional Strength title badge with the overall rank for the active metric.
      const radarStrengthRankEl = document.getElementById('radarStrengthRank');
      if (radarStrengthRankEl) {
        const radarMetricBadgeLabel = radarMetric === 'value' ? 'Value' : 'PPG';
        radarStrengthRankEl.textContent = radarRank ? `(#${radarRank} ${radarMetricBadgeLabel})` : '';
      }

      // Build labels with per-slot rank suffixes for the radar chart's point labels.
      const labelsWithRanks = labels.map((lbl, i) =>
        slotRanks[i] != null ? `${lbl} (#${slotRanks[i]})` : lbl,
      );

      const radarLayoutPadding = {
        top: isMobileRadar ? 2 : 4,
        bottom: isMobileRadar ? 4 : 4,
        left: isMobileRadar ? 0 : 4,
        right: isMobileRadar ? 0 : 4,
      };
      const radarPointLabelPadding = isMobileRadar ? 4 : 6;
      const radarLabelOffset = isMobileRadar
        ? (radarMetric === 'ppg' ? 15 : 14)
        : 22;

      if (state.charts.radar) {
        state.charts.radar.destroy();
      }

      // Analyzer radar hover details:
      // each point carries its own derived lineup context so Chart.js tooltips can explain
      // either the selected team starter or the league-average slot aggregate.
      const userPointDetails = slots.map((slot, index) => {
        const assignment = userAssignments[index];
        if (!assignment?.player) {
          return ['No eligible player for this slot.'];
        }
        return [
          assignment.player.name,
          `Value: ${formatNumber(assignment.player.value)}`,
          `PPG: ${formatPpg(assignment.player.ppg)}`,
        ];
      });

      const leagueAveragePointDetails = leagueAverageDetails.map((detail) => {
        if (!detail.populatedCount) {
          return [usingRestOfLeague ? 'No eligible starters for this slot across the rest of the league.' : 'No eligible starters for this slot across the league.'];
        }
        return [
          `Avg Value: ${formatNumber(detail.valueAverage)}`,
          `Avg PPG: ${formatPpg(detail.ppgAverage)}`,
          detail.comparisonLabel,
        ];
      });

      state.charts.radar = new Chart(elements.radarCanvas, {
        type: 'radar',
        data: {
          labels: labelsWithRanks,
          datasets: [
            {
              label: 'League Average',
              data: leagueAverages,
              fill: true,
              backgroundColor: 'rgba(82, 90, 119, 0.23)',
              borderColor: 'rgba(151, 166, 210, 0.55)',
              borderWidth: 1.1,
              pointBackgroundColor: 'rgba(188, 210, 255, 0.85)',
              pointBorderColor: '#0D0E1B',
              pointRadius: 3,
              pointHitRadius: 14,
              pointHoverRadius: 5,
              analyzerPointDetails: leagueAveragePointDetails,
              order: 1,
            },
            {
              label: 'Your Team',
              data: userData,
              fill: true,
              backgroundColor: 'rgba(83, 0, 255, 0.33)',
              borderColor: '#6700ff',
              borderWidth: 2,
              pointBackgroundColor: '#6300ff',
              pointBorderColor: '#0D0E1B',
              pointRadius: 4.5,
              pointHitRadius: 16,
              pointHoverRadius: 6,
              analyzerLabels: true,
              labelColors,
              labelFont: radarDataLabelFont,
              labelLineHeight: radarDataLabelLineHeight,
              labelFormatter: radarDataLabelFormatter,
              analyzerPointDetails: userPointDetails,
              order: 2,
            },
          ],
        },
        options: applyAnalyzerChartRenderQuality({
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'nearest',
            intersect: true,
          },
          layout: {
            padding: radarLayoutPadding,
          },
          elements: {
            line: { tension: 0.32 },
          },
          scales: {
            r: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: scaleMax,
              max: scaleMax,
              grid: { display: false },
              angleLines: { display: false },
              ticks: { display: false },
              pointLabels: {
                color: '#EAEBF0',
                font: { size: 13, weight: '600', family: "'Product Sans', 'Google Sans', sans-serif" },
                padding: radarPointLabelPadding,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(13, 14, 35, 0.94)',
              borderColor: 'rgba(118, 109, 255, 0.5)',
              borderWidth: 1,
              callbacks: {
                title: (items) => {
                  if (!items?.length) return '';
                  return labels[items[0].dataIndex] || '';
                },
                label: (context) => {
                  const value = context.raw ?? 0;
                  return `${context.dataset.label}: ${radarValueFormatter(value)} ${radarMetricLabel}`;
                },
                footer: (items) => {
                  if (!items?.length) return '';
                  const pointDetails = items[0].dataset?.analyzerPointDetails?.[items[0].dataIndex];
                  return Array.isArray(pointDetails) ? pointDetails : '';
                },
              },
            },
            analyzerRadarBackground: {
              levels: [
                { ratio: 0.95, fill: '#2c334f62', stroke: '#525a7739', lineWidth: 1 },
                { ratio: 0.75, fill: '#2D345153', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.55, fill: '#2F365250', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.35, fill: '#30375455', stroke: '#525a7729', lineWidth: 1 },
                { ratio: 0.18, fill: '#31385565', stroke: '#525a7735', lineWidth: 1 },
              ],
            },
            analyzerRadarLabels: {
              font: '10px "Product Sans", "Google Sans", sans-serif',
              offset: radarLabelOffset,
            },
          },
        }),
      });
    }

    function escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Analyzer split standings row sync:
    // targets the frozen SZN Standings table and the horizontal-scroll table so
    // their grouped headers and rows keep identical heights after rendering.
    function syncStandingsSplitRowHeights() {
      if (!elements.standingsFrozenTable || !elements.standingsTable) return;

      const frozenRows = [
        ...elements.standingsFrozenTable.querySelectorAll('thead tr'),
        ...elements.standingsFrozenTable.querySelectorAll('tbody tr'),
      ];
      const scrollRows = [
        ...elements.standingsTable.querySelectorAll('thead tr'),
        ...elements.standingsTable.querySelectorAll('tbody tr'),
      ];
      const pairCount = Math.min(frozenRows.length, scrollRows.length);

      [...frozenRows, ...scrollRows].forEach((row) => {
        row.style.height = '';
      });

      for (let index = 0; index < pairCount; index += 1) {
        const frozenRow = frozenRows[index];
        const scrollRow = scrollRows[index];
        const maxHeight = Math.max(frozenRow.offsetHeight, scrollRow.offsetHeight);
        if (maxHeight > 0) {
          frozenRow.style.height = `${maxHeight}px`;
          scrollRow.style.height = `${maxHeight}px`;
        }
      }
    }

    function renderStandings(teams) {
      const careerStatsByOwner = state.careerStatsByOwner || {};
      const currentTeamsByOwner = new Map(
        (state.teams || [])
          .map((team) => [team.roster?.owner_id, team])
          .filter(([ownerId]) => Boolean(ownerId)),
      );

      // League table roster-age columns:
      // standings rows are based on the completed season snapshot, so attach current
      // processed roster metrics by owner to keep ages aligned with summary cards.
      const standings = sortTeamsByStandings(teams).map((team, index) => {
        const careerStats = team.roster?.owner_id ? careerStatsByOwner[team.roster.owner_id] : null;
        const careerWins = careerStats?.hasData ? careerStats.wins : null;
        const careerLosses = careerStats?.hasData ? careerStats.losses : null;
        const careerTies = careerStats?.hasData ? careerStats.ties : null;
        const ageSourceTeam = (team.roster?.owner_id && currentTeamsByOwner.get(team.roster.owner_id)) || team;

        return {
          seasonRank: index + 1,
          teamName: team.teamName,
          record: team.record || '—',
          seasonWins: Number(team.wins) || 0,
          seasonLosses: Number(team.losses) || 0,
          seasonTies: Number(team.ties) || 0,
          seasonWinPctValue: computeWinPct(Number(team.wins) || 0, Number(team.losses) || 0, Number(team.ties) || 0),
          pf: Number(team.totalFpts) || 0,
          pa: Number(team.pointsAgainst) || 0,
          isChamp: Boolean(team.isChamp),
          ownerId: team.roster?.owner_id || null,
          careerStats,
          careerWins,
          careerLosses,
          careerTies,
          careerWinPctValue: careerStats?.hasData ? computeWinPct(careerWins, careerLosses, careerTies) : null,
          championships: careerStats?.hasData ? careerStats.championships : null,
          teamAvgAge: Number.isFinite(ageSourceTeam?.teamAvgAge) ? ageSourceTeam.teamAvgAge : null,
          startersAvgAge: Number.isFinite(ageSourceTeam?.startersAvgAge) ? ageSourceTeam.startersAvgAge : null,
        };
      });

      // Analyzer standings team cell:
      // keeps the champion crown self-contained in analyzer rendering rather than
      // depending on the roster page header implementation in app.js.
      const renderStandingsTeamCell = (team) => {
        const safeTeamName = escapeHtml(team.teamName);
        const championTitle = escapeHtml(team.isChamp ? `${team.teamName} - Previous Champion` : team.teamName);
        const crownHtml = team.isChamp
          ? '<i class="fa-solid fa-crown team-record-champ" aria-hidden="true" title="Previous Champion"></i>'
          : '';
        return `
          <span class="analyzer-standings-team" title="${championTitle}">
            <span class="analyzer-standings-team-name">${safeTeamName}</span>
            ${crownHtml}
          </span>
        `;
      };

      const renderCareerChampionships = (careerStats) => {
        if (!careerStats?.hasData) return '—';
        if (!careerStats.championships) {
          return `
            <span
              class="analyzer-standings-no-champ"
              title="0 Championships"
              aria-label="0 Championships"
            >
              <i class="fa-regular fa-circle" aria-hidden="true"></i>
            </span>
          `;
        }

        const trophyMarkup = Array.from({ length: careerStats.championships }, () => (
          '<i class="fa-solid fa-trophy analyzer-standings-trophy" aria-hidden="true"></i>'
        )).join('');

        return `
          <span
            class="analyzer-standings-trophies"
            title="${careerStats.championships} Championship${careerStats.championships === 1 ? '' : 's'}"
            aria-label="${careerStats.championships} Championship${careerStats.championships === 1 ? '' : 's'}"
          >
            ${trophyMarkup}
          </span>
        `;
      };

      const sortedStandings = sortRenderedStandingsRows(standings);

      // Analyzer split standings rows:
      // renders SZN rank/team in the frozen table and every horizontally
      // scrollable metric in the paired table so no moving cells sit behind SZN.
      const renderedRows = sortedStandings
        .map((team) => {
          const careerStats = team.careerStats;
          const careerRecord = careerStats?.hasData
            ? formatRecordLine(careerStats.wins, careerStats.losses, careerStats.ties)
            : '—';
          const careerWinPct = careerStats?.hasData
            ? formatWinPctDisplay(careerStats.wins, careerStats.losses, careerStats.ties)
            : '—';

          return {
            frozen: `
            <tr>
              <td data-label="RK" class="analyzer-standings-rank">${team.seasonRank}</td>
              <td data-label="Team" class="analyzer-standings-team-cell analyzer-standings-section-divider-right">${renderStandingsTeamCell(team)}</td>
            </tr>
          `,
            scroll: `
            <tr>
              <td data-label="REC" class="analyzer-standings-rec">${team.record}</td>
              <td data-label="PF" class="analyzer-standings-points-cell">${team.pf.toFixed(1)}</td>
              <td data-label="PA" class="analyzer-standings-points-cell">${team.pa.toFixed(1)}</td>
              <td data-label="Champ" class="analyzer-standings-career-champ-cell analyzer-standings-career-start">${renderCareerChampionships(careerStats)}</td>
              <td data-label="Career REC" class="analyzer-standings-career-rec-cell">${careerRecord}</td>
              <td data-label="Career WIN %" class="analyzer-standings-career-pct-cell">${careerWinPct}</td>
              <td data-label="Team Avg Age" class="analyzer-standings-age-cell analyzer-standings-team-age-start">${formatAge(team.teamAvgAge)}</td>
              <td data-label="Starters Avg Age" class="analyzer-standings-age-cell">${formatAge(team.startersAvgAge)}</td>
            </tr>
          `,
          };
        })
        .reduce((acc, row) => {
          acc.frozen.push(row.frozen);
          acc.scroll.push(row.scroll);
          return acc;
        }, { frozen: [], scroll: [] });

      if (elements.standingsFrozenBody) {
        elements.standingsFrozenBody.innerHTML = renderedRows.frozen.join('');
      }
      elements.standingsBody.innerHTML = renderedRows.scroll.join('');

      syncStandingsSortHeaders();
      syncStandingsSplitRowHeights();
      requestAnimationFrame(syncStandingsSplitRowHeights);
    }

    function computeWinPct(wins, losses, ties) {
      const games = wins + losses + ties;
      if (games === 0) return 0;
      return (wins + ties * 0.5) / games;
    }

    function sortTeamsByStandings(teams = []) {
      return [...teams].sort((a, b) => {
        const aWinPct = computeWinPct(a.wins || 0, a.losses || 0, a.ties || 0);
        const bWinPct = computeWinPct(b.wins || 0, b.losses || 0, b.ties || 0);
        if (bWinPct !== aWinPct) return bWinPct - aWinPct;
        if ((b.wins || 0) !== (a.wins || 0)) return (b.wins || 0) - (a.wins || 0);
        if ((b.totalFpts || 0) !== (a.totalFpts || 0)) return (b.totalFpts || 0) - (a.totalFpts || 0);
        const aName = a.teamName || '';
        const bName = b.teamName || '';
        return aName.localeCompare(bName);
      });
    }

    /* Rank-based color scale for FPTS / PPG (mirrors Stats page OVERVIEW_RANK_COLOR_SCALE) */
    const LEADERBOARD_RANK_COLORS = [
      { rank: 12, color: '#00ffc4ba' },
      { rank: 24, color: '#85fff3ba' },
      { rank: 36, color: '#7dd1ffba' },
      { rank: 48, color: '#48a6ffba' },
      { rank: 60, color: '#957cffba' },
      { rank: 72, color: '#a642ffba' },
      { rank: 84, color: '#cf60ffba' },
      { rank: 96, color: '#ff6fe1ba' },
      { rank: Infinity, color: '#ff0080ba' },
    ];

    function getLeaderboardRankColor(rank) {
      if (!Number.isFinite(rank) || rank <= 0) return null;
      for (const tier of LEADERBOARD_RANK_COLORS) {
        if (rank <= tier.rank) return tier.color;
      }
      return LEADERBOARD_RANK_COLORS[LEADERBOARD_RANK_COLORS.length - 1]?.color || null;
    }

    const LOGO_KEY_MAP = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };

    function renderTeamCell(teamAbbr) {
      const key = (teamAbbr || 'FA').toUpperCase();
      if (!key || key === 'FA' || key === '--') {
        return `<span class="al-team-chip">${key === '--' ? 'FA' : key}</span>`;
      }
      const normalized = LOGO_KEY_MAP[key] || key.toLowerCase();
      return `<img class="al-team-logo" src="../assets/NFL_logos_svg/${normalized}.svg" alt="${key}" width="20" height="20">`;
    }

    function renderLeagueLeaders() {
      const position = state.activeLeaderboard;
      const leaders = state.leaderboards[position] || [];
      if (!leaders.length) {
        elements.leaderboardBody.innerHTML = '<tr><td colspan="7" class="empty-row">No scoring data available.</td></tr>';
        return;
      }

      // Build rank maps for FPTS and PPG conditional formatting
      // Sort all current leaders by FPTS descending to assign color ranks
      const byFpts = [...leaders].sort((a, b) => b.total - a.total);
      const byPpg = [...leaders].sort((a, b) => b.ppg - a.ppg);
      const fptsRankMap = new Map();
      const ppgRankMap = new Map();
      byFpts.forEach((entry, i) => { fptsRankMap.set(entry.playerId, i + 1); });
      byPpg.forEach((entry, i) => { ppgRankMap.set(entry.playerId, i + 1); });

      elements.leaderboardBody.innerHTML = leaders
        .map((entry, index) => {
          const pos = (entry.pos || '').toUpperCase();
          const fptsColor = getLeaderboardRankColor(fptsRankMap.get(entry.playerId));
          const ppgColor = getLeaderboardRankColor(ppgRankMap.get(entry.playerId));
          const fptsStyle = fptsColor ? ` style="color:${fptsColor}"` : '';
          const ppgStyle = ppgColor ? ` style="color:${ppgColor}"` : '';

          return `
          <tr>
            <td>${index + 1}</td>
            <td class="al-cell-player">${abbreviateFirstName(entry.name) || '—'}</td>
            <td><span class="al-pos-tag ${pos}">${pos || '—'}</span></td>
            <td>${renderTeamCell(entry.nflTeam)}</td>
            <td class="al-cell-owner">${truncateLabel(entry.owner, 11) || '—'}</td>
            <td class="al-fpts-cell"${fptsStyle}>${entry.total.toFixed(1)}</td>
            <td class="al-ppg-cell"${ppgStyle}>${entry.ppg.toFixed(1)}</td>
          </tr>`;
        })
        .join('');
    }

    function populateLeagueSelect(leagues) {
      // LeagueHub command-center selector:
      // one responsive control owns league state for both the analysis and
      // archive views, avoiding duplicate selectors and synchronization drift.
      if (!elements.leagueSelect) return;
      elements.leagueSelect.innerHTML = '<option value="">Select a league...</option>';
      leagues.forEach((league) => {
        const option = document.createElement('option');
        option.value = league.league_id;
        option.textContent = league.name;
        elements.leagueSelect.appendChild(option);
      });
      elements.leagueSelect.disabled = false;
      syncLeagueSelectValues(state.currentLeagueId || '');
    }

    function syncLeagueSelectValues(leagueId) {
      if (!elements.leagueSelect) return;
      const targetLeagueId = String(leagueId || '');
      const hasTarget = [...elements.leagueSelect.options]
        .some((option) => option.value === targetLeagueId);
      elements.leagueSelect.value = hasTarget ? targetLeagueId : '';
    }

    function setLoading(isLoading, message = 'Loading LeagueHub...') {
      const gateSubmitting = Boolean(window.__dhUsernameGate?.isSubmitting?.());

      if (gateSubmitting) {
        try {
          window.__dhUsernameGate?.setLoading?.(isLoading, message);
        } catch (error) { }
        elements.loading?.classList.add('hidden');
        return;
      }

      if (!elements.loading) return;
      const messageEl = elements.loading.querySelector('.loading-message');
      if (messageEl) {
        messageEl.textContent = message;
      }
      if (isLoading) {
        elements.loading.classList.remove('hidden');
      } else {
        elements.loading.classList.add('hidden');
      }
    }

    function roundUpTo(value, step) {
      if (value <= 0) return step;
      return Math.ceil(value / step) * step;
    }

    function computeRank(list, predicate) {
      const index = list.findIndex(predicate);
      return index === -1 ? null : index + 1;
    }

    const trimTrailingZeros = (numericString) => {
      if (typeof numericString !== 'string') return numericString;
      if (!numericString.includes('.')) return numericString;
      return numericString.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0$/, '');
    };

    function formatNumber(value) {
      if (!Number.isFinite(value)) return '0';

      const abs = Math.abs(value);
      const suffixes = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'k' },
      ];

      for (let i = 0; i < suffixes.length; i += 1) {
        const { value: threshold, suffix } = suffixes[i];
        if (abs >= threshold) {
          let scaled = Math.round((value / threshold) * 10) / 10;
          if (i > 0 && Math.abs(scaled) >= 1000) {
            const { value: nextThreshold, suffix: nextSuffix } = suffixes[i - 1];
            scaled = Math.round((value / nextThreshold) * 10) / 10;
            return `${trimTrailingZeros(scaled.toFixed(1))}${nextSuffix}`;
          }
          return `${trimTrailingZeros(scaled.toFixed(1))}${suffix}`;
        }
      }

      return Math.round(value).toLocaleString();
    }

    function formatPpg(value) {
      if (!Number.isFinite(value)) return '0.0';
      return value.toFixed(1);
    }

    function truncateLabel(value, limit = 11) {
      if (!value) return '';
      const trimmed = String(value).trim();
      if (trimmed.length <= limit) return trimmed;
      return `${trimmed.slice(0, limit - 1)}…`;
    }

    function getRadarLabelColor(value, average) {
      if (!Number.isFinite(value)) return '#bcd2ff';
      if (!Number.isFinite(average) || average === 0) {
        return value > 0 ? '#00ffaf' : '#bcd2ff';
      }
      const ratio = value / average;
      if (ratio >= 1.15) return '#00ffaf';
      if (ratio >= 0.95) return '#58a7ff';
      return '#bcd2ff';
    }

    function getRankColor(rank, total) {
      const percentile = (total - rank + 1) / total;
      if (percentile >= 0.8) return '#00EBC7';
      if (percentile >= 0.6) return '#58A7FF';
      if (percentile >= 0.4) return '#EAEBF0';
      if (percentile >= 0.2) return '#FF7F50';
      return '#FF3A75';
    }

    function hideAllActiveTooltips() {
      Object.values(state.charts).forEach(chart => {
        if (chart && chart.tooltip && chart.tooltip.getActiveElements().length) {
          chart.tooltip.setActiveElements([], { x: 0, y: 0 });
          chart.update();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.nodeName !== 'CANVAS') {
        hideAllActiveTooltips();
      }
    });
  });
})();
