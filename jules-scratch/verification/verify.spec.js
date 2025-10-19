const { test, expect } = require('@playwright/test');

test('game logs modal has two tables and synchronized scrolling', async ({ page }) => {
  // Mock API responses
  await page.route('https://api.sleeper.app/v1/user/blakest8', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user_id: '12345', username: 'blakest8', display_name: 'blakest8' }),
    });
  });

  await page.route(/https:\/\/api\.sleeper\.app\/v1\/user\/12345\/leagues\/nfl\/\d{4}/, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { league_id: 'league1', name: 'Test League 1', roster_positions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'BN'], settings: { taxi_slots: 0, draft_rounds: 3 }, scoring_settings:{ pass_yd: 0.04, pass_td: 4 } },
      ]),
    });
  });

  await page.route('https://api.sleeper.app/v1/players/nfl', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        "4017": { "player_id": "4017", "first_name": "Patrick", "last_name": "Mahomes", "position": "QB", "team": "KC" }
      }) });
  });

  // Mocks for Google Sheets with correct headers
  await page.route(/.*&sheet=SZN$/, async route => {
      await route.fulfill({ status: 200, body: 'SLPR_ID,paYDS,GM_P,FPT_PPR\n4017,300,1,20.0' });
  });
  await page.route(/.*&sheet=WK1$/, async route => {
      await route.fulfill({ status: 200, body: 'SLPR_ID,paYDS,paTD\n4017,300,2' });
  });

  const emptyCsv = 'SLPR_ID\n';
  await page.route(/.*&sheet=SZN_RKs$/, async route => route.fulfill({ status: 200, body: emptyCsv }));
  for (let i = 2; i <= 10; i++) {
    await page.route(new RegExp(`.*&sheet=WK${i}$`), async route => route.fulfill({ status: 200, body: emptyCsv }));
  }

  await page.route('https://api.sleeper.app/v1/league/league1/rosters', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
        { roster_id: 1, owner_id: '12345', players: ['4017'], starters: ['4017'], settings: { wins: 1, losses: 0 } }
      ]) });
  });

  await page.route('https://api.sleeper.app/v1/league/league1/users', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
        { user_id: '12345', display_name: 'blakest8' }
      ]) });
  });

  await page.route('https://api.sleeper.app/v1/league/league1/traded_picks', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await page.route('https://api.sleeper.app/v1/state/nfl', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ season: 2025, week: 1 }) });
  });

  await page.goto('http://localhost:8000/DH_P2.53/rosters/rosters.html?username=blakest8');

  // Wait for the league select to be populated and enabled
  await page.waitForSelector('#leagueSelect:not([disabled])');

  // Select a league
  await page.selectOption('#leagueSelect', 'league1');

  // Wait for the roster to load
  await page.waitForSelector('.roster-column');

  // Click on a player to open the game logs modal
  await page.click('[data-asset-id="4017"] .player-name-clickable');

  // Wait for the modal to be visible and content loaded
  await page.waitForSelector('#game-logs-modal:not(.hidden)');
  await page.waitForSelector('.game-logs-scroll-container');

  // Check that there are two tables in the modal
  const tables = await page.$$('#game-logs-modal table');
  expect(tables.length).toBe(2);

  const weeklyTableWrapper = await page.$('.weekly-table-wrapper');
  const seasonTableWrapper = await page.evaluateHandle(() => document.querySelector('.season-table-wrapper'));

  if (!weeklyTableWrapper || !seasonTableWrapper.asElement()) {
    throw new Error('Could not find table wrappers for scrolling test');
  }

  await weeklyTableWrapper.evaluate(el => el.scrollLeft = 50);
  await page.waitForTimeout(200);

  const seasonScrollLeft = await seasonTableWrapper.evaluate(el => el.scrollLeft);
  expect(seasonScrollLeft).toBe(50);

  await page.screenshot({ path: 'jules-scratch/verification/game-logs-modal.png' });
});
