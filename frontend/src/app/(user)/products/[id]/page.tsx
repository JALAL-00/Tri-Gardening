'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Minus, Plus, Star, Heart, Check, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import ReviewsSection from '@/components/products/ReviewsSection';
import WriteReviewModal from '@/components/products/WriteReviewModal';
import LoginModal from '@/components/auth/LoginModal';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import { cn } from '@/lib/utils';

// --- Types ---
type ProductVariant = {
  id: string;
  title: string;
  price: number;
  stock: number;
  stockAlertLimit: number;
  color?: string;
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
  category: { name: string };
  variants: ProductVariant[];
  reviews: Review[];
};

// --- API ---
const getProduct = async (id: string): Promise<Product> => (await api.post('/products/find-one', { id })).data;
const getRelatedProducts = async () => (await api.get('/products?limit=4')).data;

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const addItemToCart = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false); // Local state for wishlist toggle

  const { data: product, isLoading, isError } = useQuery({ 
    queryKey: ['product', productId], 
    queryFn: () => getProduct(productId) 
  });
  
  const { data: relatedProductsData } = useQuery({ 
    queryKey: ['relatedProducts'], 
    queryFn: getRelatedProducts 
  });

  // Selection State
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Initialize defaults
  useEffect(() => {
    if (product && product.variants.length > 0) {
      if (!selectedSize) setSelectedSize(product.variants[0].title);
      if (!selectedColor && product.variants[0].color) setSelectedColor(product.variants[0].color);
    }
  }, [product, selectedSize, selectedColor]);

  // Find Active Variant
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find(v => 
      v.title === selectedSize && 
      (v.color === selectedColor || !v.color)
    );
  }, [product, selectedSize, selectedColor]);

  // Unique Options
  const uniqueSizes = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map(v => v.title)));
  }, [product]);

  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const colors = product.variants.map(v => v.color).filter(Boolean) as string[];
    return Array.from(new Set(colors));
  }, [product]);

  // Display Logic
  const unitPrice = activeVariant ? parseFloat(activeVariant.price as any) : 0;
  // FIX 1: Calculate Total Price based on Quantity
  const totalPrice = unitPrice * quantity;

  const imagePath = activeVariant?.images?.[0] || product?.variants[0]?.images?.[0];
  const imageUrl = imagePath ? `http://localhost:5005${imagePath}` : "/placeholder.svg";
  const stock = activeVariant?.stock || 0;
  const isLowStock = stock > 0 && stock <= (activeVariant?.stockAlertLimit || 5);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (!product || !activeVariant) return;
    
    addItemToCart({
      productId: product.id,
      variantId: activeVariant.id,
      name: `${product.name} (${activeVariant.title}${activeVariant.color ? ` - ${activeVariant.color}` : ''})`,
      image: activeVariant.images[0] || '/placeholder.svg',
      price: activeVariant.price,
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

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-green-600" /></div>;
  if (isError || !product) return notFound();

  return (
    <>
      <div className="bg-white text-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Left: Images */}
            <div>
              <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 border bg-gray-50 relative">
                <Image 
                  src={imageUrl} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {activeVariant?.images?.map((img: string, index: number) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden border-2 border-green-100 hover:border-green-600 cursor-pointer relative">
                    <Image 
                      src={`http://localhost:5005${img}`} 
                      alt={`${product.name} thumbnail`} 
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-green-600">{product.category.name}</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-green-900">{product.name}</h1>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews.length} Reviews)</span>
                  
                  {isOutOfStock ? (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <AlertTriangle size={12} /> Low Stock: {stock} left
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">In Stock</span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Size Selector */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold text-gray-900">Size</Label>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {uniqueSizes.map(size => (
                        // FIX 2: Custom styling for Selected State (Sweet Green)
                        <Button 
                          key={size} 
                          variant="outline"
                          onClick={() => setSelectedSize(size)} 
                          className={cn(
                            "min-w-[3rem] transition-all duration-200", 
                            selectedSize === size 
                              ? 'bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-white shadow-md' // Active
                              : 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-700' // Inactive
                          )}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {uniqueColors.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold text-gray-900">Color</Label>
                    <div className="flex items-center gap-3 mt-2">
                      {uniqueColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all shadow-sm",
                            selectedColor === color ? "ring-2 ring-offset-2 ring-green-600 scale-110" : "hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {selectedColor === color && (
                            <Check size={14} className={['#ffffff', 'white'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                {/* FIX 1: Display Total Price */}
                <p className="text-4xl font-bold text-green-800">৳{totalPrice.toFixed(2)}</p>
                
                <div className="flex items-center gap-4">
                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={isOutOfStock}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)} disabled={isOutOfStock || quantity >= stock}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-base font-bold shadow-md shadow-green-200 text-white" 
                    onClick={handleAddToCart} 
                    disabled={!activeVariant || isOutOfStock}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  
                  {/* FIX 3: Wishlist Button */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "h-12 w-12 transition-colors duration-300",
                      isWishlisted
                        ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                        : "bg-gray-500 border-green-500 text-white hover:bg-green-600"
                    )}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6",
                        isWishlisted && "fill-current"
                      )}
                    />
                  </Button>

                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-bold mb-2 text-green-900">Description</h3>
                <div className="text-gray-600 prose prose-sm max-w-none">
                  {product.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProductsData && (
        <ProductCarousel 
          title="Related Products" 
          products={relatedProductsData.data} 
          bgColor="bg-gray-50" 
        />
      )}
      
      <ReviewsSection 
        reviews={product.reviews} 
        onWriteReviewClick={handleWriteReviewClick} 
      />
      
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
