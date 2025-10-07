from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 375, 'height': 812},
        is_mobile=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
    )
    page = context.new_page()

    # Construct the relative path to the HTML file
    html_file_path = '../../DH_P3/rosters.html'

    page.goto(f'file://{os.getcwd()}/{html_file_path}')
    page.wait_for_selector('.app-header', timeout=5000)

    header = page.query_selector('.app-header')
    if header:
        header.screenshot(path='jules-scratch/verification/verification.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)