import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-cover bg-center" style={{backgroundImage: "url('/hero-bg.jpg')"}}>
            {/* You'll need to add a hero-bg.jpg to your public/ folder */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold">Nurture Your Green Paradise</h1>
                <p className="text-lg md:text-xl text-green-200">Cultivating Green Dreams, One Plant at a Time.</p>
                <div className="flex justify-center gap-4">
                    <Link href="/products" passHref><Button size="lg" className="bg-green-600 hover:bg-green-700">Shop Now</Button></Link>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">Call Now</Button>
                </div>
            </div>
        </section>
    );
}