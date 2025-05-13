import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const heliotrope3 = localFont({
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
  display: "swap",
  variable: "--font-heliotrope3",
});

const heliotrope4 = localFont({
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
  display: "swap",
  variable: "--font-heliotrope4",
});

export const metadata: Metadata = {
  title: "Julius Polar - Front-end developer",
  description: "Julius Polar's Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heliotrope3.variable} ${heliotrope4.variable} antialiased`}>
      <body className="bg-gray-50 p-2 font-serif text-neutral-900 dark:bg-gray-800 dark:text-gray-50">
        {children}
      </body>
    </html>
  );
}
