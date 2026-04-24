"use client";
import { useState, useRef, useCallback } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { ARCHETYPES } from "@/lib/data";
import type { ArchetypeCode, StyleMeResult } from "@/lib/types";
import ProfileSidebar from "@/components/shared/ProfileSidebar";

export default function InspoPage() {
  const { selK, selS, archWeights } = useStyleStore();
  const [dragging, setDragging] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StyleMeResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const codes = Object.keys(ARCHETYPES) as ArchetypeCode[];
  const top3Names = codes
    .sort((a, b) => (archWeights[b] ?? 0) - (archWeights[a] ?? 0))
    .slice(0, 3)
    .map((c) => ARCHETYPES[c].name);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResults([]);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  async function handleStyleThisLook() {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      const res = await fetch("/api/style-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kibbeType: selK,
          colorSeason: selS,
          archetypes: top3Names,
          platform: "all",
          category: "all",
          vibes: [],
          inspoImage: base64,
          inspoMode: true,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: StyleMeResult[] = await res.json();
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "48px 56px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
          <span className="sec-num">01</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 10 }}>
              Match Inspo
            </p>
            <div style={{ width: 48, height: 1, background: "#5A6012" }} />
          </div>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.88, marginBottom: 20 }}>
          Style This Look
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, maxWidth: 480, marginBottom: 40 }}>
          Drop an inspo image — a runway look, a street style shot, a celebrity outfit — and we&apos;ll find equivalent pieces that work for your body type and colour season.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            maxWidth: 520,
            height: imagePreview ? "auto" : 240,
            border: `1px dashed ${dragging ? "#3B0510" : "rgba(200,184,152,0.2)"}`,
            background: dragging ? "rgba(59,5,16,0.08)" : "rgba(245,239,228,0.02)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            transition: "all 0.15s",
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          {imagePreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imagePreview} alt="Inspo preview" style={{ width: "100%", maxHeight: 400, objectFit: "contain" }} />
          ) : (
            <div style={{ textAlign: "center", padding: 32 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontStyle: "italic", color: "rgba(200,184,152,0.4)", marginBottom: 10 }}>
                Drop your inspo image here
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 300, color: "rgba(138,122,104,0.4)", letterSpacing: "0.08em" }}>
                or click to browse
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />

        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <button
            className="btn-primary"
            disabled={!imageFile || loading || (!selK && !selS)}
            onClick={handleStyleThisLook}
          >
            {loading ? "Analysing…" : "Style This Look"}
          </button>
          {imagePreview && (
            <button className="btn-ghost" onClick={() => { setImageFile(null); setImagePreview(null); setResults([]); }}>
              Clear
            </button>
          )}
        </div>

        {!selK && !selS && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(138,122,104,0.5)", lineHeight: 1.7, marginBottom: 24 }}>
            Complete your profile on <a href="/" style={{ color: "#B8962E", textDecoration: "none", borderBottom: "1px solid rgba(184,150,46,0.4)" }}>Decode</a> to get personalised results.
          </p>
        )}

        {error && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "#9B2A2A", marginBottom: 20 }}>{error}</p>
        )}

        {results.length > 0 && (
          <div>
            <div style={{ width: 48, height: 1, background: "#5A6012", marginBottom: 28 }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 20 }}>
              Matched Pieces
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map((item, i) => (
                <div key={i} className="result-card" style={{ padding: "18px 22px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontStyle: "italic", fontWeight: 300, color: "#4A6B8A", lineHeight: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A7A68" }}>{item.platform}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, fontStyle: "italic", color: "#4A6B8A" }}>
                        {item.price}
                      </p>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#221516", lineHeight: 1.2, marginTop: 6 }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "#6A5A4A", marginTop: 4 }}>{item.brand}</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "#8A7A68", fontStyle: "italic", lineHeight: 1.7, marginTop: 8 }}>{item.match}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 12, display: "inline-block" }}>
                        View Item
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProfileSidebar />
    </div>
  );
}
