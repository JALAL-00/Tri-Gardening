'use client';

import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Eye, Loader2, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// API Call
const getProducts = async () => (await api.get('/admin/products')).data;
const deleteProductApi = async (id: string) => await api.delete(`/admin/products/${id}`);

export default function ProductList() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ['adminProducts'], queryFn: getProducts });
  
  // State for filtering and selection
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      alert("Product deleted successfully");
      setSelectedRows([]);
    }
  });

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this product?")) {
        deleteMutation.mutate(id);
    }
  };

  // --- 1. FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product: any) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // --- SELECTION LOGIC ---
  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
        setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedRows(filteredProducts.map((p: any) => p.id));
    } else {
        setSelectedRows([]);
    }
  };

  // --- 2. EXPORT LOGIC ---
  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0 
        ? filteredProducts.filter((p: any) => selectedRows.includes(p.id)) 
        : filteredProducts;

    if (dataToExport.length === 0) return alert("No products to export");

    const csvContent = "data:text/csv;charset=utf-8," 
        + "Product ID,Name,Category,Min Price,Total Stock,Status\n"
        + dataToExport.map((p: any) => {
            const minPrice = Math.min(...p.variants.map((v: any) => v.price));
            const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
            return `${p.id},"${p.name}",${p.category?.name},${minPrice},${totalStock},${p.status}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-green-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">Manage your product catalog</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
        <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
                placeholder="Search by Product Name or Category..." 
                className="pl-10 bg-gray-50" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
             {/* Fixed Export Button Background */}
             <Button 
                onClick={handleExportCSV}
                className="bg-[#759C5D] hover:bg-[#5e8048] text-white"
             >
                <Download className="mr-2 h-4 w-4" /> Export(CSV)
             </Button>
             
             <Link href="/admin/products/add">
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                    <Plus size={20} /> Add Product
                </Button>
            </Link>
        </div>
      </div>

      {/* Selected Action Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center px-4 animate-in fade-in">
            <span className="text-green-800 font-medium">{selectedRows.length} Products Selected</span>
            <Select>
                <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue placeholder="Bulk Action" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="delete">Delete Selected</SelectItem>
                </SelectContent>
            </Select>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
            <TableHeader className="bg-green-50">
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox 
                            checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0} 
                            onCheckedChange={handleSelectAll} 
                        />
                    </TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProducts?.map((product: any) => {
                    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
                    const minPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : 0;
                    
                    return (
                        <TableRow key={product.id} className={selectedRows.includes(product.id) ? "bg-green-50/50" : ""}>
                            <TableCell>
                                <Checkbox 
                                    checked={selectedRows.includes(product.id)} 
                                    onCheckedChange={() => toggleRow(product.id)} 
                                />
                            </TableCell>
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
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-green-600"><Eye size={16} /></Button>
                                    </Link>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:bg-blue-50"><Edit size={16} /></Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {filteredProducts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No products found matching your search.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}