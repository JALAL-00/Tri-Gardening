'use client';

import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // Decode token to see if admin
      try {
        const payloadBase64 = token?.split('.')[1];
        if (payloadBase64) {
            const decodedJson = JSON.parse(atob(payloadBase64));
            if (decodedJson.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } else {
            setChecking(false);
        }
      } catch (e) {
        setChecking(false);
      }
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, token, router]);

  if (checking) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-white"/></div>;

  return <LoginForm />;
}