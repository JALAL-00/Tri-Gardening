'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Chrome, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; // We'll need Textarea for the full address
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // And Select for dropdowns

import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

// --- Define the shape of the data for the register mutation ---
interface RegisterData {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  address: {
    thana: string;
    district: string;
    fullAddress: string;
  };
}

const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export default function RegisterForm() {
  // --- State for all form fields ---
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [thana, setThana] = useState("");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // On successful registration, save the token and redirect to the profile
      setToken(data.accessToken);
      router.push('/profile');
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
      // You can add more specific error handling here based on the error response
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thana || !district) {
      // Simple validation for dropdowns
      alert("Please select a Thana and District.");
      return;
    }
    mutation.mutate({
      fullName,
      phone,
      email,
      password,
      address: {
        thana,
        district,
        fullAddress,
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl bg-green-950/40 backdrop-blur-xl border border-green-500/30 text-primary-foreground shadow-2xl my-16">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-white">
          Register to your Account
        </CardTitle>
        <CardDescription className="text-green-200/90">
          To see update on your orders
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="fullName" className="text-green-100">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required className="bg-white/10 border-green-400/50" />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="phone" className="text-green-100">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Enter your phone number" required className="bg-white/10 border-green-400/50" />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="thana" className="text-green-100">Thana</Label>
              <Select onValueChange={setThana} required>
                <SelectTrigger className="bg-white/10 border-green-400/50"><SelectValue placeholder="Select Thana" /></SelectTrigger>
                <SelectContent className="bg-green-900 text-white border-green-700">
                  <SelectItem value="Mirpur">Mirpur</SelectItem>
                  <SelectItem value="Gulshan">Gulshan</SelectItem>
                  <SelectItem value="Savar">Savar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="district" className="text-green-100">District</Label>
              <Select onValueChange={setDistrict} required>
                <SelectTrigger className="bg-white/10 border-green-400/50"><SelectValue placeholder="Select District" /></SelectTrigger>
                <SelectContent className="bg-green-900 text-white border-green-700">
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chittagong">Chittagong</SelectItem>
                  <SelectItem value="Khulna">Khulna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2 text-left">
              <Label htmlFor="fullAddress" className="text-green-100">Full Address <span className="text-green-300/70">(Optional)</span></Label>
              <Textarea id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="House, Road, Area..." className="bg-white/10 border-green-400/50" />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-green-100">Email Address <span className="text-green-300/70">(Optional)</span></Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="bg-white/10 border-green-400/50" />
            </div>
            <div className="space-y-2 text-left">
                {/* Placeholder for Secondary Number from Figma if needed */}
            </div>
            <div className="md:col-span-2 space-y-2 text-left">
              <Label htmlFor="password" className="text-green-100">Password</Label>
              <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password (min. 8 characters)" required className="bg-white/10 border-green-400/50" />
            </div>
          </div>
          
          {mutation.isError && (
             <p className="text-sm text-red-400 text-center">{mutation.error?.response?.data?.message || "Registration failed. Please try again."}</p>
          )}

          <Button type="submit" className="w-full bg-green-600 text-lg font-semibold text-white hover:bg-green-700 h-12 transition-all duration-300" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" passHref>
            <span className="font-semibold text-green-200 hover:text-white hover:underline transition-colors">
              Already have an account? Login
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}