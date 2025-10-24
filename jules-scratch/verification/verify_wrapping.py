
import os
import re
from playwright.sync_api import sync_playwright, Route

def handle_route(route: Route):
    url = route.request.url
    if "api.sleeper.app/v1/user/testuser" in url:
        route.fulfill(json={"user_id": "12345"})
    elif re.search(r"api.sleeper.app/v1/user/12345/leagues/nfl/\d{4}", url):
        route.fulfill(json=[{
            "name": "Mock League",
            "league_id": "mock_league_123",
            "roster_positions": ["QB", "RB", "RB", "WR", "WR", "TE", "FLEX", "BN", "BN", "BN", "BN"],
            "scoring_settings": {},
            "settings": { "taxi_slots": 0 },
            "season": "2025"
        }])
    elif "api.sleeper.app/v1/league/mock_league_123/rosters" in url:
        route.fulfill(json=[{
            "roster_id": "1",
            "owner_id": "12345",
            "players": ["4017", "2225"],
            "starters": ["4017"],
            "settings": { "wins": 5, "losses": 5, "ties": 0}
        }])
    elif "api.sleeper.app/v1/league/mock_league_123/users" in url:
        route.fulfill(json=[{
            "user_id": "12345",
            "display_name": "testuser"
        }])
    elif "api.sleeper.app/v1/league/mock_league_123/traded_picks" in url:
        route.fulfill(json=[])
    elif "api.sleeper.app/v1/players/nfl" in url:
        route.fulfill(json={
            "4017": {"first_name": "Patrick", "last_name": "Mahomes", "position": "QB", "team": "KC"},
            "2225": {"first_name": "Christian", "last_name": "McCaffrey", "position": "RB", "team": "SF"}
        })
    elif "docs.google.com/spreadsheets" in url:
        route.fulfill(status=200, body="") # Fulfill with empty body
    else:
        route.continue_()

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 414, 'height': 896}, is_mobile=True, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1')
        page = context.new_page()

        page.route("**/*", handle_route)

        file_path = os.path.abspath('DH_P2.53/rosters/rosters.html')
        page.goto(f'file://{file_path}')

        # Manually trigger the roster fetch since we're not coming from the index page
        page.evaluate("() => { document.getElementById('usernameInput').value = 'testuser'; handleFetchRosters(); }")

        page.wait_for_selector('#leagueSelect:not(:disabled)')
        page.select_option('#leagueSelect', index=1)

        page.wait_for_selector('.roster-column')
        page.click('#startSitButton')
        page.wait_for_selector('.start-sit-container')

        # Add a small delay to ensure rendering is complete
        page.wait_for_timeout(1000)

        page.screenshot(path='jules-scratch/verification/verification.png')

        browser.close()

if __name__ == '__main__':
    run()
