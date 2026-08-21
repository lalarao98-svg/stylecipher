import type { Metadata } from "next";
import FantasyNav from "@/components/fantasy/FantasyNav";

export const metadata: Metadata = {
  title: "GridironCipher · Fantasy Football Analytics",
  description:
    "Multi-source projection aggregation, value over replacement, risk, and auction optimization — ported from FantasyFootballAnalyticsR.",
};

export default function FantasyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0E0B0A" }}>
      <FantasyNav />
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</main>
    </div>
  );
}
