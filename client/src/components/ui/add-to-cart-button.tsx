import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@shared/schema";
import { ShoppingBasket, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  showIcon = true,
  fullWidth = false
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product.id, quantity);
    
    // Animation and toast notification
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Added to basket",
        description: `${product.name} has been added to your basket.`,
      });
    }, 500);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`bg-primary hover:bg-primary-dark text-white transition-all duration-200 ${
        isAdding ? "scale-105" : ""
      } ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={isAdding}
    >
      {showIcon && <Plus className="mr-2 h-4 w-4" />}
      Add to Basket
    </Button>
  );
}
