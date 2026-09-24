/**
 * Home — public marketing entry page.
 *
 * Redesigned per design_handoff_brainkb_site/ (see README.md there for the
 * full spec). Three sections: Intro → Connect (MCP install) → Explore
 * (graph teaser). Renders standalone, outside the app's Navbar/Footer/Theme
 * chrome — see SiteChrome.
 */

import Link from "next/link";
import MarketingHeader from "./components/marketing/MarketingHeader";
import MarketingFooter from "./components/marketing/MarketingFooter";
import InstallCard from "./components/marketing/InstallCard";
import PlaceholderGraph from "./components/marketing/PlaceholderGraph";
import { instrumentSerif, plexSans, plexMono } from "./components/marketing/fonts";
import { COLORS } from "./components/marketing/tokens";

export default function HomePage() {
  return (
    <div
      className={`${instrumentSerif.variable} ${plexSans.variable} ${plexMono.variable}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.pageBg,
        color: COLORS.ink,
        fontFamily: "var(--font-plex-sans), system-ui, sans-serif",
      }}
    >
      <MarketingHeader />

      {/* Intro */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "96px 28px 88px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ font: "500 12px var(--font-plex-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.accent }}>
          Neuroscience knowledge graph
        </div>
        <h1
          style={{
            margin: 0,
            maxWidth: 900,
            font: "400 clamp(48px,6.4vw,84px)/.98 var(--font-instrument-serif), serif",
            letterSpacing: "-.02em",
          }}
        >
          Brain knowledge, <em style={{ color: COLORS.accent, fontStyle: "italic" }}>connected as a graph.</em>
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: COLORS.body, maxWidth: 600 }}>
          Trustworthy knowledge-graph infrastructure that integrates fragmented neuroscience literature,
          data and evidence — linking cell types, brain regions, datasets and papers so researchers can make
          reproducible discoveries and funders can identify and invest in high-impact science. Plug it into
          your AI assistant over MCP, or browse the graph yourself.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="#connect"
            style={{
              background: COLORS.secondaryAction,
              color: COLORS.pageBg,
              padding: "14px 22px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
          >
            Connect via MCP ↓
          </a>
          <a
            href="#explore"
            style={{
              background: COLORS.secondaryAction,
              color: COLORS.pageBg,
              padding: "14px 22px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
          >
            Explore the graph ↓
          </a>
        </div>
      </section>

      {/* Connect */}
      <section
        id="connect"
        style={{ background: COLORS.bandBg, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "88px 28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ font: "500 12px var(--font-plex-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.accent }}>
              01 · Connect
            </div>
            <h2 style={{ margin: 0, font: "400 clamp(40px,4.6vw,60px)/1 var(--font-instrument-serif), serif", letterSpacing: "-.01em" }}>
              Ask your assistant. It queries the graph.
            </h2>
            <p style={{ margin: 0, maxWidth: 480, color: COLORS.body, fontSize: 16, lineHeight: 1.55 }}>
              Add the BrainKB MCP server to Claude, Cursor or any MCP client with one command. Answers come
              back linked to their sources.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingTop: 18,
                borderTop: `1px solid ${COLORS.bandDivider}`,
                maxWidth: 480,
              }}
            >
              <div style={{ font: "500 13px var(--font-plex-mono)", color: COLORS.muted }}>Optional · Skills</div>
              <p style={{ margin: 0, color: COLORS.body, fontSize: 15, lineHeight: 1.55 }}>
                Ready-made workflows for cell-type lookup, dataset search and evidence review.
              </p>
            </div>
            <Link
              href="/mcp"
              style={{
                alignSelf: "flex-start",
                background: COLORS.secondaryAction,
                color: COLORS.pageBg,
                padding: "14px 22px",
                borderRadius: 999,
                fontWeight: 500,
                fontSize: 15,
                whiteSpace: "nowrap",
              }}
            >
              MCP details and all skills →
            </Link>
          </div>
          <InstallCard showThenAsk />
        </div>
      </section>

      {/* Explore */}
      <section
        id="explore"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 28px 104px", width: "100%", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}
      >
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ font: "500 12px var(--font-plex-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: COLORS.accent }}>
            02 · Explore
          </div>
          <h2 style={{ margin: 0, font: "400 clamp(40px,4.6vw,60px)/1 var(--font-instrument-serif), serif", letterSpacing: "-.01em" }}>
            See what the graph connects.
          </h2>
          <p style={{ margin: 0, maxWidth: 480, color: COLORS.body, fontSize: 16, lineHeight: 1.55 }}>
            Browse cell types, brain regions, datasets and papers, and follow the links between them. Data is
            drawn from archives like BICAN, DANDI and NeMO.
          </p>
          <Link
            href="/explore"
            style={{
              alignSelf: "flex-start",
              background: COLORS.secondaryAction,
              color: COLORS.pageBg,
              padding: "14px 22px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: 15,
              whiteSpace: "nowrap",
            }}
          >
            Explore the data →
          </Link>
        </div>
        <div style={{ flex: "0 1 360px", minWidth: 260 }}>
          <PlaceholderGraph />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
