import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RÄTTPRIS",
  description: "Spara och hantera dina kvitton",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
