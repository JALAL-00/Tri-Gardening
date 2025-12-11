'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import HeroSection from '@/components/homepage/HeroSection';
import ShopByCategory from '@/components/homepage/ShopByCategory';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import PlantClinicSection from '@/components/homepage/PlantClinicSection';
import { Loader2 } from 'lucide-react';

// API function to fetch homepage data
const getHomepageContent = async () => {
  const { data } = await api.get('/page-content/home');
  return data;
};

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['homepageContent'],
    queryFn: getHomepageContent,
  });

  return (
    <div>
      <HeroSection />
      
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center bg-white">
          <Loader2 className="h-16 w-16 animate-spin text-green-600" />
        </div>
      ) : isError || !data ? (
        <div className="py-16 bg-white text-center text-red-500">
          Failed to load content. Please try again later.
        </div>
      ) : (
        <>
          {data.sections.categories && data.sections.categories.length > 0 && (
            <ShopByCategory categories={data.sections.categories} />
          )}
          
          {data.sections.featuredProducts && data.sections.featuredProducts.length > 0 && (
            <ProductCarousel title="Featured Product" products={data.sections.featuredProducts} bgColor="bg-[#FEFBF6]" />
          )}

          {data.sections.popularProducts && data.sections.popularProducts.length > 0 && (
            <ProductCarousel title="Popular Products" products={data.sections.popularProducts} bgColor="bg-white" />
          )}

          <PlantClinicSection />
        </>
      )}
    </div>
  );
}