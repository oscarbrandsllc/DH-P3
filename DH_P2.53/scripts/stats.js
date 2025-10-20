(function () {
  if (typeof document === 'undefined') return;
  const root = document.body;
  if (!root || root.dataset.page !== 'stats') return;

  const TAB_CONFIG = {
    oneQb: { sheet: 'STAT_1QB', headingSelector: '[data-tab-heading="oneQb"]' },
    sflx: { sheet: 'STAT_SFLX', headingSelector: '[data-tab-heading="sflx"]' }
  };

  const HEADER_ALIASES = new Map([
    ['PLAYER NAME', 'PLAYER'],
    ['POS RK', 'POS | RK'],
    ['POS·RK', 'POS | RK'],
    ['POS_RK', 'POS | RK'],
    ['TEAM', 'TM'],
    ['FPTS_PPR', 'FPTS'],
    ['FPT_PPR', 'FPTS'],
    ['YDS(T)', 'YDS(t)'],
    ['YPG(T)', 'YPG(t)'],
    ['IMP/OPP', 'IMP/OPP']
  ]);

  const COLUMN_SETS = {
    default: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'YDS(t)', 'YPG(t)', 'OPP', 'IMP', 'IMP/OPP'],
    QB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'paRTG', 'paYDS', 'paTD', 'paATT', 'CMP', 'YDS(t)', 'paYPG', 'ruYDS', 'ruTD', 'pa1D', 'IMP/G', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%', 'SAC', 'INT', 'FUM', 'FPOE'],
    RB: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'CAR', 'ruYDS', 'YPC', 'ruTD', 'REC', 'recYDS', 'TGT', 'YDS(t)', 'ruYPG', 'ELU', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD', 'rec1D', 'YAC', 'IMP/G', 'FUM', 'FPOE'],
    WR: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM'],
    TE: ['RK', 'PLAYER', 'POS', 'TM', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'SNP%', 'TGT', 'REC', 'TS%', 'recYDS', 'recTD', 'YPRR', 'rec1D', '1DRR', 'recYPG', 'YAC', 'YPR', 'IMP/G', 'RR', 'FPOE', 'YDS(t)', 'CAR', 'ruYDS', 'ruTD', 'YPC', 'FUM']
  };

  const COLUMN_CATEGORY = {
    'FPTS': 'all',
    'PPG': 'all',
    'VALUE': 'all',
    'YDS(t)': 'all',
    'YPG(t)': 'all',
    'OPP': 'all',
    'IMP': 'all',
    'IMP/OPP': 'all',
    'RK': 'all',
    'PLAYER': 'all',
    'POS': 'all',
    'TM': 'all',
    'AGE': 'all',
    'GM_P': 'all',
    'SNP%': 'all',
    'TGT': 'receiving',
    'REC': 'receiving',
    'TS%': 'receiving',
    'recYDS': 'receiving',
    'recTD': 'receiving',
    'YPRR': 'receiving',
    'rec1D': 'receiving',
    '1DRR': 'receiving',
    'recYPG': 'receiving',
    'YAC': 'receiving',
    'YPR': 'receiving',
    'RR': 'receiving',
    'paRTG': 'passing',
    'paYDS': 'passing',
    'paTD': 'passing',
    'paATT': 'passing',
    'CMP': 'passing',
    'pa1D': 'passing',
    'paYPG': 'passing',
    'pIMP': 'passing',
    'pIMP/A': 'passing',
    'TTT': 'passing',
    'PRS%': 'passing',
    'SAC': 'passing',
    'INT': 'passing',
    'ruYDS': 'rushing',
    'ruTD': 'rushing',
    'ruYPG': 'rushing',
    'ru1D': 'rushing',
    'CAR': 'rushing',
    'YPC': 'rushing',
    'ELU': 'rushing',
    'MTF/A': 'rushing',
    'YCO/A': 'rushing',
    'MTF': 'rushing',
    'YCO': 'rushing',
    'FPOE': 'all',
    'FUM': 'all'
  };

  const VALUE_COLOR_SCALE = [
    { value: 9000, color: '#00EEB6' },
    { value: 8000, color: '#14D7CB' },
    { value: 7000, color: '#0599AA' },
    { value: 6000, color: '#03a8ce' },
    { value: 5500, color: '#0690DC' },
    { value: 5000, color: '#066CDC' },
    { value: 4500, color: '#1350fd' },
    { value: 4000, color: '#5e41ff' },
    { value: 3750, color: '#7158ff' },
    { value: 3500, color: '#964eff' },
    { value: 3250, color: '#9200ff' },
    { value: 3000, color: '#b70fff' },
    { value: 2750, color: '#ba00cc' },
    { value: 2500, color: '#e800ff' },
    { value: 2250, color: '#db00af' },
    { value: 2000, color: '#c70097' },
    { value: 0, color: '#FF0080' }
  ];

  const RK_COLOR_SCALE = [
    { value: 12, color: '#00EEB6' },
    { value: 24, color: '#14D7CB' },
    { value: 36, color: '#0599AA' },
    { value: 48, color: '#03a8ce' },
    { value: 60, color: '#0690DC' },
    { value: 72, color: '#066CDC' },
    { value: 84, color: '#1350fd' },
    { value: 96, color: '#5e41ff' },
    { value: 108, color: '#7158ff' },
    { value: 120, color: '#964eff' },
    { value: 144, color: '#9200ff' },
    { value: 168, color: '#b70fff' },
    { value: 192, color: '#ba00cc' },
    { value: 216, color: '#e800ff' },
    { value: 240, color: '#db00af' },
    { value: 280, color: '#c70097' },
    { value: 500, color: '#FF0080' }
  ];

  const statsState = {
    currentTab: 'oneQb',
    activePosition: null,
    rookieOnly: false,
    searchTerm: '',
    sort: { column: null, direction: 0 },
    datasets: new Map()
  };

  const dom = {
    tabButtons: Array.from(document.querySelectorAll('.stats-tab-button')),
    tabHeadings: Array.from(document.querySelectorAll('.stats-tab-heading')),
    tableWrappers: Array.from(document.querySelectorAll('.stats-table-wrapper')),
    loading: document.getElementById('statsLoading'),
    emptyState: document.getElementById('statsEmptyState'),
    searchInput: document.getElementById('statsSearchInput'),
    searchClear: document.getElementById('statsSearchClear'),
    filterGroup: document.getElementById('statsFilterGroup'),
    rookieButton: document.querySelector('.stats-rookie-btn'),
    leagueChip: document.getElementById('statsLeagueContext')
  };

  const gameLogDom = {
    modal: document.getElementById('game-logs-modal'),
    closeBtn: document.querySelector('#game-logs-modal .modal-close-btn'),
    overlay: document.querySelector('#game-logs-modal .modal-overlay'),
    infoBtn: document.querySelector('#game-logs-modal .modal-info-btn'),
    keyPanel: document.getElementById('stats-key-container')
  };

  if (dom.leagueChip) {
    dom.leagueChip.textContent = 'Advanced Analytics';
  }

  const TEAM_TAG_STYLES = (() => {
    // fallback palette similar to reference
    const defaultStyle = 'background: rgba(255,255,255,0.08); color: #ffffff;';
    if (typeof TEAM_COLORS === 'undefined') {
      return () => defaultStyle;
    }
    return (team) => {
      const upper = (team || '').toUpperCase();
      if (!upper || !TEAM_COLORS[upper]) return defaultStyle;
      const color = TEAM_COLORS[upper];
      return `background-color: #e8eaed; color: ${color}; font-weight: 600;`;
    };
  })();

  const params = new URLSearchParams(window.location.search);

  function parseCsv(text) {
    const lines = (text || '').split(/\r?\n/).filter(Boolean);
    if (!lines.length) return { headers: [], rows: [] };
    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (inQuotes) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              current += '"';
              i += 1;
            } else {
              inQuotes = false;
            }
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
    const headers = parseLine(lines[0]).map((h) => HEADER_ALIASES.get(h) || h);
    const rows = lines.slice(1).map(parseLine);
    return { headers, rows };
  }

  function toNumber(value, { allowFloat = true } = {}) {
    if (value === null || value === undefined) return null;
    const numeric = allowFloat ? parseFloat(value) : parseInt(value, 10);
    return Number.isNaN(numeric) ? null : numeric;
  }

  function getFullName(playerId, fallback = '') {
    const source = state.players?.[playerId];
    if (source) {
      const first = (source.first_name || '').trim();
      const last = (source.last_name || '').trim();
      const combined = `${first} ${last}`.trim();
      return combined || fallback;
    }
    return fallback;
  }

  function formatDisplayName(playerId, fallback = '') {
    const source = state.players?.[playerId];
    let first = '';
    let last = '';
    if (source) {
      first = (source.first_name || '').trim();
      last = (source.last_name || '').trim();
    } else if (fallback) {
      const parts = fallback.trim().split(/\s+/);
      if (parts.length === 1) {
        last = parts[0];
      } else {
        first = parts.shift() || '';
        last = parts.pop() || '';
      }
    }
    if (!last && fallback) {
      const parts = fallback.trim().split(/\s+/);
      last = parts.pop() || '';
      if (!first && parts.length) first = parts.shift() || '';
    }
    let truncatedLast = last || fallback.trim();
    if (truncatedLast && truncatedLast.length > 9) {
      truncatedLast = `${truncatedLast.slice(0, 9)}..`;
    }
    const initial = first ? `${first.charAt(0).toUpperCase()}.` : '';
    if (initial && truncatedLast) return `${initial} ${truncatedLast}`;
    if (truncatedLast) return truncatedLast;
    if (fallback) return fallback.length > 10 ? `${fallback.slice(0, 10)}…` : fallback;
    return 'Unknown';
  }

  function getValueStyle(valueNumeric) {
    if (!Number.isFinite(valueNumeric) || valueNumeric <= 0) {
      return 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary);';
    }
    for (const tier of VALUE_COLOR_SCALE) {
      if (valueNumeric >= tier.value) {
        return `background:${tier.color}; color:${valueNumeric >= 3750 ? '#051026' : '#000'};`;
      }
    }
    return 'background: rgba(255,255,255,0.04); color: var(--color-text-secondary);';
  }

  function getRankColorValue(rank) {
    if (!Number.isFinite(rank) || rank <= 0) return 'var(--color-text-secondary)';
    for (const tier of RK_COLOR_SCALE) {
      if (rank <= tier.value) return tier.color;
    }
    return RK_COLOR_SCALE[RK_COLOR_SCALE.length - 1].color;
  }

  function normalizeHeadersRow(headers, rowValues) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = rowValues[index] !== undefined ? rowValues[index] : '';
    });
    return row;
  }

  function derivePosRankText(row, pos) {
    const raw = row['POS | RK'];
    if (raw && raw.includes('|')) {
      const [p, rk] = raw.split('|').map((part) => part.trim());
      return `${p || pos}·${rk || 'NA'}`;
    }
    if (row['POS | RK']) {
      return row['POS | RK'].replace('|', '·');
    }
    if (row['POS RK']) {
      return row['POS RK'].replace('|', '·');
    }
    return pos ? `${pos}·NA` : 'NA';
  }

  function buildRow(row) {
    const playerId = row.SLPR_ID || row.slpr_id || '';
    const name = row.PLAYER || row['PLAYER NAME'] || '';
    const pos = (row.POS || '').toUpperCase();
    const team = (row.TM || '').toUpperCase() || (state.players?.[playerId]?.team || 'FA');
    const rank = toNumber(row.RK, { allowFloat: false }) ?? Infinity;
    const age = toNumber(row.AGE) ?? 0;
    const gmPlayed = toNumber(row.GM_P, { allowFloat: false });
    const rookieYear = toNumber(row.RY, { allowFloat: false });
    const exp = toNumber(row.EXP, { allowFloat: false });
    const tier = toNumber(row.TIER, { allowFloat: false });
    const trend = toNumber(row.TREND);
    const value = toNumber(row.VALUE);
    const posRankText = derivePosRankText(row, pos);

    const fullName = getFullName(playerId, name);
    const displayName = formatDisplayName(playerId, name);

    const playerRanks = playerId ? calculatePlayerStatsAndRanks(playerId) : null;
    const computedFpts = playerRanks ? toNumber(playerRanks.total_pts) : null;
    const computedPpg = playerRanks ? toNumber(playerRanks.ppg) : null;
    const fptsPosRank = playerRanks ? toNumber(playerRanks.posRank, { allowFloat: false }) : null;
    const ppgPosRank = playerRanks ? toNumber(playerRanks.ppgPosRank, { allowFloat: false }) : null;

    const fallbackFpts = toNumber(row.FPTS);
    const fallbackPpg = toNumber(row.PPG);

    const fpts = Number.isFinite(computedFpts) ? computedFpts : fallbackFpts;
    const ppg = Number.isFinite(computedPpg) ? computedPpg : fallbackPpg;

    const valueStyle = getValueStyle(value);
    const rkColor = getRankColorValue(rank);
    const ageColor = typeof getAgeColorForRoster === 'function' ? (getAgeColorForRoster(pos, age) || 'inherit') : 'inherit';
    const fptsColor = typeof getConditionalColorByRank === 'function' && Number.isFinite(fptsPosRank)
      ? getConditionalColorByRank(fptsPosRank, pos)
      : 'inherit';
    const ppgColor = typeof getConditionalColorByRank === 'function' && Number.isFinite(ppgPosRank)
      ? getConditionalColorByRank(ppgPosRank, pos)
      : 'inherit';

    const teamStyle = TEAM_TAG_STYLES(team);

    return {
      row,
      meta: {
        playerId,
        name,
        fullName,
        displayName,
        pos,
        team,
        rank,
        age,
        gmPlayed,
        rookieYear,
        exp,
        tier,
        trend,
        value,
        fpts,
        ppg,
        fptsPosRank,
        ppgPosRank,
        posRankText,
        valueStyle,
        rkColor,
        ageColor,
        fptsColor,
        ppgColor,
        teamStyle
      }
    };
  }

  function getColumnSet() {
    if (!statsState.activePosition) return COLUMN_SETS.default;
    if (statsState.activePosition === 'QB') return COLUMN_SETS.QB;
    if (statsState.activePosition === 'RB') return COLUMN_SETS.RB;
    if (statsState.activePosition === 'WR') return COLUMN_SETS.WR;
    if (statsState.activePosition === 'TE') return COLUMN_SETS.TE;
    return COLUMN_SETS.default;
  }

  function getColumnCategory(column) {
    return COLUMN_CATEGORY[column] || 'all';
  }

  function getActiveDataset() {
    return statsState.datasets.get(statsState.currentTab) || [];
  }

  function passesFilters(entry) {
    const { meta, row } = entry;
    if (statsState.activePosition && meta.pos !== statsState.activePosition) return false;
    if (statsState.rookieOnly) {
      const targetYear = Number(state.currentNflSeason) || new Date().getFullYear();
      if (meta.rookieYear !== targetYear) return false;
    }
    if (statsState.searchTerm) {
      const needle = statsState.searchTerm.toLowerCase();
      const haystack = `${meta.name || ''} ${meta.fullName || ''} ${meta.displayName || ''}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (statsState.activePosition === 'RDP' && meta.pos !== 'RDP') return false;
    if (!statsState.activePosition && meta.pos === 'RDP' && statsState.currentTab === 'sflx') {
      // allow picks by default
    }
    return true;
  }

  function compareValues(a, b, column) {
    const aRaw = a.row[column];
    const bRaw = b.row[column];
    const numericColumns = new Set([
      'RK', 'AGE', 'GM_P', 'FPTS', 'PPG', 'VALUE', 'YDS(t)', 'YPG(t)', 'IMP', 'IMP/OPP', 'paRTG', 'paYDS',
      'paTD', 'paATT', 'CMP', 'paYPG', 'ruYDS', 'ruTD', 'pIMP', 'pIMP/A', 'CAR', 'YPC', 'TTT', 'PRS%',
      'SAC', 'INT', 'FUM', 'FPOE', 'SNP%', 'REC', 'TGT', 'MTF/A', 'YCO/A', 'MTF', 'YCO', 'ru1D', 'recTD',
      'rec1D', 'YAC', 'ELU', 'ruYPG', 'YPRR', '1DRR', 'recYPG', 'YPR', 'RR'
    ]);
    if (column === 'FPTS') {
      return (a.meta.fpts ?? -Infinity) - (b.meta.fpts ?? -Infinity);
    }
    if (column === 'PPG') {
      return (a.meta.ppg ?? -Infinity) - (b.meta.ppg ?? -Infinity);
    }
    if (column === 'VALUE') {
      return (a.meta.value ?? -Infinity) - (b.meta.value ?? -Infinity);
    }
    if (column === 'AGE') {
      return (a.meta.age ?? -Infinity) - (b.meta.age ?? -Infinity);
    }
    if (numericColumns.has(column)) {
      const numA = toNumber(aRaw);
      const numB = toNumber(bRaw);
      if (numA === null && numB === null) return 0;
      if (numA === null) return -1;
      if (numB === null) return 1;
      return numA - numB;
    }
    const strA = (aRaw || '').toString().toLowerCase();
    const strB = (bRaw || '').toString().toLowerCase();
    return strA.localeCompare(strB);
  }

  function getSortedRows(rows, column) {
    const direction = statsState.sort.direction === 2 ? -1 : 1;
    const sorted = [...rows];
    sorted.sort((a, b) => {
      const result = compareValues(a, b, column);
      if (result === 0) return 0;
      return direction * (result > 0 ? 1 : -1);
    });
    return sorted;
  }

  function formatCellValue(column, entry) {
    const { row, meta } = entry;
    if (column === 'PLAYER') return meta.displayName || meta.name || 'N/A';
    if (column === 'POS') return meta.pos || 'N/A';
    if (column === 'TM') return meta.team || 'FA';
    if (column === 'FPTS') {
      if (meta.fpts === null || Number.isNaN(meta.fpts)) return 'NA';
      return meta.fpts.toFixed(1);
    }
    if (column === 'PPG') {
      if (meta.ppg === null || Number.isNaN(meta.ppg)) return 'NA';
      return meta.ppg.toFixed(2).replace(/\.00$/, '');
    }
    if (column === 'VALUE') {
      if (!Number.isFinite(meta.value)) return 'NA';
      return Math.round(meta.value);
    }
    if (column === 'AGE') {
      if (!Number.isFinite(meta.age) || meta.age <= 0) return 'NA';
      return meta.age.toFixed(1);
    }
    if (column === 'RK') {
      if (!Number.isFinite(meta.rank) || meta.rank === Infinity) return 'NA';
      return meta.rank;
    }
    const raw = row[column];
    if (raw === undefined || raw === null || raw === '') return '—';
    return raw;
  }

  function clearSortIndicators(headerRow) {
    headerRow.querySelectorAll('th').forEach((th) => {
      th.classList.remove('stats-sort-asc', 'stats-sort-desc');
    });
  }

  function applySortIndicator(target) {
    if (statsState.sort.direction === 1) {
      target.classList.add('stats-sort-asc');
    } else if (statsState.sort.direction === 2) {
      target.classList.add('stats-sort-desc');
    }
  }

  function renderTable() {
    const dataset = getActiveDataset();
    const columnSet = getColumnSet();
    const filtered = dataset.filter(passesFilters);
    const sortColumn = statsState.sort.column && columnSet.includes(statsState.sort.column)
      ? statsState.sort.column
      : 'RK';
    const hasOnlyPicks = filtered.length > 0 && filtered.every((entry) => entry.meta.pos === 'RDP');
    const sortCollection = (collection) => {
      if (!collection.length) return [];
      if (statsState.sort.direction === 0 || !statsState.sort.column) {
        return [...collection].sort((a, b) => (a.meta.rank ?? Infinity) - (b.meta.rank ?? Infinity));
      }
      return getSortedRows(collection, sortColumn);
    };
    let rows;
    if (statsState.activePosition === 'RDP' || hasOnlyPicks) {
      rows = [...filtered];
    } else {
      const playerRows = filtered.filter((entry) => entry.meta.pos !== 'RDP');
      const pickRows = filtered.filter((entry) => entry.meta.pos === 'RDP');
      const sortedPlayers = sortCollection(playerRows);
      rows = [...sortedPlayers, ...pickRows];
    }

    const wrapper = dom.tableWrappers.find((el) => el.dataset.tabPanel === statsState.currentTab);
    const otherWrappers = dom.tableWrappers.filter((el) => el !== wrapper);
    wrapper.classList.remove('hidden');
    otherWrappers.forEach((el) => el.classList.add('hidden'));

    const table = wrapper.querySelector('.stats-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const headerRow = document.createElement('tr');
    columnSet.forEach((column, index) => {
      const th = document.createElement('th');
      th.textContent = column;
      const category = getColumnCategory(column);
      th.classList.add(`stats-header-${category}`);
      if (index === 0) th.classList.add('sticky-col-1', 'stats-rank-cell');
      if (index === 1) th.classList.add('sticky-col-2', 'stats-player-cell');
      if (index === 2) th.classList.add('sticky-col-3');
      th.dataset.columnKey = column;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    clearSortIndicators(headerRow);
    if (!hasOnlyPicks && statsState.activePosition !== 'RDP' && statsState.sort.column && statsState.sort.direction !== 0) {
      const activeHeader = headerRow.querySelector(`th[data-column-key="${statsState.sort.column}"]`);
      if (activeHeader) applySortIndicator(activeHeader);
    }

    rows.forEach((entry, rowIndex) => {
      const tr = document.createElement('tr');
      columnSet.forEach((column, index) => {
        const td = document.createElement('td');
        let textValue = formatCellValue(column, entry);
        if (index === 0) {
          td.classList.add('sticky-col-1', 'stats-rank-cell');
          const displayRank = rowIndex + 1;
          textValue = displayRank;
          td.style.color = getRankColorValue(displayRank);
        } else if (index === 1) {
          td.classList.add('sticky-col-2', 'stats-player-cell');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'stats-player-btn';
          btn.textContent = textValue;
          btn.title = entry.meta.fullName || entry.meta.name || textValue;
          btn.addEventListener('click', () => openGameLogs(entry));
          td.appendChild(btn);
        } else if (index === 2) {
          td.classList.add('sticky-col-3');
        }
        if (index === 1) {
          // handled above
        } else if (column === 'VALUE') {
          td.innerHTML = `<span class="stats-value-chip" style="${entry.meta.valueStyle}">${textValue}</span>`;
        } else if (column === 'TM') {
          td.innerHTML = `<span class="stats-team-chip" style="${entry.meta.teamStyle}">${textValue}</span>`;
        } else if (column === 'POS') {
          td.innerHTML = `<span class="player-tag modal-pos-tag ${entry.meta.pos || ''}">${entry.meta.pos || textValue}</span>`;
        } else {
          td.textContent = textValue;
        }

        if (column === 'AGE') {
          td.style.color = entry.meta.ageColor;
          td.classList.add('stats-age-cell');
        } else if (column === 'FPTS') {
          td.style.color = entry.meta.fptsColor;
          td.classList.add('stats-fpts-cell');
        }
        if (column === 'PPG') {
          td.style.color = entry.meta.ppgColor;
          td.classList.add('stats-ppg-cell');
        }

        if (column === 'RK' && index !== 1) {
          td.textContent = textValue;
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    if (!rows.length) {
      dom.emptyState.classList.remove('hidden');
    } else {
      dom.emptyState.classList.add('hidden');
    }
  }

  function openGameLogs(entry) {
    if (typeof handlePlayerNameClick !== 'function') return;
    const { meta } = entry;
    const valuations = state.isSuperflex ? state.sflxData?.[meta.playerId] : state.oneQbData?.[meta.playerId];
    if (typeof state === 'object') {
      state.isGameLogModalOpenFromComparison = false;
    }
    const player = {
      id: meta.playerId,
      name: meta.name,
      pos: meta.pos,
      team: meta.team,
      ktc: valuations?.ktc || entry.meta.value || 0,
      posRank: meta.posRankText,
      overallRank: meta.rank
    };
    handlePlayerNameClick(player);
  }

  let escapeKeyBound = false;
  function performModalClose() {
    if (typeof closeModal === 'function') {
      closeModal();
    } else if (gameLogDom.modal) {
      gameLogDom.modal.classList.add('hidden');
      gameLogDom.keyPanel?.classList.add('hidden');
    }
    if (typeof state === 'object') {
      state.isGameLogModalOpenFromComparison = false;
    }
  }

  function wireGameLogControls() {
    if (!gameLogDom.modal) return;
    if (!gameLogDom.modal.dataset.statsWired) {
      gameLogDom.closeBtn?.addEventListener('click', performModalClose);
      gameLogDom.overlay?.addEventListener('click', performModalClose);
      gameLogDom.infoBtn?.addEventListener('click', () => {
        if (!gameLogDom.keyPanel) return;
        gameLogDom.keyPanel.classList.toggle('hidden');
      });
      gameLogDom.modal.dataset.statsWired = '1';
    }
    if (!escapeKeyBound) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && gameLogDom.modal && !gameLogDom.modal.classList.contains('hidden')) {
          performModalClose();
        }
      });
      escapeKeyBound = true;
    }
  }

  function toggleTab(tabKey) {
    if (statsState.currentTab === tabKey) return;
    statsState.currentTab = tabKey;
    statsState.sort = { column: null, direction: 0 };
    dom.tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tabKey;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    dom.tabHeadings.forEach((heading) => {
      const isActive = heading.dataset.tabHeading === tabKey;
      heading.classList.toggle('hidden', !isActive);
    });
    if (!statsState.datasets.has(tabKey)) {
      toggleInlineLoading(true);
      loadTabData(tabKey).then(() => {
        toggleInlineLoading(false);
        renderTable();
      }).catch(() => toggleInlineLoading(false));
    } else {
      renderTable();
    }
  }

  function handleSortClick(event) {
    if (statsState.activePosition === 'RDP') return;
    const dataset = getActiveDataset();
    const visibleRows = dataset.filter(passesFilters);
    if (visibleRows.length && visibleRows.every((entry) => entry.meta.pos === 'RDP')) return;
    const th = event.target.closest('th[data-column-key]');
    if (!th) return;
    const column = th.dataset.columnKey;
    if (!column) return;
    const columnSet = getColumnSet();
    if (!columnSet.includes(column)) return;

    if (statsState.sort.column !== column) {
      statsState.sort = { column, direction: 1 };
    } else {
      statsState.sort.direction = (statsState.sort.direction + 1) % 3;
      if (statsState.sort.direction === 0) {
        statsState.sort.column = null;
      }
    }
    renderTable();
  }

  function handleSearchInput(event) {
    const term = event.target.value || '';
    statsState.searchTerm = term.trim().toLowerCase();
    dom.searchClear.classList.toggle('visible', term.length > 0);
    renderTable();
  }

  function clearSearch() {
    dom.searchInput.value = '';
    statsState.searchTerm = '';
    dom.searchClear.classList.remove('visible');
    renderTable();
    dom.searchInput.focus();
  }

  function handleFilterClick(event) {
    const button = event.target.closest('.stats-filter-btn[data-position]');
    if (!button || button === dom.rookieButton) return;
    const position = button.dataset.position;
    if (statsState.activePosition === position) {
      statsState.activePosition = null;
    } else {
      statsState.activePosition = position === 'RDP' ? 'RDP' : position;
    }
    statsState.sort = { column: null, direction: 0 };
    dom.filterGroup.querySelectorAll('.stats-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.position === statsState.activePosition);
    });
    renderTable();
  }

  function toggleRookieFilter() {
    statsState.rookieOnly = !statsState.rookieOnly;
    dom.rookieButton.classList.toggle('active', statsState.rookieOnly);
    statsState.sort = { column: null, direction: 0 };
    renderTable();
  }

  function toggleInlineLoading(show) {
    if (!dom.loading) return;
    dom.loading.classList.toggle('hidden', !show);
  }

  async function ensureLeagueContext() {
    const username = params.get('username');
    const leagueId = params.get('leagueId');
    if (!username) return;
    try {
      await fetchAndSetUser(username);
      const leagues = await fetchUserLeagues(state.userId);
      state.leagues = leagues;
      let targetLeague = leagues.find((l) => l.league_id === leagueId);
      if (!targetLeague) {
        targetLeague = leagues[0];
      }
      if (targetLeague) {
        state.currentLeagueId = targetLeague.league_id;
        const rosterPositions = targetLeague.roster_positions || [];
        const superflexSlots = rosterPositions.filter((p) => p === 'SUPER_FLEX').length;
        const qbSlots = rosterPositions.filter((p) => p === 'QB').length;
        state.isSuperflex = (superflexSlots > 0) || (qbSlots > 1);
      }
      if (dom.leagueChip) {
        dom.leagueChip.textContent = 'Advanced Analytics';
      }
    } catch (error) {
      if (dom.leagueChip) {
        dom.leagueChip.textContent = 'Advanced Analytics';
      }
      console.warn('Unable to resolve league context for stats page:', error);
    }
  }

  async function fetchSheetCsv(sheetName) {
    const sheetId = typeof PLAYER_STATS_SHEET_ID !== 'undefined'
      ? PLAYER_STATS_SHEET_ID
      : '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
    return response.text();
  }

  async function loadTabData(tabKey) {
    const tab = TAB_CONFIG[tabKey];
    if (!tab) return;
    const csv = await fetchSheetCsv(tab.sheet);
    const { headers, rows } = parseCsv(csv);
    const parsedRows = rows.map((values) => normalizeHeadersRow(headers, values));
    const enriched = parsedRows.map(buildRow);
    statsState.datasets.set(tabKey, enriched);
  }

  async function loadAllTabs() {
    await Promise.all(Object.keys(TAB_CONFIG).map(loadTabData));
  }

  async function initialise() {
    try {
      setLoading(true, 'Loading stats...');
    } catch (e) {
      // silent – setLoading may not be available yet
    }
    toggleInlineLoading(true);
    try {
      await ensureLeagueContext();
      if (typeof fetchSleeperPlayers === 'function') {
        await fetchSleeperPlayers();
      }
      if (typeof fetchPlayerStatsSheets === 'function') {
        await fetchPlayerStatsSheets();
      }
      await loadAllTabs();
      renderTable();
      wireGameLogControls();
    } catch (error) {
      console.error('Failed to initialise stats page:', error);
      if (dom.emptyState) {
        dom.emptyState.textContent = 'Unable to load stats data at this time.';
        dom.emptyState.classList.remove('hidden');
      }
    } finally {
      toggleInlineLoading(false);
      try {
        setLoading(false);
      } catch (e) {
        // ignore
      }
    }
  }

  dom.tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => toggleTab(btn.dataset.tab));
  });
  dom.searchInput.addEventListener('input', handleSearchInput);
  dom.searchClear.addEventListener('click', clearSearch);
  dom.filterGroup.addEventListener('click', handleFilterClick);
  dom.rookieButton.addEventListener('click', toggleRookieFilter);
  dom.tableWrappers.forEach((wrapper) => {
    const thead = wrapper.querySelector('thead');
    thead.addEventListener('click', handleSortClick);
  });

  initialise();
})();
