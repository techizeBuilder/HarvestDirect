import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    hover: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="group bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-64">
        <Link href={`/products/${product.id}`}>
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
        </Link>
        
        {/* Quick add to cart button */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
          variants={buttonVariants}
          initial="hidden"
          animate={isHovered ? "hover" : "hidden"}
        >
          <motion.button 
            className="w-full py-2 bg-primary text-white font-medium rounded-lg shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            Quick Add
          </motion.button>
        </motion.div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-secondary/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading text-forest font-bold text-lg hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-olive text-sm mt-2 mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-forest font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center text-sm text-olive">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>In stock</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;