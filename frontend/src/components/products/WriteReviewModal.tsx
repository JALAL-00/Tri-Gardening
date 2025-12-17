'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface WriteReviewModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// API function
const submitReview = async (data: { productId: string; rating: number; comment: string; }) => {
    const response = await api.post('/reviews', data);
    return response.data;
};

export default function WriteReviewModal({ productId, productName, isOpen, onOpenChange }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
        alert("Review submitted successfully! It will be visible after approval.");
        queryClient.invalidateQueries({ queryKey: ['product', productId] }); // Invalidate product query to refetch data
        onOpenChange(false); // Close the modal
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
    mutation.mutate({ productId, rating, comment });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Write a Review for {productName}</DialogTitle>
          <DialogDescription>Share your experience with this product.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex justify-center items-center gap-1">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <Star 
                            key={starValue}
                            className={`h-8 w-8 cursor-pointer transition-colors ${
                                starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    );
                })}
            </div>
            <Textarea 
                placeholder="Describe your experience..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-black"
            />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}