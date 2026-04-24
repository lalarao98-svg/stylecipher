"use client";
import Image from "next/image";

interface ArchCardProps {
  code: string;
  name: string;
  family: string;
  imgUrl: string;
  accentColor: string;
  selected?: boolean;
  onClick?: () => void;
  showWeight?: number;
}

export default function ArchCard({ name, family, imgUrl, accentColor, selected, onClick, showWeight }: ArchCardProps) {
  return (
    <div
      className={`arch-card${selected ? " on" : ""}`}
      onClick={onClick}
      style={{ userSelect: "none" }}
    >
      <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
        <Image
          src={imgUrl}
          alt={name}
          fill
          sizes="200px"
          style={{ objectFit: "cover", filter: selected ? "saturate(1)" : "saturate(0.7) brightness(0.85)", transition: "filter 0.2s" }}
        />
        {showWeight !== undefined && showWeight > 0 && (
          <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(14,11,10,0.82)", padding: "2px 6px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontStyle: "italic", color: "#C8B898" }}>
              {Math.round(showWeight * 100)}%
            </span>
          </div>
        )}
        <div className="arch-card-label">
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, marginBottom: 2 }}>
            {family}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#F5EFE4", lineHeight: 1.2 }}>
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
