'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface RegisterData {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  referralCode?: string; // Added referral code
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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [thana, setThana] = useState("");
  const [district, setDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // State for Referral Code
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setToken(data.accessToken);
      // Redirect to profile or home after successful registration
      router.push('/profile');
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thana || !district) {
      alert("Please select a Thana and District.");
      return;
    }
    mutation.mutate({
      fullName,
      phone,
      email,
      password,
      referralCode: referralCode.trim() || undefined, // Send only if not empty
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
            
            {/* FULL NAME */}
            <div className="space-y-2 text-left">
              <Label htmlFor="fullName" className="text-green-100">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="bg-white/10 border-green-400/50 text-white"
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="space-y-2 text-left">
              <Label htmlFor="phone" className="text-green-100">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Enter your phone number"
                required
                className="bg-white/10 border-green-400/50 text-white"
              />
            </div>

            {/* THANA */}
            <div className="space-y-2 text-left">
              <Label htmlFor="thana" className="text-green-100">Thana</Label>
              <Select onValueChange={setThana} required>
                <SelectTrigger className="bg-white/10 border-green-400/50 text-white">
                  <SelectValue placeholder="Select Thana" />
                </SelectTrigger>
                <SelectContent className="bg-green-900 text-white border-green-700">
                  <SelectItem value="Adabor">Adabor</SelectItem>
                  <SelectItem value="Badda">Badda</SelectItem>
                  <SelectItem value="Bangshal">Bangshal</SelectItem>
                  <SelectItem value="Bimanbandar">Bimanbandar</SelectItem>
                  <SelectItem value="Cantonment">Cantonment</SelectItem>
                  <SelectItem value="Chak Bazar">Chak Bazar</SelectItem>
                  <SelectItem value="Dakkhin Khan">Dakkhin Khan</SelectItem>
                  <SelectItem value="Darus Salam">Darus Salam</SelectItem>
                  <SelectItem value="Demra">Demra</SelectItem>
                  <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                  <SelectItem value="Gendaria">Gendaria</SelectItem>
                  <SelectItem value="Gulshan">Gulshan</SelectItem>
                  <SelectItem value="Hazaribagh">Hazaribagh</SelectItem>
                  <SelectItem value="Jatrabari">Jatrabari</SelectItem>
                  <SelectItem value="Kadamtali">Kadamtali</SelectItem>
                  <SelectItem value="Kafrul">Kafrul</SelectItem>
                  <SelectItem value="Kalabagan">Kalabagan</SelectItem>
                  <SelectItem value="Kamrangirchar">Kamrangirchar</SelectItem>
                  <SelectItem value="Khilgaon">Khilgaon</SelectItem>
                  <SelectItem value="Khilkhet">Khilkhet</SelectItem>
                  <SelectItem value="Kotwali">Kotwali</SelectItem>
                  <SelectItem value="Lalbagh">Lalbagh</SelectItem>
                  <SelectItem value="Mirpur">Mirpur</SelectItem>
                  <SelectItem value="Mohammadpur">Mohammadpur</SelectItem>
                  <SelectItem value="Motijheel">Motijheel</SelectItem>
                  <SelectItem value="Mugda">Mugda</SelectItem>
                  <SelectItem value="New Market">New Market</SelectItem>
                  <SelectItem value="Pallabi">Pallabi</SelectItem>
                  <SelectItem value="Paltan">Paltan</SelectItem>
                  <SelectItem value="Ramna">Ramna</SelectItem>
                  <SelectItem value="Rampura">Rampura</SelectItem>
                  <SelectItem value="Sabujbagh">Sabujbagh</SelectItem>
                  <SelectItem value="Shah Ali">Shah Ali</SelectItem>
                  <SelectItem value="Shahbagh">Shahbagh</SelectItem>
                  <SelectItem value="Sher-e-Bangla Nagar">Sher-e-Bangla Nagar</SelectItem>
                  <SelectItem value="Shyampur">Shyampur</SelectItem>
                  <SelectItem value="Sutrapur">Sutrapur</SelectItem>
                  <SelectItem value="Tejgaon">Tejgaon</SelectItem>
                  <SelectItem value="Tejgaon Industrial Area">Tejgaon Industrial Area</SelectItem>
                  <SelectItem value="Turag">Turag</SelectItem>
                  <SelectItem value="Uttar Khan">Uttar Khan</SelectItem>
                  <SelectItem value="Uttara East">Uttara East</SelectItem>
                  <SelectItem value="Uttara West">Uttara West</SelectItem>
                  <SelectItem value="Vatara">Vatara</SelectItem>
                  <SelectItem value="Wari">Wari</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* DISTRICT */}
            <div className="space-y-2 text-left">
              <Label htmlFor="district" className="text-green-100">District</Label>
              <Select onValueChange={setDistrict} required>
                <SelectTrigger className="bg-white/10 border-green-400/50 text-white">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent className="bg-green-900 text-white border-green-700">
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chattogram">Chattogram</SelectItem>
                  <SelectItem value="Gazipur">Gazipur</SelectItem>
                  <SelectItem value="Narayanganj">Narayanganj</SelectItem>
                  <SelectItem value="Cumilla">Cumilla</SelectItem>
                  <SelectItem value="Narsingdi">Narsingdi</SelectItem>
                  <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                  <SelectItem value="Sylhet">Sylhet</SelectItem>
                  <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                  <SelectItem value="Bogura">Bogura</SelectItem>
                  <SelectItem value="Rangpur">Rangpur</SelectItem>
                  <SelectItem value="Dinajpur">Dinajpur</SelectItem>
                  <SelectItem value="Khulna">Khulna</SelectItem>
                  <SelectItem value="Jessore">Jessore</SelectItem>
                  <SelectItem value="Barishal">Barishal</SelectItem>
                  <SelectItem value="Patuakhali">Patuakhali</SelectItem>
                  <SelectItem value="Noakhali">Noakhali</SelectItem>
                  <SelectItem value="Feni">Feni</SelectItem>
                  <SelectItem value="Cox's Bazar">Cox's Bazar</SelectItem>
                  <SelectItem value="Brahmanbaria">Brahmanbaria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FULL ADDRESS */}
            <div className="md:col-span-2 space-y-2 text-left">
              <Label htmlFor="fullAddress" className="text-green-100">
                Full Address <span className="text-green-300/70">(Optional)</span>
              </Label>
              <Textarea
                id="fullAddress"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House, Road, Area..."
                className="bg-white/10 border-green-400/50 text-white"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-green-100">
                Email Address <span className="text-green-300/70">(Optional)</span>
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-green-400/50 text-white pr-12"
              />
            </div>

            {/* REFERRAL CODE (NEW) */}
            <div className="space-y-2 text-left">
              <Label htmlFor="referralCode" className="text-green-100">
                Referral Code <span className="text-green-300/70">(Optional)</span>
              </Label>
              <Input
                id="referralCode"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                type="text"
                placeholder="Ex: GARDEN-A1B2"
                className="bg-white/10 border-green-400/50 text-white uppercase placeholder:normal-case"
              />
            </div>

            {/* PASSWORD + EYE ICON */}
            <div className="md:col-span-2 space-y-2 text-left">
              <Label htmlFor="password" className="text-green-100">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password (min. 8 characters)"
                  required
                  className="bg-white/10 border-green-400/50 text-white pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-200 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {mutation.isError && (
            <p className="text-sm text-red-400 text-center">
              {mutation.error?.response?.data?.message || "Registration failed. Please try again."}
            </p>
          )}

          {/* SUBMIT */}
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
