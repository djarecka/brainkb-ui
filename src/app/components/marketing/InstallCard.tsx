"use client";

import { useState } from "react";
import { MCP_CLIENTS } from "./tokens";
import { COLORS } from "./tokens";

interface InstallCardProps {
  /** Home shows a "then ask" example prompt below the code box; the MCP page doesn't. */
  showThenAsk?: boolean;
}

export default function InstallCard({ showThenAsk = false }: InstallCardProps) {
  const [clientName, setClientName] = useState<string>(MCP_CLIENTS[0].name);
  const [copied, setCopied] = useState(false);
  const client = MCP_CLIENTS.find((c) => c.name === clientName) ?? MCP_CLIENTS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(client.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div
      style={{
        background: COLORS.cardBg,
        color: COLORS.ink,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 30px 60px -36px rgba(22,24,26,.25)",
      }}
    >
      <div style={{ display: "flex", gap: 4, padding: "10px 10px 0", borderBottom: `1px solid ${COLORS.border}`, flexWrap: "wrap" }}>
        {MCP_CLIENTS.map((c) => {
          const active = c.name === client.name;
          return (
            <button
              key={c.name}
              onClick={() => {
                setClientName(c.name);
                setCopied(false);
              }}
              style={{
                background: active ? COLORS.pageBg : "transparent",
                color: active ? COLORS.ink : COLORS.muted,
                border: `1px solid ${active ? COLORS.border : "transparent"}`,
                borderBottom: "none",
                borderRadius: "7px 7px 0 0",
                padding: "9px 14px",
                font: "500 12.5px var(--font-plex-mono, monospace)",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "22px 22px 8px", font: "400 13px/1.7 var(--font-plex-mono, monospace)", color: COLORS.muted }}>
        {client.hint}
      </div>
      <div
        style={{
          margin: "0 22px",
          padding: "16px 18px",
          background: COLORS.pageBg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <pre
          style={{
            margin: 0,
            font: "400 13.5px/1.65 var(--font-plex-mono, monospace)",
            color: COLORS.ink,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {client.cmd}
        </pre>
        <button
          onClick={handleCopy}
          style={{
            flex: "none",
            background: "transparent",
            border: `1px solid ${COLORS.borderStrong}`,
            color: COLORS.ink,
            borderRadius: 6,
            padding: "5px 10px",
            font: "500 12px var(--font-plex-mono, monospace)",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {showThenAsk && (
        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, font: "400 13.5px/1.6 var(--font-plex-mono, monospace)" }}>
          <div style={{ color: COLORS.muted }}>› then ask</div>
          <div style={{ color: COLORS.ink }}>
            &quot;Which datasets profile L5 extratelencephalic neurons in human motor cortex?&quot;
          </div>
        </div>
      )}
    </div>
  );
}
