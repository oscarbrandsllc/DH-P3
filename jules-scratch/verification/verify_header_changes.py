import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the local rosters page
        await page.goto('file:///app/DH_P2.53/rosters/rosters.html')

        # Wait for the page to load by looking for the username input
        await expect(page.locator("#usernameInput")).to_be_visible()

        # Set a username and trigger league loading by clicking the Rosters button
        await page.locator("#usernameInput").fill("The_Oracle")
        await page.locator("#rostersButton").click()

        # Wait for leagues to load and select one
        await expect(page.locator("#leagueSelect")).to_be_enabled(timeout=15000)
        await page.locator("#leagueSelect").select_option(index=1)

        # Wait for rosters to render by checking for a player inside the roster grid
        await expect(page.locator("#rosterGrid .player-row").first).to_be_visible(timeout=15000)

        # 1. Enter trade preview mode by selecting a second team (user's team is selected by default)
        team_checkboxes = page.locator(".team-compare-checkbox")
        await team_checkboxes.nth(1).click()

        # Wait for the trade preview to appear, with an increased timeout
        await expect(page.locator("#tradeSimulator")).to_be_visible(timeout=10000)

        # 2. Capture screenshot of the header in trade preview mode
        await page.screenshot(path="jules-scratch/verification/trade-preview-header.png")

        # 3. Exit trade preview mode by deselecting a team
        await team_checkboxes.nth(1).click()
        await expect(page.locator("#tradeSimulator")).to_be_hidden()

        # 4. Capture screenshot of the header in normal mode
        await page.screenshot(path="jules-scratch/verification/normal-header.png")

        # 5. Re-enter trade preview mode
        await team_checkboxes.nth(1).click()
        await expect(page.locator("#tradeSimulator")).to_be_visible(timeout=10000)

        # 6. Select two players to compare from the visible roster grid
        player_rows = page.locator("#rosterGrid .player-row")
        await player_rows.nth(0).click()
        await player_rows.nth(1).click()

        # 7. Open the comparison modal
        await page.locator("#comparePlayersButton").click()
        await expect(page.locator("#player-comparison-modal")).to_be_visible()

        # 8. Capture screenshot of the comparison modal
        await page.screenshot(path="jules-scratch/verification/comparison-modal.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())