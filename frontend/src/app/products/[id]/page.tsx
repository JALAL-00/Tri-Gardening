'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Minus, Plus, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';


type ProductVariant = {
  id: string;
  title: string;
  price: number;
  stock: number;
  images: string[];
};
type Review = {
  id: string;
  rating: number;
  comment: string;
  user: { fullName: string };
  createdAt: string;
};
type Product = {
  id: string;
  name: string;
  description: string;
  variants: ProductVariant[];
  reviews: Review[];
};



const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.post('/products/find-one', { id });
  return data;
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const addItemToCart = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });


  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  const selectedVariant = product?.variants.find(v => v.id === selectedVariantId);

  const imagePath = selectedVariant?.images[0];
  const imageUrl = imagePath
    ? `http://localhost:5005${imagePath}`
    : "/placeholder.svg";

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addItemToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      name: `${product.name} (${selectedVariant.title})`,
      image: selectedVariant.images[0] || '/placeholder.svg',
      price: selectedVariant.price,
    }, quantity);

    alert(`${quantity} x ${product.name} added to cart!`);
  };

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-green-600" /></div>;
  }
  if (isError || !product) {
    return notFound();
  }

  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          <div>
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 border">
              <Image
                src={imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

          </div>


          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-green-900">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <span className="text-gray-600">({product.reviews.length} reviews)</span>
            </div>
            
            <p className="text-3xl font-bold text-green-800">৳{selectedVariant?.price}</p>
            
            <Separator />
            

            <div>
              <Label className="text-lg font-semibold">Size</Label>
              <RadioGroup
                value={selectedVariantId || ''}
                onValueChange={setSelectedVariantId}
                className="flex items-center gap-4 mt-2"
              >
                {product.variants.map(variant => (
                  <div key={variant.id}>
                    <RadioGroupItem value={variant.id} id={variant.id} className="sr-only" />
                    <Label
                      htmlFor={variant.id}
                      className={`flex items-center justify-center rounded-md border-2 p-3 text-sm font-medium hover:bg-gray-50 cursor-pointer 
                        ${selectedVariantId === variant.id ? 'border-green-600 ring-2 ring-green-600' : 'border-gray-200'}`}
                    >
                      {variant.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <p className="text-sm text-gray-500">
              {selectedVariant?.stock ? `In Stock: ${selectedVariant.stock} available` : 'Out of Stock'}
            </p>
            
            <Separator />
            

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-2">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock < 1}>
                Add to Cart
              </Button>
            </div>
            
            <Separator />
            

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}