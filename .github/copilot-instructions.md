# GitHub Copilot Instructions

This document provides a comprehensive guide for AI coding agents to understand the architecture, data flow, and key implementation details of the Dynasty Hub application. Adhering to these guidelines will ensure that future development is consistent with the existing structure and avoids common pitfalls.

## 1. Core Architecture

- **Frameworks**: The application is built with vanilla JavaScript, HTML, and CSS. It uses Tailwind CSS via a CDN for utility classes, but the primary, complex styling is in `/styles/styles.css`.
- **Main Logic File**: `/scripts/app.js` is the central hub for all application logic. It is a monolithic script that manages state, data fetching, and UI rendering across all pages.
- **State Management**: A single global `state` object in `app.js` holds all application data. This includes fetched data, UI state, and caches. Be mindful of this when adding new features that require state.
- **Multi-Page Structure**: The app uses separate HTML files for its main sections (e.g., `index.html` for the welcome page, `rosters/rosters.html` for the main tool). Navigation is handled by standard page loads, with user context (like username) passed via URL parameters.

## 2. Data Flow and Sources

The application combines data from two primary sources, both accessed through Netlify edge function proxies:

1.  **Sleeper API**:
    -   **Purpose**: The primary source for live, user-specific fantasy football data.
    -   **Data**: User accounts, leagues, rosters, live weekly stats, and player metadata.
    -   **Proxy**: `/netlify/edge-functions/sleeper-proxy.js`.
    -   **Usage**: Fetched dynamically when a user enters their username and selects a league.

2.  **Google Sheets**:
    -   **Purpose**: Acts as a static database for aggregated and historical data not available in the Sleeper API.
    -   **Data**:
        -   **KTC Player Values**: Sourced from a sheet for 1QB and Superflex formats.
        -   **Detailed Player Stats**: Contains historical season-long stats, positional ranks, and weekly game logs, including projections for future weeks.
    -   **Proxy**: `/netlify/edge-functions/sheet-proxy.js`.
    -   **Usage**: Fetched on initial application load and stored in the `state` object.

## 3. Styling (`styles.css`)

**CRITICAL:** The application's styling is highly specific and carefully scoped. Do not add generic styles.

-   **Scoped Selectors**: Styles are often scoped to a specific page using the `body[data-page="..."]` attribute selector, or to a specific component using an ID (e.g., `#game-logs-modal ...`). When making style changes, locate the correct, existing block for that component to avoid unintended global changes.
-   **Theme**: The UI is a "glassmorphism" dark theme with a starfield background. It uses CSS variables (e.g., `--color-accent-primary`) for theming.
-   **Dynamic Styling**: Many elements are styled dynamically from JavaScript by adding classes or inline styles based on data (e.g., player rank colors).

## 4. Key Component Implementations

-   **Player Cards (`createPlayerRow` in `app.js`)**:
    -   This function builds the HTML for individual player cards seen on the rosters page.
    -   It combines data from multiple sources: player metadata (Sleeper), KTC values (Sheets), and calculated PPG/Ranks (derived from Sheets/Sleeper data).
    -   The structure includes a main line (name/position), a meta line (rank/age/team), and a value line (KTC/PPG).

-   **Game Logs Modal (`renderGameLogs` in `app.js`)**:
    -   This is a data-intensive component that merges historical stats (from Sheets) with live stats (from Sleeper).
    -   It correctly distinguishes between played weeks (showing actual stats) and unplayed weeks (showing projected stats from the Sheets data).
    -   The table of stats is dynamically generated based on the player's position (e.g., QBs have different stats shown than RBs).

-   **Rosters Page (`rosters.html`, `app.js`)**:
    -   **Trade/Compare Functionality**: This is a core feature. When a user selects multiple teams, `state.isCompareMode` is set to `true`.
        -   **Trade Preview Panel (`renderTradeBlock`)**: Appears at the bottom. It tracks selected assets in `state.tradeBlock` and calculates total KTC values.
        -   **Player Compare Modal (`renderPlayerComparison`)**: A detailed, two-player comparison view launched from the trade panel.
    -   **Start/Sit Mode**: A special variant of the compare functionality for a single user's team.
        -   It is activated by the "Start/Sit" button, setting `state.isStartSitMode` to `true`.
        -   The UI changes to show only the user's team, grouped by position, to facilitate selecting two players.
        -   The bottom preview panel (`renderStartSitPreview`) is adapted to show weekly projections and PPG instead of KTC values.

When making changes, always trace the data flow from its source (Sleeper/Sheets) through the `state` object to the relevant rendering function in `app.js`. Be extremely careful when modifying CSS selectors.
