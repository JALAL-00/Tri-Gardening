'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Removed DialogHeader to customize fully
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import Image from "next/image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"; // Ensure accessibility

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const constructImageUrl = (path: string) => {
    if (!path || path === '/placeholder.svg') return '/placeholder.svg';
    return `http://localhost:5005${path}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#F8F9FC] p-0 overflow-hidden border-none shadow-2xl gap-0">
        
        {/* Hidden Title for Accessibility */}
        <VisuallyHidden.Root>
            <DialogTitle>Order Details #{order.orderId}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Custom Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-[#759C5D] font-bold text-sm">#{order.orderId}</p>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Recipient Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recipient Information</h3>
                <Edit2 size={16} className="text-[#759C5D] cursor-pointer hover:text-green-700" />
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Full Name</p>
                  <p className="font-semibold text-gray-800 text-base">{order.user?.fullName || order.shippingAddress?.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Phone Number</p>
                  <p className="font-semibold text-gray-800 text-base">{order.user?.phone || order.shippingAddress?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-800 text-base leading-relaxed">
                    {order.shippingAddress?.fullAddress} <br/>
                    {order.shippingAddress?.thana}, {order.shippingAddress?.district}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Financial Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Total Product Price :</span>
                  <span className="font-bold text-gray-900">৳ {order.subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Delivery Charge :</span>
                  <span className="font-bold text-gray-900">৳ {order.deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Discount :</span>
                  <span className="font-bold text-[#759C5D]">৳ {order.walletDiscount || 0}</span>
                </div>
                <Separator className="my-2 bg-gray-100" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total Payable :</span>
                  <span className="text-[#759C5D]">৳ {order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-900 text-sm">Payment Methods</span>
                <span className="bg-[#759C5D] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-md shadow-green-100">
                    Cash On Delivery
                </span>
            </div>
             <p className="text-center text-xs text-gray-400 mt-2">Order Placed On {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4 flex-1">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 bg-[#FEFBF6] p-4 rounded-xl border border-[#F0EFE9] transition-all hover:shadow-sm">
                  <div className="h-16 w-16 bg-white rounded-lg border overflow-hidden flex-shrink-0 relative">
                    <Image 
                      src={constructImageUrl(item.variant?.images?.[0])} 
                      alt="product" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm font-bold text-green-900 line-clamp-1">{item.titleAtPurchase}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <p className="text-sm font-bold text-[#D98829]">৳ {item.priceAtPurchase * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}