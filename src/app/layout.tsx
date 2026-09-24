import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "./components/auth/SessionProvider";
import SessionExpiryWatcher from "./components/auth/SessionExpiryWatcher";
import dynamic from "next/dynamic"; // Required for Client Component import
// Dynamically import the BrainKB Assistant client component
// import BrainKBAssistantClient from "./components/assistant/BrainKBAssistantClient";
import BrainKBAssistantWrapper from "./components/assistant/BrainKBAssistantClient";
import AssistantInitializer from "./components/assistant/AssistantInitializer";
// TanStack Query client — used by SynthScholar (and any future page that wants
// react-query primitives). Mounted high so all client subtrees share one cache.
import QueryProvider from "./components/synth-scholar/QueryProvider";

// Dynamically import SiteChrome (client component — decides Navbar/Footer vs.
// standalone marketing pages based on route; see its own doc comment)
const SiteChrome = dynamic(() => import("./components/layout/SiteChrome"), { ssr: false });
// Dynamically import the CookieConsentBanner (client component)
const CookieConsentBanner = dynamic(() => import("./components/layout/CookieConsent"), { ssr: false
});

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: {
    default: "BrainKB",
    template: "%s | BrainKB",
  },
  description: "A large-scale Neuroscience Knowledge Graph Infrastructure",
};

// Viewport meta — REQUIRED for mobile responsiveness. Without
// `width=device-width`, mobile browsers fall back to a ~980px layout viewport,
// so every `@media (max-width: ...)` rule (and all our responsive layouts)
// would be ignored and the site would render desktop-width and scaled down.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>

        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className={inter.className}>
      {/* Google Tag Manager NoScript - Runs only if consent is given */}
      <noscript>
          <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-W79DN38R"
              height="0"
              width="0"
              style={{display: "none", visibility: "hidden"}}
          ></iframe>
      </noscript>

      <SessionProvider session={session}>
          {/* One place that reacts to an expired backend credential, instead of
              every feature reporting its own "please sign in" failure. */}
          <SessionExpiryWatcher/>
          <QueryProvider>
              <SiteChrome>{children}</SiteChrome>
          </QueryProvider>
      </SessionProvider>
      {/*<div className="assistant">*/}
      {/*    <BrainKBAssistantWrapper/>*/}
      {/*    <AssistantInitializer/>*/}
      {/*</div>*/}
      {/* Client-side Cookie Consent Banner */}
      <CookieConsentBanner/>


      </body>
    </html>
  );
}
