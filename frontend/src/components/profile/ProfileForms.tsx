'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Upload, KeyRound, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";

// API functions
const getProfile = async () => (await api.get('/profile')).data;
const updateProfile = async (data: any) => (await api.put('/profile', data)).data;
const changePassword = async (data: any) => (await api.put('/profile/change-password', data)).data;
const uploadProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export default function ProfileForms() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const setToken = useAuthStore((state) => state.setToken); // Get the setToken function from the store

    const { data: profile, isLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

    const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPasswordForm } = useForm();

    useEffect(() => {
        if (profile) {
            resetProfile({
                fullName: profile.fullName,
                email: profile.email,
            });
        }
    }, [profile, resetProfile]);

    const profileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            alert('Profile updated successfully!');
            setToken(data.accessToken);

            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to update profile.'),
    });
    
    const pictureMutation = useMutation({
        mutationFn: uploadProfilePicture,
        onSuccess: () => {
            alert('Profile picture updated!');
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to upload picture.'),
    });

    const passwordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            alert('Password changed successfully!');
            resetPasswordForm();
        },
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to change password.'),
    });
    
    const constructImageUrl = (path: string | null) => {
        if (!path) return "/placeholder-avatar.jpg";
        return `http://localhost:5005${path}`;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            pictureMutation.mutate(file);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="space-y-8 text-gray-800">
            {/* --- Profile Information Form --- */}
            <form id="profile-form" onSubmit={handleSubmitProfile(data => profileMutation.mutate(data))}>
                <Card className="bg-white shadow-lg rounded-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-green-900">My Profile</CardTitle>
                                <CardDescription>Edit your profile settings</CardDescription>
                            </div>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={profileMutation.isPending}>
                                {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                                <Image src={constructImageUrl(profile?.profilePictureUrl)} alt="Profile Picture" width={128} height={128} className="rounded-full w-32 h-32 object-cover border-4 border-gray-100" />
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                                <div className="flex gap-2">
                                    <Button type="button" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                                    </Button>
                                    <Button type="button" variant="outline" size="sm">Remove</Button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow w-full">
                                <div className="space-y-2"><Label htmlFor="fullName" className="text-green-600">Full Name</Label><Input id="fullName" {...registerProfile('fullName')} className="bg-gray-50 text-black" /></div>
                                <div className="space-y-2"><Label htmlFor="phone" className="text-green-600">Phone Number *</Label><Input id="phone" value={profile?.phone} readOnly disabled className="bg-gray-200 text-black" /></div>

                                <div className="space-y-2"><Label htmlFor="thana" className="text-green-600">Thana <span className="text-gray-500">(Optional)</span></Label><Select><SelectTrigger className="bg-gray-50 text-black"><SelectValue placeholder="Dhaka" /></SelectTrigger></Select></div>

                                <div className="space-y-2"><Label htmlFor="district" className="text-green-600">District *</Label><Select><SelectTrigger className="bg-gray-50 text-black"><SelectValue placeholder="Dhaka" /></SelectTrigger></Select></div>

                                <div className="sm:col-span-2 space-y-2"><Label htmlFor="email" className="text-green-600">Email Address <span className="text-gray-500 font-medium">(Optional)</span></Label><Input id="email" type="email" {...registerProfile('email')} className="bg-gray-50 text-black" /></div>
                                <div className="sm:col-span-2 space-y-2"><Label htmlFor="secondaryPhone" className="text-green-600">Secondary Number <span className="text-gray-500 font-medium">(Optional)</span></Label><Input id="secondaryPhone" placeholder="+8801234567890" className="bg-gray-50 text-black" /></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* --- Security Section --- */}
            <Card className="bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-green-900">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">Change Password</h3>
                        <p className="text-sm text-gray-500">Change Your Password</p>
                        <form onSubmit={handleSubmitPassword(data => passwordMutation.mutate(data))} className="mt-4 space-y-4 max-w-lg">
                           <div className="space-y-2 relative">
                                <Label htmlFor="currentPassword" className="text-green-600">Current Password</Label>
                                <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} {...registerPassword('currentPassword')} className="bg-gray-50 text-black pr-10" required />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2"><Label htmlFor="newPassword" className="text-green-600">New Password</Label><Input id="newPassword" type="password" {...registerPassword('newPassword')} className="bg-gray-50 text-black" required /></div>
                                <div className="space-y-2"><Label className="text-green-600">Confirm New Password</Label><Input type="password" className="bg-gray-50 text-black" required /></div>
                            </div>
                             <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={passwordMutation.isPending}>
                                {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </form>
                    </div>
                    <Separator />
                    <div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-700">Two Factor Authentication (2FA)</h3>
                                <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                            </div>
                            <Switch className="data-[state=checked]:bg-gray-500" />
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="bg-blue-100 p-2 rounded-lg"><KeyRound className="h-6 w-6 text-blue-600" /></div><div><p className="font-medium text-gray-800">Authenticator App</p><p className="text-sm text-gray-500">Use an authenticator app like Google Authenticator</p></div></div><Button variant="outline">Set Up</Button></div>
                            <div className="flex justify-between items-center p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="bg-blue-100 p-2 rounded-lg"><Phone className="h-6 w-6 text-blue-600" /></div><div><p className="font-medium text-gray-800">SMS / Text Message</p><p className="text-sm text-gray-500">*******893</p></div></div><Button variant="outline">Manage</Button></div>
                            <div className="flex justify-between items-center p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="bg-blue-100 p-2 rounded-lg"><Mail className="h-6 w-6 text-blue-600" /></div><div><p className="font-medium text-gray-800">Email</p><p className="text-sm text-gray-500">s******@g***.com</p></div></div><Button variant="outline">Add Key</Button></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}