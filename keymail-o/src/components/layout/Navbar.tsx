"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full py-4 border-b border-gray-100 bg-white/70 backdrop-blur-md fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-purple-600">
          KeyMail
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
            Testimonials
          </a>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" ? (
            <>
              <span className="text-gray-700">Hello, {session.user?.name?.split(' ')[0]}</span>
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Button 
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline" 
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                Log in
              </Link>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-gray-900 px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-gray-600 hover:text-gray-900 px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-600 hover:text-gray-900 px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              {status === "authenticated" ? (
                <>
                  <span className="block text-gray-700 px-4 py-2">Hello, {session.user?.name?.split(' ')[0]}</span>
                  <Link 
                    href="/dashboard" 
                    className="block text-gray-700 hover:bg-gray-50 px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="block text-red-600 hover:bg-red-50 w-full text-left px-4 py-2"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="block text-gray-700 hover:bg-gray-50 px-4 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/login" 
                    className="block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 mt-2 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 