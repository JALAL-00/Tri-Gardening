'use client';

import ProductForm from "@/components/admin/products/ProductForm";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
            <p className="text-gray-500">Product List &gt; Add Product</p>
        </div>
        <ProductForm />
    </div>
  );
}