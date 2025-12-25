'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // Allows passing buttons like "Add Product"
}

export default function AdminHeader({ title, subtitle, children }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Right Actions Section */}
      <div className="flex items-center gap-4">
        {/* Any buttons passed from parent page (e.g. "Add Product") */}
        {children}

        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full">
          <Bell size={20} />
        </Button>

        {/* Profile Avatar */}
        <Avatar className="h-10 w-10 cursor-pointer border border-gray-200 hover:ring-2 hover:ring-green-100 transition-all">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-green-100 text-green-700 font-semibold">AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}