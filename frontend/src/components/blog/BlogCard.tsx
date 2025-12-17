'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  author: { fullName: string; profilePictureUrl?: string | null };
  category: { name: string };
  createdAt: string;
};

interface BlogCardProps {
  blog: Blog;
  isFeatured?: boolean;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function BlogCard({ blog, isFeatured = false }: BlogCardProps) {
  const imageUrl = blog.imageUrl ? `http://localhost:5005${blog.imageUrl}` : "/placeholder.svg";
  const authorImageUrl = blog.author.profilePictureUrl ? `http://localhost:5005${blog.author.profilePictureUrl}` : undefined;
  
  const excerpt = blog.content.substring(0, 100) + "...";

  if (isFeatured) {
    return (
      <Link href={`/blog/${blog.id}`} passHref>
        <Card className="w-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer relative text-white">
          <Image src={imageUrl} alt={blog.title} width={1200} height={600} className="w-full h-[450px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h2 className="text-4xl font-bold group-hover:underline">{blog.title}</h2>
            <p className="mt-2 text-gray-200 text-lg">Your Blogpost first paragraph contents here...</p>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={authorImageUrl} />
                  <AvatarFallback>{blog.author.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{blog.author.fullName}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.id}`} passHref>
      <Card className="w-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer h-full flex flex-col">
        <Image src={imageUrl} alt={blog.title} width={400} height={250} className="w-full h-48 object-cover" />
        <CardContent className="p-6 flex flex-col flex-grow">
          <p className="text-sm font-medium text-green-600">{blog.category.name}</p>
          <h3 className="mt-1 text-xl font-semibold text-green-900 leading-tight group-hover:text-green-700">{blog.title}</h3>
          <p className="mt-2 text-sm text-gray-600 flex-grow">{excerpt}</p>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500 border-t pt-3">
            <span>{formatDate(blog.createdAt)}</span>
            <span>5min Read</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}