'use client';

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  // This state helps us avoid a flash of the login page on initial load
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication status on the client side
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsAuthChecked(true);
    }
  }, [isAuthenticated, router]);
  
  // Show a loading state while we verify auth on the client
  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="bg-[#FEFBF6]">
        <CheckoutForm />
    </div>
  );
}