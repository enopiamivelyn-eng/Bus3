import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./components/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bus Ticketing",
    template: "%s | Bus Ticketing",
  },
  description:
    "Book bus tickets online for Cebu, Bato, Oslob, Boljoon and Dalaguete. Manage reservations, view e-tickets and track your trips in one place.",
  icons: {
    icon: [
      { url: "/icon32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/icon180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col"><AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
