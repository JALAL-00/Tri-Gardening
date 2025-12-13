'use client';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Loader2, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

// API functions
const getAddresses = async () => (await api.get('/addresses')).data;
const createAddress = async (data: any) => (await api.post('/addresses', data)).data;
const updateAddress = async (data: {id: string, [key: string]: any}) => (await api.put(`/addresses/${data.id}`, data)).data;
const deleteAddress = async (id: string) => (await api.delete(`/addresses/${id}`)).data;

type AddressFormData = {
  thana: string;
  district: string;
  fullAddress: string;
};

export default function AddressManagement() {
    const queryClient = useQueryClient();
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const { data: addresses, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: getAddresses });
    
    const { register, handleSubmit, control, reset, setValue } = useForm<AddressFormData>();

    const createMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            reset({ thana: '', district: '', fullAddress: '' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            reset({ thana: '', district: '', fullAddress: '' });
            setEditingAddressId(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const onSubmit = (data: AddressFormData) => {
        if (editingAddressId) {
            updateMutation.mutate({ id: editingAddressId, ...data });
        } else {
            createMutation.mutate(data);
        }
    };
    
    const handleEditClick = (address: any) => {
        setEditingAddressId(address.id);
        setValue('thana', address.thana);
        setValue('district', address.district);
        setValue('fullAddress', address.fullAddress);
    };

    const handleAddNewClick = () => {
        setEditingAddressId(null);
        reset({ thana: '', district: '', fullAddress: '' });
    }

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side: Your Addresses */}
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Addresses</CardTitle>
                    <Button onClick={handleAddNewClick} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Address</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {addresses?.map((address: any, index: number) => (
                        <Card key={address.id} className={`p-4 ${address.isDefault ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-green-900">
                                        {address.isDefault ? "Shipping Address" : `Address ${index + 1}`}
                                    </p>
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>{address.thana}, {address.district}</p>
                                        <p>{address.fullAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {address.isDefault && <div className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">Default</div>}
                                    <Button variant="outline" size="sm" onClick={() => handleEditClick(address)}>
                                        <Edit className="mr-2 h-3 w-3" /> Edit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {addresses?.length === 0 && <p className="text-gray-500 text-center py-4">You have no saved addresses.</p>}
                </CardContent>
            </Card>

            {/* Right Side: Add/Edit Form */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>{editingAddressId ? 'Edit Address' : 'Add Address'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="thana">Thana *</Label>
                                <Controller
                                    name="thana"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="bg-gray-50 text-black"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bagerhat">Bagerhat</SelectItem>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="district">District *</Label>
                                <Controller
                                    name="district"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="bg-gray-50 text-black"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Khulna">Khulna</SelectItem>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullAddress">Full Address <span className="text-gray-500">(Optional)</span></Label>
                            <Textarea id="fullAddress" {...register('fullAddress')} className="bg-gray-50 text-black" />
                        </div>
                        <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingAddressId ? 'Update Address' : 'Add Address'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}