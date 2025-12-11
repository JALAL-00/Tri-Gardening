import ProductCard from "@/components/products/ProductCard";

type Product = {
    id: string;
    name: string;
    variants: { price: number; images: string[] }[];
    // We'll need to add category to the type definition in the future
};

interface ProductCarouselProps {
    title: string;
    products: Product[];
    bgColor?: string;
}

export default function ProductCarousel({ title, products, bgColor = 'bg-white' }: ProductCarouselProps) {
    return (
        <section className={`${bgColor} py-16`}>
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-2 text-green-900">{title}</h2>
                <p className="text-center text-gray-500 mb-8">Discover our most popular gardening essentials</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product as any} /> // Using 'as any' temporarily until type is fully defined
                    ))}
                </div>
            </div>
        </section>
    );
}