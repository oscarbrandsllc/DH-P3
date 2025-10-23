from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Set viewport to a desktop size
        page.set_viewport_size({"width": 1280, "height": 800})

        # Get the absolute path to the project directory
        project_dir = os.path.abspath("DH_P2.53")

        # Navigate to rosters.html and take a screenshot
        page.goto(f"file://{project_dir}/rosters/rosters.html")
        page.screenshot(path="jules-scratch/verification/rosters_desktop.png")

        # Navigate to stats.html and take a screenshot
        page.goto(f"file://{project_dir}/stats/stats.html")
        page.screenshot(path="jules-scratch/verification/stats_desktop.png")

        # Navigate to ownership.html and take a screenshot
        page.goto(f"file://{project_dir}/ownership/ownership.html")
        page.screenshot(path="jules-scratch/verification/ownership_desktop.png")

        # Navigate to research.html and take a screenshot
        page.goto(f"file://{project_dir}/research/research.html")
        page.screenshot(path="jules-scratch/verification/research_desktop.png")

        # Navigate to analyzer.html and take a screenshot
        page.goto(f"file://{project_dir}/analyzer/analyzer.html")
        page.screenshot(path="jules-scratch/verification/analyzer_desktop.png")

        browser.close()

run()
