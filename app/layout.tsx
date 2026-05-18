import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LaporKita – Pengaduan Masyarakat",
  description: "Platform pengaduan masyarakat yang transparan dan akuntabel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Lato, sans-serif",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid #E5DAC8",
              color: "#4A3630",
            },
          }}
        />
      </body>
    </html>
  );
}
