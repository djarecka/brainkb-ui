"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { plexSans, plexMono } from "./fonts";
import { COLORS } from "./tokens";

const NAV_LINKS = [
  { href: "/mcp", label: "MCP & Skills" },
  { href: "/explore", label: "Explore" },
  { href: "https://docs.brainkb.org", label: "Docs", external: true },
];

export default function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header
      className={`${plexSans.variable} ${plexMono.variable}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(244,241,234,.9)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `1.5px solid ${COLORS.ink}`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
          </span>
          <span style={{ font: "500 17px var(--font-plex-sans)", letterSpacing: "-.01em", color: COLORS.ink }}>
            BrainKB
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 26, fontSize: 14, flexWrap: "wrap", alignItems: "center" }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                style={{ color: active ? COLORS.accent : COLORS.ink }}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://github.com/sensein/brainkb"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: "500 13px var(--font-plex-mono)",
              padding: "7px 12px",
              border: `1px solid ${COLORS.ink}`,
              borderRadius: 999,
              whiteSpace: "nowrap",
              flex: "none",
              color: COLORS.ink,
            }}
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
