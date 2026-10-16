import { Familjen_Grotesk, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-data" });

export const metadata = {
  metadataBase: new URL("https://www.deltalyn.com"),
  title: { default: "Deltalyn", template: "%s · Deltalyn" },
  description:
    "Daily scenarios for US stocks and crypto: clear price levels, honest odds, and a public, auto-graded record of every call.",
  openGraph: {
    title: "Deltalyn",
    description: "Clear levels. Honest odds. Every call on the record.",
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
