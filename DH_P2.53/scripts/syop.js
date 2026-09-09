(function () {
  const PAGE_ID = 'research';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const colors = {
    bg: '#0B0E16',
    panel: 'rgba(18, 21, 38, 0.78)',
    panelBorder: 'rgba(132, 146, 255, 0.16)',
    text: '#F5F7FF',
    subtext: '#A7AFD4',
    muted: '#303854',
    grid: 'rgba(148, 163, 255, 0.16)',
    accentA: '#3BE4E4',
    accentB: '#7C83FF',
    accentC: '#FF75D1',
    qb: '#6000ff',
    rb: '#690fff',
    wr: '#7621ff',
    te: '#842fff'
  };

  const SUNBURST_NODES = [
    { id: 'root', parent: null, label: 'SYOP Averages', subtitle: 'SYOP[ႽP] • BRKOUT[BO]', value: 51.6 },
    { id: 'qb', parent: 'root', label: 'QB', subtitle: 'Quarterbacks', value: 16.46, series: 'QB' },
    { id: 'qb-prime-lambda', parent: 'qb', label: 'Prime Λ', subtitle: '7.2 yrs', value: 6.5, abbr: 'SPᴧ', stat: '7.2' },
    { id: 'qb-breakout-lambda', parent: 'qb', label: 'Breakout Λ', subtitle: '2.3 yrs', value: 2.49, abbr: 'BOᴧ', stat: '2.3' },
    { id: 'qb-prime-mode', parent: 'qb', label: 'Prime M', subtitle: '6.0 yrs', value: 5.35, abbr: 'SPϻ', stat: '6.0' },
    { id: 'qb-baseline-mode', parent: 'qb', label: 'Baseline M', subtitle: '1.0 yrs', value: 2.1, abbr: 'BOϻ', stat: '1.0' },
    { id: 'rb', parent: 'root', label: 'RB', subtitle: 'Running Backs', value: 9.8, series: 'RB' },
    { id: 'rb-prime-lambda', parent: 'rb', label: 'Prime Λ', subtitle: '3.4 yrs', value: 3.31, abbr: 'SPᴧ', stat: '3.4' },
    { id: 'rb-breakout-lambda', parent: 'rb', label: 'Breakout Λ', subtitle: '2.2 yrs', value: 2.5, abbr: 'BOᴧ', stat: '2.2' },
    { id: 'rb-prime-mode', parent: 'rb', label: 'Prime M', subtitle: '0.7 yrs', value: 1.89, abbr: 'SPϻ', stat: '0.7' },
    { id: 'rb-baseline-mode', parent: 'rb', label: 'Baseline M', subtitle: '1.7 yrs', value: 2.1, abbr: 'BOϻ', stat: '1.7' },
    { id: 'wr', parent: 'root', label: 'WR', subtitle: 'Wide Receivers', value: 12.82, series: 'WR' },
    { id: 'wr-prime-lambda', parent: 'wr', label: 'Prime Λ', subtitle: '4.9 yrs', value: 4.92, abbr: 'SPᴧ', stat: '4.9' },
    { id: 'wr-breakout-lambda', parent: 'wr', label: 'Breakout Λ', subtitle: '2.9 yrs', value: 2.84, abbr: 'BOᴧ', stat: '2.9' },
    { id: 'wr-prime-mode', parent: 'wr', label: 'Prime M', subtitle: '3.0 yrs', value: 3, abbr: 'SPϻ', stat: '3.0' },
    { id: 'wr-baseline-mode', parent: 'wr', label: 'Baseline M', subtitle: '2.0 yrs', value: 2, abbr: 'BOϻ', stat: '2.0' },
    { id: 'te', parent: 'root', label: 'TE', subtitle: 'Tight Ends', value: 12.5, series: 'TE' },
    { id: 'te-prime-lambda', parent: 'te', label: 'Prime Λ', subtitle: '4.0 yrs', value: 4.01, abbr: 'SPᴧ', stat: '4.0' },
    { id: 'te-breakout-lambda', parent: 'te', label: 'Breakout Λ', subtitle: '3.5 yrs', value: 3.49, abbr: 'BOᴧ', stat: '3.5' },
    { id: 'te-prime-mode', parent: 'te', label: 'Prime M', subtitle: '2.0 yrs', value: 2, abbr: 'SPϻ', stat: '2.0' },
    { id: 'te-baseline-mode', parent: 'te', label: 'Baseline M', subtitle: '3.0 yrs', value: 3, abbr: 'BOϻ', stat: '3.0' }
  ];

  const SYOP_DATA = [
    { SYOP: '1', 'QB %': 6.67, 'RB %': 27.54, 'WR %': 13.0, 'TE %': 26.92 },
    { SYOP: '2', 'QB %': 11.11, 'RB %': 20.29, 'WR %': 14.1, 'TE %': 26.92 },
    { SYOP: '3', 'QB %': 8.89, 'RB %': 11.59, 'WR %': 14.1, 'TE %': 7.69 },
    { SYOP: '4', 'QB %': 8.89, 'RB %': 11.4, 'WR %': 12.0, 'TE %': 7.69 },
    { SYOP: '5', 'QB %': 4.44, 'RB %': 13.04, 'WR %': 5.4, 'TE %': 0.4 },
    { SYOP: '6', 'QB %': 13.33, 'RB %': 5.8, 'WR %': 7.6, 'TE %': 7.69 },
    { SYOP: '7', 'QB %': 8.89, 'RB %': 1.45, 'WR %': 13.0, 'TE %': 7.69 },
    { SYOP: '8', 'QB %': 4.44, 'RB %': 2.9, 'WR %': 9.8, 'TE %': 0.4 },
    { SYOP: '9', 'QB %': 11.11, 'RB %': 3.3, 'WR %': 2.2, 'TE %': 3.85 },
    { SYOP: '10', 'QB %': 2.22, 'RB %': 1.45, 'WR %': 4.49, 'TE %': 3.51 },
    { SYOP: '11', 'QB %': 0.4, 'RB %': 1.45, 'WR %': 2.2, 'TE %': 3.85 },
    { SYOP: '12+', 'QB %': 20.0, 'RB %': 0.4, 'WR %': 2.2, 'TE %': 3.85 }
  ];

  const POSITION_CONFIG = [
    { key: 'QB', percentKey: 'QB %', label: 'Quarterbacks', color: colors.qb },
    { key: 'RB', percentKey: 'RB %', label: 'Running Backs', color: colors.rb },
    { key: 'WR', percentKey: 'WR %', label: 'Wide Receivers', color: colors.wr },
    { key: 'TE', percentKey: 'TE %', label: 'Tight Ends', color: colors.te }
  ];

  // SYOP bar-chart gradients: QB establishes the translation pattern from a
  // simple 2-color reference gradient into SVG stops — a tuned lead color,
  // the exact reference endpoint at the mid stop, then a slightly deeper tail
  // color for the final stops using the same opacity ramp.
  const BAR_GRADIENTS = {
    QB: [
      { offset: '0%', color: '#ff906e', opacity: 0.14 },
      { offset: '34%', color: '#ff4187', opacity: 0.26 },
      { offset: '70%', color: '#FF3A75', opacity: 0.34 },
      { offset: '100%', color: '#FF3A75', opacity: 0.5 }
    ],
    RB: [
      { offset: '0%', color: '#26ccff', opacity: 0.14 },
      { offset: '34%', color: '#45ffd0', opacity: 0.26 },
      { offset: '70%', color: '#05efb4', opacity: 0.34 },
      { offset: '100%', color: '#05efb4', opacity: 0.5 }
    ],
    WR: [
      { offset: '0%', color: '#8b5fff', opacity: 0.14 },
      { offset: '34%', color: '#0299fe', opacity: 0.26 },
      { offset: '70%', color: '#028eea', opacity: 0.34 },
      { offset: '100%', color: '#028eea', opacity: 0.5 }
    ],
    TE: [
      { offset: '0%', color: '#ff74d2', opacity: 0.14 },
      { offset: '34%', color: '#7f2fff', opacity: 0.26 },
      { offset: '70%', color: '#7429ed', opacity: 0.34 },
      { offset: '100%', color: '#7429ed', opacity: 0.5 }
    ],
    DEFAULT: [
      { offset: '0%', color: '#8F97FF', opacity: 0.2 },
      { offset: '100%', color: '#5C4BFF', opacity: 0.54 }
    ]
  };

  const POSITION_TOTALS = {
    QB: 52,
    RB: 96,
    WR: 107,
    TE: 42
  };

  const GAUGES = [
    { key: 'QB', value: 7.22, color: colors.qb },
    { key: 'RB', value: 3.39, color: colors.wr },
    { key: 'WR', value: 4.9, color: colors.rb },
    { key: 'TE', value: 4.0, color: colors.te }
  ];

  const DRAFT_OVERALL = [
    { rd: '1', hit: 78.4 },
    { rd: '2', hit: 47.7 },
    { rd: '3', hit: 38.5 },
    { rd: '4', hit: 18.0 },
    { rd: '5', hit: 15.0 },
    { rd: '6', hit: 14.1 },
    { rd: '7', hit: 9.4 }
  ];

  const DRAFT_POSITIONAL = [
    { rd: '1', QB: 78, RB: 83, TE: 78, WR: 76 },
    { rd: '2', QB: 42, RB: 50, TE: 40, WR: 51 },
    { rd: '3', QB: 31, RB: 62, TE: 36, WR: 30 },
    { rd: '4', QB: 20, RB: 27, TE: 23, WR: 9 },
    { rd: '5', QB: 7, RB: 27, TE: 9, WR: 13 },
    { rd: '6', QB: 11, RB: 18, TE: 8, WR: 15 },
    { rd: '7', QB: 13, RB: 9, TE: 4, WR: 11 }
  ];

  const DRAFT_SERIES = [
    { key: 'QB', color: '#ff4187' },
    { key: 'RB', color: '#06ffa8e8' },
    { key: 'TE', color: '#7f2fff' },
    { key: 'WR', color: '#3881ff' }
  ];

  const DRAFT_OVERALL_MAX = Math.max(...DRAFT_OVERALL.map((row) => row.hit));
  const DRAFT_POSITIONAL_MAX = Math.max(
    ...DRAFT_POSITIONAL.flatMap((row) => DRAFT_SERIES.map((series) => Number(row[series.key]) || 0))
  );
  const DRAFT_CHART_NICE_MAX = Math.max(10, Math.ceil(Math.max(DRAFT_OVERALL_MAX, DRAFT_POSITIONAL_MAX) / 10) * 10);

  const SERIES_CONFIG = [
    { key: 'QB %', label: 'QB %', color: colors.qb },
    { key: 'RB %', label: 'RB %', color: colors.rb },
    { key: 'WR %', label: 'WR %', color: colors.wr },
    { key: 'TE %', label: 'TE %', color: colors.te }
  ];

  const syopChartState = {
    activePosition: POSITION_CONFIG[0]?.key || null,
    showTable: false
  };

  // Positional Analysis tab:
  // - targets only the new Research tab panel and its unique .pos-analysis-* DOM
  // - loads the historical player-level dataset directly, not Sheets/proxies
  // - keeps chart state separate from SYOP/Draft renderers so tab changes do not
  //   leak behavior into the existing Research views.
  const POS_ANALYSIS_DATA_PATH = '../data/POS-DIST_2007-2015/POS-DIST_2007-2025.csv';
  const POS_ANALYSIS_YEARS = Array.from({ length: 19 }, (_, index) => 2007 + index);
  const POS_ANALYSIS_POSITIONS = ['QB', 'RB', 'WR', 'TE'];
  const POS_ANALYSIS_RANGE_OPTIONS = ['Top 6', 'Top 12', 'Top 24', 'Top 36', 'Top 48', 'Top 60'];
  // Positional Analysis supply grid: order ranges from the tightest tier to the
  // broadest so the two-by-two layout reads 24/36 across, then 48/60 below.
  const POS_ANALYSIS_GRID_RANGES = ['Top 24', 'Top 36', 'Top 48', 'Top 60'];
  const POS_ANALYSIS_CUTS = {
    'Top 6': 6,
    'Top 12': 12,
    'Top 24': 24,
    'Top 36': 36,
    'Top 48': 48,
    'Top 60': 60
  };
  const POS_ANALYSIS_POS_CONFIG = {
    QB: { label: 'Quarterbacks', low: '#FF916B', mid: '#FF666B', high: '#F94095' },
    RB: { label: 'Running Backs', low: '#0d7efe', mid: '#1fa9f9', high: '#00ffae' },
    WR: { label: 'Wide Receivers', low: '#5c47ff', mid: '#0051ff', high: '#1b7eff' },
    TE: { label: 'Tight Ends', low: '#ff6bc8', mid: '#bf4be4', high: '#7f2fff' }
  };
  const POS_ANALYSIS_RANGE_COLORS = {
    12: { RB: '#00c3ff', WR: '#2b40ff' },
    36: { RB: '#00ffc3', WR: '#276bfc' },
    60: { RB: '#00ff99', WR: '#3e92ff' }
  };
  // Line Graph Grid by Year: keep the redesigned comparison intentionally
  // bounded to the six-season trend window requested for this Research panel.
  const POS_ANALYSIS_YEAR_SHIFT_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
  const POS_ANALYSIS_YEAR_SHIFT_LABEL_CUTS = [12, 36, 60];
  // Line Graph Grid by Year palette: this configuration is intentionally
  // separate from POS_ANALYSIS_POS_CONFIG. Adjusting these RB/WR stops changes
  // only the six year-shift charts, including their points and value chips.
  const POS_ANALYSIS_YEAR_SHIFT_GRADIENTS = {
    RB: { low: '#004675', mid: '#48cbff', high: '#00ff84' },
    WR: { low: '#7a39fbaa', mid: '#5100ff', high: '#00aaff' }
  };
  // G1 tier-stack defaults follow the page's 700px mobile breakpoint. The
  // choice is made once at page load so rotating/resizing never overwrites a
  // range the visitor has already selected.
  const POS_ANALYSIS_TIER_STACK_DEFAULT_MIN_YEAR = window.matchMedia('(max-width: 700px)').matches ? 2020 : 2014;
  const POS_ANALYSIS_STATE = {
    rows: [],
    counts: null,
    loaded: false,
    loadingPromise: null,
    interactionsBound: false,
    range: 'Top 60',
    mode: 'single',
    positionView: 'rbWr',
    activePositions: ['RB', 'WR'],
    tierStackMinYear: POS_ANALYSIS_TIER_STACK_DEFAULT_MIN_YEAR,
    tierStackMaxYear: POS_ANALYSIS_YEARS[POS_ANALYSIS_YEARS.length - 1],
    personnel: '12'
  };

  // Positional Analysis Material Symbols registry:
  // - user-selected glyph geometry stays local to the exact UI that requested it
  // - layered symbols support the dual-color RB-vs-WR chip and the hero insights glyph
  // - every remaining glyph comes from Google's rounded 24px Material Symbols SVG set
  // - inline paths keep this Research-only tab independent from icon fonts and network loading.
  const POS_ANALYSIS_MATERIAL_SYMBOLS = {
    qb: { materialName: 'my_location', path: 'M440-82v-40q-125-14-214.5-103.5T122-440H82q-17 0-28.5-11.5T42-480q0-17 11.5-28.5T82-520h40q14-125 103.5-214.5T440-838v-40q0-17 11.5-28.5T480-918q17 0 28.5 11.5T520-878v40q125 14 214.5 103.5T838-520h40q17 0 28.5 11.5T918-480q0 17-11.5 28.5T878-440h-40q-14 125-103.5 214.5T520-122v40q0 17-11.5 28.5T480-42q-17 0-28.5-11.5T440-82Zm238-200q82-82 82-198t-82-198q-82-82-198-82t-198 82q-82 82-82 198t82 198q82 82 198 82t198-82Zm-311-85q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-447 560-480t-23.5-56.5Q513-560 480-560t-56.5 23.5Q400-513 400-480t23.5 56.5Q447-400 480-400t56.5-23.5ZM480-480Z' },
    rb: { materialName: 'train', path: 'M160-340v-380q0-53 27.5-84.5t72.5-48q45-16.5 102.5-22T480-880q66 0 124.5 5.5t102 22q43.5 16.5 68.5 48t25 84.5v380q0 59-40.5 99.5T660-200l20 20q17 17 8 38.5T655-120q-7 0-13.5-2.5T630-130l-70-70H400l-70 70q-5 5-11.5 7.5T305-120q-23 0-32.5-21.5T280-180l20-20q-59 0-99.5-40.5T160-340Zm320-460q-106 0-155 12.5T258-760h448q-15-17-64.5-28.5T480-800ZM240-560h200v-120H240v120Zm420 80H240h480-60Zm-140-80h200v-120H520v120ZM383-337q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm280 0q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-363 57h360q26 0 43-17t17-43v-140H240v140q0 26 17 43t43 17Zm180-480h226-448 222Z' },
    wr: { materialName: 'call_split', path: 'M240-664v64q0 17-11.5 28.5T200-560q-17 0-28.5-11.5T160-600v-160q0-17 11.5-28.5T200-800h160q17 0 28.5 11.5T400-760q0 17-11.5 28.5T360-720h-64l201 201q11 11 17 25.5t6 30.5v263q0 17-11.5 28.5T480-160q-17 0-28.5-11.5T440-200v-264L240-664Zm480 0-98 99q-12 12-28.5 12T565-565q-12-12-12-29t12-29l99-97h-64q-17 0-28.5-11.5T560-760q0-17 11.5-28.5T600-800h160q17 0 28.5 11.5T800-760v160q0 17-11.5 28.5T760-560q-17 0-28.5-11.5T720-600v-64Z' },
    te: { materialName: 'person_shield', path: 'M458-240Zm-218 80q-33 0-56.5-23.5T160-240v-32q0-34 17.5-62.5T224-378q31-16 62.5-27t63.5-19q23-5 45-9t45-6q17-2 28.5 10t11.5 29q0 17-11.5 28.5T440-358q-18 2-35.5 4t-35.5 7q-28 7-55 17t-54 24q-9 5-14.5 14t-5.5 20v32h218q17 0 28.5 11.5T498-200q0 17-11.5 28.5T458-160H240Zm320-215q0-11 5.5-21t16.5-15l120-60q8-5 18-5t18 5l120 60q11 5 16.5 15t5.5 21v77q0 69-36 125t-98 85q-6 3-12.5 4T720-83q-7 0-13.5-1T694-88q-62-29-98-85t-36-125v-77Zm160 211q38-18 59-55t21-79v-52l-80-40-80 40v52q0 42 21 79t59 55ZM367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm240 363Z' },
    'selected-range': { materialName: 'selected_range', path: 'M388.5-291.5Q400-303 400-320t-11.5-28.5Q377-360 360-360t-28.5 11.5Q320-337 320-320t11.5 28.5Q343-280 360-280t28.5-11.5Zm120 0Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5Zm120 0Q640-303 640-320t-11.5-28.5Q617-360 600-360t-28.5 11.5Q560-337 560-320t11.5 28.5Q583-280 600-280t28.5-11.5ZM437-513l-56-57q-12-12-28.5-12T324-570q-12 12-12 28.5t12 28.5l85 85q12 12 28.5 12t28.5-12l169-170q11-12 11.5-28.5T635-655q-12-12-28-12t-28 12L437-513Zm43 433q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' },
    'rb-vs-wr': {
      materialName: 'multiline_chart',
      viewBox: '0 0 24 24',
      layers: [
        // Smooth series from the selected Material icon: WR finishes downward.
        { role: 'falling', path: 'M2.71 8.71 C4.6 7.05 7.03 6 9.61 6 C14.96 6 18.91 10.06 20 16.48' },
        // Angular series from the selected Material icon: RB finishes upward.
        { role: 'rising', path: 'M2.75 17.74 L9.5 10.98 L13.5 14.98 L17.65 10.33 L21.3 6.22' }
      ]
    },
    'hero-insights': {
      materialName: 'insights',
      viewBox: '0 0 24 24',
      layers: [
        // Positional Analysis hero kicker: preserve the supplied trend-node geometry.
        { role: 'trend', path: 'M21,8c-1.45,0-2.26,1.44-1.93,2.51l-3.55,3.56c-0.3-0.09-0.74-0.09-1.04,0l-2.55-2.55C12.27,10.45,11.46,9,10,9 c-1.45,0-2.27,1.44-1.93,2.52l-4.56,4.55C2.44,15.74,1,16.55,1,18c0,1.1,0.9,2,2,2c1.45,0,2.26-1.44,1.93-2.51l4.55-4.56 c0.3,0.09,0.74,0.09,1.04,0l2.55,2.55C12.73,16.55,13.54,18,15,18c1.45,0,2.27-1.44,1.93-2.52l3.56-3.55 C21.56,12.26,23,11.45,23,10C23,8.9,22.1,8,21,8z' },
        { role: 'sparkle-large', path: 'M15 9 15.94 6.93 18 6 15.94 5.07 15 3 14.08 5.07 12 6 14.08 6.93Z' },
        { role: 'sparkle-small', path: 'M3.5 11 4 9 6 8.5 4 8 3.5 6 3 8 1 8.5 3 9Z' }
      ]
    },
    'rb-trend': { materialName: 'trending_up', path: 'M108-255q-12-12-11.5-28.5T108-311l211-214q23-23 57-23t57 23l103 104 208-206h-64q-17 0-28.5-11.5T640-667q0-17 11.5-28.5T680-707h160q17 0 28.5 11.5T880-667v160q0 17-11.5 28.5T840-467q-17 0-28.5-11.5T800-507v-64L593-364q-23 23-57 23t-57-23L376-467 164-255q-11 11-28 11t-28-11Z' },
    'wr-trend': { materialName: 'trending_down', path: 'M744-320 536-526 433-423q-23 23-57 23t-57-23L108-636q-11-11-11.5-27.5T108-692q11-11 28-11t28 11l212 212 103-103q23-23 57-23t57 23l207 207v-64q0-17 11.5-28.5T840-480q17 0 28.5 11.5T880-440v160q0 17-11.5 28.5T840-240H680q-17 0-28.5-11.5T640-280q0-17 11.5-28.5T680-320h64Z' },
    radar: { materialName: 'radar', path: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q56 0 105.5-17.5T676-227l-57-57q-29 21-64.5 32.5T480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 39-12 75t-33 65l57 57q32-41 50-91t18-106q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-160q22 0 42.5-5.5T561-342l-61-61q-5 2-10 2.5t-10 .5q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 6-.5 11.5T557-458l60 60q11-18 17-38.5t6-43.5q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Z' },
    'line-chart': { materialName: 'monitoring', path: 'M160-120q-17 0-28.5-11.5T120-160v-40q0-17 11.5-28.5T160-240q17 0 28.5 11.5T200-200v40q0 17-11.5 28.5T160-120Zm160 0q-17 0-28.5-11.5T280-160v-220q0-17 11.5-28.5T320-420q17 0 28.5 11.5T360-380v220q0 17-11.5 28.5T320-120Zm160 0q-17 0-28.5-11.5T440-160v-140q0-17 11.5-28.5T480-340q17 0 28.5 11.5T520-300v140q0 17-11.5 28.5T480-120Zm160 0q-17 0-28.5-11.5T600-160v-200q0-17 11.5-28.5T640-400q17 0 28.5 11.5T680-360v200q0 17-11.5 28.5T640-120Zm160 0q-17 0-28.5-11.5T760-160v-360q0-17 11.5-28.5T800-560q17 0 28.5 11.5T840-520v360q0 17-11.5 28.5T800-120ZM560-481q-16 0-30.5-6T503-504L400-607 188-395q-12 12-28.5 11.5T131-396q-11-12-10.5-28.5T132-452l211-211q12-12 26.5-17.5T400-686q16 0 31 5.5t26 17.5l103 103 212-212q12-12 28.5-11.5T829-771q11 12 10.5 28.5T828-715L617-504q-11 11-26 17t-31 6Z' },
    grid: { materialName: 'grid_view', path: 'M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z' },
    users: { materialName: 'group', path: 'M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm800 112H738q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z' },
    split: { materialName: 'compare_arrows', path: 'M367-320H120q-17 0-28.5-11.5T80-360q0-17 11.5-28.5T120-400h247l-75-75q-11-11-11-27.5t11-28.5q12-12 28.5-12t28.5 12l143 143q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L348-188q-12 12-28 11.5T292-189q-11-12-11.5-28t11.5-28l75-75Zm226-240 75 75q11 11 11 27.5T668-429q-12 12-28.5 12T611-429L468-572q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l144-144q12-12 28-11.5t28 12.5q11 12 11.5 28T668-715l-75 75h247q17 0 28.5 11.5T880-600q0 17-11.5 28.5T840-560H593Z' },
    cards: { materialName: 'id_card', path: 'M720-440q17 0 28.5-11.5T760-480q0-17-11.5-28.5T720-520H600q-17 0-28.5 11.5T560-480q0 17 11.5 28.5T600-440h120Zm0-120q17 0 28.5-11.5T760-600q0-17-11.5-28.5T720-640H600q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560h120ZM360-440q-36 0-65 6.5T244-413q-21 13-32 29.5T201-348q0 12 9 20t22 8h256q13 0 22-8.5t9-21.5q0-17-11-33t-32-30q-22-14-51-20.5t-65-6.5Zm0-40q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z' },
    calendar: { materialName: 'calendar_month', path: 'M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-40q0-17 11.5-28.5T280-880q17 0 28.5 11.5T320-840v40h320v-40q0-17 11.5-28.5T680-880q17 0 28.5 11.5T720-840v40h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z' },
    stack: { materialName: 'stacked_bar_chart', path: 'M200-160q-17 0-28.5-11.5T160-200v-360q0-17 11.5-28.5T200-600h80q17 0 28.5 11.5T320-560v360q0 17-11.5 28.5T280-160h-80Zm0-480q-17 0-28.5-11.5T160-680v-80q0-17 11.5-28.5T200-800h80q17 0 28.5 11.5T320-760v80q0 17-11.5 28.5T280-640h-80Zm240 480q-17 0-28.5-11.5T400-200v-240q0-17 11.5-28.5T440-480h80q17 0 28.5 11.5T560-440v240q0 17-11.5 28.5T520-160h-80Zm0-360q-17 0-28.5-11.5T400-560v-80q0-17 11.5-28.5T440-680h80q17 0 28.5 11.5T560-640v80q0 17-11.5 28.5T520-520h-80Zm240 360q-17 0-28.5-11.5T640-200v-120q0-17 11.5-28.5T680-360h80q17 0 28.5 11.5T800-320v120q0 17-11.5 28.5T760-160h-80Zm0-240q-17 0-28.5-11.5T640-440v-80q0-17 11.5-28.5T680-560h80q17 0 28.5 11.5T800-520v80q0 17-11.5 28.5T760-400h-80Z' },
    strategy: { materialName: 'strategy', path: 'm200-531-100-57q-9-5-14.5-14.5T80-623v-114q0-11 5.5-20.5T100-772l100-57q9-5 20-5t20 5l100 57q9 5 14.5 14.5T360-737v114q0 11-5.5 20.5T340-588l-100 57q-9 5-20 5t-20-5Zm20-81 60-34v-68l-60-34-60 34v68l60 34Zm440 123v-93l100 59q19 11 29.5 29.5T800-454v188q0 21-10.5 39.5T760-197l-160 93q-19 11-40 11t-40-11l-160-93q-19-11-29.5-29.5T320-266v-188q0-21 10.5-39.5T360-523l100-59v93l-60 35v188l160 93 160-93v-188l-60-35Zm-60-151v200q0 17-11.5 28.5T560-400q-17 0-28.5-11.5T520-440v-400q0-17 11.5-28.5T560-880h245q24 0 36 21t-2 41l-24 36q-7 10-7 22t7 22l24 36q14 20 2 41t-36 21H600Zm-40 309ZM220-680Z' },
    formula: { materialName: 'function', path: 'M221-120q-45 0-73-24t-28-64q0-32 17-51.5t43-19.5q25 0 42.5 17t17.5 41q0 5-.5 9t-1.5 9q5-1 8.5-5.5T252-221l62-339h-74q-17 0-28.5-11.5T200-600q0-17 11.5-28.5T240-640h89l21-114q7-38 37.5-62t72.5-24q44 0 72 26t28 65q0 30-17 49.5T500-680q-25 0-42.5-17T440-739q0-5 .5-9t1.5-9q-6 2-9 6t-5 12l-17 99h149q17 0 28.5 11.5T600-600q0 15-9.5 26T567-561l53 60 53-60q-14-2-23.5-13t-9.5-26q0-17 11.5-28.5T680-640h120q17 0 28.5 11.5T840-600q0 17-11.5 28.5T800-560h-22L673-440l105 120h22q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H680q-17 0-28.5-11.5T640-280q0-15 9.5-26t23.5-13l-53-61-53 61q14 2 23.5 13t9.5 26q0 17-11.5 28.5T560-240H440q-17 0-28.5-11.5T400-280q0-17 11.5-28.5T440-320h22l105-120-105-120h-66l-64 344q-8 45-37 70.5T221-120Z' },
    trophy: { materialName: 'trophy', path: 'M440-200v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h120q17 0 28.5 11.5T680-160q0 17-11.5 28.5T640-120H320q-17 0-28.5-11.5T280-160q0-17 11.5-28.5T320-200h120ZM280-528v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z' },
    switch: { materialName: 'swap_horiz', path: 'm233-320 75 75q11 11 11 27.5T308-189q-12 12-28.5 12T251-189L108-332q-6-6-8.5-13T97-360q0-8 2.5-15t8.5-13l144-144q12-12 28-11.5t28 12.5q11 12 11.5 28T308-475l-75 75h247q17 0 28.5 11.5T520-360q0 17-11.5 28.5T480-320H233Zm494-240H480q-17 0-28.5-11.5T440-600q0-17 11.5-28.5T480-640h247l-75-75q-11-11-11-27.5t11-28.5q12-12 28.5-12t28.5 12l143 143q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L708-428q-12 12-28 11.5T652-429q-11-12-11.5-28t11.5-28l75-75Z' },
    spread: { materialName: 'open_in_full', path: 'M160-120q-17 0-28.5-11.5T120-160v-240q0-17 11.5-28.5T160-440q17 0 28.5 11.5T200-400v144l504-504H560q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v240q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-144L256-200h144q17 0 28.5 11.5T440-160q0 17-11.5 28.5T400-120H160Z' },
    heavy: { materialName: 'fitness_center', path: 'M282-622 168-508q-11 11-27.5 11.5T112-508q-11-11-11.5-27.5T111-564l29-30-28-28q-12-12-12-28t12-28l56-56-29-30q-11-11-11-27.5t12-28.5q11-11 27.5-11.5T196-821l30 29 56-56q12-12 28-12t28 12l28 28 30-29q11-11 27.5-11t28.5 12q11 11 11 28t-11 28L338-678l340 340 114-114q11-11 27.5-11.5T848-452q11 11 11.5 27.5T849-396l-29 30 28 28q12 12 12 28t-12 28l-56 56 29 30q11 11 11 27.5T820-140q-11 11-27.5 11.5T764-139l-30-29-56 56q-12 12-28 12t-28-12l-28-28-30 29q-11 11-27.5 11T508-112q-11-11-11-28t11-28l114-114-340-340Z' },
    jumbo: { materialName: 'fort', path: 'M40-200v-47q0-16 6-30.5T63-303l57-57v-240l-57-57q-11-11-17-25.5T40-713v-87q0-17 11.5-28.5T80-840q17 0 28.5 11.5T120-800v40h80v-40q0-17 11.5-28.5T240-840q17 0 28.5 11.5T280-800v40h80v-40q0-17 11.5-28.5T400-840q17 0 28.5 11.5T440-800v87q0 16-6 30.5T417-657l-57 57v40h240v-40l-57-57q-11-11-17-25.5t-6-30.5v-87q0-17 11.5-28.5T560-840q17 0 28.5 11.5T600-800v40h80v-40q0-17 11.5-28.5T720-840q17 0 28.5 11.5T760-800v40h80v-40q0-17 11.5-28.5T880-840q17 0 28.5 11.5T920-800v87q0 16-6 30.5T897-657l-57 57v240l57 57q11 11 17 25.5t6 30.5v47q0 33-23.5 56.5T840-120H600q-17 0-28.5-11.5T560-160v-80q0-33-23.5-56.5T480-320q-33 0-56.5 23.5T400-240v80q0 17-11.5 28.5T360-120H120q-33 0-56.5-23.5T40-200Zm80 0h200v-40q0-66 47-113t113-47q66 0 113 47t47 113v40h200v-47l-80-80v-306l47-47H633l47 47v153H280v-153l47-47H153l47 47v306l-80 80v47Zm360-240Z' },
    field: { materialName: 'stadium', path: 'M120-712v-96q0-11 9.5-17t19.5-1l95 48q11 5 11 18t-11 18l-95 48q-10 5-19.5-1t-9.5-17Zm600 0v-96q0-11 9.5-17t19.5-1l95 48q11 5 11 18t-11 18l-95 48q-10 5-19.5-1t-9.5-17Zm-280-40v-96q0-11 9.5-17t19.5-1l95 48q11 5 11 18t-11 18l-95 48q-10 5-19.5-1t-9.5-17ZM406-81q-140-8-233-41.5T80-200v-360q0-25 31.5-46.5t85.5-38q54-16.5 127-26t156-9.5q83 0 156 9.5t127 26q54 16.5 85.5 38T880-560v360q0 45-93.5 78T553-81q-14 1-23.5-8.5T520-113v-127h-80v126q0 14-10 24t-24 9Zm74-439q97 0 167.5-11.5T760-558q0-5-76-23.5T480-600q-128 0-204 18.5T200-558q42 15 112.5 26.5T480-520ZM360-166v-74q0-33 23.5-56.5T440-320h80q33 0 56.5 23.5T600-240v74q80-8 131-23.5t69-27.5v-271q-55 22-138 35t-182 13q-99 0-182-13t-138-35v271q18 12 69 27.5T360-166Zm120-161Z' },
    milestone: { materialName: 'history', path: 'M480-120q-126 0-223-76.5T131-392q-4-15 6-27.5t27-14.5q16-2 29 6t18 24q24 90 99 147t170 57q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm40-376 100 100q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z' },
    network: { materialName: 'hub', path: 'M240-40q-50 0-85-35t-35-85q0-50 35-85t85-35q14 0 26 3t23 8l57-71q-28-31-39-70t-5-78l-81-27q-17 25-43 40t-58 15q-50 0-85-35T0-580q0-50 35-85t85-35q50 0 85 35t35 85v8l81 28q20-36 53.5-61t75.5-32v-87q-39-11-64.5-42.5T360-840q0-50 35-85t85-35q50 0 85 35t35 85q0 42-26 73.5T510-724v87q42 7 75.5 32t53.5 61l81-28v-8q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-32 0-58.5-15T739-515l-81 27q6 39-5 77.5T614-340l57 70q11-5 23-7.5t26-2.5q50 0 85 35t35 85q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-20 6.5-38.5T624-232l-57-71q-41 23-87.5 23T392-303l-56 71q11 15 17.5 33.5T360-160q0 50-35 85t-85 35ZM120-540q17 0 28.5-11.5T160-580q0-17-11.5-28.5T120-620q-17 0-28.5 11.5T80-580q0 17 11.5 28.5T120-540Zm120 420q17 0 28.5-11.5T280-160q0-17-11.5-28.5T240-200q-17 0-28.5 11.5T200-160q0 17 11.5 28.5T240-120Zm240-680q17 0 28.5-11.5T520-840q0-17-11.5-28.5T480-880q-17 0-28.5 11.5T440-840q0 17 11.5 28.5T480-800Zm0 440q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm240 240q17 0 28.5-11.5T760-160q0-17-11.5-28.5T720-200q-17 0-28.5 11.5T680-160q0 17 11.5 28.5T720-120Zm120-420q17 0 28.5-11.5T880-580q0-17-11.5-28.5T840-620q-17 0-28.5 11.5T800-580q0 17 11.5 28.5T840-540ZM480-840ZM120-580Zm360 120Zm360-120ZM240-160Zm480 0Z' },
    timeline: { materialName: 'timeline', path: 'M120-240q-33 0-56.5-23.5T40-320q0-33 23.5-56.5T120-400h10.5q4.5 0 9.5 2l182-182q-2-5-2-9.5V-600q0-33 23.5-56.5T400-680q33 0 56.5 23.5T480-600q0 2-2 20l102 102q5-2 9.5-2h21q4.5 0 9.5 2l142-142q-2-5-2-9.5V-640q0-33 23.5-56.5T840-720q33 0 56.5 23.5T920-640q0 33-23.5 56.5T840-560h-10.5q-4.5 0-9.5-2L678-420q2 5 2 9.5v10.5q0 33-23.5 56.5T600-320q-33 0-56.5-23.5T520-400v-10.5q0-4.5 2-9.5L420-522q-5 2-9.5 2H400q-2 0-20-2L198-340q2 5 2 9.5v10.5q0 33-23.5 56.5T120-240Z' },
    warning: { materialName: 'warning', path: 'M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm69-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Zm0-100Z' },
    cycle: { materialName: 'cycle', path: 'M160-479q0 85 42.5 158T318-204q14 9 19.5 24.5T335-150q-8 15-24.5 19.5T279-134q-93-54-146-146T80-479q0-26 3.5-51t9.5-50l-13 8q-14 9-30 4.5T26-586q-8-14-3.5-30.5T41-641l121-70q14-8 30.5-3.5T217-696l70 120q8 14 3.5 30.5T272-521q-14 8-30.5 3.5T217-536l-34-59q-11 28-17 57t-6 59Zm320-321q-41 0-81 10.5T323-759q-15 8-31.5 5.5T267-770q-9-16-4-32.5t21-25.5q45-26 94.5-39T480-880q79 0 151.5 29.5T761-765v-15q0-17 11.5-28.5T801-820q17 0 28.5 11.5T841-780v140q0 17-11.5 28.5T801-600H661q-17 0-28.5-11.5T621-640q0-17 11.5-28.5T661-680h69q-46-57-111-88.5T480-800Zm242 531q38-44 58-97t20-111q0-17 11.5-30t28.5-13q17 0 28.5 13t11.5 30q0 65-20.5 125.5T800-239q-39 52-92.5 89T591-95l10 6q14 8 18 24.5T615-34q-8 14-24 18t-30-4L439-90q-14-8-18.5-24.5T424-145l70-121q8-14 24-18t30 4q14 8 18.5 24.5T563-225l-37 63q57-8 107.5-35.5T722-269Z' },
    ground: { materialName: 'grass', path: 'M120-160q-17 0-28.5-11.5T80-200q0-17 11.5-28.5T120-240h190q-17-63-56-114t-94-83q-22-13-21-28.5t27-14.5q131 2 222.5 95T480-160H120Zm440 0q0-42-9-83.5T525-323q42-69 112.5-112T794-480q24-1 25 15.5T800-437q-55 32-94 83t-56 114h190q17 0 28.5 11.5T880-200q0 17-11.5 28.5T840-160H560Zm-80-239q0-106 60.5-188.5T696-702q23-8 34 5t-9 32q-32 30-55.5 67T626-519q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-53-11.5-101T315-726q-11-22 1.5-32.5T349-753q36 29 63.5 66t44.5 81q-18 30-31 63.5T407-474Z' },
    target: { materialName: 'target', path: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Z' },
    'trend-up': { materialName: 'trending_up', path: 'M108-255q-12-12-11.5-28.5T108-311l211-214q23-23 57-23t57 23l103 104 208-206h-64q-17 0-28.5-11.5T640-667q0-17 11.5-28.5T680-707h160q17 0 28.5 11.5T880-667v160q0 17-11.5 28.5T840-467q-17 0-28.5-11.5T800-507v-64L593-364q-23 23-57 23t-57-23L376-467 164-255q-11 11-28 11t-28-11Z' },
    'trend-down': { materialName: 'trending_down', path: 'M744-320 536-526 433-423q-23 23-57 23t-57-23L108-636q-11-11-11.5-27.5T108-692q11-11 28-11t28 11l212 212 103-103q23-23 57-23t57 23l207 207v-64q0-17 11.5-28.5T840-480q17 0 28.5 11.5T880-440v160q0 17-11.5 28.5T840-240H680q-17 0-28.5-11.5T640-280q0-17 11.5-28.5T680-320h64Z' }
  };

  const { distributionByPosition: SYOP_DISTRIBUTION, summaryByPosition: SYOP_POSITION_SUMMARY } = buildSyopSummary();

  let resizeTimer = null;

  function buildSyopSummary() {
    const distributionByPosition = {};
    const summaryByPosition = {};

    POSITION_CONFIG.forEach((config) => {
      const totalPlayers = POSITION_TOTALS[config.key] || 0;
      const allocation = allocateBucketCounts(config.percentKey, totalPlayers);
      const valueSamples = [];

      allocation.forEach(({ bucket, count }) => {
        const numericValue = bucketToNumeric(bucket);
        for (let i = 0; i < count; i += 1) {
          valueSamples.push(numericValue);
        }
      });

      valueSamples.sort((a, b) => a - b);
      const { median, q1, q3 } = computeQuantiles(valueSamples);
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const shareTwoPlus = valueSamples.filter((value) => value >= 2).length / (valueSamples.length || 1);
      const shareThreePlus = valueSamples.filter((value) => value >= 3).length / (valueSamples.length || 1);
      const outlierCount = valueSamples.filter((value) => value < lowerFence || value > upperFence).length;

      distributionByPosition[config.key] = SYOP_DATA.map((row) => ({
        bucket: row.SYOP,
        percentage: row[config.percentKey] || 0
      }));

      summaryByPosition[config.key] = {
        total: totalPlayers,
        median,
        q1,
        q3,
        iqr,
        shareTwoPlus,
        shareThreePlus,
        min: valueSamples[0] || 0,
        max: valueSamples[valueSamples.length - 1] || 0,
        outliers: outlierCount
      };
    });

    return { distributionByPosition, summaryByPosition };
  }

  function allocateBucketCounts(percentKey, totalPlayers) {
    const rows = SYOP_DATA.map((row) => ({
      bucket: row.SYOP,
      raw: (row[percentKey] || 0) * totalPlayers / 100
    }));

    const rounded = rows.map((entry) => Math.round(entry.raw));
    let diff = totalPlayers - rounded.reduce((sum, value) => sum + value, 0);

    if (diff !== 0) {
      const adjustments = rows
        .map((entry, index) => ({ index, fraction: entry.raw - Math.round(entry.raw) }))
        .sort((a, b) => (diff > 0 ? b.fraction - a.fraction : a.fraction - b.fraction));

      for (let i = 0; i < Math.abs(diff); i += 1) {
        const target = adjustments[i % adjustments.length]?.index ?? 0;
        rounded[target] += diff > 0 ? 1 : -1;
      }
    }

    return rows.map((row, index) => ({
      bucket: row.bucket,
      count: Math.max(0, rounded[index])
    }));
  }

  function bucketToNumeric(bucket) {
    if (typeof bucket !== 'string') return Number(bucket) || 0;
    if (bucket.includes('+')) {
      const base = parseFloat(bucket.replace('+', ''));
      return Number.isNaN(base) ? 0 : base + 0.5;
    }
    const value = parseFloat(bucket);
    return Number.isNaN(value) ? 0 : value;
  }

  function formatSyopValue(value) {
    if (value == null || Number.isNaN(value)) return '—';
    if (value >= 12.25) return '12+';
    const rounded = Math.round(value * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 1e-6) {
      return String(Math.round(rounded));
    }
    return rounded.toFixed(1);
  }

  function computeQuantiles(values) {
    if (!values.length) {
      return { median: 0, q1: 0, q3: 0 };
    }
    const sorted = values.slice().sort((a, b) => a - b);
    const median = quantile(sorted, 0.5);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    return { median, q1, q3 };
  }

  function quantile(values, p) {
    if (values.length === 0) return 0;
    const pos = (values.length - 1) * p;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    if (lower === upper) {
      return values[lower];
    }
    const weight = pos - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
  }

  function createEl(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') {
          el.className = value;
        } else if (key === 'dataset') {
          Object.entries(value).forEach(([dKey, dValue]) => {
            el.dataset[dKey] = dValue;
          });
        } else if (key === 'style' && typeof value === 'object') {
          Object.entries(value).forEach(([styleKey, styleValue]) => {
            if (styleKey.startsWith('--')) {
              el.style.setProperty(styleKey, styleValue);
            } else {
              el.style[styleKey] = styleValue;
            }
          });
        } else if (key in el) {
          try {
            el[key] = value;
          } catch (_) {
            el.setAttribute(key, value);
          }
        } else {
          el.setAttribute(key, value);
        }
      });
    }
    children.forEach((child) => {
      if (child == null) return;
      if (Array.isArray(child)) {
        child.forEach((nested) => nested != null && el.appendChild(typeof nested === 'string' ? document.createTextNode(nested) : nested));
      } else {
        el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
      }
    });
    return el;
  }

  function createSVG(tag, attrs, ...children) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
      });
    }
    children.forEach((child) => {
      if (child == null) return;
      el.appendChild(child);
    });
    return el;
  }

  const sunburstNodeById = new Map(SUNBURST_NODES.map((node) => [node.id, node]));

  function childrenOf(id) {
    return SUNBURST_NODES.filter((node) => node.parent === id);
  }

  function polar(cx, cy, r, a) {
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function arcPath(cx, cy, rInner, rOuter, a0, a1) {
    const p0 = polar(cx, cy, rOuter, a0);
    const p1 = polar(cx, cy, rOuter, a1);
    const p2 = polar(cx, cy, rInner, a1);
    const p3 = polar(cx, cy, rInner, a0);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rInner} ${rInner} 0 ${large} 0 ${p3.x} ${p3.y} Z`;
  }

  function labelAt(cx, cy, r, a) {
    return polar(cx, cy, r, a);
  }

  function seriesColor(series) {
    switch (series) {
      case 'QB':
        return colors.qb;
      case 'RB':
        return colors.rb;
      case 'WR':
        return colors.wr;
      case 'TE':
        return colors.te;
      default:
        return '#6b7280';
    }
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace('#', '');
    const value = parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function stripYearSuffix(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/\s*yrs?\.?/gi, '').trim();
  }

  const SYOP_CHART_FONT_FAMILY = '"Product Sans", "Google Sans", "Quicksand"';

  function getSunburstMetricParts(abbr) {
    if (typeof abbr !== 'string') return null;
    const chars = Array.from(abbr.trim());
    if (chars.length < 3) return null;
    const base = chars.slice(0, -1).join('');
    const suffix = chars[chars.length - 1];
    const baseKind = base === 'SP' ? 'sp' : base === 'BO' ? 'bo' : null;
    const suffixKind = suffix === 'ᴧ' ? 'lambda' : suffix === 'ϻ' ? 'mode' : null;
    if (baseKind && suffixKind) return { baseKind, suffixKind, base, suffix };
    return null;
  }

  const labelAccent = '#9096C0';

  function renderSunburst() {
    const container = document.getElementById('syop-sunburst');
    if (!container) return;

    const root = sunburstNodeById.get('root');
    const ring1Nodes = childrenOf(root?.id || 'root');
    const ring1Total = ring1Nodes.reduce((sum, node) => sum + node.value, 0) || 1;
    const baseSize = 480;
    const containerWidth = container.clientWidth || baseSize;
    const constrained = Math.max(320, containerWidth);
    const size = Math.min(baseSize, constrained);
    const rawScale = size / baseSize;
    const scale = Math.pow(rawScale, 0.85);
    const pad = 64 * scale;
    const cx = size / 2;
    const cy = size / 2;
    const inner1 = 104 * scale;
    const outer1 = 178 * scale;
    const inner2 = 184 * scale;
    const outer2 = 284 * scale;
    const ring1Opacity = 0.75;
    const ring2Opacity = 0.45;
    const centerRadius = 94 * scale;
    const textStroke = 'rgba(11, 14, 22, 0.68)';
    const fontSize = (value, floor = 12) => Math.max(value * scale, floor);
    const startAngle = -Math.PI / 2;

    const svg = createSVG('svg', {
      viewBox: `${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`,
      width: String(size),
      height: String(size),
      class: 'syop-sunburst-svg',
      style: `--syop-sunburst-scale: ${scale};`,
      role: 'img',
      'aria-labelledby': 'syop-infographic-heading'
    });

    let cursor = startAngle;
    const ring1Segments = ring1Nodes.map((node) => {
      const span = (node.value / ring1Total) * Math.PI * 2;
      const segment = { node, a0: cursor, a1: cursor + span };
      cursor += span;
      return segment;
    });

    const ring2Segments = [];
    ring1Segments.forEach((segment) => {
      const children = childrenOf(segment.node.id);
      const total = children.reduce((sum, child) => sum + child.value, 0) || 1;
      let childCursor = segment.a0;
      children.forEach((child) => {
        const span = (child.value / total) * (segment.a1 - segment.a0);
        ring2Segments.push({ parent: segment, node: child, a0: childCursor, a1: childCursor + span });
        childCursor += span;
      });
    });

    ring1Segments.forEach((segment) => {
      const color = seriesColor(segment.node.series);
      const path = createSVG('path', {
        d: arcPath(cx, cy, inner1, outer1, segment.a0, segment.a1),
        fill: hexToRgba(color, ring1Opacity),
        stroke: colors.bg,
        'stroke-width': (1.2 * scale).toFixed(3)
      });
      svg.appendChild(path);

      const mid = (segment.a0 + segment.a1) / 2;
      const pos = labelAt(cx, cy, (inner1 + outer1) / 2, mid);
      const text = createSVG('text', {
        x: pos.x,
        y: pos.y - 6 * scale,
        fill: colors.text,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': fontSize(26, 24),
        'font-weight': '600',
        'paint-order': 'stroke',
        stroke: textStroke,
        'stroke-width': Math.max(0.45, 0.6 * scale).toFixed(3),
        'font-family': SYOP_CHART_FONT_FAMILY
      });
      text.appendChild(document.createTextNode(segment.node.label));
      const subtitleText = stripYearSuffix(segment.node.subtitle);
      if (subtitleText && !segment.node.series) {
        const subtitle = createSVG('tspan', {
          x: pos.x,
          dy: `${18 * scale}`,
          'font-size': fontSize(15, 13),
          'font-weight': '700',
          fill: colors.text,
          'font-family': SYOP_CHART_FONT_FAMILY
        }, document.createTextNode(subtitleText));
        text.appendChild(subtitle);
      }
      svg.appendChild(text);
    });

    ring2Segments.forEach((segment) => {
      const parentColor = seriesColor(segment.parent.node.series);
      const path = createSVG('path', {
        d: arcPath(cx, cy, inner2, outer2, segment.a0, segment.a1),
        fill: hexToRgba(parentColor, ring2Opacity),
        stroke: colors.bg,
        'stroke-width': (1.1 * scale).toFixed(3)
      });
      svg.appendChild(path);

      const mid = (segment.a0 + segment.a1) / 2;
      const radius = (inner2 + outer2) / 2;
      const center = labelAt(cx, cy, radius, mid);
      const metricAbbr = segment.node.abbr || segment.node.label;
      const metricParts = getSunburstMetricParts(metricAbbr);
      const label = createSVG('text', {
        x: center.x,
        y: center.y - 2 * scale,
        class: metricParts ? `syop-sunburst-metric-label syop-sunburst-metric-label--${metricParts.baseKind} syop-sunburst-metric-label--${metricParts.suffixKind}` : 'syop-sunburst-metric-label',
        fill: labelAccent,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'paint-order': 'stroke',
        stroke: textStroke,
        'stroke-width': Math.max(0.4, 0.6 * scale).toFixed(3)
      });

      // SYOP Sunburst metric labels: JS only splits label parts into semantic
      // classes; CSS owns base/suffix colors, sizing, weight, and spacing.
      if (metricParts) {
        label.appendChild(createSVG('tspan', {
          class: `syop-sunburst-metric-base syop-sunburst-metric-base--${metricParts.baseKind}`
        }, document.createTextNode(metricParts.base)));
        label.appendChild(createSVG('tspan', {
          class: `syop-sunburst-metric-suffix syop-sunburst-metric-suffix--${metricParts.suffixKind}`
        }, document.createTextNode(metricParts.suffix)));
      } else {
        label.appendChild(document.createTextNode(metricAbbr));
      }

      const statRaw = segment.node.stat || (segment.node.subtitle ? segment.node.subtitle.replace(/[^0-9.]+/g, '') : '');
      const stat = stripYearSuffix(statRaw);
      if (stat) {
        label.appendChild(createSVG('tspan', {
          x: center.x,
          dy: `${26 * scale}`,
          'font-size': fontSize(20, 16),
          'font-weight': '800',
          fill: colors.text,
          'paint-order': 'stroke',
          stroke: textStroke,
          'stroke-width': Math.max(0.42, 0.65 * scale).toFixed(3),
          'font-family': SYOP_CHART_FONT_FAMILY
        }, document.createTextNode(stat)));
      }
      svg.appendChild(label);
    });

    const centerCircle = createSVG('circle', {
      cx,
      cy,
      r: centerRadius,
      fill: '#111628',
      stroke: colors.bg,
      'stroke-width': (1.2 * scale).toFixed(3)
    });
    svg.appendChild(centerCircle);

    const titleTop = createSVG('text', {
      x: cx,
      y: cy - 30 * scale,
      fill: colors.text,
      'font-size': fontSize(23, 21),
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: textStroke,
      'stroke-width': Math.max(0.45, 0.64 * scale).toFixed(3),
      'font-family': SYOP_CHART_FONT_FAMILY
    }, document.createTextNode('Λ | Mean'));
    svg.appendChild(titleTop);

    const titleBottom = createSVG('text', {
      x: cx,
      y: cy + 0 * scale,
      fill: colors.text,
      'font-size': fontSize(23, 21),
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: textStroke,
      'stroke-width': Math.max(0.45, 0.64 * scale).toFixed(3),
      'font-family': SYOP_CHART_FONT_FAMILY
    }, document.createTextNode('ϻ | Mode'));
    svg.appendChild(titleBottom);

    if (root?.subtitle) { svg.appendChild(createSVG('text', { x: cx, y: cy + 29 * scale, fill: colors.subtext, 'font-size': '11px', 'font-weight': '400',
        'text-anchor': 'middle',
        'font-family': SYOP_CHART_FONT_FAMILY
      }, document.createTextNode(root.subtitle)));
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  function renderBarChart() {
    const container = document.getElementById('syop-bar-chart');
    if (!container) return;
    container.innerHTML = '';

    const controls = createEl('div', { class: 'syop-bar-controls' });
    controls.appendChild(createEl('span', { class: 'syop-filter-label' }, 'Positions'));

    if (!syopChartState.activePosition && POSITION_CONFIG.length) {
      syopChartState.activePosition = POSITION_CONFIG[0].key;
    }

    const legend = createEl('div', { class: 'syop-position-legend', role: 'group', 'aria-label': 'SYOP position filter' });
    POSITION_CONFIG.forEach((config) => {
      const isActive = syopChartState.activePosition === config.key;
      const chip = createEl('button', {
        type: 'button',
        class: `syop-legend-chip${isActive ? ' active' : ''}`,
        style: { '--chip-accent': config.color },
        'aria-pressed': String(isActive)
      },
      createEl('span', { class: 'chip-label' }, config.key));

      chip.addEventListener('click', () => {
        if (syopChartState.activePosition === config.key) return;
        syopChartState.activePosition = config.key;
        renderBarChart();
      });
      legend.appendChild(chip);
    });
    controls.appendChild(legend);

    const viewToggle = createEl('button', {
      type: 'button',
      class: 'syop-view-toggle',
      'aria-pressed': String(syopChartState.showTable),
      'aria-controls': 'syop-distribution-view'
    }, syopChartState.showTable ? 'View chart' : 'View as table');
    viewToggle.addEventListener('click', () => {
      syopChartState.showTable = !syopChartState.showTable;
      renderBarChart();
    });
    controls.appendChild(viewToggle);

    container.appendChild(controls);

    const viewWrapper = createEl('div', { class: 'syop-bar-wrapper', id: 'syop-distribution-view' });
    container.appendChild(viewWrapper);

    const tooltip = createEl('div', { class: 'syop-bar-tooltip', role: 'tooltip', id: 'syop-bar-tooltip' });
    container.appendChild(tooltip);

    if (syopChartState.showTable) {
      renderSyopTable(viewWrapper);
      tooltip.classList.add('hidden');
      return;
    }

    tooltip.classList.remove('hidden');
    const activeConfig = POSITION_CONFIG.find((config) => config.key === syopChartState.activePosition)
      || POSITION_CONFIG[0];

    if (!activeConfig) {
      viewWrapper.appendChild(createEl('p', { class: 'syop-violin-empty' }, 'No positions available.'));
      return;
    }

    const metrics = SYOP_POSITION_SUMMARY[activeConfig.key];
    const distribution = SYOP_DISTRIBUTION[activeConfig.key] || [];
    const panel = createEl('section', { class: 'syop-violin-panel' });

    const header = createEl('header', { class: 'syop-violin-header' },
      createEl('div', { class: 'syop-violin-title-block' },
        createEl('h4', { class: 'syop-violin-title' }, activeConfig.label),
        createEl('div', { class: 'syop-violin-meta' },
          createEl('span', null, `${metrics?.total ?? 0} players`),
          createEl('span', null, `Median ${formatSyopValue(metrics?.median)} yrs`)
        )
      )
    );

    panel.appendChild(header);

    const plot = createEl('div', { class: 'syop-bar-plot' });
    panel.appendChild(plot);
    viewWrapper.appendChild(panel);

    drawSyopBarChart(plot, activeConfig, distribution, tooltip, container);
  }

  function drawSyopBarChart(plotContainer, config, distribution, tooltip, rootContainer) {
    const containerWidth = plotContainer.clientWidth || plotContainer.parentElement?.clientWidth || 320;
    const isCompact = window.innerWidth < 720 || containerWidth < 360;
    const width = Math.max(280, containerWidth);
    // SYOP tab bar-chart SVG: keep the generated viewBox tight around the
    // x-axis labels/title so the chart card does not render dead space below.
    const height = isCompact ? 226 : 280;
    const margin = isCompact
      ? { top: 20, right: 16, bottom: 44, left: 44 }
      : { top: 26, right: 20, bottom: 48, left: 48 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const values = distribution.map((entry) => entry.percentage || 0);
    const maxValue = Math.max(...values, 0);
    const yMax = maxValue === 0 ? 5 : Math.ceil(maxValue / 5) * 5;
    const tickStep = yMax > 40 ? 10 : yMax > 20 ? 5 : yMax > 10 ? 2 : 1;

    const scaleY = (value) => {
      if (yMax === 0) return margin.top + chartHeight;
      const clamped = Math.max(0, value);
      return margin.top + chartHeight - (clamped / yMax) * chartHeight;
    };

    plotContainer.innerHTML = '';
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      class: 'syop-bar-svg'
    });

    const gradientStops = BAR_GRADIENTS[config.key] || BAR_GRADIENTS.DEFAULT;
    const gradientId = `syop-bar-gradient-${config.key.toLowerCase()}`;
    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', {
      id: gradientId,
      gradientUnits: 'userSpaceOnUse',
      x1: margin.left,
      y1: margin.top + chartHeight,
      x2: margin.left,
      y2: margin.top
    });

    gradientStops.forEach((stop) => {
      if (!stop) return;
      const attrs = {
        offset: stop.offset ?? '0%',
        'stop-color': stop.color || '#7C83FF'
      };
      if (typeof stop.opacity === 'number') {
        attrs['stop-opacity'] = String(stop.opacity);
      }
      gradient.appendChild(createSVG('stop', attrs));
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    svg.appendChild(createSVG('rect', {
      x: margin.left,
      y: margin.top,
      width: chartWidth,
      height: chartHeight,
      class: 'syop-bar-area'
    }));

    const axisGroup = createSVG('g');

    for (let tick = 0; tick <= yMax; tick += tickStep) {
      const y = scaleY(tick);
      axisGroup.appendChild(createSVG('line', {
        x1: margin.left,
        x2: margin.left + chartWidth,
        y1: y,
        y2: y,
        class: 'syop-bar-grid'
      }));
      axisGroup.appendChild(createSVG('text', {
        x: margin.left - 8,
        y: y + 4,
        class: 'syop-bar-tick-label'
      }, document.createTextNode(`${tick}%`)));
    }

    axisGroup.appendChild(createSVG('line', {
      x1: margin.left,
      x2: margin.left,
      y1: margin.top,
      y2: margin.top + chartHeight,
      class: 'syop-bar-axis'
    }));

    axisGroup.appendChild(createSVG('line', {
      x1: margin.left,
      x2: margin.left + chartWidth,
      y1: margin.top + chartHeight,
      y2: margin.top + chartHeight,
      class: 'syop-bar-axis'
    }));

    const axisTitleY = createSVG('text', {
      x: margin.left - 35,
      y: margin.top + chartHeight / 2,
      class: 'syop-bar-axis-title syop-bar-axis-title-y',
      transform: `rotate(-90 ${margin.left - 35} ${margin.top + chartHeight / 2})`
    }, document.createTextNode('% of position'));

    axisGroup.appendChild(axisTitleY);

    const axisTitleX = createSVG('text', {
      x: margin.left + chartWidth / 2,
      y: margin.top + chartHeight + 30,
      class: 'syop-bar-axis-title syop-bar-axis-title-x'
    }, document.createTextNode('SYOP'));

    axisGroup.appendChild(axisTitleX);

    svg.appendChild(axisGroup);

    const bandWidth = chartWidth / Math.max(distribution.length, 1);
    const barWidth = Math.max(10, bandWidth * 0.64);

    const gradientStroke = (gradientStops[gradientStops.length - 1] || {}).color || config.color;

    distribution.forEach((entry, index) => {
      const value = entry.percentage || 0;
      const barHeight = Math.max(0, margin.top + chartHeight - scaleY(value));
      const x = margin.left + index * bandWidth + (bandWidth - barWidth) / 2;
      const y = scaleY(value);
      const rect = createSVG('rect', {
        x,
        y,
        width: barWidth,
        height: barHeight,
        rx: 6,
        class: 'syop-bar-rect',
        style: `--bar-stroke: ${gradientStroke}; fill: url(#${gradientId});`,
        tabindex: '0',
        role: 'button',
        'aria-label': `${config.key} ${Math.round(value * 10) / 10}%`
      });
      attachBarInteractions(rect, config, value, tooltip, rootContainer, gradientStroke);
      svg.appendChild(rect);

      const labelX = margin.left + index * bandWidth + bandWidth / 2;
      svg.appendChild(createSVG('text', {
        x: labelX,
        y: margin.top + chartHeight + 18,
        class: 'syop-bar-x-label'
      }, document.createTextNode(entry.bucket)));
    });

    plotContainer.appendChild(svg);
  }

  function attachBarInteractions(element, config, percentage, tooltip, rootContainer, accentColor) {
    if (!tooltip) return;
    const color = accentColor || config.color;
    const formattedPercent = `${Math.round(percentage * 10) / 10}%`;

    const hideTooltip = () => {
      element.classList.remove('active');
      tooltip.classList.remove('visible');
    };

    const showTooltip = () => {
      element.classList.add('active');
      tooltip.innerHTML = '';
      tooltip.style.setProperty('--tooltip-accent', color);
      tooltip.appendChild(createEl('div', { class: 'tooltip-name' }, config.key));
      tooltip.appendChild(createEl('div', { class: 'tooltip-meta' }, formattedPercent));

      const rootRect = rootContainer.getBoundingClientRect();
      const barRect = element.getBoundingClientRect();
      const containerWidth = rootRect.width;
      let left = barRect.left - rootRect.left + barRect.width / 2;
      left = Math.max(20, Math.min(containerWidth - 20, left));
      const top = barRect.top - rootRect.top - 8;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('visible');
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('focus', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('blur', hideTooltip);
    element.addEventListener('click', (event) => {
      event.preventDefault();
      showTooltip();
    });
  }
  function renderSyopTable(wrapper) {
    wrapper.innerHTML = '';
    const tableWrapper = createEl('div', { class: 'syop-table-wrapper' });
    const table = createEl('table', { class: 'syop-table' });
    table.appendChild(createEl('caption', null, 'SYOP distribution summary by position'));

    const thead = createEl('thead', null,
      createEl('tr', null,
        createEl('th', null, 'Position'),
        createEl('th', null, 'Players'),
        createEl('th', null, 'Median SYOP'),
        createEl('th', null, 'IQR (25%–75%)'),
        createEl('th', null, '≥2 SYOP'),
        createEl('th', null, '≥3 SYOP'),
        createEl('th', null, 'Max'),
        createEl('th', null, 'Outliers')
      )
    );
    table.appendChild(thead);

    const tbody = createEl('tbody');
    POSITION_CONFIG.forEach((config) => {
      const metrics = SYOP_POSITION_SUMMARY[config.key];
      tbody.appendChild(createEl('tr', null,
        createEl('th', { scope: 'row' }, `${config.key} · ${config.label}`),
        createEl('td', null, metrics ? String(metrics.total) : '0'),
        createEl('td', null, metrics ? formatSyopValue(metrics.median) : '—'),
        createEl('td', null, metrics ? `${formatSyopValue(metrics.q1)} – ${formatSyopValue(metrics.q3)}` : '—'),
        createEl('td', null, metrics ? `${Math.round((metrics.shareTwoPlus || 0) * 100)}%` : '—'),
        createEl('td', null, metrics ? `${Math.round((metrics.shareThreePlus || 0) * 100)}%` : '—'),
        createEl('td', null, metrics ? formatSyopValue(metrics.max) : '—'),
        createEl('td', null, metrics ? String(metrics.outliers || 0) : '0')
      ));
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    wrapper.appendChild(tableWrapper);
  }

  function renderGauges() {
    const container = document.getElementById('syop-gauges');
    if (!container) return;
    container.innerHTML = '';

    GAUGES.forEach((gauge) => {
      const gaugeWrapper = createEl('div', { class: 'syop-gauge-card' });
      const svg = renderGaugeSVG(gauge);
      const label = createEl('div', { class: 'syop-gauge-label' },
        createEl('span', { class: 'gauge-value', style: { color: gauge.color } }, gauge.key),
        createEl('span', { class: 'gauge-title', style: { color: colors.subtext } }, 'AVG SYOP (YRS)')
      );
      gaugeWrapper.appendChild(svg);
      gaugeWrapper.appendChild(label);
      container.appendChild(gaugeWrapper);
    });
  }

  function renderGaugeSVG(gauge) {
    const min = 2;
    const max = 8;
    const width = 240;
    const height = 160;
    const cx = width / 2;
    const cy = height - 18;
    const radius = 112;
    const trackWidth = 18;

    const start = -Math.PI;
    const end = 0;
    const map = (value) => start + ((value - min) / (max - min)) * (end - start);
    const valueAngle = map(Math.max(min, Math.min(max, gauge.value)));

    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      class: 'syop-gauge-svg'
    });

    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', {
      id: `gauge-gradient-${gauge.key}`,
      x1: '0',
      y1: '1',
      x2: '1',
      y2: '0'
    });
    gradient.appendChild(createSVG('stop', { offset: '0%', 'stop-color': hexToRgba(gauge.color, 0.4) }));
    gradient.appendChild(createSVG('stop', { offset: '100%', 'stop-color': gauge.color }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const track = createSVG('path', {
      d: describeArc(cx, cy, radius, start, end),
      stroke: 'rgba(31, 36, 55, 0.8)',
      'stroke-width': trackWidth,
      'stroke-linecap': 'round',
      fill: 'none'
    });
    svg.appendChild(track);

    const valuePath = createSVG('path', {
      d: describeArc(cx, cy, radius, start, valueAngle),
      stroke: `url(#gauge-gradient-${gauge.key})`,
      'stroke-width': trackWidth,
      'stroke-linecap': 'round',
      fill: 'none'
    });
    svg.appendChild(valuePath);

    const ticks = [2, 3.5, 5, 6.5, 8];
    ticks.forEach((tick) => {
      const angle = map(tick);
      const inner = polar(cx, cy, radius - trackWidth / 2 - 4, angle);
      const outer = polar(cx, cy, radius + trackWidth / 2 + 4, angle);
      const line = createSVG('line', {
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
        stroke: 'rgba(255,255,255,0.7)',
        'stroke-width': '1.5'
      });
      svg.appendChild(line);

      const label = createSVG('text', {
        x: outer.x,
        y: outer.y - 6,
        fill: colors.subtext,
        'font-size': '11',
        'text-anchor': 'middle'
      }, document.createTextNode(tick.toString()));
      svg.appendChild(label);
    });

    const valueText = createSVG('text', {
      x: cx,
      y: cy - 40,
      fill: gauge.color,
      'font-size': '30',
      'font-weight': '800',
      'text-anchor': 'middle',
      'paint-order': 'stroke',
      stroke: 'rgba(11, 14, 22, 0.72)',
      'stroke-width': '0.6'
    }, document.createTextNode(gauge.value.toFixed(2)));
    svg.appendChild(valueText);

    svg.appendChild(createSVG('text', {
      x: cx,
      y: cy - 16,
      fill: colors.subtext,
      'font-size': '16',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('YRS')));

    return svg;
  }

  function describeArc(cx, cy, radius, a0, a1) {
    const start = polar(cx, cy, radius, a0);
    const end = polar(cx, cy, radius, a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  function renderDraftOverall() {
    const container = document.getElementById('draft-overall-chart');
    if (!container) return;
    container.innerHTML = '';

    const containerWidth = container.clientWidth || 0;
    const fallbackWidth = 360;
    const width = containerWidth > 0 ? containerWidth : fallbackWidth;
    const height = width < 520 ? 270 : 320;
    const margin = width < 520
      ? { top: 26, right: 14, bottom: 48, left: 46 }
      : { top: 32, right: 24, bottom: 56, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height)
    });

    const defs = createSVG('defs');
    const gradient = createSVG('linearGradient', { id: 'draft-bar-fill', x1: '0', x2: '0', y1: '0', y2: '1' });
    gradient.appendChild(createSVG('stop', { offset: '0%', 'stop-color': colors.accentA }));
    gradient.appendChild(createSVG('stop', { offset: '100%', 'stop-color': colors.accentC }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const g = createSVG('g', { transform: `translate(${margin.left},${margin.top})` });
    svg.appendChild(g);

    const groupWidth = chartWidth / DRAFT_OVERALL.length;
    const niceMax = DRAFT_CHART_NICE_MAX || 10;

    const ticks = [];
    for (let value = 0; value <= niceMax + 0.0001; value += 10) {
      ticks.push(value);
    }

    ticks.forEach((tick) => {
      const y = chartHeight - (tick / niceMax) * chartHeight;
      g.appendChild(createSVG('line', {
        x1: 0,
        x2: chartWidth,
        y1: y,
        y2: y,
        stroke: tick === 0 ? 'rgba(255,255,255,0.16)' : colors.grid
      }));
      g.appendChild(createSVG('text', {
        x: -12,
        y: y + 4,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'end'
      }, document.createTextNode(`${tick}%`)));
    });

    DRAFT_OVERALL.forEach((row, index) => {
      const baseX = index * groupWidth;
      const barWidth = Math.min(54, groupWidth * 0.62);
      const barHeight = (row.hit / niceMax) * chartHeight;
      const y = chartHeight - barHeight;
      const rect = createSVG('rect', {
        x: baseX + (groupWidth - barWidth) / 2,
        y,
        width: barWidth,
        height: Math.max(0, barHeight),
        fill: 'url(#draft-bar-fill)',
        rx: 12,
        ry: 12,
        opacity: '0.95'
      });
      g.appendChild(rect);

      g.appendChild(createSVG('text', {
        x: baseX + groupWidth / 2,
        y: y - 8,
        fill: colors.text,
        'font-size': '12',
        'text-anchor': 'middle',
        'font-weight': '600'
      }, document.createTextNode(`${row.hit.toFixed(1)}%`)));

      g.appendChild(createSVG('text', {
        x: baseX + groupWidth / 2,
        y: chartHeight + 26,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'middle'
      }, document.createTextNode(`RD ${row.rd}`)));
    });

    g.appendChild(createSVG('line', {
      x1: 0,
      x2: chartWidth,
      y1: chartHeight,
      y2: chartHeight,
      stroke: 'rgba(255,255,255,0.2)'
    }));

    g.appendChild(createSVG('text', {
      x: chartWidth / 2,
      y: chartHeight + 42,
      fill: colors.subtext,
      'font-size': '12',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('Draft Round')));

    container.appendChild(svg);

    const tiles = document.getElementById('draft-round-tiles');
    if (tiles) {
      tiles.innerHTML = '';
      DRAFT_OVERALL.forEach((row) => {
        const tile = createEl('div', { class: 'draft-tile' },
          createEl('span', { class: 'draft-tile-round' }, row.rd),
          createEl('span', { class: 'draft-tile-value' }, `${row.hit.toFixed(1)}%`)
        );
        tiles.appendChild(tile);
      });
    }
  }

  function catmullRomPath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    const segments = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      segments.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }
    return segments.join(' ');
  }

  function renderDraftPositional() {
    const container = document.getElementById('draft-positional-chart');
    if (!container) return;
    container.innerHTML = '';

    const legend = createEl('div', { class: 'syop-line-legend' });
    DRAFT_SERIES.forEach((series) => {
      legend.appendChild(createEl('span', { class: 'legend-item' },
        createEl('span', { class: 'legend-swatch', style: { backgroundColor: series.color } }),
        createEl('span', { class: 'legend-label' }, series.key)
      ));
    });

    const legendHost = document.getElementById('draft-positional-legend');
    if (legendHost) {
      legendHost.innerHTML = '';
      legendHost.appendChild(legend);
    } else {
      container.appendChild(legend);
    }

    const containerWidth = container.clientWidth || 0;
    const fallbackWidth = 360;
    const width = containerWidth > 0 ? containerWidth : fallbackWidth;
    const isCompact = width < 520;
    const height = isCompact ? 300 : 320;
    const margin = isCompact
      ? { top: 48, right: 20, bottom: 56, left: 54 }
      : { top: 32, right: 24, bottom: 56, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const svg = createSVG('svg', {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height)
    });

    const g = createSVG('g', { transform: `translate(${margin.left},${margin.top})` });
    svg.appendChild(g);

    const rounds = DRAFT_POSITIONAL.map((row) => row.rd);
    const stepX = chartWidth / (rounds.length - 1 || 1);
    const niceMax = DRAFT_CHART_NICE_MAX || 10;
    const yTicks = [];
    for (let value = 0; value <= niceMax + 0.0001; value += 10) {
      yTicks.push(value);
    }

    yTicks.forEach((tick) => {
      const y = chartHeight - (tick / niceMax) * chartHeight;
      g.appendChild(createSVG('line', {
        x1: 0,
        x2: chartWidth,
        y1: y,
        y2: y,
        stroke: tick === 0 ? 'rgba(255,255,255,0.16)' : colors.grid
      }));
      g.appendChild(createSVG('text', {
        x: -12,
        y: y + 4,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'end'
      }, document.createTextNode(`${tick}%`)));
    });

    rounds.forEach((round, index) => {
      const x = index * stepX;
      g.appendChild(createSVG('text', {
        x,
        y: chartHeight + 26,
        fill: colors.subtext,
        'font-size': '12',
        'text-anchor': 'middle'
      }, document.createTextNode(`RD ${round}`)));
    });

    const dotRadius = isCompact ? 3.6 : 4.4;

    DRAFT_SERIES.forEach((series) => {
      const points = DRAFT_POSITIONAL.map((row, index) => ({
        x: index * stepX,
        y: chartHeight - ((Number(row[series.key]) || 0) / niceMax) * chartHeight,
        value: row[series.key],
        roundIndex: index
      }));

      const path = createSVG('path', {
        d: catmullRomPath(points),
        fill: 'none',
        stroke: series.color,
        'stroke-width': '3',
        'stroke-linecap': 'round'
      });
      g.appendChild(path);

      points.forEach((point) => {
        g.appendChild(createSVG('circle', {
          cx: point.x,
          cy: point.y,
          r: String(dotRadius),
          fill: colors.bg,
          stroke: series.color,
          'stroke-width': '2'
        }));
      });
    });

    g.appendChild(createSVG('line', {
      x1: 0,
      x2: chartWidth,
      y1: chartHeight,
      y2: chartHeight,
      stroke: 'rgba(255,255,255,0.18)'
    }));

    g.appendChild(createSVG('text', {
      x: chartWidth / 2,
      y: chartHeight + 42,
      fill: colors.subtext,
      'font-size': '12',
      'font-weight': '700',
      'text-anchor': 'middle'
    }, document.createTextNode('Draft Round')));

    container.appendChild(svg);

    const chipsContainer = createEl('div', {
      class: 'draft-round-chip-container',
      style: {
        padding: `0 ${margin.right}px 0 ${margin.left}px`
      }
    });
    const chipGrid = createEl('div', {
      class: 'draft-round-chip-grid',
      style: { '--round-count': rounds.length }
    });

    rounds.forEach((round, index) => {
      const column = createEl('div', {
        class: 'draft-round-chip-col',
        dataset: { round }
      });
      const roundData = DRAFT_POSITIONAL[index] || {};
      const sortedSeries = DRAFT_SERIES
        .map((series) => ({
          key: series.key,
          color: series.color,
          value: Number(roundData[series.key]) || 0
        }))
        .sort((a, b) => b.value - a.value);

      sortedSeries.forEach((entry) => {
        const chip = createEl('div', {
          class: 'draft-round-chip',
          style: {
            '--chip-accent': entry.color,
            borderColor: hexToRgba(entry.color, 0.55)
          }
        },
        createEl('span', {
          class: 'draft-round-chip-dot',
          style: { backgroundColor: entry.color }
        }),
        createEl('span', {
          class: 'draft-round-chip-value'
        }, `${entry.value}%`));

        column.appendChild(chip);
      });

      chipGrid.appendChild(column);
    });

    chipsContainer.appendChild(chipGrid);
    container.appendChild(chipsContainer);
  }

  function getPosAnalysisRoot() {
    return document.getElementById('pos-analysis-root');
  }

  function posAnalysisIcon(name, extraClass = '') {
    const iconKey = POS_ANALYSIS_MATERIAL_SYMBOLS[name] ? name : 'target';
    const icon = POS_ANALYSIS_MATERIAL_SYMBOLS[iconKey];
    // Every rendered glyph gets both a common Material Symbol hook and a
    // key-specific modifier so one section/icon can be tuned without leakage.
    const className = [
      'pos-analysis-icon',
      'pos-analysis-material-symbol',
      `pos-analysis-material-symbol--${iconKey}`,
      extraClass
    ].filter(Boolean).join(' ');
    // Layered symbols preserve multi-part Material geometry; the RB-vs-WR chip
    // additionally assigns independent Research-scoped series colors, while
    // ordinary icons continue using one filled Material path.
    const geometry = Array.isArray(icon.layers)
      ? icon.layers.map((layer) => `<path class="pos-analysis-material-symbol-layer pos-analysis-material-symbol-layer--${escapePosAnalysisAttr(layer.role)}" d="${layer.path}"></path>`).join('')
      : `<path d="${icon.path}"></path>`;
    const viewBox = icon.viewBox || '0 -960 960 960';
    return `<svg class="${className}" viewBox="${viewBox}" aria-hidden="true" focusable="false" fill="currentColor" data-material-symbol="${escapePosAnalysisAttr(icon.materialName)}">${geometry}</svg>`;
  }

  function hydratePosAnalysisIcons(root = getPosAnalysisRoot()) {
    if (!root) return;
    root.querySelectorAll('[data-pos-analysis-icon]').forEach((node) => {
      if (node.dataset.posAnalysisIconReady === 'true') return;
      const iconName = node.dataset.posAnalysisIcon || 'target';
      const iconClass = node.classList.contains('pos-analysis-button-icon')
        ? 'pos-analysis-icon--button'
        : 'pos-analysis-icon--shell';
      node.innerHTML = posAnalysisIcon(iconName, iconClass);
      node.dataset.posAnalysisIconReady = 'true';
    });
  }

  function escapePosAnalysisHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function escapePosAnalysisAttr(value) {
    return escapePosAnalysisHtml(value).replace(/`/g, '&#96;');
  }

  function posAnalysisNumber(value) {
    const number = Number(String(value ?? '').replace(/,/g, '').trim());
    return Number.isFinite(number) ? number : null;
  }

  function parsePosAnalysisCSV(text) {
    const rows = [];
    let row = [];
    let value = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          value += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(value);
        if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
        row = [];
        value = '';
      } else {
        value += char;
      }
    }

    if (value.length || row.length) {
      row.push(value);
      if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
    }

    return rows;
  }

  async function loadPosAnalysisRows() {
    const response = await fetch(POS_ANALYSIS_DATA_PATH, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Could not load positional analysis data: ${response.status}`);
    }

    const csvRows = parsePosAnalysisCSV(await response.text());
    if (!csvRows.length) throw new Error('Dataset is empty.');

    const header = csvRows[0].map((heading) => String(heading).trim());
    const columnIndex = Object.fromEntries(header.map((heading, index) => [heading, index]));
    const requiredColumns = ['YEAR', 'Player', 'POS', 'FPTS RK', 'FPTS'];
    const missingColumns = requiredColumns.filter((column) => !(column in columnIndex));
    if (missingColumns.length) {
      throw new Error(`Dataset missing required columns: ${missingColumns.join(', ')}`);
    }

    return csvRows.slice(1).map((csvRow) => ({
      year: posAnalysisNumber(csvRow[columnIndex.YEAR]),
      player: String(csvRow[columnIndex.Player] ?? '').trim(),
      pos: String(csvRow[columnIndex.POS] ?? '').trim().toUpperCase(),
      rank: posAnalysisNumber(csvRow[columnIndex['FPTS RK']]),
      fpts: posAnalysisNumber(csvRow[columnIndex.FPTS])
    })).filter((row) => row.year && row.pos && Number.isFinite(row.rank));
  }

  function computePosAnalysisCounts(rows) {
    const rowsByYear = new Map();
    POS_ANALYSIS_YEARS.forEach((year) => rowsByYear.set(year, []));
    rows.forEach((row) => {
      if (!rowsByYear.has(row.year)) rowsByYear.set(row.year, []);
      rowsByYear.get(row.year).push(row);
    });

    const sortedRowsByYear = new Map();
    POS_ANALYSIS_YEARS.forEach((year) => {
      sortedRowsByYear.set(year, (rowsByYear.get(year) || []).slice().sort((a, b) => (
        a.rank - b.rank
        || (Number.isFinite(b.fpts) ? b.fpts : 0) - (Number.isFinite(a.fpts) ? a.fpts : 0)
        || String(a.player).localeCompare(String(b.player))
      )));
    });

    const counts = {};
    POS_ANALYSIS_RANGE_OPTIONS.forEach((range) => {
      counts[range] = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, []]));
      const cut = POS_ANALYSIS_CUTS[range];
      POS_ANALYSIS_YEARS.forEach((year) => {
        const topRows = (sortedRowsByYear.get(year) || []).slice(0, cut);
        POS_ANALYSIS_POSITIONS.forEach((pos) => {
          counts[range][pos].push(topRows.filter((row) => row.pos === pos).length);
        });
      });
    });

    return counts;
  }

  function ensurePosAnalysisData() {
    if (POS_ANALYSIS_STATE.loaded) return Promise.resolve(POS_ANALYSIS_STATE.rows);
    if (POS_ANALYSIS_STATE.loadingPromise) return POS_ANALYSIS_STATE.loadingPromise;

    POS_ANALYSIS_STATE.loadingPromise = loadPosAnalysisRows().then((rows) => {
      POS_ANALYSIS_STATE.rows = rows;
      POS_ANALYSIS_STATE.counts = computePosAnalysisCounts(rows);
      POS_ANALYSIS_STATE.loaded = true;
      return rows;
    });

    return POS_ANALYSIS_STATE.loadingPromise;
  }

  function posAnalysisValues(range, pos) {
    return (POS_ANALYSIS_STATE.counts?.[range]?.[pos] || []).map((value) => {
      const number = Number(value);
      return Number.isFinite(number) ? Math.max(0, number) : 0;
    });
  }

  function getPosAnalysisDisplayPositions() {
    const allowed = POS_ANALYSIS_STATE.positionView === 'rbWr' ? ['RB', 'WR'] : POS_ANALYSIS_POSITIONS;
    const active = allowed.filter((pos) => POS_ANALYSIS_STATE.activePositions.includes(pos));
    return active.length ? active : allowed;
  }

  function getPosAnalysisPositionControlPositions() {
    return POS_ANALYSIS_STATE.positionView === 'rbWr' ? ['RB', 'WR'] : POS_ANALYSIS_POSITIONS;
  }

  function getPosAnalysisPositionIcon(pos) {
    return {
      QB: 'qb',
      RB: 'rb',
      WR: 'wr',
      TE: 'te'
    }[pos] || 'target';
  }

  function getPosAnalysisDynamicDomain(range, positions) {
    const values = positions.flatMap((pos) => posAnalysisValues(range, pos));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const min = minValue <= 3 ? 0 : Math.max(0, minValue - 1);
    const max = maxValue + 1;
    return { min, max: Math.max(max, min + 1) };
  }

  function posAnalysisTickValues(min, max, targetCount = 6) {
    const span = Math.max(1, max - min);
    const step = Math.max(1, Math.ceil(span / targetCount));
    const ticks = [];
    for (let value = min; value <= max; value += step) {
      ticks.push(value);
    }
    if (!ticks.includes(max)) ticks.push(max);
    return ticks;
  }

  function formatPosAnalysisDelta(value) {
    if (!Number.isFinite(value)) return 'NA';
    if (value > 0) return `+${value}`;
    if (value < 0) return String(value);
    return '0';
  }

  function meanPosAnalysis(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function rankPosAnalysisHighToLow(current, values) {
    return 1 + values.filter((value) => value > current).length;
  }

  function posAnalysisYearsMatching(values, target) {
    return POS_ANALYSIS_YEARS.filter((_, index) => values[index] === target).join(', ');
  }

  function posAnalysisLatestYearMatching(values, target) {
    const years = POS_ANALYSIS_YEARS.filter((_, index) => values[index] === target);
    return years.length ? String(years.at(-1)) : '';
  }

  function getPosAnalysisTiers(values) {
    const tiers = Array(values.length).fill('high');
    values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value || a.index - b.index)
      .forEach((item, index) => {
        tiers[item.index] = index < 6 ? 'low' : index < 12 ? 'mid' : 'high';
      });
    return tiers;
  }

  function getPosAnalysisPositionStats(range, pos) {
    const values = posAnalysisValues(range, pos);
    const current = values.at(-1) ?? 0;
    const previous = values.at(-2) ?? current;
    const avg = meanPosAnalysis(values);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    return {
      pos,
      values,
      current,
      previous,
      changeFromPrevious: current - previous,
      avg,
      min,
      max,
      bestYears: posAnalysisYearsMatching(values, max),
      worstYears: posAnalysisYearsMatching(values, min),
      rank: rankPosAnalysisHighToLow(current, values),
      vsAverage: current - avg
    };
  }

  function getPosAnalysisRangeSummary(range) {
    const stats = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, getPosAnalysisPositionStats(range, pos)]));
    const current = Object.fromEntries(POS_ANALYSIS_POSITIONS.map((pos) => [pos, stats[pos].current]));
    const rbValues = posAnalysisValues(range, 'RB');
    const wrValues = posAnalysisValues(range, 'WR');
    const year2020Index = POS_ANALYSIS_YEARS.indexOf(2020);
    const latestIndex = POS_ANALYSIS_YEARS.indexOf(2025);
    return {
      range,
      stats,
      current,
      rbWrDiff: (current.RB || 0) - (current.WR || 0),
      rb2020To2025: (rbValues[latestIndex] || 0) - (rbValues[year2020Index] || 0),
      wr2020To2025: (wrValues[latestIndex] || 0) - (wrValues[year2020Index] || 0)
    };
  }

  function posAnalysisSmoothPath(points, smoothing = 0.18) {
    if (!points.length) return '';
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = points[index - 1] || points[index];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[index + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) * smoothing;
      const cp1y = p1[1] + (p2[1] - p0[1]) * smoothing;
      const cp2x = p2[0] - (p3[0] - p1[0]) * smoothing;
      const cp2y = p2[1] - (p3[1] - p1[1]) * smoothing;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  // Line Graph Grid area geometry: reuse the exact smoothed series curve, then
  // close it against the shared zero baseline so the fill remains a truthful
  // cumulative-count area rather than introducing an independent shape.
  function posAnalysisSmoothAreaPath(points, baseline, smoothing = 0.18) {
    if (!points.length) return '';
    const linePath = posAnalysisSmoothPath(points, smoothing);
    const first = points[0];
    const last = points.at(-1);
    return `${linePath} L ${last[0].toFixed(2)} ${baseline.toFixed(2)} L ${first[0].toFixed(2)} ${baseline.toFixed(2)} Z`;
  }

  // Positional Supply chart: each year-to-year segment gets its own subtle curve so gradients can follow the original tier-colored line behavior.
  function posAnalysisSmoothSegmentPath(points, index, smoothing = 0.12) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) * smoothing;
    const cp1y = p1[1] + (p2[1] - p0[1]) * smoothing;
    const cp2x = p2[0] - (p3[0] - p1[0]) * smoothing;
    const cp2y = p2[1] - (p3[1] - p1[1]) * smoothing;
    return `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }

  function renderPosAnalysisProfileSparkline(pos, range) {
    const values = posAnalysisValues(range, pos);
    const config = POS_ANALYSIS_POS_CONFIG[pos];
    const width = 260;
    const height = 62;
    const m = { l: 6, r: 9, t: 8, b: 8 };
    const plotW = width - m.l - m.r;
    const plotH = height - m.t - m.b;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const x = (index) => m.l + index / Math.max(1, values.length - 1) * plotW;
    const y = (value) => m.t + plotH - (value - min) / span * plotH;
    const points = values.map((value, index) => [x(index), y(value)]);
    const last = points.at(-1) || [width - m.r, height / 2];
    const lastValue = values.at(-1) ?? 0;
    return `<svg class="pos-analysis-profile-sparkline" viewBox="0 0 ${width} ${height}" aria-label="${escapePosAnalysisAttr(pos)} ${escapePosAnalysisAttr(range)} historical sparkline"><line class="pos-analysis-profile-spark-base" x1="${m.l}" x2="${width - m.r}" y1="${height - m.b}" y2="${height - m.b}"/><path d="${posAnalysisSmoothPath(points, 0.16)}" fill="none" stroke="${config.high}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="4.2" fill="${config.high}" stroke="#050711" stroke-width="2"/><title>${pos} ${range}: ${lastValue} in 2025</title></svg>`;
  }

  function posAnalysisRectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  // Positional Analysis supply-chart data labels: SVG text positions use the
  // baseline, so visually equal above/below gaps require asymmetric y offsets.
  // Near-point candidates sit one SVG pixel farther from the enlarged markers
  // than before. Collision fallbacks use smaller steps so one label is not
  // pushed disproportionately far away when two values meet.
  function getPosAnalysisSupplyLabelOffsets(fontSize, preferBelow, compact) {
    // A half-pixel increase creates the requested barely perceptible breathing
    // room on both breakpoints without changing collision-repulsion strength.
    const pointGap = 10;
    const collisionStep = fontSize + 2;
    const extremeStep = Math.max(6, fontSize - 2);
    const above = -pointGap;
    const below = fontSize + pointGap;
    const horizontalNudge = compact ? 6 : 9;
    const widerNudge = horizontalNudge * 2;
    const fartherAbove = above - collisionStep;
    const fartherBelow = below + collisionStep;
    const extremeAbove = fartherAbove - extremeStep;
    const extremeBelow = fartherBelow + extremeStep;
    const preferred = preferBelow ? below : above;
    const alternate = preferBelow ? above : below;
    const fartherPreferred = preferBelow ? fartherBelow : fartherAbove;
    const fartherAlternate = preferBelow ? fartherAbove : fartherBelow;
    return [
      [0, preferred],
      [0, alternate],
      [-horizontalNudge, preferred],
      [horizontalNudge, preferred],
      [-horizontalNudge, alternate],
      [horizontalNudge, alternate],
      [0, fartherPreferred],
      [0, fartherAlternate],
      [-horizontalNudge, fartherPreferred],
      [horizontalNudge, fartherPreferred],
      [-horizontalNudge, fartherAlternate],
      [horizontalNudge, fartherAlternate],
      [-widerNudge, preferred],
      [widerNudge, preferred],
      [-widerNudge, alternate],
      [widerNudge, alternate],
      [0, preferBelow ? extremeBelow : extremeAbove],
      [0, preferBelow ? extremeAbove : extremeBelow],
      [-horizontalNudge, preferBelow ? extremeBelow : extremeAbove],
      [horizontalNudge, preferBelow ? extremeBelow : extremeAbove]
    ];
  }

  function placePosAnalysisLabels(candidates, bounds) {
    const placed = [];
    candidates.forEach((candidate) => {
      const fontSize = candidate.fontSize || 10;
      const width = Math.max(14, String(candidate.text).length * fontSize * 0.62 + 8);
      const height = fontSize + 7;
      const offsets = candidate.offsets || [[0, -12], [0, 15], [-16, -12], [16, 15], [0, -28], [0, 30]];
      let chosen = null;

      for (const offset of offsets) {
        const x = Math.max(bounds.left + width / 2, Math.min(bounds.right - width / 2, candidate.x + offset[0]));
        const y = Math.max(bounds.top + height, Math.min(bounds.bottom - 2, candidate.y + offset[1]));
        const rect = {
          left: x - width / 2,
          right: x + width / 2,
          top: y - height + 2,
          bottom: y + 3
        };
        if (!placed.some((label) => posAnalysisRectsOverlap(rect, label.rect))) {
          chosen = { x, y, rect, width, height };
          break;
        }
      }

      if (!chosen && candidate.force) {
        const fallback = offsets[offsets.length - 1] || [0, -12];
        const x = Math.max(bounds.left + width / 2, Math.min(bounds.right - width / 2, candidate.x + fallback[0]));
        const y = Math.max(bounds.top + height, Math.min(bounds.bottom - 2, candidate.y + fallback[1]));
        chosen = {
          x,
          y,
          rect: { left: x - width / 2, right: x + width / 2, top: y - height + 2, bottom: y + 3 },
          width,
          height
        };
      }

      if (chosen) {
        placed.push({ ...candidate, ...chosen });
      }
    });
    return placed;
  }

  function renderPosAnalysisTextLabels(labels, className = 'pos-analysis-svg-value-label') {
    return labels.map((label) => {
      // Point-origin attributes keep label-distance behavior directly testable
      // without changing the visible SVG or the chart's tooltip interaction.
      const pointAttrs = Number.isFinite(label.pointX) && Number.isFinite(label.pointY)
        ? ` data-pos-analysis-point-x="${label.pointX.toFixed(1)}" data-pos-analysis-point-y="${label.pointY.toFixed(1)}" data-pos-analysis-series="${escapePosAnalysisAttr(label.series || '')}" data-pos-analysis-year="${escapePosAnalysisAttr(label.year || '')}"`
        : '';
      return `<text class="${className}"${pointAttrs} x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" fill="${label.color}" font-size="${label.fontSize || 10}" font-weight="800">${escapePosAnalysisHtml(label.text)}</text>`;
    }).join('');
  }

  function renderPosAnalysisLabelPills(labels) {
    return labels.map((label) => (
      `<g class="pos-analysis-label-pill"><rect x="${label.rect.left.toFixed(1)}" y="${label.rect.top.toFixed(1)}" width="${label.width.toFixed(1)}" height="${label.height.toFixed(1)}" rx="5" fill="rgba(5,7,17,.78)" stroke="${label.color}" stroke-opacity=".38"/><text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" fill="${label.color}" font-size="${label.fontSize || 9}" font-weight="900">${escapePosAnalysisHtml(label.text)}</text></g>`
    )).join('');
  }

  function attachPosAnalysisTooltips(host) {
    const tooltip = document.getElementById('pos-analysis-tooltip');
    if (!host || !tooltip) return;

    const show = (event, target) => {
      tooltip.innerHTML = target.dataset.posAnalysisTip || '';
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY - 12}px`;
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
    };
    const move = (event) => {
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY - 12}px`;
    };
    const hide = () => {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    host.querySelectorAll('[data-pos-analysis-tip]').forEach((node) => {
      node.addEventListener('mouseenter', (event) => show(event, node));
      node.addEventListener('mousemove', move);
      node.addEventListener('focus', (event) => {
        const rect = node.getBoundingClientRect();
        show({ clientX: rect.left + rect.width / 2, clientY: rect.top }, node);
      });
      node.addEventListener('mouseleave', hide);
      node.addEventListener('blur', hide);
      node.addEventListener('touchstart', (event) => {
        const touch = event.touches?.[0];
        if (touch) show(touch, node);
      }, { passive: true });
    });
  }

  function setPosAnalysisMessage(message, tone = 'loading') {
    const root = getPosAnalysisRoot();
    if (!root) return;
    const safeMessage = escapePosAnalysisHtml(message);
    root.querySelectorAll('.pos-analysis-chart-host, .pos-analysis-year-shift-grid, .pos-analysis-profile-grid, .pos-analysis-stat-grid').forEach((node) => {
      node.innerHTML = `<div class="pos-analysis-message pos-analysis-message--${tone}">${safeMessage}</div>`;
    });
  }

  function refreshPosAnalysisControls() {
    const root = getPosAnalysisRoot();
    if (!root || !POS_ANALYSIS_STATE.counts) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    const rangeHost = document.getElementById('pos-analysis-range-buttons');
    const positionHost = document.getElementById('pos-analysis-position-buttons');

    if (rangeHost) {
      rangeHost.innerHTML = POS_ANALYSIS_RANGE_OPTIONS.map((range) => (
        `<button class="pos-analysis-range-btn${POS_ANALYSIS_STATE.range === range ? ' is-active' : ''}" type="button" data-pos-analysis-range="${range}" aria-pressed="${POS_ANALYSIS_STATE.range === range}">${range}</button>`
      )).join('');
      rangeHost.querySelectorAll('[data-pos-analysis-range]').forEach((button) => {
        button.addEventListener('click', () => {
          POS_ANALYSIS_STATE.range = button.dataset.posAnalysisRange;
          renderPosAnalysisAll();
        });
      });
    }

    if (positionHost) {
      const controlPositions = getPosAnalysisPositionControlPositions();
      positionHost.innerHTML = controlPositions.map((pos) => {
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        const active = POS_ANALYSIS_STATE.activePositions.includes(pos);
        const current = summary.current[pos] ?? 0;
        return `<button class="pos-analysis-pos-btn${active ? ' is-active' : ''}" type="button" data-pos-analysis-position="${pos}" aria-pressed="${active}" style="--pos-low:${config.low};--pos-mid:${config.mid};--pos-high:${config.high}"><span class="pos-analysis-pos-icon">${posAnalysisIcon(getPosAnalysisPositionIcon(pos), 'pos-analysis-icon--pos')}</span><span class="pos-analysis-pos-name">${pos}</span><span class="pos-analysis-pos-current">${current}</span></button>`;
      }).join('');
      positionHost.querySelectorAll('[data-pos-analysis-position]').forEach((button) => {
        button.addEventListener('click', () => {
          const pos = button.dataset.posAnalysisPosition;
          const activeControlCount = controlPositions.filter((item) => POS_ANALYSIS_STATE.activePositions.includes(item)).length;
          if (POS_ANALYSIS_STATE.activePositions.includes(pos) && activeControlCount > 1) {
            POS_ANALYSIS_STATE.activePositions = POS_ANALYSIS_STATE.activePositions.filter((item) => item !== pos);
          } else if (!POS_ANALYSIS_STATE.activePositions.includes(pos)) {
            POS_ANALYSIS_STATE.activePositions.push(pos);
          }
          renderPosAnalysisAll();
        });
      });
    }

    root.querySelectorAll('[data-pos-analysis-mode]').forEach((button) => {
      const active = button.dataset.posAnalysisMode === POS_ANALYSIS_STATE.mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    root.querySelectorAll('[data-pos-analysis-position-view]').forEach((button) => {
      const active = button.dataset.posAnalysisPositionView === POS_ANALYSIS_STATE.positionView;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function refreshPosAnalysisYearControls() {
    const minSelect = document.getElementById('pos-analysis-min-year');
    const maxSelect = document.getElementById('pos-analysis-max-year');
    if (!minSelect || !maxSelect) return;

    const options = POS_ANALYSIS_YEARS.map((year) => `<option value="${year}">${year}</option>`).join('');
    if (!minSelect.options.length) minSelect.innerHTML = options;
    if (!maxSelect.options.length) maxSelect.innerHTML = options;

    minSelect.value = String(POS_ANALYSIS_STATE.tierStackMinYear);
    maxSelect.value = String(POS_ANALYSIS_STATE.tierStackMaxYear);
    minSelect.onchange = () => {
      POS_ANALYSIS_STATE.tierStackMinYear = Number(minSelect.value) || POS_ANALYSIS_TIER_STACK_DEFAULT_MIN_YEAR;
      if (POS_ANALYSIS_STATE.tierStackMinYear > POS_ANALYSIS_STATE.tierStackMaxYear) {
        POS_ANALYSIS_STATE.tierStackMaxYear = POS_ANALYSIS_STATE.tierStackMinYear;
      }
      // G1 owns this range: changing it updates only the selectors and the
      // tier-stack SVG, then returns horizontal scroll to the first chosen year.
      refreshPosAnalysisYearControls();
      renderPosAnalysisTierStackBars({ resetScroll: true });
    };
    maxSelect.onchange = () => {
      POS_ANALYSIS_STATE.tierStackMaxYear = Number(maxSelect.value) || POS_ANALYSIS_YEARS[POS_ANALYSIS_YEARS.length - 1];
      if (POS_ANALYSIS_STATE.tierStackMaxYear < POS_ANALYSIS_STATE.tierStackMinYear) {
        POS_ANALYSIS_STATE.tierStackMinYear = POS_ANALYSIS_STATE.tierStackMaxYear;
      }
      refreshPosAnalysisYearControls();
      renderPosAnalysisTierStackBars({ resetScroll: true });
    };
  }

  function renderPosAnalysisSummaryChips() {
    const host = document.getElementById('pos-analysis-summary-chips');
    if (!host) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    const diffLabel = `2025  ${summary.range.toUpperCase()} · RB vs. WR`;
    // Positional Analysis stat-chip copy stays source-specific by breakpoint:
    // mobile omits the tier because the Range chip already supplies that context.
    const mobileDiffLabel = '2025 · RB vs. WR';
    const chips = [
      { key: 'range', label: 'SELECTED RANGE', mobileLabel: 'RANGE', value: summary.range, mobileValue: summary.range, tone: '', icon: 'selected-range' },
      { key: 'difference', label: diffLabel, mobileLabel: mobileDiffLabel, value: `${formatPosAnalysisDelta(summary.rbWrDiff)} RB`, mobileValue: `${formatPosAnalysisDelta(summary.rbWrDiff)} RB`, tone: summary.rbWrDiff >= 0 ? 'up' : 'down', icon: 'rb-vs-wr' },
      { key: 'rb-trend', label: 'RB 2020 ➜ 2025', mobileLabel: 'RB 2020 ➜ 2025', value: formatPosAnalysisDelta(summary.rb2020To2025), mobileValue: formatPosAnalysisDelta(summary.rb2020To2025), tone: summary.rb2020To2025 >= 0 ? 'up' : 'down', icon: 'rb-trend' },
      { key: 'wr-trend', label: 'WR 2020 ➜ 2025', mobileLabel: 'WR 2020 ➜ 2025', value: formatPosAnalysisDelta(summary.wr2020To2025), mobileValue: formatPosAnalysisDelta(summary.wr2020To2025), tone: summary.wr2020To2025 >= 0 ? 'up' : 'down', icon: 'wr-trend' }
    ];
    // Positional Analysis stat chips: both breakpoints place the icon beside the
    // value; duplicate label/value nodes preserve their breakpoint-specific copy.
    host.innerHTML = chips.map((chip) => {
      const toneClass = chip.tone ? `pos-analysis-stat-chip--${chip.tone}` : '';
      const chipClass = `pos-analysis-stat-chip--${chip.key}`;
      const desktopIcon = posAnalysisIcon(chip.icon, 'pos-analysis-icon--chip');
      const mobileIcon = posAnalysisIcon(chip.icon, 'pos-analysis-icon--chip');
      return `<div class="pos-analysis-stat-chip ${chipClass} ${toneClass}"><span class="pos-analysis-stat-chip-label pos-analysis-stat-chip-label--desktop"><span>${escapePosAnalysisHtml(chip.label)}</span></span><span class="pos-analysis-stat-chip-label pos-analysis-stat-chip-label--mobile"><span>${escapePosAnalysisHtml(chip.mobileLabel)}</span></span><strong class="pos-analysis-stat-chip-value pos-analysis-stat-chip-value--desktop">${desktopIcon}<span>${escapePosAnalysisHtml(chip.value)}</span></strong><strong class="pos-analysis-stat-chip-value pos-analysis-stat-chip-value--mobile">${mobileIcon}<span>${escapePosAnalysisHtml(chip.mobileValue)}</span></strong></div>`;
    }).join('');
  }

  function renderPosAnalysisGlobalChart() {
    const title = document.getElementById('pos-analysis-global-title');
    const subtitle = document.getElementById('pos-analysis-global-subtitle');
    const viewTitle = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? '2007-2025 Positional Distribution: RB vs. WR'
      : '2007-2025 Positional Distribution: ALL POS';
    if (title) title.textContent = viewTitle;
    if (subtitle) {
      subtitle.textContent = window.innerWidth <= 700 && POS_ANALYSIS_STATE.positionView === 'rbWr'
        ? 'RB and WR distribution per szn inside the selected PPR FPTS rank range.'
        : POS_ANALYSIS_STATE.mode === 'grid'
          ? 'Four-range comparison: Top 24, Top 36, Top 48, and Top 60.'
          : POS_ANALYSIS_STATE.positionView === 'rbWr'
            ? 'Running back and wide receiver counts inside the selected fantasy-points rank range.'
            : 'Position counts inside the selected fantasy-points rank range.';
    }

    if (POS_ANALYSIS_STATE.mode === 'grid') {
      renderPosAnalysisGlobalGrid();
    } else {
      renderPosAnalysisGlobalSingle();
    }
    renderPosAnalysisSummaryChips();
  }

  function renderPosAnalysisGlobalSingle() {
    const host = document.getElementById('pos-analysis-global-chart');
    if (!host) return;
    const range = POS_ANALYSIS_STATE.range;
    const active = getPosAnalysisDisplayPositions();
    const compact = window.innerWidth < 640;
    const mobile = window.innerWidth <= 700;
    // Positional Analysis single-range geometry: keep the user-tuned desktop
    // line/point sizes intact while applying the requested sizes through the
    // page's full 700px mobile breakpoint (independent of compact SVG layout).
    const lineStrokeWidth = mobile ? 5.1 : 6.3;
    const pointRadius = mobile ? 4.85 : 6;
    // Positional Analysis top supply chart:
    // mobile uses its own compact SVG coordinate system so the RB/WR x-axis
    // years sit close together and the chart does not need horizontal scroll.
    const w = compact ? 440 : 1200;
    const h = compact ? 342 : 472;
    const m = compact
      ? { l: 30, r: 28, t: 34, b: 36 }
      : { l: 52, r: 72, t: 34, b: 58 };
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const maxValue = Math.max(...active.flatMap((pos) => posAnalysisValues(range, pos)), 0);
    const domain = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? getPosAnalysisDynamicDomain(range, active)
      : { min: 0, max: Math.max(POS_ANALYSIS_CUTS[range] <= 12 ? 6 : 12, Math.ceil((maxValue + 2) / 2) * 2) };
    const yMin = domain.min;
    const yMax = domain.max;
    const x = (index) => m.l + index / (POS_ANALYSIS_YEARS.length - 1) * plotW;
    const y = (value) => m.t + plotH - (value - yMin) / Math.max(1, yMax - yMin) * plotH;
    const labels = [];

    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapePosAnalysisAttr(range)} positional supply">`;
    svg += '<defs>';
    active.forEach((pos) => {
      const values = posAnalysisValues(range, pos);
      const tiers = getPosAnalysisTiers(values);
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      for (let index = 0; index < values.length - 1; index += 1) {
        const gradientId = `pos-analysis-supply-${range.replace(/\s+/g, '')}-${pos}-${index}`;
        svg += `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${x(index)}" y1="${y(values[index])}" x2="${x(index + 1)}" y2="${y(values[index + 1])}"><stop offset="0%" stop-color="${config[tiers[index]]}"/><stop offset="100%" stop-color="${config[tiers[index + 1]]}"/></linearGradient>`;
      }
    });
    svg += `</defs><rect class="pos-analysis-plot-bg" x="0" y="0" width="${w}" height="${h}" rx="22"/>`;

    posAnalysisTickValues(yMin, yMax, 6).forEach((tick) => {
      svg += `<line class="pos-analysis-supply-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-supply-axis-label" x="${m.l - 12}" y="${y(tick) + 4}" text-anchor="end">${tick}</text>`;
    });
    POS_ANALYSIS_YEARS.forEach((year, index) => {
      const xx = x(index);
      svg += `<line class="pos-analysis-supply-year-line" x1="${xx}" x2="${xx}" y1="${m.t}" y2="${h - m.b}"/>`;
      if (index % 2 === 0 || index === POS_ANALYSIS_YEARS.length - 1) {
        svg += `<text class="pos-analysis-supply-axis-label" x="${xx}" y="${compact ? h - 12 : h - 24}" text-anchor="middle">${year}</text>`;
      }
    });

    active.forEach((pos, posIndex) => {
      const values = posAnalysisValues(range, pos);
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      const tiers = getPosAnalysisTiers(values);
      const points = values.map((value, index) => [x(index), y(value)]);
      for (let index = 0; index < values.length - 1; index += 1) {
        const gradientId = `pos-analysis-supply-${range.replace(/\s+/g, '')}-${pos}-${index}`;
        svg += `<path class="pos-analysis-supply-line" d="${posAnalysisSmoothSegmentPath(points, index, 0.105)}" stroke="url(#${gradientId})" stroke-width="${lineStrokeWidth}" fill="none"/>`;
      }
      values.forEach((value, index) => {
        const labelFontSize = compact ? 9 : 12;
        labels.push({
          x: points[index][0],
          y: points[index][1],
          pointX: points[index][0],
          pointY: points[index][1],
          series: pos,
          year: POS_ANALYSIS_YEARS[index],
          text: String(value),
          color: config[tiers[index]],
          fontSize: labelFontSize,
          offsets: getPosAnalysisSupplyLabelOffsets(labelFontSize, posIndex % 2 === 1, compact)
        });
        const tip = `<strong>${pos} · ${POS_ANALYSIS_YEARS[index]}</strong><br>${range} count: ${value}`;
        svg += `<circle class="pos-analysis-supply-point" cx="${points[index][0]}" cy="${points[index][1]}" r="${pointRadius}" fill="#050711" stroke="${config[tiers[index]]}" tabindex="0" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}"/>`;
      });
      const lastPoint = points.at(-1);
      svg += `<text class="pos-analysis-supply-series-label pos-analysis-supply-series-label--single" x="${lastPoint[0] + 12}" y="${lastPoint[1] + 4}" fill="${config.high}">${pos}</text>`;
    });

    svg += renderPosAnalysisTextLabels(placePosAnalysisLabels(labels, {
      left: m.l - 4,
      right: w - m.r + 26,
      top: m.t - 4,
      bottom: h - m.b + (compact ? 6 : 12)
    }), 'pos-analysis-supply-value-label');
    const scaleLabel = POS_ANALYSIS_STATE.positionView === 'rbWr'
      ? compact ? ` · scale ${yMin}-${yMax}` : ` · dynamic scale ${yMin}-${yMax}`
      : '';
    svg += `<text class="pos-analysis-supply-chart-title" x="${m.l}" y="22">${escapePosAnalysisHtml(range)} · active positions: ${escapePosAnalysisHtml(active.join(', '))}${scaleLabel}</text></svg>`;
    host.innerHTML = svg;
    attachPosAnalysisTooltips(host);
  }

  function renderPosAnalysisGlobalGrid() {
    const host = document.getElementById('pos-analysis-global-chart');
    if (!host) return;
    const active = getPosAnalysisDisplayPositions();
    const panelW = 560;
    const panelH = 228;
    const gap = 18;
    const w = panelW * 2 + gap;
    const h = panelH * 2 + gap;
    let svg = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Four range supply comparison">`;

    // Positional Analysis grid x-axis: desktop shows a three-year cadence while
    // phones use a six-year cadence to keep every label clear in each mini chart.
    const mobile = window.innerWidth <= 700;
    const xLabelYears = mobile
      ? [2007, 2013, 2019, 2025]
      : [2007, 2010, 2013, 2016, 2019, 2022, 2025];
    const xLabelIndexes = xLabelYears.map((year) => POS_ANALYSIS_YEARS.indexOf(year));

    POS_ANALYSIS_GRID_RANGES.forEach((range, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const ox = col * (panelW + gap);
      const oy = row * (panelH + gap);
      const m = { l: 34, r: 42, t: 34, b: 36 };
      const plotW = panelW - m.l - m.r;
      const plotH = panelH - m.t - m.b;
      const domain = POS_ANALYSIS_STATE.positionView === 'rbWr'
        ? getPosAnalysisDynamicDomain(range, active)
        : { min: 0, max: Math.max(8, ...active.flatMap((pos) => posAnalysisValues(range, pos))) + 2 };
      const x = (pointIndex) => ox + m.l + pointIndex / (POS_ANALYSIS_YEARS.length - 1) * plotW;
      const y = (value) => oy + m.t + plotH - (value - domain.min) / Math.max(1, domain.max - domain.min) * plotH;
      svg += '<defs>';
      active.forEach((pos) => {
        const values = posAnalysisValues(range, pos);
        const tiers = getPosAnalysisTiers(values);
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        for (let segmentIndex = 0; segmentIndex < values.length - 1; segmentIndex += 1) {
          const gradientId = `pos-analysis-grid-${range.replace(/\s+/g, '')}-${pos}-${index}-${segmentIndex}`;
          svg += `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${x(segmentIndex)}" y1="${y(values[segmentIndex])}" x2="${x(segmentIndex + 1)}" y2="${y(values[segmentIndex + 1])}"><stop offset="0%" stop-color="${config[tiers[segmentIndex]]}"/><stop offset="100%" stop-color="${config[tiers[segmentIndex + 1]]}"/></linearGradient>`;
        }
      });
      svg += `</defs><rect class="pos-analysis-small-plot-bg" x="${ox}" y="${oy}" width="${panelW}" height="${panelH}" rx="22"/><text class="pos-analysis-supply-grid-title" x="${ox + 18}" y="${oy + 24}">${range}</text>`;
      [domain.min, Math.round((domain.min + domain.max) / 2), domain.max].forEach((tick) => {
        svg += `<line class="pos-analysis-supply-grid-line" x1="${ox + m.l}" x2="${ox + panelW - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-supply-grid-axis-label" x="${ox + m.l - 8}" y="${y(tick) + 3}" text-anchor="end">${tick}</text>`;
      });
      xLabelIndexes.forEach((pointIndex) => {
        svg += `<text class="pos-analysis-supply-grid-axis-label" x="${x(pointIndex)}" y="${oy + panelH - 12}" text-anchor="middle">${POS_ANALYSIS_YEARS[pointIndex]}</text>`;
      });
      active.forEach((pos) => {
        const config = POS_ANALYSIS_POS_CONFIG[pos];
        const values = posAnalysisValues(range, pos);
        const points = values.map((value, pointIndex) => [x(pointIndex), y(value)]);
        for (let segmentIndex = 0; segmentIndex < values.length - 1; segmentIndex += 1) {
          const gradientId = `pos-analysis-grid-${range.replace(/\s+/g, '')}-${pos}-${index}-${segmentIndex}`;
          svg += `<path class="pos-analysis-supply-line" d="${posAnalysisSmoothSegmentPath(points, segmentIndex, 0.095)}" fill="none" stroke="url(#${gradientId})" stroke-width="3.4"/>`;
        }
        const lastPoint = points.at(-1);
        svg += `<text class="pos-analysis-supply-series-label pos-analysis-supply-series-label--grid" x="${lastPoint[0] + 6}" y="${lastPoint[1] + 3}" fill="${config.high}">${pos}</text>`;
      });
    });

    svg += '</svg>';
    host.innerHTML = svg;
  }

  function renderPosAnalysisProfiles() {
    const host = document.getElementById('pos-analysis-position-profiles');
    if (!host) return;
    const summary = getPosAnalysisRangeSummary(POS_ANALYSIS_STATE.range);
    host.innerHTML = POS_ANALYSIS_POSITIONS.map((pos) => {
      const stat = summary.stats[pos];
      const config = POS_ANALYSIS_POS_CONFIG[pos];
      const trendClass = stat.changeFromPrevious >= 0 ? 'up' : 'down';
      // Selected-range profile cards use three equal sibling metrics on every
      // breakpoint. Ranking/peak-year details are intentionally omitted, while
      // the trend pill retains its direction and color but names the active range.
      return `<article class="pos-analysis-profile-card pos-analysis-profile-card--${pos.toLowerCase()}" style="--pos-low:${config.low};--pos-mid:${config.mid};--pos-high:${config.high}"><div class="pos-analysis-profile-top"><div class="pos-analysis-profile-id"><span class="pos-analysis-profile-icon">${posAnalysisIcon(getPosAnalysisPositionIcon(pos), 'pos-analysis-icon--profile')}</span><div><strong>${pos}</strong></div></div><em class="pos-analysis-trend-pill pos-analysis-trend-pill--${trendClass}">${posAnalysisIcon(stat.changeFromPrevious >= 0 ? 'trend-up' : 'trend-down', 'pos-analysis-icon--trend')} ${escapePosAnalysisHtml(POS_ANALYSIS_STATE.range)}</em></div><div class="pos-analysis-profile-metrics"><div class="pos-analysis-profile-metric pos-analysis-profile-metric--current"><span>2025</span><strong>${stat.current}</strong></div><div class="pos-analysis-profile-metric pos-analysis-profile-metric--average"><span>Avg</span><strong>${stat.avg.toFixed(1)}</strong></div><div class="pos-analysis-profile-metric pos-analysis-profile-metric--peak"><span>Peak</span><strong>${stat.max}</strong></div></div>${renderPosAnalysisProfileSparkline(pos, POS_ANALYSIS_STATE.range)}</article>`;
    }).join('');
  }

  function renderPosAnalysisYearShiftGrid() {
    const host = document.getElementById('pos-analysis-year-shift-grid');
    if (!host) return;

    const cuts = [6, 12, 24, 36, 48, 60];
    const positions = ['WR', 'RB'];
    const compact = window.innerWidth <= 920;
    const width = compact ? 220 : 360;
    // Year-grid chart geometry: keep the desktop canvas unchanged, trim the
    // mobile canvas slightly, and reclaim the oversized bottom gutter as real
    // plotting room so the X-axis labels sit in a compact, balanced band.
    const height = compact ? 174 : 235;
    const margin = compact
      ? { l: 24, r: 9, t: 18, b: 16 }
      : { l: 32, r: 12, t: 21, b: 21 };
    const plotWidth = width - margin.l - margin.r;
    const plotHeight = height - margin.t - margin.b;
    const baseline = height - margin.b;
    const xAxisLabelY = baseline + (compact ? 10 : 14);
    const maxY = 26;
    const yTicks = [0, 5, 10, 15, 20, 25];
    const labelIndexes = POS_ANALYSIS_YEAR_SHIFT_LABEL_CUTS.map((cut) => cuts.indexOf(cut));
    const x = (index) => margin.l + index / (cuts.length - 1) * plotWidth;
    // Year-grid desktop X-axis label anchors: move only TOP12 and TOP36 10
    // units right for optical alignment. Compact charts retain their existing
    // coordinates because they use a separate 220-unit SVG viewBox.
    const xAxisLabelX = (index) => x(index) + (
      !compact && (cuts[index] === 12 || cuts[index] === 36) ? 10 : 0
    );
    const y = (value) => margin.t + plotHeight - value / maxY * plotHeight;

    // Every season shares a 0-26 domain for honest card-to-card comparison.
    // The final labeled tick intentionally stops at 25, leaving one unit of
    // headroom between the highest visible Y-axis label and the chart maximum.
    host.innerHTML = POS_ANALYSIS_YEAR_SHIFT_YEARS.map((year) => {
      const yearIndex = POS_ANALYSIS_YEARS.indexOf(year);
      const values = Object.fromEntries(positions.map((pos) => [
        pos,
        cuts.map((cut) => POS_ANALYSIS_STATE.counts[`Top ${cut}`][pos][yearIndex])
      ]));
      const points = Object.fromEntries(positions.map((pos) => [
        pos,
        values[pos].map((value, index) => [x(index), y(value)])
      ]));

      let rbTierWins = 0;
      let wrTierWins = 0;
      let tiedTiers = 0;
      labelIndexes.forEach((index) => {
        if (values.RB[index] > values.WR[index]) rbTierWins += 1;
        else if (values.WR[index] > values.RB[index]) wrTierWins += 1;
        else tiedTiers += 1;
      });

      const phaseTone = rbTierWins > wrTierWins ? 'rb' : wrTierWins > rbTierWins ? 'wr' : 'even';
      const phaseLabel = year === 2025
        ? 'RB sweep'
        : year === 2024
          ? 'RB pivot'
          : wrTierWins === POS_ANALYSIS_YEAR_SHIFT_LABEL_CUTS.length
            ? 'WR control'
            : phaseTone === 'wr'
              ? 'WR edge'
              : phaseTone === 'rb'
                ? 'RB edge'
                : 'Even split';
      const phaseScore = `RB ${rbTierWins}\u2013${wrTierWins} WR${tiedTiers ? ` \u00b7 ${tiedTiers} tie` : ''}`;
      // Year-card RB-vs-WR footer: show the leader gap at every labeled range
      // instead of reducing the comparison to Top 60 alone. The data-range-cut
      // hooks let CSS mirror the SVG's TOP12/TOP36/TOP60 x-axis coordinates.
      const rangeGapMarkup = labelIndexes.map((index) => {
        const cut = cuts[index];
        const difference = values.RB[index] - values.WR[index];
        const leader = difference > 0 ? 'RB' : difference < 0 ? 'WR' : 'EVEN';
        const visibleGap = difference === 0 ? '-' : `${leader} +${Math.abs(difference)}`;
        const accessibleGap = difference === 0
          ? `Top ${cut}: RB and WR are even`
          : `Top ${cut}: ${leader} leads by ${Math.abs(difference)}`;
        return `<strong class="pos-analysis-year-shift-gap pos-analysis-year-shift-gap--${difference > 0 ? 'rb' : difference < 0 ? 'wr' : 'even'}" data-range-cut="${cut}" aria-label="${accessibleGap}">${visibleGap}</strong>`;
      }).join('');
      const emphasisClass = year >= 2024 ? ' is-rb-pivot' : '';
      const ids = {
        rbLine: `pos-analysis-year-rb-line-${year}`,
        wrLine: `pos-analysis-year-wr-line-${year}`,
        rbArea: `pos-analysis-year-rb-area-${year}`,
        wrArea: `pos-analysis-year-wr-area-${year}`,
        areaFade: `pos-analysis-year-area-fade-${year}`,
        areaMask: `pos-analysis-year-area-mask-${year}`,
        clip: `pos-analysis-year-clip-${year}`,
        glow: `pos-analysis-year-glow-${year}`
      };

      const gradientMarkup = positions.map((pos) => {
        const config = POS_ANALYSIS_YEAR_SHIFT_GRADIENTS[pos];
        const key = pos.toLowerCase();
        return `<linearGradient id="${ids[`${key}Line`]}" gradientUnits="userSpaceOnUse" x1="${margin.l}" y1="0" x2="${width - margin.r}" y2="0"><stop offset="0%" stop-color="${config.low}"/><stop offset="52%" stop-color="${config.mid}"/><stop offset="100%" stop-color="${config.high}"/></linearGradient><linearGradient id="${ids[`${key}Area`]}" gradientUnits="userSpaceOnUse" x1="${margin.l}" y1="0" x2="${width - margin.r}" y2="0"><stop offset="0%" stop-color="${config.low}" stop-opacity=".2"/><stop offset="52%" stop-color="${config.mid}" stop-opacity=".12"/><stop offset="100%" stop-color="${config.high}" stop-opacity=".055"/></linearGradient>`;
      }).join('');

      const gridMarkup = yTicks.map((tick) => (
        `<line class="pos-analysis-year-shift-grid-line${tick === 0 ? ' pos-analysis-year-shift-grid-line--baseline' : ''}" x1="${margin.l}" x2="${width - margin.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-year-shift-axis-label pos-analysis-year-shift-axis-label--y" x="${margin.l - (compact ? 5 : 7)}" y="${y(tick) + (compact ? 2.8 : 3.5)}" text-anchor="end">${tick}</text>`
      )).join('');
      // Year-grid X-axis labels use separate SVG spans so the TOP prefix can
      // remain exactly 1px smaller than its threshold number at every layout;
      // label-only anchors preserve the guide-line and data-point geometry.
      const guideMarkup = labelIndexes.map((index) => (
        `<line class="pos-analysis-year-shift-guide" x1="${x(index)}" x2="${x(index)}" y1="${margin.t}" y2="${baseline}"/><text class="pos-analysis-year-shift-axis-label pos-analysis-year-shift-axis-label--x" x="${xAxisLabelX(index)}" y="${xAxisLabelY}" text-anchor="middle"><tspan class="pos-analysis-year-shift-axis-prefix">TOP</tspan><tspan class="pos-analysis-year-shift-axis-number">${cuts[index]}</tspan></text>`
      )).join('');

      const areaMarkup = positions.map((pos) => {
        const key = pos.toLowerCase();
        return `<path class="pos-analysis-year-shift-area pos-analysis-year-shift-area--${key}" d="${posAnalysisSmoothAreaPath(points[pos], baseline, 0.18)}" fill="url(#${ids[`${key}Area`]})" mask="url(#${ids.areaMask})" clip-path="url(#${ids.clip})"/>`;
      }).join('');

      const lineMarkup = positions.map((pos) => {
        const key = pos.toLowerCase();
        const path = posAnalysisSmoothPath(points[pos], 0.18);
        return `<path class="pos-analysis-year-shift-line-glow pos-analysis-year-shift-line-glow--${key}" d="${path}" stroke="url(#${ids[`${key}Line`]})" filter="url(#${ids.glow})" clip-path="url(#${ids.clip})"/><path class="pos-analysis-year-shift-line pos-analysis-year-shift-line--${key}" d="${path}" stroke="url(#${ids[`${key}Line`]})" clip-path="url(#${ids.clip})"/>`;
      }).join('');

      const pointMarkup = positions.map((pos) => {
        const config = POS_ANALYSIS_YEAR_SHIFT_GRADIENTS[pos];
        const key = pos.toLowerCase();
        return points[pos].map((point, index) => {
          const cut = cuts[index];
          const highlighted = POS_ANALYSIS_YEAR_SHIFT_LABEL_CUTS.includes(cut);
          const pointColor = index < 2 ? config.low : index < 4 ? config.mid : config.high;
          const tip = `<strong>${pos} \u00b7 ${year} \u00b7 Top ${cut}</strong><br>Cumulative player count: ${values[pos][index]}`;
          const interaction = highlighted
            ? ` tabindex="0" aria-label="${pos} ${year} Top ${cut}: ${values[pos][index]} players" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}"`
            : '';
          return `<circle class="pos-analysis-year-shift-point pos-analysis-year-shift-point--${key}${highlighted ? ' is-labeled' : ''}" cx="${point[0]}" cy="${point[1]}" r="${highlighted ? (compact ? 3.4 : 4.1) : (compact ? 1.55 : 1.9)}" fill="${pointColor}"${interaction}/>`;
        }).join('');
      }).join('');

      // Value-only chips use a deliberately narrow pill width. SVG central
      // baselines below keep every one- and two-digit value optically centered
      // in both axes even after removing the remaining horizontal padding.
      const labelWidth = compact ? 18 : 22;
      const labelHeight = compact ? 13 : 16;
      const labelMarkup = labelIndexes.map((index) => positions.map((pos) => {
        const otherPos = pos === 'RB' ? 'WR' : 'RB';
        const config = POS_ANALYSIS_YEAR_SHIFT_GRADIENTS[pos];
        const key = pos.toLowerCase();
        const point = points[pos][index];
        const otherPoint = points[otherPos][index];
        const value = values[pos][index];
        const otherValue = values[otherPos][index];
        const prefersAbove = value === otherValue ? pos === 'WR' : value > otherValue;
        // Near the zero line, a conventional above/below pair has no room for
        // the lower pill. Split close RB/WR values horizontally in one upper
        // lane instead, preserving both labels without covering either series.
        const floorCollision = Math.abs(value - otherValue) <= 2
          && Math.max(point[1], otherPoint[1]) >= baseline - labelHeight * 2.2;
        const requestedCenterY = floorCollision
          ? Math.min(point[1], otherPoint[1]) - labelHeight / 2 - (compact ? 2 : 3)
          : point[1] + (prefersAbove ? -(compact ? 11 : 13) : (compact ? 12 : 15));
        const horizontalSplit = floorCollision
          ? (pos === 'WR' ? -1 : 1) * (labelWidth / 2 + (compact ? 1.5 : 2.5))
          : 0;
        const minCenterY = margin.t + labelHeight / 2 + 1;
        const maxCenterY = baseline - labelHeight / 2 - 2;
        const labelCenterY = Math.max(minCenterY, Math.min(maxCenterY, requestedCenterY));
        const labelCenterX = Math.max(
          margin.l + labelWidth / 2 - 2,
          Math.min(width - margin.r - labelWidth / 2 + 2, point[0] + horizontalSplit)
        );
        const labelIsAbove = labelCenterY < point[1];
        const leaderTargetY = labelCenterY + (labelIsAbove ? labelHeight / 2 : -labelHeight / 2);
        return `<g class="pos-analysis-year-shift-data-label pos-analysis-year-shift-data-label--${key}"><line x1="${point[0]}" x2="${labelCenterX}" y1="${point[1]}" y2="${leaderTargetY}" stroke="${config.high}"/><rect x="${labelCenterX - labelWidth / 2}" y="${labelCenterY - labelHeight / 2}" width="${labelWidth}" height="${labelHeight}" rx="${labelHeight / 2}" fill="rgba(5,8,18,.92)" stroke="${config.high}"/><text x="${labelCenterX}" y="${labelCenterY}" text-anchor="middle" dominant-baseline="central" fill="${config.high}">${value}</text></g>`;
      }).join('')).join('');

      const description = POS_ANALYSIS_YEAR_SHIFT_LABEL_CUTS.map((cut, index) => {
        const pointIndex = labelIndexes[index];
        return `Top ${cut}: RB ${values.RB[pointIndex]}, WR ${values.WR[pointIndex]}`;
      }).join('. ');
      const svg = `<svg class="pos-analysis-year-shift-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="pos-analysis-year-shift-svg-title-${year} pos-analysis-year-shift-svg-desc-${year}"><title id="pos-analysis-year-shift-svg-title-${year}">${year} cumulative RB and WR positional supply</title><desc id="pos-analysis-year-shift-svg-desc-${year}">${description}.</desc><defs>${gradientMarkup}<linearGradient id="${ids.areaFade}" gradientUnits="userSpaceOnUse" x1="0" y1="${margin.t}" x2="0" y2="${baseline}"><stop offset="0%" stop-color="white" stop-opacity=".9"/><stop offset="58%" stop-color="white" stop-opacity=".42"/><stop offset="100%" stop-color="black" stop-opacity="0"/></linearGradient><mask id="${ids.areaMask}" maskUnits="userSpaceOnUse" x="${margin.l}" y="${margin.t}" width="${plotWidth}" height="${plotHeight}"><rect x="${margin.l}" y="${margin.t}" width="${plotWidth}" height="${plotHeight}" fill="url(#${ids.areaFade})"/></mask><clipPath id="${ids.clip}"><rect x="${margin.l}" y="${margin.t}" width="${plotWidth}" height="${plotHeight}" rx="${compact ? 9 : 12}"/></clipPath><filter id="${ids.glow}" x="-20%" y="-25%" width="140%" height="150%"><feGaussianBlur stdDeviation="${compact ? 1.8 : 2.5}"/></filter></defs><rect class="pos-analysis-year-shift-plot" x="${margin.l}" y="${margin.t}" width="${plotWidth}" height="${plotHeight}" rx="${compact ? 9 : 12}"/>${gridMarkup}${guideMarkup}<text class="pos-analysis-year-shift-axis-title" x="${margin.l}" y="${compact ? 10 : 12}">COUNT</text>${areaMarkup}${lineMarkup}${pointMarkup}${labelMarkup}</svg>`;

      return `<article class="pos-analysis-year-shift-card pos-analysis-year-shift-card--${phaseTone}${emphasisClass}" data-year="${year}"><header class="pos-analysis-year-shift-card-head"><div class="pos-analysis-year-shift-year"><strong>${year}</strong></div><div class="pos-analysis-year-shift-phase pos-analysis-year-shift-phase--${phaseTone}"><span>${phaseLabel}</span><small>${phaseScore}</small></div></header><div class="pos-analysis-year-shift-chart-shell">${svg}</div><footer class="pos-analysis-year-shift-card-foot"><span class="pos-analysis-year-shift-card-foot-label">RB vs. WR</span><div class="pos-analysis-year-shift-range-gaps" aria-label="RB versus WR gaps at Top 12, Top 36, and Top 60">${rangeGapMarkup}</div></footer></article>`;
    }).join('');

    attachPosAnalysisTooltips(host);
  }

  function renderPosAnalysisTierStackBars({ resetScroll = false } = {}) {
    const host = document.getElementById('pos-analysis-tier-stack-chart');
    if (!host) return;
    const years = POS_ANALYSIS_YEARS.filter((year) => (
      year >= POS_ANALYSIS_STATE.tierStackMinYear
      && year <= POS_ANALYSIS_STATE.tierStackMaxYear
    ));
    const container = host.closest('.pos-analysis-chart-scroll');
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const h = compact ? 248 : 390;
    const m = compact
      ? { l: 30, r: 10, t: 26, b: 52 }
      : { l: 46, r: 28, t: 30, b: 52 };
    const availableW = Math.max(
      compact ? 286 : 560,
      Math.floor((container?.clientWidth || host.clientWidth || 1180) - (compact ? 4 : 0))
    );
    // G1 range-aware geometry:
    // - six phone years compress just enough to fit the card without scrolling
    // - longer ranges receive a readable per-year lane and overflow naturally
    // - desktop uses the existing card width whenever all lanes fit.
    const compactFitLaneW = years.length <= 6
      ? Math.max(43, Math.min(54, (availableW - m.l - m.r) / Math.max(1, years.length)))
      : 54;
    const minimumLaneW = compact ? compactFitLaneW : 56;
    const w = Math.ceil(Math.max(availableW, m.l + m.r + years.length * minimumLaneW));
    const plotW = w - m.l - m.r;
    const plotH = h - m.t - m.b;
    const yMax = 26;
    const y = (value) => m.t + plotH - value / yMax * plotH;
    const groupW = plotW / Math.max(1, years.length);
    const pairGap = Math.min(compact ? 9 : 14, Math.max(compact ? 5 : 7, groupW * 0.12));
    const barW = Math.min(
      compact ? 48 : 54,
      Math.max(compact ? 14 : 17, (groupW - pairGap) * 0.34)
    );
    const minimumLabelH = compact ? 13 : 12;
    const fullLabelH = compact ? 29 : 25;
    const rangeFontSize = Math.min(compact ? 9.5 : 10.4, Math.max(compact ? 7.6 : 8.4, barW * 0.48));
    const countFontSize = Math.min(compact ? 13.2 : 14.2, Math.max(compact ? 10.4 : 11.5, barW * 0.62));
    const positionFontSize = Math.min(compact ? 10.7 : 11.4, Math.max(9, groupW * 0.19));
    const yearFontSize = Math.min(compact ? 12.4 : 13, Math.max(compact ? 10.2 : 11, groupW * 0.22));
    const firstYear = years[0];
    const lastYear = years[years.length - 1];
    const rangeLabel = firstYear === lastYear ? String(firstYear) : `${firstYear} through ${lastYear}`;
    const chartTitle = compact
      ? 'Stack height = T60 · labels = cumulative tier counts'
      : 'Stack height = Top 60 total · section labels show cumulative T12, T36, and T60 counts';

    host.style.width = `${w}px`;
    host.style.minWidth = `${w}px`;
    host.dataset.yearCount = String(years.length);
    host.setAttribute('aria-label', `WR and RB tier stack bar chart for ${rangeLabel}`);
    let svg = `<svg class="pos-analysis-tier-stack-chart" data-year-count="${years.length}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="pos-analysis-tier-stack-svg-title pos-analysis-tier-stack-svg-desc" style="--pos-analysis-tier-range-size:${rangeFontSize.toFixed(2)}px;--pos-analysis-tier-count-size:${countFontSize.toFixed(2)}px;--pos-analysis-tier-position-size:${positionFontSize.toFixed(2)}px;--pos-analysis-tier-year-size:${yearFontSize.toFixed(2)}px"><title id="pos-analysis-tier-stack-svg-title">RB and WR tier supply from ${rangeLabel}</title><desc id="pos-analysis-tier-stack-svg-desc">Two stacked bars per year compare cumulative Top 12, Top 36, and Top 60 running back and wide receiver counts.</desc>`;

    [0, 5, 10, 15, 20, 26].forEach((tick) => {
      svg += `<line class="pos-analysis-tier-stack-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y(tick)}" y2="${y(tick)}"/><text class="pos-analysis-tier-stack-axis-label" x="${m.l - 8}" y="${y(tick) + 4}" text-anchor="end">${tick}</text>`;
    });

    years.forEach((year, yearOffset) => {
      const yearIndex = POS_ANALYSIS_YEARS.indexOf(year);
      const yearCenter = m.l + yearOffset * groupW + groupW / 2;
      ['WR', 'RB'].forEach((pos, posOffset) => {
        const x0 = posOffset === 0
          ? yearCenter - pairGap / 2 - barW
          : yearCenter + pairGap / 2;
        const top12 = POS_ANALYSIS_STATE.counts['Top 12'][pos][yearIndex];
        const top36 = POS_ANALYSIS_STATE.counts['Top 36'][pos][yearIndex];
        const top60 = POS_ANALYSIS_STATE.counts['Top 60'][pos][yearIndex];
        const segments = [
          { cut: '12', label: 'T12', from: 0, to: top12, value: top12 },
          { cut: '36', label: 'T36', from: top12, to: top36, value: top36 },
          { cut: '60', label: 'T60', from: top36, to: top60, value: top60 }
        ];
        svg += `<g class="pos-analysis-tier-stack-bar" aria-label="${pos} ${year} tier stack">`;
        segments.forEach((segment) => {
          const y1 = y(segment.to);
          const y2 = y(segment.from);
          const segmentH = Math.max(0, y2 - y1);
          const fill = POS_ANALYSIS_RANGE_COLORS[segment.cut][pos];
          const tip = `<strong>${pos} ${segment.label} · ${year}</strong><br>Cumulative count: ${segment.value}<br>Segment count: ${segment.to - segment.from}`;
          // Rounded middle segments soften the internal stack without changing
          // the existing stronger rounding on the top T60 segment.
          const cornerRadius = segment.cut === '60'
            ? Math.min(5, barW / 2)
            : segment.cut === '36'
              ? Math.min(3.5, barW / 2)
              : 0;
          svg += `<rect class="pos-analysis-tier-stack-segment" data-pos-analysis-tier-cut="${segment.cut}" x="${x0}" y="${y1}" width="${barW}" height="${segmentH}" fill="${fill}" rx="${cornerRadius}" data-pos-analysis-tip="${escapePosAnalysisAttr(tip)}" tabindex="0"/>`;
          if (segmentH >= minimumLabelH) {
            const labelX = x0 + barW / 2;
            const labelY = y1 + segmentH / 2;
            // Short sections keep the cumulative value while taller sections
            // retain both their T12/T36/T60 tier tag and value.
            const valueOnly = segmentH < fullLabelH || (segment.cut === '12' && segment.value === 2);
            const badgeH = valueOnly ? Math.min(20, Math.max(12, segmentH - 2)) : 30;
            const labelMarkup = valueOnly
              ? `<text class="pos-analysis-tier-stack-label pos-analysis-tier-stack-label--value-only" x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="central"><tspan class="pos-analysis-tier-stack-label-count" x="${labelX}">${segment.value}</tspan></text>`
              : `<text class="pos-analysis-tier-stack-label" x="${labelX}" y="${labelY - 5}" text-anchor="middle"><tspan class="pos-analysis-tier-stack-label-range" x="${labelX}">${segment.label}</tspan><tspan class="pos-analysis-tier-stack-label-count" x="${labelX}" dy="14">${segment.value}</tspan></text>`;
            svg += `<g class="pos-analysis-tier-stack-label-badge" data-pos-analysis-tier-cut="${segment.cut}" data-pos-analysis-value-only="${valueOnly}"><rect x="${x0 + 1.5}" y="${labelY - badgeH / 2}" width="${Math.max(1, barW - 3)}" height="${badgeH}" rx="${Math.min(5, badgeH / 2)}"/>${labelMarkup}</g>`;
          }
        });
        svg += `</g><text class="pos-analysis-tier-stack-pos-label" x="${x0 + barW / 2}" y="${h - (compact ? 31 : 34)}" text-anchor="middle" fill="${POS_ANALYSIS_POS_CONFIG[pos].high}">${pos}</text>`;
      });
      svg += `<text class="pos-analysis-tier-stack-year-label" x="${yearCenter}" y="${h - (compact ? 13 : 16)}" text-anchor="middle">${year}</text>`;
    });

    svg += `<text class="pos-analysis-tier-stack-chart-title" x="${m.l}" y="${compact ? 16 : 18}">${chartTitle}</text></svg>`;
    host.innerHTML = svg;
    if (resetScroll && container) container.scrollLeft = 0;
    attachPosAnalysisTooltips(host);
  }

  function setupPosAnalysisInteractions() {
    const root = getPosAnalysisRoot();
    if (!root || POS_ANALYSIS_STATE.interactionsBound) return;

    root.querySelectorAll('[data-pos-analysis-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.mode = button.dataset.posAnalysisMode || 'single';
        renderPosAnalysisAll();
      });
    });

    root.querySelectorAll('[data-pos-analysis-position-view]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.positionView = button.dataset.posAnalysisPositionView || 'rbWr';
        POS_ANALYSIS_STATE.activePositions = POS_ANALYSIS_STATE.positionView === 'all'
          ? POS_ANALYSIS_POSITIONS.slice()
          : ['RB', 'WR'];
        renderPosAnalysisAll();
      });
    });

    root.querySelectorAll('[data-pos-analysis-personnel]').forEach((button) => {
      button.addEventListener('click', () => {
        POS_ANALYSIS_STATE.personnel = button.dataset.posAnalysisPersonnel || '12';
        renderPosAnalysisPersonnel();
      });
    });

    POS_ANALYSIS_STATE.interactionsBound = true;
  }

  function posAnalysisPlayer(label, x, y, type, note = '', role = type) {
    const roleClass = String(role).trim() ? ` pos-analysis-field-player--${escapePosAnalysisAttr(role)}` : '';
    return `<div class="pos-analysis-field-player pos-analysis-field-player--${type}${roleClass}" style="left:${x}%;bottom:${y}%"><strong>${escapePosAnalysisHtml(label)}</strong>${note ? `<span>${escapePosAnalysisHtml(note)}</span>` : ''}</div>`;
  }

  function renderPosAnalysisSimStat(icon, label, value) {
    // Simulator stat values remain HTML-escaped, while intentional newline
    // markers can create controlled line breaks in specific position notes.
    const formattedValue = escapePosAnalysisHtml(value).replace(/\n/g, '<br>');
    return `<span class="pos-analysis-sim-stat-label pos-analysis-sim-stat-label--${escapePosAnalysisAttr(icon)}">${posAnalysisIcon(icon, 'pos-analysis-icon--sim')}<span>${escapePosAnalysisHtml(label)}</span></span><strong>${formattedValue}</strong>`;
  }

  function renderPosAnalysisPersonnel() {
    const field = document.getElementById('pos-analysis-field-grid');
    const copy = document.getElementById('pos-analysis-shift-copy');
    const rbStat = document.getElementById('pos-analysis-sim-rb');
    const wrStat = document.getElementById('pos-analysis-sim-wr');
    const teStat = document.getElementById('pos-analysis-sim-te');
    const qbStat = document.getElementById('pos-analysis-sim-qb');
    if (!field || !copy || !rbStat || !wrStat || !teStat || !qbStat) return;

    const root = getPosAnalysisRoot();
    root?.querySelectorAll('[data-pos-analysis-personnel]').forEach((button) => {
      const active = button.dataset.posAnalysisPersonnel === POS_ANALYSIS_STATE.personnel;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    let players = '<div class="pos-analysis-line-of-scrimmage"></div><div class="pos-analysis-linemen"><span>LT</span><span>LG</span><span>C</span><span>RG</span><span>RT</span></div>';
    // Personnel coordinates keep TE/WR chips below the line row and place
    // inline tight ends outside the tackle area to avoid overlap in every state.
    // Stamp current personnel on the field grid so CSS @media desktop rules can
    // override left/bottom per-personnel without duplicating JS rendering.
    field.dataset.personnel = POS_ANALYSIS_STATE.personnel;

    if (POS_ANALYSIS_STATE.personnel === '11') {
      // 11 Personnel — MOBILE positions: WR1(X) 7%/37%, TE(Inline) 73%/37%,
      // WR3(Slot) 23%/31%, WR2(Z) 89%/31%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      //   [data-personnel="11"] .pos-analysis-field-player--* { left/bottom }
      players += [
        posAnalysisPlayer('QB', 50, 23, 'qb', 'Shotgun', 'backfield-qb'),
        posAnalysisPlayer('RB', 42, 23, 'rb', 'Offset', 'backfield-rb'),
        posAnalysisPlayer('TE', 73, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('WR1', 7, 37, 'wr', 'X', 'wideout-left'),
        posAnalysisPlayer('WR2', 89, 31, 'wr', 'Z', 'wideout-right'),
        posAnalysisPlayer('WR3', 23, 31, 'wr', 'Slot', 'slot-left')
      ].join('');
      copy.innerHTML = '<strong>11 Personnel Layout (1 RB, 1 TE, 3 WR):</strong> Light personnel grouping, 3-WR spacing, and 1 TE. Lighter run surface, but offers broad run/pass flexibility.';
      rbStat.innerHTML = renderPosAnalysisSimStat('rb', 'RB opportunity', '↓ Rush·%');
      wrStat.innerHTML = renderPosAnalysisSimStat('wr', 'WR role', '3 WR Sets');
      teStat.innerHTML = renderPosAnalysisSimStat('te', 'TE role', '1 TE on field');
      qbStat.innerHTML = renderPosAnalysisSimStat('qb', 'QB protection', 'Fewer extra blockers available');
    } else if (POS_ANALYSIS_STATE.personnel === '13') {
      // 13 Personnel — MOBILE positions: WR1(X) 11%/31%, TE1(Inline) 72%/37%,
      // TE2(Off-Line) 80%/31%, TE3(Inline) 27%/37%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      players += [
        posAnalysisPlayer('QB', 50, 31, 'qb', 'Under C', 'under-center-qb'),
        posAnalysisPlayer('RB', 50, 12, 'rb', 'Power', 'deep-back'),
        posAnalysisPlayer('TE1', 72, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('TE2', 80, 31, 'te', 'Off-Line', 'wing-te-right'),
        posAnalysisPlayer('TE3', 27, 37, 'te', 'Inline', 'inline-te-left'),
        posAnalysisPlayer('WR1', 11, 31, 'wr', 'X', 'wideout-left')
      ].join('');
      copy.innerHTML = '<strong>13 Personnel Layout (1 RB, 3 TE, 1 WR):</strong> Adds a 3rd TE and removes another WR, creating a heavy front generating additional gaps and stressing defensive run fits. Can force heavier defensive personnel, creating favorable play-action/pass matchups against linebackers and base defenses. ';
      rbStat.innerHTML = renderPosAnalysisSimStat('rb', 'RB opportunity', '↑↑ Rush·% |\nMax run support');
      wrStat.innerHTML = renderPosAnalysisSimStat('wr', 'WR role', 'Only 1 WR on field');
      teStat.innerHTML = renderPosAnalysisSimStat('te', 'TE role', '3 TEs on field');
      qbStat.innerHTML = renderPosAnalysisSimStat('qb', 'QB protection', 'Max protection flexibility');
    } else {
      // 12 Personnel — MOBILE positions: WR1(X) 7%/37%, TE1(Inline) 72%/37%,
      // TE2(Off-Line) 28%/31%, WR2(Z) 89%/31%.
      // Desktop overrides are in research.css @media (min-width: 869px)
      players += [
        posAnalysisPlayer('QB', 50, 31, 'qb', 'Under C', 'under-center-qb'),
        posAnalysisPlayer('RB', 50, 12, 'rb', 'Workhorse', 'deep-back'),
        posAnalysisPlayer('TE1', 72, 37, 'te', 'Inline', 'inline-te-right'),
        posAnalysisPlayer('TE2', 28, 31, 'te', 'Off-Line', 'inline-te-left'),
        posAnalysisPlayer('WR1', 7, 37, 'wr', 'X', 'wideout-left'),
        posAnalysisPlayer('WR2', 89, 31, 'wr', 'Z', 'wideout-right')
      ].join('');
      copy.innerHTML = '<strong>12 Personnel Layout (1 RB, 2 TE, 2 WR):</strong> Adds a 2nd TE while removing the Slot WR / WR3, creating more blocking surfaces and additional formation flexibility without sacrificing the ability to spread the defense. TEs can stay attached, flex into the slot, or release as receivers.';
      rbStat.innerHTML = renderPosAnalysisSimStat('rb', 'RB opportunity', '↑ Rush·% |\nStrong run support');
      wrStat.innerHTML = renderPosAnalysisSimStat('wr', 'WR role', '2 WR Sets');
      teStat.innerHTML = renderPosAnalysisSimStat('te', 'TE role', '2 TEs on field');
      qbStat.innerHTML = renderPosAnalysisSimStat('qb', 'QB protection', 'More protection flexibility');
    }

    field.innerHTML = players;
  }

  function renderPosAnalysisAll() {
    if (!POS_ANALYSIS_STATE.loaded || !POS_ANALYSIS_STATE.counts) return;
    refreshPosAnalysisControls();
    refreshPosAnalysisYearControls();
    renderPosAnalysisGlobalChart();
    renderPosAnalysisProfiles();
    renderPosAnalysisYearShiftGrid();
    renderPosAnalysisTierStackBars();
    renderPosAnalysisPersonnel();
  }

  function renderPositionalAnalysis() {
    const root = getPosAnalysisRoot();
    if (!root) return;
    hydratePosAnalysisIcons(root);
    setupPosAnalysisInteractions();
    renderPosAnalysisPersonnel();

    if (!POS_ANALYSIS_STATE.loaded) {
      setPosAnalysisMessage('Loading positional analysis data...');
      ensurePosAnalysisData()
        .then(() => renderPosAnalysisAll())
        .catch((error) => {
          console.error(error);
          POS_ANALYSIS_STATE.loadingPromise = null;
          setPosAnalysisMessage('Failed to load positional analysis data.', 'error');
        });
      return;
    }

    renderPosAnalysisAll();
  }

  function handleResize() {
    if (document.body.dataset.page !== PAGE_ID) return;
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      const activeTarget = document.querySelector('.syop-tab.active')?.dataset.target;
      if (activeTarget === 'positional-analysis-tab-panel') {
        renderPositionalAnalysis();
      } else {
        renderSunburst();
        renderBarChart();
        renderGauges();
      }
    }, 180);
  }

  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll('.syop-tab'));
    if (tabs.length === 0) return;

    const panels = new Map();
    tabs.forEach((tab) => {
      const target = tab.dataset.target;
      if (target) {
        const panel = document.getElementById(target);
        if (panel) {
          panels.set(target, panel);
        }
      }
    });

    const activate = (tab, { focusTab } = { focusTab: false }) => {
      tabs.forEach((btn) => {
        const isActive = btn === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
        const target = btn.dataset.target;
        const panel = target ? panels.get(target) : null;
        if (panel) {
          if (isActive) {
            panel.classList.add('active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('active');
            panel.setAttribute('hidden', '');
          }
        }
      });
      if (focusTab) {
        tab.focus();
      }

      window.requestAnimationFrame(() => {
        if (tab.dataset.target === 'positional-analysis-tab-panel') {
          renderPositionalAnalysis();
        } else {
          renderSunburst();
          renderBarChart();
          renderGauges();
        }
      });
    };

    // Research tab routing: local dashboard buttons still switch panels in
    // place, while both hit-rate anchors keep their isolated Next.js routes.
    tabs.forEach((tab, index) => {
      if (tab.dataset.target) {
        tab.addEventListener('click', () => activate(tab, { focusTab: false }));
      }
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          const delta = event.key === 'ArrowRight' ? 1 : -1;
          const nextIndex = (index + delta + tabs.length) % tabs.length;
          const nextTab = tabs[nextIndex];
          if (nextTab.dataset.target) {
            activate(nextTab, { focusTab: true });
          } else {
            tabs.forEach((candidate) => candidate.setAttribute('tabindex', candidate === nextTab ? '0' : '-1'));
            nextTab.focus();
          }
        }
      });
    });

    // Release routing: only Career Length Analytics can be opened locally.
    // Old Positional Analysis links fall back to the active SYOP tab.
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    const requestedTargets = {
      syop: 'syop-tab-panel'
    };
    const requestedTarget = requestedTargets[requestedTab];
    const requestedActiveTab = requestedTarget
      ? tabs.find((tab) => tab.dataset.target === requestedTarget)
      : null;
    const currentActive = requestedActiveTab
      || tabs.find((tab) => tab.classList.contains('active'))
      || tabs.find((tab) => tab.dataset.target);
    if (currentActive) {
      activate(currentActive, { focusTab: false });
    }
  }

  function applyUsernameFromQuery() {
    const input = document.getElementById('usernameInput');
    if (!input) return;
    const params = new URLSearchParams(window.location.search);
    const uname = params.get('username');
    if (uname) {
      input.value = uname;
      // Prevent mobile keyboard from opening when landing with ?username
      setTimeout(() => { try { input.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {} }, 50);
    }
  }

  function init() {
    if (document.body.dataset.page !== PAGE_ID) return;
    applyUsernameFromQuery();
    setupTabs();
    renderSunburst();
    renderBarChart();
    renderGauges();
    // Positional Analysis stays uninitialized while unavailable for release.
    window.addEventListener('resize', handleResize);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
