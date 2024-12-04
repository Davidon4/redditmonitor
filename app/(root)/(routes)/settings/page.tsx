"use client";

import { redirect } from "next/navigation";
import SubredditSettings from "@/components/SubredditSettings";
import AccountSettings from "@/components/AccountSettings";
import {SidebarTrigger} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import {Loader2, AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/');
        }
    }, [status]);

    // Show loading only when session is loading
    if (status === 'loading') {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-white/80">
                <Loader2 className="w-16 h-16 md:w-20 md:h-20 animate-spin text-purple-700" />
            </div>
        );
    }

    return (
        <div className="container mx-auto bg-gray-50 px-4 py-6 relative">
            {isLoading && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center bg-white/80">
                    <Loader2 className="w-16 h-16 md:w-20 md:h-20 animate-spin text-purple-700" />
                </div>
            )}
            {error ? (
                <div className="min-h-[600px] flex flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
                    </div>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try again
                    </Button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger/>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm mt-6 border border-gray-100 p-6">
                            <SubredditSettings setIsLoading={setIsLoading} setError={setError} />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm mt-10 border border-gray-100 p-6">
                        {session?.user?.name && session.user.email && session.user.image && (
                            <AccountSettings user={{
                                name: session.user.name,
                                email: session.user.email,
                                image: session.user.image
                            }} />
                        )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}