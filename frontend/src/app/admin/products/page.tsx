'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Eye, Loader2, Download, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getProducts = async () => (await api.get('/admin/products')).data;
const deleteProductApi = async (id: string) => await api.delete(`/admin/products/${id}`);
const updateStockApi = async (data: { id: string, variantId: string, stock: number }) => await api.patch('/admin/products/stock', data); // New Endpoint needed or reuse update

export default function ProductList() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ['adminProducts'], queryFn: getProducts });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert("Product deleted successfully");
    }
  });

  // --- ACTIONS ---
  const handleExportCSV = () => {
    if (selectedRows.length === 0) return alert("Select products to export");
    const selectedData = products.filter((p: any) => selectedRows.includes(p.id));
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Product ID,Name,Category,Price,Stock,Status\n"
        + selectedData.map((p: any) => {
            const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
            const minPrice = Math.min(...p.variants.map((v: any) => v.price));
            return `${p.id},${p.name},${p.category?.name},${minPrice},${totalStock},${p.status}`;
        }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDelete = (id: string) => {
    if(confirm("Are you sure?")) deleteMutation.mutate(id);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredProducts.map((p: any) => p.id) : []);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;

  return (
    <div className="space-y-6 font-sans">
      <AdminHeader title="Products" subtitle="Each product is a seed, plant it with care." />

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
                placeholder="Search by Product ID, Name, Category..." 
                className="pl-10 bg-white border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Link href="/admin/products/add">
            <Button className="bg-[#759C5D] hover:bg-[#5e8048] text-white gap-2 shadow-md shadow-green-100">
                <Plus size={18} /> Add Product
            </Button>
        </Link>
      </div>

      {selectedRows.length > 0 && (
        <div className="bg-[#DCE4D6] p-3 rounded-lg flex justify-between items-center text-[#4A643B] px-6 border border-[#C5D6BC]">
            <span className="font-semibold">{selectedRows.length} Products Selected</span>
            <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="bg-white border-none h-9 hover:bg-gray-50 text-gray-700">
                    <Download className="mr-2 h-4 w-4"/> Export(CSV)
                </Button>
                <Select>
                    <SelectTrigger className="h-9 bg-white border-none min-w-[130px]"><SelectValue placeholder="Bulk Action" /></SelectTrigger>
                    <SelectContent><SelectItem value="delete">Delete Selected</SelectItem></SelectContent>
                </Select>
            </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-[#759C5D]">
                <TableRow className="hover:bg-[#759C5D] border-b-0">
                    <TableHead className="w-12 text-white"><Checkbox className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#759C5D]" onCheckedChange={handleSelectAll} checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0}/></TableHead>
                    <TableHead className="text-white font-semibold">Product ID</TableHead>
                    <TableHead className="text-white font-semibold">Name</TableHead>
                    <TableHead className="text-white font-semibold">Category</TableHead>
                    <TableHead className="text-white font-semibold">Price</TableHead>
                    <TableHead className="text-white font-semibold text-center">Stock</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProducts.map((product: any) => {
                    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                    const priceRange = product.variants.length > 0 ? `৳${Math.min(...product.variants.map((v: any) => v.price))}` : 'N/A';

                    return (
                        <TableRow key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(product.id) ? 'bg-green-50' : ''}`}>
                            <TableCell><Checkbox checked={selectedRows.includes(product.id)} onCheckedChange={() => toggleRow(product.id)} /></TableCell>
                            <TableCell className="text-gray-500 text-xs">#{product.id.slice(0, 8)}</TableCell>
                            <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                            <TableCell className="text-gray-600">{product.category?.name}</TableCell>
                            <TableCell className="font-bold text-gray-900">{priceRange}</TableCell>
                            <TableCell className="text-center">
                                {/* STOCK CONTROLS (Visual Only until API update) */}
                                <div className="flex items-center justify-center gap-2">
                                    <button className="text-gray-400 hover:text-green-600"><Minus size={14}/></button>
                                    <span className={totalStock < 10 ? "text-red-500 font-bold min-w-[20px]" : "text-[#759C5D] font-bold min-w-[20px]"}>
                                        {totalStock}
                                    </span>
                                    <button className="text-gray-400 hover:text-green-600"><Plus size={14}/></button>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${product.status === 'published' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-gray-100 text-gray-600'}`}>
                                    {product.status === 'published' && <span className="text-[10px]">✔</span>}
                                    {product.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                    <Link href={`/products/${product.id}`} target="_blank">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#759C5D] hover:bg-green-50"><Eye size={18}/></Button>
                                    </Link>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-500 hover:bg-blue-50"><Edit size={18}/></Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(product.id)}><Trash2 size={18}/></Button>
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