'use client';

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger, SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity } = useCartStore(state => ({
    items: state.items,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
  }));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const constructImageUrl = (path: string) => {
    if (!path || path === '/placeholder.svg') return '/placeholder.svg';
    return `http://localhost:5005${path}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-white text-gray-800 flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-green-900">Your Shopping Cart</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border">
                      <Image src={constructImageUrl(item.image)} alt={item.name} layout="fill" objectFit="cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <p className="font-semibold text-green-900 leading-tight">{item.name}</p>
                      <p className="text-sm text-gray-600">৳{item.price}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500" onClick={() => removeItem(item.variantId)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <SheetFooter className="flex-col space-y-4 sm:space-y-4">
              <div className="flex justify-between font-bold text-lg text-green-900">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <SheetClose asChild>
                <Link href="/checkout" passHref>
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                        Proceed to Checkout
                    </Button>
                </Link>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-700">Your cart is empty.</p>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
            <SheetClose asChild>
                <Link href="/products" passHref>
                    <Button className="mt-6 bg-green-600 hover:bg-green-700">Start Shopping</Button>
                </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}