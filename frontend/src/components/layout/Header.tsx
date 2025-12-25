'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { SunIcon } from '@radix-ui/react-icons';
import CartSheet from '@/components/cart/CartSheet';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  
  const totalItems = useCartStore(state => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/plant-clinic', label: 'Plant Clinic' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-800/50 bg-green-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <SunIcon className="h-8 w-8 text-green-400" />
          <span>TriGardening</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-green-100 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search, Actions, and Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-300" />
            <Input
              type="search"
              placeholder="Search plants, tools..."
              className="w-full rounded-full bg-green-900/50 pl-10 text-white border-green-700 focus:ring-green-500 md:w-[200px] lg:w-[300px]"
            />
          </div>
          
          <Button className="hidden lg:flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Phone className="h-5 w-5" />
            <span className="font-semibold">Call Now</span>
          </Button>

          <div className="flex items-center gap-2">
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative text-green-100 hover:bg-green-800/50 hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                {isClient && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
            </CartSheet>

            {isClient && (
              <Link href={isAuthenticated ? "/profile" : "/login"} passHref>
                <Button variant="ghost" size="icon" className="text-green-100 hover:bg-green-800/50 hover:text-white">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden text-green-100 hover:bg-green-800/50 hover:text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}