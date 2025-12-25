'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully! We'll get back to you soon.");
    }, 1500);
  };

  return (
    <div className="bg-[#FEFBF6] min-h-screen">
      {/* Header */}
      <div className="bg-green-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
        <p className="text-green-100 max-w-2xl mx-auto px-4">
          Have a question about your plants or an order? Our team is here to help you grow.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
        <Card className="bg-white shadow-lg border-none">
        <CardHeader>
            <CardTitle className="text-2xl text-green-900">
            Send us a Message
            </CardTitle>
        </CardHeader>

        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                    id="name"
                    placeholder="Jalal"
                    required
                    className="bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-green-500"
                />
                </div>

                {/* Email */}
                <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="jalal@example.com"
                    required
                    className="bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-green-500"
                />
                </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                id="subject"
                placeholder="Order #12345 or Plant Advice"
                required
                className="bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-green-500"
                />
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                id="message"
                placeholder="How can we help you today?"
                required
                className="min-h-[150px] bg-gray-50 text-black placeholder:text-gray-400 focus-visible:ring-green-500"
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                </>
                ) : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                </>
                )}
            </Button>
            </form>
        </CardContent>
        </Card>


          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-green-50 border-green-100">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Phone className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-semibold">Call Us</p>
                    <p className="text-lg font-bold text-green-900">+8801875627698</p>
                    <p className="text-xs text-gray-500">Sun-Thus, 9am - 6pm</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-100">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Mail className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-semibold">Email Us</p>
                    <p className="text-lg font-bold text-green-900">jalaluddin0046356@gmail.com</p>
                    <p className="text-xs text-gray-500">We reply within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-100">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <MapPin className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-semibold">Visit Us</p>
                    <p className="text-lg font-bold text-green-900">Dhaka, Bangladesh</p>
                    <p className="text-xs text-gray-500">Kuratoli, Kuril</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-xl h-64 w-full flex items-center justify-center relative overflow-hidden shadow-inner">
               <iframe 
                 src="https://www.google.com/maps?q=American+International+University+Bangladesh,+Kuratoli,+Kuril&output=embed"

                 width="100%" 
                 height="100%" 
                 style={{border:0}} 
                 allowFullScreen 
                 loading="lazy"
                 className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}