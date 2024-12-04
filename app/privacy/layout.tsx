"use client";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <Header/>
        {children}
        <Footer/>
        </>
    )
}
