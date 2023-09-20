import "@radix-ui/themes/styles.css";

import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "transcriptor.ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme accentColor="brown" appearance="dark">
          {children}
        </Theme>
      </body>
    </html>
  );
}
