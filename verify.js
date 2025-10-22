const { webkit } = require('playwright');

(async () => {
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Log console messages from the page
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        await page.goto('http://localhost:8000/DH_P2.53/rosters/rosters.html?is_verification=true&username=testuser&leagueId=1001', { waitUntil: 'networkidle' });

        await page.waitForSelector('#rosterGrid .player-name-clickable', { timeout: 15000 });

        await page.click('#rosterGrid .player-name-clickable');

        await page.waitForSelector('#game-logs-modal', { state: 'visible', timeout: 10000 });

        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'gamelogs_modal.png' });
    } catch (error) {
        console.error('Verification script failed:', error);
    } finally {
        await browser.close();
    }
})();
