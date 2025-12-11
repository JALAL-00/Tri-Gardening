import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function PlantClinicSection() {
    return (
        <section className="bg-[#FEFBF6] py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-green-900">Plant Clinic Analysis</h2>
                        <p className="text-gray-600 mb-6">Upload a photo of your plant and get instant AI-powered diagnosis with treatment recommendations from our experts.</p>
                        <Link href="/plant-clinic">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700">Diagnose Your Plant</Button>
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Image 
                            src="/plant-analysis.jpg" // Add a relevant image to your public folder
                            alt="Plant Analysis"
                            width={400}
                            height={300}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}