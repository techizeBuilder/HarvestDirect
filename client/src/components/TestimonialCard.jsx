import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial, index }) => {
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
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
    }
  };

  return (
    <motion.div
      className="backdrop-blur-md bg-white/80 rounded-xl shadow-xl p-6 border border-gray-100"
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-4">
          {testimonial.imageInitials}
        </div>
        <div>
          <h4 className="font-heading text-forest font-bold">{testimonial.name}</h4>
          <p className="text-secondary text-sm">{testimonial.title}</p>
        </div>
      </div>
      
      <p className="text-olive italic mb-4">
        "{testimonial.content}"
      </p>
      
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(testimonial.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialCard;