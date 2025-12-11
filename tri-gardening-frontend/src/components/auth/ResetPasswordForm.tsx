'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";

const resetPasswordRequest = async (data: { email: string; otp: string; newPassword: string }) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      alert("Password has been reset successfully! Please log in.");
      router.push('/login');
    },
    onError: (error: any) => {
      console.error("Reset password failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, otp, newPassword });
  };

  return (
    <Card className="w-full max-w-md bg-green-950/40 backdrop-blur-xl border border-green-500/30 text-primary-foreground shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-white">
          Set New Password
        </CardTitle>
        <CardDescription className="text-green-200/90 px-4">
          Please enter the OTP sent to your email and your new password.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className="text-green-100">Email</Label>
            <Input id="email" type="email" value={email} readOnly className="bg-white/5 border-green-400/30 text-white" />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="otp" className="text-green-100">Verification Code (OTP)</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-white/10 border-green-400/50 text-white"
              required
              maxLength={6}
            />
          </div>
          <div className="space-y-2 text-left">
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/10 border-green-400/50 text-white pr-10"
                required
              />

              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-green-200 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {mutation.isError && (
             <p className="text-sm text-red-400 text-center">{mutation.error?.response?.data?.message || "Failed to reset password. Please check the OTP and try again."}</p>
          )}

          <Button type="submit" className="w-full bg-green-600 text-lg font-semibold text-white hover:bg-green-700 h-12" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        <div className="mt-8 text-center text-sm">
          <Link href="/login" passHref>
            <span className="font-semibold text-green-200 hover:text-white hover:underline">
              &larr; Back to login
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}