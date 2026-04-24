interface PaletteDisplayProps {
  pal: string[];   // 8 main colors
  neut: string[];  // 3 neutrals
}

export default function PaletteDisplay({ pal, neut }: PaletteDisplayProps) {
  return (
    <div>
      <div style={{ display: "flex", gap: 2 }}>
        {pal.map((hex, i) => (
          <div
            key={hex + i}
            style={{
              flex: i < 3 ? 2 : 1,
              height: i < 3 ? 88 : 56,
              background: hex,
              alignSelf: "flex-end",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
        {neut.map((hex, i) => (
          <div key={hex + i} style={{ flex: 1, height: 20, background: hex }} />
        ))}
      </div>
    </div>
  );
}
