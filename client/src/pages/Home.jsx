import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Star, ShoppingBag, ArrowDownRight } from 'lucide-react';
import { Link } from 'wouter';

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Mock data for initial render - will be replaced with actual API data
  const featuredProducts = [
    {
      id: 1,
      name: "Mountain Coffee Beans",
      description: "Premium arabica coffee beans grown at high altitude",
      price: 18.99,
      imageUrl: "https://images.pexels.com/photos/4820812/pexels-photo-4820812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      id: 2,
      name: "Organic Black Pepper",
      description: "Hand-picked and sun-dried for maximum flavor",
      price: 12.49,
      imageUrl: "https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      id: 3,
      name: "Premium Cardamom",
      description: "Aromatic green cardamom pods from the highland forests",
      price: 14.99,
      imageUrl: "https://images.pexels.com/photos/6060121/pexels-photo-6060121.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      id: 4,
      name: "Organic Turmeric",
      description: "Vibrant, high-curcumin turmeric grown without chemicals",
      price: 9.99,
      imageUrl: "https://images.pexels.com/photos/4198364/pexels-photo-4198364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah K.",
      title: "Coffee Enthusiast",
      content: "The coffee beans from Harvest Direct have transformed my morning routine. The flavor is so vibrant and complex compared to store-bought options. I can truly taste the care that goes into growing these beans.",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      rating: 5
    },
    {
      id: 2,
      name: "Michael T.",
      title: "Home Chef",
      content: "As someone who takes cooking seriously, I've tried spices from many sources. The black pepper and cardamom from Harvest Direct are in a league of their own - so fresh and aromatic that I've cut my usage in half.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      rating: 5
    },
    {
      id: 3,
      name: "Priya N.",
      title: "Wellness Advocate",
      content: "Finding turmeric that's actually potent is so difficult. This is the first time I've used turmeric where I can actually feel the difference. Plus, knowing it's grown without chemicals gives me peace of mind.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      rating: 5
    }
  ];
  
  const featuredFarmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      specialty: "Coffee & Spices",
      location: "Western Ghats, India",
      story: "Third-generation coffee farmer using traditional methods passed down through his family",
      imageUrl: "https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      id: 2,
      name: "Elena Morales",
      specialty: "Coffee & Cacao",
      location: "Sierra Nevada, Colombia",
      story: "Leading her community in sustainable farming practices that protect the local ecosystem",
      imageUrl: "https://images.pexels.com/photos/5528995/pexels-photo-5528995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
  ];
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="bg-[#fafbfd]">
      {/* Hero Section - Modern, Clean Design */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fc] to-[#e8f0fa] z-0"></div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:pr-8"
            >
              <span className="inline-block text-primary font-semibold mb-4 uppercase tracking-wider text-sm">Farm to Table Goodness</span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
                <span className="block">Authentic Products</span>
                <span className="block">
                  From <span className="text-primary">Traditional Farmers</span>
                </span>
              </h1>
              <p className="text-lg text-olive mb-8 max-w-lg">
                Experience the pure taste of naturally grown products delivered directly from farmers who follow time-honored growing methods.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="/products" 
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.a>
                <motion.a 
                  href="/our-story" 
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-forest text-forest font-semibold rounded-md hover:bg-forest/5 transition duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Our Story
                </motion.a>
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-forest text-sm font-medium text-center">Chemical-Free</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-forest text-sm font-medium text-center">Fair Pricing</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-forest text-sm font-medium text-center">Eco-Friendly</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative">
                {/* Main image */}
                <img 
                  src="https://images.pexels.com/photos/4198808/pexels-photo-4198808.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                  alt="Farmer harvesting coffee beans" 
                  className="rounded-xl shadow-2xl w-full h-auto z-10 relative"
                />
                
                {/* Background elements */}
                <div className="absolute -top-6 -right-6 w-48 h-48 bg-secondary/10 rounded-full z-0"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
                
                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-10 -left-10 bg-white rounded-lg shadow-xl p-4 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} fill="currentColor" className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-medium text-forest text-sm">
                      1200+ Happy Customers
                    </span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -top-8 right-8 bg-white rounded-lg shadow-xl p-3 z-20"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="block text-xs text-olive">Products</span>
                      <span className="font-medium text-forest text-sm">
                        100% Natural
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Curved separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Feature Cards - Modern Approach */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold mb-2 uppercase tracking-wider text-sm">Why Choose Us</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4">
              Beyond Organic
            </h2>
            <p className="text-olive max-w-2xl mx-auto">
              We connect you directly with farmers who follow traditional methods that go beyond modern organic standards, resulting in exceptional quality and flavor.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ),
                title: "Traditional Growing Methods",
                description: "Our partner farmers use time-tested techniques passed down through generations, working in harmony with natural cycles."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                ),
                title: "Chemical-Free Guarantee",
                description: "All our products are grown without chemical pesticides, fertilizers, or preservatives, just as nature intended."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                ),
                title: "Direct Farmer Relationships",
                description: "We work directly with farmers, paying fair prices that recognize their expertise and dedication to quality."
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-forest text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-olive mb-4">{feature.description}</p>
                <a href="/our-process" className="inline-flex items-center text-primary font-medium hover:underline">
                  Learn more 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products - Clean Grid Layout */}
      <section className="py-16 bg-background relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <motion.div 
              className="max-w-lg mr-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-primary font-semibold mb-2 uppercase tracking-wider text-sm">Featured Products</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4">
                Traditionally Grown Goodness
              </h2>
              <p className="text-olive">
                Discover our most popular products, each with a story of traditional farming methods and exceptional quality.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/products">
                <a className="inline-flex items-center justify-center px-6 py-3 border border-forest text-forest font-semibold rounded-md hover:bg-forest/5 transition duration-300">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                variants={staggerItem}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Link href={`/products/${product.id}`}>
                    <a className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-forest font-medium py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-forest hover:text-white">
                      View Details
                    </a>
                  </Link>
                </div>
                <div className="p-5">
                  <Link href={`/products/${product.id}`}>
                    <a className="block">
                      <h3 className="font-heading text-forest text-xl font-semibold mb-2 hover:text-primary transition-colors">{product.name}</h3>
                    </a>
                  </Link>
                  <p className="text-olive text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-forest font-bold">${product.price.toFixed(2)}</span>
                    <button 
                      className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-full flex items-center justify-center text-primary hover:text-white transition-colors"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Farmers Section - Modern Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold mb-2 uppercase tracking-wider text-sm">Meet Our Farmers</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4">
              The Heroes Behind Your Food
            </h2>
            <p className="text-olive max-w-2xl mx-auto">
              Get to know the dedicated farmers who grow your food using traditional methods passed down through generations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredFarmers.map((farmer, index) => (
              <motion.div 
                key={farmer.id}
                className="bg-background rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="md:w-2/5 relative">
                  <img 
                    src={farmer.imageUrl} 
                    alt={farmer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-primary text-white text-xs font-bold py-1 px-3">
                    {farmer.specialty}
                  </div>
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-1">{farmer.name}</h3>
                    <p className="text-sm text-primary mb-3">{farmer.location}</p>
                    <p className="text-olive mb-4">{farmer.story}</p>
                  </div>
                  <Link href={`/farmers/${farmer.id}`}>
                    <a className="inline-flex items-center text-primary font-medium hover:underline self-start">
                      Read full story
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/farmers">
              <a className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition duration-300">
                Meet All Our Farmers
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials - Clean Design */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold mb-2 uppercase tracking-wider text-sm">Customer Stories</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-4">
              What Our Customers Say
            </h2>
            <p className="text-olive max-w-2xl mx-auto">
              Hear from people who have experienced the difference that traditionally grown products make.
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="min-w-full px-4"
                  >
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row items-center mb-6">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                        />
                        <div>
                          <div className="flex mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} fill="currentColor" className="h-5 w-5 text-yellow-400" />
                            ))}
                          </div>
                          <h3 className="font-heading text-forest text-xl font-semibold">{testimonial.name}</h3>
                          <p className="text-primary">{testimonial.title}</p>
                        </div>
                        <div className="ml-auto hidden md:block">
                          <svg className="w-16 h-16 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-olive text-lg italic mb-6">"{testimonial.content}"</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeTestimonial === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA - Modern Design */}
      <section className="py-16 bg-forest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Experience the Difference of Traditionally Grown Products
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Taste the difference that comes from food grown with care using time-honored methods. Shop our collection today and discover what you've been missing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a 
                href="/products" 
                className="px-8 py-3.5 bg-white text-forest font-semibold rounded-md hover:bg-gray-100 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.a>
              <motion.a 
                href="/contact" 
                className="px-8 py-3.5 border border-white text-white font-semibold rounded-md hover:bg-white/10 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter - Clean, Modern */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block text-primary font-semibold mb-2 uppercase tracking-wider text-sm">Stay Connected</span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-forest mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-olive mb-6">
                  Get updates on new products, seasonal harvests, and exclusive offers directly to your inbox.
                </p>
                
                <div className="flex items-start flex-col sm:flex-row sm:items-center gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full sm:w-auto sm:flex-1 py-3 px-4 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                  <motion.button 
                    className="w-full sm:w-auto py-3 px-6 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
                <p className="text-olive/70 text-sm mt-3">
                  By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
                </p>
              </motion.div>
              
              <motion.div
                className="relative hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img 
                  src="https://images.pexels.com/photos/4911711/pexels-photo-4911711.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                  alt="Seasonal harvest" 
                  className="w-full h-auto rounded-lg object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md py-2 px-3">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-forest">
                      Fresh Updates
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;