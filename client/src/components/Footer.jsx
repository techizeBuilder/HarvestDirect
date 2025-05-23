import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-white pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h2 className="font-heading text-2xl font-bold mb-6">
              Harvest<span className="text-secondary">Direct</span>
            </h2>
            <p className="text-white/80 mb-6">
              Connecting traditional farmers directly with conscious consumers to provide authentic, naturally grown foods.
            </p>
            <div className="flex space-x-3">
              <motion.a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Youtube className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Shop All Products
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/farmers">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Our Farmers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/our-story">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Our Story
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/our-process">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Our Process
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Contact Us
                  </a>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=Coffee%20%26%20Tea">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Coffee & Tea
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Spices">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Spices
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Grains">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Grains
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Others">
                  <a className="text-white/80 hover:text-secondary transition-colors flex items-center">
                    <span className="mr-2">›</span> Others
                  </a>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="font-heading text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">
                  123 Farm Street, Suite 101<br />
                  Green Valley, CA 94103<br />
                  United States
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                <span className="text-white/80">+1 (800) 555-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                <span className="text-white/80">info@harvestdirect.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div 
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/10 rounded-xl p-8 md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="font-heading text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/80">Get the latest updates, news and special offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center flex-grow gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full sm:flex-grow py-3 px-4 rounded-lg border border-white/20 bg-transparent text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <motion.button 
                className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="pt-8 text-center text-white/60 text-sm">
          <p>© {currentYear} Harvest Direct. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;