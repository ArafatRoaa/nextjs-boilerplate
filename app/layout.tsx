import type { Metadata } from "next";
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "Amana Transportation",
  description: "Live bus tracking and schedules",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
