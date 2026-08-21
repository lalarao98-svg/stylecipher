"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DATASET } from "@/lib/fantasy";
import { SANS, SERIF, T } from "./theme";

const TABS = [
  { label: "Draft Board", href: "/fantasy" },
  { label: "Auction Optimizer", href: "/fantasy/optimizer" },
];

export default function FantasyNav() {
  const pathname = usePathname();
  return (
    <header
      style={{
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", height: 56, padding: "0 40px", gap: 32 }}>
        <Link href="/fantasy" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 600,
              fontStyle: "italic",
              color: T.textPrimary,
              letterSpacing: "0.02em",
            }}
          >
            Gridiron<span style={{ color: T.accent }}>Cipher</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 24, flex: 1 }}>
          {TABS.map((tab) => {
            const on = tab.href === "/fantasy" ? pathname === "/fantasy" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  textDecoration: "none",
                  fontFamily: SANS,
                  fontSize: 12,
                  fontWeight: on ? 500 : 300,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: on ? T.textPrimary : T.textMuted,
                  borderBottom: on ? `1px solid ${T.accent}` : "1px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 300, letterSpacing: "0.1em", color: T.textMuted }}>
            {DATASET.season} PROJECTIONS · {Object.keys(DATASET.sources).length} SOURCES
          </span>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: T.textMuted,
              border: `1px solid ${T.border}`,
              padding: "4px 10px",
              borderRadius: 2,
            }}
          >
            ← STYLECIPHER
          </Link>
        </div>
      </div>
    </header>
  );
}
