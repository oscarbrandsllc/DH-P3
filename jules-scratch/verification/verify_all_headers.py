from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 414, 'height': 896},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        pages_to_verify = {
            "index": "DH_P2.53/index.html",
            "rosters": "DH_P2.53/rosters/rosters.html",
            "analyzer": "DH_P2.53/analyzer/analyzer.html",
            "ownership": "DH_P2.53/ownership/ownership.html",
            "research": "DH_P2.53/research/research.html"
        }

        for name, path in pages_to_verify.items():
            file_path = os.path.abspath(path)
            page.goto(f'file://{file_path}')
            page.wait_for_load_state('networkidle')
            page.locator('.app-header').screenshot(path=f'jules-scratch/verification/verification_{name}.png')

        browser.close()

if __name__ == '__main__':
    run()