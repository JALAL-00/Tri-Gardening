'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// API Functions
const getUsers = async () => (await api.get('/admin/users')).data;
const getProducts = async () => (await api.get('/admin/products')).data;
const createAdminOrder = async (data: any) => (await api.post('/admin/orders', data)).data;

export default function CreateOrderPage() {
  const router = useRouter();
  
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ['adminUsers'], queryFn: getUsers });
  const { data: products, isLoading: productsLoading } = useQuery({ queryKey: ['adminProducts'], queryFn: getProducts });

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const mutation = useMutation({
    mutationFn: createAdminOrder,
    onSuccess: () => {
        alert("Order created successfully!");
        router.push('/admin/orders');
    },
    onError: (error: any) => {
        alert(error.response?.data?.message || "Failed to create order. Ensure user has a saved address.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !selectedProductId) {
        alert("Please select both a customer and a product.");
        return;
    }

    // 1. Find the full product object to get its variants
    const product = products.find((p: any) => p.id === selectedProductId);
    
    if (!product || !product.variants || product.variants.length === 0) {
        alert("Selected product has no variants/stock available.");
        return;
    }

    // 2. Select the first variant ID (Simplification for this UI)
    const variantId = product.variants[0].id;

    // 3. Prepare Payload
    const payload = {
        userId: selectedUserId,
        items: [
            {
                variantId: variantId,
                quantity: Number(quantity)
            }
        ]
    };

    // 4. Send Request
    mutation.mutate(payload);
  };

  if (usersLoading || productsLoading) {
      return <div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Create New Order" subtitle="Manually create an order for a customer" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-gray-900 font-semibold">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Select Customer</Label>
                    <Select onValueChange={setSelectedUserId}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-1 focus:ring-[#759C5D]">
                            <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {users?.map((u: any) => (
                                <SelectItem key={u.id} value={u.id}>
                                    {u.fullName} ({u.phone})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                        * Note: The order will use the customer's default shipping address.
                    </p>
                </div>
            </CardContent>
        </Card>

        {/* Product Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-gray-900 font-semibold">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Select Product</Label>
                    <Select onValueChange={setSelectedProductId}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-1 focus:ring-[#759C5D]">
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products?.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Quantity</Label>
                    <Input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        className="bg-white border-gray-300 text-gray-900 focus:ring-1 focus:ring-[#759C5D]"
                    />
                </div>
            </CardContent>
        </Card>

        <div className="lg:col-span-2">
            <Button 
                type="submit" 
                className="w-full bg-[#759C5D] hover:bg-[#5e8048] text-white font-semibold shadow-md h-11 transition-colors"
                disabled={mutation.isPending}
            >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? "Creating Order..." : "Place Order"}
            </Button>
        </div>
      </form>
    </div>
  );
}