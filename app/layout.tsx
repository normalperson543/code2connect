import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    template: "%s | Code2Connect",
    default: "Code2Connect - the coding community where you belong",
  },
  description:
    "A fully-online coding platform for students, kids and teenagers to learn Python code and share their projects with a worldwide community",
  metadataBase: new URL(defaultUrl),
};

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

const publicSans = Public_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.className} ${publicSans.className} antialiased`}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript />
        <NextTopLoader />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className="w-full h-full">{children}</body>
    </html>
  );
}
