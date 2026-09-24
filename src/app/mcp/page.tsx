/**
 * MCP & Skills — public marketing page. Visual template matches Home/Explore
 * (design_handoff_brainkb_site/README.md); content is the real MCP server
 * details (previously on this same route, in the old editorial style) —
 * not the design handoff's placeholder skill cards.
 */

import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import InstallCard from "../components/marketing/InstallCard";
import { instrumentSerif, plexSans, plexMono } from "../components/marketing/fonts";
import { COLORS, MCP_ENDPOINT } from "../components/marketing/tokens";

const CAPABILITIES = [
  { name: "Spaces & graphs", desc: "Create private/team workspaces, register named graphs, manage members and access." },
  { name: "Ingest", desc: "Load RDF (Turtle / N-Triples / JSON-LD) — raw text or files up to ~5 GB — as background jobs." },
  { name: "Read & search", desc: "Access-filtered full-text search, read a space's RDF, list registered graphs." },
  { name: "Provenance (PROV-O)", desc: "Per-job provenance, a graph's change history, and the exact triples each ingest added." },
  { name: "Personal Access Tokens", desc: "Mint a browser-free token to authenticate the assistant, then revoke it any time." },
  { name: "Admin (if authorized)", desc: "Manage users, roles, capabilities, and per-space access rules." },
] as const;

export default function McpPage() {
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

      {/* Setup */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 28px 72px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
          gap: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <h1 style={{ margin: 0, font: "400 clamp(34px,4.2vw,52px)/1.05 var(--font-instrument-serif), serif", letterSpacing: "-.02em", color: COLORS.accent }}>
            The BrainKB MCP server.
          </h1>
          <p style={{ margin: 0, color: COLORS.body, fontSize: 17, lineHeight: 1.65 }}>
            BrainKB exposes an MCP server so an assistant can operate the knowledge graph on your
            behalf: ingest data, search, explore provenance, and manage spaces, using your own account
            and permissions.
          </p>
          <p style={{ margin: 0, color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>
            Every action is access-controlled server-side exactly as in this web app — a{" "}
            <code>403</code> means a permission is missing, not a broken token.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ font: "500 12px var(--font-plex-mono)", color: COLORS.muted }}>Endpoint</span>
            <code
              style={{
                font: "400 14px var(--font-plex-mono)",
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                width: "fit-content",
              }}
            >
              {MCP_ENDPOINT}
            </code>
          </div>
        </div>
        <InstallCard authNote />
      </section>

      {/* Capabilities */}
      <section style={{ background: COLORS.bandBg, padding: "80px 28px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ margin: 0, font: "400 clamp(36px,4vw,52px)/1.1 var(--font-instrument-serif), serif", color: COLORS.accent }}>
                What your assistant can do.
              </h2>
            </div>
            <span style={{ fontSize: 13, fontStyle: "italic", color: COLORS.muted }}>
              TODO: we should provide more description and links to the skills
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {CAPABILITIES.map((c) => (
              <div key={c.name} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 28 }}>
                <div style={{ font: "400 22px/1.1 var(--font-instrument-serif), serif", marginBottom: 10 }}>{c.name}</div>
                <p style={{ margin: 0, fontSize: 14, color: COLORS.body, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
