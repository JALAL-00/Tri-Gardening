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
  const primaryImage = product.variants[0]?.images[0] || "/placeholder.svg";

  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden bg-green-950/20 border border-green-700/50 hover:border-green-500 transition-all duration-300">
      <Link href={`/products/${product.id}`} passHref>
        <div className="relative">
          <Image
            src={primaryImage}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
          />
        </div>
      </Link>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-green-300">{product.category.name}</p>
                <h3 className="text-lg font-semibold text-white">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-white">4.7</span>
            </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-green-400">৳{minPrice}</p>
          <Button className="bg-green-600 hover:bg-green-700">Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}