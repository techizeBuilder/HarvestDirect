import { Card, CardContent } from "@/components/ui/card";
import { Farmer } from "@shared/schema";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface FarmerCardProps {
  farmer: Farmer;
}

export default function FarmerCard({ farmer }: FarmerCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-full">
        <img 
          src={farmer.imageUrl} 
          alt={farmer.name} 
          className="w-full h-64 object-cover"
        />
        <CardContent className="p-6">
          <h3 className="font-heading text-forest text-xl font-bold mb-2">{farmer.name}</h3>
          <p className="text-secondary font-medium mb-3">{farmer.specialty}</p>
          <p className="text-olive mb-4">"{farmer.story}"</p>
          <div className="flex items-center text-sm text-olive">
            <MapPin className="text-secondary mr-2 h-4 w-4" />
            <span>{farmer.location}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
