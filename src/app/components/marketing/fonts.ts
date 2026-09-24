// Fonts for the public marketing pages (Home, MCP & Skills, Explore) only —
// deliberately separate from the app-wide `Inter` in the root layout, per the
// design handoff (design_handoff_brainkb_site/README.md).
import { Instrument_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
