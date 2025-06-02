import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Leaf, Shield, Crown } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="product-card bg-cream rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-full">
        <Link href={`/products/${product.id}`}>
          <div className="overflow-hidden h-64">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={product.imageUrl || '/images/products/placeholder.jpg'} 
              onError={(e) => {
                e.currentTarget.src = '/images/products/placeholder.jpg';
              }}
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
        </Link>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-heading text-forest text-xl font-semibold hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <span className="bg-secondary/20 text-secondary-dark px-2 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </span>
          </div>
          <p className="text-olive text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-forest font-bold text-lg">
              ₹{product.price.toFixed(2)}
            </span>
            <AddToCartButton product={product} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
