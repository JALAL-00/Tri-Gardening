'use client';

import { useCartStore } from "@/store/cartStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Wallet } from "lucide-react"; // Added Wallet icon
import CheckoutStepper from "./CheckoutStepper";

// API functions
const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
}
const getAddresses = async () => {
    const response = await api.get('/addresses');
    return response.data;
}
const getProfile = async () => {
    const { data } = await api.get('/profile');
    return data;
};

export default function CheckoutForm() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    
    // State flag to control redirect logic
    const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);
    const [useWallet, setUseWallet] = useState(false); // State for Wallet Usage
    
    const { data: userProfile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    
    const { data: savedAddresses, isLoading: isLoadingAddresses } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: getAddresses,
    });
    
    useEffect(() => {
        if (savedAddresses && savedAddresses.length > 0) {
            const defaultAddress = savedAddresses.find((addr: any) => addr.isDefault);
            setSelectedAddress(defaultAddress || savedAddresses[0]);
        } else if (savedAddresses) {
            setShowNewAddressForm(true);
        }
    }, [savedAddresses]);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [thana, setThana] = useState("");
    const [district, setDistrict] = useState("");
    const [fullAddress, setFullAddress] = useState("");

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.fullName || "");
            setPhone(userProfile.phone || "");
        }
    }, [userProfile]);

    // --- Calculations ---
    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.price as any) * item.quantity, 0);
    const deliveryCharge = 100;
    const grossTotal = subtotal + deliveryCharge;

    const walletBalance = parseFloat(userProfile?.walletBalance || '0');
    
    // Calculate Discount based on toggle
    const walletDiscount = useWallet ? Math.min(grossTotal, walletBalance) : 0;
    const payableAmount = grossTotal - walletDiscount;
    
    const mutation = useMutation({
        mutationFn: createOrder,
        onSuccess: (data) => {
            setIsOrderSuccessful(true);
            clearCart();
            router.push(`/order-confirmed?orderId=${data.orderId}`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to place order. Please try again.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let shippingAddress;
        if (selectedAddress && !showNewAddressForm) {
            shippingAddress = {
                fullName: userProfile?.fullName || "N/A",
                phone: userProfile?.phone || "N/A",
                thana: selectedAddress.thana,
                district: selectedAddress.district,
                fullAddress: selectedAddress.fullAddress,
            };
        } else {
            shippingAddress = { fullName, phone, thana, district, fullAddress };
        }
        
        const orderData = {
            items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
            shippingAddress,
            deliveryCharge,
            useWallet, // Send flag to backend
        };
        
        mutation.mutate(orderData);
    };

    const constructImageUrl = (path: string) => {
        if (!path || path === '/placeholder.svg') return '/placeholder.svg';
        return `http://localhost:5005${path}`;
    };

    // Redirect logic
    useEffect(() => {
        if (typeof window !== 'undefined' && items.length === 0 && !isOrderSuccessful) {
            router.push('/products');
        }
    }, [items, isOrderSuccessful, router]);
    
    if (items.length === 0 && !isOrderSuccessful) {
        return (
            <div className="container mx-auto py-24 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
                <h1 className="mt-4 text-2xl text-gray-700">Your cart is empty. Redirecting...</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 text-green-900">
            <CheckoutStepper currentStep={1} />
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Shipping Details Section */}
                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-bold mb-4">Review & Checkout</h2>
                    
                    {isLoadingAddresses ? <Loader2 className="animate-spin text-green-600" /> :
                        savedAddresses && savedAddresses.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-800">Select Shipping Address</h3>
                            {savedAddresses.map((address: any) => (
                                <Card 
                                  key={address.id} 
                                  className={`p-4 cursor-pointer transition-all bg-white text-gray-800 ${selectedAddress?.id === address.id && !showNewAddressForm ? 'border-2 border-green-600 shadow-lg' : 'border border-gray-200'}`} 
                                  onClick={() => { setSelectedAddress(address); setShowNewAddressForm(false); }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{address.thana}, {address.district}</p>
                                            <p className="text-sm text-gray-600">{address.fullAddress}</p>
                                        </div>
                                        {selectedAddress?.id === address.id && !showNewAddressForm && (
                                            <div className="text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full">
                                                SELECTED
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    
                    <Button type="button" variant="link" className="p-0 h-auto text-green-600 font-semibold" onClick={() => { setShowNewAddressForm(!showNewAddressForm); setSelectedAddress(null); }}>
                        {showNewAddressForm ? '← Cancel and use a saved address' : '+ Add a new address'}
                    </Button>

                    {showNewAddressForm && (
                        <Card className="bg-white mt-4 border-2 border-green-600">
                            <CardHeader><CardTitle>New Shipping Address</CardTitle></CardHeader>
                            <CardContent className="space-y-4 text-gray-800">
                               <div className="space-y-2"> <Label htmlFor="fullName">Full Name</Label> <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="bg-gray-50"/> </div>
                                <div className="space-y-2"> <Label htmlFor="phone">Phone Number</Label> <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="bg-gray-50"/> </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"> <Label htmlFor="thana">Thana</Label> <Input id="thana" value={thana} onChange={e => setThana(e.target.value)} required className="bg-gray-50"/> </div>
                                    <div className="space-y-2"> <Label htmlFor="district">District</Label> <Input id="district" value={district} onChange={e => setDistrict(e.target.value)} required className="bg-gray-50"/> </div>
                                </div>
                                <div className="space-y-2"> <Label htmlFor="fullAddress">Full Address</Label> <Textarea id="fullAddress" value={fullAddress} onChange={e => setFullAddress(e.target.value)} required className="bg-gray-50"/> </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                
                {/* Order Summary Section */}
                <div className="lg:col-span-2">
                    <Card className="bg-white self-start sticky top-24 shadow-lg">
                        <CardHeader><CardTitle className="text-green-900">Order Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 -mr-2">
                               {items.map(item => (
                                   <div key={item.variantId} className="flex justify-between items-center text-sm">
                                       <div className="flex items-center gap-4">
                                           <Image src={constructImageUrl(item.image)} alt={item.name} width={50} height={50} className="rounded-md border" />
                                           <div>
                                               <p className="font-semibold text-gray-900">{item.name}</p>
                                               <p className="text-gray-500">Qty: {item.quantity}</p>
                                           </div>
                                       </div>
                                       <p className="font-semibold text-gray-900">৳{(parseFloat(item.price as any) * item.quantity).toFixed(2)}</p>
                                   </div>
                               ))}
                            </div>
                            
                            <Separator />
                            
                            {/* Wallet Usage Section */}
                            {walletBalance > 0 && (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="useWallet" 
                                            checked={useWallet}
                                            onCheckedChange={(checked) => setUseWallet(checked as boolean)}
                                            className="border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                                        />
                                        <Label 
                                            htmlFor="useWallet" 
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 text-green-900"
                                        >
                                            <Wallet className="h-4 w-4" />
                                            Use Wallet Balance (৳{walletBalance.toFixed(2)})
                                        </Label>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">৳{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Delivery Charge</span><span className="font-medium">৳{deliveryCharge.toFixed(2)}</span></div>
                                
                                {useWallet && walletDiscount > 0 && (
                                    <div className="flex justify-between text-green-700">
                                        <span>Wallet Discount</span>
                                        <span className="font-medium">- ৳{walletDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between font-bold text-lg text-green-900">
                                <span>Payable Total</span>
                                <span>৳{payableAmount.toFixed(2)}</span>
                            </div>
                            
                            <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 mt-4 text-base font-bold" disabled={mutation.isPending || (!selectedAddress && !showNewAddressForm)}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mutation.isPending ? 'Placing Order...' : 'Proceed to Checkout'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}