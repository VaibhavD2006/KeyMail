import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Automate Your Real Estate <br className="hidden md:block" />
          Client Relationships
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Keep your clients engaged with AI-powered personalized emails. Build 
          stronger relationships, save time, and never miss an important touchpoint.
        </p>
        
        <p className="text-md text-gray-500 italic mb-8">
          (Made for Realtors by a Realtor)
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg">
            <Link href="/trial">
              Start Free Trial →
            </Link>
          </Button>
          <p className="text-gray-500">No credit card required</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto border border-gray-100">
          {/* Placeholder for dashboard/app screenshot */}
          <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">App dashboard preview</p>
          </div>
        </div>
      </div>
    </section>
  );
} 