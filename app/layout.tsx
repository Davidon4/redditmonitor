import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";


const inter = Inter({ 
  subsets: ['latin'],
  // Optional: you can specify variable font settings
  // variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Reddimon',
    default: 'Reddimon',
  },
  description: "Reddimon is a tool that allows you to monitor subreddits and get insights into their activity.",
  icons: {
    icon: '/reddimon.png'
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
       className={inter.className}
      >
        <SessionProvider session={session}>
          {children}
          </SessionProvider>
      </body>
    </html>
  );
}
