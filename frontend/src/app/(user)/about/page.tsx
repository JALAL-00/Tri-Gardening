'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Microscope, PenTool, Flower2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  // Updated with Real Data from LinkedIn Profiles provided
  const teamMembers = [
    {
      name: "Wahid Shuvo",
      role: "Co-Founder & Tech Lead",
      image: "/Wahid Shuvo.jpg", 
      bio: "Passionate about bridging technology and nature. Shuvo leads the technical vision of TriGardening, ensuring a seamless experience for every plant lover."
    },
    {
      name: "Jalal Uddin",
      role: "Co-Founder & Developer",
      image: "/Jalal.jpg",
      bio: "With a keen eye for detail and a love for greenery, Jalal drives the development of our core features, making gardening accessible to everyone."
    },
    {
      name: "Imtiaj Sajin",
      role: "Co-Founder & Developer",
      image: "/Imtiaj Sajin.jpg",
      bio: "The creative mind behind our brand. Sajin ensures that TriGardening isn't just a store, but a beautiful community for learning and growing."
    }
  ];

  return (
    <div className="bg-[#FEFBF6]">
      
      {/* --- HERO SECTION --- */}
      <section 
        className="relative h-[60vh] flex items-center justify-center text-center text-white bg-cover bg-center" 
        style={{backgroundImage: "url('/hero-bg.jpg')"}}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container px-4 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your Trusted Partner in <br /> Gardening
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Cultivating expertise, growing communities, and nurturing your green dreams for over a decade
          </p>
          <div className="pt-4">
            <Link href="#team">
                <Button size="lg" className="bg-[#D98829] hover:bg-[#b87322] text-white font-semibold px-8 py-6 rounded-full text-lg">
                Meet Our Team
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section id="team" className="py-20 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-green-900">Meet Our Gardening Experts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our passionate team brings years of combined experience to help your garden flourish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-[#F5F5DC]/40 border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-8 pt-10">
                <div className="w-32 h-32 relative mb-6">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover rounded-full border-4 border-white shadow-md bg-gray-200" 
                  />
                </div>
                <h3 className="text-xl font-bold text-green-900">{member.name}</h3>
                <p className="text-green-600 font-medium text-sm mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* --- COMMITMENT SECTION --- */}
      <section className="py-20 bg-[#F3F0E6]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-green-900">Our Commitment to You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're dedicated to providing you with the knowledge, tools, and support needed for gardening success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                <Microscope className="w-10 h-10 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Plant Clinic Analysis</h3>
              <p className="text-gray-600 text-sm px-4">
                Get expert diagnosis for plant problems with our comprehensive AI analysis service. Upload photos and receive detailed treatment plans.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                <PenTool className="w-10 h-10 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Expert Blog Content</h3>
              <p className="text-gray-600 text-sm px-4">
                Access weekly articles, seasonal guides, and in-depth tutorials written by our certified horticulturists and plant specialists.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                <Flower2 className="w-10 h-10 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Satisfaction Guarantee</h3>
              <p className="text-gray-600 text-sm px-4">
                We stand behind our advice and products. If you're not completely satisfied, we'll work with you until we find the right solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY SECTION --- */}
      <section className="bg-[#759C5D] py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Join Our TriGardening Community</h2>
            <p className="text-green-100 max-w-2xl mx-auto text-lg">
              We're dedicated to providing you with the knowledge, tools, and support needed for gardening success
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-12">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#FDFCF4]">Facebook Community Forum</h3>
                <p className="text-green-100">
                  Connect with 10,000+ gardeners across Bangladesh. Ask questions, share tips, and celebrate your growing journey.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#FDFCF4]">TriGardening Youtube Channel</h3>
                <p className="text-green-100">
                  Join us on YouTube for quick gardening tips, tricks, and guides to grow smarter.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-80 lg:h-96 w-full rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
              <Image 
                src="/hero-bg.jpg" 
                alt="Community Garden" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- GET IN TOUCH --- */}
      <section className="py-24 text-center bg-[#FEFBF6]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 text-lg">
            Have questions? We're here to help you grow your gardening knowledge
          </p>
          <div className="mt-8">
             <Link href="/contact">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-6 text-lg rounded-full">
                    Contact Support
                </Button>
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}