'use client';

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {

      await new Promise(resolve => setTimeout(resolve, 100));
      const currentToken = useAuthStore.getState().token;

      if (!currentToken) {
        router.push('/login');
        return;
      }

      try {
        const { data } = await api.get('/profile');
        if (data.role !== 'admin') {
          router.push('/'); 
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        logout();
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []); 

  if (isChecking) {
    return <div className="h-screen w-screen flex items-center justify-center bg-white"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;
  }
  
  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] text-slate-900 font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}