import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-forest text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">
              Harvest<span className="text-secondary">Direct</span>
            </h3>
            <p className="text-white/80 mb-6">
              Connecting conscious consumers directly with traditional farmers who grow food the way nature intended.
            </p>
            <div className="flex space-x-4">
              {/* Social Links */}
              <a href="#" className="text-white hover:text-secondary transition duration-200">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary transition duration-200">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary transition duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-secondary transition duration-200">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=Coffee%20%26%20Tea" className="text-white/80 hover:text-secondary transition duration-200">
                  Coffee & Tea
                </Link>
              </li>
              <li>
                <Link href="/products?category=Spices" className="text-white/80 hover:text-secondary transition duration-200">
                  Spices
                </Link>
              </li>
              <li>
                <Link href="/products?category=Grains" className="text-white/80 hover:text-secondary transition duration-200">
                  Grains & Rice
                </Link>
              </li>
              <li>
                <Link href="/products?category=Others" className="text-white/80 hover:text-secondary transition duration-200">
                  Superfoods
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/80 hover:text-secondary transition duration-200">
                  Gift Boxes
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">About Us</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#story" className="text-white/80 hover:text-secondary transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/farmers" className="text-white/80 hover:text-secondary transition duration-200">
                  Meet the Farmers
                </Link>
              </li>
              <li>
                <Link href="/#process" className="text-white/80 hover:text-secondary transition duration-200">
                  Sustainability
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#contact" className="text-white/80 hover:text-secondary transition duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-secondary transition duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} HarvestDirect. All rights reserved. Made with ❤️ for farmers and natural food.</p>
        </div>
      </div>
    </footer>
  );
}
