📊 Comprehensive Analysis Complete
Core Files
✅ Files Read:
1. app.js (5,136 lines) - 100% complete
2. styles.css (7,512 lines) - 100% complete
3. rosters.html - 100% complete
4. index.html - 100% complete
5. loader-ring.js - 100% complete

🏗️ Application Architecture Overview
Core Technology Stack:
* PWA with service worker caching
* Vanilla JavaScript (no frameworks)
* TanStack Table Core for game logs
* D3.js-style rendering for charts (Research page)
* Sleeper API + Google Sheets CSV for data
Data Flow:
User Input → Sleeper API (via edge function proxy)
                ↓
         Sheet Proxy (KTC/stats data)
                ↓
         Service Worker Cache
                ↓
         In-Memory State (app.js)
                ↓
         DOM Rendering (player cards, modals, etc.)
🎨 Design System
Styling Approach:
* Glass morphism panels with backdrop-filter: blur()
* Starfield background (4 animated layers + noise)
* Position-specific colors (QB, RB, WR, TE)
* Conditional coloring for ranks, ages, heights, weights
* Team logo glows (per-team CSS variables)
* Responsive breakpoints: 540px, 820px, 869px, 1280px
Key Visual Elements:
* Player cards: 3-line structure (main/meta/value)
* Rank annotations: Ordinal suffixes with variant-specific styling
* Trade preview: Bottom-fixed with collapse/expand
* Modals: Game logs (TanStack table) + Player comparison (side-by-side)
* Loading ring: Radial text animation around logo

📱 Page Structure
1. Welcome Page (index.html)
* Simplified header (menu, username, enter button)
* Logo with gradient glow mask effect
* Install instructions (iOS/Android/Mac)
* Legend section (player card breakdown)
2. Rosters Page (rosters.html)
* 3-row header (nav, username/league, filters)
* Roster grid (team columns)
* Position filters (QB/RB/WR/TE/FLX/STAR)
* Start/Sit analyzer
* Trade simulator (bottom-fixed)
* Two modals (game logs, player comparison)
3. Ownership Page
* Centered player list (max 700px)
* Sticky search bar
* Odd/even row styling (inset/subtle patterns)
* 3-column layout (player info, count, %)
4. Stats Page (stats.html)
* Tabs (1QB/SFLX)
* Sortable table with sticky columns
* Filter buttons
* Game logs modal integration
5. Research Page (research.html)
* SYOP sunburst chart
* Bar charts (position breakdowns)
* Gauges (hit rates)
* NFL Draft analysis
* Desktop-optimized layout
6. League Analyzer Page (analyzer.html)
* Hero section with chips
* Chart panels (starters value, overall value, radar)
* Leaderboard tables
* Toggle controls (1QB/SFLX)

⚙️ Core JavaScript Functions (app.js)
State Management:
state = {
  userId, leagues, players, 
  oneQbData, sflxData, currentLeagueId,
  cache, teamsToCompare, startSitSelections, ...
}
Key Functions:
* fetchSleeperPlayers() - Get player data from Sleeper
* fetchDataFromGoogleSheet() - Fetch KTC/stats CSV
* renderAllTeamData() - Render team roster columns
* createPlayerRow() - Generate player card HTML
* renderGameLogs() - TanStack table for weekly stats
* renderPlayerComparison() - Side-by-side comparison
* renderTradeBlock() - Trade preview UI
* calculatePlayerStatsAndRanks() - Compute ranks
* getConditionalColorByRank() - Position-specific colors
* getVitalsColor() - Age/height/weight coloring
* adjustStickyHeaders() - Fix header positioning
* parseHeightToInches(), parseWeightToLbs(), parseAgeValue() - Robust data parsing
Focus Suppression System:
* Patches HTMLElement.prototype.focus() to prevent mobile keyboard auto-open
* Critical for iOS Safari UX

🎯 Caching Strategy
Service Worker (PWA):
* CACHE_NAME: sleeper-tool-cache-v1.0.0-20251026
* Cache-First: Fonts, logos, research scripts (syop.js, dh-scramble.js, loader-ring.js)
* Network-First: Dynamic data (leagues, rosters, stats)
* Manual reset: Bump CACHE_NAME version
Netlify Edge Functions:
* sleeper-proxy.js: Pacific Time-aware caching
    * Live windows: Sun all day, Mon/Thu 5-10pm PT → 300s cache
    * Normal: 1800s cache
    * /players/all: 604800s (7 days)
* sheet-proxy.js: Same Pacific Time logic for Google Sheets

🎨 Conditional Coloring System
Player Ranks:
getRankColor(rank, position)
  1-5: var(--pos-{position})
  6-12: gradient fade
  13-24: muted
  25+: tertiary Age Coloring (Position-Specific):
* QB: Elite <26, Great 26-28, Good 29-31
* RB: Elite <23, Great 23-24, Good 25-26
* WR/TE: Similar thresholds
Height/Weight Coloring:
* Position-specific ideal ranges
* Color-coded deviations

🔄 Animation System
Loading Ring (loader-ring.js):
* 14-second rotation cycle
* Updates CSS custom property --angle
* MutationObserver watches for .hidden class
* Handles visibility changes, pageshow/pagehide
Starfield:
* 4 layers (#stars, #stars1, #stars2, #stars3)
* Box-shadow-based star rendering
* 100s, 300s, 350s, 400s animation durations
* 2000px translateY

📊 Modal System
Game Logs Modal:
* TanStack Table Core for rendering
* Weekly stats with opponent rank annotations
* Season totals in footer with rank annotations
* Stacked rank display (value above, rank below)
* Key panel toggle for stat abbreviations
* Vitals display (age, height, weight)
* Summary chips (games played, avg, total PPG)
Player Comparison Modal:
* Side-by-side stat comparison (2 players)
* Bar visualization for relative performance
* Best stat highlighting (green glow)
* Stacked rank annotations
* Fullscreen overlay with blur backdrop
* Fixed positioning to avoid trade simulator overlap

🎛️ Header System
3-Row Responsive Header (Desktop 869px+):
1. Primary Row: Navigation buttons (Home, Rosters, Ownership, Stats, L.Analyze, Research)
2. Secondary Row: Username input, league select, view switcher
3. Filters Row: Start/Sit button, position filters, clear, search toggle
Welcome Page Header:
* Simplified to menu, username, enter button
* Circular icon with label
* Compact grid layout
Ownership/Analyzer Pages:
* Centered header container (max 880px)
* Larger input fields
* Border-top divider between rows

📐 Responsive Design
Breakpoints:
* 540px: Mobile tweaks (ownership page row sizing)
* 820px: Header layout conversion (vertical → horizontal grid)
* 869px: Desktop layout (roster columns, panels)
* 1280px: Research page adjustments
Mobile Optimizations:
* Font size minimum 16px (prevents iOS zoom)
* Viewport reset helper (temporary max-scale=1)
* Compact controls (smaller buttons, tighter spacing)
* Sticky header adjustments

🧩 Utility Functions
Data Parsing:
* parseHeightToInches(): "6-2", "6'2"", "74 in"
* parseWeightToLbs(): "200", "200 lbs", "91 kg"
* parseAgeValue(): "24.5", "24y 6m"
UI Utilities:
* adjustStickyHeaders(): Calculate --roster-header-gap
* syncRosterHeaderPosition(): Sync scroll position
* showTemporaryTooltip(): Flash messages
* openModal(), closeModal(): Modal controls
* setLoading(): Show/hide loading indicator
.glass-panel {
  background-color: rgba(13,14,35,0.18);
  backdrop-filter: blur(18px) saturate(120%) brightness(115%);
  border: 1px solid rgba(128,138,189,0.26);
  box-shadow: inset 0 0 0 4px rgba(200,200,200,0.025),
              0 10px 26px rgba(0,0,0,0.22);
}
Nested Borders:
* Outer border: panel-border color
* Inner border: subtle white overlay
* Shadow: depth + inset glow

🔧 Performance Optimizations
Caching Layers:
1. Browser Cache (via service worker)
2. Edge Cache (Netlify functions)
3. In-Memory Cache (app.js state.cache)
Rendering:
* will-change: transform on animated elements
* transform: translateZ(0) for GPU acceleration
* contain: layout paint style on isolated components
* Debounced scroll handlers

This is a highly sophisticated PWA with a comprehensive caching strategy, responsive design, and rich UI interactions. The codebase demonstrates deep understanding of performance optimization, accessibility (focus management), and user experience (mobile-friendly inputs, smooth animations).
Let me know if you'd like me to dive deeper into any specific area! 🚀











File-by-File Analysis
1. index.html (Welcome/Entry Page)
Purpose: The landing page where users enter their Sleeper username to access their leagues.

Key Components:

Header: Contains a hamburger menu (.menu-toggle) with navigation links, username input field, and an "Enter" button that triggers roster fetching
Welcome Screen: Features an animated logo with SVG mask effects, the "Dynasty Hub" title (animated by dh-scramble.js), and installation instructions for PWA setup
Player Card Legend: Hidden by default, shows key for interpreting player card metrics (KTC value, ADP, position ranks)
Loading Indicator: Full-screen overlay with animated spinning ring (controlled by loader-ring.js) and "LOADING INITIAL DATA" text
Data Flow:

User enters username → clicks Enter button (id: rostersButton)
app.js validates username via Sleeper API
On success, navigates to rosters.html
Styling Notes:

Uses data-page="welcome" attribute for page-specific CSS scoping
Starfield background (4 animated layers: #stars, #stars1, #stars2, #stars3)
Glass morphism UI with backdrop blur and gradients
——————————————————————————————————————
2. rosters.html (Main Application Page)
Purpose: Displays user's fantasy rosters across multiple leagues with rich player data, comparison tools, and trade simulation.
Key Components:
Header (3-row structure):
* Row 1 (Primary Nav): Home, Rosters, Ownership, Stats, Analyzer, Research buttons
* Row 2 (Context): Username display, league selector dropdown, view switcher (Positional/Lineup)
* Row 3 (Filters): Start/Sit button, position filters (QB/RB/WR/TE/ALL), clear filters, team comparison controls
Main Content:
* Player Card Legend: Same structure as index.html but shows "POSITION RANK (FPTS)" and "PPG (POS RK)" instead of ADP
* Loading Overlay: Identical to index.html but shows "LOADING INITIAL DATA" with 28 characters in the ring
* Roster View (#rosterView): Container for team roster grids (populated dynamically by app.js)
* Player List View (#playerListView): Alternative view for ownership percentages (not visible on rosters page)
Modals:
1. Game Logs Modal (#game-logs-modal):
    * Shows detailed player performance stats across weeks
    * Includes comprehensive stats key (60+ stat abbreviations: FPTS, paATT, ruYDS, recTD, etc.)
    * "Key" button in footer toggles visibility of stats definitions
2. Player Comparison Modal (#player-comparison-modal):
    * Side-by-side player stat comparison
    * Triggered by team comparison controls
Scripts Loaded:
* app.js (defer): Core application logic
* loader-ring.js: Loading animation controller
——————————————————————————————————————
3. app.js (Core Application Logic - 5,135 lines)
Architecture: Single large IIFE with state management, API calls, DOM manipulation, and event handling.
State Management (line 312):
let state = {
  userId, leagues, players, oneQbData, sflxData,
  currentLeagueId, isSuperflex, cache,
  teamsToCompare, isCompareMode, currentRosterView,
  activePositions, tradeBlock, isTradeCollapsed,
  weeklyStats, playerSeasonStats, playerSeasonRanks,
  playerWeeklyStats, statsSheetsLoaded, seasonRankCache,
  liveWeeklyStats, currentNflSeason, currentNflWeek,
  calculatedRankCache, playerProjectionWeeks,
  isStartSitMode, startSitSelections, startSitNextSide
}

Key Constants:
* API Endpoints: Sleeper API base, Google Sheets IDs for KTC values and player stats
* Position/Team Colors: CSS variable mappings for visual theming
* League Abbreviations: Custom short names for specific leagues
* Color Palettes: League and rookie year color arrays for visual differentiation
Critical Functions:
1. Navigation & Page Management (lines 168-309):
    * getPageUrl(page): Constructs URLs for different pages
    * ensureValidUser(username): Validates Sleeper username via API
    * ensureNavigate(page): Wrapper that validates user before navigation
    * Navigation button event listeners with focus suppression to prevent mobile keyboard issues
    * Home page menu wiring for compact navigation
2. Data Fetching (lines 1113-1155):
    * fetchAndSetUser(username): Gets Sleeper user ID
    * fetchUserLeagues(userId): Retrieves all user's leagues
    * fetchSleeperPlayers(): Gets master player list (cached 7 days at edge)
    * fetchGameLogs(playerId): Fetches detailed weekly stats for player modals
    * Implements in-memory caching via state.cache object
3. View Management (lines 473-530):
    * setRosterView(view): Toggles between 'positional' and 'lineup' layouts
    * handleFetchRosters(): Main entry point for roster page rendering
    * handleFetchOwnership(): Switches to ownership percentage view
    * handleLeagueSelect(): Updates displayed data when user changes league
4. Comparison & Trade Features (lines 577-1022):
    * handleTeamSelect(e): Adds/removes teams from comparison set
    * updateCompareButtonState(): Updates UI based on selected teams
    * openCompareSearch() / closeCompareSearch(): Manages team search popover
    * handleAssetClickForTrade(e): Builds trade proposals by selecting players
    * clearTrade(): Resets trade simulator state
5. Start/Sit Mode (lines 643-879):
    * enterStartSitMode(): Activates weekly matchup recommendation mode
    * handleStartSitPlayerClick(e): Adds players to L/R comparison slots
    * getPlayerProjectionForWeek(): Fetches projected stats for upcoming week
    * getPlayerMatchupForWeek(): Gets opponent team and defensive rank
    * clearStartSitSelections(): Resets selections
6. Position Filtering (lines 1063-1110):
    * handlePositionFilter(e): Toggles active position filters
    * handleClearFilters(): Resets all filters to show all positions
    * updatePositionFilterButtons(): Updates button active states
Focus Management System (lines 79-179):
* Implements focus suppression to prevent mobile keyboards from auto-opening
* Patches HTMLElement.prototype.focus to ignore calls on inputs for 700ms after navigation
* Handles page visibility changes and back/forward navigation
* Optional focus debugging via ?debugFocus=1 URL parameter
Content Visibility Optimization (lines 51-70):
* Uses CSS content-visibility: auto on mobile (<819px) to improve rendering performance
* Dynamically applies/removes based on media query changes
* Only enabled if browser supports the feature
——————————————————————————————————————
4. styles.css (Global Styles - 2,973 lines)
Structure: Organized into logical sections with emoji headers for easy navigation.
Key Sections:
1. Theme & Variables (lines 49-146):
* CSS custom properties for colors, spacing, animations
* Glass morphism effects (backdrop-blur, rgba backgrounds)
* Position-specific color variables (--pos-qb, --pos-rb, etc.)
2. Starfield Background (lines 2892-2969):
* 4-layer parallax scrolling star animation
* Each layer has different star sizes, counts, and animation speeds
* animStar keyframe: vertical scrolling loop every 100-350s
3. Header Layout (lines 314-691):
* Row 1: Flex container with nav buttons, active state styling, hover effects
* Row 2: Username input, league dropdown, view switcher buttons
* Row 3: Filters, Start/Sit button, comparison controls
* Responsive breakpoints at 520px, 700px, 768px, 869px
* Active nav button gets gradient border and glow effect
4. Glass Panel System (lines 230-255):
* Semi-transparent backgrounds with backdrop-filter: blur()
* Gradient borders for depth
* Used for modals, cards, header, legends
5. Player Card Legend (lines 2723-2891):
* Structured layout: position tag → player name → meta row (rank, age, team) → value row (KTC, ADP/PPG)
* Position-based color coding via --pos-* variables
* Sticky team tag on right side of meta row
* Bottom row uses gradient background with centered values
6. Roster View (lines 1383-2254):
* .roster-column: Individual team containers
* .team-card: Glass panel with team name, record, colors
* .player-row: Flex layout for player cards with hover states
* .player-tag: Position badge with dynamic colors
* Team comparison glow: box-shadow: inset 0 0 2px #6300ff55, inset 0 0 38px #5300ff35
7. Start/Sit Preview (lines 1513-1561):
* .start-sit-metric: Displays projection stats (pts, opp rank)
* .start-sit-rank: Shows positional ranking with colored dot
* .start-sit-week: Small week number label
8. Modals (not visible in summary but present):
* Game logs modal: Full-screen overlay with scrollable table
* Comparison modal: Split-pane layout for side-by-side stats
* Close button, overlay click-to-close functionality
9. Welcome Page Overrides (lines 1333-2720):
* Simplified header with only menu, username, enter button
* Hides contextual controls completely
* Uniform control heights for cohesive mobile layout
* Menu dropdown positioning and styling
Responsive Design:
* Mobile-first approach with progressive enhancement
* Major breakpoints: 520px (phone), 700px (tablet portrait), 869px (tablet landscape), 1440px (desktop)
* Text sizing adapts (14px → 16px base)
* Grid layouts collapse to single column on narrow screens
Performance Optimizations:
* content-visibility: auto on roster sections (mobile only)
* will-change hints for animated elements
* Efficient CSS selectors (avoid deep nesting)
——————————————————————————————————————
5. loader-ring.js (Loading Animation Controller)
Purpose: Animates the circular "LOADING..." text ring during data fetches.
How It Works:
1. Animation Loop (lines 4-10):
function tick(start, ring) {
  const elapsed = (performance.now() - start) % RUNTIME_MS; // 14-second loop
  const angle = (elapsed / RUNTIME_MS) * 360; // 0-360° rotation
  ring.style.setProperty('--angle', angle + 'deg'); // Updates CSS variable
  raf = reques
    * Uses requestAnimationFrame for smooth 60fps animation
    * Calculates rotation angle based on elapsed time
    * Sets --angle CSS custom property which rotates the ring container
1. Visibility Observer (lines 16-30):
    * MutationObserver watches #loading element's class attribute
    * When .hidden class is removed → starts animation
    * When .hidden class is added → cancels animation (stops RAF)
    * Also listens to visibilitychange, pageshow, pagehide, resize events
2. Lifecycle:
    * app.js removes .hidden class from #loading → animation starts
    * User sees spinning "LOADING INITIAL DATA..." text
    * app.js adds .hidden class when data loaded → animation stops
CSS Integration:
* The --angle variable is consumed by CSS transforms on .loading-ring
* Individual characters (.ch) are positioned in a circle using --i index
* Each character rotates around the center point defined by --r radius

Data Flow Summary
1. Initial Load:
    * User visits index.html
    * app.js initializes, checks for saved username
    * If username exists, auto-loads leagues
2. Roster Fetching:
    * User clicks Enter → handleFetchRosters()
    * Fetches: user data → leagues → rosters → players → KTC values → stats
    * Each fetch uses state.cache for session-level caching
    * Proxied through Netlify edge functions (5-30 min cache at CDN)
3. Rendering Pipeline:
    * app.js builds DOM structures for each team
    * Player cards created with all stats (KTC, PPG, age, team, ranks)
    * Event listeners attached for clicks (trade, compare, game logs)
    * CSS applies styling based on position, team, league colors
4. Interactive Features:
    * Position Filters: Hide/show players by position
    * Team Comparison: Select 2+ teams → shows overlay with selected rosters
    * Trade Simulator: Click players to add to L/R sides, calculates value delta
    * Game Logs: Click player → modal opens with weekly stats table
    * Start/Sit: Click button → enables selection mode for matchup analysis
——————————————————————————————————————
Performance Characteristics
Strengths:
* Service worker caches static assets (fonts, logos, scripts, HTML)
* Edge function caching reduces API load (5-30 min depending on game time)
* In-memory cache prevents duplicate fetches in same session
* content-visibility optimizes rendering on mobile
* Efficient DOM updates (direct element creation vs innerHTML)
Bottlenecks (as user noted):
* Large Google Sheets CSVs (1-2 MB) take time to download and parse
* Sequential API calls (user → leagues → rosters) create waterfall delays
* Full DOM rebuild on league change (no virtual DOM)
* No IndexedDB for persistent parsed data cache

This comprehensive analysis provides full working knowledge of the application's architecture, data flow, rendering pipeline, and interaction patterns across all five files.


<!-- —————————————————————————————— -->





stats.css (977 lines)
CSS Variables (lines 1-9):
--stats-col-rk-width: 2rem;           /* Rank column */
--stats-col-player-width: 5.6rem;     /* Player name column */
--stats-col-pos-width: 2.75rem;       /* Position column */
--stats-col-standard-width: clamp(3.9rem, 4.6vw, 4.9rem); /* Data columns */
--stats-table-width: calc(...);       /* Total table width */
--stats-row-border-color: #0f1737;
--stats-header-border-color: rgba(128, 138, 189, 0.22);
--stats-header-mask-height: 2.25rem;
Layout Sections:
1. Header (lines 10-42):
    * .stats-header-shell: Compact padding for nav
    * .stats-nav-hidden-inputs: Screen-reader-only inputs
    * .stats-context-pill: League chip with gradient background
2. Page Structure (lines 43-139):
    * .stats-page-content: Flex column layout, gap 0.4rem
    * .stats-page-intro: Glass panel, centered, max-width 860px
    * .stats-page-title: Responsive font (1.28-1.48rem), uppercase, spaced
    * .stats-league-chip: Pill-shaped badge
3. Tabs (lines 140-220):
    * .stats-tab-button: Pill buttons, flex-grow, uppercase
    * Active states:
        * 1QB: Cyan glow (rgba(0, 158, 253, ...))
        * SFLX: Pink glow (rgba(236, 72, 153, ...))
    * .stats-heading-accent: Gradient text clip
4. Controls Panel (lines 221-289):
    * .stats-controls-panel: Glass panel, max-width 820px
    * .stats-search-block: Order 3 (moves to bottom on mobile)
    * .stats-search-input: Dark input with purple focus ring
    * .stats-search-clear: Hidden by default, shows on input
5. Filter Buttons (lines 290-442):
    * Main filters (.stats-filter-btn):
        * Base: Gradient background, subtle shadow
        * Active states with position-specific colors:
            * QB: #fc497f (pink)
            * RB: #00EBC7 (cyan)
            * WR/Receiving: #58A7FF (blue)
            * TE/ALL: #B469FF (purple)
        * Triple glow effect (outer + 2 inset shadows)
    * Secondary filters (.stats-filter-btn-secondary):
        * Smaller, subtler styling
        * RDP: #8983a0 (gray-purple)
        * Rookies: #8466fb (purple)
6. Table Region (lines 443-509):
    * .stats-table-region: Glass panel, min-height 360px
    * Desktop-specific (@media min-width 869px):
        * Custom CSS variables for responsive widths
        * Centered header + panels
        * Fixed nav button sizes (6.5rem × 2.7rem)
7. Loading States (lines 510-537):
    * .stats-loading-spinner: Rotating border animation
    * .stats-loading-text: Secondary text color
8. Table Scroll Container (lines 538-610):
    * .stats-table-scroll:
        * Max-height: clamp(340px, 65vh, 640px)
        * Custom scrollbars (thin, subtle)
        * ::before: Dark background for sticky columns
        * ::after: Gradient mask for header
9. Table Styling (lines 611-843):
    * Base table:
        * Fixed layout, separate borders
        * Font-size: 0.66rem
    * Headers (thead th):
        * Sticky top, z-index 3
        * Cursor pointer for sorting
    * Rows (tbody td):
        * Alternating backgrounds (#080b1d / #0f1224)
        * Hover: #131d3f
    * Sticky columns:
        * .sticky-col-1 (RK): left 0, z-index 7/8
        * .sticky-col-2 (PLAYER): left 2rem, z-index 6/7
        * .sticky-col-3 (POS): left 7.6rem, z-index 5/6
        * ::before pseudo-elements provide backgrounds
        * Box-shadows create divider lines
10. Special Cell Styles (lines 680-843):
    * .stats-value-chip: Inline-flex, rounded, min-width 1.5rem
    * .stats-team-chip: 27×13px pill for team abbreviations
    * .stats-rank-cell: Bold, spaced
    * .stats-age-cell: Semi-bold
    * .stats-ppg-cell, .stats-fpts-cell: Bold
    * Header categories:
        * All: #ADA2FF (purple)
        * Passing: #FFB2D8 (pink)
        * Rushing: #9cf7d4 (cyan)
        * Receiving: #A0C2F7 (blue)
11. Sort Indicators (lines 856-867):
    * ::after pseudo-element with ▲/▼ symbols
12. Responsive Design:
    * Tablet (max-width 1024px, lines 877-903):
        * Narrower player column (5.2rem)
        * Wider standard columns (3.6-4.4rem)
        * Vertical controls layout
    * Mobile (max-width 600px, lines 905-966):
        * Player column: 4.7rem
        * Rank column: 1.4rem
        * Font-size: 0.56rem
        * iOS zoom prevention: Search input forced to 16px font-size
        * Tabs centered, larger buttons (7rem wide)
13. Glass Panel Override (lines 969-977):
    * Stats-specific styling for .glass-panel
    * Backdrop blur, brightness/saturation filters
    * Triple border shadow effect

Key Interactions & Data Flow:
1. Page Load:
    * stats.js checks data-page="stats"
    * initialise() fetches league context + player data
    * Loads both CSV tabs in parallel
    * Enriches rows with computed stats, colors, styles
    * Renders 1QB table (default)
2. Tab Switch:
    * User clicks SFLX button
    * toggleTab('sflx') updates state
    * Loads SFLX sheet if not cached
    * Re-renders table with new dataset
3. Filtering:
    * Click "Passing" filter → shows only QB stats
    * Changes column set to QB-specific (30 columns)
    * Applies paATT >= 36 threshold when sorting passing stats
    * Re-renders with filtered/sorted rows
4. Sorting:
    * Click column header (e.g., "PPG")
    * Cycles: DESC (▼) → ASC (▲) → NONE
    * Re-ranks visible rows
    * Applies color coding to rank column
5. Search:
    * Type "Jefferson" → filters to matching players
    * Clear button appears
    * Empty state shown if no matches
6. Player Click:
    * Click player name → openGameLogs(entry)
    * Calls handlePlayerNameClick() from app.js
    * Opens game logs modal with stats history

Notable Design Patterns:
* Sticky column implementation: Uses position: sticky + ::before pseudo-elements for backgrounds
* Color theming: Position-based color schemes (QB pink, RB cyan, WR blue, TE purple)
* Performance: Caching datasets in Map, debounced search, lazy image loading
* Accessibility: ARIA labels, screen-reader text, semantic HTML
* Progressive enhancement: Works without JavaScript for basic layout
* Responsive tables: Horizontal scroll with sticky columns, mobile-optimized column widths
* Data normalization: Header aliases, type coercion, fallback values
