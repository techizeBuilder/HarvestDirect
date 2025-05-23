import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch testimonials from the API
    fetch('/api/testimonials')
      .then(response => response.json())
      .then(data => {
        setTestimonials(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching testimonials:', error);
        setIsLoading(false);
      });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="py-20 bg-forestLight/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <svg className="absolute top-0 left-0 w-96 h-96 text-primary/20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M42.5,-69.2C54.6,-60.9,63.5,-47.7,70.5,-33.2C77.4,-18.7,82.5,-2.8,79.1,11.1C75.8,25,64,36.9,51.5,46.5C38.9,56.1,25.6,63.3,11.2,67.2C-3.3,71.1,-18.9,71.7,-32,66.4C-45.1,61.1,-55.8,49.8,-63.9,36.6C-72,23.4,-77.5,8.5,-76,
-5.8C-74.5,-20.1,-65.9,-33.7,-55.2,-44.3C-44.5,-54.9,-31.7,-62.5,-18.3,-69.8C-4.9,-77.2,9,-84.3,22.8,-82.4C36.5,-80.4,50.1,-69.4,42.5,-69.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-96 h-96 text-secondary/20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.3,-76.2C58.9,-69.8,70.1,-56.5,78.2,-41.3C86.3,-26.2,91.3,-9.3,89.8,7.1C88.3,23.4,80.4,39.2,68.8,50.6C57.3,62,42,69.1,26.2,73.6C10.4,78.1,-6,80,-20.8,76.3C-35.6,72.5,-48.8,63.2,-59.2,51.1C-69.6,39,-77.1,24.1,-80.1,7.9C-83,-8.4,-81.3,-26.1,-72.8,-39.6C-64.3,-53.1,-49,-62.4,-34.2,-68.3C-19.4,-74.2,-5.1,-76.6,9.8,-76.5C24.6,-76.3,49.3,-73.5,45.3,-76.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-secondary font-medium">What People Say</span>
          <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mt-2 mb-4">
            Customer Testimonials
          </h2>
          <p className="text-olive max-w-xl mx-auto">
            Read what our customers have to say about their experience with our farm-fresh products and exceptional service.
          </p>
        </motion.div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;