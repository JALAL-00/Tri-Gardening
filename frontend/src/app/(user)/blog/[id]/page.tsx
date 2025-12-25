'use client';

import BlogPost from "@/components/blog/BlogPost";
import BlogSidebar from "@/components/blog/BlogSidebar";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

const getBlog = async (id: string) => (await api.post('/blogs/find-one', { id })).data;

export default function BlogDetailPage({ params }: { params: { id: string } }) {
    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blog', params.id],
        queryFn: () => getBlog(params.id)
    });

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-green-600" /></div>;
    }

    if (isError || !blog) {
        return notFound();
    }

    return (
        <div className="bg-[#FEFBF6] py-16">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <main className="lg:col-span-2">
                        <BlogPost blog={blog} />
                    </main>
                    <aside className="lg:col-span-1 sticky top-24">
                        <BlogSidebar />
                    </aside>
                 </div>
            </div>
        </div>
    );
}