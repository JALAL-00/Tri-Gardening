'use client';

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, UploadCloud } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Image from "next/image";

interface WriteReviewModalProps {
  product: { // Pass the whole product object
    id: string;
    name: string;
    variants: { price: number, images: string[] }[];
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// API function
const submitReview = async (data: { productId: string; rating: number; comment: string; }) => {
    const response = await api.post('/reviews', data);
    return response.data;
};

export default function WriteReviewModal({ product, isOpen, onOpenChange }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
        alert("Review submitted successfully! It will be visible after approval.");
        queryClient.invalidateQueries({ queryKey: ['product', product.id] });
        onOpenChange(false);
        setRating(0);
        setComment("");
    },
    onError: (error: any) => {
        alert(error.response?.data?.message || "Failed to submit review.");
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
        alert("Please select a rating.");
        return;
    }
    mutation.mutate({ productId: product.id, rating, comment });
  };
  
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));
  const imageUrl = product.variants[0]?.images[0] ? `http://localhost:5005${product.variants[0].images[0]}` : "/placeholder.svg";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white p-8">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">Write Your Review</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Image src={imageUrl} alt={product.name} width={80} height={80} className="rounded-md" />
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="font-bold text-orange-500">৳ {minPrice}–{maxPrice}</p>
                </div>
            </div>

            {/* Rating */}
            <div className="text-center space-y-2">
                <p className="font-medium text-gray-700">Please Rate This Product</p>
                <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <Star 
                                key={starValue}
                                className={`h-8 w-8 cursor-pointer transition-colors ${
                                    starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Comment */}
            <Textarea 
                placeholder="Describe your experience (optional)" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-black bg-gray-50 min-h-[100px]"
            />
        </div>

        <DialogFooter className="grid grid-cols-2 gap-4">
            <DialogClose asChild>
                <Button type="button" variant="outline" className="bg-gray-100 hover:bg-gray-200 h-12 text-base text-black">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit} disabled={mutation.isPending} className="bg-green-800 hover:bg-green-900 h-12 text-base text-white">
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}