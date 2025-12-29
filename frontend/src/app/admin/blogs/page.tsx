'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import BlogEditor from '@/components/admin/blog/BlogEditor'; 
import CommentModeration from '@/components/admin/blog/CommentModeration';

const getBlogs = async () => (await api.get('/admin/blogs')).data;
const getReviews = async () => (await api.get('/reviews/admin')).data;
const deleteBlogApi = async (id: string) => await api.delete(`/admin/blogs/${id}`);

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'manage' | 'comments'>('manage');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Real Data Fetching
  const { data: blogs, isLoading: blogsLoading } = useQuery({ 
    queryKey: ['adminBlogs'], 
    queryFn: getBlogs 
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({ 
    queryKey: ['adminReviews'], 
    queryFn: getReviews 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      alert("Blog deleted successfully");
    }
  });

  // --- Real Search Logic for Blogs ---
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter((blog: any) => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    // Scroll to editor
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCreateNew = () => {
    setSelectedBlog(null);
    setIsEditing(true);
  };

  if (blogsLoading || commentsLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600 h-12 w-12" /></div>;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      <AdminHeader title="Blogs" subtitle="Manage and Create your blogs here" />

      {/* Tab Switcher - Now with Real Data Counts */}
      <div className="flex gap-4 items-center">
        <Button 
          onClick={() => { setActiveTab('manage'); setIsEditing(false); }}
          className={activeTab === 'manage' ? "bg-[#759C5D] text-white hover:bg-[#5e8048]" : "bg-white text-gray-600 border hover:bg-gray-50"}
        >
          Manage Blogs
        </Button>
        <Button 
          onClick={() => { setActiveTab('comments'); setIsEditing(false); }}
          className={activeTab === 'comments' ? "bg-[#759C5D] text-white hover:bg-[#5e8048]" : "bg-white text-gray-600 border hover:bg-gray-50"}
        >
          Comments <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded text-xs">{comments?.length || 0}</span>
        </Button>
      </div>

      {activeTab === 'manage' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Manage Blogs <ChevronDown size={18} />
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search Blogs by title..." 
                    className="pl-10 bg-white border-gray-200 h-11 focus-visible:ring-[#759C5D]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateNew} className="bg-[#759C5D] hover:bg-[#5e8048] text-white h-11 px-6 shadow-md shadow-green-100">
                  <Plus size={18} className="mr-2" /> Create New Blog
                </Button>
              </div>

              {/* Selection Bar */}
              {selectedRows.length > 0 && (
                <div className="bg-[#DCE4D6] p-3 rounded-lg flex justify-between items-center text-[#4A643B] px-6 border border-[#C5D6BC] animate-in slide-in-from-top-1">
                    <div className="flex items-center gap-4">
                    <Select>
                        <SelectTrigger className="h-9 bg-white border-none min-w-[130px] shadow-sm"><SelectValue placeholder="Bulk Action" /></SelectTrigger>
                        <SelectContent><SelectItem value="delete">Delete Selected</SelectItem></SelectContent>
                    </Select>
                    <Button variant="ghost" className="bg-[#4A643B] text-white hover:bg-[#3d5331] h-9 px-6">Apply</Button>
                    </div>
                    <span className="font-semibold">{selectedRows.length} Blog Selected</span>
                </div>
              )}

              <div className="border rounded-xl overflow-hidden border-gray-100">
                <Table>
                  <TableHeader className="bg-[#759C5D]">
                    <TableRow className="hover:bg-[#759C5D] border-none">
                      <TableHead className="w-12 text-white"><Checkbox className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#759C5D]" /></TableHead>
                      <TableHead className="text-white font-semibold h-12">Title</TableHead>
                      <TableHead className="text-white font-semibold h-12">Category</TableHead>
                      <TableHead className="text-white font-semibold h-12">Published Date</TableHead>
                      <TableHead className="text-white font-semibold h-12">Status</TableHead>
                      <TableHead className="text-white font-semibold h-12 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.length > 0 ? filteredBlogs.map((blog: any) => (
                      <TableRow key={blog.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell><Checkbox checked={selectedRows.includes(blog.id)} onCheckedChange={(checked) => {
                            if(checked) setSelectedRows([...selectedRows, blog.id]);
                            else setSelectedRows(selectedRows.filter(id => id !== blog.id));
                        }} /></TableCell>
                        <TableCell className="font-bold text-gray-800 max-w-xs truncate">{blog.title}</TableCell>
                        <TableCell className="text-gray-600 font-medium">{blog.category?.name || 'Uncategorized'}</TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${blog.status === 'published' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {blog.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button onClick={() => handleEdit(blog)} variant="ghost" size="icon" className="text-gray-400 hover:text-[#759C5D] hover:bg-green-50"><Edit size={18}/></Button>
                            <Button onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(blog.id)}} variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={18}/></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-400">No blogs found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Manage Blog Post Section */}
          <div id="blog-editor-section" className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
            <div className="bg-[#759C5D] p-4 text-white font-bold flex justify-between items-center cursor-pointer" onClick={() => !isEditing && handleCreateNew()}>
              {isEditing ? `Editing: ${selectedBlog?.title || 'New Blog'}` : 'Manage Blog Post'} <ChevronDown size={18} />
            </div>
            <div className="p-8">
              {isEditing ? (
                <BlogEditor initialData={selectedBlog} onCancel={() => setIsEditing(false)} />
              ) : (
                <div className="text-center py-12">
                   <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-gray-300 w-10 h-10" />
                   </div>
                   <p className="text-gray-400 font-medium">Nothing to see right now, press edit post or create new post to make changes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CommentModeration searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      )}
    </div>
  );
}