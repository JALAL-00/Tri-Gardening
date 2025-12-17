'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getCategories = async () => (await api.get('/categories')).data;
const getRecentPosts = async () => (await api.get('/blogs?limit=4')).data;

export default function BlogSidebar() {
    const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['blogCategories'], queryFn: getCategories });
    const { data: recentPostsData, isLoading: isLoadingPosts } = useQuery({ queryKey: ['recentPosts'], queryFn: getRecentPosts });

    const constructImageUrl = (path: string) => `http://localhost:5005${path}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <aside className="w-full space-y-8">
            <Card className="bg-white shadow-lg rounded-lg">
                <CardHeader><CardTitle className="text-lg font-bold text-green-900">Search Blog</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative">
                        <Input placeholder="Search articles..." className="bg-gray-100 text-black pr-10 border-gray-300" />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg rounded-lg">
                <CardHeader><CardTitle className="text-lg font-bold text-green-900">Blog Categories</CardTitle></CardHeader>
                <CardContent>
                    {isLoadingCategories ? <Loader2 className="animate-spin" /> : (
                        <ul className="space-y-3">
                            {categories?.map((cat: any) => (
                                <li key={cat.id} className="flex justify-between items-center text-gray-700 hover:text-green-700 font-medium transition-colors">
                                    <Link href="#">{cat.name}</Link>
                                    <span className="text-gray-500 text-sm">12</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-white shadow-lg rounded-lg">
                <CardHeader><CardTitle className="text-lg font-bold text-green-900">Recent Posts</CardTitle></CardHeader>
                <CardContent>
                     {isLoadingPosts ? <Loader2 className="animate-spin" /> : (
                        <ul className="space-y-4">
                            {recentPostsData?.data.map((post: any) => (
                                <li key={post.id}>
                                    <Link href={`/blog/${post.id}`} className="flex items-center gap-4 group">
                                        <Image src={constructImageUrl(post.imageUrl)} alt={post.title} width={80} height={80} className="rounded-md object-cover w-20 h-20 border" />
                                        <div>
                                            <p className="font-semibold text-gray-800 group-hover:text-green-700 leading-tight">{post.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(post.createdAt)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </aside>
    );
}