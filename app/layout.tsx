import type { Metadata } from "next";
import "./globals.css";
import SupabaseSync from "@/components/shared/SupabaseSync";

export const metadata: Metadata = {
  title:       "StyleCipher",
  description: "Your personal styling intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden" }}>
        <SupabaseSync />
        {children}
      </body>
    </html>
  );
}
