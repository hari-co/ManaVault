import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../../components/navbar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col bg-white m-0 p-0">
          <NavBar />
          <main className="container m-0 p-0">
              {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
