import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./App.css"; // Ensure this path is correct and points to your App.css file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel League Gahlf",
  description: "Golf leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
