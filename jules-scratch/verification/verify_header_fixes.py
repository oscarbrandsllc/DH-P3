
import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path of the repository root
        repo_root = os.getcwd()

        # Verify League Analyzer page
        analyzer_path = os.path.join(repo_root, 'DH_P2.53/analyzer/analyzer.html')
        page.goto('file://' + analyzer_path)
        page.screenshot(path='jules-scratch/verification/analyzer_header.png')

        # Verify Ownership page
        ownership_path = os.path.join(repo_root, 'DH_P2.53/ownership/ownership.html')
        page.goto('file://' + ownership_path)
        page.screenshot(path='jules-scratch/verification/ownership_header.png')

        browser.close()

if __name__ == '__main__':
    run()
