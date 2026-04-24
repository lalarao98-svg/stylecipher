"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStyleStore } from "@/store/useStyleStore";
import { SEASONS } from "@/lib/data";
import Rule from "./Rule";

const TABS = [
  { label: "Find My Type", href: "/" },
  { label: "Style Guide",  href: "/guide" },
  { label: "Style Me",     href: "/style-me" },
  { label: "Match Inspo",  href: "/inspo" },
];

export default function Header() {
  const pathname = usePathname();
  const { selK, selS } = useStyleStore();
  const seasonData = selS ? SEASONS[selS] : null;

  return (
    <header style={{ background: "#FFFFFF", borderBottom: "1px solid #C8B898", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", height: 52, paddingLeft: 32, paddingRight: 32 }}>
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#221516",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}>
            StyleCipher
          </span>
        </Link>

        {/* Tab nav */}
        <nav style={{ display: "flex", marginLeft: 32, flex: 1 }}>
          {TABS.map((tab) => {
            const isOn = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} style={{ textDecoration: "none" }}>
                <span className={`tab-item${isOn ? " on" : ""}`}>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile chips */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {selK && (
            <span className="chip on" style={{ cursor: "default", fontSize: 9 }}>{selK}</span>
          )}
          {seasonData && (
            <span
              className="chip on"
              style={{ cursor: "default", fontSize: 9, background: seasonData.pal[0], borderColor: seasonData.pal[0] }}
            >
              {seasonData.label}
            </span>
          )}
        </div>
      </div>
      <Rule color="#3B0510" />
    </header>
  );
}
