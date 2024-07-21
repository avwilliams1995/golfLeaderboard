
import { Inter } from "next/font/google";
import "./App.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: any = {
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
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/2e.png" as="image" />
        <link rel="preload" href="/2e-2.png" as="image" />
        <link rel="preload" href="/2e-3.jpeg" as="image" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
