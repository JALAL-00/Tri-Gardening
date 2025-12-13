'use client';

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, User, MapPin, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/addresses', label: 'My Addresses', icon: MapPin },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const [isClient, setIsClient] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setIsHydrated(true);
        // We add a check for isClient before redirecting
        if (typeof window !== 'undefined' && !isAuthenticated) {
            router.push('/login');
        }
    }, [isHydrated, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };
    
    // Check isClient first to prevent server/client mismatch on isAuthenticated
    if (!isClient) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-16 w-16 animate-spin text-green-600" />
            </div>
        );
    }
    
    // After client has mounted, we can safely check isAuthenticated
    if (!isAuthenticated) {
        // This will be shown for a split second before the useEffect redirects
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-16 w-16 animate-spin text-green-600" />
            </div>
        );
    }
    
    return (
        <div className="bg-[#FEFBF6]">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-green-900 mb-4">My Account</h2>
                            <nav className="space-y-2">
                                {sidebarNavItems.map(item => (
                                    <Link key={item.href} href={item.href} passHref>
                                        <div className={`flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer ${
                                            pathname === item.href 
                                            ? 'bg-green-100 text-green-800 font-semibold' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </div>
                                    </Link> 
                                ))}
                                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700">
                                    <LogOut className="h-5 w-5" />
                                    <span>Log Out</span>
                                </Button>
                            </nav>
                        </div>
                    </aside>

                    {/* Page Content */}
                    <main className="md:col-span-3">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}