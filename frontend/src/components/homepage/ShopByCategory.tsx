import { Card } from "@/components/ui/card";
import { SunIcon } from "@radix-ui/react-icons"; // Replace with actual icons later
import Link from "next/link";

type Category = {
    id: string;
    name: string;
};

interface ShopByCategoryProps {
    categories: Category[];
}

export default function ShopByCategory({ categories }: ShopByCategoryProps) {
    // Icons can be mapped to category names
    const icons: Record<string, JSX.Element> = {
        Plants: <SunIcon className="h-12 w-12 text-green-700" />,
        Medicine: <SunIcon className="h-12 w-12 text-green-700" />,
        Equipment: <SunIcon className="h-12 w-12 text-green-700" />,
        Fertilizers: <SunIcon className="h-12 w-12 text-green-700" />,
    };

    return (
        <section className="bg-[#FEFBF6] py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-green-900">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link href={`/products?category=${category.id}`} key={category.id}>
                            <Card className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {icons[category.name] || <SunIcon className="h-12 w-12 text-green-700" />}
                                <h3 className="text-lg font-semibold text-green-900 mt-4">{category.name}</h3>
                                <p className="text-sm text-gray-500 text-center">Indoor & Outdoor Plants</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}