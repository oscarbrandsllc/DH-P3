import asyncio
from playwright.async_api import async_playwright, expect
import subprocess
import time
import os

async def main():
    # Start a simple web server in the DH_P2.53 directory
    server_process = subprocess.Popen(
        ["python", "-m", "http.server", "8080"],
        cwd="DH_P2.53/",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(2) # Give server time to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            # Navigate to the local rosters page via the server
            await page.goto('http://localhost:8080/rosters/rosters.html')

            # Wait for the page to load by looking for the username input
            await expect(page.locator("#usernameInput")).to_be_visible()

            # Set a username and trigger league loading by clicking the Rosters button
            await page.locator("#usernameInput").fill("The_Oracle")
            await page.locator("#rostersButton").click()

            # Wait for leagues to load and select one
            await expect(page.locator("#leagueSelect")).to_be_enabled(timeout=25000)
            await page.locator("#leagueSelect").select_option(index=1)

            # Wait for rosters to render
            await expect(page.locator("#rosterGrid .player-row").first).to_be_visible(timeout=25000)
            await page.wait_for_timeout(2000) # extra wait for full render

            # 1. Capture screenshot of the initial view
            await page.screenshot(path="jules-scratch/verification/initial-roster.png")

            # 2. Click the "STAR" filter button
            star_filter_button = page.locator('button[data-position="STAR"]')
            await star_filter_button.click()
            await page.wait_for_timeout(2000) # extra wait for filter to apply

            # 3. Capture screenshot with the filter active
            await page.screenshot(path="jules-scratch/verification/star-filter-active.png")

            # 4. Click the "STAR" filter button again to disable it
            await star_filter_button.click()
            await page.wait_for_timeout(1000) # extra wait for filter to apply

            # 5. Capture screenshot with the filter disabled
            await page.screenshot(path="jules-scratch/verification/star-filter-disabled.png")

            await browser.close()
    finally:
        server_process.kill()

if __name__ == '__main__':
    asyncio.run(main())