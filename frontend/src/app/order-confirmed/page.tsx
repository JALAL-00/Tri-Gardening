'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, notFound } from "next/navigation";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

// API function to fetch a single order by its public ID
const getOrderById = async (orderId: string) => {
    // This is an inefficient workaround. A dedicated backend endpoint is better.
    const { data: allOrders } = await api.get('/orders');
    const order = allOrders.find((o: any) => o.orderId === orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
};

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { data: order, isLoading, isError } = useQuery({
        queryKey: ['confirmedOrder', orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });
    
    const constructImageUrl = (path: string) => {
        if (!path || path === '/placeholder.svg') return '/placeholder.svg';
        return `http://localhost:5005${path}`;
    };

    if (!orderId) {
        return notFound();
    }

    return (
        <div className="bg-[#FEFBF6] min-h-[80vh] py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <CheckoutStepper currentStep={2} />

                {isLoading ? (
                    <div className="flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600" /></div>
                ) : isError || !order ? (
                    <div className="text-center text-red-500">Could not load order details.</div>
                ) : (
                    <>
                        <Card className="bg-white p-8 shadow-lg text-center">
                            <h1 className="text-2xl font-bold text-green-900">Thank you for purchasing from TriGardening</h1>
                            <p className="text-gray-600 mt-2">Your order has been placed successfully</p>
                            
                            {/* --- ORDER DETAILS CARD with STYLING FIX --- */}
                            <Card className="mt-6 text-left bg-green-800 text-white border-gray-700">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                        <h2 className="text-lg font-semibold text-white">Order #{order.orderId}</h2>
                                        <div className="text-sm text-white mt-2 sm:mt-0 sm:text-right">
                                            <p>Delivery Method: <span className="font-medium text-gray-200">Cash on Delivery</span></p>
                                            <p>Estimated Date: <span className="font-medium text-gray-200">25 - 30 Sep 2025</span></p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <Image src={constructImageUrl(item.variant?.images[0] || '/placeholder.svg')} alt={item.titleAtPurchase} width={64} height={64} className="rounded-md border border-gray-600"/>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-white">{item.titleAtPurchase}</p>
                                                    <p className="text-sm text-">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-white">৳{(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Separator className="my-4 bg-gray-700"/>

                                    <div className="space-y-2 text-white">
                                        <div className="flex justify-between"><span>Sub Total</span><span>৳{parseFloat(order.subTotal).toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Delivery Charge</span><span>৳{parseFloat(order.deliveryCharge).toFixed(2)}</span></div>
                                        <div className="flex justify-between font-bold text-lg text-white"><span>Total</span><span>৳{parseFloat(order.totalAmount).toFixed(2)}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Link href="/orders" passHref>
                                <Button variant="link" className="mt-6 text-green-700 hover:text-green-800 font-semibold">
                                    <ArrowLeft className="mr-2 h-4 w-4"/>
                                    Return to My Orders List
                                </Button>
                            </Link>
                        </Card>

                        {/* --- USER INFORMATION CARD with STYLING --- */}
                        <Card className="bg-green-900 text-white p-8 mt-8 shadow-lg text-left">
                            <h2 className="text-2xl font-bold mb-4">Your Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-sm text-green-200">Full Name</p>
                                    <p className="font-semibold text-lg">{order.shippingAddress.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-green-200">Phone Number</p>
                                    <p className="font-semibold text-lg">{order.shippingAddress.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-green-200">Delivery Address</p>
                                    <p className="font-semibold text-lg">{order.shippingAddress.fullAddress}, {order.shippingAddress.thana}, {order.shippingAddress.district}</p>
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}

export default function OrderConfirmedPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>}>
            <ConfirmationContent />
        </Suspense>
    );
}