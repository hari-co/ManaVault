import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "ManaVault",
  description: "Track your Magic: The Gathering collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#141823] m-0 p-0">
        <NavBar />
        <main className="flex-grow bg-[#181e2c] text-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
