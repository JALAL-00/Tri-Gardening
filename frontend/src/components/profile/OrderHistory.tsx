'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "use-debounce";

// API function now accepts a search term
const getMyOrders = async (searchTerm: string) => {
    const params = new URLSearchParams();
    if (searchTerm) {
        params.append('search', searchTerm);
    }
    const { data } = await api.get(`/orders?${params.toString()}`);
    return data;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'processing': return 'bg-yellow-100 text-yellow-800';
        case 'shipped': return 'bg-blue-100 text-blue-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function OrderHistory() {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data: orders, isLoading } = useQuery({ 
        queryKey: ['myOrders', debouncedSearchTerm], 
        queryFn: () => getMyOrders(debouncedSearchTerm) 
    });

    useEffect(() => {
        if (orders && orders.length > 0) {
            const isSelectedOrderInList = orders.some((order: any) => order.id === selectedOrder?.id);
            if (!isSelectedOrderInList) {
                setSelectedOrder(orders[0]);
            }
        } else if (!isLoading) {
            setSelectedOrder(null);
        }
    }, [orders, isLoading, selectedOrder]);

    const constructImageUrl = (path: string) => {
        if (!path || path === '/placeholder.svg') return '/placeholder.svg';
        return `http://localhost:5005${path}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search by Order ID or Product Name..." 
                        className="pl-10 bg-gray-50 text-black border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="text-gray-600">Order ID</TableHead>
                                    <TableHead className="text-gray-600">Date</TableHead>
                                    <TableHead className="text-gray-600">Price</TableHead>
                                    <TableHead className="text-gray-600">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders && orders.length > 0 ? orders.map((order: any) => (
                                    <TableRow 
                                        key={order.id} 
                                        className={`cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <TableCell className="font-medium text-gray-700">{order.orderId}</TableCell>
                                        <TableCell className="text-gray-500">{formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="text-gray-700">৳{parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusClass(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <h3 className="font-semibold text-gray-500 mb-4">Order Details</h3>
                {selectedOrder ? (
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-green-900">{selectedOrder.orderId}</h4>
                        <div className="space-y-4">
                            {selectedOrder.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Image src={constructImageUrl(item.variant?.images[0] || '/placeholder.svg')} alt={item.titleAtPurchase} width={64} height={64} className="rounded-md border"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800">{item.titleAtPurchase}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-800">৳{(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4"/>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between"><span>Sub Total</span><span>৳{parseFloat(selectedOrder.subTotal).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Delivery Charge</span><span>৳{parseFloat(selectedOrder.deliveryCharge).toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg text-green-900"><span>Total</span><span>৳{parseFloat(selectedOrder.totalAmount).toFixed(2)}</span></div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Select an order to see details.</p>
                )}
            </div>
        </div>
    );
}