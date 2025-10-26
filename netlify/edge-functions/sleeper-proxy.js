export default async (request) => {
  try {
    const u = new URL(request.url);
    const path = u.pathname.replace(/^\/api\/sleeper\/?/, "");
    if (!path) return new Response("Missing path", { status: 400 });
    const target = `https://api.sleeper.app/v1/${path}${u.search}`;

    const now = new Date();
    const pacificDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const pacificDay = pacificDate.getDay();
    const pacificHour = pacificDate.getHours();
    const inLiveWindow = pacificDay === 0 || ((pacificDay === 1 || pacificDay === 4) && pacificHour >= 17 && pacificHour < 22);

    const liveish = /stats|rosters|leagues/i.test(path);
    const isAllPlayers = /players\/all/i.test(path);

    let sMax;
    let swr;

    if (isAllPlayers) {
      sMax = 604800; // 7 days
      swr = 1209600; // 14 days
    } else if (liveish) {
      sMax = inLiveWindow ? 300 : 1800; // 5 minutes or 30 minutes
      swr = inLiveWindow ? 900 : 3600;  // allow short-lived stale responses
    } else {
      sMax = 86400;  // 24 hours
      swr = 604800;  // 7 days
    }

    const upstream = await fetch(target, { headers: { "Accept": "application/json, */*" } });
    const res = new Response(upstream.body, upstream);
    res.headers.set("Cache-Control", `public, s-maxage=${sMax}, stale-while-revalidate=${swr}`);
    res.headers.set("X-Proxy", "sleeper-proxy");
    res.headers.set("X-Target", target);
    return res;
  } catch (err) {
    return new Response(`Proxy error: ${err?.message || err}`, { status: 502 });
  }
};