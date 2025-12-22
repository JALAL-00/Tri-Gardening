'use client';

import ProductForm from "@/components/admin/products/ProductForm";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
        <AdminHeader title="Add Product" subtitle="Product List > Add Product" />
        <ProductForm />
    </div>
  );
}