import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown } from "lucide-react";

// Full Blog Post Component
export default function BlogPost({ blog }: { blog: any }) {
    const imageUrl = `http://localhost:5005${blog.imageUrl}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <article className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-6">
                <p className="font-semibold text-green-600">{blog.category.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span>5min Read</span>
                    <span>•</span>
                    <span>{formatDate(blog.createdAt)}</span>
                </div>
            </div>
            <h1 className="text-4xl font-bold text-green-900 mb-4">{blog.title}</h1>
            <Image src={imageUrl} alt={blog.title} width={1000} height={500} className="w-full rounded-lg object-cover mb-8" />
            
            {/* The `prose` class from @tailwindcss/typography will style this content */}
            <div
                className="prose prose-lg max-w-none prose-h2:text-green-900 prose-p:text-gray-700 prose-a:text-green-600"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Separator className="my-12" />

            {/* Comments Section */}
            <div>
                <h2 className="text-2xl font-bold text-green-900 mb-6">Comments</h2>
                <div className="space-y-6">
                    {/* Comment Form */}
                    <div>
                        <Textarea placeholder="Write your comment..." className="bg-gray-100 text-black" rows={4}/>
                        <Button className="mt-2 bg-green-600 hover:bg-green-700">Submit</Button>
                    </div>
                    {/* Existing Comments (Mocked) */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Avatar><AvatarImage /><AvatarFallback>IC</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold text-gray-800">Ismita Chowdhury</p>
                                <p className="text-xs text-gray-500">4 days ago (12 September, 2025)</p>
                                <p className="mt-2 text-gray-700">This is a wonderful post! Very informative.</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <button className="flex items-center gap-1 hover:text-green-600"><ThumbsUp size={14}/> Helpful (10)</button>
                                    <button className="flex items-center gap-1 hover:text-red-600"><ThumbsDown size={14}/> Not helpful (0)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}