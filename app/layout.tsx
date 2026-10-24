import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PreferencesProvider } from "@/context/PreferencesContext";

export const metadata: Metadata = {
  title: "Yojana Finder - Find Indian Government Schemes You Qualify For",
  description:
    "Free, simple eligibility finder for Central and State government welfare schemes, scholarships, farming support, and pensions in India. No Aadhaar required.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-800 bg-slate-50 selection:bg-amber-100 selection:text-amber-900">
        <PreferencesProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PreferencesProvider>
      </body>
    </html>
  );
}
