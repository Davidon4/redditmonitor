'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface AccountSettingsProps {
    user: {
        name: string;
        email: string;
        image: string;  
    };
}

export default function AccountSettings({ user }: AccountSettingsProps) {
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [timezone, setTimezone] = useState('');
    const [utcOffset, setUtcOffset] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Get user's timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = new Date().getTimezoneOffset();
        const hours = Math.abs(Math.floor(offset / 60));
        const minutes = Math.abs(offset % 60);
        const sign = offset < 0 ? '+' : '-';
        
        setTimezone(tz);
        setUtcOffset(`UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Add API call to update display name
            router.refresh();
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account information
                </p>
            </div>

            <div className="flex items-center gap-4">
                {user?.image && (
                    <Image
                        src={user.image}
                        alt="Profile"
                        width={60}
                        height={60}
                        className="rounded-md"
                    />
                )}
                <div>
                    <h3 className="font-medium text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                        Display Name
                    </label>
                    <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="max-w-md"
                        placeholder="Enter your display name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                        Email Address
                    </label>
                    <Input
                        value={user?.email}
                        disabled
                        className="max-w-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                        Timezone
                    </label>
                    <div className="flex gap-2 max-w-md">
                        <Input
                            value={timezone}
                            disabled
                            className="flex-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <Input
                            value={utcOffset}
                            disabled
                            className="w-28 bg-gray-50 text-gray-500 cursor-not-allowed text-center"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={loading || displayName === user?.name}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}