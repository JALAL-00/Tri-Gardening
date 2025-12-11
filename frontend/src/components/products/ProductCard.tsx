'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: { name: string };
  variants: { price: number; images: string[] }[];
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const imagePath = product.variants[0]?.images[0];
  const imageUrl = imagePath 
    ? `http://localhost:5005${imagePath}` 
    : "/placeholder.svg";

  return (
    <Link href={`/products/${product.id}`} passHref>
      <Card className="w-full max-w-sm rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
          />
        </div>
        <CardContent className="p-4 space-y-2 bg-white">
          <div className="flex justify-between items-start">
              <div>
                  <p className="text-sm text-green-600 font-medium">{product.category.name}</p>
                  <h3 className="text-lg font-semibold text-green-900">{product.name}</h3>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-gray-800">4.7</span>
              </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <p className="text-xl font-bold text-green-800">৳{minPrice}</p>
            <Button 
              className="bg-green-600 text-white hover:bg-green-700 pointer-events-none" 
              asChild={false} 
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}