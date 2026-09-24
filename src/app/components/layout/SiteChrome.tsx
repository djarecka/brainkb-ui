"use client";

/**
 * Decides whether a route gets the app-wide Navbar/Footer/Theme chrome, or
 * renders standalone. The public marketing pages (Home, MCP & Skills,
 * Explore — see design_handoff_brainkb_site/README.md) have their own
 * self-contained header/footer/design tokens and deliberately skip the rest
 * of the site's chrome; every other route keeps the original Navbar/Footer.
 */

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "@/src/app/Footer";
import { Theme } from "@/src/app/components/design-system";

const MARKETING_ROUTES = new Set(["/", "/mcp", "/explore"]);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname !== null && MARKETING_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <Theme theme="light" style={{ background: "#f0eee9" }}>
        <main className="flex min-h-screen flex-col pt-16">{children}</main>
      </Theme>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
