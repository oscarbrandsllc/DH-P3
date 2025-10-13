# Dynasty Hub P3 - AI Coding Guidelines

## Project Overview
Dynasty Hub P3 is a Progressive Web App (PWA) for fantasy football dynasty league management. It provides tools for roster analysis, player ownership tracking, league analysis, and research features using Sleeper fantasy football data and custom player rankings.

## Architecture
- **Frontend**: Vanilla JavaScript single-page application with multiple "pages" (rosters, ownership, analyzer, research)
- **Backend**: Netlify edge functions proxy external APIs (Sleeper, Google Sheets)
- **Deployment**: Static site hosted on Netlify with no build process
- **PWA**: Service worker enables offline functionality and app-like installation

## Key Files & Structure
- `DH_P2.53/`: Main application directory
  - `index.html`: Welcome/home page with navigation
  - `scripts/app.js`: Core application logic (~4500 lines) - handles all pages
  - `scripts/analyzer.js`: League analysis and visualization features
  - `styles/styles.css`: Comprehensive styling with CSS custom properties
  - `manifest.webmanifest`: PWA configuration
  - `service-worker.js`: Offline caching and PWA functionality
- `netlify/edge-functions/`: Serverless API proxies
  - `sheet-proxy.js`: Proxies Google Sheets API with custom caching
  - `sleeper-proxy.js`: Proxies Sleeper API with dynamic cache TTLs
- `netlify.toml`: Netlify deployment configuration

## Critical Patterns & Conventions

### Data Flow & APIs
- **Sleeper API**: `https://api.sleeper.app/v1` (proxied via `/api/sleeper/*`)
  - League rosters, users, draft picks, matchups
  - Cached with short TTLs during live game windows (Thu-Sun)
- **Google Sheets**: Custom player stats/rankings via `/api/sheet/*`
  - KTC (Keep Trade Cut) values, ADP, seasonal/weekly stats
  - Sheet ID: `1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0`
  - Player stats sheet: `1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs`

### UI & Styling
- **CSS Custom Properties**: Extensive use for theming
  - Position colors: `--pos-qb`, `--pos-rb`, `--pos-wr`, `--pos-te`, `--pos-flx`, `--pos-sflx`
  - Theme colors: `--color-bg`, `--color-text-primary`, `--color-accent-primary`
- **Glass Panel Aesthetic**: `backdrop-filter: blur()` with transparent backgrounds
- **Mobile-First**: Responsive design with `content-visibility: auto` for performance
- **Position-Based Coloring**: All UI elements color-coded by fantasy position

### State Management
- Global `state` object in `app.js` containing:
  - `userId`, `leagues[]`, `players{}`, `currentLeagueId`
  - `teamsToCompare` Set for comparison features
  - `cache{}` for API response caching
- No external state management library - vanilla JavaScript objects

### Caching Strategy
- **Edge Functions**: Custom TTLs based on data freshness
  - Live game data: 60-300s cache during Thu-Sun
  - Static data: 1-7 days cache
- **Service Worker**: Cache-first strategy for static assets
- **Version Busting**: Query parameters (`?v=timestamp`) for cache invalidation

### Fantasy Football Domain Logic
- **Position Hierarchy**: QB → RB → WR → TE → FLEX → SUPER_FLEX
- **Scoring Systems**: PPR, standard, custom league settings
- **Player Values**: KTC (Keep Trade Cut) rankings, ADP, projected points
- **League Types**: Redraft, dynasty, superflex variations

## Development Workflow
- **No Build Process**: Edit files directly, deploy static assets
- **Versioning**: Update timestamps in HTML script/link tags for cache busting
- **Testing**: Manual testing across devices - focus on PWA functionality
- **Deployment**: Automatic via Netlify on git push to main branch

## Common Tasks & Patterns

### Adding New Features
1. Add HTML structure to appropriate page template
2. Implement logic in `app.js` or page-specific script
3. Style with existing CSS custom properties
4. Test PWA installation and offline functionality

### API Integration
- Use existing proxy endpoints (`/api/sleeper/*`, `/api/sheet/*`)
- Implement caching in edge functions if needed
- Handle CORS through Netlify proxies

### UI Components
- Follow glass-panel design with `backdrop-filter: blur()`
- Use position-based color variables for consistency
- Implement mobile-responsive layouts
- Add loading states and error handling

### Performance Considerations
- Use `content-visibility: auto` for large lists
- Implement virtual scrolling for roster grids
- Leverage service worker caching
- Optimize images and assets

## Code Quality Guidelines
- **No Frameworks**: Vanilla JavaScript only - no React, Vue, etc.
- **ES6+ Features**: Modern JavaScript with async/await
- **Consistent Naming**: camelCase for variables, PascalCase for constructors
- **Error Handling**: Try/catch blocks with user-friendly error messages
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Deployment & Maintenance
- **Netlify Configuration**: `netlify.toml` handles redirects and headers
- **PWA Updates**: Update service worker cache name and version timestamps
- **Security**: CSP headers configured for external resource loading
- **Monitoring**: Check Netlify function logs for API proxy issues</content>
<parameter name="filePath">/Users/oscarboczarski/Library/Mobile Documents/com~apple~CloudDocs/🔬Research+/🧑‍💻 Code.Base/DH-P3-1/.github/copilot-instructions.md