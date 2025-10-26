export default async (request) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id") || Deno.env.get("PLAYER_STATS_SHEET_ID") || Deno.env.get("GOOGLE_SHEET_ID");
    const sheet = url.searchParams.get("sheet");
    const gid = url.searchParams.get("gid");
    const directUrl = url.searchParams.get("url");

    let target;
    if (directUrl) {
      const u = new URL(directUrl);
      if (u.hostname !== "docs.google.com") return new Response("Blocked host", { status: 400 });
      target = u.toString();
    } else {
      if (!id || (!sheet && !gid)) return new Response("Missing id and sheet/gid", { status: 400 });
      target = sheet
        ? `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`
        : `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?gid=${encodeURIComponent(gid)}&tqx=out:csv`;
    }

  const now = new Date();
  const pacificDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const pacificDay = pacificDate.getDay();
  const pacificHour = pacificDate.getHours();
  const inLiveWindow = pacificDay === 0 || ((pacificDay === 1 || pacificDay === 4) && pacificHour >= 17 && pacificHour < 22);

  const sMax = inLiveWindow ? 300 : 1800; // 5 minutes or 30 minutes
  const swr  = inLiveWindow ? 900 : 7200;  // allow modest stale tolerance

    const upstream = await fetch(target, { headers: { "Accept": "text/csv, */*" } });
    const res = new Response(upstream.body, upstream);
    res.headers.set("Cache-Control", `public, s-maxage=${sMax}, stale-while-revalidate=${swr}`);
    res.headers.set("X-Proxy", "sheet-proxy");
    res.headers.set("X-Target", target);
    return res;
  } catch (err) {
    return new Response(`Proxy error: ${err?.message || err}`, { status: 502 });
  }
};