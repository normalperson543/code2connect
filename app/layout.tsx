import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ((process.env.DEPLOY_URL as string) ?? "http://localhost:35049");

export const metadata: Metadata = {
  title: {
    template: "%s | Code2Connect",
    default: "Code2Connect - the coding community where you belong",
  },
  description:
    "A fully-online coding platform for students, kids and teenagers to learn Python code and share their projects with a worldwide community",
  metadataBase: new URL(defaultUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" {...mantineHtmlProps}>
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
