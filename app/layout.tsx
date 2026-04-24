import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import SupabaseSync from "@/components/shared/SupabaseSync";

export const metadata: Metadata = {
  title:       "StyleCipher",
  description: "Your personal styling intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <SupabaseSync />
        <Header />
        <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
