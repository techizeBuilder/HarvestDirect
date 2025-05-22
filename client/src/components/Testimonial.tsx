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
      stars.push(<Star key={i} className="fill-secondary text-secondary w-5 h-5" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-secondary text-secondary w-5 h-5" />);
    }

    return stars;
  };

  // Truncate content if too long
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="carousel-item flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
    >
      <Card className="h-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-secondary">
              {renderStars()}
            </div>
          </div>
          <p className="text-white/90 mb-6 flex-grow line-clamp-4 text-sm md:text-base">
            {testimonial.content}
          </p>
          <div className="flex items-center mt-auto pt-4 border-t border-white/10">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm">
              <span className="font-semibold text-white">{testimonial.imageInitials}</span>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm md:text-base">{testimonial.name}</h4>
              <p className="text-white/70 text-xs md:text-sm">{testimonial.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
