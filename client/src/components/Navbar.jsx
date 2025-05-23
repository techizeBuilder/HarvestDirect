import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [location] = useLocation();

  useEffect(() => {
    // Get cart data from localStorage or API
    try {
      fetch('/api/cart')
        .then(response => response.json())
        .then(data => {
          setCartItemCount(data.totalItems || 0);
        })
        .catch(error => {
          console.error('Error fetching cart:', error);
        });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }

    // Handle scroll events to change navbar appearance
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/our-process', label: 'Our Process' },
    { href: '/contact', label: 'Contact' }
  ];

  // Animation variants
  const navbarVariants = {
    top: { 
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      height: '80px'
    },
    scrolled: { 
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px -1px rgba(0, 0, 0, 0.1)',
      height: '70px'
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    },
    open: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };

  const searchPanelVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0
    },
    open: {
      opacity: 1,
      y: 0,
      height: 'auto'
    }
  };

  return (
    <header className="fixed w-full z-50">
      {/* Main Navigation */}
      <motion.nav 
        className="transition-all duration-300"
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={navbarVariants}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              className="font-heading text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Harvest<span className="text-primary">Direct</span>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
              >
                <motion.a 
                  className={`font-medium transition-colors hover:text-primary ${
                    location === link.href ? 'text-primary' : 'text-forest'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div 
                      className="h-1 bg-primary mt-1 rounded-full"
                      layoutId="nav-underline"
                    />
                  )}
                </motion.a>
              </Link>
            ))}
          </div>

          {/* Nav Action Icons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-forest rounded-full hover:bg-gray-100"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Wishlist Icon - Desktop Only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-forest rounded-full hover:bg-gray-100 hidden md:flex"
            >
              <Heart className="h-5 w-5" />
            </motion.button>

            {/* Account Icon - Desktop Only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-forest rounded-full hover:bg-gray-100 hidden md:flex"
            >
              <User className="h-5 w-5" />
            </motion.button>

            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-forest rounded-full hover:bg-gray-100 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <motion.div 
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  {cartItemCount}
                </motion.div>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-forest rounded-full hover:bg-gray-100 block lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Search Panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="w-full bg-white shadow-md py-4"
            initial="closed"
            animate="open"
            exit="closed"
            variants={searchPanelVariants}
          >
            <div className="container mx-auto px-4">
              <div className="relative max-w-3xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Search for products, farmers..." 
                  className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="lg:hidden bg-white shadow-md"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="container mx-auto px-4 py-5 divide-y divide-gray-100">
              <nav className="grid gap-y-6 py-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                  >
                    <a className={`font-medium text-lg ${
                      location === link.href ? 'text-primary' : 'text-forest'
                    }`}>
                      {link.label}
                    </a>
                  </Link>
                ))}
              </nav>
              
              <div className="py-4 flex flex-col gap-4">
                <a href="#" className="flex items-center text-forest font-medium">
                  <User className="h-5 w-5 mr-3" />
                  My Account
                </a>
                <a href="#" className="flex items-center text-forest font-medium">
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;