# Dynasty Hub - AI Coding Agent Instructions

## Project Overview
Dynasty Hub is a Progressive Web App (PWA) for fantasy football dynasty league management, integrating Sleeper API data with KeepTradeCut (KTC) valuations and custom player statistics. The app is deployed on Netlify with edge functions for API proxying and caching.

## Architecture

### Multi-Page Structure
- **Welcome Page** (`index.html`): Landing page with Sleeper username input
- **Rosters** (`rosters/rosters.html`): League roster viewer with trade simulator and player comparison
- **Ownership** (`ownership/ownership.html`): Cross-league ownership percentage view
- **Analyzer** (`analyzer/analyzer.html`): League analytics with Chart.js visualizations
- **Research** (`research/research.html`): Custom visualization playground

Each page shares `scripts/app.js` but uses `data-page` attribute for conditional logic.

### Data Flow Architecture
1. **External APIs** → Netlify Edge Functions → Client Cache
   - Sleeper API: `/api/sleeper/*` proxied via `sleeper-proxy.js`
   - Google Sheets (KTC data): `/api/sheet/*` proxied via `sheet-proxy.js`
2. **Client-side state** managed in monolithic `state` object in `app.js`
3. **Caching strategy**: Edge functions use dynamic `s-maxage` based on NFL game schedule (live games = 60s, off-season = 86400s)

### Key Components

#### State Management (`scripts/app.js`)
```javascript
state = {
  userId: null,
  leagues: [],
  players: {},           // Sleeper player database
  oneQbData: {},        // KTC values for 1QB leagues
  sflxData: {},         // KTC values for Superflex leagues
  currentLeagueId: null,
  isSuperflex: false,
  weeklyStats: {},      // Google Sheets weekly stats (weeks 1-5)
  liveWeeklyStats: {},  // Sleeper API stats (weeks 6+)
  calculatedRankCache: null
}
```

#### Data Sources
- **Player values**: Parsed from Google Sheets CSV (sheet IDs in constants `GOOGLE_SHEET_ID`, `PLAYER_STATS_SHEET_ID`)
- **Stats integration**: Combines Google Sheets historical data with live Sleeper API stats
- **Ranking system**: Client-side calculation using league-specific scoring settings

#### Edge Functions
Both proxies implement intelligent caching:
- **Live game detection**: Thursday 11PM-Monday 5AM UTC, Sunday 4PM-Tuesday 6AM UTC
- **Cache tiers**: `s-maxage` varies from 60s (live) to 86400s (off-season)
- **Stale-while-revalidate**: Long SWR values (3600s-604800s) for graceful degradation

## Development Patterns

### Navigation System
- Uses `ensureNavigate()` wrapper to validate username before page transitions
- **Mobile keyboard suppression**: `suppressFocusTemporary()` prevents keyboard from appearing during navigation
- Focus guard monkey-patches `HTMLElement.prototype.focus` to block input focus for 700ms after nav events

### CSS Architecture
- **Design tokens** in `:root` (see `styles/styles.css` lines 1-45)
- **Glass morphism panels**: `.glass-panel` with backdrop blur
- **Position colors**: `--pos-qb`, `--pos-rb`, etc. used for player cards
- **Starfield background**: Pure CSS animation in `#starfield`

### Player Cards
Standard structure (see `renderPlayerCard()` in `app.js`):
```html
<div class="player-row" data-player-id="..." data-asset-ktc="...">
  <div class="player-main-line">...</div>
  <div class="player-meta-line">...</div>
  <div class="player-value-line">...</div>
</div>
```

### Stats Parsing
**Critical**: Stats from Google Sheets use specific header mappings:
- CSV headers → internal keys via `PLAYER_STAT_HEADER_MAP` (e.g., `'paYDS'` → `'pass_yd'`)
- **No fallback stats** for: `yprr`, `ts_per_rr`, `imp_per_g`, `snp_pct`, `prs_pct` (sheet is source of truth)
- Rank annotations use `createRankAnnotation()` with ordinal suffixes (1st, 2nd, etc.)

### Performance Optimizations
- **Content-visibility**: `.roster-cv-enabled` on mobile (<820px) for roster cards
- **CSV parsing**: Custom `parseCsvLine()` handles quoted values and escape sequences
- **Debounced search**: Compare search uses 120ms debounce

## Common Workflows

### Adding New Stats
1. Update `PLAYER_STAT_HEADER_MAP` with CSV header → key mapping
2. Add to `NO_FALLBACK_KEYS` if sheet is authoritative source
3. Update `buildStatLabels()` for display labels
4. Ensure Google Sheet has corresponding column

### Modifying Edge Functions
- Edit `netlify/edge-functions/*.js`
- Use Deno runtime APIs (not Node.js)
- Test cache headers: `s-maxage` for CDN, `stale-while-revalidate` for resilience
- Deploy via Netlify (auto-deploys from main branch)

### Styling New Components
1. Use existing CSS variables from `:root`
2. Follow `.glass-panel` pattern for cards
3. Position-specific colors: `TAG_COLORS` object in `app.js`
4. Team colors: `TEAM_COLORS` object for NFL teams

## Critical Constraints

### Mobile UX
- **No autofocus**: Focus suppression prevents keyboard popups on navigation
- **Touch-optimized**: All interactive elements have `:active` states
- **Responsive breakpoints**: 820px for roster grid, 640px for nav buttons

### Data Integrity
- **Age precision**: Always format ages to 1 decimal (e.g., `age.toFixed(1)`)
- **Rank display**: Use `formatRankValue()` / `getRankDisplayText()` to handle NA values
- **Enclosed numerals**: Always sanitize with `replaceEnclosedDigits()` before parsing

### Caching Strategy
- **fetchWithCache()**: In-memory cache for API responses
- **Service worker**: Cache-first strategy for static assets (see `service-worker.js`)
- **Edge caching**: Respect live game windows for dynamic data freshness

## File Naming Conventions
- HTML pages: `<feature>/<feature>.html` (e.g., `rosters/rosters.html`)
- Shared scripts: `scripts/<name>.js`
- Page-specific logic: Inline in HTML or shared via `data-page` checks
- Icons: WebP format in `assets/icons/`, versioned query params for cache busting

## Deployment
- **Platform**: Netlify
- **Build**: Static site, no build step
- **Publish dir**: `DH_P2.53`
- **Edge functions**: Auto-deployed from `netlify/edge-functions/`
- **PWA**: Service worker handles offline support, manifest for installability

## Gotchas
- `state.calculatedRankCache` must be invalidated when scoring settings change
- Google Sheets CSV uses non-breaking spaces (`\u00a0`) - normalize with `normalizeHeader()`
- Draft picks use static KTC values for rounds 4-5 and years 2028+
- Superflex detection: Check `roster_positions` for `SUPER_FLEX` OR multiple `QB` slots
