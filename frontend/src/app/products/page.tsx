'use client';

import FilterSidebar, { Filters } from "@/components/products/FilterSidebar"; // <-- Import Filters type
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState, useEffect } from "react"; // <-- Import useEffect
import { useDebounce } from 'use-debounce'; // <-- We'll install this tiny hook

// API function with dynamic filters
const getProducts = async (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.categoryId && filters.categoryId !== 'all') params.append('categoryId', filters.categoryId);
  if (filters.search) params.append('search', filters.search);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.tagIds && filters.tagIds.length > 0) {
    filters.tagIds.forEach(tagId => params.append('tagIds[]', tagId));
  }
  // Add page/limit for pagination later
  
  const { data } = await api.get(`/products?${params.toString()}`);
  return data;
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    categoryId: 'all',
    maxPrice: 10000,
    tagIds: [],
    search: '',
  });

  // Debouncing for search input to avoid API calls on every keystroke
  const [debouncedFilters] = useDebounce(filters, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', debouncedFilters], // Use debounced filters for the query
    queryFn: () => getProducts(debouncedFilters),
  });

  // Handler to update a single filter
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#FEFBF6] text-green-900">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Our Products</h1>
          <p className="text-lg text-gray-600 mt-2">Find the perfect additions for your garden</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        placeholder="Search for products..." 
                        className="pl-10 bg-white"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>
            </div>
            
            <ProductGrid products={data?.data || []} isLoading={isLoading} />

            <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}