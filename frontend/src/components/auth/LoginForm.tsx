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
import { Facebook, Chrome, Loader2, Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface LoginData { phone: string; password: string; }
const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Accept an optional title prop
export default function LoginForm({ title = "Login to your Account" }: { title?: string }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 1. Save Token to Store (LocalStorage)
      setToken(data.accessToken);

      // 2. Decode Token to get User Role
      // The JWT format is: header.payload.signature
      // We need to decode the payload (index 1)
      try {
        const payloadBase64 = data.accessToken.split('.')[1];
        const decodedJson = JSON.parse(atob(payloadBase64));
        const role = decodedJson.role;

        // 3. Redirect based on Role
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard'); // Redirect customers to their dashboard
        }
      } catch (error) {
        console.error("Failed to parse token role", error);
        // Fallback redirect if something goes wrong
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ phone, password });
  };

  return (
    <Card className="w-full max-w-md bg-green-950/40 backdrop-blur-xl border border-green-500/30 text-primary-foreground shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-white">
          {title} 
        </CardTitle>
        <CardDescription className="text-green-200/90">
          To see update on your orders
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2 text-left">
            <Label htmlFor="phone" className="text-green-100">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/10 border-green-400/50 text-white placeholder:text-green-300/70 focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>

          <div className="space-y-2 text-left relative">
            <Label htmlFor="password" className="text-green-100">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-green-400/50 text-white placeholder:text-green-300/70 focus:ring-green-400 focus:border-green-400 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-green-200 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-green-400 data-[state=checked]:bg-green-50 data-[state=checked]:border-green-50" />
              <Label htmlFor="remember" className="font-medium text-green-200/90">
                Remember Me
              </Label>
            </div>
            <Link href="/forgot-password" passHref>
              <span className="text-green-300 hover:text-white hover:underline">Forgot Password?</span>
            </Link>
          </div>

          {mutation.isError && (
             <p className="text-sm text-red-400 text-center">
               Login failed. Please check your credentials.
             </p>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 text-lg font-semibold text-white hover:bg-green-700 h-12 transition-all duration-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="bg-transparent border border-blue-500/50 text-white hover:bg-blue-500/20 hover:border-blue-500">
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </Button>
            <Button variant="outline" className="bg-transparent border border-white/50 text-white hover:bg-white/20 hover:border-white">
              <Chrome className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link href="/register" passHref>
            <span className="font-semibold text-green-200 hover:text-white hover:underline transition-colors">
              Don't have an account? Register
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
