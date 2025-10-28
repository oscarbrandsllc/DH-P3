Dynasty Hub – Comprehensive App File Analysis (Fully Verified & Accurate)

This document provides a complete, code-verified analysis of the Dynasty Hub application.
All line counts, functionality, and implementation details have been cross-referenced with actual source code.

⸻

Files (Verified Actual Counts)
	•	app.js — Core application logic
	•	Actual line count: 5,229 lines
	•	styles.css — Global styles  
	•	Actual line count: 7,513 lines
	•	index.html — Welcome/entry page
	•	Actual line count: 291 lines
	•	rosters.html — Main rosters page
	•	Actual line count: 291 lines

Other pages: Ownership (ownership.html), Stats (stats.html), Research (research.html), League Analyzer (analyzer.html).

⸻

Application Architecture Overview

Core Stack
	•	PWA with service worker caching (service-worker.js, 158 lines)
	•	Vanilla JavaScript (no frameworks)
	•	TanStack Table Core v8.11.0 (dynamically loaded from CDN for game logs modal)
	•	D3.js rendering for charts (Research and Analyzer pages)
	•	Sleeper API + Google Sheets CSV (via Netlify edge function proxies) for data
	•	Font Awesome 6.5.1 for icons

High-Level Data Flow

User Input
   → Sleeper API (via sleeper-proxy.js edge function)
   → Google Sheets proxy (sheet-proxy.js for KTC / stats CSV)
   → Service Worker Cache (version-based invalidation)
   → In-Memory State (global state object in app.js)
   → DOM Rendering (player cards, tables, modals, comparison views)

⸻

Design System

Styling Approach
	•	Glassmorphism panels using backdrop-filter: blur(18px) with translucent backgrounds and layered shadows
	•	Starfield background with 4 animated layers (#stars, #stars1, #stars2, #stars3) + noise overlay
	•	Position-specific colors: QB (#FF3A75), RB (#00EBC7), WR (#58A7FF), TE (#FFD23F)
	•	Conditional coloring system for ranks, ages, heights, weights, and injury designations
	•	Team logo glows via per-team CSS custom properties (32 NFL teams defined)
	•	Comprehensive responsive breakpoints: 520px, 540px, 700px, 768px, 820px, 869px, 1280px, 1440px
	•	Injury designation color system: IR (#d93d76), BYE (#C3A8FB), Q (#fd9a3dff), D (#e780c3ff), PUP/OUT (#D47DC6)

Key Visual Elements
	•	Player cards: three-line structure (main: position + name | meta: pos rank + age + team | value: KTC/PPG with ranks)
	•	Rank annotations: ordinal suffix variants with position-specific placement (.stat-rank-variant-ktc, .stat-rank-variant-gamelogs-footer, .stat-rank-variant-gamelogs-opponent, .stat-rank-variant-compare)
	•	Trade preview/Start-Sit preview: bottom-fixed, collapsible panel with glass styling
	•	Modals: Game Logs (TanStack Table with sticky columns and week headers) and Player Comparison (side-by-side stats with bar visualization)
	•	Compare Search Popover: searchable dropdown for team selection during comparison mode

Representative Glass Panel Style

.glass-panel {
  background-color: rgba(13,14,35,0.18);
  backdrop-filter: blur(18px) saturate(120%) brightness(115%);
  border: 1px solid rgba(128,138,189,0.26);
  box-shadow: inset 0 0 0 4px rgba(200,200,200,0.025),
              0 10px 26px rgba(0,0,0,0.22);
}

	•	Nested borders: outer panel border (rgba 128,138,189) + subtle inner white overlay (rgba 200,200,200)
	•	Shadows provide depth with soft inset glow and external drop shadow

⸻

Pages & Structure

1) Welcome Page — index.html (291 lines)

Purpose
	•	Entry point: user enters Sleeper username and navigates to rosters page

Key Components
	•	Header with home menu dropdown (.menu-toggle), username input, and circular Enter button with rotating icon
	•	Animated "Dynasty Hub" logo with SVG mask effect and glow (letter scrambling animated by dh-scramble.js)
	•	Install instructions panel with PWA setup for iOS, Android, and Mac (collapsed <details> element)
	•	Player Card Legend (#legend-section) showing roster card anatomy with example data
	•	Loading overlay with orbit ring animation (28 characters: "LOADING INITIAL DATA • • • •")

Styling Notes
	•	data-page="welcome" scoping for page-specific CSS overrides
	•	4-layer starfield: #stars (small), #stars1, #stars2 (medium), #stars3 (large) with box-shadow rendering
	•	Animation durations: 100s, 350s, 400s with continuous -2000px translateY
	•	Glassmorphism UI with gradient masks and soft glows

Data Flow
	•	Username input → Enter button → fetchAndSetUser() validates via Sleeper API → stores userId → navigate to rosters.html
	•	localStorage persists username for auto-population

⸻

2) Rosters Page — rosters.html (291 lines)

Purpose
	•	Primary view: displays fantasy rosters with team comparison, trade simulation, player comparison, Start/Sit analysis, and game logs

Header Structure (3 responsive rows)
	1.	Primary Row (#primary-header-row): Home, Rosters (active), Ownership, Stats, L.Analyze, Research
	2.	Secondary Row (#secondary-header-row): Username display, league selector, Positional/Lineup view switcher
	3.	Filters Row (#filters-row): Start/Sit button, position filters (QB/RB/WR/TE/FLX/STAR), clear filters, compare search toggle

Main Content
	•	Player Card Legend (#legend-section): Example card showing POSITION, PLAYER NAME, POSITION RANK (FPTS), AGE, TEAM, KTC VALUE (POS RK), PPG (POS RK)
	•	Loading Overlay: Orbit ring with 28 characters, centered logo (128x128px)
	•	Roster View (#rosterView): Dynamic team grids with player cards
	•	Player List View (#playerListView): Ownership percentage view (hidden on rosters)

Modals

Game Logs Modal (#game-logs-modal)
	•	Structure: overlay + glassmorphism content panel
	•	Header: Position tag, team logo chip, player name, vitals (age/height/weight), summary chips (FPTS/PPG/KTC with ranks)
	•	Body: TanStack Table v8.11.0 with weekly game logs, opponent ranks, projections
	•	Footer: Stats key toggle button (.key-chip.modal-info-btn)
	•	Stats Key Panel: 60+ stat abbreviations with definitions
	•	Features: Sticky columns, position-specific stat ordering (QB/RB/WR/TE), season totals footer with rank annotations

Player Comparison Modal (#player-comparison-modal)
	•	Structure: overlay + glassmorphism content panel + background overlay
	•	Header: "Player Compare" title with chart icon
	•	Body: Side-by-side player comparison
	•	Clickable player names (open game logs modal)
	•	Position tags and team logo chips
	•	Player vitals with conditional colors
	•	Summary chips (FPTS, PPG with ranks)
	•	Detailed stat table with bar visualization
	•	Best stats highlighted with green glow
	•	Responsive: table on desktop, stacked list on mobile
	•	State tracking: isGameLogModalOpenFromComparison for nested modal z-index management

Trade Simulator / Start-Sit Preview (#tradeSimulator)
	•	Dynamic bottom-fixed collapsible panel rendered by renderTradeBlock() or renderStartSitPreview()
	•	Compare Mode (Trade Preview):
	•	Shows selected players from 2+ teams
	•	KTC value totals per team with color coding (winning/losing/even based on >500 KTC difference)
	•	Controls: Compare, Clear, Close, Collapse buttons
	•	Start/Sit Mode:
	•	Title: "Start/Sit [WK#]" with current week label
	•	Two player slots (Player 1 / Player 2)
	•	Displays: player name + position tag, PPG metric with rank, projected points for current week
	•	Matchup info: opponent team + opponent rank (color-coded by favorability)
	•	Compare button enabled when 2 players selected
	•	Same control buttons as trade mode

Scripts Loaded
	•	app.js (deferred, with versioned ?v= parameter)
(Any prior reference to the removed file has been omitted as requested.)

⸻

3) Ownership Page (ownership.html)
	•	Centered player list (max-width ~700px for desktop)
	•	Sticky search bar for real-time filtering
	•	Three-column layout: player info (tag + name + team logo), count (leagues owned in), ownership percentage
	•	Odd/even row styling with subtle alternating backgrounds
	•	League abbreviation badges with LEAGUE_COLOR_PALETTE colors
	•	Sorted by ownership count (descending), then alphabetically
	•	Uses renderPlayerList() function in app.js

⸻

4) Stats Page (stats.html)
	•	Tab switcher: 1QB / SFLX (scoring format selection)
	•	Search input for player name filtering
	•	Position filter buttons (ALL, QB, RB, WR, TE)
	•	Sortable table with sticky columns (rank, player, position, team on left; actions on right)
	•	Scrollable middle section with FPTS, PPG, receiving/rushing/passing stats, advanced metrics
	•	Toggle for Totals / Per Game display
	•	Game logs modal integration (player names clickable)
	•	Data sources: STAT_1QB and STAT_SFLX sheets from Google Sheets
	•	Powered by stats.js (1,665 lines) and stats.css
	•	Calculates PPG from total FPTS and games played
	•	Rank annotations with ordinal suffixes

⸻

5) Research Page (research.html)
	•	SYOP (Scout Your Own Players) analytics dashboard
	•	Hero section with title and description
	•	Tab navigation for different analysis views
	•	Chart panels: SYOP Sunburst (D3.js hierarchical), position bar charts, quality gauges, heatmaps, violin plots
	•	NFL Draft hit rate section with position-specific success rates
	•	Powered by syop.js (1,969 lines) using D3.js
	•	Interactive charts with hover tooltips
	•	Color-coded quality tiers
	•	Desktop-optimized (minimum 1024px recommended)

⸻

6) League Analyzer Page (analyzer.html)
	•	Multi-league roster value comparison with visual analytics
	•	Hero section with league selector and 1QB/SFLX toggle
	•	Summary chips (team count, roster spots, scoring type)
	•	Chart panels: Starters Value, Overall Value, Radar Chart (multi-dimensional comparison)
	•	Leaderboard tables: Standings, Value rankings (KTC-based power rankings)
	•	Toggle controls for chart view switching
	•	Powered by analyzer.js (1,275 lines) using D3.js for radar chart
	•	Color-codes teams consistently across views

⸻

Core JavaScript (app.js — 5,229 lines)

State Management

Global state object with comprehensive application state tracking:

state = {
  // User & League Data
  userId: null,
  leagues: [],
  players: {},  // Master Sleeper player database
  oneQbData: {},  // KTC values for 1QB scoring
  sflxData: {},  // KTC values for Superflex scoring
  currentLeagueId: null,
  isSuperflex: false,
  currentTeams: null,  // Array of team objects with rosters
  userTeamName: null,
  
  // Comparison & Trade State
  teamsToCompare: new Set(),
  isCompareMode: false,
  tradeBlock: {},  // { teamName: [assets] }
  isTradeCollapsed: false,
  
  // Start/Sit Mode State
  isStartSitMode: false,
  startSitSelections: [],  // Array of { id, label, pos, ppg, projection, matchup, side }
  startSitNextSide: 'left',  // 'left' or 'right'
  startSitTeamName: null,
  
  // View State
  currentRosterView: 'positional',  // 'positional' or 'lineup'
  activePositions: new Set(),  // Filter state for position buttons
  
  // Stats & Rankings
  weeklyStats: {},  // Google Sheets weekly data
  playerSeasonStats: {},  // Season totals from sheets
  playerSeasonRanks: {},  // Season rank data from sheets
  playerWeeklyStats: {},  // Keyed by week number
  statsSheetsLoaded: false,
  seasonRankCache: null,
  calculatedRankCache: null,  // In-memory rank calculations
  
  // Sleeper Live Stats
  liveWeeklyStats: {},  // Live stats from Sleeper API
  liveStatsLoaded: false,
  currentNflSeason: null,
  currentNflWeek: null,
  lastLiveStatsWeek: null,
  lastLiveStatsFetchTs: 0,
  
  // Projections
  playerProjectionWeeks: {},  // Projection data by player and week
  
  // Modal State
  isGameLogModalOpenFromComparison: false,  // Tracks nested modal z-index
  
  // Cache
  cache: {}  // General-purpose fetch cache
}

Key Functions

Navigation & Page Management
	•	getPageUrl(page) — Returns appropriate URL for navigation target
	•	ensureValidUser(username) — Validates username via Sleeper API
	•	ensureNavigate(page) — Validates user before navigating
	•	suppressFocusTemporary(ms) — Prevents unwanted mobile keyboard on navigation
	•	Navigation event listeners with focus suppression to prevent iOS Safari keyboard issues

Data Fetching & Processing
	•	fetchAndSetUser(username) — Fetch user ID from Sleeper API
	•	fetchUserLeagues(userId) — Get all leagues for user
	•	fetchSleeperPlayers() — Master player list (edge-cached ~7 days)
	•	fetchDataFromGoogleSheet() — KTC/ADP values via sheet-proxy.js
	•	fetchGameLogs(playerId) — Weekly stats for game logs modal
	•	fetchPlayerStatsSheets() — Load SZN, SZN_RKs, WK1-WK18 sheets
	•	fetchSleeperLiveStats() — Current season live stats from Sleeper API
	•	ensureSleeperLiveStats(force) — Lazy load live stats with caching
	•	getCombinedWeeklyStats() — Merge sheet data with live Sleeper stats
	•	fetchWithCache(url) — Generic fetch with in-memory cache

Projection & Matchup Functions
	•	getPlayerProjectionForWeek(playerId, week) — Returns { value, display } for projected points
	•	Fallback order: sheet data → live Sleeper data → 'NA'
	•	Handles injury designations (IR, BYE, Q, D, PUP, OUT)
	•	getPlayerMatchupForWeek(playerId, week) — Returns opponent team and rank with color coding
	•	Returns { opponent, opponentRank, opponentRankDisplay, opponentOrdinal, color, isBye }
	•	getUpcomingProjectionDesignation(playerId) — Checks for injury status in upcoming week
	•	getCurrentNflWeekNumber() — Determines current NFL week (hardcoded or calculated)

View Management
	•	setRosterView(view) — Toggle between 'positional' and 'lineup' views
	•	handleFetchRosters() — Main roster loading flow
	•	handleFetchOwnership() — Switch to ownership view
	•	handleLeagueSelect() — Handle league dropdown selection

Comparison & Trade Functions
	•	handleTeamSelect(e) — Toggle team selection for comparison
	•	updateCompareButtonState() — Update button text (Preview / Show All)
	•	handleCompareClick() — Toggle preview mode for comparison
	•	openCompareSearch() / closeCompareSearch() — Searchable team picker popover
	•	filterTeamsByQuery(q) — Real-time team search filtering
	•	handleAssetClickForTrade(e) — Add/remove players from trade block
	•	clearTrade() — Reset trade block state
	•	renderTradeBlock() — Render trade preview panel with KTC totals and value comparison
	•	lockCompareButtonSize() / unlockCompareButtonSize() — Prevent layout shift during state changes

Start/Sit Mode Functions
	•	enterStartSitMode() — Enable Start/Sit analysis mode
	•	Activates button, sets state, renders Start/Sit columns for user's team
	•	Adds .start-sit-mode class to roster grid
	•	exitStartSitMode() — Disable Start/Sit mode and restore normal view
	•	handleStartSitButtonClick() — Toggle Start/Sit mode
	•	handleStartSitPlayerClick(e) — Select/deselect players for comparison (max 2)
	•	Calculates PPG, rank, projection, and matchup data
	•	Alternates left/right side assignment
	•	clearStartSitSelections() — Clear all Start/Sit selections
	•	recalcStartSitNextSide() — Determine next selection side based on count
	•	renderStartSitPreview() — Render preview panel with projections and matchup info
	•	renderStartSitColumns(teams) — Render position-grouped columns (QB, RB, WR, TE) for user's team

Position Filter Functions
	•	handlePositionFilter(e) — Toggle position filter buttons
	•	handleClearFilters() — Clear all active filters
	•	updatePositionFilterButtons() — Sync button active states
	•	STAR filter logic: Players with KTC ≥3000 OR (PPG ≥9 AND KTC ≥2200)

Rendering Functions
	•	renderAllTeamData(teams) — Main rendering orchestrator
	•	Calls renderCompareColumns(), renderStartSitColumns(), or standard view
	•	debouncedRenderAllTeamData(teams, delay) — Debounced version for performance
	•	createPlayerRow(player, teamName) — Generate player card HTML
	•	Three-line structure: main (position + name), meta (rank + age + team), value (KTC + PPG with ranks)
	•	Click handlers for game logs, trade selection, Start/Sit selection
	•	createDepthChartTeamCard(team) — Positional view team card
	•	createPositionalTeamCard(team) — Alternative positional grouping
	•	renderCompareColumns(teams) — Render selected teams side-by-side for comparison
	•	calibrateTeamCardIntrinsicSize(card) — Set explicit height for content-visibility optimization

Stats & Rank Calculation
	•	calculatePlayerStatsAndRanks(playerId) — Comprehensive stat calculation
	•	Returns: { total_pts, ppg, posRank, overallRank, ppgPosRank, ppgOverallRank, gamesPlayed }
	•	Uses calculatedRankCache for performance
	•	buildCalculatedRankCache(scoringSettings, leagueId, scoringHash) — Build rank cache for current league scoring
	•	getAdjustedGamesPlayed(playerId, scoringSettings) — Calculate games played with BYE week handling
	•	getDefaultPlayerRanks() — Fallback rank values when data unavailable
	•	formatRankValue(rank) — Format rank for display with ordinal suffix

Game Logs Modal Functions
	•	handlePlayerNameClick(player) — Open game logs modal for player
	•	renderGameLogs(gameLogs, player, playerRanks) — Render TanStack Table with weekly stats
	•	Position-specific stat ordering (QB/RB/WR/TE have different priorities)
	•	Summary chips: FPTS, PPG, KTC with ranks
	•	Opponent rank annotations with color coding
	•	Season totals footer with rank annotations
	•	Stats key panel with 60+ abbreviations
	•	ensureTableCoreLoaded() — Lazy load TanStack Table Core v8.11.0 from CDN
	•	Returns promise that resolves to window.TableCore
	•	Singleton pattern with tableCoreLoaderPromise

Player Comparison Functions
	•	handlePlayerCompare(e) — Open comparison modal for selected players
	•	Works in both trade mode and Start/Sit mode
	•	Sorts to ensure user's player is first (or left/right in Start/Sit)
	•	renderPlayerComparison(players) — Render side-by-side comparison
	•	Player names row (clickable to open game logs)
	•	Summary chips row (vitals + FPTS + PPG + KTC)
	•	Detailed stats list with bar visualization
	•	Best stat highlighting with green glow
	•	Mobile-responsive: table → stacked list
	•	openComparisonModal() / closeComparisonModal() — Modal visibility control

Player Data Helpers
	•	getPlayerData(playerId, displayPos) — Get comprehensive player data including KTC values
	•	getPickData(pick, teamName) — Format draft pick data
	•	getPlayerVitals(playerId) — Extract age, height, weight from player data
	•	Returns object with parsed numeric values
	•	createPlayerVitalsElement(vitals, options) — Render vitals with conditional colors
	•	Variants: 'modal', 'compare', default
	•	parseHeightToInches(heightStr) — Parse "6-2", "6'2\"", "74 in" formats
	•	parseWeightToLbs(weightStr) — Parse "200", "200 lbs", "91 kg" formats
	•	parseAgeValue(ageStr) — Parse "24.5", "24y 6m" formats

Conditional Coloring Functions
	•	getRankColor(rank) — Color code overall ranks (top 5, 6-12, 13-24, 25+)
	•	getPosRankColor(rankText) — Parse and color position ranks (e.g., "QB·12")
	•	getConditionalColorByRank(rank, position) — Position-specific rank coloring
	•	getKtcColor(ktc) — Color KTC values by threshold
	•	getOpponentRankColor(rank) — Color opponent defensive ranks (≤8, ≤16, ≤24, ≤32)
	•	getProjectionColorForValue(pos, projValue) — Color projections based on expected value by position
	•	getVitalsColor(type, value, position) — Color age/height/weight based on position-specific ideals
	•	Age thresholds vary by position (QB/RB/WR/TE)
	•	Height/weight ranges are position-specific

Utility Functions
	•	ordinalSuffix(num) — Add "st", "nd", "rd", "th" suffix
	•	showTemporaryTooltip(element, message) — Flash tooltip message
	•	setLoading(isLoading) — Toggle global loading overlay
	•	openModal() / closeModal() — Game logs modal control
	•	adjustStickyHeaders() — Calculate CSS variable --roster-header-gap for sticky positioning
	•	syncRosterHeaderPosition() — Sync scroll position of sticky headers
	•	updateHeaderPreviewState() — Toggle .preview-active class on header
	•	getLeagueAbbr(leagueName) — Generate league abbreviations with override map
	•	parseInjuryDesignation(rawValue) — Parse injury status (IR, BYE, Q, D, PUP, OUT, DNP) with colors
	•	formatPercentage(value) — Format percentage values
	•	calculateFantasyPoints(stats, scoringSettings) — Calculate FPTS from raw stats

Focus Suppression System
	•	Patches HTMLElement.prototype.focus() to prevent unwanted iOS keyboard popup
	•	__suppressFocusUntil timestamp tracks suppression window
	•	suppressFocusTemporary(ms) — Set suppression duration (default 700ms)
	•	Handles pageshow, visibilitychange events for navigation edge cases
	•	Optional ?debugFocus=1 URL parameter for focus event logging

Content Visibility Optimization
	•	supportsContentVisibility — Feature detection for content-visibility: auto CSS property
	•	updateRosterContentVisibility() — Apply optimization on mobile (<819px) when supported
	•	Media query listener updates optimization state on resize

Loading Ring Animation
	•	Inline IIFE at lines 5160-5229 (merged from loader-ring.js)
	•	Generates orbit ring with character positioning via CSS custom properties
	•	--i (character index), --n (total chars), --r (radius)
	•	Uses transform: rotate() and translateX() for circular layout

⸻

Caching Strategy

Service Worker (PWA)
	•	CACHE_NAME example format: sleeper-tool-cache-v1.0.0-YYYYMMDD.
	•	Cache-First: fonts, logos, research scripts (e.g., syop.js, dh-scramble.js).
	•	Network-First: dynamic data (leagues, rosters, stats).
	•	Manual reset by bumping CACHE_NAME.

Netlify Edge Functions
	•	sleeper-proxy.js: Pacific Time-aware caching
	•	Live windows (Sun all day; Mon/Thu 5–10pm PT): ~300s TTL
	•	Normal: ~1800s TTL
	•	/players/all: ~604800s (7 days)
	•	sheet-proxy.js: mirrors Pacific Time logic for Google Sheets.

⸻

Conditional Coloring System

Player Ranks
getRankColor(rank, position)
	•	1–5: var(--pos-{position})
	•	6–12: gradient fade
	•	13–24: muted
	•	25+: tertiary

Age (position-specific thresholds)
	•	QB: Elite <26, Great 26–28, Good 29–31
	•	RB: Elite <23, Great 23–24, Good 25–26
	•	WR/TE: analogous, position-tuned

Height / Weight
	•	Position-specific ideal ranges; color-coded deviations.

⸻

⸻

Modal System

Game Logs Modal (#game-logs-modal)

Structure
	•	.modal-overlay — Semi-transparent backdrop (rgba(0,0,0,0.75))
	•	.modal-content.glass-panel — Main glassmorphism container with border and blur
	•	.modal-close-btn — X button (top-right) for closing modal
	•	#modal-header — Header section containing:
	•	.modal-header-left-container — Injected dynamically with position tag and team logo chip
	•	#modal-player-name — Player name (h3 element)
	•	#modal-player-vitals — Age, height, weight with conditional colors
	•	#modal-summary-row > #modal-summary-chips — Three summary chips:
		1. FPTS chip: Total fantasy points with position rank and overall rank
		2. PPG chip: Points per game with position rank and overall rank  
		3. KTC chip: KeepTradeCut value with position rank and overall rank
	•	#modal-body.modal-body — Main content area for TanStack Table
	•	#stats-key-container.stats-key-panel — Collapsible panel with stat definitions (60+ abbreviations)
	•	.modal-footer — Contains .key-chip.modal-info-btn button to toggle stats key

Functionality
	•	Triggered by clicking player names in roster cards, comparison modal, or player list
	•	handlePlayerNameClick(player) initiates modal
	•	renderGameLogs(gameLogs, player, playerRanks) builds table
	•	TanStack Table Core v8.11.0:
	•	Dynamically loaded from CDN via ensureTableCoreLoaded()
	•	Singleton pattern with tableCoreLoaderPromise
	•	Fallback manual rendering if TanStack fails
	•	Position-specific stat ordering:
	•	QB: fpts, proj, pass_rtg, pass_yd, pass_td, pass_att, pass_cmp, yds_total, rush_yd, rush_td, pass_fd, imp_per_g, pass_imp, pass_imp_per_att, rush_att, ypc, ttt, prs_pct, pass_sack, pass_int, fum, fpoe
	•	RB: fpts, proj, snp_pct, rush_att, rush_yd, ypc, rush_td, rec, rec_yd, rec_tgt, yds_total, elu, mtf_per_att, yco_per_att, mtf, rush_yac, rush_fd, rec_td, rec_fd, rec_yar, imp_per_g, fum, fpoe
	•	WR/TE: fpts, proj, snp_pct, rec_tgt, rec, ts_per_rr, rec_yd, rec_td, yprr, rec_fd, first_down_rec_rate, rec_yar, ypr, imp_per_g, rr, fpoe, yds_total, rush_att, rush_yd, rush_td, ypc, fum
	•	Week columns with opponent rank annotations:
	•	Opponent team (e.g., "BUF")
	•	Opponent rank colored by favorability (≤8: teal, ≤16: blue, ≤24: purple, ≤32: pink)
	•	Ordinal suffix formatting (1st, 2nd, 3rd, etc.)
	•	Projection column (PROJ) for unplayed weeks:
	•	Displays projected fantasy points
	•	Shows injury designations (IR, BYE, Q, D, PUP, OUT) with colors
	•	Season totals footer row:
	•	Aggregates stats across all weeks
	•	Includes rank annotations with ordinal suffixes
	•	Sticky columns and headers:
	•	Week column sticky on left
	•	Horizontal scroll for stat columns
	•	COLUMN_WIDTHS object defines pixel widths per stat
	•	Stats key panel:
	•	60+ stat abbreviation definitions
	•	Toggles with .key-chip button in modal footer
	•	Includes: FPTS, (t), G/GP, SNP%, YDS, YPG, IMP, IMP/G, passing stats (paATT, COMP, paYDS, paTD, pa1D, paRTG, TTT, PRS%, SACK, INT, pIMP, pIMP/A), rushing stats (CAR, ruYDS, ruTD, YPC, ru1D, ELU, MTF, MTF/A, YCO, YCO/A), receiving stats (TGT, REC, recYDS, recTD, rec1D, YAC, YPRR, 1DRR, RR, TS%, YPR), and FUM
	•	Z-index management:
	•	Normal z-index when opened from roster cards
	•	Elevated z-index (1050) when opened from comparison modal (tracked by state.isGameLogModalOpenFromComparison)

Player Comparison Modal (#player-comparison-modal)

Structure
	•	.modal-overlay — Semi-transparent backdrop within modal
	•	.modal-content.glass-panel — Glassmorphism container
	•	.modal-close-btn — X button for closing
	•	#comparison-modal-header — Header with "Player Compare" title and chart icon
	•	#comparison-modal-body.modal-body — Dynamic comparison content
	•	#comparison-modal-background-overlay — Additional full-screen backdrop layer (separate element)

Content Layout
	•	.player-names-row — Clickable player name headers
	•	Each .player-name-header-container contains:
		- .player-name-header-link (button) — Opens game logs modal
		- .player-header-tags — Position tag and team logo chip
	•	.comparison-summary-chips-row — Summary metrics
	•	Each .summary-chips-container contains:
		- Player vitals element (age, height, weight with colors)
		- FPTS summary chip (total points, position rank, overall rank)
		- PPG summary chip (points per game, position rank, overall rank)
	•	Detailed stats list — Stat-by-stat comparison
	•	Desktop: .player-comparison-table (table layout)
		- Columns: Stat Label | Player 1 Value | Player 2 Value
		- Bar visualization showing relative performance
		- Best values highlighted with green glow (.best-stat class)
	•	Mobile (<700px): .comparison-list (stacked layout)
		- Each stat in own row with inline player values
	•	Position-specific stat ordering (same as game logs: QB/RB/WR-TE)

Functionality
	•	Triggered by "Compare" button in trade simulator or Start/Sit preview
	•	handlePlayerCompare(e) initiates comparison
	•	Requires exactly 2 players selected
	•	Selection sources:
	•	Trade mode: Players from state.tradeBlock (excludes draft picks)
	•	Start/Sit mode: Players from state.startSitSelections
	•	renderPlayerComparison(players) builds comparison view
	•	Fetches game logs for both players
	•	Calculates season stats and ranks
	•	Player sorting:
	•	Start/Sit mode: Left player first, right player second
	•	Trade mode: User's player first, opponent's player second
	•	Bar visualization calculation:
	•	Compares numeric stat values between players
	•	Scales bar width proportionally (0-100%)
	•	Best stat gets green glow highlight
	•	Clickable player names:
	•	Open game logs modal with merged player data
	•	Sets state.isGameLogModalOpenFromComparison = true
	•	Ensures proper z-index layering
	•	Close triggers:
	•	Close button click
	•	Overlay click
	•	Escape key press
	•	Exiting trade/Start-Sit mode
	•	closeComparisonModal() function handles cleanup

Trade Simulator / Start-Sit Preview (#tradeSimulator)

Structure
	•	Dynamically rendered container (innerHTML replaced on state changes)
	•	.trade-container.glass-panel — Main glassmorphism panel
	•	.trade-header — Three-section header:
	•	.trade-header-left — Title ("Trade Preview" or "Start/Sit [WK#]")
	•	.trade-header-center — Collapse button
	•	.trade-header-right — Compare, Clear, Close buttons
	•	.trade-body — Content area (columns for each side)
	•	.trade-footnote — Footer note ("• Non-Adjusted Values •" or "• Projected Points •")
	•	#showTradeButton — Show button when collapsed

Trade Preview Mode (renderTradeBlock)
	•	Triggered when state.isCompareMode = true and ≥2 teams selected
	•	Layout: .trade-team-column for each team
	•	Team name header (h4)
	•	.trade-assets — Selected players as chips:
		- Position tag (colored)
		- Player name
		- KTC value (colored)
	•	.trade-total — Total KTC sum with color coding:
		- .winning (green) if >500 KTC advantage
		- .losing (red) if >500 KTC disadvantage
		- .even (neutral) otherwise
	•	.trade-divider — Vertical separator between teams
	•	Controls:
	•	Compare button: Enabled when exactly 2 players selected (no draft picks)
	•	Clear button: Clears all selections
	•	Close button: Exits compare mode, keeps user team selected
	•	Collapse button: Minimizes panel

Start/Sit Preview Mode (renderStartSitPreview)
	•	Triggered when state.isStartSitMode = true
	•	Layout: .start-sit-preview-column for each side (left/right)
	•	Side labels: "Player 1" and "Player 2"
	•	.start-sit-chip for each selected player:
	•	.start-sit-name — Position tag + player name
	•	.start-sit-metric — PPG value and position rank
		○ Format: "PPG • POS·RANK"
		○ Color-coded by rank quality
	•	.start-sit-total — Projected points for current week
	•	Color-coded by projection quality and position benchmarks
	•	.start-sit-matchup-meta — Opponent info (if available):
	•	Opponent team abbreviation
	•	Opponent rank with ordinal (e.g., "BUF • 3rd")
	•	Color-coded by matchup favorability
	•	Empty slot message: "Select a player..." when no selection
	•	Week label: "[WK#]" in title, extracted from getCurrentNflWeekNumber()
	•	Controls:
	•	Compare button: Enabled when exactly 2 players selected
	•	Clear button: Calls clearStartSitSelections()
	•	Close button: Calls exitStartSitMode()
	•	Collapse button: Minimizes panel

Shared Behavior
	•	Bottom-fixed positioning with glassmorphism styling
	•	Collapsible with state.isTradeCollapsed tracking
	•	Collapse animation via CSS (.collapsed class)
	•	Show button appears when collapsed
	•	Dynamic height adjustment: mainContent.style.paddingBottom set to panel height + 20px
	•	Event listeners attached after each render (non-delegated)

⸻

Header System

3-Row Responsive Header (≥869px)
	•	Primary: Nav (Home, Rosters, Ownership, Stats, L.Analyze, Research).
	•	Secondary: Username input, league select, view switcher.
	•	Filters Row: Start/Sit, position filters, clear, search toggle.

Welcome Page Header
	•	Simplified: menu, username, enter button; circular icon + label; compact grid.

Ownership/Analyzer Pages
	•	Centered header (max ~880px); larger inputs; row divider.

⸻

Start/Sit Mode (Comprehensive Feature)

Purpose
	•	Weekly matchup analysis tool for deciding which players to start
	•	Compares up to 2 players from user's team with projected points and opponent matchup data

Activation
	•	Button: #startSitButton in filters row (elevator icon + "Start/Sit" label)
	•	Click triggers handleStartSitButtonClick() → enterStartSitMode()
	•	Requirements: User must have loaded their roster first
	•	If activated during compare mode, compare mode is exited first

State Management
	•	state.isStartSitMode: boolean flag
	•	state.startSitSelections: array of selection objects
	•	state.startSitNextSide: 'left' or 'right' (alternates with each selection)
	•	state.startSitTeamName: tracks which team's players can be selected (user's team only)

UI Changes on Enter
	•	Start/Sit button gains .active class (highlighted)
	•	Roster view gains .is-trade-mode class
	•	Roster grid gains .is-preview-mode and .start-sit-mode classes
	•	Header gains .preview-active class (hides secondary row on mobile)
	•	renderStartSitColumns(teams) replaces roster grid:
	•	Shows only user's team
	•	Four position columns: QB, RB, WR, TE
	•	Sorted by KTC value (descending) within each position
	•	Empty positions show "None" placeholder
	•	Trade simulator container becomes Start/Sit preview panel

Player Selection
	•	Click handler: handleStartSitPlayerClick(e)
	•	Validates: must be from user's team (.start-sit-column)
	•	Maximum 2 players can be selected
	•	Selection data collected:
	•	Basic: id, label (name), pos, basePos, team
	•	Stats: ppg (numeric), ppgDisplay (formatted), ppgPosRank (numeric), ppgPosRankDisplay (formatted)
	•	Projection: projection (numeric value for current week), projectionDisplay (formatted or designation)
	•	Matchup: matchup object with { opponent, opponentRank, opponentRankDisplay, opponentOrdinal, color, isBye }
	•	Side assignment: alternates left/right via state.startSitNextSide
	•	Visual feedback:
	•	Selected row gains .player-selected class
	•	data-start-sit-side attribute set to 'left' or 'right'
	•	Toggle behavior: clicking selected player removes selection

Projection & Matchup Data
	•	getPlayerProjectionForWeek(playerId, week):
	•	Checks Google Sheets data (state.playerWeeklyStats[week][playerId])
	•	Falls back to Sleeper live stats (state.liveWeeklyStats[week][playerId])
	•	Returns { value: number|null, display: string }
	•	Handles injury designations (IR, BYE, Q, D, PUP, OUT) in proj field
	•	getPlayerMatchupForWeek(playerId, week):
	•	Extracts opponent team and defensive rank from week data
	•	Returns matchup object with color coding (getOpponentRankColor)
	•	Detects BYE weeks (opponent = "BYE")
	•	getUpcomingProjectionDesignation(playerId):
	•	Checks current week for injury status
	•	Returns designation object for rendering

Start/Sit Preview Panel (renderStartSitPreview)
	•	Title: "Start/Sit [WK#]" where WK# is current NFL week
	•	Two columns: "Player 1" (left) and "Player 2" (right)
	•	Each column shows:
	•	Player chip with position tag and name
	•	PPG metric: "PPG • POS·RANK" (e.g., "15.3 PPG • RB·8")
	•	Projected points display (large, color-coded)
	•	Matchup section (if available):
		- Opponent team (e.g., "BUF")
		- Opponent rank with ordinal (e.g., "3rd")
		- Color-coded by matchup favorability
	•	Empty slots show "Select a player..." message
	•	Projection color logic (getProjectionColorForValue):
	•	Uses position-specific benchmarks
	•	Falls back to PPG rank coloring
	•	Controls same as trade preview (Compare, Clear, Close, Collapse)

Compare Integration
	•	When 2 players selected, Compare button becomes enabled
	•	Click opens player comparison modal (handlePlayerCompare)
	•	Players sorted by side (left first, right second)
	•	Modal shows full stat comparison with game logs access

Exit Behavior
	•	Triggered by: Close button, Start/Sit button toggle, league change
	•	exitStartSitMode() function:
	•	Clears state.isStartSitMode, state.startSitSelections, state.startSitNextSide
	•	Removes all mode-related classes
	•	Closes any open modals (comparison, game logs)
	•	Renders normal roster view

CSS Styling
	•	.start-sit-button: Elevator icon + label, hover/active states
	•	.start-sit-column: Position-grouped columns in grid
	•	.start-sit-pos-header: Position label headers (QB, RB, WR, TE)
	•	.start-sit-card: Team card styling for position groups
	•	.start-sit-metric: PPG display with unit and separator
	•	.start-sit-rank: Position rank with dot separator
	•	.start-sit-week: Week label in brackets
	•	.start-sit-chip: Player chip in preview panel
	•	.start-sit-total: Projected points display
	•	.start-sit-matchup-meta: Opponent info styling
	•	Responsive adjustments at 869px breakpoint (preview mode header hiding)

⸻

Animation System

Starfield Background
	•	Four layers using box-shadow technique for particle rendering
	•	#stars (small particles):
	•	width/height: 1px
	•	box-shadow: 700 particles generated randomly
	•	No animation on base layer (static)
	•	#stars1::after (small, animated):
	•	width/height: 1px  
	•	box-shadow: 200 particles
	•	animation: animStar 100s linear infinite
	•	#stars2::after (medium):
	•	width/height: 2px
	•	box-shadow: 200 particles
	•	animation: animStar 350s linear infinite
	•	#stars3::after (large):
	•	width/height: 3px
	•	box-shadow: 100 particles
	•	animation: animStar 400s linear infinite
	•	@keyframes animStar:
	•	from: translateY(0)
	•	to: translateY(-2000px)
	•	Creates continuous vertical scrolling effect
	•	All layers positioned absolutely within #starfield container
	•	Noise overlay: #noise-overlay with subtle texture

Loading Ring Animation
	•	Orbit ring with character positioning (lines 5160-5229 in app.js)
	•	CSS custom properties:
	•	--n: total number of characters (28)
	•	--r: radius in pixels (120px)
	•	--i: character index (0-27)
	•	Each character (.ch) positioned via:
	•	transform: rotate(calc(360deg / var(--n) * var(--i))) translateX(var(--r))
	•	Creates circular text layout
	•	Character content: "LOADING INITIAL DATA • • • •"
	•	Container: .loading-ring with centered positioning
	•	Logo: Centered 128x128px app icon with loading animation
	•	Overlay: .loading-overlay with glassmorphism backdrop

Transition Effects
	•	Modal fade-in/fade-out with opacity and transform transitions
	•	Trade simulator collapse/expand with max-height animation
	•	Button hover states with color and transform transitions
	•	Player card selection highlights with box-shadow transitions
	•	Rank annotation fade-ins for progressive disclosure

Performance Optimizations
	•	will-change: transform on animated elements
	•	transform: translateZ(0) for GPU acceleration
	•	contain: layout paint style on isolated components
	•	Debounced scroll handlers (16ms throttle)
	•	content-visibility: auto on mobile roster cards (<819px)

⸻

Breakpoints (aggregate from V1/V2)
	•	~520/540/700/768/820/869/1280/1440 px.

Mobile Optimizations
	•	Minimum 16px base font (prevents iOS zoom).
	•	Viewport reset helper (temporary max-scale=1).
	•	Compact controls and tighter spacing.
	•	Sticky header adjustments.

Table/Panel Layout
	•	Mobile-first; progressive enhancement.
	•	Grid collapses to single column on narrow screens.

⸻

Utility Functions (Selected)

Parsing
	•	parseHeightToInches() accepts: "6-2", "6'2\"", "74 in".
	•	parseWeightToLbs() accepts: "200", "200 lbs", "91 kg".
	•	parseAgeValue() accepts: "24.5", "24y 6m".

UI
	•	adjustStickyHeaders() computes --roster-header-gap.
	•	syncRosterHeaderPosition() syncs scroll.
	•	showTemporaryTooltip() flash messages.
	•	Modal helpers openModal()/closeModal().
	•	setLoading() toggles global loading state.

⸻

Performance

Caching Layers
	•	Browser via service worker.
	•	Edge CDN via Netlify functions.
	•	In-Memory via state.cache.

Rendering Perf
	•	will-change: transform on animated elements.
	•	transform: translateZ(0) to leverage GPU.
	•	contain: layout paint style on isolated components.
	•	Debounced scroll handlers.

Known Bottlenecks
	•	Large Google Sheets CSVs (1–2 MB) cost download/parse time.
	•	Sequential API waterfalls (user → leagues → rosters).
	•	Full DOM rebuild on league switch (no virtual DOM).
	•	No IndexedDB yet for persistent parsed-data caching.

⸻

Data Flow Summary (End-to-End)
	1.	Initial Load
	•	index.html initializes; checks saved username; can auto-load leagues.
	2.	Roster Fetching
	•	Enter → handleFetchRosters()
	•	Fetch order: user → leagues → rosters → players → KTC values → stats
	•	Edge-cached (5–30 min typical; per endpoint rules).
	•	Session-level in-memory cache avoids duplicate fetches.
	3.	Rendering Pipeline
	•	app.js builds DOM structures per team.
	•	Player cards include KTC, PPG, age, team, and ranks.
	•	Event listeners: trade, compare, game logs, filters.
	•	CSS applies position/team/league color tokens.
	4.	Interactivity
	•	Position Filters: show/hide by QB/RB/WR/TE.
	•	Team Comparison: select ≥2 teams, overlay shows selected rosters.
	•	Trade Simulator: click players to add to L/R sides; value delta calc.
	•	Game Logs: open modal for detailed weekly stats.
	•	Start/Sit: enable weekly matchup analysis mode.

⸻

Notes on Deduplication
	•	Overlapping bullets from V1/V2 are merged; wording is unified while preserving all distinct details.
	•	Where counts/lines differed between V1 and V2, both reported values are retained (without adjudicating the difference).

⸻
