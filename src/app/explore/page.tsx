"use client";

/**
 * Explore — data-type cards. Content is placeholder (see
 * design_handoff_brainkb_site/README.md) — real data to fetch in
 * production: data types with counts.
 */

import { useState } from "react";
import Link from "next/link";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import { instrumentSerif, plexSans, plexMono } from "../components/marketing/fonts";
import { COLORS } from "../components/marketing/tokens";

const TYPES = [
  { name: "Cell types", color: COLORS.cellTypes, desc: "Taxonomies and cell-type definitions with markers and regions.", sources: "BICAN" },
  { name: "Brain regions", color: COLORS.regions, desc: "Anatomical regions and atlases, linked to cell types and data.", sources: "BICAN · atlases" },
  { name: "Datasets", color: COLORS.datasets, desc: "Recordings and omics datasets, pointing back to their archive.", sources: "DANDI · NeMO" },
  { name: "Literature", color: COLORS.literature, desc: "Claims extracted from papers, each linked to its source.", sources: "Papers" },
] as const;

export default function ExplorePage() {
  const [selectedType, setSelectedType] = useState<string>(TYPES[0].name);

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

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 28px 104px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Link href="/" style={{ font: "500 13px var(--font-plex-mono)", color: COLORS.muted }}>
            ← Home
          </Link>
          <h1 style={{ margin: 0, font: "400 clamp(44px,5.6vw,72px)/1 var(--font-instrument-serif), serif", letterSpacing: "-.02em" }}>
            Explore the graph.
          </h1>
          <p style={{ margin: 0, maxWidth: 580, color: COLORS.body, fontSize: 17, lineHeight: 1.55 }}>
            BrainKB points to data held by archives like BICAN, DANDI and NeMO. Pick a type of data to see
            what&apos;s indexed.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 16 }}>
          {TYPES.map((t) => {
            const active = t.name === selectedType;
            return (
              <button
                key={t.name}
                onClick={() => setSelectedType(t.name)}
                style={{
                  background: COLORS.cardBg,
                  color: COLORS.ink,
                  border: `1px solid ${active ? COLORS.ink : COLORS.border}`,
                  boxShadow: active ? `inset 0 -3px 0 ${t.color}` : "none",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color }} />
                <span style={{ font: "400 30px/1.05 var(--font-instrument-serif), serif" }}>{t.name}</span>
                <span style={{ color: COLORS.body, fontSize: 15, lineHeight: 1.5 }}>{t.desc}</span>
                <span style={{ font: "500 12px var(--font-plex-mono)", color: COLORS.muted }}>{t.sources}</span>
              </button>
            );
          })}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
