import { COLORS } from "./tokens";

export default function MarketingFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: "auto" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 28,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          fontSize: 13,
          color: COLORS.muted,
        }}
      >
        <span>BrainKB · Senseable Intelligence Group, MIT</span>
        <div style={{ display: "flex", gap: 22 }}>
          <a href="https://docs.brainkb.org" style={{ color: COLORS.muted }}>
            Docs
          </a>
          <a href="https://github.com/sensein/brainkb" style={{ color: COLORS.muted }}>
            GitHub
          </a>
          <a href="mailto:brainkb@mit.edu" style={{ color: COLORS.muted }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
