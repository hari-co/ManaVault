import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../../components/navbar";

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
      <body className="flex flex-col bg-white m-0 p-0">
        <NavBar />
        <main className="container m-0 p-0">
            {children}
        </main>
      </body>
    </html>
  );
}
