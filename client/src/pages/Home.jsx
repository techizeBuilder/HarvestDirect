import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import FeaturedFarmers from '../components/FeaturedFarmers';
import Testimonials from '../components/Testimonials';

const Home = () => {
  // Handle scroll animations
  useEffect(() => {
    // Function to handle scroll animations
    const handleScrollAnimation = () => {
      const scrollElements = document.querySelectorAll('.scroll-animation');
      
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate');
        }
      });
    };
    
    // Initial check
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  // Journey section with animated items
  const StorySection = () => {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary font-medium">Our Journey</span>
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mt-2 mb-4">
              From Farm to Your Table
            </h2>
            <p className="text-olive text-lg">
              Experience the journey our products take from traditional farms to your home, preserving quality and taste at every step.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <motion.div 
              className="scroll-animation bg-background rounded-xl p-8 shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/10 rounded-full" />
              <div className="absolute right-12 top-16 w-8 h-8 bg-secondary/20 rounded-full" />
              
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-2xl">1</span>
              </div>
              
              <h3 className="font-heading text-forest text-xl font-bold mb-4">
                Sustainable Harvesting
              </h3>
              
              <p className="text-olive relative z-10">
                Our farmers follow traditional techniques that preserve soil health and biodiversity, harvesting only when produce reaches optimal ripeness.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              className="scroll-animation bg-background rounded-xl p-8 shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/10 rounded-full" />
              <div className="absolute right-12 top-16 w-8 h-8 bg-secondary/20 rounded-full" />
              
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-2xl">2</span>
              </div>
              
              <h3 className="font-heading text-forest text-xl font-bold mb-4">
                Traditional Processing
              </h3>
              
              <p className="text-olive relative z-10">
                Products are processed using time-honored methods that maximize flavor and nutritional content, often within hours of harvesting.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              className="scroll-animation bg-background rounded-xl p-8 shadow-md relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 bg-primary/10 rounded-full" />
              <div className="absolute right-12 top-16 w-8 h-8 bg-secondary/20 rounded-full" />
              
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-2xl">3</span>
              </div>
              
              <h3 className="font-heading text-forest text-xl font-bold mb-4">
                Direct Delivery
              </h3>
              
              <p className="text-olive relative z-10">
                We ship directly to you, cutting out middlemen and ensuring that the exceptional quality and flavors reach your table intact.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex justify-center scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a 
              href="/our-process" 
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Learn more about our process
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    );
  };

  // Banner section
  const BannerSection = () => {
    return (
      <section className="py-16 bg-forest text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="3" height="3" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-7/12 px-4 mb-8 lg:mb-0">
              <motion.h2 
                className="font-heading text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Authentic Flavors Preserved Through Generations
              </motion.h2>
              <motion.p 
                className="text-white/80 text-lg mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Experience the taste of foods grown with traditional knowledge and respect for the earth. Every purchase supports farmer families and preserves cultural heritage.
              </motion.p>
              <motion.a 
                href="/our-story"
                className="inline-block px-8 py-3 bg-white text-forest font-semibold rounded-md hover:bg-secondary hover:text-white transition-colors duration-300"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read Our Story
              </motion.a>
            </div>
            
            <div className="w-full lg:w-5/12 px-4">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="https://images.pexels.com/photos/4871119/pexels-photo-4871119.jpeg" 
                  alt="Traditional Farmer" 
                  className="rounded-lg shadow-2xl relative z-10 w-full"
                />
                <div className="absolute inset-0 -m-6 bg-secondary rounded-lg z-0"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Newsletter section
  const NewsletterSection = () => {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-12 flex items-center">
                <div>
                  <h3 className="font-heading text-forest text-2xl lg:text-3xl font-bold mb-4">
                    Stay Connected
                  </h3>
                  <p className="text-olive mb-6">
                    Join our newsletter to get updates on seasonal harvests, farmer stories, and exclusive offers.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consent"
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="consent" className="ml-2 text-sm text-olive">
                        I agree to receive email updates from Harvest Direct
                      </label>
                    </div>
                    <motion.button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-md w-full hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Subscribe Now
                    </motion.button>
                  </form>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <img
                  src="https://images.pexels.com/photos/5912934/pexels-photo-5912934.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                  alt="Farmer holding basket of fresh produce"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <StorySection />
      <FeaturedFarmers />
      <BannerSection />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
};

export default Home;