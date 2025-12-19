'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Minus, Plus, Star, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import ReviewsSection from '@/components/products/ReviewsSection';
import WriteReviewModal from '@/components/products/WriteReviewModal';
import LoginModal from '@/components/auth/LoginModal';
import ProductCarousel from '@/components/homepage/ProductCarousel';

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
  officialReply?: string;
};
type Product = {
  id: string;
  name: string;
  description: string;
  variants: ProductVariant[];
  reviews: Review[];
};

const getProduct = async (id: string): Promise<Product> => (await api.post('/products/find-one', { id })).data;
const getRelatedProducts = async () => (await api.get('/products?limit=4')).data;

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const addItemToCart = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { data: product, isLoading, isError } = useQuery({ queryKey: ['product', productId], queryFn: () => getProduct(productId) });
  const { data: relatedProductsData } = useQuery({ queryKey: ['relatedProducts'], queryFn: getRelatedProducts });

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  const selectedVariant = product?.variants.find(v => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? parseFloat(selectedVariant.price as any) : 0;

  const imagePath = selectedVariant?.images[0];
  const imageUrl = imagePath ? `http://localhost:5005${imagePath}` : "/placeholder.svg";

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

  const handleWriteReviewClick = () => {
    if (isAuthenticated) {
      setIsReviewModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-green-600" /></div>;
  }
  if (isError || !product) {
    return notFound();
  }

  return (
    <>
      <div className="bg-white text-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 border">
                <Image src={imageUrl} alt={product.name} width={600} height={600} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {selectedVariant?.images.map((img: string, index: number) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden border-2 border-green-600">
                    <Image src={`http://localhost:5005${img}`} alt={`${product.name} thumbnail ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Indoor Plant</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-green-900">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5 text-yellow-500">{[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}</div>
                  <span className="text-gray-600">({product.reviews.length} Reviews)</span>
                  <span className="text-green-600 font-semibold ml-4">In Stock</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Size</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {product.variants.map(v => (
                      <Button key={v.id} variant={selectedVariantId === v.id ? 'default' : 'outline'} onClick={() => setSelectedVariantId(v.id)} className={`bg-white ${selectedVariantId === v.id ? 'border-green-600 text-green-700 font-bold' : ''}`}>
                          {v.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
              <p className="text-4xl font-bold text-green-800">৳{displayPrice.toFixed(2)}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-2">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock < 1}>
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12"><Heart /></Button>
              </div>
              <Separator />
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-900">Descriptions</h3>
                <p className="text-gray-600 prose">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProductsData && <ProductCarousel title="Related Products" products={relatedProductsData.data} bgColor="bg-gray-50" />}
      <ReviewsSection reviews={product.reviews} onWriteReviewClick={handleWriteReviewClick} />
      
      <WriteReviewModal 
        product={product} 
        isOpen={isReviewModalOpen} 
        onOpenChange={setIsReviewModalOpen} 
      />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
        title="Login to Write a Review" 
      />
    </>
  );
}
