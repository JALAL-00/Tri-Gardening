'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingCart, Package, FileText, Users, MessageSquare,
  BarChart3, Share2, Settings, LogOut, Globe
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

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col z-50 overflow-y-auto">
      <div className="p-6 border-b">
        <Link href="/admin/dashboard" className="text-2xl font-bold text-green-700 flex items-center gap-2">
          TriGardening
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link href="/admin/dashboard">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/dashboard') && "bg-green-600 text-white hover:bg-green-700 hover:text-white")}>
            <LayoutDashboard size={20} /> Dashboard
          </Button>
        </Link>

        <Link href="/admin/orders">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/orders') && "bg-green-50 text-green-700")}>
            <ShoppingCart size={20} /> Orders
          </Button>
        </Link>

        <Link href="/admin/products">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/products') && "bg-green-50 text-green-700")}>
            <Package size={20} /> Products
          </Button>
        </Link>

        <Link href="/admin/blogs">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/blogs') && "bg-green-50 text-green-700")}>
            <FileText size={20} /> Blogs
          </Button>
        </Link>

        <Link href="/admin/customers">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/customers') && "bg-green-50 text-green-700")}>
            <Users size={20} /> Customers
          </Button>
        </Link>

        <Link href="/admin/reviews">
          <Button variant="ghost" className={cn("w-full justify-start gap-3 mb-1", isActive('/admin/reviews') && "bg-green-50 text-green-700")}>
            <MessageSquare size={20} /> Reviews
          </Button>
        </Link>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="analytics" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm font-medium">
              <span className="flex items-center gap-3"><BarChart3 size={20} /> Finance & Analytics</span>
            </AccordionTrigger>
            <AccordionContent className="pl-12 pb-2">
               <Link href="/admin/finance" className="block py-2 hover:text-green-600">Overview</Link>
               <Link href="/admin/referrals" className="block py-2 hover:text-green-600 flex items-center gap-2"><Share2 size={16}/> Customer Referral</Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cms" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-gray-100 rounded-md text-sm font-medium">
              <span className="flex items-center gap-3"><Globe size={20} /> Website Customization</span>
            </AccordionTrigger>
            <AccordionContent className="pl-12 pb-2 space-y-1">
               <Link href="/admin/settings/navbar" className="block py-2 hover:text-green-600">Navbar Editor</Link>
               <Link href="/admin/settings/homepage" className="block py-2 hover:text-green-600">Homepage Editor</Link>
               <Link href="/admin/settings/footer" className="block py-2 hover:text-green-600">Footer Editor</Link>
               <Link href="/admin/settings/about" className="block py-2 hover:text-green-600">About Us Editor</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 mt-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500">
                <Settings size={20} /> Settings
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut size={20} /> Logout
            </Button>
        </div>
      </nav>
    </aside>
  );
}