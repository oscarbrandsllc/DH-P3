"use client";

/* eslint-disable @next/next/no-img-element -- The integration deliberately uses
   Dynasty Hub's existing shared logo path, which is outside this Next basePath. */

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type InternalDestination =
  | "home"
  | "rosters"
  | "datahub"
  | "leaguehub"
  | "research"
  | "ownership"
  | "contact";

type MenuPosition = {
  left: number;
  top: number;
};

const INTERNAL_PATHS: Record<InternalDestination, string> = {
  home: "/index.html",
  rosters: "/rosters/rosters.html",
  datahub: "/datahub/datahub.html",
  leaguehub: "/leaguehub/leaguehub.html",
  research: "/research/research.html",
  ownership: "/ownership/ownership.html",
  contact: "/contact/contact.html",
};

type ActiveResearchTab = "rookie-adp" | "nfl-draft";

// Release navigation: omit unfinished Positional Analysis from both hit-rate routes.
const researchTabs = [
  {
    id: "syop",
    label: "Career Length Analytics",
    href: "/research/research.html?tab=syop",
  },
  {
    id: "rookie-adp",
    label: "ROOKIE DRAFT ADP —  PLAYER HIT %",
    href: "/adp/",
  },
  {
    id: "nfl-draft",
    label: (
      <>
        <span>NFL Draft</span>
        <span> —  Player Hit %</span>
      </>
    ),
    href: "/adp/nfl-draft/",
  },
] as const;

const SERVICE_WORKER_PATH = "/service-worker.js?v=20250825104842";

function readPreferredUsername() {
  if (typeof window === "undefined") return "";

  const queryUsername = new URLSearchParams(window.location.search)
    .get("username")
    ?.trim()
    .toLowerCase();
  if (queryUsername) return queryUsername;

  try {
    return (window.localStorage.getItem("sleeper_username") || "")
      .trim()
      .toLowerCase();
  } catch {
    return "";
  }
}

function addUsername(path: string, username: string) {
  if (!username) return path;
  const url = new URL(path, window.location.origin);
  url.searchParams.set("username", username);
  return `${url.pathname}${url.search}${url.hash}`;
}

export default function DynastyHubResearchShell({
  activeResearchTab = "rookie-adp",
}: {
  activeResearchTab?: ActiveResearchTab;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // ADP loading stability: use the Vanilla app's exact service-worker URL and
  // wait for the page load event so registration cannot compete with the
  // isolated Next.js bundles during the first mobile render.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = () => {
      void navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => undefined);
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });
    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  const positionMoreMenu = useCallback(() => {
    const button = moreButtonRef.current;
    const menu = moreMenuRef.current;
    if (!button || !menu) return;

    const buttonRect = button.getBoundingClientRect();
    const menuWidth = menu.offsetWidth || 80;
    const margin = 6;
    const gap = 2;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const maxLeft = Math.max(margin, viewportWidth - margin - menuWidth);
    const centeredLeft = buttonRect.left + (buttonRect.width - menuWidth) / 2;
    const left = Math.max(margin, Math.min(centeredLeft, maxLeft));
    const belowTop = buttonRect.bottom + gap;
    const menuHeight = menu.offsetHeight || 0;
    const aboveTop = buttonRect.top - gap - menuHeight;
    const top =
      belowTop + menuHeight + margin > window.innerHeight && aboveTop >= margin
        ? aboveTop
        : belowTop;

    setMenuPosition({ left: Math.round(left), top: Math.round(top) });
  }, []);

  const closeMoreMenu = useCallback(() => {
    setMoreOpen(false);
    setMenuPosition(null);
  }, []);

  // Research navigation dropdown: portal to the document body so the glass
  // header cannot create a Safari/WebKit containing-block offset.
  useEffect(() => {
    if (!moreOpen) return;

    const frame = window.requestAnimationFrame(positionMoreMenu);
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !moreButtonRef.current?.contains(target) &&
        !moreMenuRef.current?.contains(target)
      ) {
        closeMoreMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMoreMenu();
        moreButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", positionMoreMenu);
    window.addEventListener("scroll", positionMoreMenu, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", positionMoreMenu);
      window.removeEventListener("scroll", positionMoreMenu);
    };
  }, [closeMoreMenu, moreOpen, positionMoreMenu]);

  const navigateInternal = (destination: InternalDestination) => {
    const path = INTERNAL_PATHS[destination];
    const shouldCarryUsername = destination !== "home" && destination !== "datahub";
    const username = readPreferredUsername();
    window.location.href = shouldCarryUsername ? addUsername(path, username) : path;
  };

  const navigateExternal = (rawUrl: string) => {
    const destination = new URL(rawUrl);
    const username = readPreferredUsername();
    if (destination.hostname === "trophyroom.dynastyhub.pro" && username) {
      destination.pathname = `/user/${encodeURIComponent(username)}`;
      destination.search = "";
      destination.hash = "";
    }
    window.location.href = destination.toString();
  };

  const menuStyle = menuPosition
    ? ({ left: menuPosition.left, top: menuPosition.top } satisfies CSSProperties)
    : ({ left: 0, top: 0, visibility: "hidden" } satisfies CSSProperties);

  return (
    <div className="dh-integration-shell">
      <div className="dh-header-container">
        <header className="dh-app-header" aria-label="Dynasty Hub navigation">
          <div className="dh-header-row">
            <nav className="dh-nav-buttons" aria-label="Primary navigation">
              <button className="dh-nav-button dh-home-button" type="button" onClick={() => navigateInternal("home")}>
                <img src="/assets/logos/App_Logo_icon256.png" alt="" className="dh-nav-logo" aria-hidden="true" />
                <span className="dh-nav-label">Home</span>
              </button>
              <button className="dh-nav-button" type="button" onClick={() => navigateInternal("rosters")}>
                <i className="fa-solid fa-clipboard-list" aria-hidden="true" />
                <span className="dh-nav-label">Rosters</span>
              </button>
              <button className="dh-nav-button" type="button" onClick={() => navigateInternal("datahub")}>
                <i className="fa-solid fa-chart-column" aria-hidden="true" />
                <span className="dh-nav-label">DataHub</span>
              </button>
              <button className="dh-nav-button dh-leaguehub-button" type="button" onClick={() => navigateInternal("leaguehub")}>
                <i className="fa-solid fa-square-poll-vertical" aria-hidden="true" />
                <span className="dh-nav-label">LeagueHub</span>
              </button>
              <button className="dh-nav-button active" type="button" aria-current="page" onClick={() => navigateInternal("research")}>
                <i className="fa-solid fa-flask" aria-hidden="true" />
                <span className="dh-nav-label">Research</span>
              </button>
              <button
                ref={moreButtonRef}
                className="dh-nav-button dh-nav-more-toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                onClick={() => {
                  if (moreOpen) closeMoreMenu();
                  else setMoreOpen(true);
                }}
              >
                <i className="fa-solid fa-toolbox" aria-hidden="true" />
                <span className="dh-nav-label">More</span>
                <i className="fa-solid fa-caret-down dh-nav-more-caret" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </header>
      </div>

      <nav className="adp-research-tabs" role="tablist" aria-label="Research dashboards">
        {researchTabs.map((tab) => {
          // Both isolated hit-rate routes share this shell, but only the route
          // selected by the page receives the active Research-tab treatment.
          const isActive = tab.id === activeResearchTab;
          return (
            <a
              className={`adp-research-tab adp-research-tab--${tab.id}${isActive ? " active" : ""}`}
              href={tab.href}
              role="tab"
              aria-selected={isActive ? "true" : "false"}
              aria-current={isActive ? "page" : undefined}
              key={tab.href}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      {moreOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={moreMenuRef}
              className={`dh-nav-more-dropdown dh-nav-more-dropdown--${activeResearchTab}`}
              role="menu"
              aria-hidden="false"
              style={menuStyle}
            >
              {/* Isolated ADP More menu: Rosters-style icon wells and supporting
                  copy receive a route-specific Rookie or NFL Draft palette. */}
              <button className="dh-nav-more-item" type="button" role="menuitem" onClick={() => navigateInternal("ownership")}>
                <span className="dh-nav-more-item-icon" aria-hidden="true"><i className="fa-solid fa-percent" /></span>
                <span className="dh-nav-more-item-copy">
                  <span className="dh-nav-more-item-title">Ownership</span>
                  <span className="dh-nav-more-item-subtext">Player Exposures</span>
                </span>
              </button>
              <button className="dh-nav-more-item" type="button" role="menuitem" onClick={() => navigateExternal("https://trophyroom.dynastyhub.pro/")}>
                <span className="dh-nav-more-item-icon" aria-hidden="true"><i className="fa-solid fa-trophy" /></span>
                <span className="dh-nav-more-item-copy">
                  <span className="dh-nav-more-item-title">Trophy Room</span>
                  <span className="dh-nav-more-item-subtext">Dyn. Career Profile</span>
                </span>
              </button>
              <button className="dh-nav-more-item" type="button" role="menuitem" onClick={() => navigateExternal("http://dynastyhub-matchups.netlify.app/")}>
                <span className="dh-nav-more-item-icon" aria-hidden="true"><i className="fa-solid fa-table-columns" /></span>
                <span className="dh-nav-more-item-copy">
                  <span className="dh-nav-more-item-title">Matchups</span>
                  <span className="dh-nav-more-item-subtext">In-Season SoS Tool</span>
                </span>
              </button>
              <button className="dh-nav-more-item" type="button" role="menuitem" onClick={() => navigateInternal("contact")}>
                <span className="dh-nav-more-item-icon" aria-hidden="true"><i className="fa-solid fa-envelope" /></span>
                <span className="dh-nav-more-item-copy">
                  <span className="dh-nav-more-item-title">Contact</span>
                  <span className="dh-nav-more-item-subtext">Feedback</span>
                </span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
