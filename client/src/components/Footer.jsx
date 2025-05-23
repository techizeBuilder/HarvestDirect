import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-forest pt-16 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Company Info */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">
              <Link href="/">
                <a className="flex items-center">
                  <img src="/logo-light.svg" alt="Harvest Direct Logo" className="h-10 mr-3" />
                  <span>Harvest Direct</span>
                </a>
              </Link>
            </h3>
            <p className="text-white/80 mb-6">
              Connecting you directly with farmers who grow exceptional, naturally grown products using traditional methods.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Instagram size={18} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/products' },
                { label: 'Our Story', href: '/our-story' },
                { label: 'Our Process', href: '/our-process' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-white/80 hover:text-white transition-colors hover:underline">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6">Categories</h3>
            <ul className="space-y-3">
              {[
                { label: 'Coffee & Tea', href: '/products?category=coffee-tea' },
                { label: 'Spices', href: '/products?category=spices' },
                { label: 'Grains', href: '/products?category=grains' },
                { label: 'Superfoods', href: '/products?category=superfoods' },
                { label: 'Seasonal Produce', href: '/products?category=seasonal' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-white/80 hover:text-white transition-colors hover:underline">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                <span className="text-white/80">
                  123 Farm Street, Suite 101<br />
                  Green Valley, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 shrink-0" />
                <a href="tel:+18005551234" className="text-white/80 hover:text-white transition-colors hover:underline">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 shrink-0" />
                <a href="mailto:info@harvestdirect.com" className="text-white/80 hover:text-white transition-colors hover:underline">
                  info@harvestdirect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Trust & Payment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-white/10">
          <div>
            <h4 className="font-heading font-semibold mb-4">We Accept</h4>
            <div className="flex flex-wrap gap-3">
              {['visa', 'mastercard', 'amex', 'paypal', 'apple-pay'].map((payment) => (
                <div key={payment} className="bg-white/10 rounded px-3 py-2 text-sm">
                  {payment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Certifications</h4>
            <div className="flex flex-wrap gap-3">
              {['USDA Organic', 'Fair Trade', 'Non-GMO', 'Rainforest Alliance'].map((cert) => (
                <div key={cert} className="bg-white/10 rounded px-3 py-2 text-sm">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright & Policies */}
      <div className="bg-forest-dark py-6">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {currentYear} Harvest Direct. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <a href="/privacy-policy" className="text-white/70 hover:text-white transition-colors hover:underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-white/70 hover:text-white transition-colors hover:underline">
              Terms of Service
            </a>
            <a href="/shipping-policy" className="text-white/70 hover:text-white transition-colors hover:underline">
              Shipping Policy
            </a>
            <a href="/refund-policy" className="text-white/70 hover:text-white transition-colors hover:underline">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;