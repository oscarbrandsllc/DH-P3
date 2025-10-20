
import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Construct the full file path
        current_working_directory = os.getcwd()
        file_path = "file://" + os.path.join(current_working_directory, 'DH_P2.53/stats/stats.html')

        page.goto(file_path)

        # Wait for the main content to be visible
        expect(page.locator("#content")).to_be_visible()

        # Wait for the tabs to be visible
        expect(page.locator(".tabs")).to_be_visible()

        # Wait for the filter buttons to be visible
        expect(page.locator("#filterContainer-1qb")).to_be_visible()

        # Wait for the table to be visible
        expect(page.locator("#page-1qb .table-container")).to_be_visible()

        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
