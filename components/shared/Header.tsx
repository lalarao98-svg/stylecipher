"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStyleStore } from "@/store/useStyleStore";
import { SEASONS } from "@/lib/data";

const TABS = [
  { label: "Decode",   href: "/" },
  { label: "Dossier",  href: "/guide" },
  { label: "Wardrobe", href: "/style-me" },
  { label: "Inspo",    href: "/inspo" },
];

export default function Header() {
  const pathname = usePathname();
  const { selK, selS } = useStyleStore();
  const seasonData = selS ? SEASONS[selS] : null;

  return (
    <header style={{
      background: "#0E0B0A",
      borderBottom: "1px solid rgba(200,184,152,0.1)",
      flexShrink: 0,
      position: "relative",
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", height: 56, paddingLeft: 40, paddingRight: 40 }}>
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0, marginRight: 48 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20,
            fontWeight: 600,
            fontStyle: "italic",
            color: "#F5EFE4",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}>
            StyleCipher
          </span>
        </Link>

        {/* Tab nav */}
        <nav style={{ display: "flex", flex: 1 }}>
          {TABS.map((tab) => {
            const isOn = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} style={{ textDecoration: "none" }}>
                <span className={`tab-item${isOn ? " on" : ""}`}>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile status */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {selK && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, background: "#B8962E", borderRadius: "50%" }} />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.1em", color: "#8A7A68" }}>
                {selK}
              </span>
            </div>
          )}
          {seasonData && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, background: seasonData.pal[0], borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.1em", color: "#8A7A68" }}>
                {seasonData.label}
              </span>
            </div>
          )}
          {!selK && !selS && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.1em", color: "rgba(138,122,104,0.4)" }}>
              No profile
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
