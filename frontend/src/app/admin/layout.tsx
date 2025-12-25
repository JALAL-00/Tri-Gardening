'use client';

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      try {
        const { data } = await api.get('/profile');
        if (data.role !== 'admin') {
          router.push('/'); 
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [isAuthenticated, router, logout]);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-white"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;
  if (!isAdmin) return null;

  return (
    // Force Light Theme for Admin
    <div className="flex min-h-screen bg-[#F8F9FC] text-slate-900">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}