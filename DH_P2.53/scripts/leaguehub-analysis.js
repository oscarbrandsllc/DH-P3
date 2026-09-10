/* LeagueHub analysis calculations: shared by the matrix, charts, and rank rings.
   Keep this module page-local; the Trade Archive retains its historical stats. */
(function (root) {
  'use strict';
  const POSITIONS = ['QB', 'RB', 'WR', 'TE'];

  // ROS includes the current NFL week through Week 18. Completed seasons have
  // no remaining weeks; future seasons start at Week 1. Never substitute 2025.
  function projectionWeeks(season, nfl) {
    const year = Number(season);
    const current = Number(nfl.season);
    if (!year || !current) throw new Error('NFL projection season unavailable.');
    if (year < current || (year === current && nfl.season_type === 'post')) return [];
    const start = year > current || nfl.season_type === 'pre' ? 1 : Math.max(1, Number(nfl.week) || 1);
    return Array.from({ length: Math.max(0, 19 - start) }, (_, i) => start + i);
  }

  // Sleeper scoring keys match projection stat keys, including position-specific
  // reception bonuses. Sum each category once; pts_ppr is only a coverage marker.
  function scoreProjection(stats, scoring, position) {
    if (!stats || typeof stats !== 'object') return null;
    const settings = Object.entries(scoring || {}).filter(([, weight]) => Number.isFinite(Number(weight)) && Number(weight) !== 0);
    if (!settings.length) return null;
    const covered = ['pts_ppr', 'pts_half_ppr', 'pts_std', ...settings.map(([key]) => key)]
      .some(key => stats[key] != null && Number.isFinite(Number(stats[key])));
    if (!covered) return null;
    return settings.reduce((total, [key, weight]) => {
      let stat = stats[key];
      // Reception premium can be derived exactly if omitted by the feed.
      if (stat == null && key === `bonus_rec_${String(position).toLowerCase()}`) stat = stats.rec;
      return total + (Number(stat) || 0) * Number(weight);
    }, 0);
  }

  function rank(value, population) {
    if (!Number.isFinite(value)) return null;
    // Competition ranks preserve ties (1, 1, 3), using displayed precision.
    const rounded = Math.round(value * 10);
    return 1 + population.filter(other => Number.isFinite(other) && Math.round(other * 10) > rounded).length;
  }

  function rankFill(rankValue, count) {
    return rankValue && count ? Math.max(0, Math.min(1, (count - rankValue + 1) / count)) : 0;
  }

  function sumProjections(players) {
    return players.some(player => !Number.isFinite(player.proj))
      ? null : players.reduce((sum, player) => sum + player.proj, 0);
  }

  // Bench membership follows the active derived lineup, never Sleeper's manually
  // saved starters. Dynasty counts every non-starting QB/RB/WR/TE. Contender
  // selects one remaining QB, three RB/WR combined, and one remaining TE.
  function quality(team, metric) {
    const lineup = team.derivedLineups[metric];
    const starterIds = new Set(lineup.assignments.flatMap(slot => slot.player ? [slot.player.id] : []));
    const bench = team.allPlayers.filter(player => POSITIONS.includes(player.pos) && !starterIds.has(player.id));
    const dynasty = metric === 'value';
    const depthPlayers = dynasty ? bench : [
      ...bench.filter(p => p.pos === 'QB').sort((a, b) => (b.proj ?? -Infinity) - (a.proj ?? -Infinity)).slice(0, 1),
      ...bench.filter(p => ['RB', 'WR'].includes(p.pos)).sort((a, b) => (b.proj ?? -Infinity) - (a.proj ?? -Infinity)).slice(0, 3),
      ...bench.filter(p => p.pos === 'TE').sort((a, b) => (b.proj ?? -Infinity) - (a.proj ?? -Infinity)).slice(0, 1),
    ];
    const starters = dynasty ? lineup.totals.value : sumProjections(lineup.assignments.flatMap(slot => slot.player ? [slot.player] : []));
    return {
      slots: lineup.assignments.map(slot => dynasty ? slot.score : (slot.player ? slot.player.proj : 0)),
      starters,
      depth: dynasty ? depthPlayers.reduce((sum, p) => sum + p.ktc, 0) : sumProjections(depthPlayers),
      picks: team.overallPositional.Picks,
      overall: dynasty ? team.totalValue : starters,
      depthPlayers,
    };
  }

  const api = { projectionWeeks, scoreProjection, rank, rankFill, quality, sumProjections };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LeagueHubAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis);
