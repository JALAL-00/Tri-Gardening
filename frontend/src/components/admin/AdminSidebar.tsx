'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingCart, Package, FileText, Users, MessageSquare,
  BarChart3, Share2, Settings, LogOut, Globe, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Helper to check if a path is active (including sub-paths)
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col z-50 shadow-sm overflow-y-auto font-sans">
      
      {/* Spacer since we removed the Logo */}
      <div className="h-6"></div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        <Link href="/admin/dashboard">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/dashboard') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <LayoutDashboard size={22} /> Dashboard
          </Button>
        </Link>

        <Link href="/admin/orders">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/orders') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <ShoppingCart size={22} /> Orders
          </Button>
        </Link>

        <Link href="/admin/products">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/products') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <Package size={22} /> Products
          </Button>
        </Link>

        <Link href="/admin/blogs">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/blogs') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <FileText size={22} /> Blogs
          </Button>
        </Link>

        <Link href="/admin/customers">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/customers') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <Users size={22} /> Customers
          </Button>
        </Link>

        <Link href="/admin/reviews">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium rounded-lg transition-all", 
              isActive('/admin/reviews') 
                ? "bg-green-600 text-white hover:bg-green-700 hover:text-white shadow-md shadow-green-200" 
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <MessageSquare size={22} /> Reviews
          </Button>
        </Link>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="analytics" className="border-none">
            <AccordionTrigger className="py-3 px-4 hover:bg-green-50 hover:text-green-700 rounded-lg text-base font-medium text-gray-600 decoration-transparent">
              <span className="flex items-center gap-3"><BarChart3 size={22} /> Finance & Analytics</span>
            </AccordionTrigger>
            <AccordionContent className="pl-12 pb-2 pt-1 space-y-1">
               <Link href="/admin/finance">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors ${isActive('/admin/finance') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>
                   Overview
                 </div>
               </Link>
               <Link href="/admin/referrals">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors flex items-center gap-2 ${isActive('/admin/referrals') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>
                   Customer Referral
                 </div>
               </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cms" className="border-none">
            <AccordionTrigger className="py-3 px-4 hover:bg-green-50 hover:text-green-700 rounded-lg text-base font-medium text-gray-600 decoration-transparent">
              <span className="flex items-center gap-3"><Globe size={22} /> Website Customization</span>
            </AccordionTrigger>
            <AccordionContent className="pl-12 pb-2 pt-1 space-y-1">
               <Link href="/admin/settings/navbar">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors ${isActive('/admin/settings/navbar') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>Navbar Editor</div>
               </Link>
               <Link href="/admin/settings/homepage">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors ${isActive('/admin/settings/homepage') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>Homepage Editor</div>
               </Link>
               <Link href="/admin/settings/footer">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors ${isActive('/admin/settings/footer') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>Footer Editor</div>
               </Link>
               <Link href="/admin/settings/about">
                 <div className={`py-2 px-3 rounded-md text-sm transition-colors ${isActive('/admin/settings/about') ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}>About Us Editor</div>
               </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 mt-6 border-t border-gray-100">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg">
                <Settings size={22} /> Settings
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 h-12 text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg mt-1">
                <LogOut size={22} /> Logout
            </Button>
        </div>
      </nav>
    </aside>
  );
}