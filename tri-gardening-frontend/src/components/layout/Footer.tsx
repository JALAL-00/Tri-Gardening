import Link from "next/link";
import { SunIcon } from '@radix-ui/react-icons'; 
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/shipping", label: "Shippings" },
    { href: "/referral-program", label: "Referral Program" },
  ];

  const categories = [
    { href: "/products?category=plants", label: "Plants" },
    { href: "/products?category=tools", label: "Tools" },
    { href: "/products?category=fertilizers", label: "Fertilizers" },
    { href: "/products?category=pesticides", label: "Pesticides" },
  ];

  return (
    <footer className="bg-green-950 text-green-200">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-4 md:px-6">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <SunIcon className="h-8 w-8 text-green-400" />
            <span>TriGardening</span>
          </Link>
          <p className="text-base">Your Slogan goes here</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Categories</h3>
          <ul className="space-y-2">
            {categories.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Connect With Us</h3>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-white"><Facebook /></Link>
            <Link href="#" className="hover:text-white"><Instagram /></Link>
            <Link href="#" className="hover:text-white"><Twitter /></Link>
            <Link href="#" className="hover:text-white"><Youtube /></Link>
          </div>
          <p className="mt-4">supprot@trigardening.com</p>
          <h3 className="mt-6 text-lg font-semibold text-white">Call Now</h3>
          <p>+8801234567890</p>
        </div>
      </div>
      <div className="border-t border-green-800/50">
        <div className="container mx-auto flex items-center justify-center py-6 px-4 md:px-6">
          <p className="text-sm">&copy; 2025 TriGardening. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}