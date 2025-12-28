'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm, useFieldArray, Controller, DefaultValues } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, UploadCloud, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// --- Types ---
type ProductFormData = {
  name: string;
  description: string;
  categoryId: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
  variants: {
    title: string;
    price: number;
    buyingPrice: number;
    stock: number;
    stockAlertLimit: number;
    color?: string; 
    images?: string[]; 
  }[];
};

// API
const getCategories = async () => (await api.get('/categories')).data;
const createCategory = async (name: string) => (await api.post('/admin/categories', { name })).data;
const createProduct = async (data: any) => (await api.post('/admin/products', data)).data;
const updateProductApi = async (data: any) => (await api.put(`/admin/products/${data.id}`, data)).data; 
const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.filePath;
};

// Component
export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // --- Strictly typed default values ---
  const formDefaultValues: DefaultValues<ProductFormData> = initialData ? {
      name: initialData.name,
      description: initialData.description,
      categoryId: initialData.category?.id,
      status: initialData.status as 'published' | 'draft', 
      isFeatured: initialData.isFeatured,
      variants: initialData.variants.map((v: any) => ({
          title: v.title,
          price: Number(v.price),
          buyingPrice: Number(v.buyingPrice || 0),
          stock: Number(v.stock),
          stockAlertLimit: Number(v.stockAlertLimit || 5),
          color: v.color || '#000000', // Default to black if empty
      }))
  } : {
      name: '',
      description: '',
      categoryId: '',
      status: 'published',
      isFeatured: false,
      variants: [{ title: 'Default', price: 0, buyingPrice: 0, stock: 0, stockAlertLimit: 5, color: '#000000' }]
  };

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({ 
    defaultValues: formDefaultValues 
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const [variantImages, setVariantImages] = useState<Record<number, string[]>>(() => {
      if (!initialData) return {};
      const imgMap: any = {};
      initialData.variants.forEach((v: any, index: number) => {
          imgMap[index] = v.images || [];
      });
      return imgMap;
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const mutation = useMutation({
    mutationFn: initialData ? updateProductApi : createProduct,
    onSuccess: () => {
        alert(initialData ? "Product updated successfully!" : "Product created successfully!");
        router.push('/admin/products');
    },
    onError: (err: any) => alert(err.response?.data?.message || "Failed to save product")
  });

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsUploading(true);
        try {
            const path = await uploadImage(e.target.files[0]);
            setVariantImages(prev => ({ ...prev, [index]: [...(prev[index] || []), path] }));
        } catch (error) {
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const handleCreateCategory = async () => {
    if(!newCategoryName.trim()) return;
    try {
        await createCategory(newCategoryName);
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        setNewCategoryName("");
        setIsCreatingCategory(false);
    } catch(e) {
        alert("Failed to create category. It might already exist.");
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = {
        ...(initialData && { id: initialData.id }), 
        ...data,
        variants: data.variants.map((v, index) => ({
            ...v,
            images: variantImages[index] || [],
            price: Number(v.price),
            buyingPrice: Number(v.buyingPrice),
            stock: Number(v.stock),
            stockAlertLimit: Number(v.stockAlertLimit)
        }))
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      
      {/* LEFT COLUMN - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* General Info Card - Dark Theme */}
        <Card className="bg-white border-none shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="border-b border-gray-800 pb-4">
                <CardTitle className="text-gray-700 text-lg font-semibold">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">Product Name</Label>
                    <Input 
                        {...register("name", { required: "Name is required" })} 
                        placeholder="Type product name here..." 
                        className="bg-gray-700/10 text-black border-none h-11 focus-visible:ring-[#759C5D]" 
                    />
                    {errors.name && <span className="text-red-400 text-xs">Product Name is required</span>}
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 font-medium">Description</Label>
                    <Textarea 
                        {...register("description", { required: true })} 
                        className="bg-gray-700/10 text-black border-none min-h-[150px] focus-visible:ring-[#759C5D]" 
                        placeholder="Type description here..." 
                    />
                </div>
            </CardContent>
        </Card>

        {/* Variants Section - Dark Theme */}
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-gray-700">Product Variants & Images</h2>
                <Button 
                    type="button" 
                    onClick={() => append({ title: '', price: 0, buyingPrice: 0, stock: 0, stockAlertLimit: 5, color: '#000000' })} 
                    className="bg-[#759C5D] hover:bg-[#5e8048] text-gray-700 shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} className="mr-2" /> Add Variant
                </Button>
            </div>

            {fields.map((field, index) => (
                <Card key={field.id} className="relative bg-white border-none shadow-lg rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-full" 
                        onClick={() => remove(index)}
                    >
                        <Trash2 size={20} />
                    </Button>
                    
                    <CardHeader className="border-b border-gray-700 pb-3">
                        <CardTitle className="text-base text-gray-600 font-medium flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-700">{index + 1}</span>
                            Variant Details
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-6">
                        {/* Variant Attributes Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <Label className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 block">Variant Title (Size)</Label>
                                <Input {...register(`variants.${index}.title` as const, { required: true })} placeholder="e.g. Small" className="bg-gray-700/10 text-gray-700 border-gray-100 h-10 focus-visible:ring-[#759C5D]" />
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 block">Stock Alert Limit</Label>
                                <Input type="number" {...register(`variants.${index}.stockAlertLimit` as const)} placeholder="5" className="bg-gray-700/10 text-gray-700 border-gray-100 h-10 focus-visible:ring-[#759C5D]" />
                            </div>
                            
                            {/* Color Picker Implementation */}
                            <div>
                                <Label className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 block">Variant Color</Label>
                                <div className="flex gap-2 items-center">
                                    {/* Text Input for code */}
                                    <Input 
                                        {...register(`variants.${index}.color` as const)} 
                                        placeholder="#RRGGBB" 
                                        className="bg-gray-700/10 text-gray-700 border-gray-100 h-10 focus-visible:ring-[#759C5D] w-full" 
                                    />
                                    {/* Visual Color Picker (Native) */}
                                    <div className="relative w-10 h-10 rounded border border-gray-600 overflow-hidden shrink-0 shadow-sm">
                                        <input
                                            type="color"
                                            {...register(`variants.${index}.color` as const)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer border-none p-0 m-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Stock Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 bg-gray-700/10 p-4 rounded-lg border border-gray-800">
                            <div>
                                <Label className="text-gray-600 text-xs font-bold mb-1.5 block">Buying Price</Label>
                                <Input type="number" {...register(`variants.${index}.buyingPrice` as const)} className="bg-white text-black border-none h-9" />
                            </div>
                            <div>
                                <Label className="text-[#759C5D] text-xs font-bold mb-1.5 block">Selling Price (MRP)</Label>
                                <Input type="number" {...register(`variants.${index}.price` as const, { required: true })} className="bg-white text-black border-2 border-[#759C5D] h-9 font-bold" />
                            </div>
                            <div>
                                <Label className="text-gray-400 text-xs font-bold mb-1.5 block">Stock Quantity</Label>
                                <Input type="number" {...register(`variants.${index}.stock` as const, { required: true })} className="bg-white text-black border-none h-9" />
                            </div>
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <Label className="text-gray-400 text-xs font-bold mb-3 block">Product Images</Label>
                            <div className="flex gap-3 flex-wrap">
                                {variantImages[index]?.map((img, i) => (
                                    <div key={i} className="w-24 h-24 border border-gray-600 rounded-lg overflow-hidden relative group">
                                        <img src={`http://localhost:5005${img}`} alt="v" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Trash2 className="text-gray-700 w-5 h-5 cursor-pointer" />
                                        </div>
                                    </div>
                                ))}
                                <label className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#759C5D] hover:bg-gray-800/50 transition-all group">
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                    {isUploading ? (
                                        <Loader2 className="animate-spin text-[#759C5D] w-6 h-6" />
                                    ) : (
                                        <>
                                            <UploadCloud className="text-gray-400 group-hover:text-[#759C5D] w-6 h-6 mb-1" />
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Upload</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* RIGHT COLUMN - Sidebar Settings */}
      <div className="space-y-6">
        
        {/* Categorization Card - Dark */}
        <Card className="bg-white border-none shadow-lg rounded-xl">
            <CardHeader className="border-b border-gray-800 pb-3 flex flex-row justify-between items-center">
                <CardTitle className="text-gray-700 text-base">Categorization</CardTitle>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#759C5D] hover:text-gray-700 hover:bg-[#759C5D] h-6 text-xs px-2"
                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                >
                    {isCreatingCategory ? "Cancel" : "+ New"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
                <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">Category</Label>
                    {isCreatingCategory ? (
                        <div className="flex gap-2">
                            <Input 
                                value={newCategoryName} 
                                onChange={(e) => setNewCategoryName(e.target.value)} 
                                placeholder="New Category Name" 
                                className="bg-gray-700/10 text-black h-10 border-none"
                            />
                            <Button type="button" onClick={handleCreateCategory} className="bg-[#759C5D] text-gray-700 hover:bg-[#5e8048]">Save</Button>
                        </div>
                    ) : (
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="bg-gray-700/10 text-black border-none h-10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((cat: any) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">Tags</Label>
                    <Input placeholder="Enter tag" className="bg-gray-700/10 text-black border-none h-10" />
                </div>
            </CardContent>
        </Card>

        {/* Status Card - Dark */}
        <Card className="bg-white border-none shadow-lg rounded-xl">
            <CardHeader className="border-b border-gray-800 pb-3">
                <CardTitle className="text-gray-700 text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
                <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">Product Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-gray-700/10 text-black border-none h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-400 rounded-lg bg-gray-700/10">
                    <Label className="cursor-pointer text-gray-600 text-sm font-medium" htmlFor="featured">Featured Product</Label>
                    <Controller
                        name="isFeatured"
                        control={control}
                        render={({ field }) => (
                            <Switch 
                                id="featured" 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-[#759C5D]" 
                            />
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-[#759C5D] hover:bg-[#5e8048] text-gray-700 font-bold h-12 shadow-lg shadow-green-100 transition-all hover:scale-[1.02]" 
            disabled={mutation.isPending}
        >
            {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (initialData ? "Update Product" : "Confirm Changes")}
        </Button>
      </div>
    </form>
  );
}