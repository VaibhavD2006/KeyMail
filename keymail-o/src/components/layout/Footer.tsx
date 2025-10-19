import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-4">KeyMail</h3>
            <p className="text-gray-600 mb-4">
              AI-powered email marketing for real estate professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-600 hover:text-purple-600">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-purple-600">Pricing</Link></li>
              <li><Link href="/testimonials" className="text-gray-600 hover:text-purple-600">Testimonials</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-purple-600">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-purple-600">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-purple-600">Contact</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-purple-600">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-purple-600">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-purple-600">Terms of Service</Link></li>
              <li><Link href="/gdpr" className="text-gray-600 hover:text-purple-600">GDPR</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} KeyMail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 