import type { Metadata } from "next";

import localFont from "next/font/local";

import "./globals.css";

const heliotrope3 = localFont({
  display: "swap",
  src: [
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_3_regular.woff2",
      style: "normal",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_3_italic.woff2",
      style: "italic",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_3_bold.woff2",
      weight: "bold",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_3_bold_italic.woff2",
      style: "italic",
      weight: "bold",
    },
  ],
  variable: "--font-heliotrope3",
});

const heliotrope4 = localFont({
  display: "swap",
  src: [
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_4_regular.woff2",
      style: "normal",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_4_italic.woff2",
      style: "italic",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_4_bold.woff2",
      weight: "bold",
    },
    {
      path: "./../node_modules/@julianelda/stilo/fonts/heliotrope_4_bold_italic.woff2",
      style: "italic",
      weight: "bold",
    },
  ],
  variable: "--font-heliotrope4",
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  description: "Julius Polar's Homepage",
  title: "Julius Polar - Front-end developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${heliotrope3.variable} ${heliotrope4.variable} antialiased`}
      lang="en">
      <body className="bg-app-background-light text-app-text-light dark:bg-app-background-dark dark:text-app-text-dark size-full font-serif">
        {children}
      </body>
    </html>
  );
}
