'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assume these types are defined or imported
type Review = {
  id: string;
  rating: number;
  comment: string;
  user: { fullName: string };
  createdAt: string;
  officialReply?: string;
};

interface ReviewsSectionProps {
  reviews: Review[];
  onWriteReviewClick: () => void; // Function to open the modal
}

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function ReviewsSection({ reviews, onWriteReviewClick }: ReviewsSectionProps) {
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      return { star, count, percentage: (count / (reviews.length || 1)) * 100 };
  });

  const reviewHighlights = ["Easy to grow", "Good quality", "Arrived Healthy", "Great Value"]; // Mock data

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Rating Summary */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-green-900">Customer Reviews & Ratings</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-6 w-6 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-gray-500 mb-4">Based on {reviews.length} reviews</p>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onWriteReviewClick}>
              Write Review
            </Button>
            <Separator className="my-6" />
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(item => (
                <div key={item.star} className="flex items-center gap-2 text-sm">
                  <span>{item.star} Star</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className="w-8 text-right text-gray-500">{item.count}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />
            
            {/* Review Highlights */}
            <div>
                <h3 className="font-semibold mb-2 text-gray-800">Review Highlights</h3>
                <div className="flex flex-wrap gap-2">
                    {reviewHighlights.map(highlight => (
                        <span key={highlight} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{highlight}</span>
                    ))}
                </div>
            </div>
          </div>

          {/* Right Side: Individual Reviews */}
          <div className="md:col-span-2 space-y-6">
            {reviews.map(review => (
              <div key={review.id}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {review.user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.user.fullName}</p>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
                
                {review.officialReply && (
                    <div className="mt-4 ml-8 p-4 bg-green-50 border-l-4 border-green-300 rounded-r-lg">
                        <p className="font-semibold text-green-800">Reply from TriGardening:</p>
                        <p className="text-green-700 mt-1">{review.officialReply}</p>
                    </div>
                )}
              </div>
            ))}
            {reviews.length > 5 && <Button variant="outline" className="w-full mt-6">Load More Reviews</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}