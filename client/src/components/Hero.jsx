import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
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
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/175753/pexels-photo-175753.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')" 
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-3xl text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="font-heading text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Farm-Fresh Products <br />
            <span className="text-secondary">Delivered</span> To Your Door
          </motion.h1>

          <motion.p 
            className="text-lg mb-8 text-gray-200"
            variants={itemVariants}
          >
            Experience the exceptional taste of traditionally grown foods, direct from our partner farmers with no middlemen.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Link href="/products">
              <motion.button 
                className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-md transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
            </Link>
            <Link href="/our-story">
              <motion.button 
                className="px-8 py-3 bg-transparent hover:bg-white/20 text-white border border-white font-semibold rounded-md transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Story
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            delay: 1.5,
            duration: 0.5
          } 
        }}
      >
        <motion.div 
          className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center"
          animate={{ 
            y: [0, 10, 0],
            transition: {
              repeat: Infinity,
              duration: 2
            }
          }}
        >
          <svg 
            className="w-4 h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;