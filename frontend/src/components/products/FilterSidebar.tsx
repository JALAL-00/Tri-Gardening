'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Filters {
  categoryId: string;
  maxPrice: number;
  tagIds: string[];
  search: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
}

const getCategories = async () => (await api.get('/categories')).data;
const getTags = async () => (await api.get('/tags')).data;

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
    const { data: tags, isLoading: isLoadingTags } = useQuery({ queryKey: ['tags'], queryFn: getTags });

    const handleTagChange = (tagId: string, checked: boolean) => {
        const newTagIds = checked
            ? [...filters.tagIds, tagId]
            : filters.tagIds.filter(id => id !== tagId);
        onFilterChange('tagIds', newTagIds);
    };

    return (
        <aside className="w-full lg:w-64 xl:w-72 p-6 bg-white rounded-lg shadow-lg self-start">
            <h2 className="text-xl font-bold mb-4 text-green-900">Filters</h2>
            <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
                
                <AccordionItem value="category">
                    <AccordionTrigger className="text-lg font-semibold text-green-800">Category</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup 
                            value={filters.categoryId} 
                            onValueChange={(value) => onFilterChange('categoryId', value)} 
                            className="space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="cat-all" />
                                <Label htmlFor="cat-all" className="text-gray-700">All</Label>
                            </div>
                            {isLoadingCategories ? <p>Loading...</p> : categories?.map((category: any) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={category.id} id={`cat-${category.id}`} />
                                    <Label htmlFor={`cat-${category.id}`} className="text-gray-700">{category.name}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                    <AccordionTrigger className="text-lg font-semibold text-green-800">Price Range</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <Slider
                            value={[filters.maxPrice]}
                            onValueChange={(value) => onFilterChange('maxPrice', value[0])}
                            max={10000}
                            step={100}
                            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>৳0</span>
                            <span>৳{filters.maxPrice}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tags">
                    <AccordionTrigger className="text-lg font-semibold text-green-800">Tags</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        {isLoadingTags ? <p>Loading...</p> : tags?.map((tag: any) => (
                            <div key={tag.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`tag-${tag.id}`} 
                                    checked={filters.tagIds.includes(tag.id)}
                                    onCheckedChange={(checked) => handleTagChange(tag.id, !!checked)}
                                />
                                <Label htmlFor={`tag-${tag.id}`} className="text-gray-700">{tag.name}</Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </aside>
    );
}