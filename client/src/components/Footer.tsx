import { Link } from "wouter";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email,
          agreedToTerms: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      toast({
        title: "Subscription successful!",
        description: "Thank you for joining our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-[#283618] text-white pt-16 pb-8 mt-16 w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-6">
              Harvest<span className="text-[#DDA15E]">Direct</span>
            </h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Connecting conscious consumers directly with traditional farmers who grow food the way nature intended.
            </p>
            <div className="flex space-x-5 mt-4">
              {/* Social Links */}
              <a href="#" className="text-white hover:text-[#DDA15E] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-white hover:text-[#DDA15E] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-white hover:text-[#DDA15E] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-white hover:text-[#DDA15E] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2">Products</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/products?category=Coffee%20%26%20Tea" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Coffee & Tea
                </Link>
              </li>
              <li>
                <Link href="/products?category=Spices" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Spices
                </Link>
              </li>
              <li>
                <Link href="/products?category=Grains" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Grains & Rice
                </Link>
              </li>
              <li>
                <Link href="/products?category=Others" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Superfoods
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Gift Boxes
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2">About Us</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/#story" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Meet the Farmers
                </Link>
              </li>
              <li>
                <Link href="/#process" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Sustainability
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2">Customer Care</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white/90 hover:text-[#DDA15E] transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#DDA15E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/20 pt-8 pb-8">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="text-white font-bold text-xl mb-4">Join Our Newsletter</h4>
            <p className="text-white/80 mb-6">Get updates on new arrivals, seasonal harvest news, and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md py-3 px-4 flex-grow focus:outline-none focus:ring-2 focus:ring-[#DDA15E]"
                required
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#DDA15E] hover:bg-[#DDA15E]/90 disabled:bg-[#DDA15E]/50 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        


        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80 text-sm mb-2">© {new Date().getFullYear()} HarvestDirect. All rights reserved.</p>
          <p className="text-white/70 text-sm">Made with ❤️ for farmers and natural food.</p>
        </div>
      </div>
    </footer>
  );
}