from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 375, 'height': 667},
        is_mobile=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    )
    page = context.new_page()

    # Get the absolute path to the HTML files
    analyzer_path = os.path.abspath('DH_P2.53/analyzer/analyzer.html')
    ownership_path = os.path.abspath('DH_P2.53/ownership/ownership.html')


    # Verify League Analyzer page
    page.goto(f"file://{analyzer_path}")
    page.screenshot(path="jules-scratch/verification/analyzer_mobile.png")

    # Verify Ownership page
    page.goto(f"file://{ownership_path}")
    page.screenshot(path="jules-scratch/verification/ownership_mobile.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
