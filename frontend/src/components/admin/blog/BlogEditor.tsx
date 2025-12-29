'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  UploadCloud, Bold, Italic, Underline, Strikethrough, 
  AlignLeft, Image as ImageIcon, Video, Link, Loader2, X 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogEditorProps {
  initialData?: any;
  onCancel: () => void;
}

const getCategories = async () => (await api.get('/categories')).data;
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.filePath;
};

export default function BlogEditor({ initialData, onCancel }: BlogEditorProps) {
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      categoryId: initialData?.category?.id || '',
      status: initialData?.status || 'draft',
      tagIds: initialData?.tags?.map((t: any) => t.id) || []
    }
  });

  const { data: categories } = useQuery({ queryKey: ['blogCategories'], queryFn: getCategories });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, imageUrl };
      if (initialData) {
        return (await api.patch(`/admin/blogs`, { id: initialData.id, ...payload })).data;
      }
      return (await api.post('/admin/blogs', payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      alert(initialData ? "Blog Updated" : "Blog Created");
      onCancel();
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      try {
        const path = await uploadImage(e.target.files[0]);
        setImageUrl(path);
      } catch (err) {
        alert("Upload failed");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Content Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <Input 
            {...register("title", { required: true })}
            placeholder="Add Title....." 
            className="text-3xl font-bold border-none bg-transparent placeholder:text-gray-600 focus-visible:ring-0 px-0 h-auto"
          />
          <div className="flex justify-between items-center text-sm text-gray-400">
             <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="relative group">
          {imageUrl ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border">
              <img src={`http://localhost:5005${imageUrl}`} alt="Blog" className="w-full h-full object-cover" />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setImageUrl(null)}
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed border-gray-200 rounded-2xl bg-[#F9FAFB] cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              {isUploading ? (
                <Loader2 className="animate-spin text-green-600 w-10 h-10" />
              ) : (
                <>
                  <div className="bg-gray-200 p-4 rounded-full mb-4">
                    <UploadCloud className="text-gray-500 w-8 h-8" />
                  </div>
                  <span className="text-gray-500 font-medium">Upload Blog Image</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* Rich Text Toolbar UI */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg overflow-x-auto">
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><AlignLeft size={18}/></Button>
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><ImageIcon size={18}/></Button>
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Video size={18}/></Button>
           <div className="w-px h-6 bg-gray-300 mx-1" />
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8 font-bold"><Bold size={18}/></Button>
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8 italic"><Italic size={18}/></Button>
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8 underline"><Underline size={18}/></Button>
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8 line-through"><Strikethrough size={18}/></Button>
           <div className="w-px h-6 bg-gray-300 mx-1" />
           <Button type="button" variant="ghost" size="icon" className="h-8 w-8"><Link size={18}/></Button>
        </div>

        <Textarea 
          {...register("content", { required: true })}
          placeholder="Start writing your amazing gardening tips here..." 
          className="min-h-[400px] border-none bg-transparent focus-visible:ring-0 text-gray-600 text-lg leading-relaxed px-0 resize-none"
        />
      </div>

      {/* Right Column: Settings Sidebar */}
      <div className="space-y-6">
        
        {/* Categorization */}
        <Card className="bg-white shadow-sm border-gray-100">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Categorization</h3>
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs uppercase font-bold">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-gray-700/10 text-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs uppercase font-bold">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                 <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">None</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter tag" className="bg-gray-700/10 text-gray-700 h-9" />
                <Button type="button" className="bg-[#759C5D] h-9">Add New</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="shadow-sm border-gray-100">
          <CardContent className="bg-white p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Status</h3>
            <div className="space-y-2">
              <Label className="text-gray-600 text-xs uppercase font-bold">Product Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-gray-700/10 text-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            type="submit" 
            className="w-full bg-[#759C5D] hover:bg-[#5e8048] text-white font-bold h-12 shadow-md shadow-green-100"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-gray-400 hover:text-red-500"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}