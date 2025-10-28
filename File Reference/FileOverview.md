Dynasty Hub – Comprehensive App File Analysis (Merged V1 + V2)

This merge consolidates Version 1 and Version 2 without duplicates, preserving all non-identical details.
All references specific to loader-ring.js have been removed (per instructions).
Version 3 text is untouched and excluded here.

⸻

Files (as reported)
	•	app.js — Core application logic
	•	Line count noted as 5,136 (V1) and 5,135 (V2).
	•	styles.css — Global styles
	•	Line count noted as 7,512 (V1) and 2,973 (V2).
	•	index.html — Welcome/entry page (V1/V2)
	•	rosters.html — Main application page (V1/V2)

Other pages described functionally below: Ownership, Stats, Research, League Analyzer.

⸻

Application Architecture Overview

Core Stack
	•	PWA with service worker caching.
	•	Vanilla JavaScript (no frameworks).
	•	TanStack Table Core for game logs.
	•	D3.js-style rendering for charts (Research page).
	•	Sleeper API + Google Sheets CSV (via edge proxies) for data.

High-Level Data Flow

User Input
   → Sleeper API (via edge-function proxy)
   → Google Sheets proxy (KTC / stats CSV)
   → Service Worker Cache
   → In-Memory State (app.js)
   → DOM Rendering (player cards, tables, modals)


⸻

Design System

Styling Approach
	•	Glassmorphism panels using backdrop-filter: blur() with translucent borders and layered shadows.
	•	Starfield background (4 animated layers + noise overlay).
	•	Position-specific colors (QB, RB, WR, TE).
	•	Conditional coloring for ranks, ages, heights, and weights.
	•	Team logo glows via per-team CSS variables.
	•	Responsive breakpoints used across the app (noted values across V1/V2 include: 520/540/700/768/820/869/1280/1440 px).

Key Visual Elements
	•	Player cards: three-line structure (main/meta/value).
	•	Rank annotations: ordinal suffix variants.
	•	Trade preview: bottom-fixed, collapsible panel.
	•	Modals: Game Logs (TanStack table) and Player Comparison (side-by-side).

Representative Glass Panel Style

.glass-panel {
  background-color: rgba(13,14,35,0.18);
  backdrop-filter: blur(18px) saturate(120%) brightness(115%);
  border: 1px solid rgba(128,138,189,0.26);
  box-shadow: inset 0 0 0 4px rgba(200,200,200,0.025),
              0 10px 26px rgba(0,0,0,0.22);
}

	•	Nested borders: outer panel border + subtle inner white overlay.
	•	Shadows provide depth and a soft inset glow.

⸻

Pages & Structure

1) Welcome Page — index.html

Purpose
	•	Entry point: user enters Sleeper username and proceeds to rosters.

Key Components
	•	Header with hamburger menu (.menu-toggle), username input, and Enter button (triggers roster fetching).
	•	Animated logo with SVG mask effect, “Dynasty Hub” title (animated by dh-scramble.js).
	•	Install instructions (PWA setup for iOS/Android/Mac).
	•	Player Card Legend (hidden by default): keys for KTC value, ADP, position ranks.
	•	Loading overlay with animated ring and “LOADING INITIAL DATA” text.

Styling Notes
	•	data-page="welcome" scoping for page-specific CSS.
	•	4-layer starfield background: #stars, #stars1, #stars2, #stars3.
	•	Glassmorphism UI with gradient glow masks.

Data Flow (V2)
	•	Username → Enter (#rostersButton) → app.js validates via Sleeper API → navigate to rosters.html.

⸻

2) Rosters Page — rosters.html

Purpose
	•	Display fantasy rosters across leagues; comparisons, trade simulation, logs.

Header (3 rows)
	1.	Primary Nav: Home, Rosters, Ownership, Stats, L.Analyze, Research.
	2.	Context: username display, league selector, view switcher (Positional/Lineup).
	3.	Filters: Start/Sit button, position filters (QB/RB/WR/TE/ALL), clear filters, team comparison controls.

Main Content
	•	Player Card Legend: roster-specific labels (e.g., POSITION RANK (FPTS), PPG (POS RK)).
	•	Loading Overlay with “LOADING INITIAL DATA” (28 characters in the ring noted).
	•	Roster View (#rosterView): team roster grids (rendered by app.js).
	•	Player List View (#playerListView): alternative ownership % view (normally hidden on rosters).

Modals
	•	Game Logs (#game-logs-modal)
	•	Weekly player stats; extensive stat key (60+ abbreviations).
	•	Footer Key button toggles stat definitions panel.
	•	Player Comparison (#player-comparison-modal)
	•	Side-by-side stat comparison with highlights/bar visualization.

Scripts Loaded
	•	app.js (deferred).
(Any prior reference to the removed file has been omitted as requested.)

⸻

3) Ownership Page
	•	Centered player list (max width ~700px).
	•	Sticky search bar.
	•	Odd/even row styling using inset/subtle patterns.
	•	3-column layout: player info, count, percent.

⸻

4) Stats Page
	•	Tabs: 1QB / SFLX, sortable table with sticky columns.
	•	Filter buttons; game logs modal integration.
	•	Search, totals/per-game, position filters.

Full Version 3 details exist separately and remain unaltered (per instructions).

⸻

5) Research Page
	•	SYOP sunburst chart.
	•	Bar charts for position breakdowns.
	•	Gauges (hit rates), NFL Draft analysis.
	•	Desktop-optimized layout.

⸻

6) League Analyzer Page
	•	Hero section with chips.
	•	Chart panels: starters value, overall value, radar.
	•	Leaderboard tables.
	•	Toggles for 1QB / SFLX.

⸻

Core JavaScript (app.js)

State Management (representative fields)

state = {
  userId, leagues, players,
  oneQbData, sflxData, currentLeagueId,
  cache, teamsToCompare, startSitSelections,
  isSuperflex, isCompareMode, currentRosterView,
  activePositions, tradeBlock, isTradeCollapsed,
  weeklyStats, playerSeasonStats, playerSeasonRanks,
  playerWeeklyStats, statsSheetsLoaded, seasonRankCache,
  liveWeeklyStats, currentNflSeason, currentNflWeek,
  calculatedRankCache, playerProjectionWeeks,
  isStartSitMode, startSitNextSide
}

Key Functions
	•	Data
fetchSleeperPlayers() — master list (edge-cached ~7 days).
fetchDataFromGoogleSheet() — KTC/stats CSV via proxy.
fetchGameLogs(playerId) — weekly stats for modals.
In-memory caching via state.cache.
	•	Navigation & Page Mgmt
getPageUrl(page) / ensureNavigate(page);
ensureValidUser(username);
nav button listeners with focus suppression.
	•	Views
setRosterView(view) (positional/lineup);
handleFetchRosters(), handleFetchOwnership(), handleLeagueSelect().
	•	Comparison & Trade
handleTeamSelect(e), updateCompareButtonState();
openCompareSearch()/closeCompareSearch();
handleAssetClickForTrade(e), clearTrade().
	•	Start/Sit
enterStartSitMode(), handleStartSitPlayerClick(e);
getPlayerProjectionForWeek(), getPlayerMatchupForWeek();
clearStartSitSelections().
	•	Filtering & Rendering
handlePositionFilter(e), handleClearFilters();
updatePositionFilterButtons();
renderAllTeamData(), createPlayerRow();
renderGameLogs(), renderPlayerComparison();
calculatePlayerStatsAndRanks();
getConditionalColorByRank(), getVitalsColor().
	•	Utilities
parseHeightToInches(), parseWeightToLbs(), parseAgeValue();
adjustStickyHeaders(), syncRosterHeaderPosition();
openModal()/closeModal(), showTemporaryTooltip(), setLoading().

Focus Suppression System
	•	Patches HTMLElement.prototype.focus() to prevent unwanted mobile keyboard open on iOS Safari.
	•	Handles visibility changes and history nav; optional ?debugFocus=1.

Content Visibility Optimization
	•	Uses content-visibility: auto on mobile (<819px) when supported.

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

Animation System

Starfield
	•	4 layers: #stars, #stars1, #stars2, #stars3.
	•	Box-shadow based star rendering.
	•	Long-duration vertical translations (e.g., 100s / 300s / 350s / 400s cycles; ~2000px translateY).

(Any details that were specifically about the removed file have been omitted.)

⸻

Modal System

Game Logs Modal
	•	TanStack Table Core renders weekly stats.
	•	Opponent rank annotations.
	•	Season totals footer with rank annotations.
	•	Stacked rank display (value above, rank below).
	•	Key panel toggles stat abbreviations (extensive list).
	•	Vitals display (age, height, weight); summary chips (games, avg, total PPG).

Player Comparison Modal
	•	Side-by-side stat comparison for two players.
	•	Bar visualization for relative performance.
	•	Best-stat highlighting (green glow).
	•	Fullscreen overlay with blur backdrop.
	•	Positioned to avoid trade simulator overlap.

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

Responsive Design

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
