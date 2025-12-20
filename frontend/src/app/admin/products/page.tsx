'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const getProducts = async () => (await api.get('/admin/products')).data; // You might need to update backend to have a dedicated /admin/products route without filters, or use the public one
const deleteProduct = async (id: string) => await api.delete(`/admin/products/${id}`);

export default function ProductList() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ['adminProducts'], queryFn: getProducts });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert("Product deleted successfully");
    }
  });

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(id);
    }
  }

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/add">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Plus size={20} /> Add Product
            </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
        <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search by Product Name..." className="pl-10 bg-gray-50" />
        </div>
        <div className="flex gap-2">
             <Button variant="outline" className="text-gray-600">Export(CSV)</Button>
             {/* Dropdown for Bulk Actions could go here */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
            <TableHeader className="bg-green-50">
                <TableRow>
                    <TableHead className="w-12"><Checkbox /></TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products?.map((product: any) => {
                    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                    const minPrice = Math.min(...product.variants.map((v: any) => v.price));
                    
                    return (
                        <TableRow key={product.id}>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-xs text-gray-400">{product.variants.length} Variants</span>
                                </div>
                            </TableCell>
                            <TableCell>{product.category?.name}</TableCell>
                            <TableCell>৳{minPrice}</TableCell>
                            <TableCell>
                                <span className={totalStock < 10 ? "text-red-500 font-bold" : "text-gray-700"}>
                                    {totalStock}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge className={product.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
                                    {product.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Link href={`/products/${product.id}`} target="_blank">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500"><Eye size={16} /></Button>
                                    </Link>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500"><Edit size={16} /></Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(product.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}