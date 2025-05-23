import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin } from 'lucide-react';

const FarmerCard = ({ farmer, index }) => {
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    },
    hover: {
      y: -10,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4
      }
    }
  };

  // Limit story to a reasonable length
  const limitedStory = farmer.story.length > 120
    ? `${farmer.story.substring(0, 120)}...`
    : farmer.story;

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Farmer Image */}
      <div className="relative overflow-hidden h-64">
        <Link href={`/farmers/${farmer.id}`}>
          <motion.img
            src={farmer.imageUrl}
            alt={farmer.name}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
        </Link>
        
        {/* Specialty Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {farmer.specialty}
          </span>
        </div>
      </div>
      
      {/* Farmer Info */}
      <div className="p-5 flex-grow flex flex-col">
        <Link href={`/farmers/${farmer.id}`}>
          <h3 className="font-heading text-forest text-xl font-bold hover:text-primary transition-colors">
            {farmer.name}
          </h3>
        </Link>
        
        <div className="flex items-center text-sm text-olive mt-2 mb-3">
          <MapPin className="text-secondary mr-2 h-4 w-4" />
          <span>{farmer.location}</span>
        </div>
        
        <p className="text-olive text-sm mt-1 mb-4 flex-grow">
          {limitedStory}
        </p>
        
        <Link href={`/farmers/${farmer.id}`}>
          <motion.button 
            className="w-full py-2 bg-forestLight hover:bg-forest text-white font-medium rounded-lg mt-auto transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Profile
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FarmerCard;