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

        file_path = os.path.abspath('DH_P2.53/index.html')

        page.goto(f'file://{file_path}')

        page.wait_for_load_state('networkidle')

        page.locator('.app-header').screenshot(path='jules-scratch/verification/verification_home.png')

        browser.close()

if __name__ == '__main__':
    run()