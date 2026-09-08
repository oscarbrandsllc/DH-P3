// === Legend hard-hide helper ===
function hideLegend() { try { document.getElementById('legend-section')?.classList.add('hidden'); } catch (e) { } }
function showLegend() { try { document.getElementById('legend-section')?.classList.remove('hidden'); } catch (e) { } }
// --- DOM Elements ---
const usernameInput = document.getElementById('usernameInput');
const leagueSelect = document.getElementById('leagueSelect');
const loadingIndicator = document.getElementById('loading');
const welcomeScreen = document.getElementById('welcome-screen');
const rosterView = document.getElementById('rosterView');
const playerListView = document.getElementById('playerListView');
const rosterContainer = document.getElementById('rosterContainer');
const rosterGrid = document.getElementById('rosterGrid');
const rosterContentVisibilityQuery = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
    ? window.matchMedia('(max-width: 819px)')
    : null;
const rosterHeaderDividerQuery = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
    ? window.matchMedia('(min-width: 869px)')
    : null;
let rosterContentVisibilityEnabled = false;
const compareButton = document.getElementById('compareButton');
const compareSearchToggle = document.getElementById('compareSearchToggle');
const compareSearchPopover = document.getElementById('compareSearchPopover');
const compareSearchInput = document.getElementById('compareSearchInput');
const compareSearchClose = document.getElementById('compareSearchClose');
const rosterSearchInput = document.getElementById('rosterSearchInput');
const rosterUsernameSubmitButton = document.getElementById('rosterUsernameSubmitButton');
const positionalViewBtn = document.getElementById('positionalViewBtn');
const condensedViewBtn = document.getElementById('condensedViewBtn');
const lineupViewBtn = document.getElementById('lineupViewBtn');
const viewDropdownToggle = document.getElementById('viewDropdownToggle');
const viewDropdownMenu = document.getElementById('viewDropdownMenu');
const viewDropdownIcon = document.getElementById('viewDropdownIcon');
const viewDropdownLabel = document.getElementById('viewDropdownLabel');
const positionalFiltersContainer = document.getElementById('positional-filters');
const clearFiltersButton = document.getElementById('clearFiltersButton');
const tradeSimulator = document.getElementById('tradeSimulator');
const mainContent = document.getElementById('content');
const pageType = document.body.dataset.page || 'welcome';
// New nav buttons
const homeButton = document.getElementById('homeButton');
const rostersButton = document.getElementById('rostersButton');
const statsButton = document.getElementById('statsButton');
const leagueHubButton = document.getElementById('leagueHubButton');
const researchButton = document.getElementById('researchButton');
const startSitButton = document.getElementById('startSitButton');
const gameLogsModal = document.getElementById('game-logs-modal');
const gameLogsSeasonDropdown = document.querySelector('[data-gamelogs-season-dropdown]');
const gameLogsSeasonToggle = document.getElementById('gamelogsSeasonToggle');
const gameLogsSeasonLabel = document.getElementById('gamelogsSeasonLabel');
const gameLogsSeasonMenu = document.getElementById('gamelogsSeasonMenu');
const gameLogsCareerButton = document.getElementById('gamelogsCareerButton');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
const statsKeyContainer = document.getElementById('stats-key-container');
const radarChartContainer = document.getElementById('radar-chart-container');
const consistencyContainer = document.getElementById('consistency-container');
const modalOverlay = document.querySelector('.modal-overlay');
const modalPlayerName = document.getElementById('modal-player-name');
const modalPlayerVitals = document.getElementById('modal-player-vitals');
const modalBody = document.getElementById('modal-body');
const playerComparisonModal = document.getElementById('player-comparison-modal');
const comparisonBackgroundOverlay = document.getElementById('comparison-modal-background-overlay');
// Shared key metadata: keeps the stats popup, game logs key, and comparison key in sync.
// Categories follow the same Fantasy → Passing → Rushing → Receiving → General flow used by the SZN view.
const SHARED_STATS_KEY_SECTIONS = [
    {
        id: 'fantasy',
        label: 'Fantasy',
        tone: 'all',
        items: [
            { abbr: 'FPOE', desc: 'Fantasy Points Over Expected' },
            { abbr: 'FPTS', desc: 'Fantasy Points (PPR)' },
            { abbr: 'PPG', desc: 'Points Per Game' }
        ]
    },
    {
        id: 'passing',
        label: 'Passing',
        tone: 'passing',
        items: [
            { abbr: 'CMP', desc: 'Completions' },
            { abbr: 'CMP%', desc: 'Completion Percentage' },
            { abbr: 'CPOE', desc: 'Completion Percentage Over Expected' },
            { abbr: 'EPA/DB', desc: 'Expected Points Added per dropback' },
            { abbr: 'INT', desc: 'Interceptions' },
            { abbr: 'pa1D', desc: 'Passing First Downs' },
            { abbr: 'paATT', desc: 'Passing Attempts' },
            { abbr: 'paRTG', desc: 'Passer Rating' },
            { abbr: 'paTD', desc: 'Passing Touchdowns' },
            { abbr: 'paYDS', desc: 'Passing Yards' },
            { abbr: 'pIMP', desc: 'Passing Impact Plays' },
            { abbr: 'pIMP/A', desc: 'Passing Impact per Attempt' },
            { abbr: 'PRS%', desc: 'Pressure Rate' },
            { abbr: 'SAC', desc: 'Sacks Taken' },
            { abbr: 'TTT', desc: 'Time to Throw' }
        ]
    },
    {
        id: 'rushing',
        label: 'Rushing',
        tone: 'rushing',
        items: [
            { abbr: 'CAR', desc: 'Carries' },
            { abbr: 'ELU', desc: 'Elusiveness Rating' },
            { abbr: 'EXPLSV%', desc: 'Explosive Rush Rate [% CAR of 10+ YDS]' },
            { abbr: 'MTF', desc: 'Missed Tackles Forced' },
            { abbr: 'MTF/A', desc: 'Missed Tackles per Attempt' },
            { abbr: 'ru1D', desc: 'Rushing First Downs' },
            { abbr: 'ruTD', desc: 'Rushing Touchdowns' },
            { abbr: 'ruYDS', desc: 'Rushing Yards' },
            { abbr: 'YCO', desc: 'Yards After Contact' },
            { abbr: 'YCO/A', desc: 'Yards After Contact per Attempt' },
            { abbr: 'YPC', desc: 'Yards per Carry' }
        ]
    },
    {
        id: 'receiving',
        label: 'Receiving',
        tone: 'receiving',
        items: [
            { abbr: '1DRR', desc: 'First Downs per Route Run' },
            { abbr: 'AY%', desc: 'Air Yards Share' },
            { abbr: 'REC', desc: 'Receptions' },
            { abbr: 'rec1D', desc: 'Receiving First Downs' },
            { abbr: 'recTD', desc: 'Receiving Touchdowns' },
            { abbr: 'recYDS', desc: 'Receiving Yards' },
            { abbr: 'RR', desc: 'Routes Run' },
            { abbr: 'RZ Tgt', desc: 'Red Zone Targets' },
            { abbr: 'TGT', desc: 'Targets' },
            { abbr: 'TS%', desc: 'Target Share' },
            { abbr: 'YAC', desc: 'Yards After Catch' },
            { abbr: 'YPR', desc: 'Yards per Reception' },
            { abbr: 'YPRR', desc: 'Yards per Route Run' }
        ]
    },
    {
        id: 'general',
        label: 'General',
        tone: 'all',
        items: [
            { abbr: 'ADP', desc: 'Average Draft Position' },
            { abbr: 'AGE', desc: 'Player Age' },
            { abbr: 'CL', desc: 'Ceiling' },
            { abbr: 'CSTY%', desc: 'Consistency Percentage' },
            { abbr: 'FUM', desc: 'Fumbles Lost' },
            { abbr: 'G', desc: 'Games Played' },
            { abbr: 'IMP', desc: 'Impact Plays (1D + TD)' },
            { abbr: 'IMP/G', desc: 'Impact Plays per Game' },
            { abbr: 'IMP/OPP', desc: 'Impact per Opportunity' },
            { abbr: 'POS', desc: 'Position' },
            { abbr: 'POS·ADP', desc: 'Positional ADP' },
            { abbr: 'RK', desc: 'Overall Rank' },
            { abbr: 'SNP%', desc: 'Snap Share' },
            { abbr: 'TM', desc: 'Team' },
            { abbr: 'VALUE', desc: 'Trade Value' },
            { abbr: 'YDS(t)', desc: 'Total Yards' },
            { abbr: 'YPG(t)', desc: 'Yards per Game (Total)' }
        ]
    }
];
function getSortedSharedStatsKeySections() {
    return SHARED_STATS_KEY_SECTIONS.map((section) => ({
        ...section,
        items: [...section.items].sort((a, b) => a.abbr.localeCompare(b.abbr, undefined, { numeric: true, sensitivity: 'base' }))
    }));
}
function buildSharedStatsKeyMarkup() {
    const sections = getSortedSharedStatsKeySections();
    return `
        <div class="stats-key-sections">
            ${sections.map((section) => `
                <section class="stats-key-section stats-key-section--${section.tone}">
                    <div class="stats-key-section-header stats-key-section-header--${section.tone}">${section.label}</div>
                    <div class="stats-key-section-body">
                        ${section.items.map((item) => `
                            <div class="stats-key-item">
                                <span class="stats-key-abbr">${item.abbr}</span>
                                <span class="stats-key-desc">${item.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `).join('')}
        </div>
    `;
}
function renderSharedStatsKeyMarkup(container) {
    if (!container) return;
    container.innerHTML = buildSharedStatsKeyMarkup();
}
function initializeSharedStatsKeyMarkup() {
    document.querySelectorAll('.stats-key-shared-body').forEach((container) => {
        renderSharedStatsKeyMarkup(container);
    });
}
initializeSharedStatsKeyMarkup();
// Ownership page specific controls + modal (kept page-scoped so other pages are unaffected).
const ownershipModeSwitcher = document.getElementById('ownershipModeSwitcher');
const ownershipModeOwnershipBtn = document.getElementById('ownershipModeOwnershipBtn');
const ownershipModeValueBtn = document.getElementById('ownershipModeValueBtn');
const ownershipUsernameSubmitButton = document.getElementById('ownershipUsernameSubmitButton');
// Ownership player modal element IDs support both legacy kebab-case and reference camelCase markup.
const ownershipPlayerModal = document.getElementById('ownershipPlayerModal') || document.getElementById('ownership-player-modal');
const ownershipModalOverlay = ownershipPlayerModal?.querySelector('.modal-overlay');
const ownershipModalCloseBtn = ownershipPlayerModal?.querySelector('.ownership-modal-close');
const ownershipModalPlayerName = document.getElementById('ownershipModalPlayerName') || document.getElementById('ownership-modal-player-name');
const ownershipModalPlayerVitals = document.getElementById('ownershipModalPlayerVitals') || document.getElementById('ownership-modal-player-vitals');
const ownershipModalSummaryChips = document.getElementById('ownershipModalSummaryChips') || document.getElementById('ownership-modal-summary-chips');
const ownershipModalBody = document.getElementById('ownershipModalBody') || document.getElementById('ownership-modal-body');
const ownershipModalHeaderLeft = document.getElementById('ownershipModalLeft') || document.getElementById('ownership-modal-left');
// --- Watchlist DOM Elements (Rosters page only) ---
const watchlistModalToggle = document.getElementById('watchlist-modal-toggle');
const watchlistModal = document.getElementById('watchlist-modal');
const watchlistModalBody = document.getElementById('watchlist-modal-body');
const watchlistButton = document.getElementById('watchlist-button');
const watchlistBadge = document.getElementById('watchlistBadge');
const bottomMenuPanel = document.getElementById('bottom-menu-panel');
const HEADER_USERNAME_STORAGE_KEY = 'sleeper_username';
let gameLogsModalRequestSeq = 0;
const supportsContentVisibility = typeof CSS !== 'undefined'
    && typeof CSS.supports === 'function'
    && CSS.supports('content-visibility', 'auto');
function updateRosterContentVisibility() {
    // content-visibility: auto removed — caused card pop-in during scroll.
    // All team cards render upfront (async-chunked on mobile) so content is
    // immediately visible while scrolling. calibrateTeamCardIntrinsicSize() is
    // a no-op while rosterContentVisibilityEnabled is false.
    rosterContentVisibilityEnabled = false;
    rosterGrid?.classList.remove('roster-cv-enabled');
}
if (supportsContentVisibility) {
    updateRosterContentVisibility();
    if (rosterContentVisibilityQuery) {
        const cvListener = () => updateRosterContentVisibility();
        if (typeof rosterContentVisibilityQuery.addEventListener === 'function') {
            rosterContentVisibilityQuery.addEventListener('change', cvListener);
        } else if (typeof rosterContentVisibilityQuery.addListener === 'function') {
            rosterContentVisibilityQuery.addListener(cvListener);
        }
    }
}
const COMPARE_BUTTON_PREVIEW_HTML = '<span class="button-text">Preview</span>';
const COMPARE_BUTTON_SHOW_ALL_HTML = '<span class="compare-show-all-stack"><i aria-hidden="true" class="fa-solid fa-arrows-left-right-to-line compare-show-all-icon"></i><span class="compare-show-all-label">Show All</span></span>';
if (compareButton) {
    compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
}
// --- Navigation Logic ---
// Temporary focus suppression to prevent mobile keyboards from opening
// when navigation buttons are tapped and other scripts may re-focus inputs.
// We patch HTMLElement.prototype.focus to ignore focus calls on input-like
// elements for a short window after navigation gestures.
let __suppressFocusUntil = 0;
const __suppressFocusMs = 700;
function suppressFocusTemporary(ms) {
    __suppressFocusUntil = Date.now() + (ms || __suppressFocusMs);
}
(function installExternalNavHelpers() {
    const TROPHY_ROOM_HOST = 'trophyroom.dynastyhub.pro';
    const buildTrophyRoomUserUrl = (parsedUrl, username) => {
        // Trophy Room sister-app navigation: send connected users to their clean profile route on the production subdomain.
        parsedUrl.pathname = `/user/${encodeURIComponent(username)}`;
        parsedUrl.search = '';
        parsedUrl.hash = '';
        return parsedUrl.toString();
    };
    const readStoredUsername = () => {
        const inputValue = typeof usernameInput?.value === 'string' ? usernameInput.value.trim() : '';
        if (inputValue) return inputValue;
        try {
            return (localStorage.getItem('sleeper_username') || '').trim();
        } catch (e) {
            return '';
        }
    };
    window.__dhBuildExternalUrl = (rawUrl) => {
        if (!rawUrl) return rawUrl;
        let parsed;
        try {
            parsed = new URL(rawUrl, window.location.origin);
        } catch (e) {
            return rawUrl;
        }
        if (parsed.hostname !== TROPHY_ROOM_HOST) return rawUrl;
        const username = readStoredUsername();
        if (!username) return rawUrl;
        return buildTrophyRoomUserUrl(parsed, username);
    };
})();
const LEAGUE_CONNECTED_PAGES = new Set(['rosters', 'ownership', 'leaguehub']);
const LEAGUE_USERNAME_GATE_COPY = Object.freeze({
    rosters: {
        eyebrow: 'ROSTER ACCESS',
        title: 'Connect your Sleeper username',
        description: 'Drop in your Sleeper handle to open roster boards, matchup context, trade tools, and player cards right from this page.',
        buttonLabel: 'Open Rosters',
        loadingEyebrow: 'SYNCING ROSTERS',
        loadingTitle: 'Building your roster lounge',
        loadingDescription: 'Finding your dynasty leagues, valuations, and weekly context.'
    },
    ownership: {
        eyebrow: 'OWNERSHIP ACCESS',
        title: 'Connect your Sleeper username',
        description: 'Load your player exposures, ownership percentages, and cross-league value footprint from one polished dashboard.',
        buttonLabel: 'Open Ownership',
        loadingEyebrow: 'MAPPING EXPOSURES',
        loadingTitle: 'Preparing your ownership view',
        loadingDescription: 'Gathering league data and assembling your exposure dashboard.'
    },
    leaguehub: {
        eyebrow: 'LEAGUEHUB ACCESS',
        title: 'Connect your Sleeper username',
        description: 'Unlock the LeagueHub analyzer for lineup value, production, standings context, and league-wide leaderboards.',
        buttonLabel: 'Open LeagueHub',
        loadingEyebrow: 'ANALYZING LEAGUES',
        loadingTitle: 'Powering up LeagueHub',
        loadingDescription: 'Connecting to Sleeper and building the league-wide analysis board.'
    }
});
let leagueUsernameGateRoot = null;
let leagueUsernameGateForm = null;
let leagueUsernameGateInputEl = null;
let leagueUsernameGateErrorEl = null;
let leagueUsernameGateEyebrowEl = null;
let leagueUsernameGateTitleEl = null;
let leagueUsernameGateDescriptionEl = null;
let leagueUsernameGateButtonLabelEl = null;
let leagueUsernameGateLoadingEyebrowEl = null;
let leagueUsernameGateLoadingTitleEl = null;
let leagueUsernameGateLoadingDescriptionEl = null;
let leagueUsernameGateMoreToggleEl = null;
let leagueUsernameGateMoreMenuEl = null;
let leagueUsernameGateBackEl = null;
let initialPageDataLoadPromise = null;
function normalizeLeagueUsername(value) {
    return String(value || '').trim().toLowerCase();
}
function readPreferredHeaderUsername() {
    const inputValue = normalizeLeagueUsername(usernameInput?.value);
    if (inputValue) return inputValue;
    try {
        return normalizeLeagueUsername(localStorage.getItem(HEADER_USERNAME_STORAGE_KEY));
    } catch (error) {
        return '';
    }
}
function syncHeaderUsernameValue(nextUsername) {
    const normalizedUsername = normalizeLeagueUsername(nextUsername);
    if (usernameInput) {
        usernameInput.value = normalizedUsername;
    }
    try {
        if (normalizedUsername) localStorage.setItem(HEADER_USERNAME_STORAGE_KEY, normalizedUsername);
        else localStorage.removeItem(HEADER_USERNAME_STORAGE_KEY);
    } catch (error) { }
    return normalizedUsername;
}
function usesLeagueUsernameGate(page = pageType) {
    return LEAGUE_CONNECTED_PAGES.has(page);
}
function getLeagueUsernameGateCopy(page = pageType) {
    return LEAGUE_USERNAME_GATE_COPY[page] || LEAGUE_USERNAME_GATE_COPY.rosters;
}
function getLeagueUsernameGateErrorMessage(error) {
    const rawMessage = String(error?.message || '').trim();
    const normalizedMessage = rawMessage.toLowerCase();
    if (normalizedMessage.includes('not found')) {
        return 'That Sleeper username was not found. Double-check the spelling and try again.';
    }
    if (normalizedMessage.includes('no active dynasty leagues')) {
        return 'We found the username, but there are no active dynasty leagues available right now.';
    }
    if (normalizedMessage.includes('request failed') || normalizedMessage.includes('network')) {
        return 'Dynasty Hub could not reach Sleeper right now. Please give it another shot in a moment.';
    }
    return 'We could not finish connecting that username. Please try again.';
}
function ensureLeagueUsernameGate() {
    if (!usesLeagueUsernameGate(pageType)) return null;
    if (leagueUsernameGateRoot) return leagueUsernameGateRoot;

    // League-connected username gate:
    // injected once per gated page so Rosters, Ownership, and LeagueHub can share
    // the same high-end username prompt without duplicating markup in each HTML file.
    // The overlay now includes its own top navigation bar so users can move through
    // the shared app shell without dropping behind the gate first.
    document.body.insertAdjacentHTML('beforeend', `
        <div id="leagueUsernameGate" class="league-username-gate" aria-hidden="true" hidden>
            <div class="league-username-gate__backdrop" aria-hidden="true"></div>
            <div class="league-username-gate__layout">
                <header class="league-username-gate__nav-shell" aria-label="Dynasty Hub navigation">
                    <div class="league-username-gate__nav-bar">
                        <nav class="league-username-gate__nav-grid" aria-label="Primary navigation">
                            <button class="nav-button league-username-gate__nav-button" type="button" data-gate-nav="home">
                                <img src="../assets/logos/App_Logo_icon256.png" alt="Dynasty Hub" class="nav-logo" aria-hidden="true" />
                                <span class="nav-label">Home</span>
                            </button>
                            <button class="nav-button league-username-gate__nav-button" type="button" data-gate-nav="rosters">
                                <i class="fa-solid fa-clipboard-list" aria-hidden="true"></i>
                                <span class="nav-label">Rosters</span>
                            </button>
                            <button class="nav-button league-username-gate__nav-button" type="button" data-gate-nav="datahub">
                                <i class="fa-solid fa-chart-column" aria-hidden="true"></i>
                                <span class="nav-label">DataHub</span>
                            </button>
                            <button class="nav-button league-username-gate__nav-button" type="button" data-gate-nav="leaguehub">
                                <i class="fa-solid fa-square-poll-vertical" aria-hidden="true"></i>
                                <span class="nav-label">LeagueHub</span>
                            </button>
                            <button class="nav-button league-username-gate__nav-button" type="button" data-gate-nav="research">
                                <i class="fa-solid fa-flask" aria-hidden="true"></i>
                                <span class="nav-label">Research</span>
                            </button>
                            <div class="league-username-gate__more">
                                <button
                                    class="nav-button league-username-gate__nav-button league-username-gate__more-toggle"
                                    type="button"
                                    data-gate-more-toggle
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    aria-controls="leagueUsernameGateMoreMenu"
                                >
                                    <i class="fa-solid fa-toolbox" aria-hidden="true"></i>
                                    <span class="nav-label">More</span>
                                    <i class="fa-solid fa-caret-down league-username-gate__more-caret" aria-hidden="true"></i>
                                </button>
                                <div id="leagueUsernameGateMoreMenu" class="league-username-gate__more-menu hidden" role="menu" aria-hidden="true" data-gate-more-menu>
                                    <button class="league-username-gate__more-item" type="button" data-gate-menu-nav="ownership" role="menuitem">
                                        <i class="fa-solid fa-percent" aria-hidden="true"></i>
                                        <span class="nav-label">Ownership</span>
                                    </button>
                                    <button class="league-username-gate__more-item" type="button" data-gate-menu-url="https://trophyroom.dynastyhub.pro/" role="menuitem">
                                        <i class="fa-solid fa-trophy" aria-hidden="true"></i>
                                        <span class="nav-label">Trophy Room</span>
                                    </button>
                                    <button class="league-username-gate__more-item" type="button" data-gate-menu-url="http://dynastyhub-matchups.netlify.app/" role="menuitem">
                                        <i class="fa-solid fa-table-columns" aria-hidden="true"></i>
                                        <span class="nav-label">Matchups</span>
                                    </button>
                                    <button class="league-username-gate__more-item" type="button" data-gate-menu-nav="contact" role="menuitem">
                                        <i class="fa-solid fa-envelope" aria-hidden="true"></i>
                                        <span class="nav-label">Contact</span>
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                <div class="league-username-gate__dialog" role="dialog" aria-modal="true" aria-labelledby="leagueUsernameGateTitle">
                    <div class="league-username-gate__card">
                        <span class="league-username-gate__beam" aria-hidden="true"></span>
                        <div class="league-username-gate__panel league-username-gate__panel--form">
                            <div class="league-username-gate__badge">
                                <span class="league-username-gate__badge-dot" aria-hidden="true"></span>
                                <span id="leagueUsernameGateEyebrow"></span>
                            </div>
                            <h2 id="leagueUsernameGateTitle" class="league-username-gate__title"></h2>
                            <p id="leagueUsernameGateDescription" class="league-username-gate__description"></p>
                            <form id="leagueUsernameGateForm" class="league-username-gate__form">
                                <label class="sr-only" for="leagueUsernameGateInput">Sleeper username</label>
                                <div class="league-username-gate__input-stack">
                                    <div class="league-username-gate__input-shell">
                                        <span class="league-username-gate__input-edge" aria-hidden="true"></span>
                                        <span class="league-username-gate__input-haze" aria-hidden="true"></span>
                                        <svg class="league-username-gate__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <input id="leagueUsernameGateInput" type="text" inputmode="text" autocapitalize="none" autocomplete="username" autocorrect="off" spellcheck="false" placeholder="Enter Sleeper username" />
                                        <button id="leagueUsernameGateSubmit" class="league-username-gate__submit" type="submit">
                                            <span id="leagueUsernameGateButtonLabel" class="league-username-gate__submit-label"></span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <p class="league-username-gate__hint">No password needed — just your public Sleeper username.</p>
                                    <p id="leagueUsernameGateError" class="league-username-gate__error" aria-live="polite" hidden></p>
                                </div>
                            </form>
                            <!-- LeagueHub returning-session action:
                                 appears only when Change user opened the gate, so
                                 first-time visitors still have to connect a user. -->
                            <button id="leagueUsernameGateBack" class="league-username-gate__back-action" type="button" data-gate-back hidden>
                                <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                                <span>Go back</span>
                            </button>
                        </div>
                        <div class="league-username-gate__panel league-username-gate__panel--loading" hidden aria-live="polite">
                            <div class="league-username-gate__loader" aria-hidden="true">
                                <span class="league-username-gate__loader-ring"></span>
                                <span class="league-username-gate__loader-core"></span>
                            </div>
                            <div class="league-username-gate__badge league-username-gate__badge--loading">
                                <span class="league-username-gate__badge-dot" aria-hidden="true"></span>
                                <span id="leagueUsernameGateLoadingEyebrow"></span>
                            </div>
                            <h2 id="leagueUsernameGateLoadingTitle" class="league-username-gate__title league-username-gate__title--loading"></h2>
                            <p id="leagueUsernameGateLoadingDescription" class="league-username-gate__description league-username-gate__description--loading"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    leagueUsernameGateRoot = document.getElementById('leagueUsernameGate');
    leagueUsernameGateForm = document.getElementById('leagueUsernameGateForm');
    leagueUsernameGateInputEl = document.getElementById('leagueUsernameGateInput');
    leagueUsernameGateErrorEl = document.getElementById('leagueUsernameGateError');
    leagueUsernameGateEyebrowEl = document.getElementById('leagueUsernameGateEyebrow');
    leagueUsernameGateTitleEl = document.getElementById('leagueUsernameGateTitle');
    leagueUsernameGateDescriptionEl = document.getElementById('leagueUsernameGateDescription');
    leagueUsernameGateButtonLabelEl = document.getElementById('leagueUsernameGateButtonLabel');
    leagueUsernameGateLoadingEyebrowEl = document.getElementById('leagueUsernameGateLoadingEyebrow');
    leagueUsernameGateLoadingTitleEl = document.getElementById('leagueUsernameGateLoadingTitle');
    leagueUsernameGateLoadingDescriptionEl = document.getElementById('leagueUsernameGateLoadingDescription');
    leagueUsernameGateMoreToggleEl = leagueUsernameGateRoot?.querySelector('[data-gate-more-toggle]') || null;
    leagueUsernameGateMoreMenuEl = document.getElementById('leagueUsernameGateMoreMenu');
    leagueUsernameGateBackEl = document.getElementById('leagueUsernameGateBack');

    leagueUsernameGateForm?.addEventListener('submit', handleLeagueUsernameGateSubmit);
    leagueUsernameGateRoot?.addEventListener('click', handleLeagueUsernameGateClick);
    leagueUsernameGateRoot?.addEventListener('keydown', handleLeagueUsernameGateKeydown);

    if (typeof window !== 'undefined') {
        window.__dhUsernameGate = {
            show: showLeagueUsernameGate,
            hide: hideLeagueUsernameGate,
            setLoading: setLeagueUsernameGateLoading,
            isSubmitting: () => leagueUsernameGateRoot?.dataset.submitting === 'true'
        };
    }

    return leagueUsernameGateRoot;
}
function closeLeagueUsernameGateMoreMenu() {
    if (!leagueUsernameGateMoreToggleEl || !leagueUsernameGateMoreMenuEl) return;
    leagueUsernameGateMoreToggleEl.setAttribute('aria-expanded', 'false');
    leagueUsernameGateMoreMenuEl.classList.add('hidden');
    leagueUsernameGateMoreMenuEl.setAttribute('aria-hidden', 'true');
}
function toggleLeagueUsernameGateMoreMenu(forceExpanded) {
    if (!leagueUsernameGateMoreToggleEl || !leagueUsernameGateMoreMenuEl) return;
    const shouldExpand = typeof forceExpanded === 'boolean'
        ? forceExpanded
        : leagueUsernameGateMoreToggleEl.getAttribute('aria-expanded') !== 'true';
    leagueUsernameGateMoreToggleEl.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
    leagueUsernameGateMoreMenuEl.classList.toggle('hidden', !shouldExpand);
    leagueUsernameGateMoreMenuEl.setAttribute('aria-hidden', shouldExpand ? 'false' : 'true');
}
function syncLeagueUsernameGateNavState(activePage = pageType) {
    if (!leagueUsernameGateRoot) return;
    const normalizedPage = String(activePage || '').trim().toLowerCase();

    // Overlay navigation state:
    // highlights the current gated page in the top bar, and uses the More button
    // as the visible active state whenever Ownership is the current destination.
    leagueUsernameGateRoot.querySelectorAll('[data-gate-nav]').forEach((button) => {
        const isActive = normalizedPage !== 'ownership' && button.dataset.gateNav === normalizedPage;
        button.classList.toggle('active', isActive);
        if (isActive) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });

    const isMoreActive = normalizedPage === 'ownership';
    if (leagueUsernameGateMoreToggleEl) {
        leagueUsernameGateMoreToggleEl.classList.toggle('active', isMoreActive);
        if (isMoreActive) leagueUsernameGateMoreToggleEl.setAttribute('aria-current', 'page');
        else leagueUsernameGateMoreToggleEl.removeAttribute('aria-current');
    }

    leagueUsernameGateRoot.querySelectorAll('[data-gate-menu-nav]').forEach((button) => {
        const isActive = button.dataset.gateMenuNav === normalizedPage;
        button.classList.toggle('is-active', isActive);
        if (isActive) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
}
async function navigateFromLeagueUsernameGate(target) {
    const page = target?.dataset?.gateNav || target?.dataset?.gateMenuNav || '';
    const url = target?.dataset?.gateUrl || target?.dataset?.gateMenuUrl || '';

    try {
        suppressFocusTemporary();
        leagueUsernameGateInputEl?.blur();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
    } catch (error) { }

    closeLeagueUsernameGateMoreMenu();

    if (url) {
        const destination = typeof window.__dhBuildExternalUrl === 'function'
            ? window.__dhBuildExternalUrl(url)
            : url;
        window.location.href = destination;
        return;
    }

    if (page) {
        await ensureNavigate(page);
    }
}
function handleLeagueUsernameGateClick(event) {
    const backAction = event.target.closest('[data-gate-back]');
    if (backAction && leagueUsernameGateRoot?.contains(backAction)) {
        event.preventDefault();
        event.stopPropagation();
        void returnFromLeagueUsernameGate();
        return;
    }

    const moreToggle = event.target.closest('[data-gate-more-toggle]');
    if (moreToggle && leagueUsernameGateRoot?.contains(moreToggle)) {
        event.preventDefault();
        event.stopPropagation();
        toggleLeagueUsernameGateMoreMenu();
        return;
    }

    const moreAction = event.target.closest('[data-gate-menu-nav], [data-gate-menu-url]');
    if (moreAction && leagueUsernameGateRoot?.contains(moreAction)) {
        event.preventDefault();
        event.stopPropagation();
        void navigateFromLeagueUsernameGate(moreAction);
        return;
    }

    const navAction = event.target.closest('[data-gate-nav]');
    if (navAction && leagueUsernameGateRoot?.contains(navAction)) {
        event.preventDefault();
        event.stopPropagation();
        void navigateFromLeagueUsernameGate(navAction);
        return;
    }

    if (!event.target.closest('.league-username-gate__more')) {
        closeLeagueUsernameGateMoreMenu();
    }
}
async function returnFromLeagueUsernameGate() {
    if (!leagueUsernameGateRoot || leagueUsernameGateRoot.dataset.allowReturn !== 'true') return;
    if (leagueUsernameGateRoot.dataset.submitting === 'true') return;

    // LeagueHub gate return behavior:
    // asks the page-local bridge to restore the already-loaded account context
    // before dismissing the overlay, preserving the prior active user and league.
    const leagueHubBridge = window.__dhLeagueHubBridge;
    if (pageType === 'leaguehub' && typeof leagueHubBridge?.cancelUsernameChange === 'function') {
        const wasRestored = await leagueHubBridge.cancelUsernameChange();
        if (wasRestored === false) return;
    }
    hideLeagueUsernameGate();
}
function handleLeagueUsernameGateKeydown(event) {
    if (event.key !== 'Escape') return;
    if (leagueUsernameGateMoreMenuEl && !leagueUsernameGateMoreMenuEl.classList.contains('hidden')) {
        event.preventDefault();
        closeLeagueUsernameGateMoreMenu();
        try {
            leagueUsernameGateMoreToggleEl?.focus();
        } catch (error) { }
        return;
    }
    if (leagueUsernameGateRoot?.dataset.allowReturn === 'true') {
        event.preventDefault();
        void returnFromLeagueUsernameGate();
    }
}
function initializeLeagueUsernameGate() {
    if (!usesLeagueUsernameGate(pageType)) return;
    ensureLeagueUsernameGate();
}
function loadInitialPageBootstrapData() {
    if (initialPageDataLoadPromise) return initialPageDataLoadPromise;

    // Shared gated-page bootstrap:
    // cache one preload pass so no-username arrivals can open the prompt immediately,
    // then reuse the same player/value data after the username is submitted.
    const loaders = (pageType === 'stats' || pageType === 'rosters')
        ? [fetchSleeperPlayers(), fetchDataFromGoogleSheet()]
        : [fetchSleeperPlayers(), fetchDataFromGoogleSheet(), fetchPlayerStatsSheets()];

    initialPageDataLoadPromise = Promise.all(loaders).catch((error) => {
        initialPageDataLoadPromise = null;
        throw error;
    });

    return initialPageDataLoadPromise;
}
function setLeagueUsernameGateLoading(isLoading, message = '') {
    const gate = ensureLeagueUsernameGate();
    if (!gate) return;

    const activePage = gate.dataset.page || pageType;
    const copy = getLeagueUsernameGateCopy(activePage);

    gate.dataset.submitting = isLoading ? 'true' : 'false';
    gate.classList.toggle('is-loading', Boolean(isLoading));

    if (leagueUsernameGateLoadingDescriptionEl) {
        leagueUsernameGateLoadingDescriptionEl.textContent = message || copy.loadingDescription;
    }

    if (!isLoading) {
        leagueUsernameGateRoot.classList.remove('has-error');
        if (leagueUsernameGateErrorEl) {
            leagueUsernameGateErrorEl.hidden = true;
            leagueUsernameGateErrorEl.textContent = '';
        }
    }
}
function showLeagueUsernameGate(options = {}) {
    const gate = ensureLeagueUsernameGate();
    if (!gate) return;

    const wasOpen = gate.classList.contains('is-open');
    const activePage = usesLeagueUsernameGate(options.page) ? options.page : (gate.dataset.page || pageType);
    const copy = getLeagueUsernameGateCopy(activePage);
    const presetUsername = normalizeLeagueUsername(options.username || readPreferredHeaderUsername());
    const allowReturn = typeof options.allowReturn === 'boolean'
        ? options.allowReturn
        : wasOpen && gate.dataset.allowReturn === 'true';

    gate.dataset.page = activePage;
    gate.dataset.allowReturn = allowReturn ? 'true' : 'false';
    gate.hidden = false;
    gate.setAttribute('aria-hidden', 'false');
    gate.classList.add('is-open');
    document.body.classList.add('league-gate-active');
    syncLeagueUsernameGateNavState(activePage);
    closeLeagueUsernameGateMoreMenu();

    leagueUsernameGateEyebrowEl.textContent = copy.eyebrow;
    leagueUsernameGateTitleEl.textContent = copy.title;
    leagueUsernameGateDescriptionEl.textContent = copy.description;
    leagueUsernameGateButtonLabelEl.textContent = copy.buttonLabel;
    leagueUsernameGateLoadingEyebrowEl.textContent = copy.loadingEyebrow;
    leagueUsernameGateLoadingTitleEl.textContent = copy.loadingTitle;
    leagueUsernameGateLoadingDescriptionEl.textContent = copy.loadingDescription;
    if (leagueUsernameGateInputEl) {
        leagueUsernameGateInputEl.value = presetUsername;
    }
    if (leagueUsernameGateBackEl) {
        const returnUsername = normalizeLeagueUsername(options.returnUsername || gate.dataset.returnUsername);
        gate.dataset.returnUsername = allowReturn ? returnUsername : '';
        leagueUsernameGateBackEl.hidden = !allowReturn;
        const label = leagueUsernameGateBackEl.querySelector('span');
        if (label) label.textContent = returnUsername ? `Go back to @${returnUsername}` : 'Go back';
    }

    setLeagueUsernameGateLoading(false, copy.loadingDescription);

    const errorMessage = typeof options.errorMessage === 'string' ? options.errorMessage.trim() : '';
    gate.classList.toggle('has-error', Boolean(errorMessage));
    if (leagueUsernameGateErrorEl) {
        leagueUsernameGateErrorEl.hidden = !errorMessage;
        leagueUsernameGateErrorEl.textContent = errorMessage;
    }

    if (options.focusInput !== false) {
        window.setTimeout(() => {
            try {
                leagueUsernameGateInputEl?.focus();
                leagueUsernameGateInputEl?.select();
            } catch (error) { }
        }, 70);
    }
}
function hideLeagueUsernameGate() {
    if (!leagueUsernameGateRoot) return;
    document.body.classList.remove('league-gate-active');
    leagueUsernameGateRoot.classList.remove('is-open', 'is-loading', 'has-error');
    leagueUsernameGateRoot.dataset.submitting = 'false';
    leagueUsernameGateRoot.dataset.allowReturn = 'false';
    leagueUsernameGateRoot.dataset.returnUsername = '';
    if (leagueUsernameGateBackEl) leagueUsernameGateBackEl.hidden = true;
    leagueUsernameGateRoot.setAttribute('aria-hidden', 'true');
    closeLeagueUsernameGateMoreMenu();
    window.setTimeout(() => {
        if (leagueUsernameGateRoot && !leagueUsernameGateRoot.classList.contains('is-open')) {
            leagueUsernameGateRoot.hidden = true;
        }
    }, 180);
}
async function handleLeagueUsernameGateSubmit(event) {
    event.preventDefault();
    const gate = ensureLeagueUsernameGate();
    if (!gate) return;

    const activePage = gate.dataset.page || pageType;
    const normalizedUsername = syncHeaderUsernameValue(leagueUsernameGateInputEl?.value);

    if (!normalizedUsername) {
        showLeagueUsernameGate({
            page: activePage,
            username: '',
            errorMessage: 'Enter your Sleeper username to continue.'
        });
        return;
    }

    const copy = getLeagueUsernameGateCopy(activePage);
    setLeagueUsernameGateLoading(true, copy.loadingDescription);

    let wasSuccessful = false;
    if (activePage === 'leaguehub') {
        const leagueHubBridge = window.__dhLeagueHubBridge;
        const targetLeagueId = new URLSearchParams(window.location.search).get('leagueId') || '';
        if (!leagueHubBridge || typeof leagueHubBridge.submitUsername !== 'function') {
            showLeagueUsernameGate({
                page: activePage,
                username: normalizedUsername,
                errorMessage: 'LeagueHub is still warming up. Please try again.'
            });
            return;
        }
        wasSuccessful = await leagueHubBridge.submitUsername({ username: normalizedUsername, leagueId: targetLeagueId });
    } else if (activePage === 'ownership') {
        wasSuccessful = await handleFetchOwnership();
    } else {
        wasSuccessful = await handleFetchRosters();
    }

    if (wasSuccessful) {
        hideLeagueUsernameGate();
        return;
    }

    if (leagueUsernameGateErrorEl?.hidden) {
        showLeagueUsernameGate({
            page: activePage,
            username: normalizedUsername,
            errorMessage: 'We could not finish connecting that username. Please try again.'
        });
    }
}
if (usesLeagueUsernameGate(pageType)) {
    initializeLeagueUsernameGate();
}
(function installFocusGuard() {
    try {
        const originalFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (...args) {
            try {
                const now = Date.now();
                if (now < __suppressFocusUntil) {
                    const tag = (this && this.tagName) ? this.tagName.toUpperCase() : '';
                    const isInputLike = tag === 'INPUT' || tag === 'TEXTAREA' || this.isContentEditable;
                    if (isInputLike) {
                        // swallow the focus call during suppression window
                        return this;
                    }
                }
            } catch (e) {
                // fall through to original focus if anything unexpected
            }
            return originalFocus.apply(this, args);
        };
    } catch (e) { }
})();
// Enable by adding ?debugFocus=1 to the URL.
(function installFocusLogger() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('debugFocus')) return;
        if (params.get('debugFocus') !== '1') return;
        window._focusLog = window._focusLog || [];
        const maxEntries = 200;
        const pushLog = (entry) => {
            window._focusLog.push(entry);
            if (window._focusLog.length > maxEntries) window._focusLog.shift();
        };
        document.addEventListener('focusin', (e) => {
            try {
                const el = e.target;
                const now = Date.now();
                const tag = el && el.tagName ? el.tagName.toLowerCase() : 'unknown';
                const name = el && (el.id || el.name || el.className) ? (el.id || el.name || el.className) : '';
                const stack = (new Error()).stack || '';
                const msg = `[focusin] ${new Date(now).toISOString()} ${tag} ${name}`;
                pushLog({ t: now, msg, tag, name, stack });
            } catch (err) { }
        });
    } catch (e) { }
})();
// re-enable temporary suppression and blur any active input to avoid the keyboard.
try {
    window.addEventListener('pageshow', () => {
        try { suppressFocusTemporary(800); } catch (e) { }
        try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            try { suppressFocusTemporary(800); } catch (e) { }
            try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
        }
    });
    // As a final safety-net, intercept focusin events and blur input-like
    // elements while suppression is active. This will catch focus that
    // originates from browser heuristics or other scripts.
    document.addEventListener('focusin', (e) => {
        try {
            if (Date.now() < __suppressFocusUntil) {
                const el = e.target;
                const tag = el && el.tagName ? el.tagName.toUpperCase() : '';
                const isInputLike = tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
                if (isInputLike) {
                    try { el.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
                }
            }
        } catch (e) { }
    }, true);
} catch (e) { }
const getPageUrl = (page) => {
    const username = readPreferredHeaderUsername();
    let url = '';
    const base = pageType === 'welcome' ? '' : '../';
    switch (page) {
        case 'home':
            url = pageType === 'welcome' ? '#' : `${base}index.html`;
            break;
        case 'rosters':
            url = `${base}rosters/rosters.html`;
            break;
        case 'ownership':
            url = `${base}ownership/ownership.html`;
            break;
        case 'stats':
            url = `${base}stats/stats.html`;
            break;
        // DataHub page routing: match the other folder-scoped pages by sending
        // navigation to the single lowercase DataHub HTML entrypoint.
        case 'datahub':
            url = `${base}datahub/datahub.html`;
            break;
        case 'leaguehub':
            url = `${base}leaguehub/leaguehub.html`;
            break;
        case 'research':
            url = `${base}research/research.html`;
            break;
        case 'contact':
            url = `${base}contact/contact.html`;
            break;
    }
    // DataHub is a standalone page bundle and does not need the welcome-page
    // username query string, so keep its URL clean like a plain static page path.
    if (username && page !== 'home' && page !== 'datahub') {
        url += `?username=${encodeURIComponent(username)}`;
        if (page === 'rosters' || page === 'leaguehub' || page === 'stats') {
            const selected = leagueSelect?.value;
            if (selected && selected !== 'Select a league...') {
                url += `&leagueId=${selected}`;
            } else if (state.currentLeagueId) {
                url += `&leagueId=${state.currentLeagueId}`;
            }
        }
    }
    return url;
};
// Ensure the username is valid for pages that require it.
async function ensureValidUser(username) {
    if (!username || !username.trim()) {
        throw new Error('Please enter a username');
    }
    try {
        await fetchAndSetUser(username.trim());
        return true;
    } catch (e) {
        throw e;
    }
}
// Helper wrapper to validate username for non-home pages and navigate.
async function ensureNavigate(page) {
    window.location.href = getPageUrl(page);
}
homeButton?.addEventListener('click', async () => {
    // Defensive blur to avoid mobile keyboards appearing when nav buttons are tapped
    try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    await ensureNavigate('home');
});
rostersButton?.addEventListener('click', async () => {
    try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    await ensureNavigate('rosters');
});
// Shared middle nav button: some pages still use this slot for Stats, while
// rosters/ownership/leaguehub/research now point the same control at DataHub.
// Read the target from markup so each page shell can decide the destination.
statsButton?.addEventListener('click', async () => {
    try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    await ensureNavigate(statsButton.dataset.nav || 'stats');
});
leagueHubButton?.addEventListener('click', async () => {
    try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    await ensureNavigate('leaguehub');
});
researchButton?.addEventListener('click', async () => {
    try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
    await ensureNavigate('research');
});
// Add pointer/touch guards so quick taps on mobile also blur the input before navigation fires
['homeButton', 'rostersButton', 'statsButton', 'leagueHubButton', 'researchButton'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => { try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { } };
    try {
        el.addEventListener('pointerdown', handler, { passive: true });
        el.addEventListener('touchstart', handler, { passive: true });
    } catch (e) {
        // some older browsers may throw on options; fall back
        try { el.addEventListener('pointerdown', handler); el.addEventListener('touchstart', handler); } catch (e) { }
    }
});
// --- Home page menu wiring (only when on welcome page) ---
if (pageType === 'welcome') {
    // --- Mobile-only: move hamburger menu from header row into branding panel ---
    // On mobile (≤819px) the hamburger button moves to the right side of the
    // branding panel so the username input can stretch wider.  On desktop (≥820px)
    // it stays in the primary-header-row exactly as before.
    // The dropdown menu itself is portaled to <body> on mobile so it escapes
    // the branding panel's stacking context (backdrop-filter creates one in WebKit).
    const _homeMenuSlot = document.querySelector('.home-menu-slot');
    const _brandingRow = document.querySelector('.branding-top-row');
    const _primaryRow  = document.getElementById('primary-header-row');
    const _homeMenuEl  = document.getElementById('homeMenu');
    if (_homeMenuSlot && _brandingRow && _primaryRow) {
        const mobileMenuMQ = window.matchMedia('(max-width: 819px)');
        function _syncMenuSlotPosition(e) {
            if (e.matches) {
                // Mobile: move button slot to branding panel
                _brandingRow.appendChild(_homeMenuSlot);
                // Portal dropdown to <body> to escape the stacking context
                if (_homeMenuEl && _homeMenuEl.parentElement !== document.body) {
                    document.body.appendChild(_homeMenuEl);
                }
            } else {
                // Desktop: return button slot to header row
                _primaryRow.insertBefore(_homeMenuSlot, _primaryRow.firstChild);
                // Return dropdown to its slot for natural absolute positioning
                if (_homeMenuEl && _homeMenuEl.parentElement !== _homeMenuSlot) {
                    _homeMenuSlot.appendChild(_homeMenuEl);
                    // Clear any inline fixed-positioning left over from mobile
                    _homeMenuEl.style.position = '';
                    _homeMenuEl.style.left = '';
                    _homeMenuEl.style.top = '';
                    _homeMenuEl.style.right = '';
                    _homeMenuEl.style.bottom = '';
                }
            }
        }
        _syncMenuSlotPosition(mobileMenuMQ);          // initial placement
        mobileMenuMQ.addEventListener('change', _syncMenuSlotPosition); // resize
    }

    const homeMenuToggle = document.getElementById('homeMenuToggle');
    const homeMenu = document.getElementById('homeMenu');
    if (homeMenuToggle && homeMenu) {
        // Position the dropdown relative to the toggle button when portaled to <body>.
        // Uses position: fixed so that z-index applies at the top of the stacking order.
        function _positionHomeMenu() {
            if (homeMenu.parentElement !== document.body) return; // only when portaled
            const rect = homeMenuToggle.getBoundingClientRect();
            const gap = 4;
            const margin = 6;
            const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

            // Temporarily show for measurement
            const wasHidden = homeMenu.classList.contains('hidden');
            if (wasHidden) {
                homeMenu.classList.remove('hidden');
                homeMenu.style.visibility = 'hidden';
            }

            const menuWidth = homeMenu.offsetWidth || 0;
            // Align right edge of menu with right edge of button
            let left = rect.right - menuWidth;
            // Clamp to viewport edges
            left = Math.max(margin, Math.min(left, viewportWidth - margin - menuWidth));

            homeMenu.style.position = 'fixed';
            homeMenu.style.left   = Math.round(left) + 'px';
            homeMenu.style.top    = Math.round(rect.bottom + gap) + 'px';
            homeMenu.style.right  = 'auto';
            homeMenu.style.bottom = 'auto';

            if (wasHidden) {
                homeMenu.classList.add('hidden');
                homeMenu.style.visibility = '';
            }
        }

        homeMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = homeMenu.classList.contains('hidden');
            if (willOpen) {
                // Position before showing to prevent first-frame jump
                homeMenu.classList.remove('hidden');
                homeMenu.style.visibility = 'hidden';
                _positionHomeMenu();
                requestAnimationFrame(() => {
                    _positionHomeMenu();
                    homeMenu.style.visibility = '';
                });
                homeMenuToggle.setAttribute('aria-expanded', 'true');
                homeMenu.setAttribute('aria-hidden', 'false');
            } else {
                homeMenu.classList.add('hidden');
                homeMenuToggle.setAttribute('aria-expanded', 'false');
                homeMenu.setAttribute('aria-hidden', 'true');
            }
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!homeMenu.contains(e.target) && !homeMenuToggle.contains(e.target)) {
                if (!homeMenu.classList.contains('hidden')) {
                    homeMenu.classList.add('hidden');
                    homeMenuToggle.setAttribute('aria-expanded', 'false');
                    homeMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
        // Keep dropdown positioned on scroll/resize when open and portaled
        window.addEventListener('scroll', () => {
            if (!homeMenu.classList.contains('hidden')) _positionHomeMenu();
        }, { passive: true });
        window.addEventListener('resize', () => {
            if (!homeMenu.classList.contains('hidden')) _positionHomeMenu();
        });
        // Wire menu items
        homeMenu.querySelectorAll('.home-menu-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Welcome-menu direct-link entries (like DataHub and sister apps)
                // should use their own href/data-url navigation path instead of the
                // shared page mapper below.
                if (btn.dataset.url || btn.getAttribute('href')) {
                    return;
                }
                const page = btn.dataset.page;
                try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { }
                // reuse ensureNavigate to validate username where needed
                await ensureNavigate(page);
            });
        });
    }
}

// --- More Dropdown Navigation Logic (for all non-welcome pages) ---
if (pageType !== 'welcome') {
    const moreButton = document.getElementById('moreButton');
    const moreDropdown = document.getElementById('moreDropdown');

    if (moreButton && moreDropdown) {
        // IMPORTANT (Safari/WebKit): `position: fixed` can become relative to the nearest ancestor
        // that creates a containing block (commonly via `transform`, `filter`, or `backdrop-filter`).
        // Our headers use a glass effect (`backdrop-filter`), and on some desktop Safari builds this
        // causes the dropdown to render far away from the button even when the math is correct.
        // Portaling the menu to <body> ensures it is positioned against the viewport consistently.
        try {
            if (document.body && moreDropdown.parentElement !== document.body) {
                document.body.appendChild(moreDropdown);
            }
        } catch (e) {
            // Non-fatal: if portaling fails, positioning remains best-effort.
        }

        const positionMoreDropdown = () => {
            try {
                const rect = moreButton.getBoundingClientRect();
                const margin = 6;
                const gap = 2;

                const setCoords = (x, y) => {
                    moreDropdown.style.left = `${Math.round(x)}px`;
                    moreDropdown.style.top = `${Math.round(y)}px`;
                    // Defensive: ensure no other positioning axis overrides apply.
                    moreDropdown.style.right = 'auto';
                    moreDropdown.style.bottom = 'auto';
                };

                // Dropdown is `position: fixed` in CSS; we compute its coordinates here.
                // Temporarily ensure it has layout so offsetWidth is measurable.
                const wasHidden = moreDropdown.classList.contains('hidden');
                if (wasHidden) {
                    moreDropdown.classList.remove('hidden');
                    moreDropdown.style.visibility = 'hidden';
                }

                // Horizontal positioning
                // Center under the button, then clamp within the viewport.
                const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
                const belowY = rect.bottom + gap;

                // Ensure we have up-to-date menu metrics.
                let menuRect = moreDropdown.getBoundingClientRect();
                const menuWidth = menuRect.width || 0;

                // Compute a real left edge (does not rely on CSS translate/variables).
                let left = rect.left + (rect.width - menuWidth) / 2;
                if (menuWidth === 0) left = rect.left;
                if (!Number.isFinite(left)) left = rect.left;

                // Clamp to viewport margins when possible.
                const maxLeft = viewportWidth - margin - (menuWidth || 0);
                if (Number.isFinite(maxLeft)) {
                    left = Math.max(margin, Math.min(left, maxLeft));
                }

                // Keep any legacy var deterministic (even if unused by CSS in this build).
                moreDropdown.style.setProperty('--nav-more-tx', '0px');
                setCoords(left, belowY);

                // Re-measure after coords to ensure vertical overflow calculations are correct.
                menuRect = moreDropdown.getBoundingClientRect();

                // If it would overflow the viewport bottom, try placing it above (only if it fits).
                const menuHeight = menuRect.height || 0;
                if (belowY + menuHeight + margin > window.innerHeight) {
                    const aboveY = rect.top - gap - menuHeight;
                    if (aboveY >= margin) {
                        setCoords(x, aboveY);
                    }
                }

                if (wasHidden) {
                    // Keep it hidden until the click handler opens it for real.
                    moreDropdown.classList.add('hidden');
                    moreDropdown.style.visibility = '';
                }
            } catch (e) {
                // Non-fatal: positioning is best-effort.
            }
        };

        // Toggle dropdown on button click
        moreButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = moreDropdown.classList.contains('hidden');

            if (willOpen) {
                // Place before showing to prevent first-frame "jump".
                moreDropdown.classList.remove('hidden');
                moreDropdown.style.visibility = 'hidden';
                positionMoreDropdown();
                requestAnimationFrame(() => {
                    // Reposition after paint in case fonts/styles adjust sizing.
                    positionMoreDropdown();
                    moreDropdown.style.visibility = '';
                });
                moreButton.setAttribute('aria-expanded', 'true');
                moreDropdown.setAttribute('aria-hidden', 'false');
            } else {
                moreDropdown.classList.add('hidden');
                moreButton.setAttribute('aria-expanded', 'false');
                moreDropdown.setAttribute('aria-hidden', 'true');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!moreDropdown.contains(e.target) && !moreButton.contains(e.target)) {
                if (!moreDropdown.classList.contains('hidden')) {
                    moreDropdown.classList.add('hidden');
                    moreButton.setAttribute('aria-expanded', 'false');
                    moreDropdown.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Keep positioning correct on resize when open.
        window.addEventListener('resize', () => {
            if (!moreDropdown.classList.contains('hidden')) {
                positionMoreDropdown();
            }
        });

        // Keep positioning correct on scroll when open (sticky headers / iOS browser UI).
        window.addEventListener('scroll', () => {
            if (!moreDropdown.classList.contains('hidden')) {
                positionMoreDropdown();
            }
        }, { passive: true });

        // Wire dropdown menu items
        moreDropdown.querySelectorAll('.nav-more-item').forEach(btn => {
            if (btn.classList.contains('disabled')) return;
            btn.addEventListener('click', async (e) => {
                const page = btn.dataset.nav;
                const url = btn.dataset.url;
                try {
                    suppressFocusTemporary();
                    usernameInput?.blur();
                    if (document.activeElement && typeof document.activeElement.blur === 'function') {
                        document.activeElement.blur();
                    }
                } catch (err) { }

                // Close dropdown
                moreDropdown.classList.add('hidden');
                moreButton.setAttribute('aria-expanded', 'false');
                moreDropdown.setAttribute('aria-hidden', 'true');

                // External destinations (Matchups / Trophy Room)
                if (url) {
                    const destination = typeof window.__dhBuildExternalUrl === 'function'
                        ? window.__dhBuildExternalUrl(url)
                        : url;
                    window.location.href = destination;
                    return;
                }

                // Internal destinations (Ownership)
                if (page) {
                    await ensureNavigate(page);
                }
            });
        });
    }
}

// --- State ---
let state = { userId: null, leagues: [], players: {}, oneQbData: {}, sflxData: {}, currentLeagueId: null, isSuperflex: false, cache: {}, teamsToCompare: new Set(), isCompareMode: false, currentRosterView: 'positional', activePositions: new Set(), tradeBlock: {}, isTradeCollapsed: false, weeklyStats: {}, playerSeasonStats: {}, playerSeasonRanks: {}, playerWeeklyStats: {}, statsSheetsLoaded: false, seasonRankCache: null, isGameLogModalOpenFromComparison: false, liveWeeklyStats: {}, liveStatsLoaded: false, currentNflSeason: null, currentNflWeek: null, lastLiveStatsWeek: null, lastLiveStatsFetchTs: 0, calculatedRankCache: null, playerProjectionWeeks: {}, isStartSitMode: false, startSitSelections: [], startSitNextSide: 'left', startSitTeamName: null, startSitCompactPreview: false, leagueMatchupStats: {}, matchupDataLoaded: false, draftOrderBySeason: {}, isGameLogFromStatsPage: false, statsPagePlayerData: null, currentGameLogsPlayerRanks: null, currentGameLogsSummary: null, currentConsistencyData: null, currentGameLogsSeason: '2025', isGameLogsCareerPlaceholderActive: false, careerStatsByPlayer: null, ownershipMode: 'ownership', ownershipContext: null, ownershipRows: [], ownershipValueRows: [], ownershipListSearchTerm: '', ownershipValueSearchTerm: '', ownershipValuePositionFilter: 'ALL', ownershipPercentPositionFilter: 'ALL', ownershipPreferredKtcMode: 'sflx', ownershipValueSortColumn: null, ownershipValueSortDirection: null, watchlist: new Set(), watchlistLoaded: false };
// Tracks the in-flight ownership context request used by the Ownership tab inside
// the Game Logs modal so repeated tab taps do not fan out duplicate league loads.
let ownershipContextLoadPromise = null;
let ownershipContextLoadCacheKey = '';
let careerStatsLoadPromise = null;

// Expose state for dashboard/home reuse (sheet-only consumers)
if (typeof window !== 'undefined') {
    window.state = state;
}

// === Watchlist Persistence ===
// Stores watchlisted player IDs in localStorage keyed by Sleeper username.
// Format: dh_watchlist_<username> → JSON array of player ID strings.
function getWatchlistStorageKey() {
    const username = (typeof usernameInput?.value === 'string' ? usernameInput.value.trim() : '')
        || (typeof localStorage !== 'undefined' ? (localStorage.getItem('sleeper_username') || '').trim() : '');
    return username ? `dh_watchlist_${username.toLowerCase()}` : null;
}

/** Load watchlist from localStorage into state.watchlist */
function loadWatchlist() {
    state.watchlist.clear();
    state.watchlistLoaded = false;
    const key = getWatchlistStorageKey();
    if (!key) return;
    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                arr.forEach(pid => { if (pid) state.watchlist.add(String(pid)); });
            }
        }
    } catch (e) { /* corrupted data – start fresh */ }
    state.watchlistLoaded = true;
}

/** Persist current watchlist Set to localStorage */
function saveWatchlist() {
    const key = getWatchlistStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify([...state.watchlist]));
    } catch (e) { /* storage full or blocked – silent fail */ }
}

/** Add a player to the watchlist and persist */
function addToWatchlist(pid) {
    if (!pid) return;
    state.watchlist.add(String(pid));
    saveWatchlist();
    updateWatchlistBadge();
}

/** Remove a player from the watchlist and persist */
function removeFromWatchlist(pid) {
    if (!pid) return;
    state.watchlist.delete(String(pid));
    saveWatchlist();
    updateWatchlistBadge();
}

/** Check if a player is on the watchlist */
function isInWatchlist(pid) {
    return state.watchlist.has(String(pid));
}

/** Update the bottom-panel badge count and the modal header count */
function updateWatchlistBadge() {
    const count = state.watchlist.size;
    // Bottom-panel badge
    if (watchlistBadge) {
        watchlistBadge.textContent = count;
        watchlistBadge.classList.toggle('hidden', count === 0);
    }
    // Modal header count
    const modalCount = document.getElementById('watchlistCount');
    if (modalCount) {
        modalCount.textContent = `${count} player${count !== 1 ? 's' : ''}`;
    }
}

const assignedLeagueColors = new Map();
let nextColorIndex = 0;
const assignedRyColors = new Map();
let nextRyColorIndex = 0;
// --- Constants ---
const API_BASE = 'https://api.sleeper.app/v1';
const GOOGLE_SHEET_ID = '1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0';
const PLAYER_STATS_SHEET_ID = '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
// Expose for dashboard / shared loaders
if (typeof window !== 'undefined') {
    window.PLAYER_STATS_SHEET_ID = PLAYER_STATS_SHEET_ID;
}
const PLAYER_STATS_SHEETS = { season: 'SZN', seasonRanks: 'SZN_RKs', weeks: { 1: 'WK1', 2: 'WK2', 3: 'WK3', 4: 'WK4', 5: 'WK5', 6: 'WK6', 7: 'WK7', 8: 'WK8', 9: 'WK9', 10: 'WK10', 11: 'WK11', 12: 'WK12', 13: 'WK13', 14: 'WK14', 15: 'WK15', 16: 'WK16', 17: 'WK17', 18: 'WK18' } };
// === Player stats data source (Game Logs / weekly sheets) ===
// We now ship the 2025 season player stats as static CSVs in `DH_P2.53/data/NFL-2025_Stats/**`.
// IMPORTANT:
// - Default = CSVs (so we do NOT pull SZN / SZN_RKs / WK1..WK18 from Google Sheets anymore).
// - We intentionally keep the Google Sheets loader in-code for an easy switch next season.
//   To temporarily re-enable Sheets for player stats, use: `?playerStatsSource=sheets`
const PLAYER_STATS_CSV_PATHS = {
    season: 'data/NFL-2025_Stats/SZN.csv',
    seasonRanks: 'data/NFL-2025_Stats/SZN_RKs.csv',
    weeksDir: 'data/NFL-2025_Stats/Weeks'
};
// === Game Logs modal: Career Stats data source ===
// Rosters-only Career view uses the shipped multi-season CSV. Keep this block self-contained
// so the same table/data pattern can be ported later to another standalone page.
const CAREER_STATS_CSV_PATH = 'data/NFL16-25/NFL-PlayerData_16-25.csv';
const CAREER_STAT_GROUP_ICONS = {
    // Rosters Game Logs modal Career view:
    // stores self-contained column-group SVG markup so this table can be ported
    // without depending on DataHub-only script bundles.
    season: {
        color: '#888bff',
        markup: '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M15 19l2 2l4 -4" /></g>'
    },
    'fantasy-points': {
        color: '#dfc689',
        markup: '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" stroke="none" d="M19 19h-14c-.5 0 -.9 -.3 -1 -.8l-2 -10c0 -.4 .1 -.8 .5 -1.1c.4 -.2 .8 -.2 1.1 0l4.1 3.3l3.4 -5.1c.4 -.6 1.3 -.6 1.7 0l3.4 5.1l4.1 -3.3c.3 -.3 .8 -.3 1.1 0c.4 .2 .5 .6 .5 1.1l-2 10c0 .5 -.5 .8 -1 .8z" />'
    },
    'points-per-game': {
        color: '#dfc689',
        markup: '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4l4 -6" /></g>'
    },
    fantasy: {
        color: '#dfc689',
        markup: '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" stroke="none" d="M19 19h-14c-.5 0 -.9 -.3 -1 -.8l-2 -10c0 -.4 .1 -.8 .5 -1.1c.4 -.2 .8 -.2 1.1 0l4.1 3.3l3.4 -5.1c.4 -.6 1.3 -.6 1.7 0l3.4 5.1l4.1 -3.3c.3 -.3 .8 -.3 1.1 0c.4 .2 .5 .6 .5 1.1l-2 10c0 .5 -.5 .8 -1 .8z" />'
    },
    passing: {
        color: '#fd8787',
        markup: '<circle cx="12" cy="12" r="10" /><line x1="22" x2="18" y1="12" y2="12" /><line x1="6" x2="2" y1="12" y2="12" /><line x1="12" x2="12" y1="6" y2="2" /><line x1="12" x2="12" y1="22" y2="18" />'
    },
    rushing: {
        color: '#1cffd3',
        markup: '<path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" /><path d="M16 18h-5" /><path d="M18 5a1 1 0 0 0-1 1v5.573" /><path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" /><path d="M4 11V4" /><path d="M7 15h.01" /><path d="M8 10.1V4" /><circle cx="18" cy="18" r="2" /><circle cx="7" cy="15" r="5" />'
    },
    receiving: {
        color: '#4289ff',
        markup: '<g transform="rotate(-90 12 12)"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></g>'
    },
    total: {
        color: '#8454ff',
        markup: '<path d="M12 16v5" /><path d="M16 14v7" /><path d="M20 10v11" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18v3" /><path d="M8 14v7" />'
    }
};
const CAREER_STAT_SECTIONS_BY_POS = {
    QB: [
        { id: 'season', label: 'SEASON', tone: 'season', stats: ['SZN', 'TM', 'G'] },
        { id: 'fantasy', label: 'FANTASY', tone: 'fantasy', stats: ['FPTS', 'PPG'] },
        { id: 'passing', label: 'PASSING', tone: 'passing', stats: ['CMP', 'paATT', 'CMP%', 'paYDS', 'paTD', 'INT', 'paYPG'] },
        { id: 'rushing', label: 'RUSHING', tone: 'rushing', stats: ['CAR', 'ruYDS', 'YPC', 'ruTD', 'ruYPG'] },
        { id: 'total', label: 'TOTAL', tone: 'total', stats: ['ttlYDS', 'ttlTD'] }
    ],
    RB: [
        { id: 'season', label: 'SEASON', tone: 'season', stats: ['SZN', 'TM', 'G'] },
        { id: 'fantasy', label: 'FANTASY', tone: 'fantasy', stats: ['FPTS', 'PPG'] },
        { id: 'rushing', label: 'RUSHING', tone: 'rushing', stats: ['CAR', 'ruYDS', 'YPC', 'ruTD', 'ruYPG'] },
        { id: 'receiving', label: 'RECEIVING', tone: 'receiving', stats: ['TGT', 'REC', 'recYDS', 'YPR', 'recTD', 'recYPG'] },
        { id: 'total', label: 'TOTAL', tone: 'total', stats: ['ttlYDS', 'ttlTD'] }
    ],
    WR: [
        { id: 'season', label: 'SEASON', tone: 'season', stats: ['SZN', 'TM', 'G'] },
        { id: 'fantasy', label: 'FANTASY', tone: 'fantasy', stats: ['FPTS', 'PPG'] },
        { id: 'receiving', label: 'RECEIVING', tone: 'receiving', stats: ['TGT', 'REC', 'recYDS', 'YPR', 'recTD', 'recYPG'] },
        { id: 'rushing', label: 'RUSHING', tone: 'rushing', stats: ['CAR', 'ruYDS', 'YPC', 'ruTD', 'ruYPG'] },
        { id: 'total', label: 'TOTAL', tone: 'total', stats: ['ttlYDS', 'ttlTD'] }
    ]
};
CAREER_STAT_SECTIONS_BY_POS.TE = CAREER_STAT_SECTIONS_BY_POS.WR;
const PLAYER_STATS_SOURCE_QUERY_PARAM = 'playerStatsSource';
// UPDATE THIS: Total number of weeks to display in game logs (including unplayed weeks with projections)
const MAX_DISPLAY_WEEKS = 18;
const TAG_COLORS = { QB: "var(--pos-qb)", RB: "var(--pos-rb)", WR: "var(--pos-wr)", TE: "var(--pos-te)", BN: "var(--pos-bn)", TX: "var(--pos-tx)", FLX: "var(--pos-flx)", SFLX: "var(--pos-sflx)" };
const INJURY_DESIGNATION_COLORS = {
    'IR': '#d93d76',
    'SUS': '#d93d76',
    'BYE': '#C3A8FB',
    'Q': '#fd9a3dff',
    'D': '#e780c3ff',
    'PUP': '#D47DC6',
    'DNP': 'rgba(255, 174, 227, 0.47)',
    'OUT': '#D47DC6'
};
function parseInjuryDesignation(rawValue) {
    if (rawValue === undefined || rawValue === null) return null;
    const trimmed = String(rawValue).trim();
    if (!trimmed) return null;
    const upper = trimmed.toUpperCase();
    if (upper === 'NA' || upper === 'N/A' || upper === 'UNDEFINED' || upper === 'NULL') return null;
    const numericPattern = /^-?\d+(?:\.\d+)?$/;
    if (numericPattern.test(trimmed)) return null;
    let primaryToken = upper.split(/\s+/)[0]?.replace(/[^A-Z]/g, '') || '';
    if (!primaryToken) return null;
    // Normalize common full-text Sleeper injury strings to badge codes
    if (primaryToken.startsWith('QUESTION')) primaryToken = 'Q';
    else if (primaryToken.startsWith('DOUBT')) primaryToken = 'D';
    else if (primaryToken === 'OUT') primaryToken = 'OUT';
    else if (primaryToken.includes('IR')) primaryToken = 'IR';
    else if (primaryToken.startsWith('PUP')) primaryToken = 'PUP';
    else if (primaryToken.startsWith('DNP')) primaryToken = 'DNP';
    const color = INJURY_DESIGNATION_COLORS[primaryToken] || 'var(--color-text-secondary)';
    return { designation: primaryToken, color, raw: trimmed };
}
// Derive an injury designation from Sleeper player metadata (rosters page)
function getSleeperInjuryDesignation(playerId) {
    if (!playerId || !state.players) return null;
    const player = state.players[playerId];
    if (!player || !player.injury_status) return null;
    const parsed = parseInjuryDesignation(player.injury_status);
    if (!parsed) return null;
    return { designation: parsed.designation, color: parsed.color, week: null };
}
const STARTER_ORDER = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
const TEAM_COLORS = { ARI: "#97233F", ATL: "#A71930", BAL: "#241773", BUF: "#00338D", CAR: "#0085CA", CHI: "#1a2d4e", CIN: "#FB4F14", CLE: "#311D00", DAL: "#003594", DEN: "#FB4F14", DET: "#0076B6", GB: "#203731", HOU: "#03202F", IND: "#002C5F", JAX: "#006778", KC: "#E31837", LAC: "#0080C6", LAR: "#003594", LV: "#A5ACAF", MIA: "#008E97", MIN: "#4F2683", NE: "#002244", NO: "#D3BC8D", NYG: "#0B2265", NYJ: "#125740", PHI: "#004C54", PIT: "#FFB612", SEA: "#69BE28", SF: "#B3995D", TB: "#D50A0A", TEN: "#4B92DB", WAS: "#5A1414", FA: "#64748b" };
const LEAGUE_COLOR_PALETTE = [
    '#9a99f2',
    '#77b6fb',
    '#f2a8ff',
    '#a0f1da',
    '#96d7ff',
    '#c879ff',
    '#bbdbfe',
    '#8b79d9',
    '#63d4cc',
    '#eabaf6'
];
const RY_COLOR_PALETTE = ['#d7f2ff', '#cfe9ff', '#e0f6ea', '#fff1d6', '#efe2ff', '#ffe0ea', '#e4f0ff'];
const LEAGUE_ABBR_OVERRIDES = {
    "ff d-league": "DL",
    "the most important league": "TMIL",
    "big boofers club bbc": "BBC",
    "trade hoard eat league": "THE",
    "dynasty footballers": "DFB", "la leaguaaa dynasty est2024": "LLGA",
    "la leaugaaa dynasty est2024": "LLGA"
};
function getCurrentNflWeekNumber() {
    if (Number.isFinite(state.currentNflWeek)) return state.currentNflWeek;
    const liveWeeks = Object.keys(state.liveWeeklyStats || {}).map(Number).filter(Number.isFinite);
    const sheetWeeks = Object.keys(state.weeklyStats || {}).map(Number).filter(Number.isFinite);
    const projectionWeeks = state.playerProjectionWeeks || {};
    const nonProjectionSheetWeeks = sheetWeeks.filter(week => projectionWeeks[week] !== true);
    const allWeeks = [...liveWeeks, ...nonProjectionSheetWeeks];
    if (allWeeks.length === 0) return null;
    return Math.max(...allWeeks);
}
// --- Event Listeners ---
if (pageType === 'rosters') {
    leagueSelect?.addEventListener('change', (e) => {
        handleLeagueSelect(e);
        if (e && e.target && e.target.blur) e.target.blur();
    });
    rosterGrid?.addEventListener('click', handleTeamSelect);
    mainContent?.addEventListener('click', handleAssetClickForTrade);
    tradeSimulator.addEventListener('click', (e) => {
        const compareButton = e.target.closest('#comparePlayersButton');
        if (compareButton) {
            const isModalOpen = !playerComparisonModal.classList.contains('hidden');
            if (isModalOpen) {
                closeComparisonModal();
            } else {
                const selectedPlayers = state.isStartSitMode
                    ? state.startSitSelections
                    : Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
                const canCompare = state.isStartSitMode
                    ? selectedPlayers.length >= 2
                    : selectedPlayers.length === 2;
                if (!canCompare) {
                    showTemporaryTooltip(
                        compareButton,
                        state.isStartSitMode
                            ? 'Select at least 2 players to compare.'
                            : 'Please select exactly 2 players to compare.'
                    );
                    return;
                }
                handlePlayerCompare(e);
            }
        }
    });
    compareButton?.addEventListener('click', handleCompareClick);
    positionalViewBtn?.addEventListener('click', () => setRosterView('positional'));
    condensedViewBtn?.addEventListener('click', () => setRosterView('condensed'));
    lineupViewBtn?.addEventListener('click', () => setRosterView('lineup'));

    // View dropdown handlers (mobile)
    viewDropdownToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = viewDropdownToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeViewDropdown();
        } else {
            openViewDropdown();
        }
    });

    viewDropdownMenu?.addEventListener('click', (e) => {
        const option = e.target.closest('.view-dropdown-option');
        if (!option) return;
        const view = option.dataset.view;
        if (view) {
            setRosterView(view);
            closeViewDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!viewDropdownMenu || !viewDropdownToggle) return;
        if (viewDropdownMenu.classList.contains('hidden')) return;
        if (!viewDropdownMenu.contains(e.target) && !viewDropdownToggle.contains(e.target)) {
            closeViewDropdown();
        }
    });

    // Close dropdown on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewDropdownMenu && !viewDropdownMenu.classList.contains('hidden')) {
            closeViewDropdown();
        }
    });

    positionalFiltersContainer?.addEventListener('click', handlePositionFilter);
    clearFiltersButton?.addEventListener('click', handleClearFilters);
    startSitButton?.addEventListener('click', handleStartSitButtonClick);
    if (gameLogsModal) {
        // Use event delegation for close buttons (handles both game logs & ownership panes)
        gameLogsModal.addEventListener('click', (e) => {
            if (e.target.closest('.modal-close-btn')) {
                closeModal();
            }
        });
        modalOverlay.addEventListener('click', () => closeModal());

        // Rosters Game Logs modal season controls:
        // the dropdown replaces the old 2025/2026 buttons; Career is handled as
        // the rightmost option in the shared GL/SZN/Career switcher below.
        if (gameLogsSeasonToggle && gameLogsSeasonMenu) {
            gameLogsSeasonToggle.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleGameLogsSeasonMenu();
            });
            gameLogsSeasonMenu.addEventListener('click', (event) => {
                const option = event.target.closest('[data-gamelogs-season-value]');
                if (!option) return;
                setGameLogsSelectedSeason(option.dataset.gamelogsSeasonValue);
                closeGameLogsSeasonMenu();
            });
        }
        document.addEventListener('click', (event) => {
            if (!gameLogsSeasonDropdown || gameLogsSeasonMenu?.classList.contains('hidden')) return;
            if (!gameLogsSeasonDropdown.contains(event.target)) {
                closeGameLogsSeasonMenu();
            }
        });

        // GL/SZN/Career view switcher:
        // keeps all swappable modal table views in one segmented control.
        const viewSwitcher = gameLogsModal.querySelector('.gamelogs-view-switcher');
        if (viewSwitcher) {
            viewSwitcher.addEventListener('click', (e) => {
                const btn = e.target.closest('.gamelogs-view-option');
                if (!btn) return;
                const view = btn.dataset.gamelogsView;
                closeGameLogsSeasonMenu();
                setGameLogsModalView(view);
            });
        }

        // SZN scroll forwarding: allow vertical scrolling even when the gesture starts
        // slightly outside the scrollable stats area (e.g., on the header/nav row).
        const gameLogsModalContent = gameLogsModal.querySelector('.modal-content');
		if (gameLogsModalContent && modalBody) {
			gameLogsModalContent.addEventListener('wheel', (e) => {
				if (state.currentGameLogsView !== 'szn') return;
				// Never forward scroll while overlay tabs are open (Radar/Consistency/Key).
				if ((statsKeyContainer && !statsKeyContainer.classList.contains('hidden')) ||
					(radarChartContainer && !radarChartContainer.classList.contains('hidden')) ||
					(consistencyContainer && !consistencyContainer.classList.contains('hidden'))) {
					return;
				}
				const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
				if (!sznScroll) return;
				// Let native scrolling happen when the gesture starts inside the SZN scroller.
				if (sznScroll.contains(e.target)) return;
				const absX = Math.abs(e.deltaX || 0);
				const absY = Math.abs(e.deltaY || 0);
				if (absY <= absX) return;
				if (sznScroll.scrollHeight <= sznScroll.clientHeight) return;
				sznScroll.scrollTop += e.deltaY;
				e.preventDefault();
			}, { passive: false });

			let sznTouchScrollActive = false;
			let sznTouchLastY = 0;
			const endSznTouchScroll = () => {
				sznTouchScrollActive = false;
			};
			const canForwardSznTouchScroll = (touchTarget) => {
				if (state.currentGameLogsView !== 'szn') return false;
				if ((statsKeyContainer && !statsKeyContainer.classList.contains('hidden')) ||
					(radarChartContainer && !radarChartContainer.classList.contains('hidden')) ||
					(consistencyContainer && !consistencyContainer.classList.contains('hidden'))) {
					return false;
				}
				const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
				if (!sznScroll) return false;
				if (sznScroll.contains(touchTarget)) return false;
				if (sznScroll.scrollHeight <= sznScroll.clientHeight) return false;
				return true;
			};

			gameLogsModalContent.addEventListener('touchstart', (e) => {
				if (!canForwardSznTouchScroll(e.target)) return;
				if (!e.touches || e.touches.length !== 1) return;
				sznTouchScrollActive = true;
				sznTouchLastY = e.touches[0].clientY;
			}, { passive: true });

			gameLogsModalContent.addEventListener('touchmove', (e) => {
				if (!sznTouchScrollActive) return;
				if (!e.touches || e.touches.length !== 1) return endSznTouchScroll();
				const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
				if (!sznScroll) return endSznTouchScroll();
				const y = e.touches[0].clientY;
				const dy = sznTouchLastY - y;
				sznTouchLastY = y;
				sznScroll.scrollTop += dy;
				e.preventDefault();
			}, { passive: false });

            gameLogsModalContent.addEventListener('touchend', endSznTouchScroll, { passive: true });
            gameLogsModalContent.addEventListener('touchcancel', endSznTouchScroll, { passive: true });
        }

        // Panel toggle buttons with tab-like behavior
        modalInfoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPanel = btn.getAttribute('data-panel');
                const overlayContainers = {
                    'stats-key': statsKeyContainer,
                    'radar-chart': radarChartContainer,
                    'consistency': consistencyContainer
                };

                if (state.currentGameLogsView === 'career') {
                    // Rosters Game Logs modal footer:
                    // footer panels should behave like the GameLog table is selected,
                    // so exit Career before opening or toggling any footer panel.
                    setGameLogsModalView('gl');
                }

                // Special handling for game-logs - can't be toggled off
                if (targetPanel === 'game-logs') {
                    // Hide all overlay panels to show game logs underneath
                    Object.values(overlayContainers).forEach(container => {
                        if (container) container.classList.add('hidden');
                    });

                    // Update button active states
                    modalInfoBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    return;
                }

                // Check if the clicked overlay panel is currently visible
                const isCurrentlyVisible = overlayContainers[targetPanel] &&
                    !overlayContainers[targetPanel].classList.contains('hidden');

                // For overlay panels (stats-key, radar-chart, news)
                if (isCurrentlyVisible) {
                    // Toggling off - return to game-logs view
                    overlayContainers[targetPanel].classList.add('hidden');

                    // Update button active states - activate game-logs
                    modalInfoBtns.forEach(b => {
                        b.classList.remove('active');
                        if (b.getAttribute('data-panel') === 'game-logs') {
                            b.classList.add('active');
                        }
                    });
                } else {
                    // Opening a new overlay panel - hide other overlays first
                    Object.values(overlayContainers).forEach(container => {
                        if (container) container.classList.add('hidden');
                    });

                    // Show the target overlay panel
                    overlayContainers[targetPanel].classList.remove('hidden');

                    // Update button active states
                    modalInfoBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // If opening radar chart panel, render chart
                    if (targetPanel === 'radar-chart' && state.currentGameLogsPlayer) {
                        const player = state.currentGameLogsPlayer;
                        if (player && player.pos) {
                            renderPlayerRadarChart(player.id, player.pos);
                        }
                    }

                    // If opening consistency panel, render consistency chart
                    if (targetPanel === 'consistency' && state.currentGameLogsPlayer) {
                        renderConsistencyChart();
                    }
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !gameLogsModal.classList.contains('hidden')) {
                closeGameLogsSeasonMenu();
                closeModal();
            }
        });
    }
    if (playerComparisonModal) {
        const closeBtn = playerComparisonModal.querySelector('.modal-close-btn');
        const overlay = playerComparisonModal.querySelector('.modal-overlay');
        if (closeBtn) closeBtn.addEventListener('click', () => closeComparisonModal());
        if (overlay) overlay.addEventListener('click', () => closeComparisonModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !playerComparisonModal.classList.contains('hidden')) {
                closeComparisonModal();
            }
        });
    }
}

// Game logs modal wiring for Stats page (needs GL/SZN switcher too)
if (pageType === 'stats' && gameLogsModal) {
    // GL/SZN view switcher (SZN replaces game logs table in-place)
    const viewSwitcher = gameLogsModal.querySelector('.gamelogs-view-switcher');
    if (viewSwitcher && !viewSwitcher.dataset.gamelogsViewWired) {
        viewSwitcher.dataset.gamelogsViewWired = 'true';
        viewSwitcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.gamelogs-view-option');
            if (!btn) return;
            const view = btn.dataset.gamelogsView;
            setGameLogsModalView(view);
        });
    }

    // Match rosters behavior: keep vertical scrolling working even if the gesture starts
    // slightly outside the scrollable stats area (header/edges).
    const gameLogsModalContent = gameLogsModal.querySelector('.modal-content');
	    if (gameLogsModalContent && modalBody && !gameLogsModalContent.dataset.sznScrollForwardingWired) {
	        gameLogsModalContent.dataset.sznScrollForwardingWired = 'true';

	        gameLogsModalContent.addEventListener('wheel', (e) => {
	            if (state.currentGameLogsView !== 'szn') return;
	            if ((statsKeyContainer && !statsKeyContainer.classList.contains('hidden')) ||
	                (radarChartContainer && !radarChartContainer.classList.contains('hidden')) ||
	                (consistencyContainer && !consistencyContainer.classList.contains('hidden'))) {
	                return;
	            }
	            const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
	            if (!sznScroll) return;
	            if (sznScroll.contains(e.target)) return;
	            const absX = Math.abs(e.deltaX || 0);
	            const absY = Math.abs(e.deltaY || 0);
	            if (absY <= absX) return;
	            if (sznScroll.scrollHeight <= sznScroll.clientHeight) return;
	            sznScroll.scrollTop += e.deltaY;
	            e.preventDefault();
	        }, { passive: false });

	        let sznTouchScrollActive = false;
	        let sznTouchLastY = 0;
	        const endSznTouchScroll = () => { sznTouchScrollActive = false; };
	        const canForwardSznTouchScroll = (touchTarget) => {
	            if (state.currentGameLogsView !== 'szn') return false;
	            if ((statsKeyContainer && !statsKeyContainer.classList.contains('hidden')) ||
	                (radarChartContainer && !radarChartContainer.classList.contains('hidden')) ||
	                (consistencyContainer && !consistencyContainer.classList.contains('hidden'))) {
	                return false;
	            }
	            const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
	            if (!sznScroll) return false;
	            if (sznScroll.contains(touchTarget)) return false;
	            if (sznScroll.scrollHeight <= sznScroll.clientHeight) return false;
	            return true;
	        };

	        gameLogsModalContent.addEventListener('touchstart', (e) => {
	            if (!canForwardSznTouchScroll(e.target)) return;
	            if (!e.touches || e.touches.length !== 1) return;
	            sznTouchScrollActive = true;
	            sznTouchLastY = e.touches[0].clientY;
	        }, { passive: true });

	        gameLogsModalContent.addEventListener('touchmove', (e) => {
	            if (!sznTouchScrollActive) return;
	            if (!e.touches || e.touches.length !== 1) return endSznTouchScroll();
	            const sznScroll = modalBody.querySelector('.game-logs-szn-view:not(.hidden)');
	            if (!sznScroll) return endSznTouchScroll();
	            const y = e.touches[0].clientY;
	            const dy = sznTouchLastY - y;
	            sznTouchLastY = y;
	            sznScroll.scrollTop += dy;
	            e.preventDefault();
	        }, { passive: false });

        gameLogsModalContent.addEventListener('touchend', endSznTouchScroll, { passive: true });
        gameLogsModalContent.addEventListener('touchcancel', endSznTouchScroll, { passive: true });
    }
}

// Ownership-only UI wiring: mode switcher + ownership detail modal interactions.
if (pageType === 'ownership') {
    ownershipModeSwitcher?.addEventListener('click', (event) => {
        const modeBtn = event.target.closest('.ownership-mode-btn[data-ownership-mode]');
        if (!modeBtn) return;
        const nextMode = modeBtn.dataset.ownershipMode;
        setOwnershipMode(nextMode);
    });
}

// Ownership modal close controls — wired for both ownership and rosters pages:
// supports click/tap/pointer interactions so close works reliably on mobile and desktop.
if (pageType === 'ownership' || pageType === 'rosters') {
    const handleOwnershipModalCloseClick = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        closeOwnershipPlayerModal();
    };

    ownershipModalCloseBtn?.addEventListener('click', handleOwnershipModalCloseClick);
    ownershipModalCloseBtn?.addEventListener('pointerup', handleOwnershipModalCloseClick);
    ownershipModalCloseBtn?.addEventListener('touchend', handleOwnershipModalCloseClick, { passive: false });
    ownershipModalOverlay?.addEventListener('click', () => closeOwnershipPlayerModal());

    // Ownership modal close fallback:
    // if any click/tap bubbles from a close control inside the modal, close reliably.
    ownershipPlayerModal?.addEventListener('click', (event) => {
        if (event.target?.closest?.('.ownership-modal-close')) {
            handleOwnershipModalCloseClick(event);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && ownershipPlayerModal && !ownershipPlayerModal.classList.contains('hidden')) {
            closeOwnershipPlayerModal();
        }
    });
}
// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    if (usesLeagueUsernameGate(pageType)) {
        initializeLeagueUsernameGate();
    }
    if (pageType === 'leaguehub') return;
    if (pageType === 'research') {
        const params = new URLSearchParams(window.location.search);
        const uname = params.get('username');
        if (uname) {
            usernameInput.value = uname;
        }
        return;
    }

    // For welcome page, just show the screen - no loading needed
    if (pageType === 'welcome') {
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
        // Prevent mobile keyboard appearing when arriving via nav with ?username=
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('username')) {
                try { suppressFocusTemporary(600); } catch (e) { }
                setTimeout(() => { try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { } }, 50);
            }
        } catch (e) { }
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const uname = normalizeLeagueUsername(params.get('username'));
    const storedUsername = usesLeagueUsernameGate(pageType) ? readPreferredHeaderUsername() : '';

    // Immediate gate-open path:
    // if navigation lands on a gated page without any saved/query username,
    // open the overlay first instead of waiting on page bootstrap data.
    if (usesLeagueUsernameGate(pageType) && !uname && !storedUsername) {
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
        showLeagueUsernameGate({ page: pageType, focusInput: false });
        return;
    }

    // Prevent mobile keyboard appearing when arriving via nav with ?username=
    try {
        if (params.has('username')) {
            // enable temporary focus suppression and blur after the page settles
            try { suppressFocusTemporary(600); } catch (e) { }
            setTimeout(() => { try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) { } }, 50);
        }
    } catch (e) { }
    setLoading(true, 'Loading initial data...');
    await loadInitialPageBootstrapData();
    setLoading(false);
    if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    if (uname) {
        try { suppressFocusTemporary(600); } catch (e) { }
        syncHeaderUsernameValue(uname);
        if (pageType === 'rosters') {
            await handleFetchRosters();
        } else if (pageType === 'ownership') {
            await handleFetchOwnership();
        }
        return;
    }
    if (usesLeagueUsernameGate(pageType)) {
        if (storedUsername) {
            syncHeaderUsernameValue(storedUsername);
            if (pageType === 'rosters') {
                await handleFetchRosters();
            } else if (pageType === 'ownership') {
                await handleFetchOwnership();
            }
        } else {
            showLeagueUsernameGate({ page: pageType, focusInput: false });
        }
    }
});

// === Deferred ownership context preload ===
// Defers the optional ownership warm-up for the Game Logs modal until AFTER the
// full window `load` event fires, so it never competes with the critical first
// page render on rosters/stats. If the user opens Ownership before this warm-up
// runs, the on-demand tab fetch still loads the data immediately.
(function scheduleOwnershipContextPreloadAfterFullPageLoad() {
    if (pageType !== 'rosters' && pageType !== 'stats') return;

    const schedulePreload = () => {
        const runWhenIdle = typeof requestIdleCallback === 'function'
            ? (cb) => requestIdleCallback(cb, { timeout: 8000 })
            : (cb) => setTimeout(cb, 3000);

        // Background preload targets the shared ownership context used by the
        // Game Logs modal, but only once the page has fully loaded and user
        // identity is available from the current roster/stats session.
        const checkAndLoad = () => {
            if (!state.userId) return;
            loadOwnershipContextForUser().catch(() => { });
        };

        // Run after a post-load idle window so the preload stays off the critical path.
        runWhenIdle(checkAndLoad);
        // Re-check later in case user hydration finishes after the first idle slot.
        setTimeout(checkAndLoad, 6000);
    };

    if (document.readyState === 'complete') {
        schedulePreload();
    } else {
        window.addEventListener('load', schedulePreload, { once: true });
    }
})();

// --- Mobile League Navigation (Rosters Page Only) ---
if (pageType === 'rosters') {
    const mobileLeagueNav = document.getElementById('mobile-league-nav');
    const leagueNavPrev = mobileLeagueNav?.querySelector('.league-nav-prev');
    const leagueNavNext = mobileLeagueNav?.querySelector('.league-nav-next');
    const leagueNavSelector = mobileLeagueNav?.querySelector('.league-nav-selector');
    const leagueNavName = mobileLeagueNav?.querySelector('.league-nav-name');
    const leagueSelectionPopup = document.getElementById('league-selection-popup');
    const leaguePopupClose = leagueSelectionPopup?.querySelector('.league-popup-close');
    const leaguePopupOverlay = leagueSelectionPopup?.querySelector('.league-popup-overlay');
    const leaguePopupList = leagueSelectionPopup?.querySelector('.league-popup-list');

    let scrollTimeout;
    let isScrolling = false;

    // Dim bottom menu panel (league nav + watchlist button) when scrolling
    function handleScroll() {
        const panel = bottomMenuPanel || mobileLeagueNav;
        if (!panel) return;

        if (!isScrolling) {
            panel.classList.add('scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            panel.classList.remove('scrolling');
            isScrolling = false;
        }, 150);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Update mobile nav panel and bottom menu panel visibility with current league
    function updateMobileLeagueNav() {
        // Always show bottom menu panel when leagues exist (watchlist button lives here too)
        if (bottomMenuPanel) {
            const hasLeagues = state.leagues && state.leagues.length > 0;
            const inSpecialMode = state.isCompareMode || state.isStartSitMode;
            bottomMenuPanel.classList.toggle('hidden', !hasLeagues || inSpecialMode);
        }

        if (!mobileLeagueNav || !state.leagues || state.leagues.length === 0) {
            if (mobileLeagueNav) mobileLeagueNav.classList.add('hidden');
            return;
        }

        // Hide mobile nav when in trade/compare/start-sit mode
        if (state.isCompareMode || state.isStartSitMode) {
            mobileLeagueNav.classList.add('hidden');
            return;
        }

        mobileLeagueNav.classList.remove('hidden');

        const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);
        const currentLeague = state.leagues[currentIndex];

        if (currentLeague && leagueNavName) {
            leagueNavName.textContent = currentLeague.name;
        }

        // Enable both arrows for cycling (no longer disable at boundaries)
        if (leagueNavPrev) {
            leagueNavPrev.disabled = false;
        }
        if (leagueNavNext) {
            leagueNavNext.disabled = false;
        }
    }

    // Navigate to previous league (with cycling)
    async function navigateToPreviousLeague() {
        if (!state.leagues || state.leagues.length === 0) return;

        const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);

        // Cycle to last league if at the beginning
        const prevIndex = currentIndex <= 0 ? state.leagues.length - 1 : currentIndex - 1;
        const prevLeague = state.leagues[prevIndex];
        state.currentLeagueId = prevLeague.league_id;

        // Update league select dropdown
        if (leagueSelect) {
            leagueSelect.value = prevLeague.league_id;
        }

        updateMobileLeagueNav();
        await handleLeagueSelect();
    }

    // Navigate to next league (with cycling)
    async function navigateToNextLeague() {
        if (!state.leagues || state.leagues.length === 0) return;

        const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);

        // Cycle to first league if at the end
        const nextIndex = currentIndex >= state.leagues.length - 1 ? 0 : currentIndex + 1;
        const nextLeague = state.leagues[nextIndex];
        state.currentLeagueId = nextLeague.league_id;

        // Update league select dropdown
        if (leagueSelect) {
            leagueSelect.value = nextLeague.league_id;
        }

        updateMobileLeagueNav();
        await handleLeagueSelect();
    }

    // Open league selection popup
    function openLeaguePopup() {
        if (!leagueSelectionPopup || !leaguePopupList) return;

        // Clear existing list
        leaguePopupList.innerHTML = '';

        // Render league options
        state.leagues.forEach(league => {
            const item = document.createElement('div');
            item.className = 'league-popup-item';
            if (league.league_id === state.currentLeagueId) {
                item.classList.add('active');
            }

            item.innerHTML = `
                        <span class="league-popup-item-name">${league.name}</span>
                        <i class="fa-solid fa-check league-popup-item-check"></i>
                    `;

            item.addEventListener('click', async () => {
                state.currentLeagueId = league.league_id;

                // Update league select dropdown
                if (leagueSelect) {
                    leagueSelect.value = league.league_id;
                }

                closeLeaguePopup();
                updateMobileLeagueNav();
                await handleLeagueSelect();
            });

            leaguePopupList.appendChild(item);
        });

        leagueSelectionPopup.classList.remove('hidden');
    }

    // Close league selection popup
    function closeLeaguePopup() {
        if (leagueSelectionPopup) {
            leagueSelectionPopup.classList.add('hidden');
        }
    }

    // Event listeners
    leagueNavPrev?.addEventListener('click', navigateToPreviousLeague);
    leagueNavNext?.addEventListener('click', navigateToNextLeague);
    leagueNavSelector?.addEventListener('click', openLeaguePopup);
    leaguePopupClose?.addEventListener('click', closeLeaguePopup);
    leaguePopupOverlay?.addEventListener('click', closeLeaguePopup);

    // Close popup on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && leagueSelectionPopup && !leagueSelectionPopup.classList.contains('hidden')) {
            closeLeaguePopup();
        }
    });

    // Expose update function for use after loading leagues
    window.updateMobileLeagueNav = updateMobileLeagueNav;
}

// --- View Toggling and Main Handlers ---
function setRosterView(view) {
    closeComparisonModal();
    hideLegend();
    state.currentRosterView = view;
    const isPositional = view === 'positional';
    const isCondensed = view === 'condensed';
    const isPositionalFamily = isPositional || isCondensed;

    // Update dropdown toggle display (mobile)
    if (viewDropdownIcon && viewDropdownLabel) {
        if (isPositional) {
            viewDropdownIcon.className = 'fa-solid fa-users';
            // Rosters mobile View control: keep the default POS value in its own
            // page-scoped hook so it can carry a restrained accent tint.
            viewDropdownLabel.innerHTML = '<span class="view-dropdown-label-prefix">View:</span><span class="view-dropdown-label-pos">POS</span>';
        } else if (isCondensed) {
            viewDropdownIcon.className = 'fa-solid fa-compress';
            viewDropdownLabel.textContent = 'Condensed';
        } else {
            viewDropdownIcon.className = 'fa-solid fa-list-ol';
            viewDropdownLabel.textContent = 'Lineup';
        }
    }

    // Update dropdown menu options active state (mobile)
    if (viewDropdownMenu) {
        const options = viewDropdownMenu.querySelectorAll('.view-dropdown-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.view === view);
        });
    }

    // Legacy support for old button-based switcher (desktop)
    if (positionalViewBtn && lineupViewBtn) {
        positionalViewBtn.classList.toggle('active', isPositional);
        lineupViewBtn.classList.toggle('active', !isPositionalFamily);
        positionalViewBtn.classList.toggle('counterpart-active', !isPositionalFamily);
        lineupViewBtn.classList.toggle('counterpart-active', isPositionalFamily);
    }
    if (condensedViewBtn) {
        condensedViewBtn.classList.toggle('active', isCondensed);
        condensedViewBtn.classList.toggle('counterpart-active', !isCondensed);
    }

    if (state.currentTeams) {
        renderAllTeamData(state.currentTeams);
    }
}
async function handleFetchRosters() {
    hideLegend();
    const username = syncHeaderUsernameValue(usernameInput.value);
    if (!username) return false;
    setLoading(true, 'Loading player data...');
    let wasSuccessful = false;
    try {
        await loadInitialPageBootstrapData();
        setLoading(true, 'Fetching user leagues...');
        await fetchAndSetUser(username);
        const leagues = await fetchUserLeagues(state.userId);
        state.leagues = leagues.sort((a, b) => a.name.localeCompare(b.name));
        adjustStickyHeaders(); // Recalculate header height for correct padding
        playerListView.classList.add('hidden');
        rosterView.classList.remove('hidden');
        setRosterView('positional'); // Set default view
        populateLeagueSelect(state.leagues);
        const params = new URLSearchParams(window.location.search);
        const preselectId = params.get('leagueId');
        if (state.leagues.length > 0) {
            if (preselectId && state.leagues.some(l => l.league_id === preselectId)) {
                leagueSelect.value = preselectId;
                await handleLeagueSelect();
            } else {
                leagueSelect.selectedIndex = 1;
                await handleLeagueSelect();
            }
            // Update mobile league navigation after league is loaded
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            // Load watchlist for the current user (persisted in localStorage)
            loadWatchlist();
            updateWatchlistBadge();
        }
        wasSuccessful = true;
    } catch (error) {
        handleError(error, username);
    } finally {
        setLoading(false);

        // Start loading weekly stats in background for game logs (non-blocking)
        if (!state.statsSheetsLoaded && typeof fetchPlayerStatsSheets === 'function') {
            fetchPlayerStatsSheets().catch(err => {
                console.warn('Background load of weekly stats failed:', err);
            });
        }
    }
    return wasSuccessful;
}
async function handleFetchOwnership() {
    const username = syncHeaderUsernameValue(usernameInput.value);
    if (!username) return false;
    setLoading(true, 'Loading player data...');
    let wasSuccessful = false;
    try {
        await loadInitialPageBootstrapData();
        setLoading(true, 'Fetching ownership data...');
        await fetchAndSetUser(username);
        rosterView.classList.add('hidden');
        playerListView.classList.remove('hidden');
        // Ownership page: load cross-league context once, then render the active ownership mode.
        await loadOwnershipContextForUser();
        buildOwnershipRowsFromContext();
        buildOwnershipValueRows();
        setOwnershipMode(state.ownershipMode || 'ownership');
        wasSuccessful = true;
    } catch (error) {
        handleError(error, username);
    } finally {
        setLoading(false);
    }
    return wasSuccessful;
}
// Helper to determine the winner of a league from the bracket
async function fetchPreviousSeasonData(currentLeagueInfo) {
    if (!currentLeagueInfo || !currentLeagueInfo.previous_league_id) return null;
    const prevLeagueId = currentLeagueInfo.previous_league_id;
    try {
        const [rosters, winnersBracket] = await Promise.all([
            fetchWithCache(`${API_BASE}/league/${prevLeagueId}/rosters`),
            fetchWithCache(`${API_BASE}/league/${prevLeagueId}/winners_bracket`)
        ]);

        let winnerRosterId = null;
        if (winnersBracket && winnersBracket.length > 0) {
            const maxRound = Math.max(...winnersBracket.map(m => m.r));
            const finals = winnersBracket.filter(m => m.r === maxRound);
            // Look for match with p=1 (championship positional match)
            const champMatch = finals.find(m => m.p === 1);
            if (champMatch) {
                winnerRosterId = champMatch.w;
            } else if (finals.length === 1) {
                // Fallback: single match in final round
                winnerRosterId = finals[0].w;
            }
        }

        const rostersByOwner = {};
        rosters.forEach(r => {
            rostersByOwner[r.owner_id] = r;
        });

        return { rostersByOwner, winnerRosterId };
    } catch (e) {
        console.warn("Failed to fetch previous season data", e);
        return null;
    }
}

async function handleLeagueSelect() {
    hideLegend();
    const leagueId = leagueSelect.value;
    if (state.isStartSitMode) {
        exitStartSitMode();
    }
    if (!leagueId || leagueId === 'Select a league...') {
        rosterView.classList.add('hidden');
        return;
    };
    state.currentLeagueId = leagueId;
    state.calculatedRankCache = null;
    state.matchupDataLoaded = false; // Reset matchup data state
    state.draftOrderBySeason = {}; // Reset draft order map for pick labels/values
    handleClearCompare();
    const leagueInfo = state.leagues.find(l => l.league_id === leagueId);
    const leagueName = leagueInfo?.name || 'league';
    setLoading(true, `Loading ${leagueName}...`);
    rosterGrid.innerHTML = '';
    try {
        const rosterPositions = leagueInfo.roster_positions;
        const superflexSlots = rosterPositions.filter(p => p === 'SUPER_FLEX').length;
        const qbSlots = rosterPositions.filter(p => p === 'QB').length;
        state.isSuperflex = (superflexSlots > 0) || (qbSlots > 1);
        const [rosters, users, tradedPicks, drafts] = await Promise.all([
            fetchWithCache(`${API_BASE}/league/${leagueId}/rosters`),
            fetchWithCache(`${API_BASE}/league/${leagueId}/users`),
            fetchWithCache(`${API_BASE}/league/${leagueId}/traded_picks`),
            fetchWithCache(`${API_BASE}/league/${leagueId}/drafts`),
        ]);

        // Fetch league-specific matchup data for FPTS/PPG
        // If current league is a new season (e.g., 2026) with no games yet, use previous season's league
        const leagueSeason = parseInt(leagueInfo?.season, 10);
        const previousLeagueId = leagueInfo?.previous_league_id;
        const sheetDataSeason = 2025; // The season our Google Sheets data covers

        // Use previous league's matchup data if current league season is newer than sheet data
        // When using previous season, fetch all 18 weeks (full completed season)
        const usePreviousSeason = previousLeagueId && leagueSeason > sheetDataSeason;
        const matchupLeagueId = usePreviousSeason ? previousLeagueId : leagueId;
        const matchupMaxWeek = usePreviousSeason ? 18 : null; // null uses current week
        await fetchLeagueMatchupData(matchupLeagueId, matchupMaxWeek);

        // Hydrate draft order (for precise pick labels like 2026 1.02 and KTC early/mid/late buckets)
        await hydrateDraftOrderBySeason({ leagueId, leagueInfo, rosters, drafts });

        // Fetch previous season data for records/championship crown if we are in the offseason (e.g. 2026)
        let previousSeasonData = null;
        // Check if we should fallback (e.g. 2026 season or generally if previous league exists and we want history)
        if (leagueInfo.season === '2026' || leagueInfo.status === 'pre_draft' || leagueInfo.status === 'complete') {
            previousSeasonData = await fetchPreviousSeasonData(leagueInfo);
        }

        const teams = processRosterData(rosters, users, tradedPicks, leagueInfo, previousSeasonData);
        const userTeam = teams.find(team => team.isUserTeam);
        if (userTeam) {
            state.userTeamName = userTeam.teamName;
            state.teamsToCompare.add(userTeam.teamName);
        } else {
            state.userTeamName = null;
        }
        updateCompareButtonState();
        renderAllTeamData(teams);
        rosterView.classList.remove('hidden');
    } catch (error) {
        console.error(`Error loading league ${leagueId}:`, error);
    } finally {
        setLoading(false);
    }
}
// --- Compare & Trade Logic ---
function handleTeamSelect(e) {
    const header = e.target.closest('.team-header-item');
    if (header) {
        if (state.isStartSitMode) {
            exitStartSitMode();
        }
        const checkbox = header.querySelector('.team-compare-checkbox');
        const teamName = checkbox.dataset.teamName;
        const isSelected = state.teamsToCompare.has(teamName);
        if (isSelected) {
            // If a team is deselected, hide the trade preview
            state.teamsToCompare.delete(teamName);
            checkbox.classList.remove('selected');
            state.isCompareMode = false;
            rosterView.classList.remove('is-trade-mode');
            rosterGrid.classList.remove('is-preview-mode');
            clearTrade();
            setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
            updateHeaderPreviewState(); // call before render
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            renderAllTeamData(state.currentTeams);
        } else {
            // If a new team is selected
            if (state.teamsToCompare.size >= 2) {
                // Prevent selecting more than 2 teams
                return;
            }
            state.teamsToCompare.add(teamName);
            checkbox.classList.add('selected');
            if (state.teamsToCompare.size === 2) {
                // If we now have 2 teams, show the preview
                state.isCompareMode = true;
                rosterView.classList.add('is-trade-mode');
                rosterGrid.classList.add('is-preview-mode');
                setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                updateHeaderPreviewState(); // call before render
                if (typeof window.updateMobileLeagueNav === 'function') {
                    window.updateMobileLeagueNav();
                }
                renderAllTeamData(state.currentTeams);
                renderTradeBlock();
            }
        }
        updateCompareButtonState();
    }
}
function updateHeaderPreviewState() {
    const appHeader = document.querySelector('.app-header');
    if (appHeader) {
        appHeader.classList.toggle('preview-active', state.isCompareMode || state.isStartSitMode);
    }
    syncRosterHeaderDividerPosition();
}
function handleCompareClick() {
    if (state.isStartSitMode) {
        exitStartSitMode();
    }
    state.isCompareMode = !state.isCompareMode;
    rosterView.classList.toggle('is-trade-mode', state.isCompareMode);
    rosterGrid.classList.toggle('is-preview-mode', state.isCompareMode);
    updateCompareButtonState();
    updateHeaderPreviewState(); // call before render
    if (typeof window.updateMobileLeagueNav === 'function') {
        window.updateMobileLeagueNav();
    }
    if (!state.isCompareMode) {
        clearTrade();
        setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
    } else {
        setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
        renderTradeBlock();
    }
    renderAllTeamData(state.currentTeams);
}
function handleStartSitButtonClick() {
    if (state.isStartSitMode) {
        exitStartSitMode();
    } else {
        enterStartSitMode();
    }
}
function enterStartSitMode() {
    const teams = state.currentTeams || [];
    const userTeam = teams.find(team => team.teamName === state.userTeamName) || teams.find(team => team.isUserTeam);
    if (!userTeam) {
        if (startSitButton) {
            showTemporaryTooltip(startSitButton, 'Load your roster first.');
        }
        return;
    }
    if (state.isCompareMode) {
        handleClearCompare();
    }
    startSitButton?.classList.add('active');
    state.isStartSitMode = true;
    state.startSitTeamName = userTeam.teamName;
    state.startSitSelections = [];
    state.startSitNextSide = 'left';
    rosterView.classList.add('is-trade-mode');
    rosterGrid.classList.add('is-preview-mode');
    rosterGrid.classList.add('start-sit-mode');
    try { closeCompareSearch(); } catch (e) { }
    updateHeaderPreviewState();
    if (typeof window.updateMobileLeagueNav === 'function') {
        window.updateMobileLeagueNav();
    }
    setTimeout(() => window.scrollTo(0, 0), 0);
    if (state.currentTeams) {
        renderAllTeamData(state.currentTeams);
    }
    renderTradeBlock();
}
function exitStartSitMode() {
    if (!state.isStartSitMode) return;
    state.isStartSitMode = false;
    state.startSitSelections = [];
    state.startSitNextSide = 'left';
    rosterView.classList.remove('is-trade-mode');
    rosterGrid.classList.remove('is-preview-mode');
    rosterGrid.classList.remove('start-sit-mode');
    startSitButton?.classList.remove('active');
    updateHeaderPreviewState();
    if (typeof window.updateMobileLeagueNav === 'function') {
        window.updateMobileLeagueNav();
    }
    try { closeComparisonModal(); } catch (e) { }
    try {
        if (gameLogsModal && !gameLogsModal.classList.contains('hidden')) {
            closeModal();
        }
    } catch (e) { }
    renderTradeBlock();
    if (state.currentTeams) {
        renderAllTeamData(state.currentTeams);
    }
}
function clearStartSitSelections() {
    if (!state.isStartSitMode) return;
    state.startSitSelections = [];
    state.startSitNextSide = 'left';
    document.querySelectorAll('.roster-column.start-sit-column .player-selected').forEach(el => {
        el.classList.remove('player-selected');
        delete el.dataset.startSitSide;
    });
    renderTradeBlock();
}
function recalcStartSitNextSide() {
    const count = state.startSitSelections.length;
    if (count === 0) {
        state.startSitNextSide = 'left';
        return;
    }
    if (count === 1) {
        state.startSitNextSide = state.startSitSelections[0].side === 'left' ? 'right' : 'left';
        return;
    }
    state.startSitNextSide = count % 2 === 0 ? 'left' : 'right';
}
function getPlayerProjectionForWeek(playerId, week = null) {
    if (!playerId) return { value: null, display: 'NA' };
    const fallbackWeek = getCurrentNflWeekNumber();
    const candidateWeek = Number(week);
    const numericWeek = Number.isFinite(candidateWeek) && candidateWeek > 0
        ? candidateWeek
        : (Number.isFinite(fallbackWeek) && fallbackWeek > 0 ? fallbackWeek : null);
    if (!Number.isFinite(numericWeek)) return { value: null, display: 'NA' };
    const resolveProjection = (statSource) => {
        if (!statSource || !Object.prototype.hasOwnProperty.call(statSource, 'proj')) return null;
        const raw = statSource.proj;
        if (raw === undefined || raw === null) return null;
        const trimmed = String(raw).trim();
        if (!trimmed) return null;
        if (trimmed.toUpperCase() === 'NA') return { value: null, display: 'NA' };
        const numeric = Number.parseFloat(trimmed.replace(/[^0-9.\-]/g, ''));
        const value = Number.isFinite(numeric) ? numeric : null;
        return {
            value,
            display: value !== null ? value.toFixed(1) : trimmed
        };
    };
    const sheetResult = resolveProjection(state.playerWeeklyStats?.[numericWeek]?.[playerId]);
    if (sheetResult) return sheetResult;
    const liveResult = resolveProjection(state.liveWeeklyStats?.[numericWeek]?.[playerId]);
    if (liveResult) return liveResult;
    return { value: null, display: 'NA' };
}
function getPlayerMatchupForWeek(playerId, week = null) {
    if (!playerId) return null;
    const fallbackWeek = getCurrentNflWeekNumber();
    const candidateWeek = Number(week);
    const numericWeek = Number.isFinite(candidateWeek) && candidateWeek > 0
        ? candidateWeek
        : (Number.isFinite(fallbackWeek) && fallbackWeek > 0 ? fallbackWeek : null);
    if (!Number.isFinite(numericWeek)) return null;
    const extractFromStats = (stats) => {
        if (!stats) return null;
        const opponentRaw = stats.opponent;
        const opponent = typeof opponentRaw === 'string' ? opponentRaw.trim() : '';
        const isBye = opponent.toUpperCase() === 'BYE';
        let rankValue = null;
        const rankRaw = stats.opponent_rank;
        if (typeof rankRaw === 'number' && Number.isFinite(rankRaw)) {
            rankValue = rankRaw;
        } else if (typeof rankRaw === 'string') {
            const trimmedRank = rankRaw.trim();
            if (trimmedRank && trimmedRank.toUpperCase() !== 'NA') {
                const parsedRank = Number.parseInt(trimmedRank.replace(/[^0-9]/g, ''), 10);
                if (Number.isFinite(parsedRank)) {
                    rankValue = parsedRank;
                }
            }
        }
        const hasOpponent = Boolean(opponent) || isBye;
        const hasRank = Number.isFinite(rankValue);
        if (!hasOpponent && !hasRank) return null;
        const rankDisplay = getRankDisplayText(rankRaw);
        const ordinalDisplay = hasRank ? ordinalSuffix(rankValue) : null;
        const color = hasRank ? getOpponentRankColor(rankValue) : null;
        return {
            opponent: isBye ? 'BYE' : opponent,
            opponentRank: hasRank ? rankValue : null,
            opponentRankDisplay: rankDisplay,
            opponentOrdinal: ordinalDisplay,
            color: color || null,
            isBye
        };
    };
    const sources = [
        state.playerWeeklyStats?.[numericWeek]?.[playerId],
        state.liveWeeklyStats?.[numericWeek]?.[playerId]
    ];
    for (const stats of sources) {
        const matchup = extractFromStats(stats);
        if (matchup) return matchup;
    }
    return null;
}
function getUpcomingProjectionDesignation(playerId) {
    if (!playerId) return null;
    const currentWeek = getCurrentNflWeekNumber();
    if (!Number.isFinite(currentWeek)) return null;
    const statSources = [
        state.playerWeeklyStats?.[currentWeek]?.[playerId],
        state.liveWeeklyStats?.[currentWeek]?.[playerId]
    ];
    for (const statSource of statSources) {
        if (!statSource || !Object.prototype.hasOwnProperty.call(statSource, 'proj')) continue;
        const parsed = parseInjuryDesignation(statSource.proj);
        if (!parsed) continue;
        return { designation: parsed.designation, color: parsed.color, week: currentWeek };
    }
    const projectionInfo = getPlayerProjectionForWeek(playerId, currentWeek);
    const fallback = parseInjuryDesignation(projectionInfo?.display);
    if (!fallback) return null;
    return { designation: fallback.designation, color: fallback.color, week: currentWeek };
}
function handleStartSitPlayerClick(e) {
    const row = e.target.closest('.player-row');
    if (!row) return;
    const column = row.closest('.roster-column.start-sit-column');
    if (!column) return;
    const teamName = column.dataset.teamName;
    if (!teamName || teamName !== state.startSitTeamName) return;
    const playerId = row.dataset.assetId;
    if (!playerId) return;
    // Toggle selection if already selected
    const existingIndex = state.startSitSelections.findIndex(sel => sel.id === playerId);
    if (existingIndex > -1) {
        state.startSitSelections.splice(existingIndex, 1);
        row.classList.remove('player-selected');
        delete row.dataset.startSitSide;
        recalcStartSitNextSide();
        renderTradeBlock();
        return;
    }
    if (state.startSitSelections.length >= 6) {
        showTemporaryTooltip(row, 'Select up to six players.');
        return;
    }
    const ranks = calculatePlayerStatsAndRanks(playerId) || getDefaultPlayerRanks();
    const activeWeek = getCurrentNflWeekNumber();
    const rawPpg = typeof ranks.ppg === 'number' ? ranks.ppg : Number.parseFloat(String(ranks.ppg || '').replace(/[^0-9.\-]/g, ''));
    const hasPpg = Number.isFinite(rawPpg);
    const ppgValue = hasPpg ? Number(rawPpg) : null;
    const ppgDisplay = hasPpg ? ppgValue.toFixed(1) : 'NA';
    const rawPpgRank = Number.parseInt(String(ranks.ppgPosRank || '').replace(/[^0-9]/g, ''), 10);
    const hasPpgRank = Number.isFinite(rawPpgRank) && rawPpgRank > 0;
    const basePosRaw = (row.dataset.assetBasePos || '').toUpperCase();
    const displayPos = (row.dataset.assetPos || basePosRaw || '').toUpperCase();
    const normalizedBasePos = basePosRaw || displayPos || '';
    const rankDisplay = normalizedBasePos
        ? (hasPpgRank ? `${normalizedBasePos}·${rawPpgRank}` : `${normalizedBasePos}·NA`)
        : (hasPpgRank ? `${rawPpgRank}` : 'NA');
    const projectionInfo = getPlayerProjectionForWeek(playerId, activeWeek);
    const projectionValue = projectionInfo?.value ?? null;
    const projectionDisplay = projectionInfo?.display || 'NA';
    const matchupInfo = getPlayerMatchupForWeek(playerId, activeWeek);
    const selection = {
        id: playerId,
        label: row.dataset.assetLabel || row.querySelector('.player-name-clickable')?.textContent || 'Unknown Player',
        pos: displayPos || normalizedBasePos || '',
        basePos: normalizedBasePos,
        team: row.dataset.assetTeam || 'FA',
        side: state.startSitNextSide,
        ppg: ppgValue,
        ppgDisplay,
        ppgPosRank: hasPpgRank ? rawPpgRank : null,
        ppgPosRankDisplay: rankDisplay,
        projection: projectionValue,
        projectionDisplay,
        matchup: matchupInfo
    };
    state.startSitSelections.push(selection);
    row.classList.add('player-selected');
    row.dataset.startSitSide = selection.side;
    state.startSitNextSide = selection.side === 'left' ? 'right' : 'left';
    renderTradeBlock();
}
function handleClearCompare(keepUserTeam = false) {
    const userTeamName = state.currentTeams?.find(team => team.isUserTeam)?.teamName;
    const teamsToKeep = new Set();
    if (keepUserTeam && userTeamName && state.teamsToCompare.has(userTeamName)) {
        teamsToKeep.add(userTeamName);
    }
    state.teamsToCompare = teamsToKeep;
    state.isCompareMode = false;
    rosterView.classList.remove('is-trade-mode');
    rosterGrid.classList.remove('is-preview-mode');
    updateCompareButtonState();
    clearTrade();
    window.scrollTo(0, 0); // scroll to top
    updateHeaderPreviewState(); // call before render
    if (typeof window.updateMobileLeagueNav === 'function') {
        window.updateMobileLeagueNav();
    }
    if (state.currentTeams) {
        renderAllTeamData(state.currentTeams);
    }
}
function lockCompareButtonSize() {
    if (!compareButton) return;
    if (compareButton.style.width && compareButton.style.height) {
        return;
    }
    const rect = compareButton.getBoundingClientRect();
    compareButton.style.width = `${rect.width}px`;
    compareButton.style.height = `${rect.height}px`;
}
function unlockCompareButtonSize() {
    if (!compareButton) return;
    compareButton.style.width = '';
    compareButton.style.height = '';
}
function updateCompareButtonState() {
    if (!compareButton) {
        return;
    }
    const count = state.teamsToCompare.size;
    compareButton.disabled = count < 2;
    if (count > 1) {
        compareButton.classList.add('glow-on-select');
    } else {
        compareButton.classList.remove('glow-on-select');
    }
    if (state.isCompareMode) {
        lockCompareButtonSize();
        compareButton.innerHTML = COMPARE_BUTTON_SHOW_ALL_HTML;
        compareButton.classList.add('active', 'compare-show-all');
        compareButton.classList.remove('glow-on-select');
    } else {
        compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
        compareButton.classList.remove('active');
        compareButton.classList.remove('compare-show-all');
        unlockCompareButtonSize();
    }
    if (count < 2 && state.isCompareMode) {
        handleCompareClick(); // Automatically exit compare mode
    }
}
function openCompareSearch() {
    if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
        return;
    }
    compareSearchPopover.classList.remove('hidden');
    compareSearchToggle.setAttribute('aria-expanded', 'true');
    compareSearchInput.focus();
}
function closeCompareSearch() {
    if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
        return;
    }
    compareSearchPopover.classList.add('hidden');
    compareSearchToggle.setAttribute('aria-expanded', 'false');
    compareSearchInput.value = '';
    /* Also clear the desktop inline search bar when the filter is reset */
    if (rosterSearchInput) rosterSearchInput.value = '';
    filterTeamsByQuery('');
    if (document.activeElement === compareSearchInput) {
        compareSearchToggle.focus();
    }
}
function openViewDropdown() {
    if (!viewDropdownMenu || !viewDropdownToggle) return;
    viewDropdownMenu.classList.remove('hidden');
    viewDropdownToggle.setAttribute('aria-expanded', 'true');
    // Keep the mobile Rosters menu state exposed consistently to assistive tech.
    viewDropdownMenu.setAttribute('aria-hidden', 'false');
}
function closeViewDropdown() {
    if (!viewDropdownMenu || !viewDropdownToggle) return;
    viewDropdownMenu.classList.add('hidden');
    viewDropdownToggle.setAttribute('aria-expanded', 'false');
    viewDropdownMenu.setAttribute('aria-hidden', 'true');
}
function filterTeamsByQuery(q) {
    if (!rosterGrid) {
        return;
    }
    const query = (q || '').trim().toLowerCase();
    const rosterColumns = rosterGrid.querySelectorAll('.roster-column');
    rosterColumns.forEach(column => {
        const playerRows = column.querySelectorAll('.player-row');
        let hasMatch = false;
        playerRows.forEach(row => {
            const playerName = (row.dataset.playerName || row.dataset.assetLabel || '').toLowerCase();
            const matches = !query || playerName.includes(query);
            row.classList.toggle('compare-search-hidden', Boolean(query) && !matches);
            if (matches) {
                hasMatch = true;
            }
        });
        const sections = column.querySelectorAll('.roster-section');
        sections.forEach(section => {
            const visiblePlayer = section.querySelector('.player-row:not(.compare-search-hidden)');
            section.classList.toggle('compare-search-hidden', Boolean(query) && !visiblePlayer);
        });
        const pickRows = column.querySelectorAll('.pick-row');
        pickRows.forEach(row => {
            row.classList.toggle('compare-search-hidden', Boolean(query));
        });
        column.classList.toggle('compare-search-hidden', Boolean(query) && !hasMatch);
    });
}
let searchDebounce;
compareSearchToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = compareSearchToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
        closeCompareSearch();
    } else {
        openCompareSearch();
    }
});
document.addEventListener('click', (e) => {
    if (!compareSearchPopover || !compareSearchToggle) {
        return;
    }
    if (compareSearchPopover.classList.contains('hidden')) {
        return;
    }
    if (!compareSearchPopover.contains(e.target) && !compareSearchToggle.contains(e.target)) {
        closeCompareSearch();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCompareSearch();
    }
});
// Shared header username normalization:
// keeps the rosters/ownership header input value and localStorage entry in sync before
// desktop submit actions or navigation rely on the stored Sleeper username.
function persistNormalizedHeaderUsername(options = {}) {
    if (!usernameInput) return '';
    const { blurInput = true } = options;
    const normalizedUsername = (typeof usernameInput.value === 'string' ? usernameInput.value : '').trim().toLowerCase();
    usernameInput.value = normalizedUsername;
    try {
        if (normalizedUsername) localStorage.setItem(HEADER_USERNAME_STORAGE_KEY, normalizedUsername);
        else localStorage.removeItem(HEADER_USERNAME_STORAGE_KEY);
    } catch (err) { }
    if (blurInput) {
        try { usernameInput.blur(); } catch (err) { }
    }
    return normalizedUsername;
}
function isRosterDesktopHeaderActive() {
    // Rosters desktop-only header controls begin at 869px.
    // The inset Enter button should not change mobile behavior below that breakpoint.
    return pageType === 'rosters' && Boolean(rosterHeaderDividerQuery?.matches);
}
// Ownership page: Enter on username input fetches and renders ownership views (mode switch + table/list).
if (pageType === 'ownership') {
    // Ownership username submit button uses the same fetch flow as pressing Enter.
    ownershipUsernameSubmitButton?.addEventListener('click', async (event) => {
        event.preventDefault();
        await handleFetchOwnership();
        try { usernameInput.blur(); } catch (err) { }
    });

    usernameInput?.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        await handleFetchOwnership();
        try { usernameInput.blur(); } catch (err) { }
    });
}
if (pageType === 'rosters') {
    // Rosters desktop username submit:
    // reuses the existing roster fetch path, but only activates on desktop so smaller layouts
    // keep their current hidden-input behavior and do not fetch from a new keyboard shortcut.
    rosterUsernameSubmitButton?.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!isRosterDesktopHeaderActive()) return;
        const normalizedUsername = persistNormalizedHeaderUsername();
        if (!normalizedUsername) return;
        await handleFetchRosters();
    });

    usernameInput?.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        if (!isRosterDesktopHeaderActive()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const normalizedUsername = persistNormalizedHeaderUsername();
        if (!normalizedUsername) return;
        await handleFetchRosters();
    });
}
compareSearchInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => filterTeamsByQuery(val), 120);
});
/* Desktop inline player search bar — reuses filterTeamsByQuery() from the popover search */
rosterSearchInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => filterTeamsByQuery(val), 120);
});
/* Escape key clears the inline search and blurs the input */
rosterSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        rosterSearchInput.value = '';
        filterTeamsByQuery('');
        rosterSearchInput.blur();
    }
});
compareSearchClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCompareSearch();
    compareSearchToggle?.focus();
});
function handleAssetClickForTrade(e) {
    if (state.isStartSitMode) {
        handleStartSitPlayerClick(e);
        return;
    }
    if (!state.isCompareMode) return;
    const assetRow = e.target.closest('.player-row, .pick-row');
    if (!assetRow) return;
    const teamName = assetRow.closest('.roster-column')?.dataset.teamName;
    if (!teamName || !state.teamsToCompare.has(teamName)) return;
    const { assetId, assetLabel, assetKtc, assetPos, assetBasePos, assetTeam } = assetRow.dataset;
    if (!assetId) return;
    if (!state.tradeBlock[teamName]) {
        state.tradeBlock[teamName] = [];
    }
    const assetIndex = state.tradeBlock[teamName].findIndex(a => a.id === assetId);
    if (assetIndex > -1) {
        state.tradeBlock[teamName].splice(assetIndex, 1);
        assetRow.classList.remove('player-selected');
    } else {
        state.tradeBlock[teamName].push({
            id: assetId,
            label: assetLabel,
            ktc: parseInt(assetKtc, 10) || 0,
            pos: assetPos,
            basePos: assetBasePos || assetPos,
            team: assetTeam || ''
        });
        assetRow.classList.add('player-selected');
    }
    renderTradeBlock();
}
function clearTrade() {
    state.tradeBlock = {};
    document.querySelectorAll('.player-selected').forEach(el => el.classList.remove('player-selected'));
    renderTradeBlock();
    closeComparisonModal();
}
// --- Position Filter Logic ---

// Debounce helper for performance
let renderDebounceTimer = null;
function debouncedRenderAllTeamData(teams, delay = 0) {
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
    if (delay === 0) {
        renderAllTeamData(teams);
    } else {
        renderDebounceTimer = setTimeout(() => renderAllTeamData(teams), delay);
    }
}

function handleClearFilters() {
    closeComparisonModal();
    state.activePositions.clear();
    updatePositionFilterButtons();
    debouncedRenderAllTeamData(state.currentTeams);
    clearFiltersButton.classList.remove('active');
}
function handlePositionFilter(e) {
    closeComparisonModal();
    const button = e.target.closest('.filter-btn');
    if (!button) return;
    const position = button.dataset.position;
    const flexPositions = ['RB', 'WR', 'TE'];
    if (position === 'FLX') {
        const isActivating = !state.activePositions.has('FLX');
        const starFilterIsActive = state.activePositions.has('STAR');
        state.activePositions.clear();
        if (starFilterIsActive) {
            state.activePositions.add('STAR');
        }
        if (isActivating) {
            flexPositions.forEach(p => state.activePositions.add(p));
            state.activePositions.add('FLX');
        }
    } else if (position === 'STAR') {
        if (state.activePositions.has('STAR')) {
            state.activePositions.delete('STAR');
        } else {
            state.activePositions.add('STAR');
        }
    } else {
        state.activePositions.delete('FLX');
        if (state.activePositions.has(position)) {
            state.activePositions.delete(position);
        } else {
            state.activePositions.add(position);
        }
    }
    updatePositionFilterButtons();
    debouncedRenderAllTeamData(state.currentTeams);
    clearFiltersButton.classList.toggle('active', state.activePositions.size > 0);
}
function updatePositionFilterButtons() {
    const buttons = positionalFiltersContainer.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const pos = btn.dataset.position;
        btn.classList.toggle('active', state.activePositions.has(pos));
    });
}
// --- Data Fetching & Processing ---
async function fetchAndSetUser(username) {
    const userRes = await fetchWithCache(`${API_BASE}/user/${username}`);
    if (!userRes || !userRes.user_id) throw new Error('User not found.');
    state.userId = userRes.user_id;
}
const SLEEPER_DYNASTY_LEAGUE_TYPE = 2;
// Dynasty-only league filtering:
// targets every Sleeper league list used by Rosters, Ownership, and the Stats/Game Logs ownership views.
// Sleeper marks dynasty leagues with `settings.type = 2`, so centralizing that rule here keeps
// dropdowns, ownership counts, percentages, and league-detail modals aligned to dynasty leagues only.
function getSleeperLeagueType(league) {
    const parsedType = Number.parseInt(league?.settings?.type, 10);
    return Number.isFinite(parsedType) ? parsedType : null;
}
function isDynastyLeague(league) {
    return getSleeperLeagueType(league) === SLEEPER_DYNASTY_LEAGUE_TYPE;
}
function filterDynastyLeagues(leagues) {
    return Array.isArray(leagues) ? leagues.filter(isDynastyLeague) : [];
}
if (typeof window !== 'undefined') {
    window.isDynastyLeague = isDynastyLeague;
    window.filterDynastyLeagues = filterDynastyLeagues;
}
async function fetchUserLeagues(userId) {
    const currentYear = new Date().getFullYear();
    const leaguesRes = await fetchWithCache(`${API_BASE}/user/${userId}/leagues/nfl/${currentYear}`);
    if (!Array.isArray(leaguesRes) || leaguesRes.length === 0) throw new Error(`No leagues found for this user for ${currentYear}.`);
    const dynastyLeagues = filterDynastyLeagues(leaguesRes);
    if (dynastyLeagues.length === 0) throw new Error(`No dynasty leagues found for this user for ${currentYear}.`);
    return dynastyLeagues;
}

// === Sleeper player index (global) ===
// Source: Sleeper `/players/nfl`
// Used across pages for:
// - Name/position/team metadata
// - Display formatting (full name vs truncated name)
// - Team logos, etc.
//
// Important: many startup paths call this; keep it single-flight + cached.
async function fetchSleeperPlayers({ force = false } = {}) {
    // In-flight + cache guard: multiple pages/scripts can request the Sleeper player index during startup.
    // This prevents duplicate network requests and keeps startup fast.
    try {
        if (!force && state.players && Object.keys(state.players).length) {
            return state.players;
        }
        if (fetchSleeperPlayers.__inFlight) {
            return fetchSleeperPlayers.__inFlight;
        }
        fetchSleeperPlayers.__inFlight = (async () => {
            try {
                state.players = await fetchWithCache(`${API_BASE}/players/nfl`);
                state.calculatedRankCache = null;
                return state.players;
            } catch (e) {
                console.error("Failed to fetch Sleeper players:", e);
                return null;
            } finally {
                fetchSleeperPlayers.__inFlight = null;
            }
        })();
        return fetchSleeperPlayers.__inFlight;
    } catch (e) {
        console.error("Failed to fetch Sleeper players:", e);
        return null;
    }
}
// Expose for dashboard/home reuse
if (typeof window !== 'undefined') {
    window.fetchSleeperPlayers = fetchSleeperPlayers;
}
async function fetchGameLogs(playerId) {
    if (!state.statsSheetsLoaded) {
        await fetchPlayerStatsSheets();
    } else {
        await ensureSleeperLiveStats();
    }
    const allWeeklyStats = [];
    const weeklyStats = getCombinedWeeklyStats();
    const weeks = Object.keys(weeklyStats).map(Number).sort((a, b) => a - b);
    weeks.forEach(week => {
        const statsForWeek = weeklyStats[week]?.[playerId];
        if (statsForWeek) {
            allWeeklyStats.push({ week, stats: statsForWeek });
        }
    });
    return allWeeklyStats;
}
function getDefaultPlayerRanks() {
    return {
        total_pts: '0.00',
        overallRank: 'NA',
        posRank: 'NA',
        ppg: '0.00',
        ppgOverallRank: 'NA',
        ppgPosRank: 'NA',
    };
}
function formatRankValue(rank) {
    if (typeof rank !== 'number' || !Number.isFinite(rank) || rank <= 0) {
        return 'NA';
    }
    return rank > 999 ? 'NA' : rank;
}
function buildCalculatedRankCache(scoringSettings, leagueId, scoringHash) {
    const playersById = {};
    for (const pId in state.players) {
        playersById[pId] = {
            id: pId,
            pos: state.players[pId]?.position || 'N/A',
            totalPts: 0,
            gamesPlayed: 0,
            ppg: 0,
            overallRank: null,
            posRank: null,
            ppgOverallRank: null,
            ppgPosRank: null,
        };
    }

    // If matchup data is loaded, use it directly for FPTS/PPG calculation
    if (state.matchupDataLoaded && state.leagueMatchupStats) {
        // Track which player+week combos are covered by matchup data
        const matchupCovered = new Set();
        for (const week of Object.keys(state.leagueMatchupStats)) {
            const weekData = state.leagueMatchupStats[week];
            for (const [pId, points] of Object.entries(weekData)) {
                const playerEntry = playersById[pId];
                if (!playerEntry) continue;

                matchupCovered.add(`${pId}_${week}`);
                playerEntry.totalPts += points;
                if (points > 0) {
                    playerEntry.gamesPlayed += 1;
                }
            }
        }
        // Supplement: for players who played (SNP > 0) in weeks NOT covered by
        // matchup data (e.g. they weren't rostered in this league that week),
        // compute league-specific FPTS from their CSV stat line + scoring settings.
        const combinedWeeklyStats = getCombinedWeeklyStats();
        for (const week of Object.keys(combinedWeeklyStats)) {
            const weeklyData = combinedWeeklyStats[week];
            for (const [pId, statLine] of Object.entries(weeklyData)) {
                if (matchupCovered.has(`${pId}_${week}`)) continue;
                const playerEntry = playersById[pId];
                if (!playerEntry) continue;
                // Only count weeks where the player actually played (SNP > 0)
                const snp = statLine?.snp;
                if (typeof snp !== 'number' || snp <= 0) continue;

                const points = calculateFantasyPoints(statLine, scoringSettings);
                playerEntry.totalPts += points;
                if (points > 0) {
                    playerEntry.gamesPlayed += 1;
                }
            }
        }
    } else {
        // Fallback: use combined weekly stats from Google Sheets
        const combinedWeeklyStats = getCombinedWeeklyStats();
        for (const week of Object.keys(combinedWeeklyStats)) {
            const weeklyData = combinedWeeklyStats[week];
            for (const [pId, statLine] of Object.entries(weeklyData)) {
                const playerEntry = playersById[pId];
                if (!playerEntry) continue;

                const points = calculateFantasyPoints(statLine, scoringSettings);

                playerEntry.totalPts += points;
                if (points > 0) {
                    playerEntry.gamesPlayed += 1;
                }
            }
        }
    }

    const entries = Object.values(playersById);
    entries.forEach(entry => {
        entry.ppg = entry.gamesPlayed > 0 ? entry.totalPts / entry.gamesPlayed : 0;
    });

    // Filter players with actual game data for overall rankings
    const playersWithGames = entries.filter(e => e.gamesPlayed > 0 && e.totalPts > 0);

    const totalSorted = playersWithGames.slice().sort((a, b) => b.totalPts - a.totalPts);
    totalSorted.forEach((entry, index) => {
        entry.overallRank = index + 1;
    });
    const posGroups = new Map();
    entries.forEach(entry => {
        const posKey = entry.pos || 'N/A';
        if (!posGroups.has(posKey)) posGroups.set(posKey, []);
        posGroups.get(posKey).push(entry);
    });
    posGroups.forEach(group => {
        // Filter for position ranks too
        const playersWithGamesInPos = group.filter(e => e.gamesPlayed > 0 && e.totalPts > 0);
        playersWithGamesInPos.slice().sort((a, b) => b.totalPts - a.totalPts).forEach((entry, index) => {
            entry.posRank = index + 1;
        });
        playersWithGamesInPos.slice().sort((a, b) => b.ppg - a.ppg).forEach((entry, index) => {
            entry.ppgPosRank = index + 1;
        });
    });
    const ppgSorted = playersWithGames.slice().sort((a, b) => b.ppg - a.ppg);
    ppgSorted.forEach((entry, index) => {
        entry.ppgOverallRank = index + 1;
    });
    const cache = {};
    entries.forEach(entry => {
        cache[entry.id] = {
            total_pts: entry.totalPts.toFixed(1),
            overallRank: formatRankValue(entry.overallRank),
            posRank: formatRankValue(entry.posRank),
            ppg: entry.ppg.toFixed(1),
            ppgOverallRank: formatRankValue(entry.ppgOverallRank),
            ppgPosRank: formatRankValue(entry.ppgPosRank),
        };
    });
    return { leagueId, scoringHash, players: cache };
}
function calculatePlayerStatsAndRanks(playerId) {
    const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
    if (!league) return getDefaultPlayerRanks();
    const scoringSettings = league.scoring_settings || {};
    const scoringHash = JSON.stringify(scoringSettings || {});
    if (!state.calculatedRankCache || state.calculatedRankCache.leagueId !== state.currentLeagueId || state.calculatedRankCache.scoringHash !== scoringHash) {
        state.calculatedRankCache = buildCalculatedRankCache(scoringSettings, league.league_id, scoringHash);
    }
    return state.calculatedRankCache.players[playerId] || getDefaultPlayerRanks();
}
function getStatsPagePlayerRanks(playerId) {
    // ONLY called when state.isGameLogFromStatsPage === true
    // Uses season totals (SZN.csv) + ranks computed by stats.js and passed via state.statsPagePlayerData.
    const statsData = state.statsPagePlayerData;

    if (!statsData) return getDefaultPlayerRanks();

    const fpts = statsData.fpts || 0;
    const ppg = statsData.ppg || 0;
    const gamesPlayed = statsData.gamesPlayed || 0;

    // Use the calculated ranks passed from stats.js
    const posRank = statsData.posRank || null;
    const overallRank = statsData.overallRank || null;
    const ppgPosRank = statsData.ppgPosRank || null;
    const ppgOverallRank = statsData.ppgOverallRank || null;

    return {
        total_pts: fpts.toFixed(1),
        ppg: ppg.toFixed(1),
        posRank: posRank,
        overallRank: overallRank,
        ppgPosRank: ppgPosRank,
        ppgOverallRank: ppgOverallRank,
        gamesPlayed: gamesPlayed
    };
}
// === KTC workbook (Rosters + Stats VALUE/RDP) ===
// Source: `GOOGLE_SHEET_ID` (tabs: `KTC_1QB`, `KTC_SFLX`)
//
// Output:
// - Players: `state.oneQbData[SLPR_ID]` / `state.sflxData[SLPR_ID]`
// - Picks (RDP): `state.oneQbData['2026 Mid 1st']` / `state.sflxData['2026 Mid 1st']` (keyed by `PLAYER NAME`)
//
// NOTE: We intentionally keep this Google Sheets path even while other stats moved to CSV,
// so next season we can re-enable/adjust without rewriting everything.
async function fetchDataFromGoogleSheet({ force = false } = {}) {
    const sheetNames = { oneQb: 'KTC_1QB', sflx: 'KTC_SFLX' };
    // In-flight guard: multiple pages/scripts may call this during startup.
    // Keep it single-flight so we don't duplicate requests to Google Sheets.
    if (!force && state.oneQbData && state.sflxData && Object.keys(state.oneQbData).length && Object.keys(state.sflxData).length) {
        return;
    }
    if (fetchDataFromGoogleSheet.__inFlight) {
        return fetchDataFromGoogleSheet.__inFlight;
    }
    fetchDataFromGoogleSheet.__inFlight = (async () => {
        try {
            const [oneQbCsv, sflxCsv] = await Promise.all([
                fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.oneQb}`).then(res => res.text()),
                fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.sflx}`).then(res => res.text())
            ]);
            state.oneQbData = parseSheetData(oneQbCsv);
            state.sflxData = parseSheetData(sflxCsv);
        } catch (e) {
            console.error("Fatal Error: Could not fetch data from Google Sheet.", e);
        } finally {
            fetchDataFromGoogleSheet.__inFlight = null;
        }
    })();
    return fetchDataFromGoogleSheet.__inFlight;
}
// Parse a KTC workbook tab (CSV) into a lookup map.
// - Player rows are keyed by `SLPR_ID` (Sleeper player id).
// - Pick rows are keyed by `PLAYER NAME` and tagged with `POS = RDP`.
function parseSheetData(csvText) {
    const dataMap = {};
    const { headers, rows } = parseCsv(csvText);
    if (!headers.length || !rows.length) return dataMap;
    const normalizedHeaders = headers.map(normalizeHeader);
    const headerIndex = new Map();
    normalizedHeaders.forEach((header, idx) => {
        headerIndex.set(header.toUpperCase(), idx);
    });
    const normalizeKey = (key) => normalizeHeader(key).toUpperCase();
    const getColumnValue = (columns, names) => {
        const keys = Array.isArray(names) ? names : [names];
        for (const name of keys) {
            const idx = headerIndex.get(normalizeKey(name));
            if (idx !== undefined) {
                const value = columns[idx];
                if (value !== undefined) return value.trim();
            }
        }
        return '';
    };
    const toFloat = (value) => {
        const num = parseFloat(value);
        return Number.isNaN(num) ? null : num;
    };
    const toInt = (value) => {
        const num = parseInt(value, 10);
        return Number.isNaN(num) ? null : num;
    };
    rows.forEach(columns => {
        const posRaw = getColumnValue(columns, 'POS');
        const pos = (posRaw || '').trim().toUpperCase();
        const sleeperId = getColumnValue(columns, 'SLPR_ID');
        const ktcValue = toInt(getColumnValue(columns, ['VALUE', 'KTC']));
        const adp = toFloat(getColumnValue(columns, 'ADP'));
        const posRank = getColumnValue(columns, ['POS·RK', 'POS RK', 'POS_RK']);
        const age = toFloat(getColumnValue(columns, 'AGE'));
        // KTC sheets: overall rank is typically `RANK`, but some tabs may label it differently (e.g. `sca`).
        const overallRank = toInt(getColumnValue(columns, ['RANK', 'OVR', 'OVERALL', 'SCA']));
        // Additional metadata used by the Stats page table (still sourced from this same workbook)
        const tier = toInt(getColumnValue(columns, 'TIER'));
        const trend = toInt(getColumnValue(columns, 'TREND'));
        const rookieYear = toInt(getColumnValue(columns, 'RY'));
        const exp = toInt(getColumnValue(columns, 'EXP'));
        const team = getColumnValue(columns, ['TM', 'TEAM']);
        if (pos === 'RDP') {
            // Picks are consumed elsewhere by name key (e.g., "2026 Early 1st") via `getPickData()`.
            const pickName = getColumnValue(columns, 'PLAYER NAME');
            if (pickName) {
                dataMap[pickName] = {
                    pos: 'RDP',
                    team: team || null,
                    age: age,
                    adp: null,
                    ktc: ktcValue,
                    posRank: null,
                    overallRank: overallRank,
                    tier: tier,
                    trend: trend,
                    rookieYear: rookieYear,
                    exp: exp
                };
            }
            return;
        }
        if (!sleeperId || sleeperId === 'NA') return;
        dataMap[sleeperId] = {
            pos: pos || null,
            team: team || null,
            age: age,
            adp: adp,
            ktc: ktcValue,
            posRank: posRank || null,
            overallRank: overallRank,
            tier: tier,
            trend: trend,
            rookieYear: rookieYear,
            exp: exp
        };
    });
    return dataMap;
}
// In-flight guard so we only load the player stats dataset once per session,
// even if background prefetch + a user click triggers concurrent requests.
let playerStatsSheetsLoadPromise = null;
const playerStatsTextCache = new Map();
function getAppRootPrefix() {
    // HTML pages live either at app root (`index.html`) or one directory deep (`/rosters/*`, `/stats/*`, etc.).
    // This keeps data fetches working across all pages.
    return pageType === 'welcome' ? '' : '../';
}
function buildAppStaticUrl(pathFromAppRoot) {
    const raw = String(pathFromAppRoot || '');
    const normalized = raw.replace(/^\/+/, '');
    return `${getAppRootPrefix()}${normalized}`;
}
async function fetchTextWithCache(url) {
    const key = String(url);
    if (playerStatsTextCache.has(key)) return playerStatsTextCache.get(key);
    const promise = fetch(key)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch ${key}: ${res.status}`);
            }
            return res.text();
        })
        .catch((err) => {
            playerStatsTextCache.delete(key);
            throw err;
        });
    playerStatsTextCache.set(key, promise);
    return promise;
}
function shouldUsePlayerStatsGoogleSheets() {
    try {
        // Rosters page should always use shipped CSVs for player stats (SZN + weekly),
        // so the SZN modal reflects the local data source consistently.
        if (pageType === 'rosters') return false;
        const params = new URLSearchParams(window.location.search);
        const raw = (params.get(PLAYER_STATS_SOURCE_QUERY_PARAM) || '').trim().toLowerCase();
        return raw === 'sheets' || raw === 'sheet' || raw === 'google';
    } catch (e) {
        return false;
    }
}
async function loadPlayerStatsFromCsvFiles() {
    const seasonPromise = fetchTextWithCache(buildAppStaticUrl(PLAYER_STATS_CSV_PATHS.season));
    const seasonRanksPromise = fetchTextWithCache(buildAppStaticUrl(PLAYER_STATS_CSV_PATHS.seasonRanks));
    // Fetch stats for completed weeks (from PLAYER_STATS_SHEETS.weeks)
    const weeklyPromises = Object.entries(PLAYER_STATS_SHEETS.weeks).map(async ([week, sheetName]) => {
        const csvPath = `${PLAYER_STATS_CSV_PATHS.weeksDir}/${sheetName}.csv`;
        const csv = await fetchTextWithCache(buildAppStaticUrl(csvPath));
        return { week: Number(week), csv, hasFullStats: true };
    });
    // Fetch projection data for remaining weeks up to MAX_DISPLAY_WEEKS
    const completedWeeks = Object.keys(PLAYER_STATS_SHEETS.weeks).map(Number);
    const maxCompletedWeek = completedWeeks.length > 0 ? Math.max(...completedWeeks) : 0;
    const projectionPromises = [];
    for (let week = maxCompletedWeek + 1; week <= MAX_DISPLAY_WEEKS; week++) {
        const sheetName = `WK${week}`;
        const csvPath = `${PLAYER_STATS_CSV_PATHS.weeksDir}/${sheetName}.csv`;
        projectionPromises.push(
            fetchTextWithCache(buildAppStaticUrl(csvPath))
                .then(csv => ({ week, csv, hasFullStats: false }))
                .catch(() => ({ week, csv: null, hasFullStats: false })) // Handle missing weeks gracefully
        );
    }
    const [seasonCsv, seasonRanksCsv, ...allWeeklyCsvs] = await Promise.all([
        seasonPromise,
        seasonRanksPromise,
        ...weeklyPromises,
        ...projectionPromises
    ]);
    return { seasonCsv, seasonRanksCsv, allWeeklyCsvs };
}
// Kept for next season / rapid rollback. Do not remove.
async function loadPlayerStatsFromGoogleSheets() {
    const seasonPromise = fetchTextWithCache(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.season}`);
    const seasonRanksPromise = fetchTextWithCache(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.seasonRanks}`);
    // Fetch stats for completed weeks (from PLAYER_STATS_SHEETS.weeks)
    const weeklyPromises = Object.entries(PLAYER_STATS_SHEETS.weeks).map(async ([week, sheetName]) => {
        const csv = await fetchTextWithCache(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`);
        return { week: Number(week), csv, hasFullStats: true };
    });
    // Fetch projection data for remaining weeks up to MAX_DISPLAY_WEEKS
    const completedWeeks = Object.keys(PLAYER_STATS_SHEETS.weeks).map(Number);
    const maxCompletedWeek = completedWeeks.length > 0 ? Math.max(...completedWeeks) : 0;
    const projectionPromises = [];
    for (let week = maxCompletedWeek + 1; week <= MAX_DISPLAY_WEEKS; week++) {
        const sheetName = `WK${week}`;
        projectionPromises.push(
            fetchTextWithCache(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`)
                .then(csv => ({ week, csv, hasFullStats: false }))
                .catch(() => ({ week, csv: null, hasFullStats: false })) // Handle missing sheets gracefully
        );
    }
    const [seasonCsv, seasonRanksCsv, ...allWeeklyCsvs] = await Promise.all([
        seasonPromise,
        seasonRanksPromise,
        ...weeklyPromises,
        ...projectionPromises
    ]);
    return { seasonCsv, seasonRanksCsv, allWeeklyCsvs };
}
async function fetchPlayerStatsSheets() {
    if (state.statsSheetsLoaded) {
        await ensureSleeperLiveStats();
        return;
    }
    if (playerStatsSheetsLoadPromise) {
        await playerStatsSheetsLoadPromise;
        return;
    }
    playerStatsSheetsLoadPromise = (async () => {
        try {
            // Default path: local CSVs (no Google Sheets fetches for SZN/SZN_RKs/WK1..WK18).
            // Opt-in Sheets loader: `?playerStatsSource=sheets`
            const { seasonCsv, seasonRanksCsv, allWeeklyCsvs } = shouldUsePlayerStatsGoogleSheets()
                ? await loadPlayerStatsFromGoogleSheets()
                : await loadPlayerStatsFromCsvFiles();
            state.playerSeasonStats = parseSeasonStatsCsv(seasonCsv);
            state.playerSeasonRanks = parseSeasonRanksCsv(seasonRanksCsv);
            state.seasonRankCache = computeSeasonRankings(state.playerSeasonStats);
            const weeklyStats = {};
            const projectionWeeks = {};
            allWeeklyCsvs.forEach(({ week, csv, hasFullStats }) => {
                if (csv) {
                    weeklyStats[week] = parseWeeklyStatsCsv(csv);
                    if (!hasFullStats) {
                        projectionWeeks[week] = true; // Mark this week as projection-only
                    }
                }
            });
            state.playerWeeklyStats = weeklyStats;
            state.weeklyStats = weeklyStats;
            state.playerProjectionWeeks = projectionWeeks;
            state.statsSheetsLoaded = true;
            state.liveStatsLoaded = false;
            state.calculatedRankCache = null;
            await ensureSleeperLiveStats();
        } catch (error) {
            console.error('Failed to fetch player stats (CSV/Sheets).', error);
            state.playerSeasonStats = {};
            state.playerSeasonRanks = {};
            state.playerWeeklyStats = {};
            state.weeklyStats = {};
            state.playerProjectionWeeks = {};
            state.seasonRankCache = null;
            state.statsSheetsLoaded = false;
            state.liveWeeklyStats = {};
            state.liveStatsLoaded = true;
            state.calculatedRankCache = null;
        } finally {
            playerStatsSheetsLoadPromise = null;
        }
    })();
    await playerStatsSheetsLoadPromise;
}
// Expose for dashboard/home reuse
if (typeof window !== 'undefined') {
    window.fetchPlayerStatsSheets = fetchPlayerStatsSheets;
}
async function ensureSleeperLiveStats(force = false) {
    if (!force && state.liveStatsLoaded) {
        const knownWeek = state.currentNflWeek;
        const lastFetchedWeek = state.lastLiveStatsWeek;
        if (Number.isFinite(knownWeek) && knownWeek === lastFetchedWeek) {
            const now = Date.now();
            if (state.lastLiveStatsFetchTs && (now - state.lastLiveStatsFetchTs) < 5 * 60 * 1000) {
                return;
            }
        }
    }
    await fetchSleeperLiveStats();
}
async function fetchSleeperLiveStats() {
    const sheetWeeks = Object.keys(state.playerWeeklyStats || {}).map(week => Number(week)).filter(week => Number.isFinite(week));
    const latestSheetWeek = sheetWeeks.length > 0 ? Math.max(...sheetWeeks) : 0;
    const existingLiveStats = state.liveWeeklyStats && typeof state.liveWeeklyStats === 'object'
        ? Object.keys(state.liveWeeklyStats).reduce((acc, week) => {
            const weekStats = state.liveWeeklyStats[week];
            if (!weekStats || typeof weekStats !== 'object') return acc;
            acc[week] = { ...weekStats };
            return acc;
        }, {})
        : {};
    try {
        const response = await fetch(`${API_BASE}/state/nfl`);
        if (!response.ok) throw new Error(`Sleeper state request failed: ${response.status}`);
        const sleeperState = await response.json();
        const season = sleeperState?.season || null;
        const currentWeek = Number(sleeperState?.week);
        state.currentNflSeason = season;
        state.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;
        if (!season || !Number.isFinite(currentWeek) || currentWeek <= 0) {
            state.liveWeeklyStats = existingLiveStats;
            return;
        }
        const liveWeeklyStats = { ...existingLiveStats };
        const fetchStartWeek = Math.max(Math.min(latestSheetWeek + 1, currentWeek), 1);
        for (let week = fetchStartWeek; week <= currentWeek; week++) {
            try {
                const statsResponse = await fetch(`${API_BASE}/stats/nfl/regular/${season}/${week}`);
                if (!statsResponse.ok) throw new Error(`Sleeper stats request failed: ${statsResponse.status}`);
                const statsData = await statsResponse.json();
                if (!statsData || typeof statsData !== 'object') continue;
                const weekStats = {};
                for (const [playerId, statLine] of Object.entries(statsData)) {
                    if (!statLine) continue;
                    const override = Number(statLine?.pts_ppr ?? statLine?.pts ?? statLine?.pts_ppr_total ?? statLine?.fantasy_points_ppr);
                    if (!Number.isFinite(override)) continue;
                    weekStats[playerId] = {
                        fpts: override,
                        fpts_override: override,
                        __live: true
                    };
                }
                if (Object.keys(weekStats).length > 0) {
                    liveWeeklyStats[week] = weekStats;
                }
            } catch (weekError) {
                console.warn(`Unable to fetch live fantasy points for week ${week}.`, weekError);
            }
        }
        state.liveWeeklyStats = liveWeeklyStats;
        state.lastLiveStatsWeek = currentWeek;
        state.calculatedRankCache = null;
    } catch (error) {
        console.warn('Sleeper live stats unavailable.', error);
        state.liveWeeklyStats = existingLiveStats;
        if (!Number.isFinite(state.lastLiveStatsWeek) && Number.isFinite(state.currentNflWeek)) {
            state.lastLiveStatsWeek = state.currentNflWeek;
        }
        state.calculatedRankCache = null;
    } finally {
        state.liveStatsLoaded = true;
        state.lastLiveStatsFetchTs = Date.now();
    }
}
async function fetchLeagueMatchupData(leagueId, maxWeek = null) {
    if (!leagueId) {
        console.warn('fetchLeagueMatchupData: No league ID provided');
        return;
    }
    try {
        const currentWeek = maxWeek || state.currentNflWeek || 18;
        const matchupStats = {};

        // Fetch matchups for each week (1 through current week)
        const weekPromises = [];
        for (let week = 1; week <= currentWeek; week++) {
            weekPromises.push(
                fetchWithCache(`${API_BASE}/league/${leagueId}/matchups/${week}`)
                    .then(matchups => ({ week, matchups }))
                    .catch(err => {
                        console.warn(`Failed to fetch matchup data for week ${week}:`, err);
                        return { week, matchups: null };
                    })
            );
        }

        const results = await Promise.all(weekPromises);

        // Process matchup data
        results.forEach(({ week, matchups }) => {
            if (!matchups || !Array.isArray(matchups)) return;

            matchupStats[week] = {};

            // Each matchup has players_points: { playerId: fpts }
            matchups.forEach(matchup => {
                if (matchup.players_points && typeof matchup.players_points === 'object') {
                    Object.entries(matchup.players_points).forEach(([playerId, fpts]) => {
                        if (Number.isFinite(fpts)) {
                            matchupStats[week][playerId] = fpts;
                        }
                    });
                }
            });
        });

        state.leagueMatchupStats = matchupStats;
        state.matchupDataLoaded = true;
        console.log(`✅ Loaded matchup data for ${Object.keys(matchupStats).length} weeks`);
    } catch (error) {
        console.error('Error fetching league matchup data:', error);
        state.matchupDataLoaded = false;
    }
}
function getCombinedWeeklyStats() {
    const combined = {};
    const baseWeeklyStats = state.weeklyStats || {};
    Object.entries(baseWeeklyStats).forEach(([week, stats]) => {
        const clonedWeek = {};
        Object.entries(stats || {}).forEach(([playerId, statLine]) => {
            clonedWeek[playerId] = { ...(statLine || {}) };
        });
        combined[week] = clonedWeek;
    });
    const liveWeeklyStats = state.liveWeeklyStats || {};
    Object.entries(liveWeeklyStats).forEach(([week, stats]) => {
        if (!combined[week]) combined[week] = {};
        const weekBucket = combined[week];
        const isProjectionWeek = state.playerProjectionWeeks?.[Number(week)] === true;
        Object.entries(stats || {}).forEach(([playerId, liveLine]) => {
            const existing = weekBucket[playerId] ? { ...(weekBucket[playerId]) } : {};
            const merged = { ...existing, ...(liveLine || {}) };
            const liveFpts = Number.isFinite(liveLine?.fpts)
                ? liveLine.fpts
                : (Number.isFinite(liveLine?.fpts_override) ? liveLine.fpts_override : null);
            if (liveFpts !== null) {
                merged.fpts = liveFpts;
                merged.fpts_override = liveFpts;
            }
            if (liveLine && liveLine.__live === true && (isProjectionWeek || Object.keys(existing).length === 0)) {
                merged.__live = true;
            } else if (!isProjectionWeek && merged.__live) {
                delete merged.__live;
            }
            weekBucket[playerId] = merged;
        });
    });
    return combined;
}
function getAdjustedGamesPlayed(playerId, scoringSettings = null) {
    const baseGames = state.playerSeasonStats?.[playerId]?.games_played;
    const initialGames = Number.isFinite(baseGames) ? baseGames : Number(baseGames) || 0;
    const liveWeeklyStats = state.liveWeeklyStats || {};
    let additionalGames = 0;
    for (const [week, stats] of Object.entries(liveWeeklyStats)) {
        if (state.weeklyStats && state.weeklyStats[week]) continue;
        const playerWeek = stats?.[playerId];
        if (!playerWeek) continue;
        const points = calculateFantasyPoints(playerWeek, scoringSettings || {});
        if (points > 0) additionalGames += 1;
    }
    return initialGames + additionalGames;
}

// ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
// Stats being Pulled from CSVs
// ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦

const PLAYER_STAT_HEADER_MAP = {
  'paATT': 'pass_att',
  'CMP': 'pass_cmp',
  // Weekly CSVs may use `CMP PCT` instead of `CMP%` — treat them the same.
  'CMP PCT': 'cmp_pct',
  'CMP%': 'cmp_pct',
  'paYDS': 'pass_yd',
  'paTD': 'pass_td',
  'pa1D': 'pass_fd',
    'EPA/DB': 'epa_per_db',
    'CPOE': 'cpoe',
    'DP%': 'dp_pct',
    'IMP/G': 'imp_per_g',
    'paRTG': 'pass_rtg',
    'pIMP': 'pass_imp',
    'pIMP/A': 'pass_imp_per_att',
    'INT': 'pass_int',
    'SAC': 'pass_sack',
    'TTT': 'ttt',
    'PRS%': 'prs_pct',
    'CAR': 'rush_att',
    'ruYDS': 'rush_yd',
    'YPC': 'ypc',
    'ruTD': 'rush_td',
    'ru1D': 'rush_fd',
    'MTF': 'mtf',
    'ELU': 'elu',
    'RYOE': 'ryoe',
    'YCO': 'rush_yac',
    'YCO/A': 'yco_per_att',
    // Game Logs modal + shared stat labels: accept both legacy `ExplRu%` and new `EXPLSV%`
    // season/rank CSV headers while keeping one internal rushing-percentage key.
    'ExplRu%': 'expl_ru_pct',
    'EXPLSV%': 'expl_ru_pct',
    'MTF/A': 'mtf_per_att',
    'TGT': 'rec_tgt',
    'REC': 'rec',
    'recYDS': 'rec_yd',
    'recTD': 'rec_td',
    'rec1D': 'rec_fd',
    'YAC': 'rec_yar',
    'YPR': 'ypr',
    'RR': 'rr',
    // Game Logs SZN view: map red-zone targets from CSV to the shared receiving stat key.
    'RZ Tgt': 'rz_tgt',
    'TS%': 'ts_per_rr',
    'CSTY%': 'csty_pct',
    'YPRR': 'yprr',
    '1DRR': 'first_down_rec_rate',
    'IMP': 'imp',
    'FUM': 'fum',
    'SNP': 'snp',
    'SNP%': 'snp_pct',
    'YDS(t)': 'yds_total',
    'FPOE': 'fpoe',
    'aFPOE': 'fpoe',
    'CL': 'ceiling',
    'YPG(t)': 'ypg',
    'paYPG': 'pa_ypg',
    'ruYPG': 'ru_ypg',
    'recYPG': 'rec_ypg',
    'AY%': 'ay_pct',
    'PROJ': 'proj',
    'FPT_PPR': 'fpt_ppr',
    'FPTS_PPR': 'fpt_ppr'
};
// ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦

const WEEKLY_META_HEADER_MAP = {
    'VS': 'opponent',
    'vsRK': 'opponent_rank'
};
// === Label builder and no-fallback config (added) ===
function buildStatLabels() {
    const labels = {};
    for (const [header, key] of Object.entries(PLAYER_STAT_HEADER_MAP)) {
        labels[key] = header;
    }
    labels['fpts'] = 'FPTS'; // computed, not from sheet
    labels['ppg'] = 'PPG';   // keep if used elsewhere
    labels['ts_per_rr'] = 'TS%';
    labels['fpoe'] = 'FPOE';
    // Game Logs modal SZN view + shared stats key: always show the updated explosive-rush label.
    labels['expl_ru_pct'] = 'EXPLSV%';
    return labels;
}
// Stats that must not use code-derived fallbacks; sheet is source of truth
const NO_FALLBACK_KEYS = new Set([
    'yprr',
    'ts_per_rr',
    'imp_per_g',
    'epa_per_db',
    'cpoe',
    'snp_pct',
    'prs_pct',
    'ypr',
    'first_down_rec_rate',
    'expl_ru_pct'
]);
const SEASON_META_HEADERS = {
    'POS': 'pos',
    'TM': 'team',
    'GM_P': 'games_played'
};
const SEASON_VALUE_HEADERS = {
    'FPT_PPR': 'fpts_ppr',
    'FPTS_PPR': 'fpts_ppr',
    'PRK_PPR': 'pos_rank_ppr'
};
function parseSeasonStatsCsv(csvText) {
    const { headers, rows } = parseCsv(csvText);
    const normalizedHeaders = headers.map(normalizeHeader);
    const hasAltFpoe = normalizedHeaders.includes('aFPOE');
    const result = {};
    rows.forEach(columns => {
        let playerId = null;
        const stats = {};
        normalizedHeaders.forEach((header, idx) => {
            const value = columns[idx];
            if (!value) return;
            if (header === 'SLPR_ID') {
                playerId = value.trim();
                return;
            }
            if (header === 'FPOE' && hasAltFpoe) return;
            const statKey = PLAYER_STAT_HEADER_MAP[header];
            if (statKey) {
                const parsedValue = parseStatValue(header, value);
                if (parsedValue !== null) stats[statKey] = parsedValue;
                return;
            }
            const metaKey = SEASON_META_HEADERS[header];
            if (metaKey) {
                if (metaKey === 'games_played') {
                    const num = parseFloat(value);
                    if (!Number.isNaN(num)) stats[metaKey] = num;
                } else {
                    const trimmed = value.trim();
                    if (trimmed) stats[metaKey] = trimmed;
                }
                return;
            }
            const valueKey = SEASON_VALUE_HEADERS[header];
            if (valueKey) {
                const parsed = parseSeasonValue(header, value);
                if (parsed !== null) stats[valueKey] = parsed;
                return;
            }
        });
        if (playerId) {
            // Ownership value table + modal both consume season FPTS. Preserve both keys to avoid
            // header-name differences (`FPT_PPR` vs `FPTS_PPR`) causing missing table values.
            if (!Number.isFinite(stats.fpts_ppr) && Number.isFinite(stats.fpt_ppr)) {
                stats.fpts_ppr = stats.fpt_ppr;
            }
            if (!Number.isFinite(stats.fpt_ppr) && Number.isFinite(stats.fpts_ppr)) {
                stats.fpt_ppr = stats.fpts_ppr;
            }
            result[playerId] = stats;
        }
    });
    return result;
}
function parseSeasonRanksCsv(csvText) {
    const { headers, rows } = parseCsv(csvText);
    const normalizedHeaders = headers.map(normalizeHeader);
    const result = {};
    rows.forEach(columns => {
        let playerId = null;
        const ranks = {};
        normalizedHeaders.forEach((header, idx) => {
            const value = columns[idx];
            if (!value) return;
            if (header === 'SLPR_ID') {
                playerId = value.trim();
                return;
            }
            const statKey = PLAYER_STAT_HEADER_MAP[header] || SEASON_VALUE_HEADERS[header];
            if (!statKey) return;
            const parsedRank = parseRankValue(value);
            if (parsedRank !== null) ranks[statKey] = parsedRank;
        });
        if (playerId) {
            result[playerId] = ranks;
        }
    });
    return result;
}
function parseSeasonValue(header, value) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toUpperCase() === 'NA') return null;
    if (header === 'PRK_PPR') {
        const intVal = parseInt(trimmed, 10);
        return Number.isNaN(intVal) ? null : intVal;
    }
    const numVal = parseFloat(trimmed);
    return Number.isNaN(numVal) ? null : numVal;
}
function parseRankValue(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const upper = trimmed.toUpperCase();
    if (upper === 'NA' || upper === 'N/A') return null;
    const numVal = parseFloat(trimmed);
    return Number.isNaN(numVal) ? null : numVal;
}
const STAT_KEY_RANK_OVERRIDES = { fpts: 'fpts_ppr' };
function getSeasonRankKey(statKey) {
    return STAT_KEY_RANK_OVERRIDES[statKey] || statKey;
}
function getSeasonRankValue(playerId, statKey) {
    const normalizeRank = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }
        if (typeof value === 'string') {
            return parseRankValue(value) ?? null;
        }
        return parseRankValue(String(value)) ?? null;
    };
    if (statKey === 'fpts' || statKey === 'ppg') {
        // Prefer the currently-open modal's computed ranks (matches summary chips exactly).
        const modalRanks = state.currentGameLogsPlayerRanks;
        if (modalRanks) {
            const liveRank = statKey === 'fpts' ? modalRanks.posRank : modalRanks.ppgPosRank;
            const normalizedLiveRank = normalizeRank(liveRank);
            if (normalizedLiveRank !== null) {
                return normalizedLiveRank;
            }
        }
        // Stats page uses pre-calculated ranks from sheets
        if (state.isGameLogFromStatsPage && state.statsPagePlayerData) {
            const liveRank = statKey === 'fpts'
                ? state.statsPagePlayerData.posRank
                : state.statsPagePlayerData.ppgPosRank;
            const normalizedLiveRank = normalizeRank(liveRank);
            if (normalizedLiveRank !== null) {
                return normalizedLiveRank;
            }
        }
        // Rosters page calculates ranks from league matchup data
        if (typeof calculatePlayerStatsAndRanks === 'function') {
            const ranks = calculatePlayerStatsAndRanks(playerId);
            if (ranks) {
                const liveRank = statKey === 'fpts' ? ranks.posRank : ranks.ppgPosRank;
                const normalizedLiveRank = normalizeRank(liveRank);
                if (normalizedLiveRank !== null) {
                    return normalizedLiveRank;
                }
            }
        }
        return null;
    }
    const ranks = state.playerSeasonRanks?.[playerId];
    if (!ranks) return null;
    const key = getSeasonRankKey(statKey);
    if (!(key in ranks)) return null;
    const value = ranks[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const upper = trimmed.toUpperCase();
        if (upper === 'NA' || upper === 'N/A') return null;
        const parsed = parseFloat(trimmed);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
}
function getRankDisplayText(rank) {
    if (rank === null || rank === undefined || Number.isNaN(rank)) {
        return 'NA';
    }
    const rankStr = String(rank).trim();
    if (!rankStr) return 'NA';
    const upper = rankStr.toUpperCase();
    if (upper === 'NA' || upper === 'N/A') return 'NA';
    return rankStr;
}

function getPlayerRadarData(playerId, position) {
    const config = RADAR_STATS_CONFIG[position];
    if (!config) return null;

    const radarData = {
        labels: config.labels,
        ranks: [],
        rawRanks: [],
        statValues: [],
        statKeys: config.stats, // Keep stat keys so radar values can be formatted later
        maxRank: config.maxRank
    };

    // Start with season footer numbers already calculated for this modal.
    const footerStats = state.currentGameLogsFooterStats || {};
    const seasonTotals = state.playerSeasonStats?.[playerId] || null;
    const playerRanks = state.currentGameLogsPlayerRanks || null;
    const summarySnapshot = state.currentGameLogsSummary || null;

    config.stats.forEach(statKey => {
        const rankValue = getSeasonRankValue(playerId, statKey);
        radarData.rawRanks.push(rankValue);

        let statValue;

        // Always use playerRanks.ppg for PPG so it matches the summary chips.
        if (statKey === 'ppg') {
            statValue = playerRanks?.ppg;
        } else {
            // For all other stats, try the footer value first.
            statValue = footerStats[statKey];

            if (statValue === undefined) {
                if (statKey === 'fpts') {
                    if (summarySnapshot && summarySnapshot.fpts !== undefined) {
                        statValue = summarySnapshot.fpts;
                    }
                    if (statValue === undefined) {
                        if (state.isGameLogFromStatsPage && state.statsPagePlayerData) {
                            statValue = state.statsPagePlayerData.fpts || state.statsPagePlayerData.totalPts || null;
                        } else if (seasonTotals && typeof seasonTotals.fpts_ppr === 'number') {
                            statValue = seasonTotals.fpts_ppr;
                        }
                    }
                } else if (statKey === 'ypc') {
                    if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                        const totalYards = typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : 0;
                        statValue = totalYards / seasonTotals.rush_att;
                    }
                } else if (statKey === 'yco_per_att') {
                    if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                        const totalYco = typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : 0;
                        statValue = totalYco / seasonTotals.rush_att;
                    }
                } else if (statKey === 'mtf_per_att') {
                    if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                        const totalMtf = typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : 0;
                        statValue = totalMtf / seasonTotals.rush_att;
                    }
                } else if (statKey === 'pass_imp_per_att') {
                    if (seasonTotals && typeof seasonTotals.pass_att === 'number' && seasonTotals.pass_att > 0) {
                        const totalImp = typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : 0;
                        statValue = (totalImp / seasonTotals.pass_att) * 100;
                    }
                } else if (seasonTotals && typeof seasonTotals[statKey] === 'number') {
                    statValue = seasonTotals[statKey];
                } else {
                    statValue = null;
                }
            }
        }
        if (typeof statValue === 'string') {
            const trimmed = statValue.trim();
            if (trimmed.length === 0) {
                statValue = null;
            } else if (statKey === 'fpts' || statKey === 'ppg') {
                statValue = trimmed;
            } else {
                const numericCandidate = Number(trimmed);
                statValue = Number.isNaN(numericCandidate) ? trimmed : numericCandidate;
            }
        }
        radarData.statValues.push(statValue);

        // Convert rank to radar distance on a 10..85 scale.
        // rank 1 -> 85, rank 7 -> ~73, rank maxRank -> 10
        if (rankValue === null || rankValue === undefined || Number.isNaN(rankValue)) {
            radarData.ranks.push(10); // No rank data stays near the center.
        } else if (rankValue <= 1) {
            radarData.ranks.push(85); // Best rank sits near the outer ring.
        } else if (rankValue >= config.maxRank) {
            radarData.ranks.push(10); // Worst rank stays close to center.
        } else if (rankValue <= 7) {
            // Keep top-7 ranks tightly grouped near the outer edge.
            // rank 1 = 85, rank 7 = 73
            const scaledValue = 85 - ((rankValue - 1) / 6) * 12;
            radarData.ranks.push(scaledValue);
        } else {
            // Spread remaining ranks from 73 down to 10.
            const scaledValue = 73 - ((rankValue - 7) / (config.maxRank - 7)) * 63;
            radarData.ranks.push(scaledValue);
        }
    });

    return radarData;
}

// Custom Chart.js plugins used by the Game Logs performance radar chart.
const playerRadarBackgroundPlugin = {
    id: 'playerRadarBackground',
    beforeDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale) return;
        const { ctx } = chart;
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const angleStep = (Math.PI * 2) / chart.data.labels.length;
        const startAngle = -Math.PI / 2; // Start at top
        const maxRadius = scale.drawingArea;

        const levels = options.levels || [];

        levels.forEach((level) => {
            const radius = maxRadius * (level.ratio ?? 1);
            ctx.beginPath();
            ctx.strokeStyle = level.stroke || 'rgba(151, 166, 210, 0.15)';
            ctx.fillStyle = level.fill || 'transparent';
            ctx.lineWidth = 1;

            chart.data.labels.forEach((label, index) => {
                const angle = startAngle + angleStep * index;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }
};

const playerRadarLabelPlugin = {
    id: 'playerRadarLabels',
    afterDatasetsDraw(chart, args, options) {
        const dataset = chart.data.datasets[0];
        if (!dataset || !dataset.data) return;

        const { ctx } = chart;
        const scale = chart.scales?.r;
        if (!scale) return;

        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const angleStep = (Math.PI * 2) / chart.data.labels.length;
        const startAngle = -Math.PI / 2;

        // Returns "st/nd/rd/th" for a rank number.
        const getOrdinalSuffix = (n) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return s[(v - 20) % 10] || s[v] || s[0];
        };

        ctx.font = options.font || '11px "Product Sans"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        dataset.data.forEach((value, index) => {
            const angle = startAngle + angleStep * index;
            const dataPoint = scale.getPointPositionForValue(index, value);

            // Base text distance from each plotted point.
            let offsetDistance = options.offset || 18;

            // Top and top-right points: pull rank text in a bit.
            if (index === 0 || index === 1) {
                offsetDistance -= 1.5;
            }
            // Top-left point: push rank text out slightly.
            else if (index === 7) {
                offsetDistance += 3.5;
            }
            // Left-lower point: push rank text out slightly.
            else if (index === 5) {
                offsetDistance += 4;
            }
            // Leftmost point: push rank text out more to avoid overlap.
            else if (index === 6) {
                offsetDistance += 7;
            }

            const offsetX = Math.cos(angle) * offsetDistance;
            const offsetY = Math.sin(angle) * offsetDistance;

            const rawRank = dataset.rawRanks?.[index];
            let label;
            if (rawRank !== null && rawRank !== undefined && !Number.isNaN(rawRank)) {
                const rankNum = Math.round(rawRank);
                const suffix = getOrdinalSuffix(rankNum);
                label = rankNum.toString();

                // Color rank text by rank quality.
                const rankColor = getConditionalColorByRank(rawRank, dataset.position);
                ctx.fillStyle = rankColor;

                // Draw rank number.
                ctx.fillText(label, dataPoint.x + offsetX, dataPoint.y + offsetY);

                // Draw ordinal suffix smaller, on the same baseline.
                const metrics = ctx.measureText(label);
                const suffixFontSize = parseInt(ctx.font) * 0.7; // 70% of original size
                ctx.font = `${suffixFontSize}px "Product Sans"`;
                // Place suffix to the right of the number.
                ctx.fillText(suffix, dataPoint.x + offsetX + (metrics.width / 2) + 4, dataPoint.y + offsetY);

                // Restore font for the next label.
                ctx.font = options.font || '11px "Product Sans"';
            } else {
                label = 'NA';
                const rankColor = getConditionalColorByRank(rawRank, dataset.position);
                ctx.fillStyle = rankColor;
                ctx.fillText(label, dataPoint.x + offsetX, dataPoint.y + offsetY);
            }
        });
    }
};

const playerRadarAxisLabelsPlugin = {
    id: 'playerRadarAxisLabels',
    afterDraw(chart, args, options) {
        const scale = chart.scales?.r;
        if (!scale) return;
        const dataset = chart.data.datasets[0];
        if (!dataset) return;
        const labels = chart.data.labels;
        if (!labels || !labels.length) return;

        const isMobile = window.matchMedia('(max-width: 640px)').matches;
        const labelFontSize = isMobile ? (options?.labelFontSizeMobile ?? 11) : (options?.labelFontSize ?? 12);
        const valueFontSize = isMobile ? (options?.valueFontSizeMobile ?? 9) : (options?.valueFontSize ?? 10);
        const labelFont = `${labelFontSize}px "Product Sans", "Google Sans", sans-serif`;
        const valueFont = `${valueFontSize}px "Product Sans", "Google Sans", sans-serif`;
        const labelColor = options?.labelColor || '#EAEBF0';
        const labelOffset = options?.labelOffset ?? (isMobile ? 14 : 18);
        // Extra distance only for index 0 (FPTS at top).
        const topLabelExtraOffset = options?.topLabelExtraOffset ?? (isMobile ? 10 : 12);
        // Per-axis spacing tweaks for crowded spots in the Game Logs performance radar.
        // This changes distance only; label/value center alignment is kept.
        const axisLabelExtraOffsetsByIndex = options?.axisLabelExtraOffsetsByIndex ?? {
            1: 17, // upper-right diagonal – pushed further from radar
            2: 14, // right side – nudged a touch further
            3: 10, // lower-right diagonal – pushed further from radar
            5: 13, // lower-left diagonal – pushed further from radar
            6: 18, // left side – nudged a touch further
            7: 21  // upper-left diagonal – pushed further from radar
        };
        const valueSpacing = options?.valueSpacing ?? (isMobile ? 3 : 4);

        const { ctx } = chart;
        const angleStep = (Math.PI * 2) / labels.length;
        const startAngle = -Math.PI / 2;

        ctx.save();
        for (let index = 0; index < labels.length; index++) {
            const angle = startAngle + angleStep * index;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            let textBaseline;
            if (Math.abs(sin) <= 1e-4) {
                textBaseline = 'middle';
            } else {
                textBaseline = sin < 0 ? 'bottom' : 'top';
            }

            // Keep stat name and value centered with each other.
            const textAlign = 'center';

            // Index 0 (FPTS at top) gets extra space from the outer ring.
            // Per-axis spacing tweaks are added below.
            let effectiveOffset = labelOffset;
            if (index === 0) effectiveOffset = labelOffset + topLabelExtraOffset;
            const axisExtraOffset = Number(axisLabelExtraOffsetsByIndex[index]);
            if (Number.isFinite(axisExtraOffset)) {
                effectiveOffset += axisExtraOffset;
            }
            const radius = scale.drawingArea + effectiveOffset;
            const x = scale.xCenter + cos * radius;
            const y = scale.yCenter + sin * radius;

            const labelText = (typeof labels[index] === 'string')
                ? labels[index]
                : String(labels[index] ?? '');

            ctx.font = labelFont;
            ctx.textAlign = textAlign;
            ctx.textBaseline = textBaseline;
            ctx.fillStyle = labelColor;
            ctx.fillText(labelText, x, y);

            const statKey = dataset.statKeys?.[index];
            const statValue = dataset.statValues?.[index];
            const formattedValue = formatRadarStatValue(statKey, statValue);
            const rawRank = dataset.rawRanks?.[index];
            const valueColor = getConditionalColorByRank(rawRank, dataset.position) || labelColor;

            let valueY = y;
            if (textBaseline === 'top') {
                valueY = y + labelFontSize + valueSpacing;
            } else if (textBaseline === 'middle') {
                valueY = y + (labelFontSize / 2) + valueSpacing;
            } else {
                valueY = y + valueSpacing;
            }

            ctx.font = valueFont;
            ctx.textBaseline = 'top';
            ctx.fillStyle = valueColor;
            ctx.fillText(`• ${formattedValue} •`, x, valueY);
        }
        ctx.restore();
    }
};

function createRankAnnotation(rank, { wrapInParens = true, ordinal = false, variant = 'default' } = {}) {
    const span = document.createElement('span');
    // base class plus variant-specific class so CSS can target per-context
    span.className = `stat-rank-annotation stat-rank-variant-${variant}`;
    const displayText = getRankDisplayText(rank);
    // Helper: return ordinal suffix for integer n
    const ordinalSuffix = (n) => {
        const num = Math.abs(Number(n));
        if (!Number.isFinite(num) || Math.floor(num) !== num) return '';
        const tens = num % 100;
        if (tens >= 11 && tens <= 13) return 'th';
        const ones = num % 10;
        if (ones === 1) return 'st';
        if (ones === 2) return 'nd';
        if (ones === 3) return 'rd';
        return 'th';
    };
    // Render numeric ranks; when ordinal=true, include suffix; otherwise plain number
    const asNumber = Number(displayText);
    if (displayText !== 'NA' && Number.isFinite(asNumber)) {
        // Optionally wrap with parentheses
        if (wrapInParens) span.appendChild(document.createTextNode('('));
        const numNode = document.createElement('span');
        numNode.className = 'stat-rank-number';
        numNode.textContent = String(asNumber);
        span.appendChild(numNode);
        if (ordinal) {
            if (variant === 'ktc') {
                const suffix = document.createElement('span');
                suffix.className = `stat-rank-suffix stat-rank-suffix-${variant}`; // will target ktc specifically in CSS
                suffix.textContent = ordinalSuffix(asNumber);
                span.appendChild(suffix);
            } else {
                const sup = document.createElement('sup');
                sup.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
                sup.textContent = ordinalSuffix(asNumber);
                span.appendChild(sup);
            }
        }
        if (wrapInParens) span.appendChild(document.createTextNode(')'));
        return span;
    }
    // Fallback for non-numeric or NA values: plain text (optionally parenthesized)
    span.textContent = wrapInParens ? `(${displayText})` : displayText;
    return span;
}
function computeSeasonRankings(seasonStats) {
    if (!seasonStats || typeof seasonStats !== 'object') return null;
    const entries = [];
    for (const [playerId, stats] of Object.entries(seasonStats)) {
        const fpts = typeof stats.fpts_ppr === 'number' ? stats.fpts_ppr : 0;
        const gamesPlayed = typeof stats.games_played === 'number' ? stats.games_played : 0;
        const pos = stats.pos || state.players[playerId]?.position || null;
        const ppg = gamesPlayed > 0 ? fpts / gamesPlayed : 0;
        stats.fpts_ppr = fpts;
        stats.games_played = gamesPlayed;
        stats.pos = pos;
        stats.ppg = ppg;
        entries.push({ playerId, pos, fpts, gamesPlayed, ppg });
    }
    const overallSorted = entries.slice().sort((a, b) => {
        if (b.fpts !== a.fpts) return b.fpts - a.fpts;
        if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
        if (b.ppg !== a.ppg) return b.ppg - a.ppg;
        return a.playerId.localeCompare(b.playerId);
    });
    overallSorted.forEach((entry, index) => {
        seasonStats[entry.playerId].overall_rank_ppr = index + 1;
    });
    const ppgSorted = entries
        .filter(entry => entry.gamesPlayed > 0)
        .sort((a, b) => {
            if (b.ppg !== a.ppg) return b.ppg - a.ppg;
            if (b.fpts !== a.fpts) return b.fpts - a.fpts;
            if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
            return a.playerId.localeCompare(b.playerId);
        });
    ppgSorted.forEach((entry, index) => {
        seasonStats[entry.playerId].ppg_rank_ppr = index + 1;
    });
    const positionalRankings = {};
    const groupedByPos = entries.reduce((acc, entry) => {
        if (!entry.pos) return acc;
        if (!acc[entry.pos]) acc[entry.pos] = [];
        acc[entry.pos].push(entry);
        return acc;
    }, {});
    Object.entries(groupedByPos).forEach(([pos, group]) => {
        const posSorted = group.slice().sort((a, b) => {
            if (b.fpts !== a.fpts) return b.fpts - a.fpts;
            if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
            if (b.ppg !== a.ppg) return b.ppg - a.ppg;
            return a.playerId.localeCompare(b.playerId);
        });
        posSorted.forEach((entry, index) => {
            if (typeof seasonStats[entry.playerId].pos_rank_ppr !== 'number') {
                seasonStats[entry.playerId].pos_rank_ppr = index + 1;
            }
        });
        const posPpgSorted = group
            .filter(entry => entry.gamesPlayed > 0)
            .sort((a, b) => {
                if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                return a.playerId.localeCompare(b.playerId);
            });
        posPpgSorted.forEach((entry, index) => {
            seasonStats[entry.playerId].ppg_pos_rank_ppr = index + 1;
        });
        positionalRankings[pos] = {
            total: posSorted.map(entry => entry.playerId),
            ppg: posPpgSorted.map(entry => entry.playerId)
        };
    });
    return {
        overall: overallSorted.map(entry => entry.playerId),
        ppg: ppgSorted.map(entry => entry.playerId),
        positional: positionalRankings
    };
}

function renderPlayerRadarChart(playerId, position) {
    const container = document.querySelector('#radar-chart-container .radar-chart-content');
    if (!container) return;

    // Clear existing chart
    container.innerHTML = '';

    const radarData = getPlayerRadarData(playerId, position);
    if (!radarData) {
        container.innerHTML = '<p class="no-data-message">No radar data available for this position.</p>';
        return;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'player-radar-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Use the same mobile breakpoint as the Analyzer radar chart.
    const isMobileRadar = window.matchMedia('(max-width: 640px)').matches;
    const radarLayoutPadding = {
        // Desktop: increased top padding to prevent FPTS label clipping and improve vertical centering.
        top: isMobileRadar ? 34 : 50,
        bottom: isMobileRadar ? 44 : 52,
        // Keep left/right padding as-is so the radar stays wide on mobile.
        // Label offset below is reduced to make room for larger text.
        left: isMobileRadar ? 45 : 18,
        right: isMobileRadar ? 45 : 18,
    };
    // Base distance from radar edge to the stat label/value text.
    const radarLabelOffset = isMobileRadar ? 10 : 14;
    // Rank number distance from each point (slightly farther than axis labels).
    const radarRankLabelOffset = isMobileRadar ? 13 : 16;

    // Keep the same 0..100 radar scale for every position.
    const scaleMax = 100;
//✦ Main Radar Chart Formatting Section ↓↓↓
    // Game Logs modal -> Performance tab -> main radar chart setup.
    const chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: radarData.labels,
            datasets: [{

                label: 'Player Rank',
                data: radarData.ranks,
                rawRanks: radarData.rawRanks,
                statValues: radarData.statValues,
                statKeys: radarData.statKeys,
                position: position,
                // Radar Chart Data Point Formatting, Border Formatting, and Fallback BG color for plotted area
                fill: true,
                backgroundColor: 'rgba(83, 0, 255, 0.33)', // Fallback color
                borderColor: '#6700ff',
                borderWidth: 2,
                pointBackgroundColor: '#6300ff',
                pointBorderColor: '#0D0E1B',
                pointRadius: 4.5,
                analyzerLabels: true,
                order: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            events: [],
            layout: {
                padding: radarLayoutPadding
            },
            elements: {
                line: { tension: 0.40 }
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
                        display: false
                    }
                }
            },
        // Radar Chart Grid Hexagon Colors
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                playerRadarBackground: {
                    levels: [
                        { ratio: 0.95, fill: '#2c334f62', stroke: '#525a7739', lineWidth: 1 },
                        { ratio: 0.75, fill: '#2D345153', stroke: '#525a7729', lineWidth: 1 },
                        { ratio: 0.55, fill: '#2F365250', stroke: '#525a7729', lineWidth: 1 },
                        { ratio: 0.35, fill: '#30375455', stroke: '#525a7729', lineWidth: 1 },
                        { ratio: 0.18, fill: '#31385565', stroke: '#525a7735', lineWidth: 1 }
                    ]
                },
                playerRadarLabels: {
                    // Rank text drawn near each data point.
                    font: '14px "Product Sans", "Google Sans", sans-serif',
                    // Uses a slightly larger offset so rank text clears the point dots.
                    offset: radarRankLabelOffset
                },
                playerRadarAxisLabels: {
                    // Stat name font size (desktop/mobile).
                    labelFontSize: 14,
                    labelFontSizeMobile: 13,
                    // Stat value font size (desktop/mobile).
                    valueFontSize: 12,
                    valueFontSizeMobile: 11,
                    // Base distance for all stat label/value pairs from the radar edge.
                    labelOffset: isMobileRadar ? 10 : 14,
                    // Extra top spacing for index 0 (FPTS at 12 o'clock).
                    topLabelExtraOffset: isMobileRadar ? 10 : 12,
                    // Per-axis spacing tweaks for crowded label/value spots.
                    axisLabelExtraOffsetsByIndex: {
                        1: 17, // upper-right diagonal – pushed further from radar
                        2: 14, // right side – nudged a touch further
                        3: 10, // lower-right diagonal – pushed further from radar
                        5: 13, // lower-left diagonal – pushed further from radar
                        6: 18, // left side – nudged a touch further
                        7: 21  // upper-left diagonal – pushed further from radar
                    },
                    valueSpacing: isMobileRadar ? 3 : 4,
                    labelColor: '#EAEBF0'
                }
            }
        },
        plugins: [playerRadarBackgroundPlugin, playerRadarLabelPlugin, playerRadarAxisLabelsPlugin]
    });

    // After first draw, build a radial fill using the chart's true center/radius.
    const scale = chartInstance.scales?.r;
    if (scale) {
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const radius = scale.drawingArea;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(121, 0, 245, 0.13)'); // inner color stop
        gradient.addColorStop(0.4, 'rgba(92, 0, 255, 0.20)'); // mid color stop
        gradient.addColorStop(0.78, 'rgba(75, 0, 255, 0.34)'); // outer color stop
        gradient.addColorStop(1, 'rgba(34, 0, 255, 0.91)');

        chartInstance.data.datasets[0].backgroundColor = gradient;
        chartInstance.update('none'); // Refresh once without animation.
    }

    // Save chart instance so closeModal() can destroy it.
    container._chartInstance = Chart.getChart('player-radar-canvas');
}

function parseWeeklyStatsCsv(csvText) {
    const { headers, rows } = parseCsv(csvText);
    const normalizedHeaders = headers.map(normalizeHeader);
    const result = {};
    rows.forEach(columns => {
        let playerId = null;
        const stats = {};
        normalizedHeaders.forEach((header, idx) => {
            const value = columns[idx];
            if (header === 'SLPR_ID') {
                if (value) playerId = value.trim();
                return;
            }
            // Allow PROJ through even if empty/whitespace so we can preserve text values
            if (header !== 'PROJ' && !value) return;
            const metaKey = WEEKLY_META_HEADER_MAP[header];
            if (metaKey) {
                if (metaKey === 'opponent_rank') {
                    const parsed = parseFloat(value.trim());
                    if (!Number.isNaN(parsed)) stats[metaKey] = parsed;
                } else {
                    const trimmedOpponent = value.trim();
                    if (trimmedOpponent) stats[metaKey] = trimmedOpponent;
                }
                return;
            }
            const statKey = PLAYER_STAT_HEADER_MAP[header];
            if (statKey) {
                if (header === 'PROJ') {
                    // For PROJ, always store the raw value as a string, even if empty
                    stats[statKey] = value || '';
                } else {
                    const parsedValue = parseStatValue(header, value);
                    if (parsedValue !== null) stats[statKey] = parsedValue;
                }
            }
        });
        if (playerId) {
            result[playerId] = stats;
        }
    });
    return result;
}
function parseCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map(line => parseCsvLine(line))
        .filter(columns => columns.some(col => col.length > 0));
    return { headers, rows };
}
function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    const sanitizedLine = line.replace(/\r$/, '');
    for (let i = 0; i < sanitizedLine.length; i++) {
        const char = sanitizedLine[i];
        if (inQuotes) {
            if (char === '"') {
                if (sanitizedLine[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
    }
    result.push(current);
    return result;
}
function normalizeHeader(header) {
    return header.replace(/[\u00a0\u202f]/g, ' ').trim();
}
function parseStatValue(header, value) {
    const trimmed = value.trim();
    // For all non-PROJ columns, PROJ is handled separately
    if (!trimmed || trimmed.toUpperCase() === 'NA') return null;
    if (header === 'SNP%') {
        const numericPortion = parseFloat(trimmed.replace('%', ''));
        if (Number.isNaN(numericPortion)) return null;
        if (trimmed.includes('%') || numericPortion > 1.5) {
            return numericPortion;
        }
        return numericPortion * 100;
    }
    const num = parseFloat(trimmed);
    if (Number.isNaN(num)) return null;
    return num;
}
function processRosterData(rosters, users, tradedPicks, leagueInfo, previousSeasonData = null) {
    const userMap = users.reduce((acc, user) => ({ ...acc, [user.user_id]: user }), {});
    const rosterPositions = leagueInfo.roster_positions;
    const taxiSlots = leagueInfo.settings.taxi_slots || 0;
    const teams = rosters.map(roster => {
        const owner = userMap[roster.owner_id];
        const allPlayers = roster.players || [];
        const starterIds = roster.starters || [];
        const starters = starterIds.map((playerId, index) => {
            const slot = rosterPositions[index] || 'FLEX';
            return getPlayerData(playerId, slot);
        }).sort((a, b) => STARTER_ORDER.indexOf(a.slot) - STARTER_ORDER.indexOf(b.slot));
        const currentTaxiPlayers = (roster.taxi || []).map(p => getPlayerData(p, 'TX')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0));
        const emptyTaxiSlots = Array(Math.max(0, taxiSlots - currentTaxiPlayers.length)).fill({ isPlaceholder: true });
        const taxi = [...currentTaxiPlayers, ...emptyTaxiSlots];
        const bench = allPlayers.filter(pId => pId && !starterIds.includes(pId) && !(roster.taxi || []).includes(pId));
        const draftPicks = getOwnedPicks(roster.roster_id, tradedPicks, leagueInfo);
        const isUserTeam = roster.owner_id === state.userId ||
            (roster.co_owners?.includes(state.userId) ?? false);

        let record = formatTeamRecord(roster.settings);
        let isChamp = false;

        // Attempt to use previous season data if provided (e.g. for offseason 2026 display)
        if (previousSeasonData) {
            const prevRoster = previousSeasonData.rostersByOwner[roster.owner_id];
            if (prevRoster) {
                // Use previous record instead of current 0-0
                const prevRecord = formatTeamRecord(prevRoster.settings);
                if (prevRecord) record = prevRecord;

                // Check if this roster was the champion
                if (previousSeasonData.winnerRosterId === prevRoster.roster_id) {
                    isChamp = true;
                }
            }
        }

        return {
            isUserTeam,
            teamName: owner?.display_name || `Team ${roster.roster_id}`,
            record,
            isChamp,
            starters,
            bench: bench.map(p => getPlayerData(p, 'BN')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
            taxi,
            draftPicks: draftPicks
                .map(p => getPickData(p, leagueInfo))
                .sort((a, b) => {
                    const aSeason = Number.parseInt(a.season, 10);
                    const bSeason = Number.parseInt(b.season, 10);
                    if (Number.isFinite(aSeason) && Number.isFinite(bSeason) && aSeason !== bSeason) {
                        return aSeason - bSeason;
                    }
                    if (a.round !== b.round) return a.round - b.round;
                    const aPir = Number.isFinite(a.pickInRound) ? a.pickInRound : 999;
                    const bPir = Number.isFinite(b.pickInRound) ? b.pickInRound : 999;
                    return aPir - bPir;
                }),
            allPlayers: allPlayers.map(pId => getPlayerData(pId, ''))
        };
    });
    state.currentTeams = teams;
    return teams.sort((a, b) => {
        if (a.isUserTeam) return -1;
        if (b.isUserTeam) return 1;
        return a.teamName.localeCompare(b.teamName);
    });
}
function formatTeamRecord(settings = {}) {
    const wins = Number.isFinite(settings?.wins) ? settings.wins : null;
    const losses = Number.isFinite(settings?.losses) ? settings.losses : null;
    const ties = Number.isFinite(settings?.ties) ? settings.ties : 0;
    if (wins === null || losses === null) {
        return null;
    }
    const baseRecord = `${wins}-${losses}`;
    return ties ? `${baseRecord}-${ties}` : baseRecord;
}

// --- Draft order hydration (Sleeper) ---
// Used ONLY for displaying/valuing future picks (e.g., 2026 1.02 + Early/Mid/Late KTC buckets).
// Does not interact with player stats, matchup scoring, or game logs.
function buildRosterIdByUserIdFromRosters(rosters) {
    const map = Object.create(null);
    (rosters || []).forEach(r => {
        const rosterId = r?.roster_id;
        if (!rosterId) return;
        if (r?.owner_id) map[r.owner_id] = rosterId;
        if (Array.isArray(r?.co_owners)) {
            r.co_owners.forEach(uid => {
                if (uid) map[uid] = rosterId;
            });
        }
    });
    return map;
}

function normalizeDraftType(raw) {
    const t = String(raw || '').toLowerCase();
    // Sleeper drafts often use 'snake' or 'linear'. Anything unknown, treat as linear.
    return t === 'snake' ? 'snake' : 'linear';
}

function computePickInRoundFromSlot({ round, slot, teamsCount, draftType }) {
    if (!Number.isFinite(slot) || slot <= 0) return null;
    const type = normalizeDraftType(draftType);
    const teams = Number.isFinite(teamsCount) && teamsCount > 0 ? teamsCount : null;
    if (type === 'snake' && teams) {
        // Snake: odd rounds follow draft order; even rounds reverse.
        return (round % 2 === 1) ? slot : (teams - slot + 1);
    }
    // Linear: same order every round.
    return slot;
}

function pad2(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return String(n);
    return String(v).padStart(2, '0');
}

function getPickBucketLabel(pickInRound, teamsCount) {
    const pickNum = Number(pickInRound);
    const teams = Number(teamsCount);
    if (!Number.isFinite(pickNum) || pickNum <= 0) return null;
    if (!Number.isFinite(teams) || teams <= 0) return null;
    // Default: split into thirds.
    // For 12-team: early 1-4, mid 5-8, late 9-12 (matches your requirement).
    const earlyEnd = Math.ceil(teams / 3);
    const midEnd = Math.ceil((2 * teams) / 3);
    if (pickNum <= earlyEnd) return 'Early';
    if (pickNum <= midEnd) return 'Mid';
    return 'Late';
}

// Rosters draft-pick value helpers: build the exact KTC `PLAYER NAME`
// labels used for 2026 pick cards/trade totals without changing older pick logic.
function getDraftRoundSuffix(roundNum) {
    if (roundNum === 1) return 'st';
    if (roundNum === 2) return 'nd';
    if (roundNum === 3) return 'rd';
    return 'th';
}

function getExplicit2026PickBucket(pickInRound) {
    const pickNum = Number(pickInRound);
    if (!Number.isFinite(pickNum) || pickNum < 1 || pickNum > 12) return null;
    if (pickNum <= 4) return 'Early';
    if (pickNum <= 8) return 'Mid';
    return 'Late';
}

function getKtcPickValueFromSheet(dataSet, season, bucket, roundNum) {
    const suffix = getDraftRoundSuffix(roundNum);
    const key = `${season} ${bucket} ${roundNum}${suffix}`;
    const value = dataSet?.[key]?.ktc;
    return (typeof value === 'number' && Number.isFinite(value)) ? value : null;
}

async function hydrateDraftOrderBySeason({ leagueId, leagueInfo, rosters, drafts }) {
    try {
        const rosterIdByUserId = buildRosterIdByUserIdFromRosters(rosters);
        const knownRosterIds = new Set((rosters || []).map(r => String(r?.roster_id)).filter(Boolean));
        const teamsCount = Number.isFinite(leagueInfo?.total_rosters)
            ? leagueInfo.total_rosters
            : (Array.isArray(rosters) ? rosters.length : null);

        const out = Object.create(null);
        const draftList = Array.isArray(drafts) ? drafts : [];
        for (const draft of draftList) {
            if (!draft) continue;
            const season = String(draft.season || '').trim();
            if (!season) continue;

            let order = draft.draft_order;
            let draftType = draft.type;

            // Some league drafts payloads may omit draft_order; fetch draft details if needed.
            if ((!order || typeof order !== 'object') && draft.draft_id) {
                try {
                    const fullDraft = await fetchWithCache(`${API_BASE}/draft/${draft.draft_id}`);
                    order = fullDraft?.draft_order;
                    draftType = fullDraft?.type || draftType;
                } catch (e) {
                    // Non-fatal: we can still show generic pick labels.
                }
            }
            if (!order || typeof order !== 'object') continue;

            const slotByRosterId = Object.create(null);
            Object.entries(order).forEach(([userId, slot]) => {
                const slotNum = Number(slot);
                if (!Number.isFinite(slotNum) || slotNum <= 0) return;

                // Most common: keys are user_id -> slot.
                const rosterIdFromUser = rosterIdByUserId[userId];
                if (rosterIdFromUser) {
                    slotByRosterId[String(rosterIdFromUser)] = slotNum;
                    return;
                }

                // Defensive: some payloads may key draft_order by roster_id -> slot.
                const possibleRosterId = String(userId);
                if (knownRosterIds.has(possibleRosterId)) {
                    slotByRosterId[possibleRosterId] = slotNum;
                }
            });
            if (Object.keys(slotByRosterId).length === 0) continue;

            const candidate = {
                teamsCount,
                draftType: normalizeDraftType(draftType),
                slotByRosterId
            };
            const existing = out[season];
            if (!existing || Object.keys(candidate.slotByRosterId).length > Object.keys(existing.slotByRosterId || {}).length) {
                out[season] = candidate;
            }
        }

        state.draftOrderBySeason = out;
    } catch (e) {
        // Non-fatal; keep generic pick labels/values.
        state.draftOrderBySeason = {};
    }
}
function getOwnedPicks(rosterId, tradedPicks, leagueInfo) {
    const defaultRounds = leagueInfo.settings.draft_rounds || 5;
    const leagueSeason = parseInt(leagueInfo.season);
    // Draft pick window logic:
    // - Before the rookie draft happens for the current league season, show that season's picks
    //   (e.g., in early 2026 before the 2026 rookie draft, show 2026 picks).
    // - After the rookie draft completes (league is in-season), shift the window forward so the
    //   next future year appears (e.g., show 2029 picks instead of 2026).
    const leagueStatus = String(leagueInfo?.status || '').toLowerCase();
    const isPreDraft = leagueStatus === 'pre_draft' || leagueStatus === 'drafting';
    const firstPickSeason = isPreDraft ? leagueSeason : (leagueSeason + 1);
    const seasonsToShow = 3;
    const lastPickSeason = firstPickSeason + (seasonsToShow - 1);
    let ownedPicks = [];
    for (let i = 0; i < seasonsToShow; i++) {
        const season = firstPickSeason + i;
        for (let round = 1; round <= defaultRounds; round++) {
            ownedPicks.push({ season: String(season), round, original_owner_id: rosterId });
        }
    }
    tradedPicks.forEach(pick => {
        if (pick.roster_id === rosterId && pick.owner_id !== rosterId) {
            const i = ownedPicks.findIndex(p => p.season === pick.season && p.round === pick.round && p.original_owner_id === rosterId);
            if (i > -1) ownedPicks.splice(i, 1);
        }
        if (pick.owner_id === rosterId && pick.roster_id !== rosterId) {
            const pickSeason = parseInt(pick.season);
            if (Number.isFinite(pickSeason) && pickSeason >= firstPickSeason && pickSeason <= lastPickSeason) {
                ownedPicks.push({ season: pick.season, round: pick.round, original_owner_id: pick.roster_id });
            }
        }
    });
    // Ensure we only show picks in the configured year window.
    ownedPicks = ownedPicks.filter(p => {
        const pickSeason = parseInt(p.season);
        return Number.isFinite(pickSeason) && pickSeason >= firstPickSeason && pickSeason <= lastPickSeason;
    });
    return ownedPicks.sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round);
}
function getPlayerData(playerId, slot) {
    const player = state.players[playerId];
    if (!player) return { id: playerId, name: 'Unknown Player', pos: '?', age: '?', team: '?', adp: null, ktc: null, slot, posRank: null, ppg: 0, injuryDesignation: null };
    const valueData = state.isSuperflex ? state.sflxData[playerId] : state.oneQbData[playerId];
    let lastName = player.last_name || '';
    if (lastName.length > 8) lastName = lastName.slice(0, 8) + '..'; // add ellipsis if truncated
    let displayName = `${player.first_name.charAt(0)}. ${lastName}`;
    // Prioritize age from the sheet and format it to one decimal place
    const ageFromSheet = valueData?.age;
    const formattedAge = (typeof ageFromSheet === 'number') ? ageFromSheet.toFixed(1) : (player.age ? Number(player.age).toFixed(1) : '?');
    const playerRanks = calculatePlayerStatsAndRanks(playerId) || getDefaultPlayerRanks();
    // Prefer direct Sleeper injury status; fall back to sheet-based upcoming projection designation
    const upcomingDesignation = getSleeperInjuryDesignation(playerId) || getUpcomingProjectionDesignation(playerId);
    return {
        id: playerId,
        name: displayName,
        pos: player.position || '?',
        age: formattedAge, // Use the new formatted age
        team: player.team || 'FA',
        adp: valueData?.adp || null,
        ktc: valueData?.ktc || null,
        slot,
        posRank: valueData?.posRank || null,
        overallRank: valueData?.overallRank || null,
        ppg: playerRanks ? parseFloat(playerRanks.ppg) : 0,
        playerRanks: playerRanks,
        injuryDesignation: upcomingDesignation
    };
}
function getPickData(pick, leagueInfo) {
    const { season, round } = pick;
    const seasonKey = String(season);
    const roundNum = Number(round);

    const draftMeta = state.draftOrderBySeason?.[seasonKey] || null;
    const teamsCount = draftMeta?.teamsCount
        ?? (Number.isFinite(leagueInfo?.total_rosters) ? leagueInfo.total_rosters : null);
    const slot = draftMeta?.slotByRosterId?.[String(pick.original_owner_id)];
    const pickInRound = computePickInRoundFromSlot({
        round: roundNum,
        slot: Number(slot),
        teamsCount: Number(teamsCount),
        draftType: draftMeta?.draftType
    });

    const label = pickInRound
        ? `${season} ${roundNum}.${pad2(pickInRound)}`
        : `${season} ${ordinalSuffix(roundNum)}`;
    const staticVals = { oneqb: { 1: 5200, 2: 3200, 3: 2000, 4: 1200, 5: 400 }, sflx: { 1: 4300, 2: 2600, 3: 1700, 4: 1000, 5: 400 } };
    let ktc = null;
    if (parseInt(season) >= 2028 || round >= 5) {
        ktc = (state.isSuperflex ? staticVals.sflx : staticVals.oneqb)[round] || null;
    } else {
        const dataSet = state.isSuperflex ? state.sflxData : state.oneQbData;
        // Rosters draft-pick cards and trade preview:
        // 2026 rounds 1-4 use the explicit KTC labels from `PLAYER NAME`
        // (`2026 Early 1st`, etc.). 1.01 gets the required premium, while
        // 5th-round, non-2026, unknown-slot, and missing-sheet cases continue
        // through the existing generic lookup/static value behavior below.
        if (seasonKey === '2026' && roundNum >= 1 && roundNum <= 4) {
            const explicitBucket = getExplicit2026PickBucket(pickInRound);
            if (explicitBucket) {
                const explicitValue = getKtcPickValueFromSheet(dataSet, seasonKey, explicitBucket, roundNum);
                if (explicitValue !== null) {
                    ktc = (roundNum === 1 && Number(pickInRound) === 1)
                        ? explicitValue + 1500
                        : explicitValue;
                }
            }
        }
        const sfx = getDraftRoundSuffix(roundNum);
        const bucket = pickInRound ? getPickBucketLabel(pickInRound, teamsCount) : 'Mid';
        const bucketKey = bucket || 'Mid';
        // Primary key format expected by the sheet (examples: "2026 Early 1st", "2026 Mid 2nd", "2026 Late 4th")
        const buildKeyCandidates = (seasonStr, bucketStr, roundStr, suffixStr) => {
            const b = String(bucketStr || '').trim();
            const variants = b
                ? [b, b.toLowerCase(), b.toUpperCase()]
                : [];
            const unique = new Set();
            variants.forEach(v => unique.add(`${seasonStr} ${v} ${roundStr}${suffixStr}`));
            return Array.from(unique);
        };
        const tryKeys = (keys) => {
            for (const k of keys) {
                const v = dataSet?.[k]?.ktc;
                if (typeof v === 'number' && Number.isFinite(v)) return v;
            }
            return null;
        };

        if (ktc === null) {
            const primaryKeys = buildKeyCandidates(String(season), bucketKey, String(round), sfx);
            ktc = tryKeys(primaryKeys);
        }

        // Safety fallback to Mid if Early/Late is missing in the sheet.
        if (ktc === null && bucketKey !== 'Mid') {
            const midKeys = buildKeyCandidates(String(season), 'Mid', String(round), sfx);
            ktc = tryKeys(midKeys);
        }
    }
    return {
        label,
        ktc,
        id: `${season}-${round}-${pick.original_owner_id}-${pickInRound || 'xx'}`,
        season: seasonKey,
        round: roundNum,
        pickInRound
    };
}
// --- UI Rendering ---
async function handlePlayerNameClick(player) {
    const requestSeq = ++gameLogsModalRequestSeq;
    state.currentGameLogsPlayer = null;
    state.currentGameLogsPlayerRanks = null;
    state.currentGameLogsSummary = null;
    const isStaleRequest = () => requestSeq !== gameLogsModalRequestSeq;

    const fullPlayer = state.players[player.id];
    state.currentGameLogsPlayer = fullPlayer || player;
    
    const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;
    modalPlayerName.textContent = `${playerName}`;
    if (modalPlayerVitals) {
        modalPlayerVitals.innerHTML = '';
    }
    document.getElementById('modal-summary-chips').innerHTML = ''; // Clear previous chips
    const existingHeaderContainer = document.querySelector('.modal-header-left-container');
    if (existingHeaderContainer) existingHeaderContainer.remove();

    // === Watchlist toggle (Rosters page): update icon/state for the current player ===
    // Default (not watchlisted): user-plus icon | Toggled (watchlisted): user-check icon
    if (watchlistModalToggle && pageType === 'rosters') {
        const pid = String(player.id);
        watchlistModalToggle.dataset.playerId = pid;
        const onList = isInWatchlist(pid);
        watchlistModalToggle.classList.toggle('is-watchlisted', onList);
        watchlistModalToggle.innerHTML = onList
            ? '<i class="fa-solid fa-user-check"></i>'
            : '<i class="fa-solid fa-user-plus"></i>';
        watchlistModalToggle.title = onList ? 'Remove from Watchlist' : 'Add to Watchlist';
        watchlistModalToggle.classList.remove('hidden');
    }

    // Enhanced loading state with animation - add loading classes
    modalBody.classList.add('loading');
    gameLogsModal.classList.add('loading');

    // Clear modal body
    modalBody.innerHTML = '';

    // Insert loading panel as sibling to modal-body (inside modal-content)
    const modalContent = gameLogsModal.querySelector('.modal-content');
    const existingLoadingPanel = modalContent.querySelector('.game-logs-loading-container');
    if (existingLoadingPanel) existingLoadingPanel.remove();

    const loadingPanel = document.createElement('div');
    loadingPanel.className = 'game-logs-loading-container';
    // Different message for stats page vs rosters page
    const loadingMessage = state.isGameLogFromStatsPage
        ? 'Fetching Game Log Data for All Players'
        : 'Fetching Game Log Data for All Players Across Your Leagues';
    loadingPanel.innerHTML = `
                <div class="game-logs-loading-content">
                    <div class="game-logs-loading-spinner">
                </div>
                    <p class="game-logs-loading-message">
                        <strong>Syncing Game Logs ⇄</strong>
                        ${loadingMessage} <br>
                       <br> — This May Take a Few Seconds...
                    </p>
                </div>
                <p class="game-logs-loading-footer">
                    <em>One-Time Sync <b>&</b> Synced Across the Board...   ➜ After this initial load, access every game log instantly—no extra loading  (per-session)</em>
                </p>
            `;
    modalContent.appendChild(loadingPanel);

    if (state.isGameLogModalOpenFromComparison) {
        gameLogsModal.style.zIndex = '1050';
    }
    openModal();
    const gameLogs = await fetchGameLogs(player.id);
    if (isStaleRequest()) return;

    // Remove loading classes and panel before rendering content
    modalBody.classList.remove('loading');
    gameLogsModal.classList.remove('loading');
    const existingPanel = gameLogsModal.querySelector('.game-logs-loading-container');
    if (existingPanel) existingPanel.remove();

    // Stats page uses sheet data, other pages calculate from weekly data
    const playerRanks = state.isGameLogFromStatsPage
        ? getStatsPagePlayerRanks(player.id)
        : calculatePlayerStatsAndRanks(player.id);
    if (isStaleRequest()) return;
    await renderGameLogs(gameLogs, player, playerRanks, requestSeq);
}
function getOpponentRankColor(rank) {
    const numericRank = typeof rank === 'number' ? rank : parseFloat(rank);
    if (!Number.isFinite(numericRank)) return null;
    if (numericRank <= 8) return '#82d8bee0';
    if (numericRank <= 16) return '#73b9e7e0';
    if (numericRank <= 24) return '#c093ebe0';
    if (numericRank <= 32) return '#c456b1e0';
    return null;
}
let tableCoreLoaderPromise = null;
function ensureTableCoreLoaded() {
    if (window.TableCore) return Promise.resolve(window.TableCore);
    if (tableCoreLoaderPromise) return tableCoreLoaderPromise;
    const existingScript = document.querySelector('script[data-tanstack-table-core="true"]');
    if (existingScript) {
        tableCoreLoaderPromise = new Promise((resolve, reject) => {
            existingScript.addEventListener('load', () => {
                if (window.TableCore) resolve(window.TableCore);
                else {
                    tableCoreLoaderPromise = null;
                    reject(new Error('TanStack Table library loaded but TableCore global is unavailable.'));
                }
            }, { once: true });
            existingScript.addEventListener('error', () => {
                tableCoreLoaderPromise = null;
                reject(new Error('TanStack Table library failed to load.'));
            }, { once: true });
        });
        return tableCoreLoaderPromise;
    }
    tableCoreLoaderPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@tanstack/table-core@8.11.0/build/umd/index.production.min.js';
        script.async = true;
        script.dataset.tanstackTableCore = 'true';
        script.onload = () => {
            if (window.TableCore) resolve(window.TableCore);
            else {
                tableCoreLoaderPromise = null;
                reject(new Error('TanStack Table library loaded but TableCore global is unavailable.'));
            }
        };
        script.onerror = () => {
            script.remove();
            tableCoreLoaderPromise = null;
            reject(new Error('TanStack Table library failed to load.'));
        };
        document.head.appendChild(script);
    });
    return tableCoreLoaderPromise;
}

// Radar stat setup by position for the Game Logs performance chart.
// `stats`: internal stat keys used in calculations.
// `labels`: short text shown around the radar chart.
const RADAR_STATS_CONFIG = {
    QB: {
        // QB radar uses passing-focused advanced metrics.
        // TTT at index 2 (right side), paRTG at index 5 (lower-left) per layout swap.
        stats: ['fpts', 'ppg', 'ttt', 'cmp_pct', 'pa_ypg', 'pass_rtg', 'cpoe', 'epa_per_db'],
        labels: ['FPTS', 'PPG', 'TTT', 'CMP%', 'paYPG', 'paRTG', 'CPOE', 'EPA/DB'],
        maxRank: 36
    },
    RB: {
        // Radar label order from top, moving clockwise.
        stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'mtf_per_att', 'yco_per_att', 'ypc', 'ts_per_rr'],
        labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'MTF/A', 'YCO/A', 'YPC', 'TS%'],
        maxRank: 48
    },
    WR: {
        stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
        labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
        maxRank: 72
    },
    TE: {
        stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
        labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
        maxRank: 24
    }
};

// === Game Logs Modal: Season stats (SZN) view helpers ===
const SZN_PROGRESS_THRESHOLDS = {
    QB: [
        { rank: 1, pct: 100 },
        { rank: 13, pct: 75 },
        { rank: 26, pct: 50 },
        { rank: 39, pct: 25 },
        { rank: 53, pct: 0 } // 0% for >52
    ],
    RB: [
        { rank: 1, pct: 100 },
        { rank: 16, pct: 75 },
        { rank: 32, pct: 50 },
        { rank: 48, pct: 25 },
        { rank: 65, pct: 0 } // 0% for >64
    ],
    WR: [
        { rank: 1, pct: 100 },
        { rank: 24, pct: 75 },
        { rank: 48, pct: 50 },
        { rank: 72, pct: 25 },
        { rank: 96, pct: 0 }
    ],
    TE: [
        { rank: 1, pct: 100 },
        { rank: 13, pct: 75 },
        { rank: 26, pct: 50 },
        { rank: 39, pct: 25 },
        { rank: 53, pct: 0 } // 0% for >52
    ]
};
// ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
// === Game Logs Modal: SZN stat sectioning (per position) ===
// These sections drive the SZN view order + grouping only (GL table ordering is separate).
// Edit freely to add/remove/reorder sections or move stat keys between them.
// ✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦
const SZN_STAT_SECTIONS_BY_POS = {
    QB: [
        { id: 'fantasy', label: 'FANTASY', tone: 'all', 
            stats: ['fpts', 'ppg', 'fpoe'] },
        {
            id: 'passing-production',
            label: 'PASSING PRODUCTION',
            tone: 'passing',
            stats: ['pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'pass_imp', 'pass_sack', 'pass_int']
        },
        {
            id: 'passing-efficiency',
            label: 'PASSING EFFICIENCY',
            tone: 'passing',
            stats: ['epa_per_db', 'cpoe', 'pass_rtg', 'cmp_pct', 'pass_imp_per_att', 'ttt', 'prs_pct', 'dp_pct', 'pa_ypg']
        },
        { id: 'rushing-production', label: 'RUSHING PRODUCTION', tone: 'rushing', 
            stats: ['rush_att', 'rush_yd', 'rush_td'] },

        { id: 'rushing-efficiency', label: 'RUSHING EFFICIENCY', tone: 'rushing', 
            stats: ['ypc'] },

        { id: 'general-production', label: 'GENERAL PRODUCTION', tone: 'all', 
            stats: ['yds_total', 'fum'] },

        { id: 'general-efficiency', label: 'GENERAL EFFICIENCY', tone: 'all', 
            stats: ['imp_per_g'] }
    ],
    RB: [
        { id: 'fantasy', label: 'FANTASY', tone: 'all', 
            stats: ['fpts', 'ppg', 'fpoe'] },
        {
            id: 'rushing-production',
            label: 'RUSHING PRODUCTION',
            tone: 'rushing',
            stats: ['snp_pct', 'rush_att', 'rush_yd', 'rush_td', 'rush_fd', 'rush_yac', 'mtf']
        },
        {
            id: 'rushing-efficiency',
            label: 'RUSHING EFFICIENCY',
            tone: 'rushing',
            // RB SZN view: keep explosive rush rate after YCO/A in the rushing efficiency stack.
            stats: ['ypc', 'elu', 'mtf_per_att', 'yco_per_att', 'expl_ru_pct', 'ryoe', 'ru_ypg']
        },
        {
            id: 'receiving-production',
            label: 'RECEIVING PRODUCTION',
            tone: 'receiving',
            stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar']
        },
        { 
            id: 'receiving-efficiency', 
            label: 'RECEIVING EFFICIENCY', 
            tone: 'receiving', 
            stats: ['ts_per_rr','yprr'] 
        },
        { id: 'general-production', label: 'GENERAL PRODUCTION', tone: 'all', 
            stats: ['yds_total', 'fum'] },

        { id: 'general-efficiency', label: 'GENERAL EFFICIENCY', tone: 'all', 
            stats: ['imp_per_g'] }
    ],

    WR: [
        { id: 'fantasy', label: 'FANTASY', tone: 'all', 
            stats: ['fpts', 'ppg', 'fpoe'] },
        {
            id: 'receiving-production',
            label: 'RECEIVING PRODUCTION',
            tone: 'receiving',
            // Receiving production keeps red-zone targets after routes run, per modal season-view request.
            stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr', 'rz_tgt']
        },
        {
            id: 'receiving-efficiency',
            label: 'RECEIVING EFFICIENCY',
            tone: 'receiving',
            stats: ['ts_per_rr', 'yprr', 'first_down_rec_rate', 'ypr', 'rec_ypg', 'ay_pct']
        },
        { id: 'general-production', label: 'GENERAL PRODUCTION', tone: 'all', 
            stats: ['yds_total', 'rush_att', 'rush_yd', 'rush_td', 'fum'] },
        
        { id: 'general-efficiency', label: 'GENERAL EFFICIENCY', tone: 'all', 
            stats: ['snp_pct', 'imp_per_g'] }
    ],

    TE: [
        { id: 'fantasy', label: 'FANTASY', tone: 'all', 
            stats: ['fpts', 'ppg', 'fpoe'] },
        {
            id: 'receiving-production',
            label: 'RECEIVING PRODUCTION',
            tone: 'receiving',
            // Receiving production keeps red-zone targets after routes run, per modal season-view request.
            stats: ['rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'rr', 'rz_tgt']
        },
        {
            id: 'receiving-efficiency',
            label: 'RECEIVING EFFICIENCY',
            tone: 'receiving',
            stats: ['ts_per_rr', 'yprr', 'first_down_rec_rate', 'ypr', 'rec_ypg', 'ay_pct']
        },
        { id: 'general-production', label: 'GENERAL PRODUCTION', tone: 'all', 
            stats: ['yds_total', 'rush_att', 'rush_yd', 'rush_td'] },

        { id: 'general-efficiency', label: 'GENERAL EFFICIENCY', tone: 'all', 
            stats: ['snp_pct', 'fum', 'imp_per_g'] }
    ]

};
function getSznSectionsForPosition(position) {
    const posKey = typeof position === 'string' ? position.trim().toUpperCase() : '';
    if (posKey && Array.isArray(SZN_STAT_SECTIONS_BY_POS[posKey])) return SZN_STAT_SECTIONS_BY_POS[posKey];
    return [];
}

function computeSznProgressPercent(rank, position) {
    const numericRank = typeof rank === 'number' ? rank : Number(rank);
    if (!Number.isFinite(numericRank) || numericRank <= 0) return 0;
    const posKey = typeof position === 'string' ? position.trim().toUpperCase() : '';
    const thresholds = SZN_PROGRESS_THRESHOLDS[posKey] || SZN_PROGRESS_THRESHOLDS.WR;
    const sorted = thresholds.slice().sort((a, b) => a.rank - b.rank);
    if (!sorted.length) return 0;
    if (numericRank <= sorted[0].rank) return sorted[0].pct;
    if (numericRank >= sorted[sorted.length - 1].rank) return sorted[sorted.length - 1].pct;
    for (let i = 0; i < sorted.length - 1; i += 1) {
        const start = sorted[i];
        const end = sorted[i + 1];
        if (numericRank >= start.rank && numericRank <= end.rank) {
            const span = Math.max(end.rank - start.rank, 1);
            const t = (numericRank - start.rank) / span;
            const pct = start.pct + (end.pct - start.pct) * t;
            return Math.max(0, Math.min(100, pct));
        }
    }
    return 0;
}
function buildSznFillCoreGradient(fillCoreColor) {
    if (!fillCoreColor || fillCoreColor === 'inherit') return null;

    // Game Logs modal (SZN view): keep a bright/near-white neon center line
    // while allowing each tier hue to be edited directly in the threshold map.
       return `linear-gradient(90deg,
        ${fillCoreColor} 0%,
        ${fillCoreColor} 100%)`;
}
function getSznStatFillCoreColor(rank, position) {
    if (typeof rank !== 'number' || rank <= 0) return 'inherit';
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';

    // Game Logs modal (SZN view) progress fill colors:
    // This palette controls only the core background hue of each bar.
    // Border + inset glow still use the regular conditional rank color.
    // Also See Bookmarks Right Below
    const thresholds = normalizedPos === 'WR'
        ? [
            { v: 12, c: '#DEF5' }, // Neon Teal
            { v: 24, c: '#DEF3' }, // Neon Cyan
            { v: 36, c: '#DEF5' }, // Neon Purple
            { v: 48, c: '#DEF5' }, // Neon Pink
            { v: 60, c: '#DEF3' }, // Deep Rose (Requested)
            { v: 72, c: '#DEF6' }, // Bright Red (Requested)
        ]
        : [
             { v: 8, c: '#def5' },
            { v: 16, c: '#def3' },
            { v: 24, c: '#def5' },
            { v: 32, c: '#def5' },
            { v: 40, c: '#def3' },
            { v: 50, c: '#def6' },
        ];

    for (const threshold of thresholds) {
        if (rank <= threshold.v) return threshold.c;
    }
    return '#7f7e99';
}
function getSznStatRankBoxShadow(rank, position, rankColor) {
    if (typeof rank !== 'number' || rank <= 0) return 'none';
    if (!rankColor || rankColor === 'inherit') return 'none';
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';

    // Game Logs modal (SZN view) neon treatment:
    // per-rank tier shadow presets, so each tier can be tuned independently.
    // Also See Bookmarks Right Above
    const thresholds = normalizedPos === 'WR'
            ? [
            { v: 12, s: `inset 0 0 4px 1px ${rankColor}` },
            { v: 24, s: `inset 0 0 5px 1px ${rankColor}` }, 
            { v: 36, s: `inset 0 0 5px 1px ${rankColor}` }, 
            { v: 48, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 60, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 72, s: `inset 0 0 5px 1px ${rankColor}` },
        ]
        : [
            { v: 8, s: `inset 0 0 4px 1px ${rankColor}` },
            { v: 16, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 24, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 32, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 40, s: `inset 0 0 5px 1px ${rankColor}` },
            { v: 50, s: `inset 0 0 5px 1px ${rankColor}` },
        ];

    for (const threshold of thresholds) {
        if (rank <= threshold.v) return threshold.s;
    }
    return `inset 0 0 8px 1px ${rankColor}, 0 0 2px ${rankColor}`;
}
function getGameLogsSeasonDisplayValue({
    key,
    seasonTotals,
    aggregatedTotals,
    snapPctValues,
    statValueCounts,
    gameLogsWithData,
    player,
    scoringSettings
}) {
    if (key === 'proj') return '-';
    let displayValue;
	if (NO_FALLBACK_KEYS.has(key)) {
		const raw = (seasonTotals && typeof seasonTotals[key] === 'number') ? seasonTotals[key] : null;
		if (raw === null) {
			displayValue = 'N/A';
        } else if (key === 'expl_ru_pct') {
            const normalized = Math.abs(raw) <= 1.5 ? raw * 100 : raw;
            displayValue = formatPercentage(normalized);
        } else if (key === 'snp_pct' || key === 'prs_pct' || key === 'ts_per_rr' || key === 'cmp_pct') {
			displayValue = formatPercentage(raw);
		} else if (key === 'cpoe') {
			const formatted = formatPercentage(raw, 1);
			displayValue = raw > 0 ? `+${formatted}` : formatted;
		} else if (key === 'epa_per_db') {
			const formatted = Number(raw).toFixed(2);
			displayValue = raw > 0 ? `+${formatted}` : formatted;
		} else {
			displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
		}
	} else if (key === 'fpts') {
        // Always use the same source as the summary chips.
        const summaryFpts = state.currentGameLogsPlayerRanks?.total_pts;
        if (summaryFpts !== null && summaryFpts !== undefined) {
            displayValue = typeof summaryFpts === 'number' ? summaryFpts.toFixed(1) : String(summaryFpts);
        } else if (state.isGameLogFromStatsPage) {
            const statsData = state.statsPagePlayerData;
            const seasonFpts = statsData?.fpts || 0;
            displayValue = seasonFpts.toFixed(1);
        } else {
            // Footer FPTS aggregation: use league matchup data, supplement with
            // league-specific scoring for weeks not covered (mirrors buildCalculatedRankCache)
            const totalPoints = (gameLogsWithData || []).reduce((sum, week) => {
                const weekNum = week.week;
                const playerId = player.id;
                const weekStats = week.stats || null;
                // Skip weeks where player had 0 snaps (DNP)
                if (typeof weekStats?.snp === 'number' && weekStats.snp === 0) return sum;
                if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                    return sum + state.leagueMatchupStats[weekNum][playerId];
                }
                // Supplement: compute league-specific FPTS from CSV stats + scoring settings
                if (weekStats && typeof weekStats.snp === 'number' && weekStats.snp > 0) {
                    return sum + calculateFantasyPoints(weekStats, scoringSettings);
                }
                return sum + 0;
            }, 0);
            displayValue = totalPoints.toFixed(1);
        }
    } else if (key === 'ppg') {
        // Always use the same source as the summary chips.
        const summaryPpg = state.currentGameLogsPlayerRanks?.ppg;
        if (summaryPpg !== null && summaryPpg !== undefined) {
            displayValue = typeof summaryPpg === 'number' ? summaryPpg.toFixed(1) : String(summaryPpg);
        } else if (state.isGameLogFromStatsPage) {
            const statsData = state.statsPagePlayerData;
            const ppg = statsData?.ppg || 0;
            displayValue = ppg.toFixed(1);
        } else {
            // Footer PPG aggregation: mirrors FPTS logic above
            const totalPoints = (gameLogsWithData || []).reduce((sum, week) => {
                const weekNum = week.week;
                const playerId = player.id;
                const weekStats = week.stats || null;
                // Skip weeks where player had 0 snaps (DNP)
                if (typeof weekStats?.snp === 'number' && weekStats.snp === 0) return sum;
                if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                    return sum + state.leagueMatchupStats[weekNum][playerId];
                }
                // Supplement: compute league-specific FPTS from CSV stats + scoring settings
                if (weekStats && typeof weekStats.snp === 'number' && weekStats.snp > 0) {
                    return sum + calculateFantasyPoints(weekStats, scoringSettings);
                }
                return sum + 0;
            }, 0);
            const gamesPlayed = (gameLogsWithData || []).length;
            const ppg = gamesPlayed > 0 ? totalPoints / gamesPlayed : 0;
            displayValue = ppg.toFixed(1);
        }
    } else if (key === 'fpoe') {
        const hasSeasonValue = seasonTotals && typeof seasonTotals.fpoe === 'number' && Number.isFinite(seasonTotals.fpoe);
        const hasAggregatedValue = aggregatedTotals && Object.prototype.hasOwnProperty.call(aggregatedTotals, 'fpoe') &&
            typeof aggregatedTotals.fpoe === 'number' && Number.isFinite(aggregatedTotals.fpoe);
        if (!hasSeasonValue && !hasAggregatedValue) {
            displayValue = 'N/A';
        } else {
            const value = hasSeasonValue ? seasonTotals.fpoe : aggregatedTotals.fpoe;
            displayValue = Number(value).toFixed(1);
        }
    } else if (key === 'pa_ypg') {
        let ypgValue = seasonTotals && typeof seasonTotals.pa_ypg === 'number' ? seasonTotals.pa_ypg : null;
        if (ypgValue === null) {
            const totalPassYds = seasonTotals && typeof seasonTotals.pass_yd === 'number' ? seasonTotals.pass_yd : (aggregatedTotals['pass_yd'] || 0);
            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : (gameLogsWithData || []).length;
            ypgValue = games > 0 ? totalPassYds / games : 0;
        }
        displayValue = Number(ypgValue).toFixed(1);
    } else if (key === 'ru_ypg') {
        let ypgValue = seasonTotals && typeof seasonTotals.ru_ypg === 'number' ? seasonTotals.ru_ypg : null;
        if (ypgValue === null) {
            const totalRushYds = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : (gameLogsWithData || []).length;
            ypgValue = games > 0 ? totalRushYds / games : 0;
        }
        displayValue = Number(ypgValue).toFixed(1);
    } else if (key === 'rec_ypg') {
        let ypgValue = seasonTotals && typeof seasonTotals.rec_ypg === 'number' ? seasonTotals.rec_ypg : null;
        if (ypgValue === null) {
            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : (gameLogsWithData || []).length;
            ypgValue = games > 0 ? totalRecYds / games : 0;
        }
        displayValue = Number(ypgValue).toFixed(1);
    } else if (key === 'dp_pct') {
        let pctValue = seasonTotals && typeof seasonTotals.dp_pct === 'number' ? seasonTotals.dp_pct : null;
        if (pctValue === null) {
            const hasTotal = aggregatedTotals && typeof aggregatedTotals.dp_pct === 'number' && Number.isFinite(aggregatedTotals.dp_pct);
            const count = typeof statValueCounts?.dp_pct === 'number' ? statValueCounts.dp_pct : 0;
            if (hasTotal && count > 0) pctValue = aggregatedTotals.dp_pct / count;
        }
        if (pctValue === null || pctValue === undefined || !Number.isFinite(Number(pctValue))) {
            displayValue = 'N/A';
        } else {
            const normalized = Math.abs(pctValue) <= 1.5 ? pctValue * 100 : pctValue;
            displayValue = formatPercentage(normalized, 1);
        }
    } else if (key === 'ypc') {
        const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
        const avgYpc = totalCarries > 0 ? totalYards / totalCarries : 0;
        displayValue = avgYpc.toFixed(2);
    } else if (key === 'yco_per_att') {
        const totalYco = seasonTotals && typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : (aggregatedTotals['rush_yac'] || 0);
        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
        const avgYcoPerCar = totalCarries > 0 ? totalYco / totalCarries : 0;
        displayValue = avgYcoPerCar.toFixed(2);
    } else if (key === 'mtf_per_att') {
        const totalMtf = seasonTotals && typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : (aggregatedTotals['mtf'] || 0);
        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
        const avgMtfPerAtt = totalCarries > 0 ? totalMtf / totalCarries : 0;
        displayValue = avgMtfPerAtt.toFixed(2);
    } else if (key === 'pass_rtg') {
        if (seasonTotals && typeof seasonTotals.pass_rtg === 'number') {
            const rating = seasonTotals.pass_rtg;
            displayValue = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
        } else {
            const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
            const gamesWithPassAttempts = (gameLogsWithData || []).filter(w => (w.stats['pass_att'] || 0) > 0).length;
            const avgPassRtg = gamesWithPassAttempts > 0 ? totalPassRtg / gamesWithPassAttempts : 0;
            displayValue = avgPassRtg.toFixed(1);
        }
    } else if (key === 'pass_imp_per_att') {
        let pctValue = seasonTotals && typeof seasonTotals.pass_imp_per_att === 'number' ? seasonTotals.pass_imp_per_att : null;
        if (pctValue === null) {
            const totalPassImp = seasonTotals && typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : (aggregatedTotals['pass_imp'] || 0);
            const totalPassAtt = seasonTotals && typeof seasonTotals.pass_att === 'number' ? seasonTotals.pass_att : (aggregatedTotals['pass_att'] || 0);
            if (totalPassAtt > 0) pctValue = (totalPassImp / totalPassAtt) * 100;
            else if (statValueCounts['pass_imp_per_att']) pctValue = (aggregatedTotals['pass_imp_per_att'] || 0) / statValueCounts['pass_imp_per_att'];
            else pctValue = 0;
        }
        displayValue = formatPercentage(pctValue);
    } else if (key === 'ttt') {
        let avgTtt = seasonTotals && typeof seasonTotals.ttt === 'number' ? seasonTotals.ttt : null;
        if (avgTtt === null) {
            const totalTtt = aggregatedTotals['ttt'] || 0;
            const count = statValueCounts['ttt'] || 0;
            avgTtt = count > 0 ? totalTtt / count : 0;
        }
        displayValue = Number.isInteger(avgTtt) ? String(avgTtt) : Number(avgTtt).toFixed(2);
    } else if (key === 'prs_pct') {
        let pctValue = seasonTotals && typeof seasonTotals.prs_pct === 'number' ? seasonTotals.prs_pct : null;
        if (pctValue === null) {
            const total = aggregatedTotals['prs_pct'] || 0;
            const count = statValueCounts['prs_pct'] || 0;
            pctValue = count > 0 ? total / count : 0;
        }
        displayValue = formatPercentage(pctValue);
    } else if (key === 'cmp_pct') {
        let pctValue = seasonTotals && typeof seasonTotals.cmp_pct === 'number' ? seasonTotals.cmp_pct : null;
        if (pctValue === null) {
            const total = aggregatedTotals['cmp_pct'] || 0;
            const count = statValueCounts['cmp_pct'] || 0;
            pctValue = count > 0 ? total / count : 0;
        }
        displayValue = formatPercentage(pctValue);
    } else if (key === 'snp_pct') {
        let pctValue = seasonTotals && typeof seasonTotals.snp_pct === 'number' ? seasonTotals.snp_pct : null;
        if (pctValue === null) {
            pctValue = snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0;
        }
        displayValue = formatPercentage(pctValue);
    } else if (key === 'imp_per_g') {
        let impPerGame = seasonTotals && typeof seasonTotals.imp_per_g === 'number' ? seasonTotals.imp_per_g : null;
        if (impPerGame === null) {
            const totalImp = seasonTotals && typeof seasonTotals.imp === 'number' ? seasonTotals.imp : (aggregatedTotals['imp'] || 0);
            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : (gameLogsWithData || []).length;
            impPerGame = games > 0 ? totalImp / games : 0;
        }
        displayValue = Number.isInteger(impPerGame) ? String(impPerGame) : Number(impPerGame).toFixed(2);
    } else if (key === 'yprr') {
        let value = seasonTotals && typeof seasonTotals.yprr === 'number' ? seasonTotals.yprr : null;
        if (value === null) {
            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
            value = totalRoutes > 0 ? totalRecYds / totalRoutes : 0;
        }
        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
    } else if (key === 'ts_per_rr') {
        let pctValue = seasonTotals && typeof seasonTotals.ts_per_rr === 'number' ? seasonTotals.ts_per_rr : null;
        if (pctValue === null) {
            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
            const totalTargets = seasonTotals && typeof seasonTotals.rec_tgt === 'number' ? seasonTotals.rec_tgt : (aggregatedTotals['rec_tgt'] || 0);
            pctValue = totalRoutes > 0 ? (totalTargets / totalRoutes) * 100 : 0;
        }
        displayValue = formatPercentage(pctValue);
    } else if (key === 'ypr') {
        let value = seasonTotals && typeof seasonTotals.ypr === 'number' ? seasonTotals.ypr : null;
        if (value === null) {
            const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
            value = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
        }
        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
    } else if (key === 'first_down_rec_rate') {
        let value = seasonTotals && typeof seasonTotals.first_down_rec_rate === 'number' ? seasonTotals.first_down_rec_rate : null;
        if (value === null) {
            const totalRecFd = seasonTotals && typeof seasonTotals.rec_fd === 'number' ? seasonTotals.rec_fd : (aggregatedTotals['rec_fd'] || 0);
            const totalRec = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
            value = totalRec > 0 ? (totalRecFd / totalRec) : 0;
        }
        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
    } else {
        const totalValue = seasonTotals && typeof seasonTotals[key] === 'number' ? seasonTotals[key] : (aggregatedTotals[key] || 0);
        displayValue = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2);
    }
    return displayValue;
}
function renderGameLogsSeasonStatsView({
    container,
    player,
    orderedStatKeys,
    statLabels,
    seasonTotals,
    aggregatedTotals,
    snapPctValues,
    statValueCounts,
    gameLogsWithData,
    scoringSettings,
    statGroupByKey
}) {
    if (!container) return;
    container.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'gamelogs-szn-title';
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '3');
    const titleIcon = document.createElement('i');
    titleIcon.className = 'fa-regular fa-chart-bar gamelogs-szn-title-icon';
    titleIcon.setAttribute('aria-hidden', 'true');
    const titleText = document.createElement('span');
    titleText.className = 'gamelogs-szn-title-text';
    titleText.textContent = 'Season Stats';
    title.appendChild(titleIcon);
    title.appendChild(titleText);
    const gamesPlayed = seasonTotals && typeof seasonTotals.games_played === 'number' && Number.isFinite(seasonTotals.games_played)
        ? Math.round(seasonTotals.games_played)
        : null;
    if (gamesPlayed !== null) {
        const games = document.createElement('span');
        games.className = 'gamelogs-szn-title-games';
        const gamesLabel = document.createElement('span');
        gamesLabel.className = 'gamelogs-szn-title-games-label';
        gamesLabel.textContent = 'G:';
        const gamesValue = document.createElement('span');
        gamesValue.className = 'gamelogs-szn-title-games-value';
        gamesValue.textContent = String(gamesPlayed);
        games.appendChild(gamesLabel);
        games.appendChild(gamesValue);
        title.appendChild(games);
    }
    const list = document.createElement('div');
    list.className = 'gamelogs-szn-list';

    const appendSznStatRow = (statKey) => {
        if (!statLabels?.[statKey] || statKey === 'proj') return false;
        const labelText = statLabels[statKey];
        const rankValue = getSeasonRankValue(player.id, statKey);
        const rankColor = getSznStatRankColor(rankValue, player.pos);
        const fillCoreColor = getSznStatFillCoreColor(rankValue, player.pos);
        const rankBoxShadow = getSznStatRankBoxShadow(rankValue, player.pos, rankColor);
        const progressPct = computeSznProgressPercent(rankValue, player.pos);
        const displayValue = getGameLogsSeasonDisplayValue({
            key: statKey,
            seasonTotals,
            aggregatedTotals,
            snapPctValues,
            statValueCounts,
            gameLogsWithData,
            player,
            scoringSettings
        });
        const row = document.createElement('div');
        row.className = 'gamelogs-szn-row';
        const group = statGroupByKey?.get(statKey);
        if (group) row.classList.add(`gamelogs-szn-row--${group}`);

        const label = document.createElement('div');
        label.className = 'gamelogs-szn-label';
        label.textContent = labelText;

        const bar = document.createElement('div');
        bar.className = 'gamelogs-szn-bar';
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', `${labelText} rank ${getRankDisplayText(rankValue)}`);
        const fill = document.createElement('div');
        fill.className = 'gamelogs-szn-bar-fill';
        fill.style.width = `${progressPct}%`;
        if (progressPct > 0) {
            const gradient = buildSznFillCoreGradient(fillCoreColor);
            if (gradient) {
                fill.style.backgroundImage = gradient;
                fill.style.backgroundColor = 'transparent';
                if (rankColor && rankColor !== 'inherit') {
                    // Game Logs modal (SZN view) neon treatment:
                    // use existing conditional rank color on edge only,
                    // while selecting a per-rank shadow preset.
                    fill.style.border = `1px solid ${rankColor}`;
                    fill.style.boxShadow = rankBoxShadow;
                }
            } else if (rankColor && rankColor !== 'inherit') {
                fill.style.backgroundImage = 'none';
                fill.style.backgroundColor = fillCoreColor && fillCoreColor !== 'inherit'
                    ? fillCoreColor
                    : 'rgba(255, 255, 255, 0.92)';
                fill.style.border = `1px solid ${rankColor}`;
                fill.style.boxShadow = rankBoxShadow;
            }
        }
        const rankAnnot = createRankAnnotation(rankValue, { wrapInParens: false, ordinal: true, variant: 'szn' });
        rankAnnot.classList.add('gamelogs-szn-bar-rank');
        if (rankColor && rankColor !== 'inherit') {
            rankAnnot.style.color = rankColor;
        }
        const rankPos = Math.min(98, Math.max(2, Number.isFinite(progressPct) ? progressPct : 0));
        rankAnnot.style.setProperty('--szn-rank-pos', `${rankPos}%`);
        bar.appendChild(fill);
        bar.appendChild(rankAnnot);

        const value = document.createElement('div');
        value.className = 'gamelogs-szn-value';
        const valueMain = document.createElement('span');
        valueMain.className = 'gamelogs-szn-value-main';
        const valueText = typeof displayValue === 'string' ? displayValue.trim() : String(displayValue ?? '');
        if (valueText.endsWith('%') && valueText.length > 1) {
            const numberPart = document.createElement('span');
            numberPart.className = 'gamelogs-szn-value-number';
            numberPart.textContent = valueText.slice(0, -1);
            const percentPart = document.createElement('span');
            percentPart.className = 'gamelogs-szn-value-percent';
            percentPart.textContent = '%';
            valueMain.appendChild(numberPart);
            valueMain.appendChild(percentPart);
        } else {
            valueMain.textContent = displayValue;
        }
        value.appendChild(valueMain);

        row.appendChild(label);
        row.appendChild(bar);
        row.appendChild(value);
        list.appendChild(row);
        return true;
    };

    const usedKeys = new Set();
    const sections = getSznSectionsForPosition(player?.pos);

    if (sections.length) {
        for (const section of sections) {
            const statKeys = Array.isArray(section?.stats) ? section.stats : [];
            const visibleKeys = statKeys.filter((key) => {
                if (usedKeys.has(key)) return false;
                if (key === 'proj') return false;
                return Boolean(statLabels?.[key]);
            });
            if (!visibleKeys.length) continue;

            const header = document.createElement('div');
            header.className = 'gamelogs-szn-section-header';
            if (section.tone) header.classList.add(`gamelogs-szn-section-header--${section.tone}`);
            header.setAttribute('role', 'heading');
            header.setAttribute('aria-level', '4');
            header.textContent = section.label || 'SECTION';
            list.appendChild(header);

            for (const statKey of visibleKeys) {
                if (appendSznStatRow(statKey)) usedKeys.add(statKey);
            }
        }
    } else if (Array.isArray(orderedStatKeys)) {
        for (const statKey of orderedStatKeys) {
            if (appendSznStatRow(statKey)) usedKeys.add(statKey);
        }
    }

    container.appendChild(title);
    container.appendChild(list);
}

function getCareerSectionsForPosition(position) {
    // Rosters Game Logs modal Career view:
    // selects the exact column groups for the player's fantasy position, with WR/TE
    // sharing the same receiving-first table setup.
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
    return CAREER_STAT_SECTIONS_BY_POS[normalizedPos] || CAREER_STAT_SECTIONS_BY_POS.WR;
}

function parseCareerStatsCsv(csvText) {
    // Rosters Game Logs modal Career view:
    // converts the shipped multi-season CSV into SLPR_ID-keyed row arrays so each
    // modal open only has to filter by player id once after the cached fetch.
    const parsed = parseCsv(csvText);
    const rowsByPlayer = {};
    parsed.rows.forEach((columns) => {
        const row = {};
        parsed.headers.forEach((header, index) => {
            row[header] = columns[index] ?? '';
        });
        const playerId = String(row.SLPR_ID || '').trim();
        if (!playerId) return;
        if (!rowsByPlayer[playerId]) rowsByPlayer[playerId] = [];
        rowsByPlayer[playerId].push(row);
    });
    Object.values(rowsByPlayer).forEach((rows) => {
        rows.sort((a, b) => {
            const seasonA = Number.parseInt(a.SZN, 10);
            const seasonB = Number.parseInt(b.SZN, 10);
            const safeA = Number.isFinite(seasonA) ? seasonA : -Infinity;
            const safeB = Number.isFinite(seasonB) ? seasonB : -Infinity;
            return safeB - safeA;
        });
    });
    return rowsByPlayer;
}

async function ensureCareerStatsLoaded() {
    // Rosters Game Logs modal Career view:
    // fetches/parses the career CSV once per page session and reuses the in-flight
    // promise if multiple modal renders request the data at the same time.
    if (state.careerStatsByPlayer) return state.careerStatsByPlayer;
    if (!careerStatsLoadPromise) {
        careerStatsLoadPromise = fetchTextWithCache(buildAppStaticUrl(CAREER_STATS_CSV_PATH))
            .then(parseCareerStatsCsv)
            .then((rowsByPlayer) => {
                state.careerStatsByPlayer = rowsByPlayer;
                return rowsByPlayer;
            })
            .catch((error) => {
                careerStatsLoadPromise = null;
                state.careerStatsByPlayer = null;
                throw error;
            });
    }
    return careerStatsLoadPromise;
}

function getCareerHeaderLabel(statKey) {
    // Rosters Game Logs modal Career view:
    // strips the lowercase stat-family prefixes because the group header already
    // communicates PASSING/RUSHING/RECEIVING/TOTAL context.
    const labelMap = {
        FPTS_VALUE: 'FPTS',
        FPTS_POS_RK: 'POS·RK',
        FPTS_OVR_RK: 'OVR·RK',
        PPG_VALUE: 'PPG',
        PPG_POS_RK: 'POS·RK',
        PPG_OVR_RK: 'OVR·RK',
        paATT: 'ATT',
        paYDS: 'YDS',
        paTD: 'TD',
        paYPG: 'YPG',
        ruYDS: 'YDS',
        ruTD: 'TD',
        ruYPG: 'YPG',
        recYDS: 'YDS',
        recTD: 'TD',
        recYPG: 'YPG',
        ttlYDS: 'YDS',
        ttlTD: 'TD'
    };
    return labelMap[statKey] || statKey;
}

function getCareerDisplaySections(sections) {
    // Rosters Game Logs modal Career view:
    // expands the source FANTASY section into two visible groups with three
    // columns each: value, positional rank, and overall rank.
    return (sections || []).flatMap((section) => {
        if (section?.id !== 'fantasy') return [section];
        return [
            { id: 'fantasy-points', label: 'FANTASY POINTS', tone: 'fantasy', stats: ['FPTS_POS_RK', 'FPTS_VALUE', 'FPTS_OVR_RK'] },
            { id: 'points-per-game', label: 'POINTS PER GAME', tone: 'fantasy', stats: ['PPG_POS_RK', 'PPG_VALUE', 'PPG_OVR_RK'] }
        ];
    });
}

function formatCareerCellValue(row, statKey) {
    // Rosters Game Logs modal Career view:
    // keeps real zero values visible while replacing missing CSV values with the
    // same polished empty marker used elsewhere in modal tables.
    if (!row || !Object.prototype.hasOwnProperty.call(row, statKey)) return '—';
    const value = row[statKey];
    if (value === null || value === undefined) return '—';
    const text = String(value).trim();
    if (!text || text.toUpperCase() === 'NA' || text.toUpperCase() === 'N/A') return '—';
    return text;
}

function parseCareerRankNumber(value) {
    const text = String(value ?? '').replace(/,/g, '').trim();
    if (!text || text.toUpperCase() === 'NA' || text.toUpperCase() === 'N/A') return null;
    const match = text.match(/\d+/);
    if (!match) return null;
    const number = Number.parseInt(match[0], 10);
    return Number.isFinite(number) ? number : null;
}

function formatCareerPosRankText(value) {
    const text = String(value ?? '').trim();
    if (!text || text.toUpperCase() === 'NA' || text.toUpperCase() === 'N/A') return '—';
    return text
        .replace(/[\s\u2000-\u200A\u202F\u205F\u3000]*·[\s\u2000-\u200A\u202F\u205F\u3000]*/g, '·')
        .replace(/[\s\u2000-\u200A\u202F\u205F\u3000]+/g, '');
}

function appendCareerIconMarkup(svg, iconMarkup) {
    // Rosters Game Logs modal Career view:
    // appends configured SVG path/html markup into the group-header icon shell.
    if (!svg || !iconMarkup) return;
    if (iconMarkup.startsWith('<')) {
        svg.innerHTML = iconMarkup;
        return;
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', iconMarkup);
    svg.appendChild(path);
}

function createCareerGroupHeaderContent(section) {
    // Rosters Game Logs modal Career view:
    // wraps each group title with its configured icon; lookup prefers the visible
    // split-group id so Fantasy Points and Points Per Game can use different icons.
    const inner = document.createElement('div');
    inner.className = 'career-stats-group-header-inner';
    const iconConfig = CAREER_STAT_GROUP_ICONS[section?.id] || CAREER_STAT_GROUP_ICONS[section?.tone];
    if (iconConfig?.markup) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const sectionIdClass = String(section?.id || '').replace(/[^a-z0-9_-]/gi, '-');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.classList.add('career-stats-group-header-icon');
        if (sectionIdClass) svg.classList.add(`career-stats-group-header-icon--${sectionIdClass}`);
        appendCareerIconMarkup(svg, iconConfig.markup);
        inner.appendChild(svg);
    }
    const label = document.createElement('span');
    label.textContent = section?.label || '';
    inner.appendChild(label);
    return inner;
}

function getCareerTeamLogoKey(team) {
    const teamKey = String(team || '').trim().toUpperCase();
    const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar', LAR: 'lar' };
    const knownTeams = new Set([
        'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN',
        'DET', 'GB', 'HOU', 'IND', 'JAC', 'KC', 'LAC', 'LAR', 'LA', 'LV', 'MIA',
        'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN',
        'WAS', 'WSH'
    ]);
    if (!knownTeams.has(teamKey)) return null;
    return logoKeyMap[teamKey] || teamKey.toLowerCase();
}

function appendCareerTeamCellContent(cell, row) {
    // Rosters Game Logs modal Career view:
    // renders the TM column as the NFL team logo where possible, with a text
    // fallback for aggregate/missing teams such as 2TM or FA.
    const teamText = formatCareerCellValue(row, 'TM');
    const teamKey = teamText === '—' ? '' : teamText.toUpperCase();
    const logoKey = getCareerTeamLogoKey(teamKey);
    const chip = document.createElement('span');
    chip.className = 'career-stats-team-logo-chip';
    chip.dataset.team = teamKey || 'NA';
    if (logoKey) {
        const img = document.createElement('img');
        img.className = 'team-logo glow career-stats-team-logo';
        img.src = `../assets/NFL_logos_svg/${logoKey}.svg`;
        img.alt = teamKey;
        img.width = 24;
        img.height = 24;
        img.loading = 'lazy';
        img.decoding = 'async';
        chip.appendChild(img);
    } else {
        chip.textContent = teamText;
        chip.classList.add('career-stats-team-logo-chip--text');
    }
    cell.appendChild(chip);
}

function getCareerFantasyValueMeta(row, statKey, position) {
    // Rosters Game Logs modal Career view:
    // resolves fantasy value display/color from the paired positional-rank column
    // so FPTS/PPG can render as regular cells instead of chips.
    const isFpts = statKey.startsWith('FPTS_');
    const valueKey = isFpts ? 'FPTS' : 'PPG';
    const posRankKey = isFpts ? 'FPTS POS RK' : 'PPG POS RK';
    const posRankNumber = parseCareerRankNumber(row?.[posRankKey]);
    return {
        value: formatCareerCellValue(row, valueKey),
        color: getConditionalColorByRank(posRankNumber, position)
    };
}

function appendCareerFantasySplitCellContent(cell, row, statKey, position) {
    // Rosters Game Logs modal Career view:
    // renders rank-only fantasy columns as compact chips. FPTS/PPG values render
    // as normal cells in the main row builder.
    const isFpts = statKey.startsWith('FPTS_');
    const overallRankKey = isFpts ? 'FPTS RK' : 'PPG RK';
    const posRankKey = isFpts ? 'FPTS POS RK' : 'PPG POS RK';
    const overallRankNumber = parseCareerRankNumber(row[overallRankKey]);
    const posRankRaw = row[posRankKey];
    const posRankNumber = parseCareerRankNumber(posRankRaw);
    const posRankColor = getConditionalColorByRank(posRankNumber, position);
    const overallRankColor = getRankColor(overallRankNumber);

    const chip = document.createElement('span');
    chip.className = 'career-stats-fantasy-chip';

    if (statKey.endsWith('_POS_RK')) {
        chip.classList.add('career-stats-fantasy-chip--rank', 'career-stats-fantasy-chip--pos-rank');
        const posSegment = document.createElement('span');
        posSegment.className = 'career-stats-fantasy-pos-rank';
        posSegment.textContent = formatCareerPosRankText(posRankRaw);
        if (posRankColor && posRankColor !== 'inherit') posSegment.style.color = posRankColor;
        chip.appendChild(posSegment);
    } else {
        chip.classList.add('career-stats-fantasy-chip--rank', 'career-stats-fantasy-chip--ovr-rank');
        const overallSegment = overallRankNumber !== null
            ? createRankAnnotation(overallRankNumber, { wrapInParens: false, ordinal: true, variant: 'career' })
            : document.createElement('span');
        overallSegment.classList.add('career-stats-fantasy-rank');
        if (overallRankNumber === null) overallSegment.textContent = '—';
        if (overallRankColor && overallRankColor !== 'inherit') overallSegment.style.color = overallRankColor;
        chip.appendChild(overallSegment);
    }

    cell.appendChild(chip);
}

async function renderGameLogsCareerStatsView({ container, player, requestSeq }) {
    // Rosters Game Logs modal Career view:
    // builds a dedicated, swappable career-stats table inside #modal-body so it
    // fully replaces the weekly/SZN views when the Career button is selected.
    if (!container) return;
    const isStaleRequest = () => Number.isFinite(requestSeq) && requestSeq !== gameLogsModalRequestSeq;
    if (isStaleRequest()) return;
    container.innerHTML = '';
    container.classList.add('game-logs-career-view');

    const renderEmptyState = (message) => {
        container.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'career-stats-empty';
        empty.textContent = message;
        container.appendChild(empty);
    };

    let rowsByPlayer;
    try {
        rowsByPlayer = await ensureCareerStatsLoaded();
    } catch (error) {
        console.error('Failed to load career stats CSV', error);
        renderEmptyState('Career stats are unavailable right now.');
        return;
    }
    if (isStaleRequest()) return;

    const playerId = String(player?.id || '').trim();
    const careerRows = playerId ? (rowsByPlayer?.[playerId] || []) : [];
    if (!careerRows.length) {
        renderEmptyState('No career stats found for this player.');
        return;
    }

    const position = (player?.pos || player?.position || careerRows[0]?.POS || 'WR').toUpperCase();
    const sections = getCareerDisplaySections(getCareerSectionsForPosition(position));
    const columns = sections.flatMap((section) => section.stats.map((statKey) => ({
        statKey,
        section
    })));
    const frozenSections = sections.filter((section) => section.id === 'season');
    const scrollSections = sections.filter((section) => section.id !== 'season');
    const frozenColumns = columns.filter(({ section }) => section.id === 'season');
    const scrollColumns = columns.filter(({ section }) => section.id !== 'season');

    const tableContainer = document.createElement('div');
    tableContainer.className = 'career-stats-table-container';
    tableContainer.dataset.rowCount = String(careerRows.length);
    // Career table row-height tiers (mobile-first):
    //   ≥10 rows → --full  (most compact, only 10 is the max)
    //   ≤4  rows → --short (roomiest)
    //   ≤7  rows → --medium
    //   8-9 rows → default (no class, sweet-spot height)
    if (careerRows.length >= 10) {
        tableContainer.classList.add('career-stats-table-container--full');
    } else if (careerRows.length <= 4) {
        tableContainer.classList.add('career-stats-table-container--short');
    } else if (careerRows.length <= 7) {
        tableContainer.classList.add('career-stats-table-container--medium');
    }

    const getColumnClass = (statKey) => {
        if (statKey === 'SZN') return 'career-stats-col--season';
        if (statKey === 'TM') return 'career-stats-col--team';
        if (statKey === 'G') return 'career-stats-col--games';
        if (statKey === 'FPTS_VALUE' || statKey === 'PPG_VALUE') return 'career-stats-col--fantasy-value';
        if (statKey.endsWith('_POS_RK')) return 'career-stats-col--fantasy-pos-rank';
        if (statKey.endsWith('_OVR_RK')) return 'career-stats-col--fantasy-ovr-rank';
        return 'career-stats-col--stat';
    };

    const buildCareerTablePane = (paneSections, paneColumns, paneClass) => {
        const pane = document.createElement('div');
        pane.className = paneClass;
        const table = document.createElement('table');
        table.className = 'career-stats-table';

        const colgroup = document.createElement('colgroup');
        paneColumns.forEach(({ statKey }) => {
            const col = document.createElement('col');
            col.className = getColumnClass(statKey);
            colgroup.appendChild(col);
        });
        table.appendChild(colgroup);

        const thead = document.createElement('thead');
        const groupRow = document.createElement('tr');
        paneSections.forEach((section, sectionIndex) => {
            const th = document.createElement('th');
            const sectionIdClass = String(section?.id || '').replace(/[^a-z0-9_-]/gi, '-');
            th.className = `career-stats-group-header career-stats-group-header--${section.tone || section.id}`;
            if (sectionIdClass) th.classList.add(`career-stats-group-header--${sectionIdClass}`);
            if (sectionIndex > 0) th.classList.add('career-stats-group-header--group-start');
            th.colSpan = section.stats.length;
            th.appendChild(createCareerGroupHeaderContent(section));
            groupRow.appendChild(th);
        });
        thead.appendChild(groupRow);

        const headerRow = document.createElement('tr');
        paneColumns.forEach(({ statKey, section }, columnIndex) => {
            const th = document.createElement('th');
            const sectionIdClass = String(section?.id || '').replace(/[^a-z0-9_-]/gi, '-');
            th.className = `career-stats-header career-stats-header--${section.tone || section.id}`;
            if (sectionIdClass) th.classList.add(`career-stats-header--${sectionIdClass}`);
            if (columnIndex > 0 && paneColumns[columnIndex - 1]?.section.id !== section.id) {
                th.classList.add('career-stats-colgroup-start');
            }
            th.textContent = getCareerHeaderLabel(statKey);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        careerRows.forEach((row) => {
            const tr = document.createElement('tr');
            paneColumns.forEach(({ statKey, section }, columnIndex) => {
                const td = document.createElement('td');
                td.className = `career-stats-cell career-stats-cell--${section.tone || section.id}`;
                if (columnIndex > 0 && paneColumns[columnIndex - 1]?.section.id !== section.id) {
                    td.classList.add('career-stats-colgroup-start');
                }
                if (statKey === 'SZN') {
                    td.classList.add('career-stats-cell--szn');
                    td.textContent = formatCareerCellValue(row, statKey);
                } else if (statKey === 'TM') {
                    td.classList.add('career-stats-cell--team');
                    appendCareerTeamCellContent(td, row);
                } else if (statKey === 'FPTS_VALUE' || statKey === 'PPG_VALUE') {
                    td.classList.add('career-stats-cell--fantasy-value');
                    const valueMeta = getCareerFantasyValueMeta(row, statKey, position);
                    td.textContent = valueMeta.value;
                    if (valueMeta.color && valueMeta.color !== 'inherit') td.style.color = valueMeta.color;
                } else if (statKey.startsWith('FPTS_') || statKey.startsWith('PPG_')) {
                    td.classList.add('career-stats-cell--fantasy-chip');
                    appendCareerFantasySplitCellContent(td, row, statKey, position);
                } else {
                    td.textContent = formatCareerCellValue(row, statKey);
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        pane.appendChild(table);
        return pane;
    };

    const frozenPane = buildCareerTablePane(frozenSections, frozenColumns, 'career-stats-frozen-pane');
    const scrollPane = document.createElement('div');
    scrollPane.className = 'career-stats-scroll-pane';
    const hScroll = document.createElement('div');
    hScroll.className = 'career-stats-hscroll';
    hScroll.appendChild(buildCareerTablePane(scrollSections, scrollColumns, 'career-stats-scroll-table-wrap'));
    scrollPane.appendChild(hScroll);

    tableContainer.appendChild(frozenPane);
    tableContainer.appendChild(scrollPane);
    container.appendChild(tableContainer);
}

async function renderGameLogs(gameLogs, player, playerRanks, requestSeq) {
    const isStaleRequest = () => Number.isFinite(requestSeq) && requestSeq !== gameLogsModalRequestSeq;
    if (isStaleRequest()) return;
    // Keep current player data so overlay panels (including radar) can re-render.
    state.currentGameLogsPlayer = player;
    state.currentGameLogsPlayerRanks = playerRanks;
    state.currentGameLogsSummary = {
        fpts: playerRanks?.total_pts,
        ppg: playerRanks?.ppg
    };

    // Stats page doesn't require league context (uses sheet data), other pages do
    const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
    if (!league && !state.isGameLogFromStatsPage) return;
    const scoringSettings = league?.scoring_settings || {};
    const fullPlayer = state.players[player.id];
    const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;
    const modalHeader = document.getElementById('modal-header');

    // Clean up any existing header containers
    const existingContainer = modalHeader.querySelector('.modal-header-left-container');
    if (existingContainer) existingContainer.remove();

    const modalHeaderLeftContainer = document.createElement('div');
    modalHeaderLeftContainer.className = 'modal-header-left-container';
    const posTag = document.createElement('div');
    posTag.className = `player-tag modal-pos-tag ${player.pos}`;
    posTag.dataset.pos = player.pos;
    posTag.textContent = player.pos;
    modalHeaderLeftContainer.appendChild(posTag);
    // Stats page modal header team source:
    // when the modal is opened from the Stats page, prefer the cached `SZN.csv` team
    // so the logo/tag ignores any external player-team fallbacks.
    const statsPageTeam = state.isGameLogFromStatsPage ? state.statsPagePlayerData?.team : null;
    const teamKey = (statsPageTeam || player.team || 'FA').toUpperCase();
    const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
    const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
    const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
    const teamLogoChip = document.createElement('div');
    teamLogoChip.className = 'player-tag modal-team-logo-chip';
    teamLogoChip.dataset.team = teamKey;
    teamLogoChip.innerHTML = (teamKey && teamKey !== 'FA')
        ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="24" height="24" loading="eager">`
        : `<span>FA</span>`;
    modalHeaderLeftContainer.appendChild(teamLogoChip);
    modalHeader.insertBefore(modalHeaderLeftContainer, modalHeader.firstChild);
    if (modalPlayerVitals) {
        modalPlayerVitals.innerHTML = '';
        const vitals = getPlayerVitals(player.id);
        modalPlayerVitals.appendChild(createPlayerVitalsElement(vitals, { variant: 'modal', pos: player.pos }));
    }
    // Render summary chips
    const summaryChipsContainer = document.getElementById('modal-summary-chips');
    summaryChipsContainer.innerHTML = `
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts} </span>
                        <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                         <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.posRank || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.overallRank)}">${typeof playerRanks.overallRank === 'number' ? '#' + playerRanks.overallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
                        <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppgPosRank || 'NA'}</span>
                        </span>
                      <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.ppgOverallRank)}">${typeof playerRanks.ppgOverallRank === 'number' ? '#' + playerRanks.ppgOverallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getKtcColor(player.ktc)}">${player.ktc}</span>
                        <span class="chip-unit"> KTC</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(parseInt(player.posRank?.split('·')[1], 10), player.pos)}">${player.posRank?.split('·')[1] || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(player.overallRank)}">${typeof player.overallRank === 'number' ? '#' + player.overallRank : 'NA'}</span>
                    </div>
                </div>
            `;
    modalBody.innerHTML = ''; // Clear existing content

    // Build shared stat metadata (used by both GL and SZN views)
    const statLabels = buildStatLabels();
    const qbStatOrder = [
        'fpts',
        'proj',
        'pass_rtg',
        'pass_yd',
        'pass_td',
        'cmp_pct',
        'yds_total',
        'rush_yd',
        'rush_td',
        'pass_att',
        'pass_cmp',
        'pass_fd',
        'imp_per_g',
        'pass_imp',
        'pass_imp_per_att',
        'rush_att',
        'ypc',
        'ttt',
        'prs_pct',
        'pass_sack',
        'pass_int',
        'fum',
        'fpoe'
    ];
    const rbStatOrder = [
        'fpts',
        'proj',
        'snp_pct',
        'rush_att',
        'rush_yd',
        'ypc',
        'rush_td',
        'rec',
        'rec_yd',
        'rec_tgt',
        // Show TS% for RBs as well (right after targets).
        'ts_per_rr',
        'yds_total',
        'elu',
        'mtf_per_att',
        'yco_per_att',
        'mtf',
        'rush_yac',
        'rush_fd',
        'rec_td',
        'rec_fd',
        'rec_yar',
        'imp_per_g',
        'fum',
        'fpoe'
    ];
    const wrTeStatOrder = [
        'fpts',
        'proj',
        'snp_pct',
        'rec_tgt',
        'rec',
        'ts_per_rr',
        'rec_yd',
        'rec_td',
        'yprr',
        'rec_fd',
        'first_down_rec_rate',
        'rec_yar',
        'ypr',
        'imp_per_g',
        'rr',
        'fpoe',
        'yds_total',
        'rush_att',
        'rush_yd',
        'rush_td',
        'ypc',
        'fum'
    ];
    const statGroupByKey = new Map();
    const assignStatGroup = (group, keys) => {
        for (const key of keys) statGroupByKey.set(key, group);
    };
    assignStatGroup('all', ['fpts', 'ppg', 'proj', 'snp_pct', 'yds_total', 'imp_per_g', 'fum', 'fpoe']);
    assignStatGroup('passing', [
        'pass_rtg', 'pass_yd', 'pass_td', 'cmp_pct', 'pass_att', 'pass_cmp', 'pass_fd',
        'pass_imp', 'pass_imp_per_att', 'ttt', 'prs_pct', 'pass_sack', 'cpoe','dp_pct', 'pass_int', 'epa_per_db', 'pa_ypg'
    ]);
    assignStatGroup('rushing', [
        'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'elu', 'mtf_per_att',
        'yco_per_att', 'expl_ru_pct', 'mtf', 'rush_yac', 'ryoe', 'ru_ypg'
    ]);
    assignStatGroup('receiving', [
        'rec', 'rec_yd', 'rec_tgt', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr',
        'ts_per_rr', 'first_down_rec_rate', 'rr', 'rz_tgt', 'rec_ypg', 'ay_pct'
    ]);
    let orderedStatKeys;
    if (player.pos === 'QB') orderedStatKeys = qbStatOrder;
    else if (player.pos === 'RB') orderedStatKeys = rbStatOrder;
    else if (player.pos === 'WR' || player.pos === 'TE') orderedStatKeys = wrTeStatOrder;
    else orderedStatKeys = ['fpts', 'pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'imp_per_g', 'pass_rtg', 'pass_imp', 'pass_imp_per_att', 'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'ttt', 'prs_pct', 'mtf', 'mtf_per_att', 'rush_yac', 'yco_per_att', 'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr', 'ts_per_rr', 'rr', 'fum', 'snp_pct', 'yds_total', 'fpoe'];

    if (!gameLogs || gameLogs.length === 0) {
        const noLogsEl = document.createElement('p');
        noLogsEl.className = 'no-logs';
        noLogsEl.dataset.gamelogsView = 'gl';
        noLogsEl.textContent = `No game logs found for ${playerName} for the current season.`;
        modalBody.appendChild(noLogsEl);
        const sznContainer = document.createElement('div');
        sznContainer.className = 'game-logs-szn-view hidden';
        const seasonTotals = state.playerSeasonStats?.[player.id] || null;
        renderGameLogsSeasonStatsView({
            container: sznContainer,
            player,
            orderedStatKeys,
            statLabels,
            seasonTotals,
            aggregatedTotals: {},
            snapPctValues: [],
            statValueCounts: {},
            gameLogsWithData: [],
            scoringSettings,
            statGroupByKey
        });
        modalBody.appendChild(sznContainer);
        if (pageType === 'rosters') {
            // Rosters Game Logs modal Career view:
            // append the career table beside the existing GL/SZN view containers so
            // the view switcher can fully swap table modes without affecting Stats.
            const careerContainer = document.createElement('div');
            careerContainer.className = 'game-logs-career-view hidden';
            modalBody.appendChild(careerContainer);
            await renderGameLogsCareerStatsView({ container: careerContainer, player, requestSeq });
            if (isStaleRequest()) return;
        }
        if (statsKeyContainer) {
            statsKeyContainer.classList.add('hidden');
            modalBody.appendChild(statsKeyContainer);
        }
        if (radarChartContainer) {
            radarChartContainer.classList.add('hidden');
            modalBody.appendChild(radarChartContainer);
        }
        if (consistencyContainer) {
            consistencyContainer.classList.add('hidden');
            modalBody.appendChild(consistencyContainer);
            prepareConsistencyPanel(player);
        }
        setGameLogsModalView(state.currentGameLogsView || 'gl');
        return;
    }
    const container = document.createElement('div');
    container.className = 'game-logs-table-container';
    const COLUMN_WIDTHS = {
        week: 56,
        proj: 32,
        snp_pct: 44,
        ts_per_rr: 38,
        first_down_rec_rate: 30,
        yds_total: 37,
        rush_att: 34,
        rush_td: 35,
        rush_yd: 44,
        rec_tgt: 41,
        rec: 36,
        rec_yd: 38,
        rec_td: 44,
        ypr: 40,
        yprr: 42,
        imp_per_g: 45,
        pass_rtg: 48,
        pass_yd: 40,
        pass_td: 36,
        pass_att: 38,
        pass_cmp: 38,
        pass_imp_per_att: 44,
        prs_pct: 42,
        ttt: 38,
        yco_per_att: 44,
        ypc: 40,
        mtf_per_att: 44,
        fpts: 45,
        ktc: 80,
        pass_fd: 36,
        pass_imp: 36,
        pass_int: 34,
        pass_sack: 34,
        rush_fd: 36,
        mtf: 36,
        elu: 36,
        rush_yac: 36,
        rec_fd: 36,
        rec_yar: 36,
        rr: 36,
        imp: 36,
        fum: 36,
        fpoe: 36,
        ypg: 36,
        pa_ypg: 36,
        ru_ypg: 36,
        rec_ypg: 36
    };
    const DEFAULT_COLUMN_WIDTH = 54;
    const tableColumns = [{
        id: 'week',
        accessorKey: 'week',
        header: () => 'WK  ·  VS ',
        size: COLUMN_WIDTHS.week,
        meta: {
            headerClass: 'week-column-header',
            cellClass: 'week-cell',
            footerClass: 'week-column-header',
            statKey: null
        }
    }];
    for (const key of orderedStatKeys) {
        if (!statLabels[key]) continue;
        const statGroup = statGroupByKey.get(key);
        tableColumns.push({
            id: key,
            accessorKey: key,
            header: () => statLabels[key],
            size: COLUMN_WIDTHS[key] || DEFAULT_COLUMN_WIDTH,
            meta: {
                headerClass: statGroup ? `gamelog-header-${statGroup}` : undefined,
                cellClass: key === 'proj' ? 'proj-cell' : undefined,
                footerClass: key === 'proj' ? 'proj-cell' : undefined,
                statKey: key
            }
        });
    }
    const totalColumns = tableColumns.length;
    const tableRows = [];
    const rowsMeta = [];
    const gameLogsWithData = [];
    const gameLogsByWeek = new Map(gameLogs.map(entry => [parseInt(entry.week, 10), entry]));
    const createTextDescriptor = (text, style) => ({
        render: (td) => {
            td.textContent = text;
            if (style) Object.assign(td.style, style);
        }
    });
    const getProjectionDisplayValue = (statLine, playerId, week) => {
        // First try the provided statLine (for played weeks)
        if (statLine && Object.prototype.hasOwnProperty.call(statLine, 'proj')) {
            const rawValue = statLine.proj;
            // Always return as string, even empty strings
            return String(rawValue);
        }
        // For unplayed weeks, check weekly stats directly
        const weeklyStat = state.playerWeeklyStats?.[week]?.[playerId];
        if (weeklyStat && Object.prototype.hasOwnProperty.call(weeklyStat, 'proj')) {
            const rawValue = weeklyStat.proj;
            // Always return as string, even empty strings
            return String(rawValue);
        }
        return '';
    };
    for (let week = 1; week <= MAX_DISPLAY_WEEKS; week++) {
        const weekStatsEntry = gameLogsByWeek.get(week) || null;
        const stats = weekStatsEntry?.stats || null;
        const isProjectionWeek = state.playerProjectionWeeks?.[week] === true;
        const sheetStatsForWeek = state.playerWeeklyStats?.[week]?.[player.id] || null;
        const opponent = stats?.opponent || null;
        const isByeWeek = opponent === 'BYE';
        const hasSheetStats = !!sheetStatsForWeek && Object.entries(sheetStatsForWeek).some(([statKey, statVal]) => {
            if (!statLabels[statKey] || statKey === 'proj') return false;
            return typeof statVal === 'number';
        });
        const hasRecordedStat = stats
            ? orderedStatKeys.some(key => {
                if (!statLabels[key] || key === 'proj') return false;
                return typeof stats[key] === 'number';
            })
            : false;
        const liveFptsValue = typeof stats?.fpts === 'number' && Number.isFinite(stats.fpts) ? stats.fpts : null;
        const isLiveWeek = stats?.__live === true || (liveFptsValue !== null && !isProjectionWeek);
        const suppressNonFptsForLiveOnly = isLiveWeek && !hasSheetStats;
        const isUnplayedWeek = !isLiveWeek && (isProjectionWeek || isByeWeek || !hasRecordedStat);
        const rowMeta = {
            week,
            isPlayed: !isUnplayedWeek,
            rowClasses: []
        };
        const rowData = { __meta: rowMeta };
        if (isByeWeek) rowMeta.rowClasses.push('bye-week-row');
        if (isUnplayedWeek) rowMeta.rowClasses.push('unplayed-week-row');
        else if (isLiveWeek) rowMeta.rowClasses.push('live-week-row');
        const opponentRankColor = getOpponentRankColor(stats?.opponent_rank);
        rowData.week = {
            render: (td) => {
                const weekTag = document.createElement('div');
                weekTag.className = 'gamelog-week-tag';
                const weekNumberLine = document.createElement('div');
                weekNumberLine.className = 'gamelog-week-tag-number';
                weekNumberLine.textContent = `WK-${week}`;
                weekTag.appendChild(weekNumberLine);
                if (opponent) {
                    const opponentLine = document.createElement('div');
                    opponentLine.className = 'gamelog-week-tag-opponent';
                    if (isByeWeek) {
                        opponentLine.textContent = 'BYE';
                    } else {
                        const opponentText = document.createElement('span');
                        opponentText.className = 'gamelog-week-tag-opponent-text';
                        opponentText.textContent = opponent;
                        if (opponentRankColor) opponentText.style.color = opponentRankColor;
                        opponentLine.appendChild(opponentText);
                        const opponentRank = stats?.opponent_rank;
                        const opponentRankDisplay = getRankDisplayText(opponentRank);
                        if (opponentRankDisplay !== 'NA') {
                            const separator = document.createElement('span');
                            separator.className = 'gamelog-week-tag-separator';
                            separator.textContent = ' • ';
                            opponentLine.appendChild(separator);
                            const rankSpan = document.createElement('span');
                            rankSpan.className = 'gamelog-week-tag-rank';
                            if (opponentRankColor) rankSpan.style.color = opponentRankColor;
                            const rankNumber = document.createElement('span');
                            rankNumber.className = 'gamelog-week-tag-rank-number';
                            rankNumber.textContent = opponentRank;
                            rankSpan.appendChild(rankNumber);
                            const suffix = document.createElement('span');
                            suffix.className = 'gamelog-week-tag-rank-suffix';
                            const j = opponentRank % 10;
                            const k = opponentRank % 100;
                            if (j === 1 && k !== 11) suffix.textContent = 'st';
                            else if (j === 2 && k !== 12) suffix.textContent = 'nd';
                            else if (j === 3 && k !== 13) suffix.textContent = 'rd';
                            else suffix.textContent = 'th';
                            rankSpan.appendChild(suffix);
                            opponentLine.appendChild(rankSpan);
                        }
                    }
                    weekTag.appendChild(opponentLine);
                }
                td.textContent = '';
                td.appendChild(weekTag);
            }
        };
        // SNP-aware designation set for PROJ override logic
        const KNOWN_DESIGNATIONS = new Set(['BYE', 'OUT', 'IR', 'PUP', 'DNP', 'SUS', 'D', 'Q']);
        // Track per-row whether FPTS ended up as "-" so we can apply .dnp-week-row dimming
        let rowFptsDash = false;
        for (const key of orderedStatKeys) {
            if (!statLabels[key]) continue;
            if (isUnplayedWeek) {
                if (key === 'proj') {
                    let projValue = getProjectionDisplayValue(stats, player.id, week);
                    // Phase 4: If SNP = 0 and no existing designation, set PROJ to "DNP"
                    const weekSnp = stats?.snp;
                    if (typeof weekSnp === 'number' && weekSnp === 0) {
                        const upperProj = (projValue || '').trim().toUpperCase();
                        const firstToken = upperProj.split(/\s+/)[0]?.replace(/[^A-Z]/g, '') || '';
                        if (!KNOWN_DESIGNATIONS.has(firstToken)) {
                            projValue = 'DNP';
                        }
                    }
                    const display = projValue === undefined || projValue === null ? '' : String(projValue);
                    const designationMeta = parseInjuryDesignation(display);
                    rowData[key] = createTextDescriptor(display, { color: designationMeta ? designationMeta.color : '' });
                } else {
                    rowData[key] = createTextDescriptor('-', { color: '' });
                }
                continue;
            }
            if (suppressNonFptsForLiveOnly && key !== 'fpts' && key !== 'proj') {
                rowData[key] = createTextDescriptor('-');
                continue;
            }
            if (!weekStatsEntry || !stats) {
                rowData[key] = createTextDescriptor('-');
                continue;
            }
            if (key === 'proj') {
                let projValue = getProjectionDisplayValue(stats, player.id, week);
                // Phase 4: If SNP = 0 and no existing designation, set PROJ to "DNP"
                const weekSnp = stats?.snp;
                if (typeof weekSnp === 'number' && weekSnp === 0) {
                    const upperProj = (projValue || '').trim().toUpperCase();
                    const firstToken = upperProj.split(/\s+/)[0]?.replace(/[^A-Z]/g, '') || '';
                    if (!KNOWN_DESIGNATIONS.has(firstToken)) {
                        projValue = 'DNP';
                    }
                }
                const display = projValue === undefined || projValue === null ? '' : String(projValue);
                const designationMeta = parseInjuryDesignation(display);
                rowData[key] = createTextDescriptor(display, { color: designationMeta ? designationMeta.color : '' });
                continue;
            }
            let value;
            if (NO_FALLBACK_KEYS.has(key)) {
                const raw = stats[key];
                value = (typeof raw === 'number') ? raw : null;
            } else if (key === 'fpts') {
                // Stats page uses sheet FPT_PPR, rosters page uses league-specific matchup data
                if (state.isGameLogFromStatsPage) {
                    value = (typeof stats['fpt_ppr'] === 'number') ? stats['fpt_ppr'] : null;
                } else if (state.matchupDataLoaded && state.leagueMatchupStats[week]?.[player.id] !== undefined) {
                    // Use league-specific matchup data from Sleeper
                    value = state.leagueMatchupStats[week][player.id];
                } else if (typeof stats['snp'] === 'number' && stats['snp'] > 0) {
                    // Supplement: player played (SNP > 0) but not in matchup data for this week.
                    // Compute league-specific FPTS from CSV stats + league scoring settings.
                    value = calculateFantasyPoints(stats, scoringSettings);
                } else {
                    value = null;
                }
                // Phase 3: If SNP = 0 for this week, force FPTS to show "-"
                if (typeof stats['snp'] === 'number' && stats['snp'] === 0) {
                    value = null;
                }
                // Track that FPTS is "-" for this row (for .dnp-week-row dimming)
                if (value === null) rowFptsDash = true;
            }
            else if (key === 'ypc') value = (stats['rush_att'] || 0) > 0 ? ((stats['rush_yd'] || 0) / stats['rush_att']) : 0;
            else if (key === 'yco_per_att') value = (stats['rush_att'] || 0) > 0 ? ((stats['rush_yac'] || 0) / stats['rush_att']) : 0;
            else if (key === 'mtf_per_att') value = (stats['rush_att'] || 0) > 0 ? ((stats['mtf'] || 0) / stats['rush_att']) : 0;
            else if (key === 'pass_imp_per_att') {
                const passImp = stats['pass_imp'];
                const passAtt = stats['pass_att'];
                if (typeof stats[key] === 'number') value = stats[key];
                else if (typeof passImp === 'number' && typeof passAtt === 'number' && passAtt > 0) value = (passImp / passAtt) * 100;
                else value = 0;
            }
            else if (key === 'ts_per_rr') {
                if (typeof stats[key] === 'number') value = stats[key];
                else {
                    const routes = stats['rr'] || 0;
                    const targets = stats['rec_tgt'] || 0;
                    value = routes > 0 ? (targets / routes) * 100 : 0;
                }
            }
            else if (key === 'yprr') {
                if (typeof stats[key] === 'number') value = stats[key];
                else {
                    const routes = stats['rr'] || 0;
                    const yards = stats['rec_yd'] || 0;
                    value = routes > 0 ? yards / routes : 0;
                }
            }
            else if (key === 'ypr') {
                if (typeof stats[key] === 'number') value = stats[key];
                else {
                    const receptions = stats['rec'] || 0;
                    const yards = stats['rec_yd'] || 0;
                    value = receptions > 0 ? yards / receptions : 0;
                }
            }
            else if (key === 'first_down_rec_rate') {
                if (typeof stats[key] === 'number') value = stats[key];
                else {
                    const rec_fd = stats['rec_fd'] || 0;
                    const rec = stats['rec'] || 0;
                    value = rec > 0 ? (rec_fd / rec) : 0;
                }
            }
            else if (key === 'imp_per_g') {
                if (typeof stats[key] === 'number') value = stats[key];
                else value = stats['imp'] || 0;
            }
            else if (key === 'prs_pct' || key === 'snp_pct' || key === 'cmp_pct') value = typeof stats[key] === 'number' ? stats[key] : 0;
            else if (key === 'ttt') value = typeof stats[key] === 'number' ? stats[key] : 0;
            else value = stats[key] || 0;
            let displayValue;
            // For FPTS, show "-" instead of "N/A" when value is null (e.g. SNP=0 or no data)
            if (value === null || typeof value !== 'number') displayValue = key === 'fpts' ? '-' : 'N/A';
            else if (key === 'yco_per_att') displayValue = value.toFixed(2);
            else if (key === 'mtf_per_att' || key === 'ypc' || key === 'ttt' || key === 'ypr' || key === 'yprr' || key === 'first_down_rec_rate') displayValue = value.toFixed(2);
            else if (key === 'pass_imp_per_att' || key === 'prs_pct' || key === 'snp_pct' || key === 'ts_per_rr' || key === 'cmp_pct') displayValue = formatPercentage(value);
            else if (key === 'pass_rtg' || key === 'fpts') displayValue = value.toFixed(1);
            else displayValue = Number.isInteger(value) ? String(value) : value.toFixed(2);
            rowData[key] = createTextDescriptor(displayValue);
        }
        // Phase 5: Apply .dnp-week-row dimming when FPTS is "-" (but not BYE weeks)
        if (rowFptsDash && !isByeWeek) {
            rowMeta.rowClasses.push('dnp-week-row');
        }
        if (!isUnplayedWeek && weekStatsEntry) {
            gameLogsWithData.push(weekStatsEntry);
        }
        tableRows.push(rowData);
        rowsMeta.push(rowMeta);
    }
    const sleeperCurrentWeek = Number.isFinite(state.currentNflWeek) ? state.currentNflWeek : null;
    let dividerIndex = rowsMeta.length;
    if (Number.isFinite(sleeperCurrentWeek)) {
        const currentWeekIndex = rowsMeta.findIndex(meta => meta.week === sleeperCurrentWeek);
        if (currentWeekIndex !== -1) {
            dividerIndex = rowsMeta[currentWeekIndex].isPlayed ? currentWeekIndex + 1 : currentWeekIndex;
        }
    }
    if (!Number.isFinite(dividerIndex)) dividerIndex = rowsMeta.length;
    if (!rowsMeta.some(meta => meta.isPlayed)) dividerIndex = 0;
    dividerIndex = Math.max(0, Math.min(dividerIndex, rowsMeta.length));
    let tableCore;
    try {
        tableCore = await ensureTableCoreLoaded();
    } catch (error) {
        console.error('Failed to load TanStack Table library', error);
        tableCore = null;
    }
    if (isStaleRequest()) return;
    let tableInstance = null;
    let columnSizes = tableColumns.map(col => Number.isFinite(col.size) ? col.size : DEFAULT_COLUMN_WIDTH);
    if (tableCore) {
        try {
            const initialColumnOrder = tableColumns.map(c => c.id);
            tableInstance = tableCore.createTable({
                data: tableRows,
                columns: tableColumns,
                state: { columnOrder: initialColumnOrder },
                onStateChange: () => { },
                defaultColumn: { size: DEFAULT_COLUMN_WIDTH, minSize: 64 },
                columnResizeMode: 'onChange',
                getCoreRowModel: tableCore.getCoreRowModel(),
                renderFallbackValue: ''
            });
            if (typeof tableInstance.getVisibleLeafColumns === 'function') {
                const leaf = tableInstance.getVisibleLeafColumns();
                if (Array.isArray(leaf) && leaf.length === tableColumns.length) {
                    columnSizes = leaf.map((col, i) => {
                        const s = typeof col.getSize === 'function' ? col.getSize() : undefined;
                        return Number.isFinite(s) ? s : (Number.isFinite(tableColumns[i].size) ? tableColumns[i].size : DEFAULT_COLUMN_WIDTH);
                    });
                }
            }
        } catch (e) {
            console.error('TanStack createTable failed; using manual renderer', e);
            tableInstance = null;
        }
    }
    const createSectionTable = () => {
        const table = document.createElement('table');
        table.className = 'game-logs-table';
        const colgroup = document.createElement('colgroup');
        columnSizes.forEach(size => {
            const col = document.createElement('col');
            col.style.width = `${size}px`;
            colgroup.appendChild(col);
        });
        table.appendChild(colgroup);
        return table;
    };
    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'game-logs-table-header';
    const headerTable = createSectionTable();
    const tableHeaderThead = document.createElement('thead');
    headerTable.appendChild(tableHeaderThead);
    headerWrapper.appendChild(headerTable);
    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'game-logs-table-body';
    const bodyTable = createSectionTable();
    const tableBodyTbody = document.createElement('tbody');
    bodyTable.appendChild(tableBodyTbody);
    bodyWrapper.appendChild(bodyTable);
    const footerWrapper = document.createElement('div');
    footerWrapper.className = 'game-logs-table-footer';
    const footerTable = createSectionTable();
    const tableFooterTfoot = document.createElement('tfoot');
    footerTable.appendChild(tableFooterTfoot);
    footerWrapper.appendChild(footerTable);
    const applyCellDescriptor = (td, descriptor) => {
        td.textContent = '';
        td.innerHTML = '';
        if (!descriptor) return;
        if (typeof descriptor.render === 'function') descriptor.render(td);
    };
    if (tableInstance && typeof tableInstance.getHeaderGroups === 'function') {
        tableInstance.getHeaderGroups().forEach(group => {
            const tr = document.createElement('tr');
            group.headers.forEach((header, idx) => {
                const th = document.createElement('th');
                const meta = header.column.columnDef.meta;
                if (meta?.headerClass) meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
                if (!header.isPlaceholder) {
                    const hv = header.column.columnDef.header;
                    th.textContent = typeof hv === 'function' ? hv(header.getContext()) : (hv || '');
                }
                const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
                th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
                tr.appendChild(th);
            });
            tableHeaderThead.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        tableColumns.forEach((col, idx) => {
            const th = document.createElement('th');
            if (col.meta?.headerClass) col.meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
            const label = typeof col.header === 'function' ? col.header({}) : col.header;
            th.textContent = label || '';
            const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
            th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
            tr.appendChild(th);
        });
        tableHeaderThead.appendChild(tr);
    }
    if (tableInstance && typeof tableInstance.getRowModel === 'function') {
        const rowModel = tableInstance.getRowModel();
        rowModel.rows.forEach((row, index) => {
            const tr = document.createElement('tr');
            const meta = rowsMeta[index];
            if (meta) { meta.domRow = tr; meta.rowClasses.forEach(cls => tr.classList.add(cls)); }
            row.getVisibleCells().forEach((cell, cIdx) => {
                const td = document.createElement('td');
                const columnMeta = cell.column.columnDef.meta;
                if (columnMeta?.cellClass) columnMeta.cellClass.split(' ').forEach(cls => { if (cls) td.classList.add(cls); });
                applyCellDescriptor(td, cell.getValue());
                const w = columnSizes[cIdx] || DEFAULT_COLUMN_WIDTH;
                td.style.width = `${w}px`; td.style.minWidth = `${w}px`; td.style.maxWidth = `${w}px`;
                tr.appendChild(td);
            });
            tableBodyTbody.appendChild(tr);
        });
    } else {
        tableRows.forEach((rowData, index) => {
            const tr = document.createElement('tr');
            const meta = rowsMeta[index];
            if (meta) { meta.domRow = tr; meta.rowClasses.forEach(cls => tr.classList.add(cls)); }
            tableColumns.forEach((col, cIdx) => {
                const td = document.createElement('td');
                if (col.meta?.cellClass) col.meta.cellClass.split(' ').forEach(cls => { if (cls) td.classList.add(cls); });
                const descriptor = rowData[col.id];
                if (descriptor && typeof descriptor.render === 'function') descriptor.render(td);
                const w = columnSizes[cIdx] || DEFAULT_COLUMN_WIDTH;
                td.style.width = `${w}px`; td.style.minWidth = `${w}px`; td.style.maxWidth = `${w}px`;
                tr.appendChild(td);
            });
            tableBodyTbody.appendChild(tr);
        });
    }
    const totalTableWidth = columnSizes.reduce((sum, size) => sum + size, 0);
    if (Number.isFinite(totalTableWidth) && totalTableWidth > 0) {
        const widthPx = `${totalTableWidth}px`;
        headerTable.style.minWidth = widthPx;
        headerTable.style.width = widthPx;
        bodyTable.style.minWidth = widthPx;
        bodyTable.style.width = widthPx;
        footerTable.style.minWidth = widthPx;
        footerTable.style.width = widthPx;
    }
    if (rowsMeta.length > 0) {
        const dividerRow = document.createElement('tr');
        dividerRow.className = 'week-divider-row';
        const dividerTd = document.createElement('td');
        dividerTd.colSpan = totalColumns;
        dividerRow.appendChild(dividerTd);
        const referenceRow = rowsMeta[dividerIndex]?.domRow || null;
        tableBodyTbody.insertBefore(dividerRow, referenceRow);
    }
    // Shared season totals/aggregates (used by footer + SZN view)
    const seasonTotals = state.playerSeasonStats?.[player.id] || null;
    const aggregatedTotals = {};
    const snapPctValues = [];
    const statValueCounts = {};
    gameLogsWithData.forEach(weekStats => {
        for (const key in weekStats.stats) {
            const statValue = parseFloat(weekStats.stats[key]);
            if (Number.isNaN(statValue)) continue;
            if (key === 'snp_pct') {
                snapPctValues.push(statValue);
            } else {
                aggregatedTotals[key] = (aggregatedTotals[key] || 0) + statValue;
            }
            statValueCounts[key] = (statValueCounts[key] || 0) + 1;
        }
    });

    // Add table footer for totals
    state.currentGameLogsFooterStats = { __gamesPlayed: gameLogsWithData.length };
    if (gameLogsWithData.length > 0) {
        tableFooterTfoot.innerHTML = '';
        // Append a footer header row to mirror the column labels
        const footerHeaderRow = document.createElement('tr');
        tableColumns.forEach((col, idx) => {
            const th = document.createElement('th');
            if (idx === 0) th.classList.add('modal-table-footer-label', 'week-column-header');
            if (col.meta?.headerClass) {
                col.meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
            }
            let headerText = typeof col.header === 'function' ? col.header({}) : col.header;
            if (col.id === 'week') headerText = 'SZN';
            th.textContent = headerText || '';
            const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
            th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
            footerHeaderRow.appendChild(th);
        });
        tableFooterTfoot.appendChild(footerHeaderRow);
        const footerRow = document.createElement('tr');
        const totalTh = document.createElement('th');
        totalTh.className = 'modal-table-footer-label week-column-header';
        const gamesPlayed = getAdjustedGamesPlayed(player.id, scoringSettings);
        totalTh.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gamesPlayed})</span>`;
        const weekColumnSize = columnSizes[0] || DEFAULT_COLUMN_WIDTH;
        totalTh.style.width = `${weekColumnSize}px`;
        totalTh.style.minWidth = `${weekColumnSize}px`;
        totalTh.style.maxWidth = `${weekColumnSize}px`;
        footerRow.appendChild(totalTh);

        // Build numeric season totals used by the radar chart.
        const footerStatsForRadar = {};
        for (let i = 1; i < tableColumns.length; i++) {
            const column = tableColumns[i];
            const key = column.meta?.statKey;
            if (!key || !statLabels[key]) continue;
            const td = document.createElement('td');
            const columnSize = columnSizes[i] || DEFAULT_COLUMN_WIDTH;
            td.style.width = `${columnSize}px`;
            td.style.minWidth = `${columnSize}px`;
            td.style.maxWidth = `${columnSize}px`;
            if (column.meta?.cellClass) {
                column.meta.cellClass.split(' ').forEach(cls => {
                    if (cls) td.classList.add(cls);
                });
            }
            if (key === 'proj') {
                td.textContent = '-';
                footerRow.appendChild(td);
                continue;
            }
            const displayValue = getGameLogsSeasonDisplayValue({
                key,
                seasonTotals,
                aggregatedTotals,
                snapPctValues,
                statValueCounts,
                gameLogsWithData,
                player,
                scoringSettings
            });
            const rankValue = getSeasonRankValue(player.id, key);
            const rankAnnotation = createRankAnnotation(rankValue, { wrapInParens: false, ordinal: true, variant: 'gamelogs-footer' });
            rankAnnotation.classList.add('stat-rank-annotation--bulleted');
            const bulletPrefix = document.createElement('span');
            bulletPrefix.className = 'stat-rank-bullet';
            bulletPrefix.textContent = '•';
            const bulletSuffix = document.createElement('span');
            bulletSuffix.className = 'stat-rank-bullet';
            bulletSuffix.textContent = '•';
            rankAnnotation.insertBefore(bulletPrefix, rankAnnotation.firstChild);
            rankAnnotation.appendChild(bulletSuffix);
            // Stack value on first line and rank annotation below with minimal spacing
            td.textContent = '';
            const valueSpan = document.createElement('span');
            valueSpan.className = 'stat-value';
            valueSpan.textContent = displayValue;
            td.appendChild(valueSpan);
            td.appendChild(rankAnnotation);
            td.classList.add('has-rank-annotation');
            rankAnnotation.style.color = getConditionalColorByRank(rankValue, player.pos);

            // Save a raw numeric value for the radar chart (strip display formatting).
            const numericValue = parseFloat(displayValue.replace(/[,%]/g, ''));
            if (!Number.isNaN(numericValue)) {
                footerStatsForRadar[key] = numericValue;
            }

            footerRow.appendChild(td);
        }

        // PPG is computed here from FPTS and games played.
        if (footerStatsForRadar.fpts !== undefined) {
            const gamesPlayed = gameLogsWithData.length;
            footerStatsForRadar.__gamesPlayed = gamesPlayed;
            if (gamesPlayed > 0) {
                footerStatsForRadar.ppg = footerStatsForRadar.fpts / gamesPlayed;
            }
        } else {
            footerStatsForRadar.__gamesPlayed = gameLogsWithData.length;
        }

        // Save these values so renderPlayerRadarChart() can read them.
        state.currentGameLogsFooterStats = footerStatsForRadar;

        tableFooterTfoot.appendChild(footerRow);
        footerWrapper.classList.remove('hidden');
    } else {
        tableFooterTfoot.innerHTML = '';
        footerWrapper.classList.add('hidden');
    }
    // Wrap header/body/footer in a single horizontal scroller so they move in perfect unison
    const hScroll = document.createElement('div');
    hScroll.className = 'game-logs-hscroll';
    const hContent = document.createElement('div');
    hContent.className = 'game-logs-hscroll-content';
    hContent.appendChild(headerWrapper);
    hContent.appendChild(bodyWrapper);
    hContent.appendChild(footerWrapper);
    hScroll.appendChild(hContent);
    container.appendChild(hScroll);
    modalBody.appendChild(container);
    const sznContainer = document.createElement('div');
    sznContainer.className = 'game-logs-szn-view hidden';
    renderGameLogsSeasonStatsView({
        container: sznContainer,
        player,
        orderedStatKeys,
        statLabels,
        seasonTotals,
        aggregatedTotals,
        snapPctValues,
        statValueCounts,
        gameLogsWithData,
        scoringSettings,
        statGroupByKey
    });
    modalBody.appendChild(sznContainer);
    if (pageType === 'rosters') {
        // Rosters Game Logs modal Career view:
        // append the career table beside the existing GL/SZN view containers so
        // the view switcher can fully swap table modes without affecting Stats.
        const careerContainer = document.createElement('div');
        careerContainer.className = 'game-logs-career-view hidden';
        modalBody.appendChild(careerContainer);
        await renderGameLogsCareerStatsView({ container: careerContainer, player, requestSeq });
        if (isStaleRequest()) return;
    }
    if (statsKeyContainer) {
        statsKeyContainer.classList.add('hidden');
        modalBody.appendChild(statsKeyContainer);
    }
    if (radarChartContainer) {
        radarChartContainer.classList.add('hidden');
        modalBody.appendChild(radarChartContainer);
    }
    if (consistencyContainer) {
        consistencyContainer.classList.add('hidden');
        modalBody.appendChild(consistencyContainer);
        prepareConsistencyPanel(player);
    }
    hScroll.scrollLeft = 0;
    bodyWrapper.scrollTop = 0;
    // Route horizontal wheel/trackpad gestures on tbody to the shared scroller
    bodyWrapper.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            hScroll.scrollLeft += e.deltaX !== 0 ? e.deltaX : e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });
    // Set player vitals width to match summary chips
    const summaryChipsWidth = summaryChipsContainer.offsetWidth;
    const playerVitalsElement = document.querySelector('.player-vitals--modal');
    if (playerVitalsElement) {
        playerVitalsElement.style.width = `${summaryChipsWidth}px`;
    }
    setGameLogsModalView(state.currentGameLogsView || 'gl');
}
async function handlePlayerCompare(e) {
    let selectedPlayersWithTeams = [];
    if (state.isStartSitMode) {
        const startSitCompareSelections = (state.startSitSelections || []).slice(0, 2);
        selectedPlayersWithTeams = startSitCompareSelections.map(selection => {
            const fullPlayer = state.players[selection.id];
            const firstName = (fullPlayer?.first_name || '').trim();
            const lastName = (fullPlayer?.last_name || '').trim();
            const playerName = [firstName, lastName].filter(Boolean).join(' ') || selection.label;
            const normalizedTeam = (selection.team || fullPlayer?.team || 'FA').toUpperCase();
            const primaryPos = (selection.basePos || fullPlayer?.position || selection.pos || '').toUpperCase();
            return {
                id: selection.id,
                label: selection.label,
                teamName: state.startSitTeamName || state.userTeamName || 'Start/Sit',
                name: playerName,
                pos: primaryPos || selection.pos,
                displayPos: selection.pos,
                team: normalizedTeam,
                side: selection.side
            };
        });
    } else {
        for (const teamName in state.tradeBlock) {
            if (Object.prototype.hasOwnProperty.call(state.tradeBlock, teamName)) {
                const assets = state.tradeBlock[teamName];
                assets.forEach(asset => {
                    if (asset.pos !== 'DP') {
                        const fullPlayer = state.players[asset.id];
                        const playerName = fullPlayer
                            ? `${fullPlayer.first_name} ${fullPlayer.last_name}`
                            : asset.label;
                        const normalizedTeam = (asset.team || fullPlayer?.team || 'FA').toUpperCase();
                        const primaryPos = (asset.basePos || fullPlayer?.position || asset.pos || '').toUpperCase();
                        selectedPlayersWithTeams.push({
                            ...asset,
                            teamName,
                            name: playerName,
                            pos: primaryPos || asset.pos,
                            displayPos: asset.pos,
                            team: normalizedTeam
                        });
                    }
                });
            }
        }
    }
    if (!state.isStartSitMode) {
        // Sort to ensure user's player is first
        selectedPlayersWithTeams.sort((a, b) => {
            if (a.teamName === state.userTeamName) return -1;
            if (b.teamName === state.userTeamName) return 1;
            return 0;
        });
    }
    const comparisonModalBody = document.getElementById('comparison-modal-body');
    comparisonModalBody.innerHTML = '<p class="text-center p-4">Loading player comparison...</p>';

    // Mark compare context so any Start/Sit-specific modal styling can be scoped safely.
    if (playerComparisonModal) {
        playerComparisonModal.classList.toggle('start-sit-compare', state.isStartSitMode);
    }

    openComparisonModal();
    const playerData = await Promise.all(selectedPlayersWithTeams.map(async (player) => {
        const gameLogs = await fetchGameLogs(player.id);
        const playerRanks = calculatePlayerStatsAndRanks(player.id);
        const seasonStats = state.playerSeasonStats?.[player.id] || null;
        return { ...player, gameLogs, seasonStats, ...playerRanks };
    }));
    renderPlayerComparison(playerData);
}
function renderPlayerComparison(players) {
    const comparisonModalBody = document.getElementById('comparison-modal-body');
    comparisonModalBody.innerHTML = ''; // Clear existing content
    const container = document.createElement('div');
    container.className = 'player-comparison-container';
    function escapeHtml(unsafe) {
        if (unsafe === null || unsafe === undefined) return '';
        const str = typeof unsafe === 'string' ? unsafe : String(unsafe);
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    // Player Names Row
    const playerNamesRow = document.createElement('div');
    playerNamesRow.className = 'player-names-row';
    players.forEach(player => {
        const fullPlayer = state.players[player.id];
        const playerName = player.name || (fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.label);
        const headerContainer = document.createElement('div');
        headerContainer.className = 'player-name-header-container';
        const nameHeader = document.createElement('div');
        nameHeader.className = 'player-name-header';
        const nameButton = document.createElement('button');
        nameButton.type = 'button';
        nameButton.className = 'player-name-header-link';
        nameButton.textContent = playerName;
        nameButton.onclick = () => {
            state.isGameLogModalOpenFromComparison = true;
            const rosterMeta = getPlayerData(player.id, player.displayPos || player.pos || '');
            const valuations = state.isSuperflex ? state.sflxData[player.id] : state.oneQbData[player.id];
            const parseNumeric = (value) => {
                if (typeof value === 'number' && Number.isFinite(value)) return value;
                if (typeof value === 'string') {
                    const stripped = value.replace(/[^0-9.\-]/g, '');
                    const parsed = Number(stripped);
                    return Number.isFinite(parsed) ? parsed : null;
                }
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : null;
            };
            const firstValidNumber = (candidates, { allowZero = false } = {}) => {
                for (const candidate of candidates) {
                    const parsed = parseNumeric(candidate);
                    if (parsed === null) continue;
                    if (!allowZero && parsed <= 0) continue;
                    return parsed;
                }
                return null;
            };
            const basePos = (player.pos || rosterMeta.pos || fullPlayer?.position || '').toUpperCase();
            const canonicalPos = basePos || 'FA';
            const resolvedTeam = (player.team || rosterMeta.team || fullPlayer?.team || 'FA').toUpperCase();
            const ktcValue = firstValidNumber([
                player.ktc,
                rosterMeta.ktc,
                valuations?.ktc
            ]);
            const overallRankValue = firstValidNumber([
                player.overallRank,
                rosterMeta.overallRank,
                valuations?.overallRank,
                valuations?.overall_rank_ppr
            ]);
            const posRankNumeric = firstValidNumber([
                player.posRank,
                rosterMeta.posRank,
                valuations?.posRank,
                valuations?.pos_rank_ppr
            ]);
            const mergedPlayerData = {
                id: player.id,
                name: player.name || playerName,
                pos: canonicalPos,
                team: resolvedTeam,
                ktc: ktcValue,
                overallRank: overallRankValue ?? null,
                posRank: posRankNumeric ? `${canonicalPos}·${posRankNumeric}` : null
            };
            handlePlayerNameClick(mergedPlayerData);
        };
        const tagsRow = document.createElement('div');
        tagsRow.className = 'player-header-tags';
        const posTag = document.createElement('div');
        posTag.className = `player-tag modal-pos-tag ${player.pos}`;
        posTag.dataset.pos = player.pos;
        posTag.textContent = player.pos;
        const teamKey = (player.team || fullPlayer?.team || 'FA').toUpperCase();
        const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
        const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
        const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
        const teamLogoChip = document.createElement('div');
        teamLogoChip.className = 'player-tag modal-team-logo-chip';
        if (teamKey && teamKey !== 'FA') {
            teamLogoChip.dataset.team = teamKey;
            teamLogoChip.innerHTML = `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20" loading="eager">`;
        } else {
            teamLogoChip.innerHTML = '<span>FA</span>';
        }
        tagsRow.appendChild(posTag);
        tagsRow.appendChild(teamLogoChip);
        nameHeader.appendChild(nameButton);
        nameHeader.appendChild(tagsRow);
        headerContainer.appendChild(nameHeader);
        playerNamesRow.appendChild(headerContainer);
    });
    container.appendChild(playerNamesRow);
    // Summary Chips Row
    const summaryChipsRow = document.createElement('div');
    summaryChipsRow.className = 'comparison-summary-chips-row';
    players.forEach(player => {
        const summaryChipsContainer = document.createElement('div');
        summaryChipsContainer.className = 'summary-chips-container';
        const compareVitals = createPlayerVitalsElement(getPlayerVitals(player.id), { variant: 'compare', pos: player.pos });
        const overallRankNumber = typeof player.overallRank === 'number' ? player.overallRank : Number(player.overallRank);
        const overallRankDisplay = Number.isFinite(overallRankNumber)
            ? `#${overallRankNumber}`
            : (player.overallRank || 'NA');
        const rawPosRank = player.posRank;
        const posRankNumber = typeof rawPosRank === 'number'
            ? rawPosRank
            : Number.parseInt(String(rawPosRank).split('·')[1] || String(rawPosRank), 10);
        const posRankDisplay = Number.isFinite(posRankNumber)
            ? posRankNumber
            : (rawPosRank || 'NA');
        const posRankColor = Number.isFinite(posRankNumber)
            ? getConditionalColorByRank(posRankNumber, player.pos)
            : 'inherit';
        const ppgOverallRankNumber = typeof player.ppgOverallRank === 'number'
            ? player.ppgOverallRank
            : Number(player.ppgOverallRank);
        const ppgOverallRankDisplay = Number.isFinite(ppgOverallRankNumber)
            ? `#${ppgOverallRankNumber}`
            : (player.ppgOverallRank || 'NA');
        const ppgPosRankNumber = typeof player.ppgPosRank === 'number'
            ? player.ppgPosRank
            : Number(player.ppgPosRank);
        const ppgPosRankDisplay = Number.isFinite(ppgPosRankNumber)
            ? ppgPosRankNumber
            : (player.ppgPosRank || 'NA');
        const ppgPosRankColor = Number.isFinite(ppgPosRankNumber)
            ? getConditionalColorByRank(ppgPosRankNumber, player.pos)
            : 'inherit';
        summaryChipsContainer.innerHTML = `
                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${posRankColor}">${player.total_pts}</span>
                      <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${posRankColor}">${posRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(overallRankNumber)}">${overallRankDisplay}</span>
                    </div>
                  </div>
                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${ppgPosRankColor}">${player.ppg}</span>
                      <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${ppgPosRankColor}">${ppgPosRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(ppgOverallRankNumber)}">${ppgOverallRankDisplay}</span>
                    </div>
                  </div>
                `;
        summaryChipsContainer.insertBefore(compareVitals, summaryChipsContainer.firstChild);
        summaryChipsRow.appendChild(summaryChipsContainer);
    });
    container.appendChild(summaryChipsRow);
    // Detailed Stats List (compact side-by-side rows)
    const statLabels = buildStatLabels();
    const userPlayer = players[0];
    const otherPlayer = players[1];
    const getStatOrderForPosition = (pos) => {
        const qbStatOrder = [
            'pass_rtg',
            'pass_yd',
            'pass_td',
            'cmp_pct',
            'pa_ypg',
            'yds_total',
            'rush_yd',
            'rush_td',
            'pass_att',
            'pass_cmp',
            'pass_fd',
            'epa_per_db',
            'cpoe',
            'imp_per_g',
            'pass_imp',
            'pass_imp_per_att',
            'rush_att',
            'ypc',
            'ttt',
            'prs_pct',
            'pass_sack',
            'pass_int',
            'fum',
            'fpoe',
            'csty_pct',
            'ceiling'
        ];
        const rbStatOrder = [
            'snp_pct',
            'rush_att',
            'rush_yd',
            'ypc',
            'rush_td',
            'rec',
            'rec_yd',
            'rec_tgt',
            'ts_per_rr',
            'ypr',
            'yds_total',
            'ru_ypg',
            'elu',
            'mtf_per_att',
            'yco_per_att',
            'mtf',
            'rush_yac',
            'rush_fd',
            'rec_td',
            'rec_fd',
            'rec_yar',
            'imp_per_g',
            'fum',
            'fpoe',
            'csty_pct',
            'ceiling'
        ];
        const wrTeStatOrder = [
            'snp_pct',
            'rec_tgt',
            'rec',
            'ts_per_rr',
            'rec_yd',
            'rec_td',
            'yprr',
            'rec_fd',
            'first_down_rec_rate',
            'rec_ypg',
            'rec_yar',
            'ypr',
            'imp_per_g',
            'rr',
            'fpoe',
            'yds_total',
            'rush_att',
            'rush_yd',
            'rush_td',
            'ypc',
            'fum',
            'csty_pct',
            'ceiling'
        ];
        if (pos === 'QB') return qbStatOrder;
        if (pos === 'RB') return rbStatOrder;
        if (pos === 'WR' || pos === 'TE') return wrTeStatOrder;
        return ['pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'imp_per_g', 'pass_rtg', 'pass_imp', 'pass_imp_per_att', 'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'ttt', 'prs_pct', 'mtf', 'mtf_per_att', 'rush_yac', 'yco_per_att', 'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr', 'ts_per_rr', 'rr', 'fum', 'snp_pct', 'yds_total', 'fpoe', 'csty_pct', 'ceiling'];
    };
    const userPlayerStatOrder = getStatOrderForPosition(userPlayer.pos);
    const otherPlayerStatOrder = getStatOrderForPosition(otherPlayer.pos);
    const commonStats = userPlayerStatOrder.filter(stat => otherPlayerStatOrder.includes(stat));
    const userSpecificStats = userPlayerStatOrder.filter(stat => !otherPlayerStatOrder.includes(stat));
    const otherSpecificStats = otherPlayerStatOrder.filter(stat => !userPlayerStatOrder.includes(stat));
    const orderedStatKeys = [...commonStats, ...userSpecificStats, ...otherSpecificStats];
    const listContainer = document.createElement('div');
    listContainer.className = 'comparison-list';
    const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
    const scoringSettings = league?.scoring_settings || {};
    for (const statKey of orderedStatKeys) {
        if (!statLabels[statKey]) continue;
        // reuse the same calculation logic used previously
        const values = [];
        const displayValues = [];
        let bestValue = -Infinity;
        let bestValueIndices = [];
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            let calculatedValue;
            let displayValue;
            const seasonTotals = player.seasonStats || state.playerSeasonStats?.[player.id] || null;
            const aggregatedTotals = {};
            const snapPctValues = [];
            const statValueCounts = {};
            player.gameLogs.forEach(week => {
                for (const key in week.stats) {
                    const numericValue = parseFloat(week.stats[key]);
                    if (Number.isNaN(numericValue)) continue;
                    if (key === 'snp_pct') snapPctValues.push(numericValue);
                    else aggregatedTotals[key] = (aggregatedTotals[key] || 0) + numericValue;
                    statValueCounts[key] = (statValueCounts[key] || 0) + 1;
                }
            });
			if (NO_FALLBACK_KEYS.has(statKey)) {
				const raw = (seasonTotals && typeof seasonTotals[statKey] === 'number') ? seasonTotals[statKey] : null;
				calculatedValue = (raw === null) ? null : raw;
				if (raw === null) displayValue = 'N/A';
				else if (statKey === 'snp_pct' || statKey === 'prs_pct' || statKey === 'ts_per_rr' || statKey === 'cmp_pct') displayValue = formatPercentage(raw);
				else if (statKey === 'cpoe') {
					const formatted = formatPercentage(raw, 1);
					displayValue = raw > 0 ? `+${formatted}` : formatted;
				}
				else if (statKey === 'epa_per_db') {
					const formatted = Number(raw).toFixed(2);
					displayValue = raw > 0 ? `+${formatted}` : formatted;
				}
				else displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
			} else {
                const computeStat = (() => {
                    let cv = 0, dv = '0';
                    switch (statKey) {
                        case 'fpts':
                            // Use league-specific matchup data if available
                            cv = player.gameLogs.reduce((sum, week) => {
                                const weekNum = week.week;
                                const playerId = player.id;
                                if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                                    return sum + state.leagueMatchupStats[weekNum][playerId];
                                } else {
                                    return sum + calculateFantasyPoints(week.stats, scoringSettings);
                                }
                            }, 0);
                            dv = cv.toFixed(1);
                            break;
                        case 'ypc': {
                            const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
                            const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                            cv = totalCarries > 0 ? totalYards / totalCarries : 0;
                            dv = Number.isInteger(cv) ? String(cv) : Number(cv).toFixed(2);
                            break;
                        }
                        case 'ypr': {
                            if (seasonTotals && typeof seasonTotals.ypr === 'number') {
                                cv = seasonTotals.ypr;
                            } else {
                                const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                                const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                                cv = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
                            }
                            dv = Number.isInteger(cv) ? String(cv) : Number(cv).toFixed(2);
                            break;
                        }
                        case 'snp_pct': {
                            const pct = seasonTotals && typeof seasonTotals.snp_pct === 'number'
                                ? seasonTotals.snp_pct
                                : (snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0);
                            cv = pct; dv = formatPercentage(pct); break;
                        }
                        case 'prs_pct': {
                            const total = aggregatedTotals['prs_pct'] || 0;
                            const count = statValueCounts['prs_pct'] || 0;
                            cv = count > 0 ? total / count : 0; dv = formatPercentage(cv); break;
                        }
                        case 'cmp_pct': {
                            const total = aggregatedTotals['cmp_pct'] || 0;
                            const count = statValueCounts['cmp_pct'] || 0;
                            cv = count > 0 ? total / count : 0; dv = formatPercentage(cv); break;
                        }
                        case 'csty_pct': {
                            const seasonValue = typeof seasonTotals?.csty_pct === 'number' ? seasonTotals.csty_pct : null;
                            const total = aggregatedTotals['csty_pct'] || 0;
                            const count = statValueCounts['csty_pct'] || 0;
                            const fallback = count > 0 ? total / count : null;
                            const pct = seasonValue ?? fallback;
                            if (pct === null || Number.isNaN(pct)) {
                                cv = -1;
                                dv = 'N/A';
                            } else {
                                cv = pct;
                                dv = formatPercentage(pct);
                            }
                            break;
                        }
                        case 'ceiling': {
                            const seasonValue = typeof seasonTotals?.ceiling === 'number' ? seasonTotals.ceiling : null;
                            const aggregatedValue = Object.prototype.hasOwnProperty.call(aggregatedTotals, 'ceiling')
                                ? aggregatedTotals['ceiling']
                                : null;
                            const value = seasonValue ?? aggregatedValue;
                            if (value === null || value === undefined || Number.isNaN(value)) {
                                cv = -1;
                                dv = 'N/A';
                            } else {
                                cv = value;
                                dv = Number.isInteger(value) ? String(value) : Number(value).toFixed(1);
                            }
                            break;
                        }
                        case 'pass_rtg': {
                            const takeNumeric = (value) => {
                                if (typeof value === 'number' && Number.isFinite(value)) return value;
                                const parsed = Number(value);
                                return Number.isFinite(parsed) ? parsed : null;
                            };
                            const computePasserRating = (cmp, att, td, ints, yds) => {
                                if (!att || att <= 0) return null;
                                const clamp = (val) => Math.max(0, Math.min(2.375, val));
                                const a = clamp(((cmp || 0) / att - 0.3) * 5);
                                const b = clamp(((yds || 0) / att - 3) * 0.25);
                                const c = clamp(((td || 0) / att) * 20);
                                const d = clamp(2.375 - (((ints || 0) / att) * 25));
                                const rating = ((a + b + c + d) / 6) * 100;
                                return Number.isFinite(rating) ? Number(rating.toFixed(1)) : null;
                            };
                            let rating = null;
                            const seasonPassRating = takeNumeric(seasonTotals?.pass_rtg);
                            if (seasonPassRating !== null) {
                                rating = seasonPassRating;
                            }
                            if (rating === null) {
                                const attempts = takeNumeric(seasonTotals?.pass_att) ?? takeNumeric(aggregatedTotals['pass_att']);
                                const completions = takeNumeric(seasonTotals?.pass_cmp) ?? takeNumeric(aggregatedTotals['pass_cmp']);
                                const touchdowns = takeNumeric(seasonTotals?.pass_td) ?? takeNumeric(aggregatedTotals['pass_td']);
                                const interceptions = takeNumeric(seasonTotals?.pass_int) ?? takeNumeric(aggregatedTotals['pass_int']);
                                const yards = takeNumeric(seasonTotals?.pass_yd) ?? takeNumeric(aggregatedTotals['pass_yd']);
                                rating = computePasserRating(completions, attempts, touchdowns, interceptions, yards);
                            }
                            if (rating === null && statValueCounts['pass_rtg']) {
                                const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
                                const avg = totalPassRtg / statValueCounts['pass_rtg'];
                                if (Number.isFinite(avg)) rating = Number(avg.toFixed(1));
                            }
                            if (rating === null) {
                                cv = -1;
                                dv = 'N/A';
                            } else {
                                cv = rating;
                                dv = rating.toFixed(1);
                            }
                            break;
                        }
                        default: {
                            const totalValue = seasonTotals && typeof seasonTotals[statKey] === 'number' ? seasonTotals[statKey] : (aggregatedTotals[statKey] || 0);
                            cv = totalValue; dv = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2);
                        }
                    }
                    return { cv, dv };
                })();
                calculatedValue = computeStat.cv;
                displayValue = computeStat.dv;
            }
            const playerStatOrder = getStatOrderForPosition(player.pos);
            if (!playerStatOrder.includes(statKey)) {
                displayValue = 'N/A';
                calculatedValue = -1;
            }
            values.push(calculatedValue);
            displayValues.push(displayValue);
            if (typeof calculatedValue === 'number' && Number.isFinite(calculatedValue)) {
                if (calculatedValue > bestValue) { bestValue = calculatedValue; bestValueIndices = [i]; }
                else if (calculatedValue === bestValue) bestValueIndices.push(i);
            }
        }
        const leftVal = displayValues[0] || 'N/A';
        const rightVal = displayValues[1] || 'N/A';
        const numericLeft = (typeof values[0] === 'number' && values[0] >= 0) ? values[0] : 0;
        const numericRight = (typeof values[1] === 'number' && values[1] >= 0) ? values[1] : 0;
        const total = numericLeft + numericRight;
        let leftPct = 50, rightPct = 50, neutral = false;
        if (total > 0) { leftPct = Math.round((numericLeft / total) * 100); rightPct = 100 - leftPct; }
        else { neutral = true; }
        const row = document.createElement('div');
        row.className = 'comparison-row';
        const leftValueDiv = document.createElement('div');
        leftValueDiv.className = 'comparison-left';
        leftValueDiv.textContent = escapeHtml(leftVal);
        const rightValueDiv = document.createElement('div');
        rightValueDiv.className = 'comparison-right';
        rightValueDiv.textContent = escapeHtml(rightVal);
        // Append positional rank annotation in parentheses next to each stat value
        // Use getSeasonRankValue to find the player's seasonal/positional rank for this stat
        try {
            const leftPlayer = players[0];
            const rightPlayer = players[1];
            const leftRankVal = getSeasonRankValue(leftPlayer.id, statKey);
            const rightRankVal = getSeasonRankValue(rightPlayer.id, statKey);
            if (leftRankVal !== null && leftRankVal !== undefined) {
                const leftAnnot = createRankAnnotation(leftRankVal, { ordinal: true, variant: 'compare' });
                leftValueDiv.classList.add('has-rank-annotation');
                leftValueDiv.appendChild(leftAnnot);
            }
            if (rightRankVal !== null && rightRankVal !== undefined) {
                const rightAnnot = createRankAnnotation(rightRankVal, { ordinal: true, variant: 'compare' });
                rightValueDiv.classList.add('has-rank-annotation');
                rightValueDiv.appendChild(rightAnnot);
            }
        } catch (e) {
            // fail silently if rank lookup isn't available
        }
        row.innerHTML = `
                    <div class="comparison-center">
                        <div class="comparison-label">${escapeHtml(statLabels[statKey])}</div>
                        <div class="comparison-bar" role="img" aria-label="${escapeHtml(statLabels[statKey])} comparison">
                            <div class="comparison-bar-left" style="width: ${leftPct}%;"></div>
                            <div class="comparison-bar-right" style="width: ${rightPct}%;"></div>
                        </div>
                    </div>
                `;
        row.insertBefore(leftValueDiv, row.firstChild);
        row.appendChild(rightValueDiv);
        if (!neutral) {
            if (bestValueIndices.length === 1 && bestValueIndices[0] === 0) {
                leftValueDiv.classList.add('best-stat');
                row.querySelector('.comparison-bar-right')?.classList.add('worse-stat-bar');
            }
            if (bestValueIndices.length === 1 && bestValueIndices[0] === 1) {
                rightValueDiv.classList.add('best-stat');
                row.querySelector('.comparison-bar-left')?.classList.add('worse-stat-bar');
            }
        }
        listContainer.appendChild(row);
    }
    const tableContainer = document.createElement('div');
    tableContainer.className = 'comparison-table-container comparison-list-container';
    tableContainer.appendChild(listContainer);
    container.appendChild(tableContainer);
    comparisonModalBody.appendChild(container);
    const footer = playerComparisonModal.querySelector('.modal-footer');
    const keyContainer = document.getElementById('comparison-stats-key-container');
    if (footer && keyContainer) {
        footer.innerHTML = `
                    <div class="key-chip modal-info-btn">
                        <i class="fa-solid fa-key"></i>
                        <span>Key</span>
                    </div>
                `;
        // Comparison modal key uses the same categorized stat map as the other key surfaces.
        keyContainer.innerHTML = '<h4>Player Comparison Stats Key<i class="fa-solid fa-square-xmark" id="close-comparison-key"></i></h4><div class="stats-key-shared-body stats-key-shared-body--comparison"></div>';
        renderSharedStatsKeyMarkup(keyContainer.querySelector('.stats-key-shared-body'));
        const keyBtn = footer.querySelector('.modal-info-btn');
        if (keyBtn) {
            keyBtn.addEventListener('click', () => keyContainer.classList.toggle('hidden'));
        }
        const closeBtn = keyContainer.querySelector('#close-comparison-key');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => keyContainer.classList.add('hidden'));
        }
    }
}
function populateLeagueSelect(leagues) {
    leagueSelect.innerHTML = '<option>Select a league...</option>';
    leagues.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.league_id;
        opt.textContent = l.name;
        leagueSelect.appendChild(opt);
    });
    leagueSelect.disabled = false;
}
function calibrateTeamCardIntrinsicSize(card) {
    if (!supportsContentVisibility || !rosterContentVisibilityEnabled || !card) return;
    requestAnimationFrame(() => {
        const measuredHeight = card.getBoundingClientRect().height;
        if (measuredHeight > 0) {
            card.style.setProperty('--team-card-intrinsic-size', `${Math.ceil(measuredHeight)}px`);
        }
    });
}
// Estimates the pixel height of a .team-card for content-visibility contain-intrinsic-size.
// Using per-team player counts gives a close approximation to the actual rendered height,
// minimising the scroll-position correction when a card first enters the viewport.
// Height constants are tuned to the roster-page CSS:
//   standard .player-row (3-line flex): ~72px
//   condensed .player-row (2-line flex): ~38px
//   .pick-row (2-line):                  ~48px
//   section h3 + surrounding spacing:    ~44px
function estimateTeamCardHeight(team) {
    const view = state.currentRosterView;
    const SECTION_H = 44;
    const PLAYER_H  = view === 'condensed' ? 38 : 72;
    const PICK_H    = 48;

    if (view === 'positional' || view === 'condensed') {
        const qb = (team.allPlayers || []).filter(p => p.pos === 'QB').length;
        const rb = (team.allPlayers || []).filter(p => p.pos === 'RB').length;
        const wr = (team.allPlayers || []).filter(p => p.pos === 'WR').length;
        const te = (team.allPlayers || []).filter(p => p.pos === 'TE').length;
        const pk = (team.draftPicks || []).length;
        let h = 0;
        if (qb > 0) h += SECTION_H + qb * PLAYER_H;
        if (rb > 0) h += SECTION_H + rb * PLAYER_H;
        if (wr > 0) h += SECTION_H + wr * PLAYER_H;
        if (te > 0) h += SECTION_H + te * PLAYER_H;
        h += SECTION_H + (pk > 0 ? pk : 1) * PICK_H; // picks section is always rendered
        return Math.ceil(h);
    }
    // Depth-chart view (starters / bench / taxi / picks)
    const starters = (team.starters   || []).length;
    const bench    = (team.bench      || []).length;
    const taxi     = (team.taxi       || []).length;
    const pk       = (team.draftPicks || []).length;
    return Math.ceil(
        SECTION_H + starters * PLAYER_H +
        SECTION_H + bench    * PLAYER_H +
        SECTION_H + taxi     * PLAYER_H +
        SECTION_H + (pk > 0 ? pk : 1) * PICK_H
    );
}
// Generation counter: incremented on every renderAllTeamData call so stale
// rAF callbacks from a superseded render can bail out without mutating the DOM.
let _renderAllTeamDataGenId = 0;
function renderAllTeamData(teams) {
    updateRosterContentVisibility();
    rosterGrid.innerHTML = '';
    rosterGrid.style.justifyContent = ''; // Reset style
    rosterGrid.classList.toggle('start-sit-mode', state.isStartSitMode);
    const shouldUseCondensed = state.currentRosterView === 'condensed' && !state.isStartSitMode;
    rosterGrid.classList.toggle('condensed-mode', shouldUseCondensed);
    if (state.isStartSitMode) {
        renderStartSitColumns(teams);
        adjustStickyHeaders();
        syncRosterHeaderPosition();
        return;
    }
    let teamsToRender = teams;
    if (state.isCompareMode) {
        teamsToRender = teams.filter(team => state.teamsToCompare.has(team.teamName));
        rosterGrid.style.justifyContent = 'center';
    }

    const renderGenId = ++_renderAllTeamDataGenId;

    // Pre-warm the rank cache before any createPlayerRow calls.
    // buildCalculatedRankCache iterates all ~10k NFL players on first call — running it once
    // here keeps that cost out of the per-row render hot path on every subsequent row.
    const warmupPlayer = teamsToRender.find(t => t.allPlayers?.length > 0)?.allPlayers[0];
    if (warmupPlayer) calculatePlayerStatsAndRanks(warmupPlayer.id);

    // Inline helper: build one complete team column (sticky header + player card).
    // Shared by both the immediate-paint and background-deferred render paths.
    const buildTeamColumn = (team) => {
        const columnWrapper = document.createElement('div');
        columnWrapper.className = 'roster-column';
        columnWrapper.dataset.teamName = team.teamName;
        const header = document.createElement('div');
        header.className = 'team-header-item';
        const checkbox = document.createElement('div');
        checkbox.className = 'team-compare-checkbox';
        if (state.teamsToCompare.has(team.teamName)) {
            checkbox.classList.add('selected');
        }
        checkbox.dataset.teamName = team.teamName;
        const teamNameSpan = document.createElement('span');
        teamNameSpan.className = 'team-name';
        teamNameSpan.textContent = team.teamName;
        if (team.isChamp) {
            header.title = `${team.teamName} - Previous Champion`;
        } else if (team.record) {
            header.title = `${team.teamName} (${team.record})`;
        } else {
            header.title = team.teamName;
        }
        header.appendChild(checkbox);
        header.appendChild(teamNameSpan);
        if (team.isChamp) {
            const champIcon = document.createElement('i');
            champIcon.className = 'fa-solid fa-crown team-record-champ';
            header.appendChild(champIcon);
        } else if (team.record) {
            const recordSpan = document.createElement('span');
            recordSpan.className = 'team-record';
            recordSpan.textContent = `(${team.record})`;
            header.appendChild(recordSpan);
        }
        const card = (state.currentRosterView === 'positional' || state.currentRosterView === 'condensed')
            ? createPositionalTeamCard(team)
            : createDepthChartTeamCard(team);
        columnWrapper.appendChild(header);
        columnWrapper.appendChild(card);
        return columnWrapper;
    };

    // Mobile async chunked rendering (≤819px):
    // Rendering all 12 teams (~300 player rows) synchronously blocks the main thread on mobile,
    // causing a visible freeze before scroll is interactive.
    // Fix: paint the first 2 teams immediately so the viewport is populated at once,
    // then render remaining teams in small background batches (2 per setTimeout tick).
    // Each tick gives the browser a paint frame — by the time the user scrolls to later
    // teams they are already fully rendered. No pop-in, no blocking stall.
    //
    // Sticky offset: read the header height ONCE before the deferred loop (it doesn't change
    // between batches) and stamp it directly onto new headers in each fragment — cheaper than
    // calling adjustStickyHeaders() (full re-query + offsetHeight read) after every batch.
    const MOBILE_INITIAL = 2; // teams rendered synchronously before first paint
    const MOBILE_BATCH   = 2; // teams rendered per deferred background tick
    const isMobile = window.innerWidth <= 819 && teamsToRender.length > MOBILE_INITIAL;

    if (isMobile) {
        // Cache sticky offset (header height minus optional CSS gap) — valid for this render.
        const hdrEl    = document.getElementById('header-container');
        const hdrGap   = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--roster-header-gap')) || 0;
        const stickyTop = hdrEl ? Math.max(hdrEl.offsetHeight - hdrGap, 0) : 0;

        // Stamp cached sticky-top onto all .team-header-item nodes in a not-yet-attached fragment.
        const stampStickyTop = (frag) => {
            frag.querySelectorAll('.team-header-item').forEach(h => { h.style.top = `${stickyTop}px`; });
        };

        // Immediate pass — first MOBILE_INITIAL teams painted synchronously.
        const immediateFragment = document.createDocumentFragment();
        teamsToRender.slice(0, MOBILE_INITIAL).forEach(t => immediateFragment.appendChild(buildTeamColumn(t)));
        stampStickyTop(immediateFragment);
        rosterGrid.appendChild(immediateFragment);
        if (compareSearchInput && compareSearchInput.value) filterTeamsByQuery(compareSearchInput.value);
        adjustStickyHeaders();
        syncRosterHeaderPosition();

        // Deferred pass — remaining teams added in background batches.
        let deferIdx = MOBILE_INITIAL;
        const renderNextBatch = () => {
            if (_renderAllTeamDataGenId !== renderGenId) return; // newer render superseded this one
            const batch = teamsToRender.slice(deferIdx, deferIdx + MOBILE_BATCH);
            if (batch.length === 0) {
                // All teams are in the DOM — final sync pass.
                if (compareSearchInput && compareSearchInput.value) filterTeamsByQuery(compareSearchInput.value);
                adjustStickyHeaders();
                return;
            }
            const batchFragment = document.createDocumentFragment();
            batch.forEach(t => batchFragment.appendChild(buildTeamColumn(t)));
            stampStickyTop(batchFragment);
            rosterGrid.appendChild(batchFragment);
            deferIdx += MOBILE_BATCH;
            setTimeout(renderNextBatch, 0);
        };
        setTimeout(renderNextBatch, 0);
    } else {
        // Desktop or compare mode: single-pass synchronous render (unchanged behavior).
        const fragment = document.createDocumentFragment();
        teamsToRender.forEach(team => fragment.appendChild(buildTeamColumn(team)));
        rosterGrid.appendChild(fragment);
        if (compareSearchInput && compareSearchInput.value) {
            filterTeamsByQuery(compareSearchInput.value);
        }
        adjustStickyHeaders();
        syncRosterHeaderPosition();
    }
}
function renderStartSitColumns(teams) {
    const targetTeamName = state.startSitTeamName || state.userTeamName;
    const userTeam = teams.find(team => team.teamName === targetTeamName) || teams.find(team => team.isUserTeam);
    if (!userTeam) {
        return;
    }
    rosterGrid.style.justifyContent = 'center';
    const positions = ['QB', 'RB', 'WR', 'TE'];
    positions.forEach(pos => {
        const columnWrapper = document.createElement('div');
        columnWrapper.className = 'roster-column start-sit-column';
        columnWrapper.dataset.teamName = userTeam.teamName;
        columnWrapper.dataset.position = pos;
        const header = document.createElement('div');
        header.className = 'start-sit-pos-header';
        header.textContent = pos;
        columnWrapper.appendChild(header);
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'team-card start-sit-card';
        const players = userTeam.allPlayers
            .filter(player => (player.pos || '').toUpperCase() === pos)
            .sort((a, b) => (b.ktc || 0) - (a.ktc || 0));
        if (players.length > 0) {
            players.forEach(player => cardWrapper.appendChild(createPlayerRow(player, userTeam.teamName)));
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'start-sit-empty';
            placeholder.textContent = 'None';
            cardWrapper.appendChild(placeholder);
        }
        const columnShell = document.createElement('div');
        columnShell.className = 'start-sit-column-shell';
        columnShell.appendChild(cardWrapper);
        columnWrapper.appendChild(columnShell);
        rosterGrid.appendChild(columnWrapper);
        calibrateTeamCardIntrinsicSize(cardWrapper);
    });
}
function createDepthChartTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `<div class="roster-section starters-section"><h3>Starters</h3></div><div class="roster-section bench-section"><h3>Bench</h3></div><div class="roster-section taxi-section"><h3>Taxi</h3></div><div class="roster-section picks-section"><h3>Draft Picks</h3></div>`;
    const activePos = state.activePositions;
    const filterActive = activePos.size > 0;
    const filterFunc = player => {
        if (!filterActive) return true;
        const isStarActive = activePos.has('STAR');
        // New logic: keep the existing KTC >= 3000 passthrough, but when
        // PPG meets the threshold (>= 9) the player must ALSO have at
        // least 2200 KTC to be considered a star. This prevents low-KTC
        // high-PPG players from slipping through.
        const playerKtc = (player.ktc || 0);
        const playerPpg = (player.ppg || 0);
        const meetsStarCriteria = (playerKtc >= 3900) || (playerPpg >= 12 && playerKtc >= 2900);
        if (isStarActive && !meetsStarCriteria) {
            return false;
        }
        const posFilters = new Set(activePos);
        posFilters.delete('STAR');
        if (posFilters.size === 0) return true;
        const isFlexActive = posFilters.has('FLX');
        const posMatch = posFilters.has(player.pos);
        const flexMatch = isFlexActive && ['RB', 'WR', 'TE'].includes(player.pos);
        return posMatch || flexMatch;
    };
    const populate = (sel, data, creator) => {
        const el = card.querySelector(sel);
        const filteredData = data.filter(item => item.isPlaceholder || filterFunc(item));
        const h3 = el.querySelector('h3');
        el.innerHTML = '';
        el.appendChild(h3);
        if (filteredData.length > 0) {
            const fragment = document.createDocumentFragment();
            filteredData.forEach(item => fragment.appendChild(creator(item, team.teamName)));
            el.appendChild(fragment);
        } else {
            el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
        }
    };
    populate('.starters-section', team.starters, createPlayerRow);
    populate('.bench-section', team.bench, createPlayerRow);
    populate('.taxi-section', team.taxi, createTaxiRow);
    const picksEl = card.querySelector('.picks-section');
    const picksH3 = picksEl.querySelector('h3');
    picksEl.innerHTML = '';
    picksEl.appendChild(picksH3);
    if (team.draftPicks && team.draftPicks.length > 0) {
        const picksFragment = document.createDocumentFragment();
        team.draftPicks.forEach(item => picksFragment.appendChild(createPickRow(item, team.teamName)));
        picksEl.appendChild(picksFragment);
    } else {
        picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
    }
    return card;
}
function createPositionalTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `
                <div class="roster-section qb-section"><h3>QB</h3></div>
                <div class="roster-section rb-section"><h3>RB</h3></div>
                <div class="roster-section wr-section"><h3>WR</h3></div>
                <div class="roster-section te-section"><h3>TE</h3></div>
                <div class="roster-section picks-section"><h3>Draft Picks</h3></div>
            `;
    const activePos = state.activePositions;
    const filterActive = activePos.size > 0;
    const isFlexActive = activePos.has('FLX');
    const isStarActive = activePos.has('STAR');
    const positions = {
        QB: team.allPlayers.filter(p => p.pos === 'QB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
        RB: team.allPlayers.filter(p => p.pos === 'RB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
        WR: team.allPlayers.filter(p => p.pos === 'WR').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
        TE: team.allPlayers.filter(p => p.pos === 'TE').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
    };
    const populate = (sel, data, creator) => {
        const el = card.querySelector(sel);
        const pos = sel.split('-')[0].toUpperCase().replace('.', '');
        const posFilters = new Set(activePos);
        posFilters.delete('STAR');
        const isPosVisible = posFilters.size === 0 || posFilters.has(pos) || (isFlexActive && ['RB', 'WR', 'TE'].includes(pos));
        el.style.display = 'none';
        if (isPosVisible) {
            el.style.display = 'block';
            let filteredData = data;
            if (isStarActive) {
                filteredData = data.filter(player => {
                    const playerKtc = (player.ktc || 0);
                    const playerPpg = (player.ppg || 0);
                    return (playerKtc >= 3900) || (playerPpg >= 12 && playerKtc >= 2900);
                });
            }
            const h3 = el.querySelector('h3');
            el.innerHTML = '';
            el.appendChild(h3);
            if (filteredData && filteredData.length > 0) {
                const fragment = document.createDocumentFragment();
                filteredData.forEach(item => fragment.appendChild(creator(item, team.teamName)));
                el.appendChild(fragment);
            } else {
                el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
            }
        }
    };
    populate('.qb-section', positions.QB, createPlayerRow);
    populate('.rb-section', positions.RB, createPlayerRow);
    populate('.wr-section', positions.WR, createPlayerRow);
    populate('.te-section', positions.TE, createPlayerRow);
    const picksEl = card.querySelector('.picks-section');
    if (picksEl) {
        const picksH3 = picksEl.querySelector('h3');
        picksEl.innerHTML = '';
        picksEl.appendChild(picksH3);
        if (team.draftPicks && team.draftPicks.length > 0) {
            const picksFragment = document.createDocumentFragment();
            team.draftPicks.forEach(item => picksFragment.appendChild(createPickRow(item, team.teamName)));
            picksEl.appendChild(picksFragment);
        } else {
            picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
        }
    }
    return card;
}
function createEmptyTaxiRow() {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `<span style="color: var(--color-text-tertiary); font-style: italic; font-size: 0.8rem; padding: 1.2rem 0.5rem; display: block; width: 100%; text-align: center;">Empty Slot</span>`;
    return row;
}
function createTaxiRow(item, teamName) {
    if (item.isPlaceholder) return createEmptyTaxiRow();
    return createPlayerRow(item, teamName);
}
function createPlayerRow(player, teamName) {
    const row = document.createElement('div');
    row.className = 'player-row';
    const slotAbbr = { 'SUPER_FLEX': 'SFLX', 'FLEX': 'FLX' };
    const isCondensedView = state.currentRosterView === 'condensed' && !state.isStartSitMode;
    // Rosters Trade Preview only: the two selected team columns use a wider,
    // two-row player card without changing the default or Start/Sit card layouts.
    const isTradePreviewCard = state.isCompareMode && !state.isStartSitMode;
    if (isTradePreviewCard) {
        row.classList.add('player-row--trade-preview');
    }
    const displaySlot = state.currentRosterView === 'depth' ? (slotAbbr[player.slot] || player.slot) : player.pos;
    const fullPlayer = state.players?.[player.id];
    // Use pre-calculated ranks if available, otherwise calculate once
    const playerRanks = player._cachedRanks || calculatePlayerStatsAndRanks(player.id) || getDefaultPlayerRanks();
    if (!player._cachedRanks) player._cachedRanks = playerRanks;
    const firstName = (player.first_name || fullPlayer?.first_name || '').trim();
    const lastName = (player.last_name || fullPlayer?.last_name || '').trim();
    const nameCandidates = [
        player.name,
        player.full_name,
        player.display_name,
        `${firstName} ${lastName}`.trim(),
        fullPlayer?.full_name,
        `${(fullPlayer?.first_name || '').trim()} ${(fullPlayer?.last_name || '').trim()}`.trim(),
        firstName,
        lastName,
        fullPlayer?.first_name,
        fullPlayer?.last_name
    ];
    const playerSearchKey = Array.from(new Set(
        nameCandidates
            .map(name => (name || '').trim().toLowerCase())
            .filter(Boolean)
    )).join(' ');
    if (teamName) {
        row.dataset.teamName = teamName;
    }
    row.dataset.assetId = player.id;
    row.dataset.assetLabel = player.name;
    row.dataset.playerName = playerSearchKey || (player.name || '').toLowerCase();
    row.dataset.assetKtc = player.ktc || 0;
    row.dataset.assetPos = displaySlot;
    row.dataset.assetBasePos = (player.pos || displaySlot || '').toUpperCase();
    row.dataset.assetTeam = (player.team || 'FA').toUpperCase();
    if (state.tradeBlock[teamName]?.find(a => a.id === player.id)) {
        row.classList.add('player-selected');
    }
    if (state.isStartSitMode) {
        const startSitSelection = state.startSitSelections.find(sel => sel.id === player.id);
        if (startSitSelection) {
            row.classList.add('player-selected');
            row.dataset.startSitSide = startSitSelection.side;
        }
    }
    const ktc = player.ktc || '—';
    // Roster ADP comes from the same league-format KTC row already selected by
    // getPlayerData() (KTC_1QB for 1QB leagues, KTC_SFLX for superflex leagues).
    const numericAdpValue = Number(player.adp);
    const hasAdpValue = Number.isFinite(numericAdpValue) && numericAdpValue > 0;
    const adpValue = hasAdpValue ? numericAdpValue.toFixed(1) : 'NA';
    const teamKey = (player.team || 'FA').toUpperCase();
    const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
    const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
    const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
    const teamTagHTML = (player.team && player.team !== 'FA')
        ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="19" height="19" loading="eager" decoding="async">`
        : `<div class="team-tag" style="background-color: #64748b; color: white;">FA</div>`;
    const basePos = (player.pos || fullPlayer?.position || displaySlot || '').toUpperCase();
    const fptsPosRankNumber = Number.parseInt(playerRanks.posRank, 10);
    const hasFptsPosRank = Number.isFinite(fptsPosRankNumber) && fptsPosRankNumber > 0;
    const fptsPosRankDisplay = hasFptsPosRank ? `${basePos}·${fptsPosRankNumber}` : basePos;
    const posRankColor = getPosRankColor(fptsPosRankDisplay);
    const effectivePosRankColor = (isCondensedView && basePos === 'TE') ? '#a181ff' : posRankColor;
    const ktcPosRankMatch = typeof player.posRank === 'string' ? player.posRank.match(/(\d+)/) : null;
    const rawKtcPosRankNumber = ktcPosRankMatch ? Number.parseInt(ktcPosRankMatch[1], 10) : null;
    const ktcPosRankNumber = Number.isFinite(rawKtcPosRankNumber) && rawKtcPosRankNumber > 0 ? rawKtcPosRankNumber : null;
    const injuryDesignation = player.injuryDesignation;
    // OFF-SEASON: Injury badges are hidden. Re-enable the block below at the start of the next season.
    const injuryBadgeHtml = '';
    /*
    const injuryBadgeHtml = !isCondensedView && injuryDesignation
        ? `<div class="player-injury-badge" style="color: ${injuryDesignation.color};">${injuryDesignation.designation}</div>`
        : '';
    */
    const condensedPosRankHtml = isCondensedView
        ? `<span class="player-pos-rank condensed-pos-rank" style="color: ${effectivePosRankColor}; font-weight: 400;">${fptsPosRankDisplay}</span>`
        : '';
    const playerTagHtml = !isCondensedView
        ? `<div class="player-tag" data-pos="${displaySlot}">${displaySlot}</div>`
        : '';
    const condensedTeamTagHtml = isCondensedView && !isTradePreviewCard
        ? `<span class="condensed-team-tag">${teamTagHTML}</span>`
        : '';
    const tradePreviewAgeHtml = isTradePreviewCard
        ? `<span class="trade-preview-age"><span class="player-age">${player.age || '?'}</span><span class="trade-preview-age-unit"> y.o.</span></span>`
        : '';
    const tradePreviewAdpHtml = `<span class="player-adp-wrapper trade-preview-adp-wrapper">ADP:<span class="value player-adp">${adpValue}</span></span>`;
    const tradePreviewTeamHtml = isTradePreviewCard
        ? `<span class="trade-preview-team-slot">${teamTagHTML}</span>`
        : '';
    const mainLineHtml = `
                <div class="player-main-line${isCondensedView ? ' condensed-main-line' : ''}">
                    ${isCondensedView ? condensedPosRankHtml : playerTagHtml}
                    <div class="player-name"><span class="player-name-clickable">${player.name}</span></div>
                    ${tradePreviewAgeHtml}
                    ${isCondensedView ? condensedTeamTagHtml : injuryBadgeHtml}
                    ${tradePreviewTeamHtml}
                </div>`;
    // Trade Preview row two keeps both separators and all three metrics as
    // direct flex siblings so one page-scoped CSS gap spaces every dot evenly.
    const metaLineHtml = isCondensedView ? '' : `
                <div class="player-meta-line">
                    <span class="player-pos-rank" style="color: ${posRankColor}; font-weight: 400;">${fptsPosRankDisplay}</span>
                    <span class="separator">•</span>
                    ${isTradePreviewCard
                        ? tradePreviewAdpHtml
                        : `<span><span class="player-age">${player.age || '?'} </span> y.o. </span>`}
                    ${isTradePreviewCard
                        ? `<span class="separator">•</span><span class="player-ktc-wrapper trade-preview-ktc-wrapper">KTC:<span class="value player-ktc">${ktc}</span></span>`
                        : `<span class="separator">•</span>${teamTagHTML}`}
                </div>`;
    const valueLineHtml = isTradePreviewCard
        ? (isCondensedView
            ? `<div class="player-value-line trade-preview-condensed-value-line">${tradePreviewAdpHtml}<span class="player-ktc-wrapper trade-preview-ktc-wrapper">KTC:<span class="value player-ktc">${ktc}</span></span></div>`
            : '')
        : `<div class="player-value-line">
                    <span class="player-ktc-wrapper">KTC:<span class="value player-ktc">${ktc}</span></span>
                    <span class="player-adp-wrapper">ADP:<span class="value player-adp">${adpValue}</span></span>
                </div>`;
    // Team logo watermark: subtle background image behind card content (similar to watchlist cards)
    const rosterWatermarkHtml = (player.team && player.team !== 'FA')
        ? `<img class="roster-card-watermark" src="../assets/NFL_logos_svg/${normalizedKey}.svg" alt="${teamKey}" aria-hidden="true" loading="lazy" decoding="async">`
        : '';
    row.innerHTML = `
                ${rosterWatermarkHtml}
                ${mainLineHtml}
                ${metaLineHtml}
                ${valueLineHtml}
            `;
    if (isCondensedView) {
        const nameEl = row.querySelector('.player-name-clickable');
        const cutoff = 7; // condensed view: stricter limit for last name only
        if (nameEl && nameEl.textContent) {
            const label = nameEl.textContent.trim();
            const match = label.match(/^(\S+)\s+(.+)$/); // first token + last name/remaining
            if (match) {
                const firstToken = match[1];
                let lastPart = match[2].replace(/\.+$/, ''); // strip trailing dots from prior truncation
                if (lastPart.length > cutoff) {
                    lastPart = lastPart.slice(0, cutoff) + '..';
                }
                nameEl.textContent = `${firstToken} ${lastPart}`;
            }
        }
    }
    if (isCondensedView) {
        row.classList.add('player-row-condensed');
    }
    const ageEl = row.querySelector('.player-age');
    const ktcEl = row.querySelector('.player-ktc');
    const adpEl = row.querySelector('.player-adp');
    const playerPosRankEl = row.querySelector('.player-pos-rank');
    if (playerPosRankEl) {
        playerPosRankEl.textContent = fptsPosRankDisplay;
        playerPosRankEl.style.color = effectivePosRankColor;
    }
    if (ageEl && player.age && player.age !== '?') ageEl.style.color = getAgeColorForRoster(player.pos, parseFloat(player.age));
    if (ktcEl && player.ktc) ktcEl.style.color = getKtcColor(player.ktc);
    if (adpEl) {
        adpEl.textContent = adpValue;
        adpEl.style.color = hasAdpValue
            ? getAdpColorForRoster(numericAdpValue)
            : 'var(--color-text-tertiary)';
    }
    const ktcWrapper = row.querySelector('.player-ktc-wrapper');
    if (ktcWrapper) {
        ktcWrapper.classList.add('has-rank-annotation');
        const annotation = createRankAnnotation(
            typeof ktcPosRankNumber === 'number' ? ktcPosRankNumber : 'NA',
            { wrapInParens: true, ordinal: true, variant: 'ktc' }
        );
        ktcWrapper.appendChild(annotation);

        const valueSpan = ktcWrapper.querySelector('.value.player-ktc');
        const rankNumberSpan = annotation.querySelector('.stat-rank-number');
        const rankSuffixSpan = annotation.querySelector('.stat-rank-suffix');
        const rankNumberText = rankNumberSpan ? rankNumberSpan.textContent : '';
        const rankSuffixText = rankSuffixSpan ? rankSuffixSpan.textContent : '';

        // Rebuild annotation to wrap the KTC value inside parentheses
        if (annotation && valueSpan) {
            // Remove the value from its original position before moving it
            if (valueSpan.parentElement === ktcWrapper) {
                ktcWrapper.removeChild(valueSpan);
            }
            while (annotation.firstChild) annotation.removeChild(annotation.firstChild);
            annotation.appendChild(document.createTextNode(' ('));
            annotation.appendChild(valueSpan);
            annotation.appendChild(document.createTextNode(')'));
        }

        // Insert rank + suffix where the KTC value used to be
        const rankDisplay = document.createElement('span');
        rankDisplay.className = 'ktc-rank-display';
        rankDisplay.textContent = rankNumberText || '';

        const rankSuffixDisplay = document.createElement('span');
        rankSuffixDisplay.className = 'ktc-rank-suffix-display';
        rankSuffixDisplay.textContent = rankSuffixText || '';

        ktcWrapper.insertBefore(rankDisplay, annotation);
        if (rankSuffixText) {
            ktcWrapper.insertBefore(rankSuffixDisplay, annotation);
        }

        // Match rank color to the KTC value color for all views
        const ktcColor = ktcEl?.style?.color || '';
        if (ktcColor) {
            rankDisplay.style.color = ktcColor;
            if (rankSuffixText) {
                rankSuffixDisplay.style.color = ktcColor;
            }
        }
    }
    const playerNameClickableEl = row.querySelector('.player-name-clickable');
    if (playerNameClickableEl) {
        playerNameClickableEl.style.cursor = 'pointer';
        playerNameClickableEl.addEventListener('click', (e) => {
            e.stopPropagation();
            handlePlayerNameClick(player);
        });
    }
    return row;
}
function createPickRow(pick, teamName) {
    const row = document.createElement('div');
    row.className = 'pick-row';
    row.dataset.assetId = pick.id;
    row.dataset.assetLabel = pick.label;
    row.dataset.assetKtc = pick.ktc || 0;
    if (state.tradeBlock[teamName]?.find(a => a.id === pick.id)) {
        row.classList.add('player-selected');
    }
    const ktcValue = pick.ktc || '—';
    row.innerHTML = `<span class="pick-label">${pick.label}</span><span class="pick-ktc">KTC: <span class="value">${ktcValue}</span></span>`;
    if (pick.ktc) row.querySelector('.pick-ktc .value').style.color = getKtcColor(pick.ktc);
    return row;
}
function renderStartSitPreview() {
    const selections = state.startSitSelections || [];
    const currentWeekNumber = getCurrentNflWeekNumber();
    // weekLabel now holds just the WK number (e.g. WK5). Bracketing and styling are applied in the template.
    const weekLabel = Number.isFinite(currentWeekNumber) ? `WK${currentWeekNumber}` : '';
    const weekLabelDisplay = weekLabel ? `[${weekLabel}]` : '';
    const isCompactPreview = Boolean(state.startSitCompactPreview);
    const escapeHtml = (value) => {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };
    tradeSimulator.innerHTML = `
                            <div class="trade-container glass-panel start-sit-container">
                    <div class="trade-header">
                            <div class="trade-header-left">
                            <h3><i class="fa-solid fa-elevator analyzer-icon"></i> Start/Sit<span class="start-sit-week">${weekLabelDisplay}</span></h3>
                        </div>
            <div class="trade-header-center">
              <button id="collapseTradeButton"><i class="fa-solid fa-caret-down"></i></button>
            </div>
            <div class="trade-header-right">
              <button id="comparePlayersButton" class="control-button-subtle">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="label">Compare</span>
              </button>
              <button id="clearTradeButton" type="button">
                <i class="fa-solid fa-eraser"></i>
                <span class="label">Clear</span>
              </button>
              <button id="closeTradeButton" type="button">
                <i class="fa-solid fa-circle-xmark"></i>
                <span class="label">Close</span>
              </button>
            </div>
          </div>
          <div class="trade-body"></div>
          <div class="trade-footnote">• Projected Points •</div>
        </div>
    <button id="showTradeButton"><i class="fa-solid fa-circle-chevron-up"></i> <span class="show-button-label">Start/Sit <i class="fa-solid fa-elevator analyzer-icon"></i></span><span class="start-sit-week">${weekLabelDisplay}</span> <i class="fa-solid fa-circle-chevron-up"></i></button>
  `;
    const tradeBody = tradeSimulator.querySelector('.trade-body');

    const MAX_START_SIT_SELECTIONS = 6;
    const slotSelections = Array.from({ length: MAX_START_SIT_SELECTIONS }, (_, idx) => selections[idx] || null);
    const buildStartSitSlotColumn = (selection, slotNumber) => {
        let assetsHTML = '';
        let totalDisplay = '—';
        let projectionColor = 'var(--color-text-tertiary)';
        let matchupSectionHtml = '';
        if (selection) {
            const tagColor = TAG_COLORS[selection.pos] || 'var(--pos-bn)';
            const posForColor = selection.basePos || selection.pos;
            const rankColor = Number.isFinite(selection.ppgPosRank)
                ? getConditionalColorByRank(selection.ppgPosRank, posForColor)
                : 'var(--color-text-tertiary)';
            const baseLabel = posForColor || '';
            const rankText = (selection.ppgPosRankDisplay && selection.ppgPosRankDisplay !== 'NA')
                ? selection.ppgPosRankDisplay
                : (baseLabel ? `${baseLabel}·NA` : 'NA');
            const posColor = getPosRankColor(rankText);
            const ppgText = selection.ppgDisplay || 'NA';
            const hasPositivePpg = typeof selection.ppg === 'number' && selection.ppg > 0;
            const hasPpgRankNumber = Number.isFinite(selection.ppgPosRank) && selection.ppgPosRank > 0;
            const projectionValue = typeof selection.projection === 'number'
                ? selection.projection
                : Number.parseFloat(selection.projection);
            const ppgColor = hasPositivePpg && hasPpgRankNumber
                ? getConditionalColorByRank(selection.ppgPosRank, posForColor)
                : (hasPositivePpg ? 'var(--color-text-mid-test1)' : 'var(--color-text-tertiary)');
            const projectionDisplay = selection.projection !== null
                ? selection.projection.toFixed(1)
                : ((selection.projectionDisplay && selection.projectionDisplay.toUpperCase() !== 'NA') ? selection.projectionDisplay : '—');
            if (Number.isFinite(projectionValue)) {
                const derivedColor = getProjectionColorForValue(posForColor, projectionValue);
                if (derivedColor) {
                    projectionColor = derivedColor;
                } else if (hasPpgRankNumber) {
                    projectionColor = getConditionalColorByRank(selection.ppgPosRank, posForColor);
                } else if (hasPositivePpg) {
                    projectionColor = 'var(--color-text-mid-test1)';
                } else {
                    projectionColor = 'var(--color-text-secondary)';
                }
            }
            if (selection.matchup) {
                const { opponent, opponentOrdinal, opponentRankDisplay, color, isBye } = selection.matchup;
                const opponentText = opponent || (isBye ? 'BYE' : '');
                if (opponentText) {
                    const opponentStyle = color && !isBye ? ` style="color: ${color};"` : '';
                    const rankRawText = !isBye
                        ? (opponentOrdinal || (opponentRankDisplay && opponentRankDisplay !== 'NA' ? opponentRankDisplay : ''))
                        : '';
                    const hasRankText = Boolean(rankRawText);
                    const rankStyle = color && !isBye ? ` style="color: ${color};"` : '';
                    const safeOpponent = escapeHtml(opponentText);
                    const rankHtml = hasRankText
                        ? `<span class="start-sit-matchup-sep">•</span><span class="start-sit-matchup-rank"${rankStyle}>${escapeHtml(rankRawText)}</span>`
                        : '';
                    // Render matchup inline (next to projected points) to reduce vertical space.
                    // Keep the same data; this is purely a placement/layout change.
                    matchupSectionHtml = `<span class="start-sit-matchup-inline"><span class="start-sit-matchup-opponent"${opponentStyle}>${safeOpponent}</span>${rankHtml}</span>`;
                }
            }
            const rankParts = rankText.split('·');
            const rankNumberDisplay = rankParts.length > 1 ? rankParts.slice(1).join('·') : 'NA';
            assetsHTML = `
                        <div class="trade-asset-chip start-sit-chip">
                            <div class="start-sit-chip-body">
                                <span class="start-sit-name">
                                    <span class="start-sit-inline-tag player-tag" data-pos="${selection.pos}">${selection.pos}</span>
                                    <span class="start-sit-name-text">${escapeHtml(selection.label)}</span>
                                </span>
                                <span class="start-sit-metric"><span class="start-sit-metric-value" style="color: ${ppgColor};">${ppgText}</span><span class="start-sit-metric-unit">PPG</span><span class="start-sit-metric-sep">•</span><span class="start-sit-rank"><span class="start-sit-rank-pos" style="color: ${posColor};">${posForColor}</span><span class="start-sit-rank-dot">·</span><span class="start-sit-rank-number" style="color: ${rankColor};">${rankNumberDisplay}</span></span></span>
                            </div>
                        </div>`;
            totalDisplay = projectionDisplay;
        } else {
            assetsHTML = `<span class="text-xs text-slate-500 p-2">Select a player...</span>`;
        }

        const safeTotal = escapeHtml(totalDisplay);
        return `
                    <div class="trade-team-column start-sit-preview-column">
                        <h4>Player ${slotNumber}</h4>
                        <div class="trade-assets">${assetsHTML}</div>
                        <div class="trade-total even start-sit-total">
                            <span class="start-sit-total-label">Projected Points:</span>
                            <span class="start-sit-proj-inline-row">
                                <span class="start-sit-total-value" style="color: ${projectionColor};">${safeTotal}</span>
                                ${matchupSectionHtml}
                            </span>
                        </div>
                    </div>
                `;
    };

    const renderedRows = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        if (isCompactPreview && rowIndex > 0) {
            continue;
        }
        const leftSlotIndex = rowIndex * 2;
        const rightSlotIndex = leftSlotIndex + 1;
        const leftSelection = slotSelections[leftSlotIndex];
        const rightSelection = slotSelections[rightSlotIndex];

        // Always render the first row; render additional rows only when needed.
        if (rowIndex > 0 && !leftSelection && !rightSelection) {
            continue;
        }

        renderedRows.push(`
                    <div class="start-sit-preview-row">
                        ${buildStartSitSlotColumn(leftSelection, leftSlotIndex + 1)}
                        <div class="trade-divider start-sit-divider"></div>
                        ${buildStartSitSlotColumn(rightSelection, rightSlotIndex + 1)}
                    </div>
                `);
    }

    let bodyHtml = '<div class="start-sit-preview-stack">';
    renderedRows.forEach((rowHtml, idx) => {
        bodyHtml += rowHtml;
        if (idx < renderedRows.length - 1) {
            bodyHtml += '<div class="start-sit-row-separator" role="separator" aria-hidden="true"></div>';
        }
    });
    bodyHtml += '</div>';
    tradeBody.innerHTML = bodyHtml;

    const comparePlayersButton = document.getElementById('comparePlayersButton');
    if (comparePlayersButton) {
        if (selections.length >= 2) {
            comparePlayersButton.classList.add('enabled');
        } else {
            comparePlayersButton.classList.remove('enabled');
        }
    }
    tradeSimulator.classList.toggle('collapsed', state.isTradeCollapsed);
    const clearBtn = document.getElementById('clearTradeButton');
    if (clearBtn) {
        clearBtn.disabled = selections.length === 0;
        clearBtn.addEventListener('click', clearStartSitSelections);
    }
    const closeBtn = document.getElementById('closeTradeButton');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => exitStartSitMode());
    }
    const collapseBtn = document.getElementById('collapseTradeButton');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            tradeSimulator.classList.add('collapsed');
            state.isTradeCollapsed = true;
            mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
            closeComparisonModal();
        });
    }
    const showBtn = document.getElementById('showTradeButton');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            tradeSimulator.classList.remove('collapsed');
            state.isTradeCollapsed = false;
            mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
        });
    }
    mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
}
function renderTradeBlock() {
    const tradeEligible = state.isCompareMode && state.teamsToCompare.size >= 2;
    const startSitActive = state.isStartSitMode;
    if (!tradeEligible && !startSitActive) {
        tradeSimulator.style.display = 'none';
        tradeSimulator.innerHTML = '';
        mainContent.style.paddingBottom = '1rem';
        return;
    }
    tradeSimulator.style.display = 'block';
    if (startSitActive) {
        renderStartSitPreview();
        return;
    }
    tradeSimulator.innerHTML = `
              <div class="trade-container glass-panel">
          <div class="trade-header">
            <div class="trade-header-left">
              <h3>Trade Preview <i class="fa-solid fa-code-compare fa-rotate-270"></i></h3>
            </div>
            <div class="trade-header-center">
              <button id="collapseTradeButton"><i class="fa-solid fa-caret-down"></i></button>
            </div>
            <div class="trade-header-right">
              <button id="comparePlayersButton" class="control-button-subtle">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="label">Compare</span>
              </button>
              <button id="clearTradeButton" type="button">
                <i class="fa-solid fa-eraser"></i>
                <span class="label">Clear</span>
              </button>
              <button id="closeTradeButton" type="button">
                <i class="fa-solid fa-circle-xmark"></i>
                <span class="label">Close</span>
              </button>
            </div>
          </div>
          <div class="trade-body"></div>
          <div class="trade-footnote">• Non-Adjusted Values •</div>
        </div>
        <button id="showTradeButton"><i class="fa-solid fa-circle-chevron-up"></i> Trade Preview <i class="fa-solid fa-circle-chevron-up"></i></button>
  `;
    const tradeBody = tradeSimulator.querySelector('.trade-body');
    const teamNames = Array.from(state.teamsToCompare);
    const tradeData = {};
    teamNames.forEach(name => {
        const assets = state.tradeBlock[name] || [];
        const totalKtc = assets.reduce((sum, asset) => sum + asset.ktc, 0);
        tradeData[name] = { assets, totalKtc };
    });
    // Rosters Trade Preview player-name taps reuse the same Game Logs opener as
    // roster-card names. Draft picks stay plain text because they have no player ID.
    const tradePreviewPlayerAssets = new Map();
    const totals = teamNames.map(name => tradeData[name].totalKtc);
    const totalClasses = {};
    if (teamNames.length === 2) {
        const diff = totals[0] - totals[1];
        if (diff > 500) {
            totalClasses[teamNames[0]] = 'winning';
            totalClasses[teamNames[1]] = 'losing';
        } else if (diff < -500) {
            totalClasses[teamNames[0]] = 'losing';
            totalClasses[teamNames[1]] = 'winning';
        } else {
            totalClasses[teamNames[0]] = 'even';
            totalClasses[teamNames[1]] = 'even';
        }
    }
    let bodyHtml = '';
    teamNames.forEach((teamName, index) => {
        const { assets, totalKtc } = tradeData[teamName];
        let assetsHTML = '';
        if (assets.length > 0) {
            assets.forEach(asset => {
                const ktcColor = getKtcColor(asset.ktc);
                const playerId = String(asset.id || '');
                const isPlayerAsset = Boolean(playerId && state.players[playerId]);
                if (isPlayerAsset) {
                    tradePreviewPlayerAssets.set(playerId, asset);
                }
                const assetLabelHtml = isPlayerAsset
                    ? `<span class="player-name-clickable trade-preview-player-name" data-player-id="${escapeHtml(playerId)}">${escapeHtml(asset.label)}</span>`
                    : `<span>${escapeHtml(asset.label)}</span>`;
                assetsHTML += `<div class="trade-asset-chip"><span class="player-tag" data-pos="${asset.pos || 'DP'}">${asset.pos || 'DP'}</span>${assetLabelHtml}<span class="ktc" style="color: ${ktcColor}">(${asset.ktc})</span></div>`;
            });
        } else {
            assetsHTML = `<span class="text-xs text-slate-500 p-2">Select assets...</span>`;
        }
        const totalClass = totalClasses[teamName] || 'even';
        let teamNameDisplay = teamName;
        if (teamNames.length === 2) {
            if (index === 0) teamNameDisplay = `${teamName}`;
            if (index === 1) teamNameDisplay = `${teamName}`;
        }
        bodyHtml += `
                    <div class="trade-team-column">
                       <h4>${teamNameDisplay}</h4>
                        <div class="trade-assets">${assetsHTML}</div>
                        <div class="trade-total ${totalClass}">
                            Total KTC: ${totalKtc}
                        </div>
                    </div>
                `;
        if (index < teamNames.length - 1 && teamNames.length > 1) {
            bodyHtml += `<div class="trade-divider"></div>`;
        }
    });
    tradeBody.innerHTML = bodyHtml;
    tradeBody.querySelectorAll('.trade-preview-player-name').forEach(nameEl => {
        nameEl.style.cursor = 'pointer';
        nameEl.addEventListener('click', (event) => {
            event.stopPropagation();
            const asset = tradePreviewPlayerAssets.get(nameEl.dataset.playerId);
            if (!asset) return;
            const fullPlayer = state.players[asset.id];
            handlePlayerNameClick({
                id: asset.id,
                name: fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : asset.label,
                pos: asset.basePos || fullPlayer?.position || asset.pos || '',
                team: asset.team || fullPlayer?.team || 'FA',
                ktc: asset.ktc
            });
        });
    });
    // Disable/enable Clear button based on whether any assets are selected
    const clearBtn = document.getElementById('clearTradeButton');
    try {
        const hasAnyAssets = Object.values(tradeData).some(d => Array.isArray(d.assets) && d.assets.length > 0);
        if (clearBtn) clearBtn.disabled = !hasAnyAssets;
    } catch (e) { /* no-op */ }
    const comparePlayersButton = document.getElementById('comparePlayersButton');
    if (comparePlayersButton) {
        const selectedPlayers = Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
        if (selectedPlayers.length === 2) {
            comparePlayersButton.classList.add('enabled');
        } else {
            comparePlayersButton.classList.remove('enabled');
        }
    }
    tradeSimulator.classList.toggle('collapsed', state.isTradeCollapsed);
    document.getElementById('clearTradeButton').addEventListener('click', clearTrade);
    const closeTradeButton = document.getElementById('closeTradeButton');
    if (closeTradeButton) {
        closeTradeButton.addEventListener('click', () => {
            handleClearCompare(true);
        });
    }
    document.getElementById('collapseTradeButton').addEventListener('click', () => {
        tradeSimulator.classList.add('collapsed');
        state.isTradeCollapsed = true;
        mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
        closeComparisonModal();
    });
    document.getElementById('showTradeButton').addEventListener('click', () => {
        tradeSimulator.classList.remove('collapsed');
        state.isTradeCollapsed = false;
        mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
    });
    mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
}
// --- Ownership module ---
// Shared by Ownership page and Rosters watchlist ownership button.
// Previously page-gated; now accessible from rosters for lazy-loaded ownership context.
async function loadOwnershipContextForUser() {
    if (pageType !== 'ownership' && pageType !== 'rosters' && pageType !== 'stats') return null;
    const cacheKey = `${state.userId || ''}`;
    if (!cacheKey) return null;
    if (hasOwnershipContextLoaded(cacheKey)) {
        return state.ownershipContext;
    }
    if (ownershipContextLoadPromise && ownershipContextLoadCacheKey === cacheKey) {
        return ownershipContextLoadPromise;
    }

    ownershipContextLoadCacheKey = cacheKey;
    ownershipContextLoadPromise = (async () => {
        // Ownership context loads all relevant league/roster/user data once per user for
        // fast toggles and modal lookups across the Ownership page and Game Logs modal.
        const userLeagues = await fetchUserLeagues(state.userId);
        const sortedLeagues = [...userLeagues].sort((a, b) => a.name.localeCompare(b.name));
        const leaguePayloads = await Promise.allSettled(sortedLeagues.map(async (league) => {
            const [rosters, users] = await Promise.all([
                fetchWithCache(`${API_BASE}/league/${league.league_id}/rosters`),
                fetchWithCache(`${API_BASE}/league/${league.league_id}/users`)
            ]);
            return { league, rosters, users };
        }));

        const leagues = [];
        const failures = [];
        leaguePayloads.forEach((result, idx) => {
            if (result.status === 'fulfilled') {
                leagues.push(result.value);
            } else {
                failures.push(sortedLeagues[idx]?.name || sortedLeagues[idx]?.league_id || `League ${idx + 1}`);
            }
        });

        // Keep league color assignment deterministic for both ownership list and modal detail rows.
        assignedLeagueColors.clear();
        nextColorIndex = 0;
        assignedRyColors.clear();
        nextRyColorIndex = 0;

        const context = { cacheKey, leagues, failures };
        state.ownershipContext = context;
        state.leagues = sortedLeagues;

        // If the Game Logs modal ownership tab is already open, refresh it as soon as the
        // shared ownership data finishes loading so the inline modal stops showing a loader.
        const pid = state.currentGameLogsPlayer?.id;
        const owPane = document.getElementById('gamelogs-ownership-pane');
        if (pid && owPane && !owPane.classList.contains('hidden')) {
            if (typeof renderOwnershipInGameLogsPane === 'function') {
                renderOwnershipInGameLogsPane(pid);
            }
        }

        return context;
    })();

    try {
        return await ownershipContextLoadPromise;
    } finally {
        if (ownershipContextLoadCacheKey === cacheKey) {
            ownershipContextLoadPromise = null;
            ownershipContextLoadCacheKey = '';
        }
    }
}

function hasOwnershipContextLoaded(cacheKey = `${state.userId || ''}`) {
    return Boolean(
        cacheKey
        && state.ownershipContext?.cacheKey === cacheKey
        && Array.isArray(state.ownershipContext.leagues)
    );
}

function buildOwnershipRowsFromContext() {
    if (pageType !== 'ownership' && pageType !== 'rosters' && pageType !== 'stats') return [];
    const context = state.ownershipContext;
    if (!context?.leagues?.length) {
        state.ownershipRows = [];
        return state.ownershipRows;
    }

    const agg = new Map();
    const totalLeagues = context.leagues.length;

    context.leagues.forEach(({ league, rosters }) => {
        const leagueAbbr = getLeagueAbbr(league?.name || 'League');
        const myRoster = (rosters || []).find(r => r.owner_id === state.userId || (Array.isArray(r.co_owners) && r.co_owners.includes(state.userId)));
        if (!myRoster) return;

        const pids = new Set((myRoster.players || []).filter(Boolean));
        pids.forEach((pid) => {
            const player = state.players?.[pid];
            if (!player) return;
            if (!agg.has(pid)) {
                agg.set(pid, {
                    pid,
                    leagueAbbrs: new Set(),
                    count: 0
                });
            }
            const current = agg.get(pid);
            current.leagueAbbrs.add(leagueAbbr);
            current.count = current.leagueAbbrs.size;
        });
    });

    const rows = Array.from(agg.values()).map((entry) => {
        const player = state.players?.[entry.pid];
        if (!player) return null;
        const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase();
        const first = (player.first_name || '').trim();
        const last = (player.last_name || '').trim();
        const fullName = `${first} ${last}`.trim() || entry.pid;
        const displayName = first && last ? `${first.charAt(0)}. ${last}` : fullName;
        const ktcData = state.ownershipPreferredKtcMode === 'oneqb'
            ? state.oneQbData?.[entry.pid]
            : (state.sflxData?.[entry.pid] || state.oneQbData?.[entry.pid]);
        const ageFromSheet = ktcData?.age;
        const age = Number.isFinite(ageFromSheet)
            ? Number(ageFromSheet).toFixed(1)
            : (Number.isFinite(Number(player.age)) ? Number(player.age).toFixed(1) : '—');
        const rookieYear = deriveRookieYear(player);
        const percentage = totalLeagues > 0 ? Math.round((entry.count / totalLeagues) * 100) : 0;
        const leagueAbbrs = Array.from(entry.leagueAbbrs).sort();
        const sflxKtc = state.sflxData?.[entry.pid]?.ktc;
        return {
            pid: entry.pid,
            pos,
            team: player.team || 'FA',
            first,
            last,
            fullName,
            displayName: displayName.length > 17 ? `${displayName.slice(0, 17)}…` : displayName,
            age,
            rookieYear,
            count: entry.count,
            percentage,
            sflxKtc: Number.isFinite(sflxKtc) ? sflxKtc : null,
            leagueAbbrs,
            search: `${first} ${last} ${fullName} ${displayName}`.trim().toLowerCase()
        };
    }).filter(Boolean);

    // Ownership list ordering:
    // - keeps owned-league count as the primary descending exposure sort
    // - breaks equal-ownership ties by SFLX KTC value descending, with missing values last
    // - uses player name only as the final deterministic tie-break
    rows.sort((a, b) => {
        const countDiff = b.count - a.count;
        if (countDiff !== 0) return countDiff;

        const aHasSflxKtc = Number.isFinite(a.sflxKtc);
        const bHasSflxKtc = Number.isFinite(b.sflxKtc);
        if (aHasSflxKtc !== bHasSflxKtc) return aHasSflxKtc ? -1 : 1;
        if (aHasSflxKtc && bHasSflxKtc && a.sflxKtc !== b.sflxKtc) {
            return b.sflxKtc - a.sflxKtc;
        }

        return a.fullName.localeCompare(b.fullName);
    });

    state.ownershipRows = rows;
    return rows;
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    const str = typeof unsafe === 'string' ? unsafe : String(unsafe);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function extractSeasonStatValue(playerId, keys = []) {
    const seasonStats = state.playerSeasonStats?.[playerId] || {};
    for (const key of keys) {
        const value = seasonStats?.[key];
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
    }
    return null;
}

function parsePosRankNumber(posRankText) {
    if (!posRankText) return null;
    const match = String(posRankText).match(/(\d+)/);
    if (!match) return null;
    const numeric = Number.parseInt(match[1], 10);
    return Number.isFinite(numeric) ? numeric : null;
}

function formatPosRankText(pos, sourceText) {
    const rankNumber = parsePosRankNumber(sourceText);
    if (!pos) return '—';
    if (!Number.isFinite(rankNumber) || rankNumber <= 0) return `${pos}·—`;
    return `${pos}·${rankNumber}`;
}

function buildOwnershipValueRows() {
    if (pageType !== 'ownership') return [];
    const rows = [];
    const OWNERSHIP_VALUE_MAX_PLAYERS = 500;

    // Ownership Player Value table source guard:
    // - targets the Ownership page value-table dataset
    // - limits candidates to players that exist in SLP.TL KTC sheets (1QB/SFLX)
    // - excludes non-player rows (RDP picks) and hard-caps list to 500 for expected scope/perf
    const sheetCandidateMap = new Map();
    const registerSheetCandidate = (playerId, sheetRow) => {
        if (!playerId || !sheetRow || sheetRow.pos === 'RDP') return;
        const player = state.players?.[playerId];
        if (!player) return;
        const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase();
        if (!['QB', 'RB', 'WR', 'TE'].includes(pos)) return;

        const overallRank = Number.isFinite(sheetRow.overallRank) && sheetRow.overallRank > 0
            ? sheetRow.overallRank
            : Number.POSITIVE_INFINITY;
        const ktcValue = Number.isFinite(sheetRow.ktc) ? sheetRow.ktc : Number.NEGATIVE_INFINITY;
        const existing = sheetCandidateMap.get(playerId);

        if (!existing) {
            sheetCandidateMap.set(playerId, {
                overallRank,
                ktcValue
            });
            return;
        }

        existing.overallRank = Math.min(existing.overallRank, overallRank);
        existing.ktcValue = Math.max(existing.ktcValue, ktcValue);
    };

    Object.entries(state.oneQbData || {}).forEach(([playerId, sheetRow]) => {
        registerSheetCandidate(playerId, sheetRow);
    });
    Object.entries(state.sflxData || {}).forEach(([playerId, sheetRow]) => {
        registerSheetCandidate(playerId, sheetRow);
    });

    const candidatePlayerIds = [...sheetCandidateMap.entries()]
        .sort((a, b) => {
            const rankDiff = a[1].overallRank - b[1].overallRank;
            if (Number.isFinite(rankDiff) && rankDiff !== 0) return rankDiff;

            const ktcDiff = b[1].ktcValue - a[1].ktcValue;
            if (Number.isFinite(ktcDiff) && ktcDiff !== 0) return ktcDiff;

            return a[0].localeCompare(b[0]);
        })
        .slice(0, OWNERSHIP_VALUE_MAX_PLAYERS)
        .map(([playerId]) => playerId);

    candidatePlayerIds.forEach((playerId) => {
        const player = state.players?.[playerId];
        if (!player) return;
        const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase();
        if (!['QB', 'RB', 'WR', 'TE'].includes(pos)) return;

        const oneQb = state.oneQbData?.[playerId] || null;
        const sflx = state.sflxData?.[playerId] || null;
        const fpts = extractSeasonStatValue(playerId, ['fpts_ppr', 'fpt_ppr']);
        const seasonGamesPlayed = extractSeasonStatValue(playerId, ['games_played']);
        const seasonPpg = extractSeasonStatValue(playerId, ['ppg']);
        const ppg = Number.isFinite(seasonPpg)
            ? seasonPpg
            : (Number.isFinite(fpts) && Number.isFinite(seasonGamesPlayed) && seasonGamesPlayed > 0 ? (fpts / seasonGamesPlayed) : null);
        const ageRaw = (typeof sflx?.age === 'number' ? sflx.age : (typeof oneQb?.age === 'number' ? oneQb.age : null));
        const fallbackSleeperAge = Number(player.age);
        const ageNumber = Number.isFinite(ageRaw)
            ? Number(ageRaw)
            : (Number.isFinite(fallbackSleeperAge) ? fallbackSleeperAge : null);
        const age = Number.isFinite(ageNumber) ? ageNumber.toFixed(1) : '—';
        const first = (player.first_name || '').trim();
        const last = (player.last_name || '').trim();
        const fullName = `${first} ${last}`.trim() || playerId;
        const displayName = first && last ? `${first.charAt(0)}. ${last}` : fullName;
        const oneQbPosRankNumber = parsePosRankNumber(oneQb?.posRank);
        const sflxPosRankNumber = parsePosRankNumber(sflx?.posRank);

        rows.push({
            playerId,
            fullName,
            displayName,
            pos,
            team: (player.team || 'FA').toUpperCase(),
            age,
            ageNumber,
            oneQbKtc: Number.isFinite(oneQb?.ktc) ? oneQb.ktc : null,
            oneQbPosRank: formatPosRankText(pos, oneQb?.posRank),
            oneQbPosRankNumber,
            sflxKtc: Number.isFinite(sflx?.ktc) ? sflx.ktc : null,
            sflxPosRank: formatPosRankText(pos, sflx?.posRank),
            sflxPosRankNumber,
            fpts: Number.isFinite(fpts) ? fpts : null,
            ppg: Number.isFinite(ppg) ? ppg : null,
            search: `${fullName} ${displayName} ${player.team || ''} ${pos}`.toLowerCase()
        });
    });

    // Ownership player value table default order: descending FPTS.
    rows.sort((a, b) => {
        const aFpts = Number.isFinite(a.fpts) ? a.fpts : -Infinity;
        const bFpts = Number.isFinite(b.fpts) ? b.fpts : -Infinity;
        if (bFpts !== aFpts) return bFpts - aFpts;
        return a.fullName.localeCompare(b.fullName);
    });

    rows.forEach((row, index) => {
        row.rk = index + 1;
    });

    state.ownershipValueRows = rows;
    return rows;
}

function setOwnershipMode(mode) {
    if (pageType !== 'ownership') return;
    const previousMode = state.ownershipMode;
    const nextMode = mode === 'value' ? 'value' : 'ownership';
    state.ownershipMode = nextMode;

    // Keep switcher ARIA and active styling in sync with current ownership view.
    if (ownershipModeOwnershipBtn && ownershipModeValueBtn) {
        const ownershipActive = nextMode === 'ownership';
        ownershipModeOwnershipBtn.classList.toggle('is-active', ownershipActive);
        ownershipModeOwnershipBtn.setAttribute('aria-pressed', ownershipActive ? 'true' : 'false');
        ownershipModeValueBtn.classList.toggle('is-active', !ownershipActive);
        ownershipModeValueBtn.setAttribute('aria-pressed', !ownershipActive ? 'true' : 'false');
    }

    // Ownership Player Value mobile tab reset:
    // keeps tab switches from inheriting page scroll so only the table body remains the active scroller.
    if (nextMode === 'value' && previousMode !== 'value' && isOwnershipValueMobileViewport()) {
        ownershipValueForceTopOnNextRender = true;
        try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (error) { window.scrollTo(0, 0); }
    }

    renderOwnershipMode();
}

function renderOwnershipMode() {
    if (pageType !== 'ownership' || !playerListView) return;
    hideLegend();
    // Clean up percent-tab search debounce when switching away
    if (ownershipPercentSearchDebounceTimer) {
        clearTimeout(ownershipPercentSearchDebounceTimer);
        ownershipPercentSearchDebounceTimer = null;
    }
    if (state.ownershipMode === 'value') {
        renderOwnershipValueView();
        return;
    }
    teardownOwnershipValueRuntime();
    renderOwnershipPercentView();
}

/* Ownership page Exposure column conditional-format tier map:
   - targets ONLY the Exposure column in default Ownership% view
   - tier selection is based ONLY on ownership count
   - supports 20 tiers: count 1..20 (20+ stays in tier-20)
   - count and percent always share the same tier hue (percent is dimmer in CSS)
   IMPORTANT: keep this list sorted high -> low by minCount.
   To change count cutoffs, edit minCount values below. */
const OWNERSHIP_EXPOSURE_CF_COUNT_TIERS = [
    { minCount: 20, className: 'ownership-exposure--tier-20' },
    { minCount: 19, className: 'ownership-exposure--tier-19' },
    { minCount: 18, className: 'ownership-exposure--tier-18' },
    { minCount: 17, className: 'ownership-exposure--tier-17' },
    { minCount: 16, className: 'ownership-exposure--tier-16' },
    { minCount: 15, className: 'ownership-exposure--tier-15' },
    { minCount: 14, className: 'ownership-exposure--tier-14' },
    { minCount: 13, className: 'ownership-exposure--tier-13' },
    { minCount: 12, className: 'ownership-exposure--tier-12' },
    { minCount: 11, className: 'ownership-exposure--tier-11' },
    { minCount: 10, className: 'ownership-exposure--tier-10' },
    { minCount: 9, className: 'ownership-exposure--tier-9' },
    { minCount: 8, className: 'ownership-exposure--tier-8' },
    { minCount: 7, className: 'ownership-exposure--tier-7' },
    { minCount: 6, className: 'ownership-exposure--tier-6' },
    { minCount: 5, className: 'ownership-exposure--tier-5' },
    { minCount: 4, className: 'ownership-exposure--tier-4' },
    { minCount: 3, className: 'ownership-exposure--tier-3' },
    { minCount: 2, className: 'ownership-exposure--tier-2' },
    { minCount: 1, className: 'ownership-exposure--tier-1' }
];

/* Ownership Exposure helper:
   - normalizes incoming ownership count (integer >= 0)
   - returns the CSS class that drives ownership-only Exposure colors
   - applies count banding: 1 => tier-1 ... 15+ => tier-15 */
function getOwnershipExposureTierClassByCount(count) {
    const safeCount = Number.isFinite(count)
        ? Math.max(0, Math.round(count))
        : 0;
    const tierConfig = OWNERSHIP_EXPOSURE_CF_COUNT_TIERS.find((tier) => safeCount >= tier.minCount);
    return tierConfig?.className || 'ownership-exposure--tier-1';
}

/* Ownership% list in-place updater:
   - rebuilds the list rows only (not the toolbar/search/filter bar)
   - preserves search input focus and cursor position
   - applies search plus the ownership-only position filters at every viewport */
function renderOwnershipPercentList(shell) {
    if (!shell) return;
    const rows = Array.isArray(state.ownershipRows) ? state.ownershipRows : [];
    const searchTerm = (state.ownershipListSearchTerm || '').trim().toLowerCase();
    const activePos = (state.ownershipPercentPositionFilter || 'ALL').toUpperCase();

    const list = shell.querySelector('.ownership-list');
    if (!list) return;

    // Ownership filter contract: FLX groups RB, WR, and TE without including QB.
    const filteredRows = rows.filter((row) => {
        const rowPos = String(row.pos || '').toUpperCase();
        const matchesPosition = activePos === 'ALL'
            || rowPos === activePos
            || (activePos === 'FLX' && ['RB', 'WR', 'TE'].includes(rowPos));
        if (!matchesPosition) return false;
        if (searchTerm && !row.search.includes(searchTerm)) return false;
        return true;
    });

    // Ownership% row refresh: only the independently scrollable row container is
    // rebuilt. The frozen header is a separate shell sibling, so row paint can
    // never travel behind its translucent material while the list scrolls.
    list.replaceChildren();

    // Ownership Leagues column formatter: desktop retains the complete league
    // list, while the dedicated mobile variant is capped at 14 abbreviations.
    const formatOwnershipLeagueList = (leagueAbbrs) => leagueAbbrs
        .map((abbr) => `<span style="color:${getLeagueColor(abbr)}">${abbr}</span>`)
        .join(', ') || '—';

    filteredRows.forEach((row) => {
        const item = document.createElement('article');
        item.className = 'ownership-list-row';
        item.dataset.playerId = row.pid;
        const details = [];
        if (row.age !== '—') {
            const ageColor = getAgeColorForRoster(row.pos, parseFloat(row.age)) || 'inherit';
            details.push(`Age <span style="color:${ageColor}">${row.age}</span>`);
        }
        if (row.rookieYear) {
            const ryAbbr = String(row.rookieYear).slice(-2);
            details.push(`RY-<span style="color:${getRyColor(row.rookieYear) || 'inherit'}">${ryAbbr}</span>`);
        }

        const exposureCount = Number.isFinite(row.count)
            ? Math.max(0, Math.round(row.count))
            : 0;
        const exposurePct = Number.isFinite(row.percentage)
            ? Math.max(0, Math.min(100, Math.round(row.percentage)))
            : 0;
        // Ownership Exposure class by COUNT only:
        // count and percentage share the same hue tier from the count bucket.
        const exposureClass = getOwnershipExposureTierClassByCount(exposureCount);
        const leagueAbbrs = Array.isArray(row.leagueAbbrs) ? row.leagueAbbrs : [];
        const leagueList = formatOwnershipLeagueList(leagueAbbrs);
        const mobileLeagueList = formatOwnershipLeagueList(leagueAbbrs.slice(0, 14));

        item.innerHTML = `
            <div class="ownership-list-player-wrap">
                <span class="pl-list-tag ownership-pos-tag ${row.pos}">${row.pos}</span>
                <div class="ownership-list-player-main">
                    <div class="ownership-list-player-top">
                        <button class="ownership-player-trigger" type="button" data-player-id="${row.pid}">${row.displayName}</button>
                        ${getOwnershipTeamMarkup(row.team, 'list')}
                    </div>
                    <div class="ownership-player-meta">${details.join('<span class="pl-details-sep"> • </span>') || '—'}</div>
                </div>
            </div>
            <div class="ownership-list-metric ownership-list-exposure ${exposureClass}">
                <span class="ownership-exposure-count">${exposureCount}</span>
                <span class="ownership-exposure-sep" aria-hidden="true">⏐</span>
                <span class="ownership-exposure-pct">${exposurePct}%</span>
            </div>
            <div class="ownership-list-leagues">
                <span class="ownership-list-leagues-full">${leagueList}</span>
                <span class="ownership-list-leagues-mobile">${mobileLeagueList}</span>
            </div>
        `;
        list.appendChild(item);
    });

    if (!filteredRows.length) {
        const empty = document.createElement('p');
        empty.className = 'ownership-empty-state';
        empty.textContent = 'No players match the current search.';
        list.appendChild(empty);
    }

    // Keep the ownership-only filter buttons and ARIA state synchronized after each refresh.
    updateOwnershipPercentPositionFilterButtons(shell);
}

/* Ownership% position filter button ARIA / active-class sync.
   This deliberately targets a class that is not shared with Player Value. */
function updateOwnershipPercentPositionFilterButtons(shell) {
    if (!shell) return;
    const activePos = (state.ownershipPercentPositionFilter || 'ALL').toUpperCase();
    shell.querySelectorAll('.ownership-percent-filter-btn[data-ownership-percent-pos]').forEach((button) => {
        const buttonPos = (button.dataset.ownershipPercentPos || 'ALL').toUpperCase();
        const isActive = buttonPos === activePos;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function renderOwnershipPercentView() {
    // If the shell already exists in the DOM, just refresh the list content
    // instead of destroying and recreating the entire view (avoids focus loss on search).
    const existingShell = playerListView?.querySelector('.ownership-shell--percent');
    if (existingShell) {
        renderOwnershipPercentList(existingShell);
        return;
    }

    const shell = document.createElement('section');
    shell.className = 'ownership-shell ownership-shell--percent';

    // Ownership% toolbar: dedicated position buttons sit beside search on desktop
    // and below it on mobile; CSS keeps both layouts exclusive to this page/view.
    const toolbar = document.createElement('div');
    toolbar.className = 'ownership-toolbar';
    toolbar.innerHTML = `
        <label class="sr-only" for="ownershipSearchInput">Search owned players</label>
        <div class="ownership-search-wrap">
            <input id="ownershipSearchInput" class="ownership-search-input" type="search" placeholder="Search players..." autocomplete="off" value="${state.ownershipListSearchTerm || ''}" />
            <button class="ownership-search-clear ${(state.ownershipListSearchTerm || '') ? 'is-visible' : ''}" id="ownershipPercentSearchClear" type="button" aria-label="Clear ownership search" aria-hidden="${(state.ownershipListSearchTerm || '') ? 'false' : 'true'}">
                <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
            </button>
            <span class="ownership-search-icon" aria-hidden="true"><i class="fa-solid fa-magnifying-glass"></i></span>
        </div>
        <div class="ownership-percent-position-filter" role="group" aria-label="Filter ownership by position">
            ${['ALL', 'QB', 'RB', 'WR', 'TE', 'FLX'].map((pos) => {
                const active = (state.ownershipPercentPositionFilter || 'ALL') === pos;
                return `<button class="ownership-percent-filter-btn ${active ? 'is-active' : ''}" type="button" data-ownership-percent-pos="${pos}" aria-pressed="${active ? 'true' : 'false'}">${pos}</button>`;
            }).join('')}
        </div>
    `;

    // Ownership% frozen header: keep the column labels physically outside the
    // row scroller so translucent header pixels can never reveal moving rows.
    const headerGuard = document.createElement('div');
    headerGuard.className = 'ownership-list-header-guard';
    headerGuard.innerHTML = `
        <div class="ownership-list-header">
            <span class="ownership-col ownership-col--player">Player</span>
            <span class="ownership-col ownership-col--exposure">Exposure</span>
            <span class="ownership-col ownership-col--leagues">Leagues</span>
        </div>
    `;

    // List container: rows only are populated by renderOwnershipPercentList.
    const list = document.createElement('div');
    list.className = 'ownership-list';

    shell.appendChild(toolbar);
    shell.appendChild(headerGuard);
    shell.appendChild(list);
    playerListView.innerHTML = '';
    playerListView.appendChild(shell);

    // Populate list rows
    renderOwnershipPercentList(shell);

    // --- Event listeners (wired once on initial render) ---
    const searchInput = shell.querySelector('#ownershipSearchInput');
    const searchClearButton = shell.querySelector('#ownershipPercentSearchClear');

    // Sync clear button visibility on initial render
    syncOwnershipValueSearchClearButton(searchInput, searchClearButton);

    // Debounced search: updates list content only, preserving search input focus
    searchInput?.addEventListener('input', (event) => {
        state.ownershipListSearchTerm = String(event.target.value || '');
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
        clearTimeout(ownershipPercentSearchDebounceTimer);
        ownershipPercentSearchDebounceTimer = setTimeout(() => {
            renderOwnershipPercentList(shell);
        }, OWNERSHIP_VALUE_SEARCH_DEBOUNCE_MS);
    });

    searchInput?.addEventListener('focus', () => {
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
    });

    searchInput?.addEventListener('blur', () => {
        requestAnimationFrame(() => syncOwnershipValueSearchClearButton(searchInput, searchClearButton));
    });

    // Clear button: first click clears text and re-focuses; second click (empty) blurs.
    searchClearButton?.addEventListener('pointerdown', (event) => {
        event.preventDefault();
    });
    searchClearButton?.addEventListener('click', () => {
        if (!searchInput) return;
        const hasText = String(searchInput.value || '').length > 0;
        if (hasText) {
            searchInput.value = '';
            state.ownershipListSearchTerm = '';
            syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
            renderOwnershipPercentList(shell);
            try {
                searchInput.focus({ preventScroll: true });
            } catch (error) {
                searchInput.focus();
            }
            return;
        }
        searchInput.blur();
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
    });

    // Ownership-only position filter: available on both touch and desktop layouts.
    shell.querySelector('.ownership-percent-position-filter')?.addEventListener('click', (event) => {
        const button = event.target.closest('.ownership-percent-filter-btn');
        if (!button) return;
        const nextPos = button.dataset.ownershipPercentPos || 'ALL';
        state.ownershipPercentPositionFilter = nextPos;
        updateOwnershipPercentPositionFilterButtons(shell);
        renderOwnershipPercentList(shell);
    });

    // Player name click -> open ownership detail modal
    list.addEventListener('click', (event) => {
        const btn = event.target.closest('.ownership-player-trigger');
        if (!btn) return;
        const playerId = btn.dataset.playerId;
        if (!playerId) return;
        openOwnershipPlayerModal(playerId);
    });
}

function formatOwnershipValue(value, decimals = 1) {
    if (!Number.isFinite(value)) return '—';
    return Number(value).toFixed(decimals);
}

/* Ownership team visual:
   - replaces text team tags in the Ownership% list with NFL logos
   - gives list and Player Value logos separate styling hooks
   - keeps a compact FA fallback because there is no NFL logo for free agents */
function getOwnershipTeamMarkup(teamRaw, variant = 'value') {
    const teamKey = (teamRaw || 'FA').toUpperCase();
    const teamStyle = `background-color: ${TEAM_COLORS[teamKey] || '#64748b'}; color: #fff;`;
    const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
    const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
    const src = `../assets/NFL_logos_svg/${normalizedKey}.svg`;
    const isListLogo = variant === 'list';
    const logoClass = isListLogo ? 'ownership-list-team-logo' : 'ownership-value-team-logo';
    const fallbackClass = isListLogo
        ? 'ownership-list-team-fallback'
        : 'stats-team-chip ownership-value-team-fallback';
    return (teamKey && teamKey !== 'FA')
        ? `<img class="team-logo glow ownership-team-logo ${logoClass}" src="${src}" alt="${escapeHtml(teamKey)}" width="20" height="20" loading="lazy" decoding="async">`
        : `<span class="${fallbackClass}" style="${teamStyle}">${escapeHtml(teamKey)}</span>`;
}

function getOwnershipSortCellValue(row, column) {
    switch (column) {
        case 'rk':
            return Number.isFinite(row.rk) ? row.rk : null;
        case 'player':
            return row.fullName || '';
        case 'pos':
            return row.pos || '';
        case 'team':
            return row.team || '';
        case 'age':
            return Number.isFinite(row.ageNumber) ? row.ageNumber : null;
        case 'oneQbKtc':
            return Number.isFinite(row.oneQbKtc) ? row.oneQbKtc : null;
        case 'oneQbPosRank':
            return Number.isFinite(row.oneQbPosRankNumber) ? row.oneQbPosRankNumber : null;
        case 'sflxKtc':
            return Number.isFinite(row.sflxKtc) ? row.sflxKtc : null;
        case 'sflxPosRank':
            return Number.isFinite(row.sflxPosRankNumber) ? row.sflxPosRankNumber : null;
        case 'fpts':
            return Number.isFinite(row.fpts) ? row.fpts : null;
        case 'ppg':
            return Number.isFinite(row.ppg) ? row.ppg : null;
        default:
            return null;
    }
}

function compareOwnershipSortValues(a, b, column, direction) {
    const directionFactor = direction === 'asc' ? 1 : -1;
    const aValue = getOwnershipSortCellValue(a, column);
    const bValue = getOwnershipSortCellValue(b, column);
    const isTextColumn = column === 'player' || column === 'pos' || column === 'team';

    if (isTextColumn) {
        const left = String(aValue || '').toUpperCase();
        const right = String(bValue || '').toUpperCase();
        return left.localeCompare(right) * directionFactor;
    }

    const aMissing = !Number.isFinite(aValue);
    const bMissing = !Number.isFinite(bValue);
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;
    return (aValue - bValue) * directionFactor;
}

function sortOwnershipValueRows(rows) {
    const { column: sortColumn, direction: sortDirection } = getOwnershipValueActiveSort();
    return [...rows].sort((a, b) => {
        const primary = compareOwnershipSortValues(a, b, sortColumn, sortDirection);
        if (primary !== 0) return primary;
        if (a.rk !== b.rk) return a.rk - b.rk;
        return (a.fullName || '').localeCompare(b.fullName || '');
    });
}

// Ownership Player Value view performance controls:
// - Debounces search-triggered renders so each keystroke does not re-build the full view.
// - Batches row rendering to keep scrolling and interactions responsive on large datasets.
const OWNERSHIP_VALUE_SEARCH_DEBOUNCE_MS = 120;
const OWNERSHIP_VALUE_BATCH_SIZE = 120;
const OWNERSHIP_VALUE_MOBILE_BREAKPOINT_PX = 819;
const OWNERSHIP_VALUE_DEFAULT_SORT_COLUMN = 'fpts';
const OWNERSHIP_VALUE_DEFAULT_SORT_DIRECTION = 'desc';
const OWNERSHIP_VALUE_FIRST_DIRECTION_BY_COLUMN = Object.freeze({
    rk: 'asc',
    oneQbPosRank: 'asc',
    sflxPosRank: 'asc',
    age: 'asc',
    fpts: 'desc',
    ppg: 'desc',
    sflxKtc: 'desc',
    oneQbKtc: 'desc',
    player: 'asc',
    pos: 'asc',
    team: 'asc'
});
let ownershipValueSearchDebounceTimer = null;
let ownershipPercentSearchDebounceTimer = null;
let ownershipValueRenderRaf = null;
let ownershipValueStickyResizeObserver = null;
let ownershipValueTableRefreshRaf = null;
let ownershipValueRenderContext = null;
let ownershipValueViewportResizeHandler = null;
let ownershipValueForceTopOnNextRender = false;

function getOwnershipValueActiveSort() {
    if (!state.ownershipValueSortColumn) {
        return {
            column: OWNERSHIP_VALUE_DEFAULT_SORT_COLUMN,
            direction: OWNERSHIP_VALUE_DEFAULT_SORT_DIRECTION,
            isDefault: true
        };
    }
    return {
        column: state.ownershipValueSortColumn,
        direction: state.ownershipValueSortDirection === 'asc' ? 'asc' : 'desc',
        isDefault: false
    };
}

function isOwnershipValueMobileViewport() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(`(max-width: ${OWNERSHIP_VALUE_MOBILE_BREAKPOINT_PX}px)`).matches;
}

function teardownOwnershipValueViewportListeners() {
    if (!ownershipValueViewportResizeHandler || typeof window === 'undefined') return;
    window.removeEventListener('resize', ownershipValueViewportResizeHandler);
    window.removeEventListener('orientationchange', ownershipValueViewportResizeHandler);
    if (window.visualViewport && typeof window.visualViewport.removeEventListener === 'function') {
        window.visualViewport.removeEventListener('resize', ownershipValueViewportResizeHandler);
        window.visualViewport.removeEventListener('scroll', ownershipValueViewportResizeHandler);
    }
    ownershipValueViewportResizeHandler = null;
}

function teardownOwnershipValueRuntime() {
    if (ownershipValueSearchDebounceTimer) {
        clearTimeout(ownershipValueSearchDebounceTimer);
        ownershipValueSearchDebounceTimer = null;
    }
    if (ownershipValueRenderRaf) {
        cancelAnimationFrame(ownershipValueRenderRaf);
        ownershipValueRenderRaf = null;
    }
    if (ownershipValueTableRefreshRaf) {
        cancelAnimationFrame(ownershipValueTableRefreshRaf);
        ownershipValueTableRefreshRaf = null;
    }
    teardownOwnershipValueViewportListeners();
    if (ownershipValueStickyResizeObserver) {
        ownershipValueStickyResizeObserver.disconnect();
        ownershipValueStickyResizeObserver = null;
    }
    if (ownershipValueRenderContext?.tableWrap && ownershipValueRenderContext.loadMoreOnScroll) {
        ownershipValueRenderContext.tableWrap.removeEventListener('scroll', ownershipValueRenderContext.loadMoreOnScroll);
    }
    ownershipValueRenderContext = null;
}

/* Ownership value table frozen-column offset sync:
   - targets Ownership Player Value table only
   - measures real rendered header left offsets so sticky columns align exactly
     with the browser's final layout (no width guessing / no seam drift)
   - prevents visual width/position drift when freezing first 3 columns */
function syncOwnershipValueFrozenColumnOffsets(table) {
    if (!table) return;
    const headerCells = table.querySelectorAll('thead th');
    if (!headerCells || headerCells.length < 3) return;

    const tableStyles = getComputedStyle(table);
    const cssFirstColWidth = Number(parseFloat(tableStyles.getPropertyValue('--ov-col-1-rk')) || 0);
    const cssSecondColWidth = Number(parseFloat(tableStyles.getPropertyValue('--ov-col-2-player')) || 0);
    const measuredFirstColWidth = Number(headerCells[0].getBoundingClientRect().width || headerCells[0].offsetWidth || 0);
    const measuredSecondColWidth = Number(headerCells[1].getBoundingClientRect().width || headerCells[1].offsetWidth || 0);
    const firstColWidth = cssFirstColWidth > 0 ? cssFirstColWidth : measuredFirstColWidth;
    const secondColWidth = cssSecondColWidth > 0 ? cssSecondColWidth : measuredSecondColWidth;

    // Ownership sticky-column guard:
    // derive offsets strictly from measured frozen-column widths so repeat sorts cannot compound offsets
    // from sticky-positioned header cells and push Player/POS to the right.
    if (!Number.isFinite(firstColWidth) || !Number.isFinite(secondColWidth) || firstColWidth <= 0 || secondColWidth <= 0) return;
    const left2 = Math.round(firstColWidth);
    const left3 = Math.round(left2 + secondColWidth);
    const maxReasonableLeft = Math.max(table.clientWidth, table.scrollWidth, 0) + 4;
    if (!Number.isFinite(left3) || left3 <= 0 || left3 > maxReasonableLeft) return;

    table.style.setProperty('--ownership-value-sticky-left-2', `${left2}px`);
    table.style.setProperty('--ownership-value-sticky-left-3', `${left3}px`);
    table.classList.add('ownership-value-table--freeze-ready');
}

/* Ownership value frozen-column lifecycle:
   - keeps sticky offsets synced on resize/reflow while value table is mounted
   - disconnects prior observer before attaching a new one on re-render */
function setupOwnershipValueFrozenColumns(table) {
    if (!table) return;

    if (ownershipValueStickyResizeObserver) {
        ownershipValueStickyResizeObserver.disconnect();
        ownershipValueStickyResizeObserver = null;
    }

    syncOwnershipValueFrozenColumnOffsets(table);
    requestAnimationFrame(() => syncOwnershipValueFrozenColumnOffsets(table));

    if (typeof ResizeObserver === 'function') {
        ownershipValueStickyResizeObserver = new ResizeObserver(() => {
            syncOwnershipValueFrozenColumnOffsets(table);
        });
        ownershipValueStickyResizeObserver.observe(table);
        const headerRow = table.querySelector('thead tr');
        if (headerRow) ownershipValueStickyResizeObserver.observe(headerRow);
    }
}

function getOwnershipValueViewportHeight() {
    if (typeof window === 'undefined') return 0;
    if (window.visualViewport && typeof window.visualViewport.height === 'number') {
        return window.visualViewport.height;
    }
    return window.innerHeight || document.documentElement.clientHeight || 0;
}

/* Ownership value mobile height sync:
   - targets only Ownership Player Value table scroll container
   - computes available viewport space so the table body is the only vertical scroller on mobile
   - runtime CSS var keeps behavior robust across iOS browser chrome / orientation changes */
function syncOwnershipValueMobileTableHeight(tableWrap) {
    if (!tableWrap) return;
    if (!isOwnershipValueMobileViewport()) {
        tableWrap.style.removeProperty('--ownership-value-mobile-max-height');
        return;
    }
    const viewportHeight = getOwnershipValueViewportHeight();
    const top = Number(tableWrap.getBoundingClientRect().top || 0);
    const bottomGutter = 12;
    const available = Math.max(220, Math.floor(viewportHeight - top - bottomGutter));
    tableWrap.style.setProperty('--ownership-value-mobile-max-height', `${available}px`);
}

function setupOwnershipValueMobileHeightSync(tableWrap) {
    teardownOwnershipValueViewportListeners();
    if (!tableWrap || typeof window === 'undefined') return;

    ownershipValueViewportResizeHandler = () => {
        if (!ownershipValueRenderContext?.tableWrap || !document.body.contains(ownershipValueRenderContext.tableWrap)) return;
        syncOwnershipValueMobileTableHeight(ownershipValueRenderContext.tableWrap);
    };

    window.addEventListener('resize', ownershipValueViewportResizeHandler, { passive: true });
    window.addEventListener('orientationchange', ownershipValueViewportResizeHandler, { passive: true });
    if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
        window.visualViewport.addEventListener('resize', ownershipValueViewportResizeHandler, { passive: true });
        window.visualViewport.addEventListener('scroll', ownershipValueViewportResizeHandler, { passive: true });
    }

    ownershipValueViewportResizeHandler();
    requestAnimationFrame(() => ownershipValueViewportResizeHandler && ownershipValueViewportResizeHandler());
}

function scheduleOwnershipValueRender() {
    if (pageType !== 'ownership' || state.ownershipMode !== 'value') return;
    if (ownershipValueRenderRaf) {
        cancelAnimationFrame(ownershipValueRenderRaf);
    }
    ownershipValueRenderRaf = requestAnimationFrame(() => {
        ownershipValueRenderRaf = null;
        renderOwnershipValueView();
    });
}

function scheduleOwnershipValueTableRefresh({ preserveScroll = false } = {}) {
    if (pageType !== 'ownership' || state.ownershipMode !== 'value') return;
    const context = ownershipValueRenderContext;
    if (!context?.tableWrap || !context?.tableBody || !context?.valueTable || !document.body.contains(context.tableWrap)) {
        scheduleOwnershipValueRender();
        return;
    }
    if (ownershipValueTableRefreshRaf) {
        cancelAnimationFrame(ownershipValueTableRefreshRaf);
    }
    ownershipValueTableRefreshRaf = requestAnimationFrame(() => {
        ownershipValueTableRefreshRaf = null;
        renderOwnershipValueRowsInPlace(context, { preserveScroll });
    });
}

function setOwnershipValueSort(column) {
    if (!column) return;
    const textColumns = new Set(['player', 'pos', 'team']);
    const defaultDesktopDirection = textColumns.has(column) ? 'asc' : 'desc';

    // MOBILE ONLY sort cycle:
    // tap 1 => column-specific preferred direction
    // tap 2 => opposite direction
    // tap 3 => reset to default table order (FPTS desc)
    if (isOwnershipValueMobileViewport()) {
        const mobileFirstDirection = OWNERSHIP_VALUE_FIRST_DIRECTION_BY_COLUMN[column] || defaultDesktopDirection;
        if (state.ownershipValueSortColumn !== column) {
            state.ownershipValueSortColumn = column;
            state.ownershipValueSortDirection = mobileFirstDirection;
        } else if (state.ownershipValueSortDirection === mobileFirstDirection) {
            state.ownershipValueSortDirection = mobileFirstDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.ownershipValueSortColumn = null;
            state.ownershipValueSortDirection = null;
        }
    } else if (state.ownershipValueSortColumn === column) {
        // Desktop retains the existing two-state toggle behavior.
        state.ownershipValueSortDirection = state.ownershipValueSortDirection === 'desc' ? 'asc' : 'desc';
    } else {
        state.ownershipValueSortColumn = column;
        state.ownershipValueSortDirection = defaultDesktopDirection;
    }
    // Sorting in place preserves the live search field and avoids mobile keyboard dismissals.
    scheduleOwnershipValueTableRefresh({ preserveScroll: false });
}

function getOwnershipSortClass(column) {
    if (state.ownershipValueSortColumn !== column) return '';
    return (state.ownershipValueSortDirection === 'asc') ? 'stats-sort-asc' : 'stats-sort-desc';
}

function getOwnershipValueRowsFiltered() {
    const term = (state.ownershipValueSearchTerm || '').trim().toLowerCase();
    const activePos = (state.ownershipValuePositionFilter || 'ALL').toUpperCase();
    return (state.ownershipValueRows || []).filter((row) => {
        if (activePos !== 'ALL' && row.pos !== activePos) return false;
        if (term && !row.search.includes(term)) return false;
        return true;
    });
}

function updateOwnershipValueSortHeaders(valueTable) {
    if (!valueTable) return;
    valueTable.querySelectorAll('th[data-sort-key]').forEach((headerCell) => {
        const key = headerCell.dataset.sortKey;
        const activeSort = state.ownershipValueSortColumn === key;
        const sortClass = getOwnershipSortClass(key);
        headerCell.classList.remove('stats-sort-asc', 'stats-sort-desc');
        if (sortClass) headerCell.classList.add(sortClass);
        headerCell.setAttribute('aria-sort', activeSort
            ? ((state.ownershipValueSortDirection === 'asc') ? 'ascending' : 'descending')
            : 'none');
    });
}

function updateOwnershipValuePositionFilterButtons(shell) {
    if (!shell) return;
    const activePos = (state.ownershipValuePositionFilter || 'ALL').toUpperCase();
    shell.querySelectorAll('.ownership-percent-filter-btn[data-ownership-pos]').forEach((button) => {
        const buttonPos = (button.dataset.ownershipPos || 'ALL').toUpperCase();
        const isActive = buttonPos === activePos;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function syncOwnershipValueSearchClearButton(searchInput, clearButton) {
    if (!searchInput || !clearButton) return;
    const hasValue = String(searchInput.value || '').length > 0;
    const isFocused = document.activeElement === searchInput;
    clearButton.classList.toggle('is-visible', hasValue || isFocused);
    clearButton.setAttribute('aria-hidden', clearButton.classList.contains('is-visible') ? 'false' : 'true');
}

/* Ownership value table in-place refresh:
   - rebuilds tbody only (not the toolbar shell)
   - keeps search focus/cursor stable while filtering/sorting
   - reuses batching + infinite scroll to preserve performance characteristics */
function renderOwnershipValueRowsInPlace(context, { preserveScroll = false } = {}) {
    if (!context?.tableWrap || !context?.tableBody || !context?.valueTable) return;

    const { shell, tableWrap, tableBody, valueTable } = context;
    const rows = sortOwnershipValueRows(getOwnershipValueRowsFiltered());
    const emptyState = context.emptyState || shell.querySelector('.ownership-empty-state--value');

    // Ownership frozen-column stability guard:
    // temporarily disable sticky columns while tbody is rebuilt so rapid sort/filter updates
    // cannot leave stale sticky offsets applied to Player/POS cells.
    valueTable.classList.remove('ownership-value-table--freeze-ready');

    updateOwnershipValueSortHeaders(valueTable);
    updateOwnershipValuePositionFilterButtons(shell);

    if (context.loadMoreOnScroll) {
        tableWrap.removeEventListener('scroll', context.loadMoreOnScroll);
        context.loadMoreOnScroll = null;
    }

    const previousScrollTop = preserveScroll ? tableWrap.scrollTop : 0;
    tableBody.innerHTML = '';

    if (!rows.length) {
        if (emptyState) {
            emptyState.textContent = 'No value-table players match current filters.';
            emptyState.classList.remove('hidden');
        }
        tableWrap.scrollTop = 0;
        syncOwnershipValueFrozenColumnOffsets(valueTable);
        syncOwnershipValueMobileTableHeight(tableWrap);
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    let renderedCount = 0;
    const appendNextBatch = () => {
        if (renderedCount >= rows.length) return false;
        const nextRows = rows.slice(renderedCount, renderedCount + OWNERSHIP_VALUE_BATCH_SIZE);
        if (!nextRows.length) return false;
        tableBody.insertAdjacentHTML('beforeend', nextRows.map(buildOwnershipValueTableRowMarkup).join(''));
        renderedCount += nextRows.length;
        return renderedCount < rows.length;
    };
    const fillViewport = () => {
        while (tableWrap.scrollHeight <= tableWrap.clientHeight + 8) {
            if (!appendNextBatch()) break;
        }
    };

    appendNextBatch();
    fillViewport();

    if (rows.length > renderedCount) {
        context.loadMoreOnScroll = () => {
            const nearBottom = tableWrap.scrollTop + tableWrap.clientHeight >= tableWrap.scrollHeight - 220;
            if (!nearBottom) return;
            const hasMore = appendNextBatch();
            if (!hasMore && context.loadMoreOnScroll) {
                tableWrap.removeEventListener('scroll', context.loadMoreOnScroll);
                context.loadMoreOnScroll = null;
            }
        };
        tableWrap.addEventListener('scroll', context.loadMoreOnScroll, { passive: true });
    }

    if (ownershipValueForceTopOnNextRender && isOwnershipValueMobileViewport()) {
        ownershipValueForceTopOnNextRender = false;
        tableWrap.scrollTop = 0;
        try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (error) { window.scrollTo(0, 0); }
    } else if (preserveScroll) {
        tableWrap.scrollTop = Math.max(0, Math.min(previousScrollTop, tableWrap.scrollHeight - tableWrap.clientHeight));
    } else {
        tableWrap.scrollTop = 0;
    }

    // Re-sync freeze offsets after body rows mount so sticky columns stay exact on first paint.
    syncOwnershipValueFrozenColumnOffsets(valueTable);
    requestAnimationFrame(() => syncOwnershipValueFrozenColumnOffsets(valueTable));
    syncOwnershipValueMobileTableHeight(tableWrap);
    requestAnimationFrame(() => syncOwnershipValueMobileTableHeight(tableWrap));
}

function buildOwnershipValueTableRowMarkup(row) {
    const ageColor = getAgeColorForRoster(row.pos, row.ageNumber) || 'inherit';
    const oneQbKtcColor = getKtcColor(row.oneQbKtc);
    const sflxKtcColor = getKtcColor(row.sflxKtc);
    const oneQbPrkColor = getConditionalColorByRank(row.oneQbPosRankNumber, row.pos);
    const sflxPrkColor = getConditionalColorByRank(row.sflxPosRankNumber, row.pos);
    const oneQbKtcDisplay = Number.isFinite(row.oneQbKtc) ? Math.round(row.oneQbKtc) : '—';
    const sflxKtcDisplay = Number.isFinite(row.sflxKtc) ? Math.round(row.sflxKtc) : '—';
    return `
        <tr>
            <td class="ownership-value-rk">${row.rk}</td>
            <td class="ownership-value-player-cell">
                <button class="ownership-player-trigger ownership-player-trigger--value" type="button" data-player-id="${escapeHtml(row.playerId)}">${escapeHtml(row.displayName)}</button>
            </td>
            <td><span class="pl-list-tag ownership-pos-tag ${row.pos}">${row.pos}</span></td>
            <td class="ownership-value-team-cell">${getOwnershipTeamMarkup(row.team)}</td>
            <td><span style="color:${ageColor};">${row.age}</span></td>
            <td><span class="stats-value-chip ownership-value-chip" style="color:${oneQbKtcColor};">${oneQbKtcDisplay}</span></td>
            <td><span style="color:${oneQbPrkColor};">${row.oneQbPosRank || `${row.pos}·—`}</span></td>
            <td><span class="stats-value-chip ownership-value-chip" style="color:${sflxKtcColor};">${sflxKtcDisplay}</span></td>
            <td><span style="color:${sflxPrkColor};">${row.sflxPosRank || `${row.pos}·—`}</span></td>
            <td>${formatOwnershipValue(row.fpts, 1)}</td>
            <td>${formatOwnershipValue(row.ppg, 1)}</td>
        </tr>
    `;
}

function renderOwnershipValueView() {
    teardownOwnershipValueRuntime();

    const shell = document.createElement('section');
    shell.className = 'ownership-shell ownership-shell--value';

    const columns = [
        { label: 'RK', key: 'rk' },
        { label: 'Player', key: 'player', className: 'ownership-value-col-player' },
        { label: 'POS', key: 'pos' },
        { label: 'TM', key: 'team' },
        { label: 'AGE', key: 'age' },
        { label: '1QB KTC', key: 'oneQbKtc' },
        { label: '1QB pRK', key: 'oneQbPosRank' },
        { label: 'SFLX KTC', key: 'sflxKtc' },
        { label: 'SFLX pRK', key: 'sflxPosRank' },
        { label: 'FPTS', key: 'fpts' },
        { label: 'PPG', key: 'ppg' }
    ];

    // Player Value reuses the Ownership% toolbar and position-control anatomy so
    // both tabs retain identical materials, spacing, and responsive composition.
    shell.innerHTML = `
        <div class="ownership-toolbar ownership-value-toolbar">
            <div class="ownership-search-wrap ownership-search-wrap--value">
                <label class="sr-only" for="ownershipValueSearchInput">Search value table players</label>
                <input id="ownershipValueSearchInput" class="ownership-search-input" type="search" placeholder="Search players / team..." autocomplete="off" value="${state.ownershipValueSearchTerm || ''}" />
                <button class="ownership-search-clear ${(state.ownershipValueSearchTerm || '') ? 'is-visible' : ''}" id="ownershipValueSearchClear" type="button" aria-label="Clear player value search" aria-hidden="${(state.ownershipValueSearchTerm || '') ? 'false' : 'true'}">
                    <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
                </button>
                <span class="ownership-search-icon" aria-hidden="true"><i class="fa-solid fa-magnifying-glass"></i></span>
            </div>
            <div class="ownership-percent-position-filter ownership-percent-position-filter--value" role="group" aria-label="Filter player value table by position">
                ${['ALL', 'QB', 'RB', 'WR', 'TE'].map((pos) => {
                    const active = (state.ownershipValuePositionFilter || 'ALL') === pos;
                    return `<button class="ownership-percent-filter-btn ${active ? 'is-active' : ''}" type="button" data-ownership-pos="${pos}" aria-pressed="${active ? 'true' : 'false'}">${pos}</button>`;
                }).join('')}
            </div>
        </div>
        <div class="ownership-value-table-wrap">
            <table class="ownership-value-table" aria-label="Ownership player value table">
                <thead>
                    <tr>
                        ${columns.map((column) => {
                            const activeSort = state.ownershipValueSortColumn === column.key;
                            const sortClass = getOwnershipSortClass(column.key);
                            const ariaSort = activeSort
                                ? ((state.ownershipValueSortDirection === 'asc') ? 'ascending' : 'descending')
                                : 'none';
                            return `<th class="is-sortable ${column.className || ''} ${sortClass}" data-sort-key="${column.key}" aria-sort="${ariaSort}" role="columnheader">${column.label}</th>`;
                        }).join('')}
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <p class="ownership-empty-state ownership-empty-state--value hidden"></p>
    `;

    playerListView.innerHTML = '';
    playerListView.appendChild(shell);

    const valueTable = shell.querySelector('.ownership-value-table');
    const tableWrap = shell.querySelector('.ownership-value-table-wrap');
    const tableBody = shell.querySelector('.ownership-value-table tbody');
    const emptyState = shell.querySelector('.ownership-empty-state--value');
    const searchInput = shell.querySelector('#ownershipValueSearchInput');
    const searchClearButton = shell.querySelector('#ownershipValueSearchClear');

    ownershipValueRenderContext = {
        shell,
        valueTable,
        tableWrap,
        tableBody,
        searchInput,
        searchClearButton,
        emptyState,
        loadMoreOnScroll: null
    };

    setupOwnershipValueFrozenColumns(valueTable);
    setupOwnershipValueMobileHeightSync(tableWrap);
    renderOwnershipValueRowsInPlace(ownershipValueRenderContext, { preserveScroll: false });
    syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
    searchInput?.addEventListener('input', (event) => {
        state.ownershipValueSearchTerm = String(event.target.value || '');
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
        // Ownership value search debounce keeps typing responsive on larger data sets.
        clearTimeout(ownershipValueSearchDebounceTimer);
        ownershipValueSearchDebounceTimer = setTimeout(() => {
            scheduleOwnershipValueTableRefresh({ preserveScroll: false });
        }, OWNERSHIP_VALUE_SEARCH_DEBOUNCE_MS);
    });

    searchInput?.addEventListener('focus', () => {
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
    });

    searchInput?.addEventListener('blur', () => {
        requestAnimationFrame(() => syncOwnershipValueSearchClearButton(searchInput, searchClearButton));
    });

    // Ownership value search clear contract:
    // first press clears text and keeps typing focus; pressing again when empty exits the field.
    searchClearButton?.addEventListener('pointerdown', (event) => {
        event.preventDefault();
    });
    searchClearButton?.addEventListener('click', () => {
        if (!searchInput) return;
        const hasText = String(searchInput.value || '').length > 0;
        if (hasText) {
            searchInput.value = '';
            state.ownershipValueSearchTerm = '';
            syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
            scheduleOwnershipValueTableRefresh({ preserveScroll: false });
            try {
                searchInput.focus({ preventScroll: true });
            } catch (error) {
                searchInput.focus();
            }
            return;
        }
        searchInput.blur();
        syncOwnershipValueSearchClearButton(searchInput, searchClearButton);
    });

    shell.querySelector('.ownership-percent-position-filter--value')?.addEventListener('click', (event) => {
        const button = event.target.closest('.ownership-percent-filter-btn');
        if (!button) return;
        const nextPos = button.dataset.ownershipPos || 'ALL';
        state.ownershipValuePositionFilter = nextPos;
        scheduleOwnershipValueTableRefresh({ preserveScroll: false });
    });

    shell.querySelector('.ownership-value-table')?.addEventListener('click', (event) => {
        const sortHeader = event.target.closest('th[data-sort-key]');
        if (sortHeader?.dataset?.sortKey) {
            setOwnershipValueSort(sortHeader.dataset.sortKey);
            return;
        }

        const btn = event.target.closest('.ownership-player-trigger--value');
        if (!btn) return;
        const playerId = btn.dataset.playerId;
        if (!playerId) return;
        openOwnershipPlayerModal(playerId);
    });
}

function findOwnershipLeagueOwnerRows(playerId) {
    const context = state.ownershipContext;
    if (!context?.leagues?.length) return [];

    return context.leagues.map(({ league, rosters, users }) => {
        const usersById = new Map((users || []).map((user) => [user.user_id, user]));
        const rostersWithPlayer = (rosters || []).filter((roster) => (roster.players || []).includes(playerId));

        if (!rostersWithPlayer.length) {
            return {
                leagueId: league.league_id,
                leagueName: league.name || 'League',
                leagueAbbr: getLeagueAbbr(league.name || 'League'),
                ownerDisplay: 'Free Agent / Not rostered',
                ownerTeam: null,
                missing: true
            };
        }

        const roster = rostersWithPlayer[0];
        const isUserOwner = Boolean(
            roster.owner_id === state.userId
            || (Array.isArray(roster.co_owners) && roster.co_owners.includes(state.userId))
        );
        const realOwnerId = isUserOwner ? state.userId : roster.owner_id;
        const owner = usersById.get(realOwnerId) || null;
        const ownerDisplay = owner?.display_name || owner?.username || (isUserOwner ? (state.username || 'You') : `Roster ${roster.roster_id}`);
        const teamName = owner?.metadata?.team_name || null;

        return {
            leagueId: league.league_id,
            leagueName: league.name || 'League',
            leagueAbbr: getLeagueAbbr(league.name || 'League'),
            ownerDisplay,
            ownerTeam: teamName,
            isUser: isUserOwner,
            missing: false
        };
    });
}

function getOwnershipModalPlayerSummary(playerId) {
    const player = state.players?.[playerId];
    if (!player) return null;
    const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase() || '—';
    const team = (player.team || 'FA').toUpperCase();
    const preferredValueData = state.ownershipPreferredKtcMode === 'oneqb'
        ? state.oneQbData?.[playerId]
        : (state.sflxData?.[playerId] || state.oneQbData?.[playerId]);
    const fallbackValueData = state.oneQbData?.[playerId] || state.sflxData?.[playerId] || null;
    const valueData = preferredValueData || fallbackValueData;

    const seasonStats = state.playerSeasonStats?.[playerId] || {};
    const fpts = Number.isFinite(Number(seasonStats.fpts_ppr))
        ? Number(seasonStats.fpts_ppr)
        : (Number.isFinite(Number(seasonStats.fpt_ppr)) ? Number(seasonStats.fpt_ppr) : null);
    const rawPpg = Number.isFinite(Number(seasonStats.ppg)) ? Number(seasonStats.ppg) : null;
    const gamesPlayed = Number.isFinite(Number(seasonStats.games_played)) ? Number(seasonStats.games_played) : null;
    const ppg = Number.isFinite(rawPpg)
        ? rawPpg
        : (Number.isFinite(fpts) && Number.isFinite(gamesPlayed) && gamesPlayed > 0 ? (fpts / gamesPlayed) : null);

    const posRank = Number.isFinite(Number(seasonStats.pos_rank_ppr)) ? Number(seasonStats.pos_rank_ppr) : null;
    const overallRank = Number.isFinite(Number(seasonStats.overall_rank_ppr)) ? Number(seasonStats.overall_rank_ppr) : null;
    const ppgPosRank = Number.isFinite(Number(seasonStats.ppg_pos_rank_ppr)) ? Number(seasonStats.ppg_pos_rank_ppr) : null;
    const ppgOverallRank = Number.isFinite(Number(seasonStats.ppg_rank_ppr)) ? Number(seasonStats.ppg_rank_ppr) : null;

    return {
        playerId,
        pos,
        team,
        fullName: `${(player.first_name || '').trim()} ${(player.last_name || '').trim()}`.trim() || playerId,
        fpts,
        ppg,
        posRank,
        overallRank,
        ppgPosRank,
        ppgOverallRank,
        ktc: Number.isFinite(valueData?.ktc) ? valueData.ktc : null,
        ktcPosRankText: formatPosRankText(pos, valueData?.posRank),
        ktcPosRank: parsePosRankNumber(valueData?.posRank),
        ktcOverallRank: Number.isFinite(valueData?.overallRank) ? valueData.overallRank : null
    };
}

function renderOwnershipModalHeaderSummary(playerId) {
    const summary = getOwnershipModalPlayerSummary(playerId);
    if (!summary || !ownershipModalPlayerName || !ownershipModalSummaryChips) return;

    ownershipModalPlayerName.textContent = summary.fullName;

    // Modal left tags mirror the game-log modal top-left visual context (POS + team).
    if (ownershipModalHeaderLeft) {
        const teamKey = summary.team;
        const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
        const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
        ownershipModalHeaderLeft.innerHTML = `
            <div class="player-tag modal-pos-tag ${summary.pos}" data-pos="${summary.pos}">${summary.pos}</div>
            <div class="player-tag modal-team-logo-chip" data-team="${teamKey}">
                ${teamKey !== 'FA' ? `<img class="team-logo glow" src="../assets/NFL_logos_svg/${normalizedKey}.svg" alt="${teamKey}" width="24" height="24" loading="eager">` : '<span>FA</span>'}
            </div>
        `;
    }

    if (ownershipModalPlayerVitals) {
        ownershipModalPlayerVitals.innerHTML = '';
        ownershipModalPlayerVitals.appendChild(createPlayerVitalsElement(getPlayerVitals(playerId), { variant: 'modal', pos: summary.pos }));
    }

    const fptsColor = getConditionalColorByRank(summary.posRank, summary.pos);
    const ppgColor = getConditionalColorByRank(summary.ppgPosRank, summary.pos);
    const ktcColor = getKtcColor(summary.ktc);

    ownershipModalSummaryChips.innerHTML = `
        <div class="gamelogs-summary-chip ownership-summary-chip">
            <h4><span class="chip-header-value" style="color:${fptsColor}">${Number.isFinite(summary.fpts) ? summary.fpts.toFixed(1) : '—'}</span><span class="chip-unit"> FPTS</span></h4>
            <div class="chip-values">
                <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${fptsColor}">${Number.isFinite(summary.posRank) ? summary.posRank : '—'}</span></span>
                <span class="chip-separator">•</span>
                <span style="color:${getRankColor(summary.overallRank)}">${Number.isFinite(summary.overallRank) ? `#${summary.overallRank}` : '—'}</span>
            </div>
        </div>
        <div class="gamelogs-summary-chip ownership-summary-chip">
            <h4><span class="chip-header-value" style="color:${ppgColor}">${Number.isFinite(summary.ppg) ? summary.ppg.toFixed(1) : '—'}</span><span class="chip-unit"> PPG</span></h4>
            <div class="chip-values">
                <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${ppgColor}">${Number.isFinite(summary.ppgPosRank) ? summary.ppgPosRank : '—'}</span></span>
                <span class="chip-separator">•</span>
                <span style="color:${getRankColor(summary.ppgOverallRank)}">${Number.isFinite(summary.ppgOverallRank) ? `#${summary.ppgOverallRank}` : '—'}</span>
            </div>
        </div>
        <div class="gamelogs-summary-chip ownership-summary-chip">
            <h4><span class="chip-header-value" style="color:${ktcColor}">${Number.isFinite(summary.ktc) ? Math.round(summary.ktc) : '—'}</span><span class="chip-unit"> KTC</span></h4>
            <div class="chip-values">
                <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${getConditionalColorByRank(summary.ktcPosRank, summary.pos)}">${Number.isFinite(summary.ktcPosRank) ? summary.ktcPosRank : '—'}</span></span>
                <span class="chip-separator">•</span>
                <span style="color:${getRankColor(summary.ktcOverallRank)}">${Number.isFinite(summary.ktcOverallRank) ? `#${summary.ktcOverallRank}` : '—'}</span>
            </div>
        </div>
    `;
}

function renderOwnershipModalLeagueOwnerList(playerId) {
    if (!ownershipModalBody) return;

    const rows = findOwnershipLeagueOwnerRows(playerId);
    const failures = Array.isArray(state.ownershipContext?.failures) ? state.ownershipContext.failures : [];

    // Ownership modal body rows mirror the reference branch style:
    // league meta on the left + concise owner value on the right (user's username when owned by current user).
    const currentUsername = (typeof usernameInput?.value === 'string' && usernameInput.value.trim()) || (typeof localStorage !== 'undefined' ? (localStorage.getItem('sleeper_username') || '').trim() : '') || 'You';
    ownershipModalBody.innerHTML = `
        <div class="ownership-modal-league-list">
            ${rows.map((row) => {
                const ownerText = row.missing ? 'Unrostered' : (row.isUser && !row.ownerDisplay.startsWith('Roster ') ? row.ownerDisplay : (row.isUser ? currentUsername : row.ownerDisplay));
                const ownerClass = row.missing ? 'owner-none' : (row.isUser ? 'owner-you' : 'owner-other');
                const abbrColor = getLeagueColor(row.leagueAbbr);
                return `
                    <article class="ownership-league-row ${ownerClass}">
                        <div class="ownership-league-meta">
                            <span class="ownership-league-abbr" style="color:${abbrColor}">${escapeHtml(row.leagueAbbr)}</span>
                            <span class="ownership-league-name">${escapeHtml(row.leagueName)}</span>
                        </div>
                        <div class="ownership-league-owner">
                            ${escapeHtml(ownerText)}
                        </div>
                    </article>
                `;
            }).join('')}
        </div>
        ${failures.length ? `<p class="ownership-modal-warning">Some leagues could not be loaded: ${failures.join(', ')}</p>` : ''}
    `;
}

function openOwnershipPlayerModal(playerId) {
    if ((pageType !== 'ownership' && pageType !== 'rosters' && pageType !== 'stats') || !ownershipPlayerModal || !playerId) return;
    renderOwnershipModalHeaderSummary(playerId);
    renderOwnershipModalLeagueOwnerList(playerId);
    ownershipPlayerModal.classList.remove('hidden');
    ownershipPlayerModal.setAttribute('aria-hidden', 'false');
}

function closeOwnershipPlayerModal() {
    if (!ownershipPlayerModal) return;
    ownershipPlayerModal.classList.add('hidden');
    ownershipPlayerModal.setAttribute('aria-hidden', 'true');
    if (ownershipModalSummaryChips) ownershipModalSummaryChips.innerHTML = '';
    if (ownershipModalBody) ownershipModalBody.innerHTML = '';
    if (ownershipModalHeaderLeft) ownershipModalHeaderLeft.innerHTML = '';
    if (ownershipModalPlayerVitals) ownershipModalPlayerVitals.innerHTML = '';
}

// === Inline Ownership rendering for Game Logs modal tab ===
// Renders ownership header + league list into the #gamelogs-ownership-pane sub-containers.
// This mirrors openOwnershipPlayerModal but writes to the inline pane, not the standalone modal.
function renderOwnershipInGameLogsPane(playerId) {
    const pane = document.getElementById('gamelogs-ownership-pane');
    if (!pane || !playerId) return;

    const nameEl = document.getElementById('glOwnershipPlayerName');
    const leftEl = document.getElementById('glOwnershipLeft');
    const vitalsEl = document.getElementById('glOwnershipPlayerVitals');
    const chipsEl = document.getElementById('glOwnershipSummaryChips');
    const bodyEl = document.getElementById('glOwnershipBody');

    // Render header summary (reuse existing data helper)
    const summary = getOwnershipModalPlayerSummary(playerId);
    if (!summary) {
        if (bodyEl) bodyEl.innerHTML = '<div class="ownership-modal-empty">Player data unavailable.</div>';
        return;
    }

    if (nameEl) nameEl.textContent = summary.fullName;

    // Left tags: POS + team logo
    if (leftEl) {
        const teamKey = summary.team;
        const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
        const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
        leftEl.innerHTML = `
            <div class="player-tag modal-pos-tag ${summary.pos}" data-pos="${summary.pos}">${summary.pos}</div>
            <div class="player-tag modal-team-logo-chip" data-team="${teamKey}">
                ${teamKey !== 'FA' ? `<img class="team-logo glow" src="../assets/NFL_logos_svg/${normalizedKey}.svg" alt="${teamKey}" width="24" height="24" loading="eager">` : '<span>FA</span>'}
            </div>
        `;
    }

    // Vitals row
    if (vitalsEl) {
        vitalsEl.innerHTML = '';
        if (typeof createPlayerVitalsElement === 'function' && typeof getPlayerVitals === 'function') {
            vitalsEl.appendChild(createPlayerVitalsElement(getPlayerVitals(playerId), { variant: 'modal', pos: summary.pos }));
        }
    }

    // Summary chips: FPTS, PPG, KTC
    if (chipsEl) {
        const fptsColor = getConditionalColorByRank(summary.posRank, summary.pos);
        const ppgColor = getConditionalColorByRank(summary.ppgPosRank, summary.pos);
        const ktcColor = getKtcColor(summary.ktc);

        chipsEl.innerHTML = `
            <div class="gamelogs-summary-chip ownership-summary-chip">
                <h4><span class="chip-header-value" style="color:${fptsColor}">${Number.isFinite(summary.fpts) ? summary.fpts.toFixed(1) : '—'}</span><span class="chip-unit"> FPTS</span></h4>
                <div class="chip-values">
                    <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${fptsColor}">${Number.isFinite(summary.posRank) ? summary.posRank : '—'}</span></span>
                    <span class="chip-separator">•</span>
                    <span style="color:${getRankColor(summary.overallRank)}">${Number.isFinite(summary.overallRank) ? `#${summary.overallRank}` : '—'}</span>
                </div>
            </div>
            <div class="gamelogs-summary-chip ownership-summary-chip">
                <h4><span class="chip-header-value" style="color:${ppgColor}">${Number.isFinite(summary.ppg) ? summary.ppg.toFixed(1) : '—'}</span><span class="chip-unit"> PPG</span></h4>
                <div class="chip-values">
                    <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${ppgColor}">${Number.isFinite(summary.ppgPosRank) ? summary.ppgPosRank : '—'}</span></span>
                    <span class="chip-separator">•</span>
                    <span style="color:${getRankColor(summary.ppgOverallRank)}">${Number.isFinite(summary.ppgOverallRank) ? `#${summary.ppgOverallRank}` : '—'}</span>
                </div>
            </div>
            <div class="gamelogs-summary-chip ownership-summary-chip">
                <h4><span class="chip-header-value" style="color:${ktcColor}">${Number.isFinite(summary.ktc) ? Math.round(summary.ktc) : '—'}</span><span class="chip-unit"> KTC</span></h4>
                <div class="chip-values">
                    <span class="pos-rank-container"><span class="chip-pos-rank-label pos-color-${summary.pos}">${summary.pos}·</span><span style="color:${getConditionalColorByRank(summary.ktcPosRank, summary.pos)}">${Number.isFinite(summary.ktcPosRank) ? summary.ktcPosRank : '—'}</span></span>
                    <span class="chip-separator">•</span>
                    <span style="color:${getRankColor(summary.ktcOverallRank)}">${Number.isFinite(summary.ktcOverallRank) ? `#${summary.ktcOverallRank}` : '—'}</span>
                </div>
            </div>
        `;
    }

    // League owner list
    if (bodyEl) {
        if (!hasOwnershipContextLoaded()) {
            bodyEl.innerHTML = '<div class="ownership-modal-empty">Ownership data is loading…</div>';
            return;
        }
        const rows = findOwnershipLeagueOwnerRows(playerId);
        const failures = Array.isArray(state.ownershipContext?.failures) ? state.ownershipContext.failures : [];

        // GL Ownership exposure summary:
        // ownedCount = leagues where the CURRENT USER owns this player (mirrors Ownership page Exposure column).
        // percentage = ownedCount / total leagues (same denominator as buildOwnershipRowsFromContext).
        const ownedCount = rows.filter(r => r.isUser).length;
        const ownershipPct = rows.length > 0 ? Math.round((ownedCount / rows.length) * 100) : 0;
        // tier-0 used for 0-count so it renders muted (matches the label color) instead of tier-1.
        const exposureClass = ownedCount === 0
            ? 'ownership-exposure--tier-0'
            : (typeof getOwnershipExposureTierClassByCount === 'function'
                ? getOwnershipExposureTierClassByCount(ownedCount)
                : 'ownership-exposure--tier-1');

        bodyEl.innerHTML = `
            <div class="gl-ownership-exposure-card">
                <span class="gl-exposure-label">Exposure</span>
                <div class="gl-exposure-values ownership-list-exposure ${exposureClass}">
                    <span class="ownership-exposure-count">${ownedCount}</span>
                    <span class="ownership-exposure-sep" aria-hidden="true">⏐</span>
                    <span class="ownership-exposure-pct">${ownershipPct}%</span>
                </div>
                <span class="gl-exposure-context">owned in ${ownedCount} of ${rows.length} leagues</span>
            </div>
            <div class="ownership-modal-section-title">
                League Ownership
                <span class="ownership-modal-section-subtitle">${rows.length} league${rows.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="ownership-modal-league-list">
                ${rows.map((row) => {
                    const currentUsername = (typeof usernameInput?.value === 'string' && usernameInput.value.trim()) || (typeof localStorage !== 'undefined' ? (localStorage.getItem('sleeper_username') || '').trim() : '') || 'You';
                    const ownerText = row.missing ? 'Unrostered' : (row.isUser && !row.ownerDisplay.startsWith('Roster ') ? row.ownerDisplay : (row.isUser ? currentUsername : row.ownerDisplay));
                    const ownerClass = row.missing ? 'owner-none' : (row.isUser ? 'owner-you' : 'owner-other');
                    const abbrColor = typeof getLeagueColor === 'function' ? getLeagueColor(row.leagueAbbr) : '#cad1fa';
                    return `
                        <article class="ownership-league-row ${ownerClass}">
                            <div class="ownership-league-meta">
                                <span class="ownership-league-abbr" style="color:${abbrColor}">${typeof escapeHtml === 'function' ? escapeHtml(row.leagueAbbr) : row.leagueAbbr}</span>
                                <span class="ownership-league-name">${typeof escapeHtml === 'function' ? escapeHtml(row.leagueName) : row.leagueName}</span>
                            </div>
                            <div class="ownership-league-owner">
                                ${typeof escapeHtml === 'function' ? escapeHtml(ownerText) : ownerText}
                            </div>
                        </article>
                    `;
                }).join('')}
            </div>
            ${failures.length ? `<p class="ownership-modal-warning">Some leagues could not be loaded: ${failures.join(', ')}</p>` : ''}
        `;
    }
}

// === Game Logs Modal Tab Switching ===
// Switches between the Game Logs pane and inline Ownership pane inside #game-logs-modal.
function switchGameLogsModalTab(tabKey) {
    // Block Ownership tab access if no user context exists
    if (tabKey === 'ownership' && !state.userId) {
        const owTabBtn = gameLogsModal?.querySelector('.gamelogs-modal-tab[data-modal-tab="ownership"]');
        if (typeof showTemporaryTooltip === 'function') {
            showTemporaryTooltip(owTabBtn || document.body, 'Please enter a Sleeper username to view Ownership data.');
        } else {
            alert('Please enter a Sleeper username to view Ownership data.');
        }
        return;
    }

    const glPane = document.getElementById('gamelogs-tab-pane');
    const owPane = document.getElementById('gamelogs-ownership-pane');
    const tabBtns = gameLogsModal?.querySelectorAll('.gamelogs-modal-tab');
    if (!glPane || !owPane || !tabBtns) return;

    tabBtns.forEach(btn => {
        const isActive = btn.dataset.modalTab === tabKey;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (tabKey === 'ownership') {
        // Hide game-logs pane, show ownership pane
        glPane.classList.add('hidden');
        owPane.classList.remove('hidden');

        // Render ownership content for the currently open player
        const pid = state.currentGameLogsPlayer?.id || null;
        if (pid) {
            renderOwnershipInGameLogsPane(pid);

            // Game Logs ownership tab: actively load shared ownership data on demand if the
            // background preload has not completed yet, so the tab is reliable on rosters/stats.
            if (!hasOwnershipContextLoaded()) {
                const bodyEl = document.getElementById('glOwnershipBody');

                // Ownership tab loading state:
                // when the user opens the inline ownership pane before shared ownership
                // league data is ready, show a visible loader immediately and then swap
                // in the fully rendered ownership rows as soon as the async load resolves.
                if (bodyEl) {
                    bodyEl.innerHTML = '<div class="ownership-modal-empty">Ownership data is loading…</div>';
                }

                loadOwnershipContextForUser()
                    .then(() => {
                        const activePid = state.currentGameLogsPlayer?.id || null;
                        if (activePid !== pid || owPane.classList.contains('hidden')) return;
                        renderOwnershipInGameLogsPane(pid);
                    })
                    .catch(() => {
                        const activePid = state.currentGameLogsPlayer?.id || null;
                        if (!bodyEl || activePid !== pid || owPane.classList.contains('hidden')) return;
                        bodyEl.innerHTML = '<div class="ownership-modal-empty">Unable to load ownership data right now.</div>';
                    });
            }
        }
    } else {
        // Show game-logs pane, hide ownership pane
        glPane.classList.remove('hidden');
        owPane.classList.add('hidden');
    }
}

// Wire tab click listeners once DOM is ready
(function wireGameLogsModalTabs() {
    if (!gameLogsModal) return;
    const tabs = gameLogsModal.querySelectorAll('.gamelogs-modal-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.modalTab;
            if (key) switchGameLogsModalTab(key);
        });
    });
})();

// --- Formatting Helpers ---
function deriveRookieYear(player) {
    if (!player) return null;
    let ry = player.metadata?.rookie_year ? Number(player.metadata.rookie_year) : 0;
    const exp = player.years_exp;
    const expNum = (exp === '' || exp === null || exp === undefined) ? null : Number(exp);
    if ((!ry || ry === 0) && expNum === 0) {
        return new Date().getFullYear();
    }
    return ry > 0 ? ry : null;
}
function getPosRankColor(posRank) {
    if (!posRank || typeof posRank !== 'string') return 'var(--color-text-secondary)';
    const position = posRank.split('·')[0];
    const colors = {
        QB: '#FFB2D8',
        RB: '#bbf7e0',
        WR: '#A0C2F7',
        TE: '#FFC78A'
    };
    return colors[position] || 'var(--color-text-secondary)';
}
function calculateFantasyPoints(stats, scoringSettings) {
    if (!stats) return 0;
    if (typeof stats.fpts === 'number' && Number.isFinite(stats.fpts)) {
        return stats.fpts;
    }
    if (typeof stats.fpts_override === 'number' && Number.isFinite(stats.fpts_override)) {
        return stats.fpts_override;
    }
    if (!scoringSettings) return 0;
    let totalPoints = 0;
    for (const statKey in stats) {
        if (!Object.prototype.hasOwnProperty.call(stats, statKey)) continue;
        if (statKey === 'fpts_override' || statKey === '__live') continue;
        if (scoringSettings[statKey]) {
            totalPoints += stats[statKey] * scoringSettings[statKey];
        }
    }
    return totalPoints;
}
function formatPercentage(value, decimals = 1) {
    // Preserve trailing zeros exactly as specified by `decimals`
    const fallback = (0).toFixed(decimals) + '%';
    if (value === null || value === undefined || Number.isNaN(value)) return fallback;
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return fallback;
    return numericValue.toFixed(decimals) + '%';
}
function formatRadarStatValue(statKey, value) {
    // Keep preformatted strings as-is so radar text matches summary chips.
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) {
            if ((statKey === 'cpoe' || statKey === 'epa_per_db') && !trimmed.startsWith('-') && !trimmed.startsWith('+')) {
                const numeric = parseFloat(trimmed.replace('%', ''));
                if (Number.isFinite(numeric) && numeric > 0) return `+${trimmed}`;
            }
            return trimmed;
        }
    }

    if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return 'N/A';

    // Percentage stats (1 decimal)
    if (statKey === 'cmp_pct' || statKey === 'snp_pct' || statKey === 'ts_per_rr' ||
        statKey === 'prs_pct' || statKey === 'pass_imp_per_att') {
        return numericValue.toFixed(1) + '%';
    }

    // CPOE is already stored as percentage points in the stats sheets.
    if (statKey === 'cpoe') {
        const formatted = numericValue.toFixed(1) + '%';
        return numericValue > 0 ? `+${formatted}` : formatted;
    }

    // 1DRR uses 2 decimals and is shown as a plain number (not %).
    if (statKey === 'first_down_rec_rate') {
        return numericValue.toFixed(2);
    }

    // FPTS and PPG - always 1 decimal place
    if (statKey === 'fpts' || statKey === 'ppg') {
        return numericValue.toFixed(1);
    }

    // Whole number stats
    if (statKey === 'rec' || statKey === 'rec_tgt') {
        return Math.round(numericValue).toString();
    }
    if (statKey === 'yds_total') {
        return Math.round(numericValue).toString();
    }

    // recYPG - 1 decimal place (matches table formatting)
    if (statKey === 'rec_ypg') {
        return numericValue.toFixed(1);
    }

    // Rating stats (1 decimal)
    if (statKey === 'pass_rtg') {
        return numericValue.toFixed(1);
    }
    if (statKey === 'ttt' || statKey === 'imp_per_g') {
        return numericValue.toFixed(2);
    }

    // EPA/DB: show to 2 decimals (keeps consistency with other efficiency-style metrics)
    if (statKey === 'epa_per_db') {
        const formatted = numericValue.toFixed(2);
        return numericValue > 0 ? `+${formatted}` : formatted;
    }

    // All other stats (2 decimals)
    return numericValue.toFixed(2);
}
function getPlayerVitals(playerId) {
    const fallback = { age: '—', height: '—', weight: '—' };
    const playerData = state.players?.[playerId];
    if (!playerData) return fallback;
    const collect = (...values) => values
        .map(value => (typeof value === 'string' ? value.trim() : value))
        .filter(value => value !== undefined && value !== null && value !== '');
    const parseAge = () => {
        const valueData = state.isSuperflex ? state.sflxData?.[playerId] : state.oneQbData?.[playerId];
        const ageFromSheet = valueData?.age;
        if (typeof ageFromSheet === 'number') {
            return ageFromSheet.toFixed(1);
        }
        const candidates = collect(
            playerData.age,
            playerData.metadata?.age,
            playerData.metadata?.player_age
        );
        for (const candidate of candidates) {
            const numeric = Number.parseInt(candidate, 10);
            if (Number.isFinite(numeric) && numeric > 0) {
                return Number(numeric).toFixed(1);
            }
        }
        if (playerData.birthdate) {
            const birth = new Date(playerData.birthdate);
            if (!Number.isNaN(birth.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const hasHadBirthdayThisYear =
                    today.getMonth() > birth.getMonth() ||
                    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
                if (!hasHadBirthdayThisYear) age -= 1;
                if (Number.isFinite(age) && age > 0 && age < 80) {
                    return Number(age).toFixed(1);
                }
            }
        }
        return null;
    };
    const formatHeightFromParts = (feet, inches) => {
        const f = Number.parseInt(feet, 10);
        const i = Number.parseInt(inches, 10);
        if (!Number.isFinite(f) && !Number.isFinite(i)) return null;
        const safeFeet = Number.isFinite(f) ? f : Math.floor(i / 12);
        const safeInches = Number.isFinite(i) ? i % 12 : 0;
        if (!Number.isFinite(safeFeet) || safeFeet <= 0) return null;
        const boundedInches = Math.max(0, Math.min(11, safeInches));
        return `${safeFeet}'${boundedInches}"`;
    };
    const parseHeightString = (value) => {
        if (value === undefined || value === null) return null;
        const str = String(value).trim();
        if (!str) return null;
        const digits = str.match(/\d+/g);
        if (!digits || digits.length === 0) return null;
        if (digits.length >= 2) {
            return formatHeightFromParts(digits[0], digits[1]);
        }
        const only = Number.parseInt(digits[0], 10);
        if (!Number.isFinite(only) || only <= 0) return null;
        const raw = digits[0];
        if (raw.length >= 3) {
            const feetPart = raw.slice(0, raw.length - 2);
            const inchPart = raw.slice(-2);
            const formattedFromRaw = formatHeightFromParts(feetPart, inchPart);
            if (formattedFromRaw) return formattedFromRaw;
        }
        if (only > 12) {
            const feet = Math.floor(only / 12);
            const inches = only % 12;
            return `${feet}'${inches}"`;
        }
        return `${only}'0"`;
    };
    const parseHeight = () => {
        const pairCandidates = [
            [playerData.height_feet, playerData.height_inches],
            [playerData.metadata?.height_feet, playerData.metadata?.height_inches],
            [playerData.height_ft, playerData.height_in],
            [playerData.metadata?.height_ft, playerData.metadata?.height_in]
        ];
        for (const [feet, inches] of pairCandidates) {
            const formatted = formatHeightFromParts(feet, inches);
            if (formatted) return formatted;
        }
        const heightCandidates = collect(
            playerData.height,
            playerData.metadata?.height,
            playerData.metadata?.player_height,
            playerData.height_inches,
            playerData.height_in,
            playerData.metadata?.height_inches,
            playerData.metadata?.height_in
        );
        for (const candidate of heightCandidates) {
            const formatted = parseHeightString(candidate);
            if (formatted) return formatted;
        }
        return null;
    };
    const parseWeight = () => {
        const weightCandidates = collect(
            playerData.weight,
            playerData.metadata?.weight,
            playerData.metadata?.player_weight,
            playerData.weight_lbs,
            playerData.metadata?.weight_lbs
        );
        for (const candidate of weightCandidates) {
            const numeric = Number.parseInt(candidate, 10);
            if (Number.isFinite(numeric) && numeric > 0) {
                return `${numeric} lbs`;
            }
        }
        return null;
    };
    const parseYearsExperience = () => {
        const exp = playerData.years_exp;
        if (exp === null || exp === undefined) return '—';
        return String(exp);
    };
    const parseRookieYear = () => {
        const rookieYear = playerData.rookie_year;
        if (rookieYear && rookieYear !== '0') {
            return String(rookieYear);
        }
        const exp = playerData.years_exp;
        if (exp !== null && exp !== undefined) {
            return String(2025 - Number(exp));
        }
        return '—';
    };
    return {
        age: parseAge() ?? '—',
        height: parseHeight() ?? '—',
        weight: parseWeight() ?? '—',
        exp: parseYearsExperience(),
        ry: parseRookieYear()
    };
}
function createPlayerVitalsElement(vitals, { variant = 'modal', pos = '' } = {}) {
    const container = document.createElement('div');
    container.className = `player-vitals player-vitals--${variant}`;
    const items = [
        { label: 'AGE', value: vitals.age },
        { label: 'HEIGHT', value: vitals.height },
        { label: 'WEIGHT', value: vitals.weight },
        { label: 'EXP', value: vitals.exp },
        { label: 'RY', value: vitals.ry }
    ];
    items.forEach(({ label, value }) => {
        const item = document.createElement('div');
        item.className = 'player-vitals__item';
        const labelEl = document.createElement('span');
        labelEl.className = 'player-vitals__label';
        labelEl.textContent = label;
        const valueEl = document.createElement('span');
        valueEl.className = 'player-vitals__value';
        valueEl.textContent = value;
        // apply conditional color for AGE, HEIGHT, WEIGHT based on position
        if (label === 'AGE' || label === 'HEIGHT' || label === 'WEIGHT') {
            const color = getVitalsColor(label, pos, value);
            if (color) valueEl.style.color = color;
        }
        item.appendChild(labelEl);
        item.appendChild(valueEl);
        container.appendChild(item);
    });
    return container;
}
function getRankColor(rank) {
    if (typeof rank !== 'number') return 'var(--color-text-primary)';
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
    for (const t of thresholds) {
        if (rank <= t.v) return t.c;
    }
    if (rank > 250 && rank < 300) return '#ff0080';
    if (rank >= 300) return '#656565';
    return 'var(--color-text-secondary)';
}
function getConditionalColorByRank(rank, position) {
    if (typeof rank !== 'number' || rank <= 0) return 'inherit';
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
    const thresholds = normalizedPos === 'WR'
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

function getSznStatRankColor(rank, position) {
    if (typeof rank !== 'number' || rank <= 0) return 'inherit';
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
    
     
    // Creative/Neon Palette per user request 
    // WRs & Non-WRs have different thresholds but same colors.
    
    const thresholds = normalizedPos === 'WR'
        ? [
            { v: 12, c: '#00FFFFB5' }, // Neon Teal
            { v: 24, c: '#1b7affec' }, // Neon Cyan
            { v: 36, c: '#3300ff' }, // Neon Purple
            { v: 48, c: '#5700FF' }, // Neon Pink
            { v: 60, c: '#8732ff' }, // Deep Rose (Requested)
            { v: 72, c: '#ea08ff' }, // Bright Red (Requested)
        ]
        : [
            { v: 8, c: '#00FFFFB5' },
            { v: 16, c: '#1b7affec' },
            { v: 24, c: '#3300ff' },
            { v: 32, c: '#5700FF' },
            { v: 40, c: '#8732ff' },
            { v: 50, c: '#ea08ff' },
        ];

    for (const threshold of thresholds) {
        if (rank <= threshold.v) return threshold.c;
    }
    // Worst tier
    return '#63616c'; // Deep Violet (Requested)
}
const __projectionRankCache = new Map();
function getProjectionRankForValue(position, projectionValue) {
    const numericProjection = Number.parseFloat(projectionValue);
    if (!Number.isFinite(numericProjection) || numericProjection < 0) {
        return null;
    }
    const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
    if (!normalizedPos) {
        return null;
    }
    const calcCache = state.calculatedRankCache;
    if (!calcCache || !calcCache.players) {
        return null;
    }
    const leagueKey = state.currentLeagueId || 'global';
    const cacheKey = `${leagueKey}|${normalizedPos}`;
    let cachedEntry = __projectionRankCache.get(cacheKey);
    if (!cachedEntry || cachedEntry.version !== calcCache) {
        const values = [];
        for (const [playerId, ranks] of Object.entries(calcCache.players)) {
            if (!ranks) continue;
            const rosterPlayer = state.players?.[playerId];
            const playerPos = (rosterPlayer?.position || '').toUpperCase();
            if (playerPos !== normalizedPos) continue;
            const ppgValue = Number.parseFloat(ranks.ppg);
            if (!Number.isFinite(ppgValue)) continue;
            values.push(ppgValue);
        }
        values.sort((a, b) => b - a);
        cachedEntry = { values, version: calcCache };
        __projectionRankCache.set(cacheKey, cachedEntry);
    }
    const ppgValues = cachedEntry.values;
    if (!ppgValues || ppgValues.length === 0) {
        return null;
    }
    const index = ppgValues.findIndex(ppg => numericProjection >= ppg);
    if (index === -1) {
        return ppgValues.length;
    }
    return index + 1;
}
function getProjectionColorForValue(position, projectionValue) {
    const rank = getProjectionRankForValue(position, projectionValue);
    if (!Number.isFinite(rank)) {
        return null;
    }
    return getConditionalColorByRank(rank, position);
}
function getKtcColor(v) {
    const s = [
        { v: 9e3, c: "#72edd0B3" },
        { v: 8e3, c: "#58d5ceB3" },
        { v: 7e3, c: "#5bdae8B3" },
        { v: 6e3, c: "#6eb4ebB3" },
        { v: 5500, c: "#62a5f9B3" },
        { v: 5e3, c: "#848bffB3" },
        { v: 4500, c: "#7b63ffB3" },
        { v: 4e3, c: "#964effB3" },
        { v: 3500, c: "#c449f9B3" },
        { v: 3e3, c: "#ee42ffB3" },
        { v: 2500, c: "#d13eb8B3" },
        { v: 2e3, c: "#d032aaB3" },
        { v: 0, c: "#f94ea4B3" }
    ];
    if (v === null || v === 0) return "#e0e6ed";
    for (const t of s) {
        if (v >= t.v) return t.c;
    }
    return s[s.length - 1].c;
}
// --- Vitals conditional coloring helpers (robust parsing) ---
function parseHeightToInches(heightStr) {
    if (!heightStr && heightStr !== 0) return null;
    const s = String(heightStr).trim();
    if (!s) return null;
    // Normalize common unicode primes/apostrophes and separators
    const norm = s.replace(/[’‘]/g, "'").replace(/[‐–—−]/g, '-').replace(/\s+ft\b/gi, "'").replace(/\s*in\b/gi, '');
    // Patterns like 6'1" or 6' 1 or 6-1 or 6 1
    let m = norm.match(/^(\d{1,2})\s*(?:'|-)\s*(\d{1,2})\s*(?:\"?)$/);
    if (m) {
        const feet = parseInt(m[1], 10);
        const inches = parseInt(m[2], 10);
        if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
    }
    // Patterns like 6' or 6 (no inches) -> interpret as feet
    m = norm.match(/^(\d{1,2})\s*(?:'|ft)?\s*$/i);
    if (m) {
        const feet = parseInt(m[1], 10);
        if (Number.isFinite(feet)) return feet * 12;
    }
    // Patterns like 601 or 605 -> interpret as feet+inches if 3 digits
    const digits = norm.match(/\d+/g) || [];
    if (digits.length === 1) {
        const raw = digits[0];
        if (raw.length === 3) {
            const feet = parseInt(raw.slice(0, 1), 10);
            const inches = parseInt(raw.slice(1), 10);
            if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
        }
        // If a plain number and > 50 and < 90, treat as inches
        const num = parseInt(raw, 10);
        if (num >= 50 && num <= 90) return num;
    }
    // If two numbers separated (e.g., "6 1")
    if (digits.length >= 2) {
        const feet = parseInt(digits[0], 10);
        const inches = parseInt(digits[1], 10);
        if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
    }
    return null;
}
function parseWeightToLbs(weightStr) {
    if (!weightStr && weightStr !== 0) return null;
    const s = String(weightStr);
    // look for number followed by lb or lbs
    let m = s.match(/(\d{2,3})\s*(?:lbs?|lb)?/i);
    if (m) return parseInt(m[1], 10);
    // fallback: first 2-3 digit number
    m = s.match(/(\d{2,3})/);
    if (m) return parseInt(m[1], 10);
    return null;
}
function parseAgeValue(ageStr) {
    if (!ageStr && ageStr !== 0) return null;
    const s = String(ageStr).trim();
    if (!s) return null;
    // Accept decimals
    const m = s.match(/\d+(?:\.\d+)?/);
    if (!m) return null;
    const n = Number(m[0]);
    return Number.isFinite(n) ? n : null;
}
// Use the stronger color palette you suggested for height/weight
const HEIGHT_WEIGHT_COLORS = {
    low: '#F7A3EBDF',
    mid: '#84b8fbff',
    high: '#96F2CEB9'
};
function getVitalsColor(label, pos, rawValue) {
    const position = (pos || '').toUpperCase();
    if (!rawValue) return null;
    if (label === 'AGE') {
        const age = parseAgeValue(rawValue);
        if (age === null) return null;
        if (position === 'WR') {
            if (age < 26) return '#96F2CEB9';
            if (age >= 26 && age < 29) return '#84B8FBFF';
            if (age >= 29 && age < 31) return '#AB8BF5FF';
            if (age >= 31) return '#F7A3EBDF';
        }
        if (position === 'RB') {
            if (age <= 24) return '#96F2CEB9';
            if (age > 24 && age < 25) return '#84B8FBFF';
            if (age >= 25 && age < 28) return '#AB8BF5FF';
            if (age >= 28) return '#F7A3EBDF';
        }
        if (position === 'TE') {
            if (age < 26) return '#96F2CEB9';
            if (age >= 26 && age < 29.5) return '#84B8FBFF';
            if (age >= 29.5 && age < 32) return '#AB8BF5FF';
            if (age >= 32) return '#F7A3EBDF';
        }
        if (position === 'QB') {
            if (age < 28.5) return '#96F2CEB9';
            if (age >= 28.5 && age < 33) return '#84B8FBFF';
            if (age >= 33 && age < 41) return '#AB8BF5FF';
            if (age >= 41) return '#F7A3EBDF';
        }
        return null;
    }
    if (label === 'WEIGHT') {
        const w = parseWeightToLbs(rawValue);
        if (w === null) return null;
        if (position === 'QB') {
            if (w < 210) return HEIGHT_WEIGHT_COLORS.low;
            if (w >= 210 && w <= 250) return HEIGHT_WEIGHT_COLORS.mid;
            if (w > 250) return HEIGHT_WEIGHT_COLORS.low;
        }
        if (position === 'RB') {
            if (w < 190) return HEIGHT_WEIGHT_COLORS.low;
            if (w >= 190 && w < 200) return HEIGHT_WEIGHT_COLORS.mid;
            if (w >= 200) return HEIGHT_WEIGHT_COLORS.high;
        }
        if (position === 'TE') {
            if (w < 230) return HEIGHT_WEIGHT_COLORS.low;
            if (w >= 230 && w < 240) return HEIGHT_WEIGHT_COLORS.mid;
            if (w >= 240) return HEIGHT_WEIGHT_COLORS.high;
        }
        if (position === 'WR') {
            if (w < 190) return HEIGHT_WEIGHT_COLORS.low;
            if (w >= 190 && w <= 200) return HEIGHT_WEIGHT_COLORS.mid;
            if (w >= 200 && w <= 234) return HEIGHT_WEIGHT_COLORS.high;
            if (w >= 235) return HEIGHT_WEIGHT_COLORS.low;
        }
        return null;
    }
    if (label === 'HEIGHT') {
        const inches = parseHeightToInches(rawValue);
        if (inches === null) return null;
        if (position === 'QB') {
            if (inches < 72) return HEIGHT_WEIGHT_COLORS.low;
            if (inches >= 72 && inches <= 73) return HEIGHT_WEIGHT_COLORS.mid;
            if (inches > 73) return HEIGHT_WEIGHT_COLORS.high;
        }
        if (position === 'RB') {
            if (inches >= 75) return HEIGHT_WEIGHT_COLORS.low; // >=6'3"
            if (inches > 69 && inches < 75) return HEIGHT_WEIGHT_COLORS.high; // >5'9 and <6'3
            if (inches >= 67 && inches <= 69) return HEIGHT_WEIGHT_COLORS.mid; // 5'7 - 5'9
            if (inches < 67) return HEIGHT_WEIGHT_COLORS.low;
        }
        if (position === 'TE') {
            if (inches > 74) return HEIGHT_WEIGHT_COLORS.high; // >6'2
            if (inches >= 73 && inches <= 74) return HEIGHT_WEIGHT_COLORS.mid; // 6'1 - 6'2
            if (inches < 73) return HEIGHT_WEIGHT_COLORS.low;
        }
        if (position === 'WR') {
            if (inches < 71) return HEIGHT_WEIGHT_COLORS.low; // <5'11
            if (inches >= 71 && inches <= 72) return HEIGHT_WEIGHT_COLORS.mid; // 5'11 - 6'0
            if (inches > 72) return HEIGHT_WEIGHT_COLORS.high;
        }
        return null;
    }
    return null;
}
function getAdpColorForRoster(a) { const s = [{ v: 12, c: "#00EEB6" }, { v: 24, c: "#14D7CB" }, { v: 36, c: "#0599AA" }, { v: 48, c: "#03a8ce" }, { v: 60, c: "#0690DC" }, { v: 72, c: "#066CDC" }, { v: 84, c: "#1350fd" }, { v: 96, c: "#5e41ff" }, { v: 108, c: "#7158ff" }, { v: 120, c: "#964eff" }, { v: 144, c: "#9200ff" }, { v: 168, c: "#b70fff" }, { v: 192, c: "#ba00cc" }, { v: 216, c: "#e800ff" }, { v: 240, c: "#db00af" }, { v: 280, c: "#c70097" }, { v: 320, c: "#FF0080" }]; if (!a || a === 0) return null; for (const t of s) if (a <= t.v) return t.c; return s[s.length - 1].c }
function getAgeColorForRoster(p, a) { const s = { wrTe: [{ v: 22.5, c: "#00ffc4" }, { v: 25, c: "#85fff3" }, { v: 26, c: "#56dfe8" }, { v: 27, c: "#7dd1ff" }, { v: 29, c: "#89a3ff" }, { v: 30, c: "#957cff" }, { v: 31, c: "#a642ff" }, { v: 32, c: "#cf60ff" }, { v: 33, c: "#ff6fe1" }], rb: [{ v: 22.5, c: "#00ffc4" }, { v: 24, c: "#85fff3" }, { v: 25, c: "#56dfe8" }, { v: 26, c: "#7dd1ff" }, { v: 27, c: "#89a3ff" }, { v: 28, c: "#957cff" }, { v: 29, c: "#a642ff" }, { v: 30, c: "#cf60ff" }, { v: 31, c: "#ff6fe1" }], qb: [{ v: 25.5, c: "#00ffc4" }, { v: 28, c: "#85fff3" }, { v: 29, c: "#7dd1ff" }, { v: 31, c: "#48a6ff" }, { v: 33, c: "#957cff" }, { v: 36, c: "#a642ff" }, { v: 40, c: "#cf60ff" }, { v: 44, c: "#ff6fe1" }] }; let sc = p === "WR" || p === "TE" ? s.wrTe : p === "RB" ? s.rb : p === "QB" ? s.qb : null; if (!sc || !a || a === 0) return null; for (const t of sc) if (a <= t.v) return t.c; return sc[sc.length - 1].c }
function getLeagueAbbr(name) {
    if (!name) return "LG";
    const trimmed = name.trim(); const normalized = trimmed.toLowerCase().replace(/[.,()]/g, '');
    if (LEAGUE_ABBR_OVERRIDES[normalized]) return LEAGUE_ABBR_OVERRIDES[normalized];
    if (trimmed.length <= 4 && !trimmed.includes(' ') && !trimmed.includes('-')) return trimmed.toUpperCase();
    const words = trimmed.split(/[\s-]+/);
    let abbr = words.map(w => w[0] || '').join('');
    return abbr.toUpperCase();
}
function getLeagueColor(abbr) { if (!assignedLeagueColors.has(abbr)) { assignedLeagueColors.set(abbr, LEAGUE_COLOR_PALETTE[nextColorIndex % LEAGUE_COLOR_PALETTE.length]); nextColorIndex++; } return assignedLeagueColors.get(abbr); }
function getRyColor(year) { if (!assignedRyColors.has(year)) { assignedRyColors.set(year, RY_COLOR_PALETTE[nextRyColorIndex % RY_COLOR_PALETTE.length]); nextRyColorIndex++; } return assignedRyColors.get(year); }
function ordinalSuffix(i) { const j = i % 10, k = i % 100; if (j === 1 && k !== 11) return i + 'st'; if (j === 2 && k !== 12) return i + 'nd'; if (j === 3 && k !== 13) return i + 'rd'; return i + 'th'; }
if (pageType === 'ownership') {
    try { window.closeOwnershipPlayerModal = closeOwnershipPlayerModal; } catch (e) { }
}
// --- Utility Functions ---
function adjustStickyHeaders() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;
    const headerHeight = headerContainer.offsetHeight;
    const rootStyles = getComputedStyle(document.documentElement);
    // The gap is controlled via the --roster-header-gap custom property so designers can fine-tune spacing without
    // touching the JavaScript. Update the value in styles.css to move the sticky team headers closer to or farther
    // from the global header.
    const rosterGapRaw = rootStyles.getPropertyValue('--roster-header-gap');
    const rosterGap = Number.parseFloat(rosterGapRaw) || 0;
    const stickyOffset = Math.max(headerHeight - rosterGap, 0);
    const teamHeaders = document.querySelectorAll('.team-header-item');
    teamHeaders.forEach(header => {
        header.style.top = `${stickyOffset}px`;
    });
    const isRosterPage = document.body?.dataset?.page === 'rosters';
    if (isRosterPage) {
        document.documentElement.style.setProperty('--roster-header-height', `${headerHeight}px`);
    } else {
        document.documentElement.style.removeProperty('--roster-header-height');
    }
}
window.addEventListener('resize', adjustStickyHeaders);
let rosterHeaderBaseLeft = null;
let rosterHeaderBaseViewportWidth = null;
function syncRosterHeaderPosition() {
    const header = document.getElementById('header-container');
    if (!header) return;
    const isRosterPage = document.body?.dataset?.page === 'rosters';
    if (!isRosterPage) {
        rosterHeaderBaseLeft = null;
        rosterHeaderBaseViewportWidth = null;
        if (header.style.transform) {
            header.style.transform = '';
        }
        return;
    }

    // On the rosters page (mobile especially), the body can be horizontally scrollable.
    // Keep the global header visually locked in place on horizontal scroll without changing layout/styles.
    // Measure the header position *without* our own transform applied, then apply a counter-translate.
    header.style.transform = '';
    const rect = header.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    if (rosterHeaderBaseLeft === null || rosterHeaderBaseViewportWidth !== viewportWidth) {
        rosterHeaderBaseLeft = rect.left;
        rosterHeaderBaseViewportWidth = viewportWidth;
    }
    const dx = rosterHeaderBaseLeft - rect.left;
    header.style.transform = Math.abs(dx) > 0.5 ? `translateX(${Math.round(dx)}px)` : '';
}
function syncRosterHeaderDividerPosition() {
    const isRosterPage = document.body?.dataset?.page === 'rosters';
    const appHeader = document.querySelector('#header-container .app-header');
    const desktopUsernameArea = document.querySelector('#secondary-header-row .username-area');
    const desktopSearchBar = document.getElementById('rosterInlineSearch');
    if (!isRosterPage || !appHeader) return;

    const usernameVisible = Boolean(
        desktopUsernameArea
        && desktopUsernameArea.getClientRects().length
        && getComputedStyle(desktopUsernameArea).display !== 'none'
    );
    const searchVisible = Boolean(
        desktopSearchBar
        && desktopSearchBar.getClientRects().length
        && getComputedStyle(desktopSearchBar).display !== 'none'
    );
    const shouldShowDivider = Boolean(
        rosterHeaderDividerQuery?.matches
        && window.innerWidth > 1100
        && usernameVisible
        && searchVisible
        && !appHeader.classList.contains('preview-active')
    );

    // Rosters desktop header divider: measure the actual username/search gap so the separator
    // stays centered when the two-panel desktop header is visible, and turns off once the
    // compact 820–1100px desktop layout removes the left-hand brand/username section.
    if (!shouldShowDivider) {
        appHeader.style.setProperty('--roster-divider-opacity', '0');
        appHeader.style.removeProperty('--roster-divider-x');
        return;
    }

    const headerRect = appHeader.getBoundingClientRect();
    const usernameRect = desktopUsernameArea.getBoundingClientRect();
    const searchRect = desktopSearchBar.getBoundingClientRect();
    const dividerX = ((usernameRect.right + searchRect.left) / 2) - headerRect.left;
    appHeader.style.setProperty('--roster-divider-x', `${dividerX}px`);
    appHeader.style.setProperty('--roster-divider-opacity', '1');
}
// Roster header horizontal-sync listeners are only needed on rosters page.
// Keeping them page-scoped avoids extra scroll work on stats/ownership/research pages.
if (pageType === 'rosters') {
    // rAF-deduplicated scroll handler: syncRosterHeaderPosition reads getBoundingClientRect() and
    // writes a CSS transform. Capping at one call per animation frame (≤16ms) prevents repeated
    // forced layouts on every scroll tick while keeping the header visually locked.
    let _syncRosterHeaderRafId = null;
    window.addEventListener('scroll', () => {
        if (_syncRosterHeaderRafId) return;
        _syncRosterHeaderRafId = requestAnimationFrame(() => {
            _syncRosterHeaderRafId = null;
            syncRosterHeaderPosition();
        });
    }, { passive: true });
    window.addEventListener('load', syncRosterHeaderDividerPosition);
    window.addEventListener('resize', syncRosterHeaderPosition);
    window.addEventListener('resize', syncRosterHeaderDividerPosition);
    if (typeof rosterHeaderDividerQuery?.addEventListener === 'function') {
        rosterHeaderDividerQuery.addEventListener('change', syncRosterHeaderDividerPosition);
    } else if (typeof rosterHeaderDividerQuery?.addListener === 'function') {
        rosterHeaderDividerQuery.addListener(syncRosterHeaderDividerPosition);
    }
    try {
        document.fonts?.ready?.then(() => syncRosterHeaderDividerPosition());
    } catch (e) { }
    syncRosterHeaderPosition();
    syncRosterHeaderDividerPosition();
}
function showTemporaryTooltip(element, message) {
    const anchor = element || document.body;
    document.querySelectorAll('.custom-tooltip').forEach(node => node.remove());
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);
    const rect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportLeft = window.scrollX + 8;
    const viewportRight = window.scrollX + document.documentElement.clientWidth - 8;
    let left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;
    if (left < viewportLeft) left = viewportLeft;
    if (left + tooltipRect.width > viewportRight) {
        left = Math.max(viewportLeft, viewportRight - tooltipRect.width);
    }
    const top = rect.bottom + window.scrollY + 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    requestAnimationFrame(() => tooltip.classList.add('is-visible'));
    setTimeout(() => tooltip.classList.add('is-hiding'), 2000);
    setTimeout(() => tooltip.remove(), 2400);
}
function setGameLogsCareerPlaceholderActive(isActive) {
    // Rosters Game Logs modal Career view:
    // keeps the Career button's active/pressed state in sync with the swappable table view.
    state.isGameLogsCareerPlaceholderActive = Boolean(isActive);
    if (gameLogsCareerButton) {
        gameLogsCareerButton.classList.toggle('is-active', state.isGameLogsCareerPlaceholderActive);
        gameLogsCareerButton.setAttribute('aria-pressed', state.isGameLogsCareerPlaceholderActive ? 'true' : 'false');
    }
}
function closeGameLogsSeasonMenu() {
    // Rosters Game Logs modal season dropdown:
    // hides the custom menu and restores the collapsed aria state after selection/outside clicks.
    if (gameLogsSeasonMenu) {
        gameLogsSeasonMenu.classList.add('hidden');
    }
    if (gameLogsSeasonToggle) {
        gameLogsSeasonToggle.setAttribute('aria-expanded', 'false');
    }
}
function toggleGameLogsSeasonMenu() {
    // Rosters Game Logs modal season dropdown:
    // opens the styled season list in-place so the menu appearance is controlled by CSS.
    if (!gameLogsSeasonMenu || !gameLogsSeasonToggle) return;
    const shouldOpen = gameLogsSeasonMenu.classList.contains('hidden');
    gameLogsSeasonMenu.classList.toggle('hidden', !shouldOpen);
    gameLogsSeasonToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}
function setGameLogsSelectedSeason(season, { resetCareer = true } = {}) {
    // Rosters Game Logs modal season dropdown:
    // stores the chosen season so the upcoming season/career data wiring has one source of truth.
    const normalizedSeason = season === '2026' ? '2026' : '2025';
    state.currentGameLogsSeason = normalizedSeason;
    if (gameLogsSeasonLabel) {
        gameLogsSeasonLabel.textContent = normalizedSeason;
    }
    if (gameLogsSeasonMenu) {
        gameLogsSeasonMenu.querySelectorAll('[data-gamelogs-season-value]').forEach((option) => {
            const isSelected = option.dataset.gamelogsSeasonValue === normalizedSeason;
            option.classList.toggle('is-selected', isSelected);
            option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
    }
    if (resetCareer) {
        if (state.currentGameLogsView === 'career') {
            setGameLogsModalView('gl');
        } else {
            setGameLogsCareerPlaceholderActive(false);
        }
    }
}
function setGameLogsModalView(view) {
    // Game Logs modal view switcher:
    // treats Career as a true third table mode while preserving the existing
    // GameLog/SZN behavior and footer overlay reset flow.
    const normalizedView = view === 'career' ? 'career' : (view === 'szn' ? 'szn' : 'gl');
    try {
        const viewButtons = gameLogsModal?.querySelectorAll?.('.gamelogs-view-option');
        if (viewButtons && viewButtons.length) {
            viewButtons.forEach((btn) => {
                const isActive = btn.dataset.gamelogsView === normalizedView;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }
        if (modalBody) {
            const glNodes = modalBody.querySelectorAll('.game-logs-table-container, .no-logs[data-gamelogs-view="gl"]');
            glNodes.forEach((node) => node.classList.toggle('hidden', normalizedView !== 'gl'));
            const sznNode = modalBody.querySelector('.game-logs-szn-view');
            if (sznNode) sznNode.classList.toggle('hidden', normalizedView !== 'szn');
            const careerNode = modalBody.querySelector('.game-logs-career-view');
            if (careerNode) careerNode.classList.toggle('hidden', normalizedView !== 'career');
        }
        statsKeyContainer?.classList.add('hidden');
        radarChartContainer?.classList.add('hidden');
        consistencyContainer?.classList.add('hidden');
        const modalInfoBtns = document.querySelectorAll('#game-logs-modal .modal-info-btn');
        if (modalInfoBtns && modalInfoBtns.length) {
            modalInfoBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-panel') === 'game-logs') {
                    btn.classList.add('active');
                }
            });
        }
        setGameLogsCareerPlaceholderActive(normalizedView === 'career');
        state.currentGameLogsView = normalizedView;
    } catch (e) {
        // fail safely – view toggling is non-critical
    }
}
function openModal() {
    gameLogsModal.classList.remove('hidden');
    modalBody.classList.remove('hidden'); // Ensure game logs table is visible
    statsKeyContainer.classList.add('hidden');
    if (radarChartContainer) radarChartContainer.classList.add('hidden');
    if (consistencyContainer) consistencyContainer.classList.add('hidden');
    setGameLogsSelectedSeason(state.currentGameLogsSeason || '2025');
    setGameLogsModalView('gl');

    // Always reset to Game Logs tab when opening the modal
    switchGameLogsModalTab('gamelogs');

    // Reset all buttons to inactive, then activate game-logs button
    const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
    modalInfoBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-panel') === 'game-logs') {
            btn.classList.add('active');
        }
    });
}
function closeModal() {
    gameLogsModalRequestSeq += 1;
    if (gameLogsModal) {
        gameLogsModal.classList.remove('loading');
        gameLogsModal.querySelector('.game-logs-loading-container')?.remove();
    }
    if (modalBody) {
        modalBody.classList.remove('loading');
    }
    gameLogsModal.classList.add('hidden');
    statsKeyContainer.classList.add('hidden');
    if (radarChartContainer) radarChartContainer.classList.add('hidden');
    if (consistencyContainer) consistencyContainer.classList.add('hidden');

    // Reset all button active states
    const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
    modalInfoBtns.forEach(btn => btn.classList.remove('active'));

    // Destroy radar chart instance on modal close to avoid memory leaks.
    const radarContainer = document.querySelector('#radar-chart-container .radar-chart-content');
    if (radarContainer && radarContainer._chartInstance) {
        radarContainer._chartInstance.destroy();
        radarContainer.innerHTML = '';
        radarContainer._chartInstance = null;
    }

    // Clean up consistency chart SVG
    if (curveSvg) {
        curveSvg = null;
    }
    const pointsLayer = document.getElementById('weekly-chart-points');
    if (pointsLayer) {
        pointsLayer.innerHTML = '';
    }

    // Clear current player reference
    state.currentGameLogsPlayer = null;
    state.currentGameLogsPlayerRanks = null;
    state.currentGameLogsSummary = null;

    if (!state.isGameLogModalOpenFromComparison) {
        closeComparisonModal();
    } else {
        gameLogsModal.style.zIndex = ''; // Reset z-index
    }
    // Reset the flag
    state.isGameLogModalOpenFromComparison = false;

    // Clear inline ownership pane content (tab system cleanup)
    const glOwnershipBody = document.getElementById('glOwnershipBody');
    const glOwnershipChips = document.getElementById('glOwnershipSummaryChips');
    const glOwnershipLeft = document.getElementById('glOwnershipLeft');
    const glOwnershipVitals = document.getElementById('glOwnershipPlayerVitals');
    if (glOwnershipBody) glOwnershipBody.innerHTML = '';
    if (glOwnershipChips) glOwnershipChips.innerHTML = '';
    if (glOwnershipLeft) glOwnershipLeft.innerHTML = '';
    if (glOwnershipVitals) glOwnershipVitals.innerHTML = '';
}

// === Watchlist Toggle Handler (inside game-logs modal) ===
// Toggles the current player on/off the watchlist.
// Default (not watchlisted): user-plus icon | Toggled (watchlisted): user-check icon
if (watchlistModalToggle) {
    watchlistModalToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = watchlistModalToggle.dataset.playerId;
        if (!pid) return;

        const wasOnList = isInWatchlist(pid);
        if (wasOnList) {
            removeFromWatchlist(pid);
        } else {
            addToWatchlist(pid);
        }

        // Update toggle appearance with user-plus / user-check icons
        const nowOnList = !wasOnList;
        watchlistModalToggle.classList.toggle('is-watchlisted', nowOnList);
        watchlistModalToggle.innerHTML = nowOnList
            ? '<i class="fa-solid fa-user-check"></i>'
            : '<i class="fa-solid fa-user-plus"></i>';
        watchlistModalToggle.title = nowOnList ? 'Remove from Watchlist' : 'Add to Watchlist';

        // Brief pulse animation for visual feedback
        watchlistModalToggle.classList.add('wl-toggle-pulse');
        setTimeout(() => watchlistModalToggle.classList.remove('wl-toggle-pulse'), 350);
    });
}

// === Watchlist Modal ===
// Full-screen modal displaying all watchlisted players as a 2-column card grid.
// Supports position filtering, per-card actions (game logs, locate on roster, ownership),
// and lazy-loads ownership context on first ownership button tap.

function openWatchlistModal() {
    if (!watchlistModal) return;
    renderWatchlistCards('ALL');
    watchlistModal.classList.remove('hidden');
    watchlistModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('watchlist-modal-open');

    // Activate the "ALL" filter chip by default
    const chips = watchlistModal.querySelectorAll('.watchlist-filter-btn[data-watchlist-pos]');
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.watchlistPos === 'ALL'));
}

function closeWatchlistModal() {
    if (!watchlistModal) return;
    watchlistModal.classList.add('hidden');
    watchlistModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('watchlist-modal-open');
}

/**
 * Render the watchlist card grid.
 * @param {string} posFilter - 'ALL', 'QB', 'RB', 'WR', or 'TE'
 */
function renderWatchlistCards(posFilter) {
    if (!watchlistModalBody) return;

    const pids = [...state.watchlist];
    if (pids.length === 0) {
        watchlistModalBody.innerHTML = `
            <div class="watchlist-empty">
                <i class="fa-regular fa-bookmark"></i>
                <p>No players on your watchlist yet.</p>
                <span>Tap the <i class="fa-solid fa-user-plus"></i> icon in any player's Game Logs to add them.</span>
            </div>`;
        return;
    }

    // Build enriched player data for all watchlisted IDs
    const cards = pids.map(pid => {
        const player = state.players?.[pid];
        if (!player) return null;
        const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase();
        const team = (player.team || 'FA').toUpperCase();
        const first = (player.first_name || '').trim();
        const last = (player.last_name || '').trim();
        const fullName = `${first} ${last}`.trim() || pid;

        // Truncate name after 14 characters with ".." (no ellipsis)
        const truncatedName = fullName.length > 14 ? fullName.slice(0, 14) + '..' : fullName;

        // Value data (superflex preference follows page setting)
        const valueData = state.isSuperflex
            ? (state.sflxData?.[pid] || state.oneQbData?.[pid])
            : (state.oneQbData?.[pid] || state.sflxData?.[pid]);
        const ktc = Number.isFinite(valueData?.ktc) ? Math.round(valueData.ktc) : null;
        const posRankText = valueData?.posRank || null;

        // KTC positional rank number (for rank display like rosters page)
        const ktcPosRankMatch = typeof posRankText === 'string' ? posRankText.match(/(\d+)/) : null;
        const ktcPosRankNumber = ktcPosRankMatch ? Number.parseInt(ktcPosRankMatch[1], 10) : null;

        // Season stats
        const seasonStats = state.playerSeasonStats?.[pid] || {};
        const ppg = Number.isFinite(Number(seasonStats.ppg)) ? Number(seasonStats.ppg) : null;

        // Age: prefer KTC sheet age, fall back to Sleeper player.age
        const sflxAge = state.sflxData?.[pid]?.age;
        const oneQbAge = state.oneQbData?.[pid]?.age;
        const ageRaw = typeof sflxAge === 'number' ? sflxAge : (typeof oneQbAge === 'number' ? oneQbAge : null);
        const fallbackAge = Number(player.age);
        const ageNumber = Number.isFinite(ageRaw) ? ageRaw : (Number.isFinite(fallbackAge) ? fallbackAge : null);
        const age = Number.isFinite(ageNumber) ? ageNumber.toFixed(1) : null;

        // Team logo
        const logoKeyMap = { WSH: 'was', WAS: 'was', JAC: 'jax', LA: 'lar' };
        const normalizedKey = logoKeyMap[team] || team.toLowerCase();

        return { pid, pos, team, fullName, truncatedName, ktc, posRankText, ktcPosRankNumber, ppg, age, ageNumber, normalizedKey };
    }).filter(Boolean);

    // Apply position filter
    const filtered = posFilter === 'ALL' ? cards : cards.filter(c => c.pos === posFilter);

    if (filtered.length === 0) {
        watchlistModalBody.innerHTML = `
            <div class="watchlist-empty">
                <i class="fa-solid fa-filter"></i>
                <p>No ${posFilter} players on your watchlist.</p>
            </div>`;
        return;
    }

    // Sort by position group (QB→RB→WR→TE), then by KTC value descending
    const posOrder = { QB: 0, RB: 1, WR: 2, TE: 3 };
    filtered.sort((a, b) => {
        const posA = posOrder[a.pos] ?? 4;
        const posB = posOrder[b.pos] ?? 4;
        if (posA !== posB) return posA - posB;
        return (b.ktc ?? 0) - (a.ktc ?? 0);
    });

    // Helper: ordinal suffix for rank display (matches rosters page logic)
    const ordSuffix = (n) => {
        const num = Math.abs(Number(n));
        if (!Number.isFinite(num) || Math.floor(num) !== num) return '';
        const tens = num % 100;
        if (tens >= 11 && tens <= 13) return 'th';
        const ones = num % 10;
        if (ones === 1) return 'st';
        if (ones === 2) return 'nd';
        if (ones === 3) return 'rd';
        return 'th';
    };

    watchlistModalBody.innerHTML = `<div class="watchlist-card-grid">${filtered.map(c => {
        const ktcDisplay = c.ktc !== null ? c.ktc : '—';
        const ppgDisplay = c.ppg !== null ? c.ppg.toFixed(1) : '—';
        const posRankDisplay = c.posRankText || '';

        // KTC rank + value display matching rosters default layout: "KTC: rank(value)"
        const ktcRankNum = Number.isFinite(c.ktcPosRankNumber) && c.ktcPosRankNumber > 0 ? c.ktcPosRankNumber : null;
        const ktcColor = c.ktc !== null ? getKtcColor(c.ktc) : '';
        const ktcRankHtml = ktcRankNum !== null
            ? `<span class="wl-ktc-rank-group" style="color:${ktcColor}"><span class="wl-ktc-rank">${ktcRankNum}</span><span class="wl-ktc-rank-suffix">${ordSuffix(ktcRankNum)}</span></span><span class="wl-ktc-val-parens" style="color:${ktcColor}"> (${ktcDisplay})</span>`
            : `<strong style="color:${ktcColor}">${ktcDisplay}</strong>`;

        // Age display with color matching rosters getAgeColorForRoster
        const ageColor = c.ageNumber ? getAgeColorForRoster(c.pos, c.ageNumber) : '';
        const ageHtml = c.age !== null
            ? `<span class="wl-age" style="color:${ageColor}">${c.age}</span> <small>y.o.</small>`
            : '';

        const teamLogo = c.team !== 'FA'
            ? `<img class="team-logo glow" src="../assets/NFL_logos_svg/${c.normalizedKey}.svg" alt="${c.team}" width="20" height="20" loading="lazy">`
            : '<span class="wl-fa-badge">FA</span>';
        // Team logo watermark: subtle background image behind card content
        const watermarkHtml = c.team !== 'FA'
            ? `<img class="wl-card-watermark" src="../assets/NFL_logos_svg/${c.normalizedKey}.svg" alt="${c.team}" aria-hidden="true" loading="lazy" decoding="async">`
            : '';
        return `
        <div class="watchlist-card" data-pid="${c.pid}" data-pos="${c.pos}">
            ${watermarkHtml}
            <button class="watchlist-card-remove" data-pid="${c.pid}" title="Remove from Watchlist" aria-label="Remove ${c.fullName} from Watchlist">
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
            <div class="wl-main-line">
                <span class="wl-pos-tag ${c.pos}">${c.pos}</span>
                <span class="wl-player-name" data-pid="${c.pid}" title="${escapeHtml(c.fullName)}">${escapeHtml(c.truncatedName)}</span>
            </div>
            <div class="wl-meta-line">
                ${posRankDisplay ? `<span class="wl-pos-rank">${posRankDisplay}</span>` : '<span></span>'}
                ${ageHtml ? `<span class="wl-age-group">${ageHtml}</span>` : '<span></span>'}
                <span class="wl-meta-team">${teamLogo} <span class="wl-team-abbr">${c.team}</span></span>
            </div>
            <div class="wl-value-line">
                <span class="wl-stat">${ktcRankHtml} <small>KTC</small></span>
                <span class="wl-stat"><strong>${ppgDisplay}</strong> <small>PPG</small></span>
            </div>
            <div class="watchlist-card-actions">
                <button class="watchlist-action-btn watchlist-action-btn--filter watchlist-find-btn" data-pid="${c.pid}" title="Locate on Roster">
                    <i class="fa-solid fa-magnifying-glass"></i> Find
                </button>
                <button class="watchlist-action-btn watchlist-action-btn--ownership watchlist-ownership-btn" data-pid="${c.pid}" title="View Ownership">
                    <i class="fa-solid fa-users"></i> Ownership
                </button>
            </div>
        </div>`;
    }).join('')}</div>`;
}

// === Watchlist Modal Wiring ===
// Wire bottom-panel watchlist button, modal overlay/close, position filters, and card interactions.
if (pageType === 'rosters') {
    // Open watchlist modal from bottom panel button
    watchlistButton?.addEventListener('click', () => {
        openWatchlistModal();
    });

    // Close handlers: overlay tap, close button, Escape key
    watchlistModal?.querySelector('.modal-overlay')?.addEventListener('click', closeWatchlistModal);
    watchlistModal?.querySelector('.watchlist-modal-close')?.addEventListener('click', closeWatchlistModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && watchlistModal && !watchlistModal.classList.contains('hidden')) {
            closeWatchlistModal();
        }
    });

    // Position filter chips inside watchlist modal header
    watchlistModal?.querySelectorAll('.watchlist-filter-btn[data-watchlist-pos]')?.forEach(chip => {
        chip.addEventListener('click', () => {
            // Toggle active state among sibling chips
            watchlistModal.querySelectorAll('.watchlist-filter-btn[data-watchlist-pos]').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            renderWatchlistCards(chip.dataset.watchlistPos || 'ALL');
        });
    });

    // Delegated click handlers for card interactions (name, remove, filter, ownership)
    watchlistModalBody?.addEventListener('click', async (e) => {
        // --- Remove button (×): use closest() for robust delegation ---
        const removeBtn = e.target.closest('.watchlist-card-remove');
        if (removeBtn) {
            const pid = removeBtn.dataset.pid;
            if (!pid) return;
            removeFromWatchlist(pid);
            // Re-render with current filter
            const activeChip = watchlistModal.querySelector('.watchlist-filter-btn[data-watchlist-pos].is-active');
            renderWatchlistCards(activeChip?.dataset.watchlistPos || 'ALL');
            return;
        }

        // --- Player name tap → open game logs ---
        // Build an enriched player object (pos, team, ktc, posRank, overallRank, age)
        // so renderGameLogs can display header chips, pos tag, and team logo correctly.
        const nameEl = e.target.closest('.wl-player-name');
        if (nameEl) {
            const pid = nameEl.dataset.pid;
            if (!pid) return;
            const player = state.players?.[pid];
            if (!player) return;

            // Enrich with value data (same source as renderWatchlistCards)
            const valueData = state.isSuperflex
                ? (state.sflxData?.[pid] || state.oneQbData?.[pid])
                : (state.oneQbData?.[pid] || state.sflxData?.[pid]);
            const pos = (player.position || player.fantasy_positions?.[0] || '').toUpperCase();
            const team = (player.team || 'FA').toUpperCase();
            const ktc = Number.isFinite(valueData?.ktc) ? Math.round(valueData.ktc) : null;
            const posRank = valueData?.posRank || null;
            const overallRank = Number.isFinite(valueData?.overallRank) ? valueData.overallRank : null;
            const sflxAge = state.sflxData?.[pid]?.age;
            const oneQbAge = state.oneQbData?.[pid]?.age;
            const age = typeof sflxAge === 'number' ? sflxAge
                : (typeof oneQbAge === 'number' ? oneQbAge : (Number(player.age) || null));

            closeWatchlistModal();
            await handlePlayerNameClick({
                id: pid,
                name: `${player.first_name} ${player.last_name}`,
                pos,
                team,
                ktc,
                posRank,
                overallRank,
                age
            });
            return;
        }

        // --- Find/Locate button → scroll to player row on roster (center both axes) ---
        const findBtn = e.target.closest('.watchlist-find-btn');
        if (findBtn) {
            const pid = findBtn.dataset.pid;
            if (!pid) return;
            closeWatchlistModal();
            // Brief delay to let modal close animation finish
            setTimeout(() => {
                const playerRow = document.querySelector(`.player-row[data-asset-id="${pid}"], .player-card[data-asset-id="${pid}"], .player-row[data-player-id="${pid}"], .player-card[data-player-id="${pid}"]`);
                if (playerRow) {
                    // Center both vertically and horizontally
                    playerRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    // Add highlight pulse (3 iterations × 1.5s = 4.5s)
                    playerRow.classList.add('watchlist-highlight');
                    setTimeout(() => playerRow.classList.remove('watchlist-highlight'), 5000);
                } else {
                    // Player not found on current roster view — show toast
                    showTemporaryTooltip(watchlistButton || document.body, 'Player not found on this roster');
                }
            }, 200);
            return;
        }

        // --- Ownership button → lazy-load ownership context, then open ownership modal ---
        const ownershipBtn = e.target.closest('.watchlist-ownership-btn');
        if (ownershipBtn) {
            const pid = ownershipBtn.dataset.pid;
            if (!pid) return;
            // Show loading state on button
            const originalHTML = ownershipBtn.innerHTML;
            ownershipBtn.classList.add('is-loading');
            ownershipBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading…';
            ownershipBtn.disabled = true;

            try {
                // Lazy-load ownership context if not already loaded
                if (!hasOwnershipContextLoaded()) {
                    await loadOwnershipContextForUser();
                    buildOwnershipRowsFromContext();
                }
                closeWatchlistModal();
                openOwnershipPlayerModal(pid);
            } catch (err) {
                showTemporaryTooltip(ownershipBtn, 'Failed to load ownership data');
            } finally {
                ownershipBtn.classList.remove('is-loading');
                ownershipBtn.innerHTML = originalHTML;
                ownershipBtn.disabled = false;
            }
            return;
        }
    });
}

function openComparisonModal() {
    if (playerComparisonModal) {
        const modalContent = playerComparisonModal.querySelector('.modal-content');
        const header = document.getElementById('header-container');
        const tradePreview = document.getElementById('tradeSimulator');
        // Start/Sit-only: compact the preview (hide players 3–6) while comparison is open.
        if (state.isStartSitMode && !state.startSitCompactPreview) {
            state.startSitCompactPreview = true;
            try {
                renderStartSitPreview();
            } catch (e) {
                // no-op
            }
        }
        if (modalContent && header && tradePreview) {
            const headerRect = header.getBoundingClientRect();
            const tradePreviewRect = tradePreview.getBoundingClientRect();
            const topPosition = headerRect.bottom + 10;
            const spacingAdjustment = 6;
            const availableHeight = tradePreviewRect.top - topPosition - spacingAdjustment;
            modalContent.style.top = `${topPosition}px`;
            modalContent.style.height = `${availableHeight}px`;
            modalContent.style.bottom = 'auto';
        }
        playerComparisonModal.classList.remove('hidden');
        if (comparisonBackgroundOverlay) {
            comparisonBackgroundOverlay.classList.remove('hidden');
        }
        if (rosterGrid) {
            rosterGrid.classList.add('hidden');
        }
    }
}
function closeComparisonModal() {
    if (playerComparisonModal) {
        const modalContent = playerComparisonModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.top = '';
            modalContent.style.height = '';
            modalContent.style.bottom = '';
        }
        playerComparisonModal.classList.add('hidden');
        playerComparisonModal.classList.remove('start-sit-compare');
        if (comparisonBackgroundOverlay) {
            comparisonBackgroundOverlay.classList.add('hidden');
        }
        const comparisonModalBody = document.getElementById('comparison-modal-body');
        if (comparisonModalBody) {
            comparisonModalBody.innerHTML = '';
        }
        if (rosterGrid) {
            rosterGrid.classList.remove('hidden');
        }
    }

    // Start/Sit-only: restore full preview after closing the comparison modal.
    if (state.isStartSitMode && state.startSitCompactPreview) {
        state.startSitCompactPreview = false;
        try {
            renderStartSitPreview();
        } catch (e) {
            // no-op
        }
    }
}
function setLoading(isLoading, message = 'Loading...') {
    welcomeScreen?.classList.add('hidden');
    if (document.body?.dataset?.page === 'rosters') {
        adjustStickyHeaders();
    }

    const gateSubmitting = Boolean(window.__dhUsernameGate?.isSubmitting?.());
    if (gateSubmitting) {
        try {
            window.__dhUsernameGate?.setLoading?.(isLoading, message);
        } catch (error) { }
        loadingIndicator?.classList.add('hidden');
        return;
    }

    // Skip loading panel on stats page (uses inline table spinner instead)
    if (document.body?.dataset?.page === 'stats') {
        try {
            if (typeof window.setStatsLoading === 'function') {
                // Always use the stats page's default loader copy when toggling via `setLoading(...)`.
                window.setStatsLoading(isLoading);
            }
        }
        catch (e) {
            // ignore
        }
        return;
    }

    // Don't disable nav buttons during loading - allow navigation at any time
    if (isLoading) {
        const msgEl = loadingIndicator.querySelector('.loading-message'); if (msgEl) { msgEl.textContent = message; } else { loadingIndicator.textContent = message; }
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}
function handleError(error, username) {
    console.error(`Error for user ${username}:`, error);
    if (usesLeagueUsernameGate(pageType)) {
        rosterView?.classList.add('hidden');
        playerListView?.classList.add('hidden');
        showLeagueUsernameGate({
            page: pageType,
            username,
            errorMessage: getLeagueUsernameGateErrorMessage(error)
        });
        return;
    }
    if (welcomeScreen) {
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.innerHTML = `<h2 class="text-red-400">Error</h2><p>Could not fetch data for user: ${username}</p><p>${error.message}</p>`;
    }
    rosterView?.classList.add('hidden');
    playerListView?.classList.add('hidden');
}
async function fetchWithCache(url) {
    if (state.cache[url]) return state.cache[url];
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    const data = await response.json();
    state.cache[url] = data;
    return data;
}
(function () {
    const input = document.getElementById('usernameInput');
    if (!input) return;
    // hydrate
    const saved = (localStorage.getItem(HEADER_USERNAME_STORAGE_KEY) || '').trim();
    if (saved) input.value = saved; else { input.removeAttribute('value'); input.value = ''; }
    // listeners
    input.addEventListener('change', () => { persistNormalizedHeaderUsername(); });
    input.addEventListener('blur', () => { persistNormalizedHeaderUsername({ blurInput: false }); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { persistNormalizedHeaderUsername(); } });
    // Hook buttons (capture) so normalization executes before fetch handlers.
    ['rostersButton', 'leagueHubButton', 'researchButton'].forEach(id => {
    });
})();
// === Mobile pinch-zoom stability guard ===
// iOS WebKit (Safari + iOS Chrome) can crash on pinch-zoom when large fixed, blended, animated
// backgrounds are present. When the user zooms, temporarily remove the heaviest layers to keep
// the page stable (prevents "A problem repeatedly occurred").
(function installZoomStabilityGuard() {
    try {
        if (!document || !document.documentElement) return;
        const starfield = document.getElementById('starfield');
        if (!starfield) return;
        const isTouchDevice = (navigator.maxTouchPoints || 0) > 0
            || (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);
        if (!isTouchDevice) return;

        const root = document.documentElement;
        let lastZoomed = null;
        const getScale = () => {
            try {
                const vv = window.visualViewport;
                return vv && typeof vv.scale === 'number' ? vv.scale : 1;
            } catch (e) {
                return 1;
            }
        };
        const setZoomed = (zoomed) => {
            if (zoomed === lastZoomed) return;
            lastZoomed = zoomed;
            root.classList.toggle('user-zoomed', zoomed);
        };
        const update = () => {
            const scale = getScale();
            setZoomed(Number.isFinite(scale) && scale > 1.01);
        };

        // iOS Safari fires gesture events early during pinch.
        try {
            document.addEventListener('gesturestart', () => setZoomed(true), { passive: true });
            document.addEventListener('gesturechange', () => setZoomed(true), { passive: true });
            document.addEventListener('gestureend', update, { passive: true });
        } catch (e) {
            // no-op (unsupported options/events)
        }

        const vv = window.visualViewport;
        if (vv && typeof vv.addEventListener === 'function') {
            vv.addEventListener('resize', update, { passive: true });
            vv.addEventListener('scroll', update, { passive: true });
        } else {
            window.addEventListener('resize', update, { passive: true });
        }
        update();
    } catch (e) { }
})();
// === Hotfix guards (20250825104842) ===
(function () {
    const welcome = document.getElementById('welcome-screen');
    const legend = document.getElementById('legend-section');
    const roster = document.getElementById('rosterView');
    const list = document.getElementById('playerListView');
    function setWelcomeWidthVar() {
        if (!welcome) return;
        const w = Math.round(welcome.getBoundingClientRect().width);
        document.documentElement.style.setProperty('--welcome-width', w > 0 ? w + 'px' : '720px');
    }
    function enforceLegendVisibility() {
        if (!legend) return;
        const onWelcome = welcome && !welcome.classList.contains('hidden');
        const rosterVisible = roster && !roster.classList.contains('hidden');
        const listVisible = list && !list.classList.contains('hidden');
        // Only show legend on welcome, otherwise hide
        legend.classList.toggle('hidden', !(onWelcome && !rosterVisible && !listVisible));
    }
    window.addEventListener('load', () => { setWelcomeWidthVar(); enforceLegendVisibility(); });
    window.addEventListener('resize', setWelcomeWidthVar);
    if (welcome) new MutationObserver(() => { enforceLegendVisibility(); setWelcomeWidthVar(); }).observe(welcome, { attributes: true, attributeFilter: ['class'] });
    if (roster) new MutationObserver(enforceLegendVisibility).observe(roster, { attributes: true, attributeFilter: ['class'] });
    if (list) new MutationObserver(enforceLegendVisibility).observe(list, { attributes: true, attributeFilter: ['class'] });
    // Service worker update hard reload once
    navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!window.__reloadedOnce) { window.__reloadedOnce = true; location.reload(); }
    });
})();
// PWA registration (with version bump to bust old caches)
if ('serviceWorker' in navigator) {
    const swPath = pageType === 'welcome'
        ? 'service-worker.js?v=20250825104842'
        : '../service-worker.js?v=20250825104842';
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swPath).catch(() => { });
    });
}
// Hide legend when switching away from Welcome via UI controls
['rostersButton', 'leagueHubButton', 'researchButton', 'leagueSelect', 'positionalViewBtn', 'lineupViewBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', hideLegend, { capture: true });
});
if (pageType === 'ownership') {
    const ownershipModeButtons = document.querySelectorAll('#ownershipModeSwitcher .ownership-mode-btn');
    ownershipModeButtons.forEach((btn) => {
        btn.addEventListener('click', hideLegend, { capture: true });
    });
}
/* one-shot legend guard */
document.addEventListener('DOMContentLoaded', function () {
    var legend = document.getElementById('legend-section');
    var roster = document.getElementById('rosterView');
    var list = document.getElementById('playerListView');
    if (legend && ((roster && !roster.classList.contains('hidden')) || (list && !list.classList.contains('hidden')))) {
        legend.classList.add('hidden');
    }
});

// === Consistency Chart & HUD (sheet-driven) ===
const MAX_CONSISTENCY_POINTS = 40;
const CONSISTENCY_THRESHOLD_MAP = {
    QB: { solid: 16, high: 22 },
    RB: { solid: 12, high: 18 },
    WR: { solid: 12, high: 18 },
    TE: { solid: 11, high: 17 },
    DEFAULT: { solid: 14, high: 20 }
};
const CONSISTENCY_BUCKET_STYLES = {
    high: { color: '#00ffc1' },
    solid: { color: '#00c5ff' },
    low: { color: '#c26cfc' }
};
const CONSISTENCY_HUD_CONDITIONAL_COLORS = {
    high: '#5dfdca',
    solid: '#47befd',
    low: '#d3a5ff'
};
const SVG_NS = 'http://www.w3.org/2000/svg';
const CONSISTENCY_LINE_FILTER_ID = 'consistency-line-glow';
const CONSISTENCY_AREA_FILTER_ID = 'consistency-area-glow';
const CONSISTENCY_AREA_GRADIENT_ID = 'consistency-area-gradient';
const CONSISTENCY_GRADIENT_COLORS = {
    low: '#c26cfc10',
    solid: '#005cff10',
    high: '#00ffc110'
};
const CONSISTENCY_EDGE_PADDING_PCT = 2.8;
const CONSISTENCY_PROJECTION_SKIP_CODES = new Set(['IR', 'OUT', 'PUP', 'BYE', 'Q', 'D']);
let curveSvg = null;

function getConsistencyAxisWeeks() {
    return Object.keys(PLAYER_STATS_SHEETS?.weeks || {})
        .map(Number)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
}

function getConsistencyThresholds(position) {
    const key = position ? position.toUpperCase() : '';
    return CONSISTENCY_THRESHOLD_MAP[key] || CONSISTENCY_THRESHOLD_MAP.DEFAULT;
}

function clampConsistencyPoints(value) {
    if (!Number.isFinite(value)) return null;
    return Math.max(0, Math.min(MAX_CONSISTENCY_POINTS, value));
}

function getConsistencyBucket(pts, thresholds) {
    if (!Number.isFinite(pts)) return { ...CONSISTENCY_BUCKET_STYLES.low, name: 'low' };
    if (pts >= thresholds.high) return { ...CONSISTENCY_BUCKET_STYLES.high, name: 'high' };
    if (pts >= thresholds.solid) return { ...CONSISTENCY_BUCKET_STYLES.solid, name: 'solid' };
    return { ...CONSISTENCY_BUCKET_STYLES.low, name: 'low' };
}

function formatHudPercentage(value, decimals = 1) {
    if (!Number.isFinite(value)) return 'N/A';
    return Number(value).toFixed(decimals) + '%';
}

function formatHudRank(rank) {
    if (!Number.isFinite(rank)) return 'NA';
    return `${rank}`;
}

function formatCeilingValue(value) {
    if (!Number.isFinite(value)) return 'N/A';
    return Number(value).toFixed(1);
}

function getRankAccentColor(rank) {
    if (!Number.isFinite(rank)) return '#f8faff';
    if (rank <= 12) return '#7cf5ff';
    if (rank <= 24) return '#56c4ff';
    return '#d3a5ff';
}

function applyRankStyling({ rank, metricValueEl, metricSubEl, circleValueEl }) {
    const color = getRankAccentColor(rank);
    if (metricValueEl) metricValueEl.style.color = color;
    if (circleValueEl) circleValueEl.style.color = color;
    if (metricSubEl) {
        const valueNode = metricSubEl.querySelector('.metric-sub-value');
        if (valueNode) {
            valueNode.textContent = formatHudRank(rank);
            valueNode.style.color = color;
        }
    }
}

function pluralizeWeeks(count) {
    if (!count) return 'No weeks charted';
    return count === 1 ? '1 week charted' : `${count} weeks charted`;
}

function buildConsistencyPanelData(player) {
    if (!player || !player.id) return null;
    const axisWeeks = getConsistencyAxisWeeks();
    if (!axisWeeks.length) return null;
    const playerId = player.id;
    const weeklyStats = state.playerWeeklyStats || {};
    const fullPlayer = state.players[playerId];
    const resolvedPos = (player.pos || state.statsPagePlayerData?.pos || fullPlayer?.position || 'FLEX').toUpperCase();
    const thresholds = getConsistencyThresholds(resolvedPos);
    const series = [];
    const skippedLabels = {};
    axisWeeks.forEach(week => {
        const statsForWeek = weeklyStats?.[week]?.[playerId];
        if (!statsForWeek) return;
        const projReason = formatProjReason(statsForWeek.proj);
        if (shouldSkipConsistencyWeek(statsForWeek)) {
            if (projReason) skippedLabels[week] = projReason;
            return;
        }
        const opponent = (statsForWeek.opponent || '').toUpperCase();
        if (opponent === 'BYE') {
            skippedLabels[week] = 'BYE';
            return;
        }
        const sheetFpts = statsForWeek.fpt_ppr;
        const numeric = typeof sheetFpts === 'number' ? sheetFpts : Number(sheetFpts);
        if (!Number.isFinite(numeric)) return;
        const clamped = clampConsistencyPoints(numeric);
        if (clamped === null) return;
        series.push({
            week,
            pts: clamped,
            originalPts: numeric,
            opponent: statsForWeek.opponent || ''
        });
    });
    series.sort((a, b) => a.week - b.week);
    const bestGameEntry = series.reduce((best, entry) => {
        if (!best) return entry;
        return entry.pts > best.pts ? entry : best;
    }, null);
    const solidHighCount = thresholds
        ? series.filter(entry => entry.pts >= thresholds.solid).length
        : null;
    const lastFive = series.slice(-5);
    const lastFiveAvg = lastFive.length
        ? lastFive.reduce((sum, entry) => sum + (Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts), 0) / lastFive.length
        : null;
    const seasonTotals = state.playerSeasonStats?.[playerId] || {};
    const gamesPlayed = (typeof seasonTotals.games_played === 'number' && Number.isFinite(seasonTotals.games_played))
        ? seasonTotals.games_played
        : series.length;
    const playerName = (fullPlayer ? `${fullPlayer.first_name || ''} ${fullPlayer.last_name || ''}` : player.name || '')
        .replace(/\s+/g, ' ')
        .trim() || player.name || 'Player';
    const consistencyPct = Number(seasonTotals.csty_pct);
    const ceilingValue = Number(seasonTotals.ceiling);
    const consistencyRank = getSeasonRankValue(playerId, 'csty_pct');
    const ceilingRank = getSeasonRankValue(playerId, 'ceiling');
    const axisStart = axisWeeks[0];
    const axisEnd = axisWeeks[axisWeeks.length - 1];
    const weekRangeLabel = axisStart === axisEnd ? `Week ${axisStart}` : `Weeks ${axisStart}\u2013${axisEnd}`;
    const ceilingRankMax = RADAR_STATS_CONFIG[resolvedPos]?.maxRank || 32;
    return {
        playerId,
        playerName,
        position: resolvedPos,
        axisWeeks,
        series,
        chartedWeeksCount: series.length,
        gamesPlayed,
        thresholds,
        consistencyPct: Number.isFinite(consistencyPct) ? consistencyPct : null,
        ceilingValue: Number.isFinite(ceilingValue) ? ceilingValue : null,
        consistencyRank: Number.isFinite(consistencyRank) ? consistencyRank : null,
        ceilingRank: Number.isFinite(ceilingRank) ? ceilingRank : null,
        weekRangeLabel,
        weeksChartedLabel: pluralizeWeeks(series.length),
        ceilingRankMax,
        bestGame: bestGameEntry,
        lastFiveAvg,
        highWeekCount: thresholds ? series.filter(entry => entry.pts >= thresholds.high).length : null,
        solidHighCount,
        totalWeeks: series.length,
        skippedLabels
    };
}

function shouldSkipConsistencyWeek(statsForWeek) {
    if (!statsForWeek) return false;
    // If the player actually scored meaningful fantasy points this week,
    // always treat it as a normal data point, regardless of PROJ text.
    const rawFpts = statsForWeek.fpt_ppr;
    const numericFpts = typeof rawFpts === 'number' ? rawFpts : Number(rawFpts);
    if (Number.isFinite(numericFpts) && numericFpts > 0.5) return false;
    const rawProj = statsForWeek.proj;
    if (rawProj === undefined || rawProj === null) return false;
    if (typeof rawProj === 'number' && Number.isFinite(rawProj)) return false;
    const trimmed = String(rawProj).trim();
    if (!trimmed) return false;
    const numericValue = Number(trimmed);
    if (Number.isFinite(numericValue)) return false;
    const normalized = trimmed.toUpperCase();
    if (CONSISTENCY_PROJECTION_SKIP_CODES.has(normalized)) return true;
    // Treat any non-numeric projection text as an inactive week
    return true;
}

function formatProjReason(rawProj) {
    if (rawProj === undefined || rawProj === null) return '';
    const text = String(rawProj).trim();
    if (!text) return '';
    return text.toUpperCase();
}

function updateConsistencyHud(data) {
    if (!consistencyContainer) return;
    const weekRangeEl = consistencyContainer.querySelector('[data-week-range]');
    if (weekRangeEl) weekRangeEl.textContent = data?.weekRangeLabel || 'Weeks —';
    const weeksChartedEl = consistencyContainer.querySelector('[data-weeks-charted]');
    if (weeksChartedEl) weeksChartedEl.textContent = data?.weeksChartedLabel || 'No weeks charted';
    const formattedPct = formatHudPercentage(data?.consistencyPct);
    const consistencyRankEl = consistencyContainer.querySelector('[data-consistency-rank]');
    if (consistencyRankEl) {
        if (Number.isFinite(data?.consistencyRank)) {
            consistencyRankEl.textContent = `#${data.consistencyRank}`;
        } else {
            consistencyRankEl.textContent = 'NA';
        }
    }
    const ceilingValueEl = consistencyContainer.querySelector('[data-ceiling-value]');
    if (ceilingValueEl) ceilingValueEl.textContent = formatCeilingValue(data?.ceilingValue);
    const circleConsistencyValue = consistencyContainer.querySelector('[data-consistency-circle-value]');
    if (circleConsistencyValue) circleConsistencyValue.textContent = formattedPct;
    const circleCeilingValue = consistencyContainer.querySelector('[data-ceiling-circle-rank]');
    if (circleCeilingValue) {
        if (Number.isFinite(data?.ceilingRank)) {
            const rankInt = Math.round(data.ceilingRank);
            const ordinal = ordinalSuffix(rankInt);
            const suffix = ordinal.slice(String(rankInt).length) || '';
            circleCeilingValue.innerHTML = `${rankInt}<span class="ceiling-rank-suffix">${suffix}</span>`;
        } else {
            circleCeilingValue.textContent = 'NA';
        }
    }
    const consistencyCaptionEl = consistencyContainer.querySelector('[data-consistency-circle-caption]');
    if (consistencyCaptionEl) consistencyCaptionEl.textContent = 'CSTY RATE';
    const ceilingCaptionEl = consistencyContainer.querySelector('[data-ceiling-circle-caption]');
    if (ceilingCaptionEl) ceilingCaptionEl.textContent = 'CL POS RANK';
    const consistencyRingFill = consistencyContainer.querySelector('.progress-circle--consistency .progress-ring-fill');
    const ceilingRingFill = consistencyContainer.querySelector('.progress-circle--ceiling .progress-ring-fill--ceiling');
    applyRankStyling({
        rank: data?.consistencyRank,
        metricValueEl: consistencyRankEl,
        metricSubEl: null,
        circleValueEl: circleConsistencyValue
    });
    if (consistencyRingFill) {
        const consistencyStrokeColor = getRankAccentColor(data?.consistencyRank);
        consistencyRingFill.setAttribute('stroke', consistencyStrokeColor);
    }
    applyRankStyling({
        rank: data?.ceilingRank,
        metricValueEl: ceilingValueEl,
        metricSubEl: null,
        circleValueEl: circleCeilingValue
    });
    if (ceilingRingFill) {
        const ceilingStrokeColor = getRankAccentColor(data?.ceilingRank);
        ceilingRingFill.setAttribute('stroke', ceilingStrokeColor);
    }
    // Middle insight chip: Big Game % (games above the position-specific "high" threshold)
    const highScorePctEl = consistencyContainer.querySelector('[data-insight-best]');
    if (highScorePctEl) {
        const highCount = Number.isFinite(data?.highWeekCount) ? data.highWeekCount : null;
        const gamesPlayed = Number.isFinite(data?.gamesPlayed)
            ? data.gamesPlayed
            : (Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null);

        if (highCount !== null && gamesPlayed !== null && gamesPlayed > 0) {
            const pct = (highCount / gamesPlayed) * 100;
            const formatted = Number(pct).toFixed(1);
            const color = pct > 40
                ? CONSISTENCY_HUD_CONDITIONAL_COLORS.high
                : (pct < 23 ? CONSISTENCY_HUD_CONDITIONAL_COLORS.low : CONSISTENCY_HUD_CONDITIONAL_COLORS.solid);
            highScorePctEl.style.color = '';
            highScorePctEl.innerHTML = `<span style="color:${color}">${formatted}</span><span class="hud-insight-suffix">%</span>`;
        } else {
            highScorePctEl.textContent = '—';
            highScorePctEl.style.color = '';
        }
    }
    const lastFiveEl = consistencyContainer.querySelector('[data-insight-last5]');
    if (lastFiveEl) {
        if (Number.isFinite(data?.lastFiveAvg)) {
            const formatted = data.lastFiveAvg.toFixed(1);
            if (data?.thresholds) {
                const bucket = getConsistencyBucket(data.lastFiveAvg, data.thresholds);
                const color = bucket?.name === 'high'
                    ? CONSISTENCY_HUD_CONDITIONAL_COLORS.high
                    : (bucket?.name === 'solid' ? CONSISTENCY_HUD_CONDITIONAL_COLORS.solid : CONSISTENCY_HUD_CONDITIONAL_COLORS.low);
                lastFiveEl.style.color = '';
                lastFiveEl.innerHTML = `<span style="color:${color}">${formatted}</span><span class="hud-insight-suffix"> fpts</span>`;
            } else {
                lastFiveEl.style.color = '';
                lastFiveEl.innerHTML = `<span>${formatted}</span><span class="hud-insight-suffix"> fpts</span>`;
            }
        } else {
            lastFiveEl.textContent = '—';
            lastFiveEl.style.color = '';
        }
    }
    const cstyCountEl = consistencyContainer.querySelector('[data-insight-cstycount]');
    if (cstyCountEl) {
        const made = Number.isFinite(data?.solidHighCount) ? data.solidHighCount : null;
        const total = Number.isFinite(data?.totalWeeks) ? data.totalWeeks : null;
        if (made !== null && total !== null && total > 0) {
            const color = getRankAccentColor(data?.consistencyRank);
            cstyCountEl.innerHTML = `<span class="csty-made" style="color:${color}">${made}</span><span class="hud-insight-suffix">/${total}</span>`;
        } else {
            cstyCountEl.textContent = '—';
        }
    }
}

function prepareConsistencyPanel(player) {
    if (!consistencyContainer) return;
    const data = buildConsistencyPanelData(player);
    state.currentConsistencyData = data;
    updateConsistencyHud(data);
}

function showConsistencyEmptyState(chartBox, message) {
    if (!chartBox) return;
    let emptyEl = chartBox.querySelector('.consistency-empty-state');
    if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'consistency-empty-state';
        chartBox.appendChild(emptyEl);
    }
    emptyEl.textContent = message;
    emptyEl.classList.remove('hidden');
}

function hideConsistencyEmptyState(chartBox) {
    const emptyEl = chartBox?.querySelector('.consistency-empty-state');
    if (emptyEl) emptyEl.classList.add('hidden');
}

function renderConsistencyChart() {
    if (!consistencyContainer) return;
    const chartBox = document.getElementById('weekly-chart-box');
    const pointsLayer = document.getElementById('weekly-chart-points');
    const xAxisEl = document.getElementById('weekly-chart-x-axis');
    if (!chartBox || !pointsLayer || !xAxisEl) return;
    const data = state.currentConsistencyData;
    updateConsistencyHud(data);
    requestAnimationFrame(() => {
        if (!data) {
            renderXAxis({ axisWeeks: getConsistencyAxisWeeks() });
            renderZoneSummary(null);
            pointsLayer.querySelectorAll('.weekly-zone, .weekly-point').forEach(el => el.remove());
            if (curveSvg) {
                curveSvg.remove();
                curveSvg = null;
            }
            showConsistencyEmptyState(chartBox, 'Consistency data unavailable.');
            hydrateProgressCircles(null);
            return;
        }
        renderXAxis(data);
        renderZoneSummary(data);
        renderPoints(data);
        hydrateProgressCircles(data);
        if (data.series.length === 0) {
            showConsistencyEmptyState(chartBox, 'No sheet-based fantasy points recorded yet.');
        } else {
            hideConsistencyEmptyState(chartBox);
        }
    });
}

function createZones(data) {
    const lineLayer = document.getElementById('weekly-chart-points');
    if (!lineLayer) return;
    lineLayer.querySelectorAll('.weekly-zone').forEach(zone => zone.remove());
}

function renderZoneSummary(data) {
    const container = document.getElementById('weekly-zone-summary');
    if (!container) return;
    const lowEl = container.querySelector('[data-zone-low]');
    const solidEl = container.querySelector('[data-zone-solid]');
    const highEl = container.querySelector('[data-zone-high]');
    const lowThresholdEl = container.querySelector('[data-threshold-low]');
    const solidThresholdEl = container.querySelector('[data-threshold-solid]');
    const highThresholdEl = container.querySelector('[data-threshold-high]');
    const resetCounts = () => {
        if (lowEl) lowEl.textContent = '0';
        if (solidEl) solidEl.textContent = '0';
        if (highEl) highEl.textContent = '0';
    };
    const resetThresholds = () => {
        if (lowThresholdEl) lowThresholdEl.textContent = '';
        if (solidThresholdEl) solidThresholdEl.textContent = '';
        if (highThresholdEl) highThresholdEl.textContent = '';
    };
    if (!data || !data.series || !data.series.length) {
        resetCounts();
        resetThresholds();
        return;
    }
    const thresholds = data.thresholds || getConsistencyThresholds(data.position);
    const solidRounded = Math.round(thresholds.solid);
    const highRounded = Math.round(thresholds.high);
    if (lowThresholdEl) lowThresholdEl.textContent = `(<${solidRounded}):`;
    if (solidThresholdEl) solidThresholdEl.textContent = `(${solidRounded}-${highRounded}):`;
    if (highThresholdEl) highThresholdEl.textContent = `(≥${highRounded}):`;
    let low = 0, solid = 0, high = 0;
    data.series.forEach(entry => {
        const pts = entry?.pts;
        if (!Number.isFinite(pts)) return;
        if (pts >= thresholds.high) {
            high += 1;
        } else if (pts >= thresholds.solid) {
            solid += 1;
        } else {
            low += 1;
        }
    });
    if (lowEl) lowEl.textContent = low;
    if (solidEl) solidEl.textContent = solid;
    if (highEl) highEl.textContent = high;
}

function renderXAxis(data) {
    const xAxisEl = document.getElementById('weekly-chart-x-axis');
    if (!xAxisEl) return;
    xAxisEl.innerHTML = '';
    const isMobile = typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(max-width: 540px)').matches;
    const weeks = data?.axisWeeks?.length ? data.axisWeeks : getConsistencyAxisWeeks();
    const playedWeeks = new Set(Array.isArray(data?.series) ? data.series.map(entry => entry.week) : []);
    const totalSlots = weeks.length || 1;
    const spanSlots = Math.max(1, totalSlots - 1);
    const paddingPct = getEdgePaddingPct(totalSlots);
    if (paddingPct > 0) {
        xAxisEl.dataset.padding = paddingPct;
    } else {
        delete xAxisEl.dataset.padding;
    }
    weeks.forEach((week, slotIndex) => {
        const pctX = totalSlots === 1
            ? 50
            : paddingPct + ((100 - paddingPct * 2) * (slotIndex / spanSlots));
        const span = document.createElement('span');
        if (isMobile) {
            const prefix = document.createElement('span');
            prefix.className = 'axis-week-prefix';
            prefix.textContent = 'wk';
            const number = document.createElement('span');
            number.className = 'axis-week-number';
            number.textContent = `${week}`;
            span.appendChild(prefix);
            span.appendChild(number);
        } else {
            // Desktop/tablet: keep original rendering (single text node)
            span.textContent = `WK${week}`;
        }
        if (playedWeeks.size && !playedWeeks.has(week)) {
            span.classList.add('axis-week-missed');
        }
        span.style.left = `${pctX}%`;
        xAxisEl.appendChild(span);
    });
}

function ensureCurveInfrastructure(pointsLayer) {
    if (!curveSvg) {
        curveSvg = document.createElementNS(SVG_NS, 'svg');
        curveSvg.setAttribute('class', 'weekly-curve-layer');
        curveSvg.style.position = 'absolute';
        curveSvg.style.inset = '0';
        curveSvg.style.pointerEvents = 'none';
    }
    if (!pointsLayer.contains(curveSvg)) {
        pointsLayer.prepend(curveSvg);
    }
    let defs = curveSvg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(SVG_NS, 'defs');
        curveSvg.appendChild(defs);
    }
    let areaPath = curveSvg.querySelector('.weekly-area-path');
    if (!areaPath) {
        areaPath = document.createElementNS(SVG_NS, 'path');
        areaPath.setAttribute('class', 'weekly-area-path');
        curveSvg.appendChild(areaPath);
    }
    let lineGroup = curveSvg.querySelector('.weekly-line-group');
    if (!lineGroup) {
        lineGroup = document.createElementNS(SVG_NS, 'g');
        lineGroup.setAttribute('class', 'weekly-line-group');
        curveSvg.appendChild(lineGroup);
    }
    if (areaPath.nextSibling !== lineGroup) {
        curveSvg.insertBefore(areaPath, lineGroup);
    }
    return { svg: curveSvg, defs, areaPath, lineGroup };
}

function clampGradientOffset(value) {
    return Math.min(1, Math.max(0, value));
}

function updateAreaGradient(defs, height, thresholds) {
    let gradient = defs.querySelector(`#${CONSISTENCY_AREA_GRADIENT_ID}`);
    if (!gradient) {
        gradient = document.createElementNS(SVG_NS, 'linearGradient');
        gradient.id = CONSISTENCY_AREA_GRADIENT_ID;
        defs.appendChild(gradient);
    }
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', `${height}`);
    gradient.setAttribute('x2', '0');
    gradient.setAttribute('y2', '0');
    const solidOffset = clampGradientOffset((thresholds?.solid || 0) / MAX_CONSISTENCY_POINTS);
    const highOffset = clampGradientOffset((thresholds?.high || 0) / MAX_CONSISTENCY_POINTS);
    const stops = [
        { offset: 0, color: CONSISTENCY_GRADIENT_COLORS.low },
        { offset: solidOffset, color: CONSISTENCY_GRADIENT_COLORS.solid },
        { offset: highOffset, color: CONSISTENCY_GRADIENT_COLORS.high },
        { offset: 1, color: CONSISTENCY_GRADIENT_COLORS.high }
    ];
    while (gradient.firstChild) {
        gradient.removeChild(gradient.firstChild);
    }
    stops.forEach(stopDef => {
        const stop = document.createElementNS(SVG_NS, 'stop');
        stop.setAttribute('offset', clampGradientOffset(stopDef.offset).toFixed(3));
        stop.setAttribute('stop-color', stopDef.color);
        gradient.appendChild(stop);
    });
}

function ensureLineFilter(defs) {
    let filter = defs.querySelector(`#${CONSISTENCY_LINE_FILTER_ID}`);
    if (filter) return;
    filter = document.createElementNS(SVG_NS, 'filter');
    filter.id = CONSISTENCY_LINE_FILTER_ID;
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');
    const shadow = document.createElementNS(SVG_NS, 'feDropShadow');
    shadow.setAttribute('dx', '0');
    shadow.setAttribute('dy', '1');
    shadow.setAttribute('stdDeviation', '0.5');
    shadow.setAttribute('flood-color', '#d2e6fa');
    shadow.setAttribute('flood-opacity', '0.06');
    filter.appendChild(shadow);
    defs.appendChild(filter);
}

function ensureAreaFilter(defs) {
    let filter = defs.querySelector(`#${CONSISTENCY_AREA_FILTER_ID}`);
    if (filter) return;
    filter = document.createElementNS(SVG_NS, 'filter');
    filter.id = CONSISTENCY_AREA_FILTER_ID;
    filter.setAttribute('x', '-40%');
    filter.setAttribute('y', '-60%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '240%');
    const shadow = document.createElementNS(SVG_NS, 'feDropShadow');
    shadow.setAttribute('dx', '0');
    shadow.setAttribute('dy', '10');
    shadow.setAttribute('stdDeviation', '30');
    shadow.setAttribute('flood-color', '#38bdf8');
    shadow.setAttribute('flood-opacity', '0.22');
    filter.appendChild(shadow);
    defs.appendChild(filter);
}

function getSegmentThresholds(thresholds) {
    if (!thresholds) return [];
    const values = [thresholds.solid, thresholds.high]
        .filter(value => Number.isFinite(value));
    return Array.from(new Set(values)).sort((a, b) => a - b);
}

function createCubicSegment(p0, p1, v0, v1) {
    const dx = (p1.x - p0.x) * 0.35;
    return {
        p0,
        c1: { x: p0.x + dx, y: p0.y },
        c2: { x: p1.x - dx, y: p1.y },
        p1,
        v0,
        v1
    };
}

function lerpPoint(a, b, t) {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
}

function splitCubicSegment(segment, t) {
    const { p0, c1, c2, p1, v0, v1 } = segment;
    const p01 = lerpPoint(p0, c1, t);
    const p12 = lerpPoint(c1, c2, t);
    const p23 = lerpPoint(c2, p1, t);
    const p012 = lerpPoint(p01, p12, t);
    const p123 = lerpPoint(p12, p23, t);
    const p0123 = lerpPoint(p012, p123, t);
    const valueAtSplit = v0 + (v1 - v0) * t;
    const left = {
        p0,
        c1: p01,
        c2: p012,
        p1: p0123,
        v0,
        v1: valueAtSplit
    };
    const right = {
        p0: p0123,
        c1: p123,
        c2: p23,
        p1,
        v0: valueAtSplit,
        v1
    };
    return [left, right];
}

function splitSegmentByThresholds(segment, thresholds) {
    if (!thresholds.length) return [segment];
    const delta = segment.v1 - segment.v0;
    if (delta === 0) return [segment];
    const tBreaks = thresholds
        .map(threshold => {
            const min = Math.min(segment.v0, segment.v1);
            const max = Math.max(segment.v0, segment.v1);
            if (threshold <= min || threshold >= max) return null;
            const t = (threshold - segment.v0) / delta;
            if (t <= 0 || t >= 1) return null;
            return t;
        })
        .filter((value) => value !== null)
        .sort((a, b) => a - b);
    if (!tBreaks.length) return [segment];
    const segments = [];
    let remaining = segment;
    let prevOriginalT = 0;
    tBreaks.forEach(originalT => {
        const adjustedT = (originalT - prevOriginalT) / (1 - prevOriginalT);
        const [left, right] = splitCubicSegment(remaining, adjustedT);
        segments.push(left);
        remaining = right;
        prevOriginalT = originalT;
    });
    segments.push(remaining);
    return segments;
}

function cubicSegmentToPath(segment) {
    const { p0, c1, c2, p1 } = segment;
    return `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;
}

function extendCurvePoints(points) {
    if (!points?.length) return [];
    if (points.length === 1) {
        const single = points[0];
        return [
            { ...single, x: 0 },
            { ...single, x: 100 }
        ];
    }
    const first = points[0];
    const last = points[points.length - 1];
    const extendedStart = { ...first, x: 0 };
    const extendedEnd = { ...last, x: 100 };
    return [extendedStart, ...points, extendedEnd];
}

function buildCurvePath(absPoints) {
    if (absPoints.length < 2) return '';
    let d = `M ${absPoints[0].x} ${absPoints[0].y}`;
    for (let i = 0; i < absPoints.length - 1; i += 1) {
        const p0 = absPoints[i];
        const p1 = absPoints[i + 1];
        const dx = (p1.x - p0.x) * 0.35;
        const c1x = p0.x + dx;
        const c1y = p0.y;
        const c2x = p1.x - dx;
        const c2y = p1.y;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.x} ${p1.y}`;
    }
    return d;
}

function buildAreaPath(absPoints, height) {
    if (absPoints.length < 2) return '';
    const corePath = buildCurvePath(absPoints);
    const lastPoint = absPoints[absPoints.length - 1];
    const firstPoint = absPoints[0];
    return `${corePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;
}

function drawSegmentedCurve(pointsLayer, relPoints, data) {
    if (!pointsLayer || relPoints.length < 2) {
        if (curveSvg) {
            const areaPath = curveSvg.querySelector('.weekly-area-path');
            if (areaPath) areaPath.setAttribute('d', '');
            const lineGroup = curveSvg.querySelector('.weekly-line-group');
            if (lineGroup) lineGroup.innerHTML = '';
        }
        return;
    }
    const box = pointsLayer.getBoundingClientRect();
    const computedWidth = box.width || pointsLayer.clientWidth || pointsLayer.offsetWidth;
    const computedHeight = box.height || pointsLayer.clientHeight || pointsLayer.offsetHeight;
    if (!computedWidth || !computedHeight) return;
    const absPoints = relPoints.map(point => ({
        x: (point.x / 100) * computedWidth,
        y: (point.y / 100) * computedHeight,
        value: point.value
    }));
    const { svg, defs, areaPath, lineGroup } = ensureCurveInfrastructure(pointsLayer);
    svg.setAttribute('viewBox', `0 0 ${computedWidth} ${computedHeight}`);
    svg.setAttribute('width', computedWidth);
    svg.setAttribute('height', computedHeight);
    updateAreaGradient(defs, computedHeight, data.thresholds);
    ensureLineFilter(defs);
    ensureAreaFilter(defs);
    const areaD = buildAreaPath(absPoints, computedHeight);
    areaPath.setAttribute('d', areaD);
    areaPath.setAttribute('fill', `url(#${CONSISTENCY_AREA_GRADIENT_ID})`);
    areaPath.setAttribute('fill-opacity', '0.92');
    areaPath.setAttribute('filter', `url(#${CONSISTENCY_AREA_FILTER_ID})`);
    lineGroup.innerHTML = '';
    const thresholdValues = getSegmentThresholds(data.thresholds);
    for (let i = 0; i < absPoints.length - 1; i += 1) {
        const baseSegment = createCubicSegment(
            absPoints[i],
            absPoints[i + 1],
            absPoints[i].value,
            absPoints[i + 1].value
        );
        const splitSegments = splitSegmentByThresholds(baseSegment, thresholdValues);
        splitSegments.forEach(seg => {
            const segmentPath = document.createElementNS(SVG_NS, 'path');
            segmentPath.setAttribute('d', cubicSegmentToPath(seg));
            const avg = (seg.v0 + seg.v1) / 2;
            const color = getConsistencyBucket(avg, data.thresholds).color;
            segmentPath.setAttribute('fill', 'none');
            segmentPath.setAttribute('stroke', color);
            segmentPath.setAttribute('stroke-width', '2');
            segmentPath.setAttribute('stroke-linecap', 'round');
            segmentPath.setAttribute('stroke-linejoin', 'round');
            segmentPath.setAttribute('filter', `url(#${CONSISTENCY_LINE_FILTER_ID})`);
            lineGroup.appendChild(segmentPath);
        });
    }
}

function getEdgePaddingPct(slotCount) {
    return slotCount > 1 ? CONSISTENCY_EDGE_PADDING_PCT : 0;
}

// Vertical padding percentage for chart top/bottom to prevent overlap with summary chips
const CONSISTENCY_VERTICAL_PADDING_PCT = 8;

function yFromPoints(pts) {
    const clamped = Math.max(0, Math.min(pts, MAX_CONSISTENCY_POINTS));
    // Map 0-100% to paddingPct to (100 - paddingPct) range
    const rawPct = (1 - clamped / MAX_CONSISTENCY_POINTS) * 100;
    const paddedRange = 100 - (CONSISTENCY_VERTICAL_PADDING_PCT * 2);
    return CONSISTENCY_VERTICAL_PADDING_PCT + (rawPct / 100) * paddedRange;
}

function renderPoints(data) {
    const pointsLayer = document.getElementById('weekly-chart-points');
    if (!pointsLayer) return;
    pointsLayer.querySelectorAll('.weekly-point').forEach(el => el.remove());
    pointsLayer.querySelectorAll('.weekly-skip-label').forEach(el => el.remove());
    if (curveSvg) {
        curveSvg.remove();
        curveSvg = null;
    }
    const axisWeeks = data.axisWeeks.length ? data.axisWeeks : data.series.map(entry => entry.week);
    const totalSlots = axisWeeks.length || data.series.length || 1;
    if (!data.series.length) return;
    const curvePoints = [];
    const spanSlots = Math.max(1, totalSlots - 1);
    const edgePaddingPct = getEdgePaddingPct(totalSlots);
    data.series.forEach(entry => {
        const slotIndex = Math.max(0, axisWeeks.indexOf(entry.week));
        const pctX = totalSlots === 1
            ? 50
            : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
        const pctY = yFromPoints(entry.pts);
        curvePoints.push({ x: pctX, y: pctY, value: entry.pts });
        const bucket = getConsistencyBucket(entry.pts, data.thresholds);
        const pointEl = document.createElement('div');
        pointEl.className = 'weekly-point';
        pointEl.dataset.zone = bucket.name;
        pointEl.style.setProperty('--point-color', bucket.color);
        pointEl.style.left = `${pctX}%`;
        pointEl.style.top = `${pctY}%`;
        const label = document.createElement('div');
        label.className = 'weekly-point-label';
        label.classList.add(`weekly-point-label--${bucket.name}`);
        const suffix = document.createElement('span');
        suffix.className = 'weekly-point-label__suffix';
        // Show the week number (e.g. "wk2", "wk11") instead of generic "fpts"
        suffix.textContent = `wk${entry.week}`;
        const valueSpan = document.createElement('span');
        valueSpan.className = 'weekly-point-label__value';
        const valueNumber = document.createElement('span');
        valueNumber.style.color = bucket.color;
        const rawValue = Number.isFinite(entry.originalPts) ? entry.originalPts : entry.pts;
        valueNumber.textContent = Number.isFinite(rawValue) ? rawValue.toFixed(1) : '—';
        valueSpan.appendChild(valueNumber);
        if (Number.isFinite(rawValue) && rawValue > MAX_CONSISTENCY_POINTS) {
            label.classList.add('weekly-point-label--capped');
        }
        label.appendChild(suffix);
        label.appendChild(valueSpan);
        pointEl.appendChild(label);
        pointsLayer.appendChild(pointEl);
    });
    // Add markers for skipped weeks (BYE/OUT/etc.) positioned on the line between surrounding games
    const skipped = data?.skippedLabels || {};
    const playedWeekSet = new Set(data.series.map(entry => entry.week));
    axisWeeks.forEach((week, slotIndex) => {
        if (!skipped[week]) return;
        if (playedWeekSet.has(week)) return; // should not happen, but guard
        const pctX = totalSlots === 1
            ? 50
            : edgePaddingPct + ((100 - edgePaddingPct * 2) * (slotIndex / spanSlots));
        // Find surrounding played weeks to interpolate y
        const prev = [...data.series].reverse().find(entry => entry.week < week);
        const next = data.series.find(entry => entry.week > week);
        let interpPts = null;
        if (prev && next && next.week !== prev.week) {
            const t = (week - prev.week) / (next.week - prev.week);
            interpPts = prev.pts + (next.pts - prev.pts) * t;
        } else if (prev) {
            interpPts = prev.pts;
        } else if (next) {
            interpPts = next.pts;
        }
        if (!Number.isFinite(interpPts)) return;
        const pctY = yFromPoints(interpPts);
        const marker = document.createElement('div');
        marker.className = 'weekly-skip-label';
        marker.textContent = skipped[week];
        marker.style.left = `${pctX}%`;
        marker.style.top = `${pctY}%`; // sit on the line
        pointsLayer.appendChild(marker);
    });
    const extendedCurvePoints = extendCurvePoints(curvePoints);
    drawSegmentedCurve(pointsLayer, extendedCurvePoints, data);
}

function hydrateProgressCircles(data) {
    const consistencyCircle = document.querySelector('.progress-circle--consistency .progress-ring-fill');
    const pctValue = data && Number.isFinite(data.consistencyPct) ? Math.max(0, Math.min(100, data.consistencyPct)) / 100 : 0;
    if (consistencyCircle) {
        consistencyCircle.style.setProperty('--progress', pctValue.toFixed(3));
    }
    const ceilingCircle = document.querySelector('.progress-circle--ceiling .progress-ring-fill--ceiling');
    if (ceilingCircle) {
        const rankMax = Math.max(2, data?.ceilingRankMax || 24);
        const rank = Number.isFinite(data?.ceilingRank) ? data.ceilingRank : rankMax;
        const normalized = Math.max(0, Math.min(1, (rankMax - rank) / (rankMax - 1)));
        ceilingCircle.style.setProperty('--progress', normalized.toFixed(3));
    }
}

// === Legacy Loading Ring Animation ===
// The orbit-ring loader markup was replaced with the Stats-style spinner, but this is kept as a no-op fallback
// (it exits early when `.loading-ring` is not present).
(function () {
    const RUNTIME_MS = 14000;
    let raf = null;
    function tick(start, ring) {
        const t = performance.now();
        const elapsed = (t - start) % RUNTIME_MS;
        const angle = (elapsed / RUNTIME_MS) * 360;
        ring.style.setProperty('--angle', angle + 'deg');
        raf = requestAnimationFrame(() => tick(start, ring));
    }
    function startRing(el) {
        if (!el) return;
        if (raf) cancelAnimationFrame(raf);
        tick(performance.now(), el);
    }
    function observeLoading() {
        const loading = document.getElementById('loading');
        if (!loading) return;
        const ring = loading.querySelector('.loading-ring');
        if (!ring) return;
        const run = () => {
            const hidden = loading.classList.contains('hidden');
            if (hidden) {
                if (raf) { cancelAnimationFrame(raf); raf = null; }
            } else {
                if (!raf) startRing(ring);
            }
        };
        run();
        const obs = new MutationObserver(run);
        obs.observe(loading, { attributes: true, attributeFilter: ['class'] });
        window.addEventListener('visibilitychange', run);
        window.addEventListener('pageshow', run);
        window.addEventListener('pagehide', () => { if (raf) { cancelAnimationFrame(raf); raf = null; } });
        window.addEventListener('resize', run);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeLoading);
    } else {
        observeLoading();
    }
})();
