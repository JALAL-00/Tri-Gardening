'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProductForm from "@/components/admin/products/ProductForm";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from 'lucide-react';

const getProduct = async (id: string) => (await api.post('/products/find-one', { id })).data; // Reuse public find-one for simplicity, or create admin endpoint

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useQuery({ 
    queryKey: ['product', params.id], 
    queryFn: () => getProduct(params.id) 
  });

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;
  }

  return (
    <div className="space-y-6">
        <AdminHeader title="Edit Product" subtitle={`Product List > Edit > ${product?.name}`} />
        {/* Pass initialData to pre-fill the form */}
        <ProductForm initialData={product} /> 
    </div>
  );
}