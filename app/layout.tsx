import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "투스텝홀 | 무용연습실 대관",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
