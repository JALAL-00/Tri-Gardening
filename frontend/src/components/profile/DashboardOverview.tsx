'use client';

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, User, Phone, Mail, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // <-- Import useRouter

const getProfile = async () => (await api.get('/profile')).data;

export default function DashboardOverview() {
    const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
    const router = useRouter(); // <-- Initialize the router

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
            <p className="text-gray-600 -mt-6">Your profile information and account overview in a glimpse</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Profile Information</CardTitle>
                        {/* --- CORRECTED BUTTON --- */}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push('/profile')} // <-- Use router.push
                        >
                            <Edit className="mr-2 h-3 w-3" /> Edit Profile
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><User className="h-5 w-5 text-gray-500" /> <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium text-gray-800">{profile?.fullName}</p></div></div>
                        <div className="flex items-center gap-4"><Phone className="h-5 w-5 text-gray-500" /> <div><p className="text-sm text-gray-500">Phone Number</p><p className="font-medium text-gray-800">{profile?.phone}</p></div></div>
                        <div className="flex items-center gap-4"><Mail className="h-5 w-5 text-gray-500" /> <div><p className="text-sm text-gray-500">Email Address</p><p className="font-medium text-gray-800">{profile?.email || 'None'}</p></div></div>
                    </CardContent>
                </Card>

                {/* Your Addresses */}
                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Your Addresses</CardTitle>
                        {/* --- CORRECTED BUTTON --- */}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push('/addresses')} // <-- Use router.push
                        >
                            <Edit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile?.addresses?.slice(0, 2).map((address: any, index: number) => (
                             <div key={address.id} className="border p-4 rounded-lg bg-gray-50">
                                <p className="font-semibold text-green-900">{address.isDefault ? "Shipping Address" : `Address ${index + 1}`}</p>
                                <div className="text-sm text-gray-600 mt-1">
                                    <p>{address.thana}, {address.district}</p>
                                    <p>{address.fullAddress}</p>
                                </div>
                            </div>
                        ))}
                         {(!profile?.addresses || profile.addresses.length === 0) && <p className="text-gray-500">No saved addresses.</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Credits Summary */}
            <Card className="bg-green-600/90 text-white">
                <CardHeader><CardTitle>Your TriGardening Credits Summary</CardTitle></CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-8 text-center">
                    <div><p className="text-4xl font-bold">৳ 3,400</p><p className="text-green-200">Total Credits Earned</p></div>
                    <div><p className="text-4xl font-bold">৳ 600</p><p className="text-green-200">Credits Used</p></div>
                    <div><p className="text-4xl font-bold">12</p><p className="text-green-200">Successful Referrals</p></div>
                </CardContent>
                <div className="p-6 pt-2 text-center">
                    {/* --- CORRECTED BUTTON --- */}
                    <Button 
                        variant="outline" 
                        className="bg-transparent border-white text-white hover:bg-white/10"
                        onClick={() => router.push('/referrals')} // <-- Use router.push
                    >
                        View Full Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
}