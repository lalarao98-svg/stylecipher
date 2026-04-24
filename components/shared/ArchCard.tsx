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
  showWeight?: number; // 0-1, optional weight overlay
}

export default function ArchCard({ code, name, family, imgUrl, accentColor, selected, onClick, showWeight }: ArchCardProps) {
  return (
    <div
      className={`arch-card${selected ? " on" : ""}`}
      onClick={onClick}
      style={{ userSelect: "none" }}
    >
      <div style={{ position: "relative", height: 90, overflow: "hidden" }}>
        <Image
          src={imgUrl}
          alt={name}
          fill
          sizes="200px"
          style={{ objectFit: "cover", filter: selected ? "saturate(1)" : "saturate(0.85)", transition: "filter 0.2s" }}
        />
        {showWeight !== undefined && (
          <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(34,21,22,0.75)", padding: "2px 5px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontStyle: "italic", color: "#F2EBE0" }}>
              {Math.round(showWeight * 100)}%
            </span>
          </div>
        )}
        <div className="arch-card-label">
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, marginBottom: 1 }}>
            {family}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#F2EBE0", lineHeight: 1.2 }}>
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
