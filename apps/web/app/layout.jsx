import { Familjen_Grotesk, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-data" });

export const metadata = {
  metadataBase: new URL("https://www.deltalyn.com"),
  title: { default: "Deltalyn", template: "%s · Deltalyn" },
  description:
    "Deltalyn is an AI copilot for TradingView Desktop. Pre-market briefs, replay drills and post-session reviews. Runs on your computer and never places a trade.",
  openGraph: {
    title: "Deltalyn",
    description: "A copilot that reads your chart. You make the calls.",
    url: "https://www.deltalyn.com",
    siteName: "Deltalyn",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport = { themeColor: "#070B14", colorScheme: "dark" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
