import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marissa & Ross — Wedding RSVP",
  description: "RSVP for the Marissa & Ross wedding celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
