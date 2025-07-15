import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../../components/Navbar";

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
      <body className="flex flex-col bg-white m-0 p-0 inter-regular">
        <NavBar />
        <main className="">
            {children}
        </main>
      </body>
    </html>
  );
}
