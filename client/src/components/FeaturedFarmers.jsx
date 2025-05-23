import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import FarmerCard from './FarmerCard';

const FeaturedFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch featured farmers from the API
    fetch('/api/farmers/featured')
      .then(response => response.json())
      .then(data => {
        setFarmers(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured farmers:', error);
        setIsLoading(false);
      });
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const headerVariants = {
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

  return (
    <section className="py-20 bg-white overflow-hidden">
      <motion.div 
        className="container mx-auto px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
        >
          <span className="text-secondary font-medium">The People Behind Your Food</span>
          <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mt-2 mb-4">Meet Our Farmers</h2>
          <p className="text-olive max-w-xl mx-auto">
            Traditional farmers who preserve ancient growing methods, producing exceptional food while caring for the earth.
          </p>
        </motion.div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Farmers grid
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {farmers.map((farmer, index) => (
              <FarmerCard key={farmer.id} farmer={farmer} index={index} />
            ))}
          </div>
        )}

        <motion.div 
          className="text-center mt-12"
          variants={headerVariants}
        >
          <Link href="/farmers">
            <motion.button 
              className="px-8 py-3 bg-forest hover:bg-forest/90 text-white font-semibold rounded-md inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Meet All Farmers
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedFarmers;