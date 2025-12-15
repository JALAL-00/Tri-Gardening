'use client';

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Copy, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getReferralSummary = async () => (await api.get('/profile/referral-summary')).data;

export default function ReferralProgram() {
    const { data: summary, isLoading } = useQuery({ queryKey: ['referralSummary'], queryFn: getReferralSummary });

    const handleCopy = () => {
        if (summary?.referralCode) {
            navigator.clipboard.writeText(summary.referralCode);
            alert("Referral code copied!");
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-green-900">Referral Program</h1>
            <p className="text-gray-600 -mt-6">Share the love for gardening and earn rewards!</p>
            
            <Card className="bg-green-600/90 text-white text-center">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-semibold">Share the Green, Earn Some Green!</h2>
                    <p className="text-green-200 mt-2">Invite friends to discover the joy of gardening and earn rewards for every successful referral</p>
                    <div className="mt-6">
                        <p className="text-sm text-green-200">Your Unique Referral Code</p>
                        <div className="flex justify-center items-center gap-4 mt-2">
                            <div className="border-2 border-dashed border-green-300 px-6 py-3 text-2xl font-bold tracking-widest">
                                {summary?.referralCode}
                            </div>
                            <Button onClick={handleCopy} variant="secondary" className="bg-white text-green-800 hover:bg-gray-200">
                                <Copy className="mr-2 h-4 w-4" /> Copy
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <Card className="bg-white p-6"><p className="text-2xl font-bold text-green-800">৳ {summary?.totalEarned}</p><p className="text-gray-500">Total Earned Credit</p></Card>
                <Card className="bg-white p-6"><p className="text-2xl font-bold text-green-800">৳ 1,400</p><p className="text-gray-500">Remaining Credit</p></Card>
                <Card className="bg-white p-6"><p className="text-2xl font-bold text-green-800">{summary?.successfulReferrals}</p><p className="text-gray-500">Successful Referrals</p></Card>
            </div>
            
            {/* The chart and referral status table would be additional components */}
            {/* For now, this completes the top section of the page */}
        </div>
    );
}