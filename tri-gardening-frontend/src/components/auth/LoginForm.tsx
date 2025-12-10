'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Chrome, Loader2 } from "lucide-react";

import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// Define the shape of the data for our mutation
interface LoginData {
  phone: string;
  password: string;
}

// The async function that performs the API call
const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // On success, save the token and redirect
      console.log("Login successful:", data);
      setToken(data.accessToken);
      router.push('/profile'); // Redirect to user profile dashboard
    },
    onError: (error) => {
      // Handle errors (e.g., show a toast notification)
      console.error("Login failed:", error);
      // For now, we'll just log it. In a real app, you'd show a user-friendly error.
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ phone, password });
  };

  return (
    <Card className="w-full max-w-md bg-green-900/50 backdrop-blur-sm border-green-700 text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login to your Account</CardTitle>
        <CardDescription className="text-green-200">
          To see updates on your orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-green-800/60 border-green-600 focus:ring-green-500" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-green-800/60 border-green-600 focus:ring-green-500" required />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-green-400" />
              <Label htmlFor="remember" className="text-sm font-medium text-green-200">Remember Me</Label>
            </div>
            <Link href="/forgot-password" passHref><span className="text-sm text-green-300 hover:underline">Forgot Password?</span></Link>
          </div>
          {mutation.isError && (
             <p className="text-sm text-red-400">Login failed. Please check your credentials.</p>
          )}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-green-700"></div>
          <span className="mx-4 text-xs text-green-300">Or, Sign up with</span>
          <div className="flex-grow border-t border-green-700"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="bg-transparent border-blue-500 text-blue-300 hover:bg-blue-500/20 hover:text-white"><Facebook className="mr-2 h-4 w-4" /> Facebook</Button>
          <Button variant="outline" className="bg-transparent border-red-500 text-red-300 hover:bg-red-500/20 hover:text-white"><Chrome className="mr-2 h-4 w-4" /> Google</Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-green-300">Don't have an account? </span>
          <Link href="/register" passHref><span className="font-semibold text-green-100 hover:underline">Register</span></Link>
        </div>
      </CardContent>
    </Card>
  );
}