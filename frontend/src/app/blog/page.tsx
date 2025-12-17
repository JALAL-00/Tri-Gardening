'use client';

import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// API function
const getBlogs = async () => (await api.get('/blogs')).data;

export default function BlogPage() {
    const { data: blogData, isLoading, isError } = useQuery({
        queryKey: ['blogs'],
        queryFn: getBlogs,
    });

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-green-600" /></div>;
    }
    
    if (isError || !blogData || blogData.data.length === 0) {
        return <div className="py-24 text-center text-red-500">Failed to load blog posts or no posts found.</div>;
    }
    
    const featuredPost = blogData.data[0];
    const otherPosts = blogData.data.slice(1);

    return (
        <div className="bg-[#FEFBF6] py-16">
            <div className="container mx-auto px-4 md:px-6">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-green-900">The TriGardening Journal</h1>
                    <p className="text-lg text-gray-600 mt-2">Your slogan goes here</p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Main Content: Blog Posts */}
                    <main className="lg:col-span-2 space-y-12">
                        {featuredPost && <BlogCard blog={featuredPost} isFeatured />}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {otherPosts.map((blog: any) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">Load More Articles</Button>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 sticky top-24">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}