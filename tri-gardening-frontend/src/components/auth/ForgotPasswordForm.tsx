'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";


const forgotPasswordRequest = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      console.error("Forgot password request failed:", error);
      
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <Card className="w-full max-w-md bg-green-950/40 backdrop-blur-xl border border-green-500/30 text-primary-foreground shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-white">
          Forgotten Password?
        </CardTitle>
        <CardDescription className="text-green-200/90 px-4">
          No worries, we'll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {mutation.isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-green-100">An email with an OTP has been sent to <span className="font-bold">{email}</span>. Please check your inbox.</p>
            <Button onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)} className="w-full bg-green-600">
              Proceed to Reset
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-green-100">Phone Number / Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-green-400/50 text-white"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 text-lg font-semibold text-white hover:bg-green-700 h-12" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {mutation.isPending ? "Sending..." : "Continue"}
            </Button>
          </form>
        )}
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