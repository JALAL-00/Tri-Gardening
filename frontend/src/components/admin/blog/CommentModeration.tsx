'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ThumbsUp, ThumbsDown, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface CommentModProps {
    searchTerm?: string;
    onSearchChange?: (val: string) => void;
}

const getReviews = async (status?: string) => (await api.get(`/reviews/admin${status ? `?status=${status}` : ''}`)).data;
const updateReview = async (data: { id: string, officialReply: string, status: string }) => 
  (await api.put('/reviews/admin', data)).data;

export default function CommentModeration({ searchTerm = "", onSearchChange }: CommentModProps) {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<'pending' | 'all' | 'approved'>('pending');
  const [replies, setReplies] = useState<Record<string, string>>({});

  const { data: comments, isLoading } = useQuery({
    queryKey: ['adminReviews', activeFilter],
    queryFn: () => getReviews(activeFilter === 'all' ? undefined : activeFilter)
  });

  const mutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      alert("Reply posted and review approved.");
    }
  });

  // --- Real Search Logic for Comments ---
  const filteredComments = useMemo(() => {
    if (!comments) return [];
    return comments.filter((c: any) => 
      c.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [comments, searchTerm]);

  const handleReplyChange = (id: string, text: string) => {
    setReplies(prev => ({ ...prev, [id]: text }));
  };

  const submitReply = (id: string) => {
    if (!replies[id]) return;
    mutation.mutate({ id, officialReply: replies[id], status: 'approved' });
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-green-600 h-10 w-10" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Moderation Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant={activeFilter === 'pending' ? 'default' : 'ghost'} 
            onClick={() => setActiveFilter('pending')}
            className={activeFilter === 'pending' ? "bg-[#759C5D] text-white" : "text-gray-500 hover:bg-gray-50"}
          >
            Awaiting Reply <span className={`ml-2 px-1.5 rounded text-xs ${activeFilter === 'pending' ? 'bg-white/20' : 'bg-gray-100'}`}>8</span>
          </Button>
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'ghost'} 
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? "bg-[#759C5D] text-white" : "text-gray-500 hover:bg-gray-50"}
          >
            All Comments
          </Button>
          <Button 
            variant={activeFilter === 'approved' ? 'default' : 'ghost'} 
            onClick={() => setActiveFilter('approved')}
            className={activeFilter === 'approved' ? "bg-[#759C5D] text-white" : "text-gray-500 hover:bg-gray-50"}
          >
            Replied
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[140px] bg-gray-50 border-none h-10 font-medium"><SelectValue placeholder="Sort By" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
                placeholder="Search Name, Blogs..." 
                className="pl-10 bg-gray-50 border-none h-10 focus-visible:ring-[#759C5D]" 
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Real Comments List */}
      <div className="space-y-6">
        {filteredComments.length > 0 ? filteredComments.map((comment: any) => (
          <Card key={comment.id} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4">
                
                <div className="lg:col-span-3 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-100 shadow-sm">
                        <AvatarImage src={`http://localhost:5005${comment.user?.profilePictureUrl}`} />
                        <AvatarFallback className="bg-green-100 text-green-700 font-bold">{comment.user?.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{comment.user?.fullName}</h4>
                          <Badge className="bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] flex items-center gap-1 hover:bg-[#DCFCE7]">
                            <CheckCircle2 size={10} /> Verified Purchase
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(comment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Badge className={comment.status === 'pending' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' : 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]'}>
                      {comment.status === 'pending' ? 'Awaiting Reply' : 'Replied'}
                    </Badge>
                  </div>

                  <div className="bg-[#F8F9FC] p-4 rounded-xl">
                    <p className="text-gray-700 leading-relaxed italic font-medium">
                        "{comment.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 px-2">
                    <button className="flex items-center gap-1.5 hover:text-green-600 transition-colors"><ThumbsUp size={14}/> Helpful (12)</button>
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><ThumbsDown size={14}/> Not Helpful (0)</button>
                  </div>

                  {/* Official Reply Box - FIX: Explicit Text Color */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-6 bg-[#759C5D] rounded-full"></div>
                        <h5 className="text-gray-900 font-bold text-sm uppercase tracking-wider">Official Reply</h5>
                    </div>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Write your official reply..." 
                        value={comment.officialReply || replies[comment.id] || ''}
                        onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                        disabled={comment.status === 'approved'}
                        className="bg-white border-gray-200 min-h-[120px] focus-visible:ring-[#759C5D] rounded-xl text-gray-900 font-medium placeholder:text-gray-400 shadow-inner"
                      />
                      {comment.status === 'pending' && (
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => submitReply(comment.id)}
                            className="bg-[#759C5D] hover:bg-[#5e8048] text-white px-10 h-10 font-bold shadow-md shadow-green-100"
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post Reply"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Context Card - REAL DATA */}
                <div className="bg-[#F9FAFB] p-6 border-l border-gray-100 flex flex-col justify-center">
                  <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-4">Blog Context</h5>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 mb-3 shadow-sm">
                      <Image 
                        src={comment.product?.variants?.[0]?.images?.[0] ? `http://localhost:5005${comment.product.variants[0].images[0]}` : '/placeholder.svg'} 
                        alt="Context" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <h6 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-[#759C5D] transition-colors">
                      {comment.product?.name || "Product/Blog Name"}
                    </h6>
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {comment.product?.description || "Description placeholder..."}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        )) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400">
                No comments found for the current filter.
            </div>
        )}
      </div>
    </div>
  );
}