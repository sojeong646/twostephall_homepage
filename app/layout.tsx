import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Analytics from "./Analytics";

export const metadata: Metadata = {
  title: "무용연습실 투스텝홀 | 한 번을 연습해도 제대로",
  description: "방배점 · 서초점 | 무용연습실 투스텝홀",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
