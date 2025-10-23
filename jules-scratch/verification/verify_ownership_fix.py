
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Set viewport to a mobile size
        page.set_viewport_size({"width": 375, "height": 667})

        # Go to the ownership page
        page.goto("http://localhost:8000/DH_P2.53/ownership/ownership.html")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/ownership_mobile_view.png")

        browser.close()

if __name__ == "__main__":
    run()
