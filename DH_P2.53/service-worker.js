/**
 * =============================================================================
 * SERVICE WORKER — Dynasty Hub (DH_P2.53)
 * =============================================================================
 *
 * MANUAL CACHE RESET WORKFLOW
 * ---------------------------
 * To force all users onto fresh content:
 *   1. Change CACHE_NAME below
 *   2. Deploy to Netlify
 *   3. Users get fresh content on next normal refresh
 *
 * KEY DESIGN DECISIONS
 * --------------------
 * - ONLY cache same-origin files (HTML/JS/CSS/assets/data)
 * - NEVER cache third-party requests (Sleeper, Google, CDNs, fonts)
 * - ALL fetches for same-origin files use {cache: 'no-store'} to bypass HTTP cache
 * - Absolute URLs as cache keys (avoid ./ vs / mismatches)
 * - Force client reload on activate
 *
 * =============================================================================
 */

// ============================================================================
// CACHE VERSION — CHANGE THIS TO FORCE A FULL CACHE RESET
// ============================================================================
// Refresh the DataHub empty comparison stage and its dropdown-safe instructions.
const CACHE_NAME = 'DH3.45g';

// ============================================================================
// CORE ASSETS — Pre-cached during install
// ============================================================================
const CORE_ASSET_PATHS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/rosters/rosters.html',
  '/stats/stats.html',
  '/datahub/datahub.html',
  '/ownership/ownership.html',
  '/leaguehub/leaguehub.html',
  '/research/research.html',
  '/adp/index.html',
  '/adp/nfl-draft/index.html',
  '/contact/contact.html',
  '/styles/styles.css',
  '/styles/stats.css',
  '/styles/DataHub.css',
  '/styles/dashboard.css',
  '/styles/rosters.css',
  '/styles/leaguehub.css',
  '/styles/research.css',
  '/styles/ownership.css',
  '/styles/contact.css',
  '/scripts/app.js',
  '/scripts/stats.js',
  '/scripts/DataHub.js',
  '/scripts/leaguehub.js',
  '/scripts/dashboard.js',
  '/scripts/syop.js',
  '/scripts/dh-scramble.js',
  '/scripts/contact.js'
];

// ============================================================================
// HELPER: Check if URL is same-origin
// ============================================================================
function isSameOrigin(url) {
  try {
    return new URL(url, self.location.origin).origin === self.location.origin;
  } catch {
    return false;
  }
}

// ============================================================================
// HELPER: Check if URL is a cacheable static asset
// ============================================================================
function isCacheableAsset(url) {
  if (!isSameOrigin(url)) return false;

  const pathname = new URL(url, self.location.origin).pathname;

  // Cache: HTML, CSS, JS, manifest, /assets/*, /data/*
  const patterns = [
    /^\/$/,
    /\.html$/,
    /\.css$/,
    /\.js$/,
    /\.webmanifest$/,
    /^\/assets\//,
    /^\/data\//
  ];

  return patterns.some(p => p.test(pathname));
}

// Isolated hit-rate export: Next.js content-hashes every file in this directory,
// so both dashboard routes can use cache-first delivery safely.
function isVersionedAdpBuildAsset(url) {
  if (!isSameOrigin(url)) return false;

  const pathname = new URL(url, self.location.origin).pathname;
  return pathname.startsWith('/adp/_next/static/');
}

// ============================================================================
// HELPER: Fetch with HTTP cache bypass
// ============================================================================
// This is the critical function that ensures fresh responses from the network,
// ignoring whatever the browser has in its HTTP cache.
async function fetchFresh(url) {
  return fetch(url, {
    cache: 'no-store',  // Bypass HTTP cache completely
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}

// Hit-rate install warmup: discover each route's hashed scripts, styles, and
// self-hosted fonts directly from both generated entry documents.
async function cacheAdpBuildAssets(cache, indexResponse) {
  const html = await indexResponse.text();
  const assetPaths = Array.from(
    html.matchAll(/(?:src|href)="(\/adp\/_next\/static\/[^"]+)"/g),
    match => match[1]
  );
  const assetUrls = Array.from(new Set(assetPaths))
    .map(path => new URL(path, self.location.origin).href)
    .filter(isVersionedAdpBuildAsset);

  await Promise.all(assetUrls.map(async url => {
    try {
      const response = await fetchFresh(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (err) {
      console.warn('[SW] ADP build cache failed:', url, err);
    }
  }));
}

// Hit-rate runtime delivery: reuse the current cache for hashed build files;
// a cache miss still falls through to a fresh network request and is stored.
async function fetchVersionedAdpBuildAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetchFresh(request.url);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
}

// ============================================================================
// INSTALL — Pre-cache core assets with HTTP cache bypass
// ============================================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const urls = CORE_ASSET_PATHS.map(p => new URL(p, self.location.origin).href);

      await Promise.all(urls.map(async url => {
        try {
          const response = await fetchFresh(url);
          if (response.ok) {
            const adpIndexResponse = /^\/adp\/(?:nfl-draft\/)?index\.html$/.test(new URL(url).pathname)
              ? response.clone()
              : null;
            await cache.put(url, response);
            if (adpIndexResponse) {
              await cacheAdpBuildAssets(cache, adpIndexResponse);
            }
          }
        } catch (err) {
          console.warn('[SW] Install cache failed:', url, err);
        }
      }));

      return self.skipWaiting();
    })
  );
});

// ============================================================================
// ACTIVATE — Purge old caches and force all clients to reload
// ============================================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => {
          console.log('[SW] Deleting old cache:', n);
          return caches.delete(n);
        })
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => {
        // Force reload all open windows to get fresh content immediately
        clients.forEach(client => {
          if (client.url && 'navigate' in client) {
            client.navigate(client.url);
          }
        });
      })
  );
});

// ============================================================================
// FETCH — Network-First with HTTP cache bypass for same-origin assets
// ============================================================================
// CRITICAL: All same-origin fetches use {cache: 'no-store'} to ensure the
// browser fetches from the network, not from its stale HTTP cache.
// This is what makes CACHE_NAME bumps work reliably.
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  // The ADP app is an isolated static export. Its hashed build files are safe
  // to serve cache-first and avoid repeat mobile downloads on every tab visit.
  if (isVersionedAdpBuildAsset(request.url)) {
    event.respondWith(fetchVersionedAdpBuildAsset(request));
    return;
  }

  // Skip third-party — let browser handle normally (no SW caching)
  if (!isCacheableAsset(request.url)) return;

  event.respondWith(
    // CRITICAL: fetchFresh bypasses HTTP cache, ensuring we get the latest from server
    fetchFresh(request.url)
      .then(networkResponse => {
        if (networkResponse.ok) {
          // Cache the fresh response for offline use
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed — serve from SW cache (offline mode)
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // For navigation, fall back to cached index
          if (request.mode === 'navigate') {
            return caches.match(new URL('/', self.location.origin).href);
          }
          return undefined;
        });
      })
  );
});
