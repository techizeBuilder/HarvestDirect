import { Card, CardContent } from "@/components/ui/card";
import { Testimonial as TestimonialType } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialProps {
  testimonial: TestimonialType;
}

export default function Testimonial({ testimonial }: TestimonialProps) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(testimonial.rating);
    const hasHalfStar = testimonial.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="fill-secondary text-secondary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-secondary text-secondary" />);
    }

    return stars;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="carousel-item flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-start"
    >
      <Card className="h-full bg-white/10 backdrop-blur-sm rounded-xl p-8">
        <CardContent className="p-0">
          <div className="flex items-center mb-6">
            <div className="flex text-secondary">
              {renderStars()}
            </div>
          </div>
          <p className="text-white/90 mb-6">{testimonial.content}</p>
          <div className="flex items-center">
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <span className="font-semibold text-white">{testimonial.imageInitials}</span>
            </div>
            <div>
              <h4 className="font-semibold text-white">{testimonial.name}</h4>
              <p className="text-white/70 text-sm">{testimonial.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
