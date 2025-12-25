'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
    title: string; // e.g. "Small"
    price: number;
    buyingPrice: number;
    stock: number;
    stockAlertLimit: number;
    color?: string; // Optional
    expiryDate?: string; // Optional
    // We handle images separately for file upload logic
  }[];
};

const getCategories = async () => (await api.get('/categories')).data;
const createProduct = async (data: any) => (await api.post('/admin/products', data)).data;
const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.filePath;
};

export default function ProductForm() {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
        status: 'published',
        isFeatured: false,
        variants: [{ title: 'Default', price: 0, buyingPrice: 0, stock: 0, stockAlertLimit: 5 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  // Local state to manage images for each variant [variantIndex: [url1, url2]]
  const [variantImages, setVariantImages] = useState<Record<number, string[]>>({});
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
        alert("Product created successfully!");
        router.push('/admin/products');
    },
    onError: (err: any) => {
        alert(err.response?.data?.message || "Failed to create product");
    }
  });

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsUploading(true);
        try {
            const path = await uploadImage(e.target.files[0]);
            setVariantImages(prev => ({
                ...prev,
                [index]: [...(prev[index] || []), path]
            }));
        } catch (error) {
            alert("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const onSubmit = (data: ProductFormData) => {
    // Merge images into the data
    const payload = {
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* --- LEFT COLUMN: Main Info --- */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
            <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Product Name</Label>
                    <Input {...register("name", { required: true })} placeholder="e.g. Jade Plant" className="bg-gray-50" />
                    {errors.name && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea {...register("description", { required: true })} className="bg-gray-50 h-32" placeholder="Product details..." />
                </div>
            </CardContent>
        </Card>

        {/* --- VARIANTS SECTION --- */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Product Variants</h2>
                <Button type="button" onClick={() => append({ title: '', price: 0, buyingPrice: 0, stock: 0, stockAlertLimit: 5 })} variant="outline" className="text-green-600 border-green-600">
                    <Plus size={16} className="mr-2" /> Add Variant
                </Button>
            </div>

            {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-red-500 hover:bg-red-50" onClick={() => remove(index)}>
                        <Trash2 size={18} />
                    </Button>
                    <CardHeader><CardTitle className="text-lg">Variant {index + 1}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Title (Size/Type)</Label>
                                <Input {...register(`variants.${index}.title`, { required: true })} placeholder="e.g. Small, 5kg" />
                            </div>
                            <div>
                                <Label>Color (Optional)</Label>
                                <div className="flex gap-2 items-center">
                                    <Input {...register(`variants.${index}.color`)} placeholder="e.g. #FF0000 or Red" />
                                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: 'white' }} /> {/* Simple preview placeholder */}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div><Label>Buying Price</Label><Input type="number" {...register(`variants.${index}.buyingPrice`)} /></div>
                            <div><Label>Selling Price</Label><Input type="number" {...register(`variants.${index}.price`, { required: true })} /></div>
                            <div><Label>Stock</Label><Input type="number" {...register(`variants.${index}.stock`, { required: true })} /></div>
                            <div><Label>Alert Limit</Label><Input type="number" {...register(`variants.${index}.stockAlertLimit`)} /></div>
                        </div>

                        {/* Image Upload for this Variant */}
                        <div>
                            <Label>Variant Images</Label>
                            <div className="flex gap-2 mt-2 items-center">
                                {variantImages[index]?.map((img, i) => (
                                    <div key={i} className="w-16 h-16 border rounded overflow-hidden relative">
                                        <img src={`http://localhost:5005${img}`} alt="v" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-green-500">
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                    {isUploading ? <Loader2 className="animate-spin text-green-600" /> : <UploadCloud className="text-gray-400" />}
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* --- RIGHT COLUMN: Settings --- */}
      <div className="space-y-8">
        <Card>
            <CardHeader><CardTitle>Categorization</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((cat: any) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Status & Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="flex items-center justify-between border p-3 rounded">
                    <Label>Featured Product</Label>
                    <Controller
                        name="isFeatured"
                        control={control}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Product
        </Button>
      </div>
    </form>
  );
}