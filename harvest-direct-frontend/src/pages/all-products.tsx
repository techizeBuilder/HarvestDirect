import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, ArrowRight, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCategory, Product } from "@shared/schema";
import { useAnimations } from "@/hooks/use-animations";
import { cn, debounce } from "@/lib/utils";

// Custom hook for URL search params
const useSearchParams = () => {
  const [location] = useLocation();
  return new URLSearchParams(location.split("?")[1] || "");
};

export default function AllProducts() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all products
  const { data: allProducts = [], isLoading } = useQuery({ 
    queryKey: ['/api/products'] 
  });
  
  // Set up animations
  const { setupScrollAnimation } = useAnimations();
  
  useEffect(() => {
    setupScrollAnimation();
  }, []);
  
  // Filter products
  const filteredProducts = allProducts.filter((product: Product) => {
    // Filter by search query
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // Filter by price range
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Categories for filter
  const categories = [
    { id: "all", name: "All Products", value: null },
    { id: "coffee-tea", name: "Coffee & Tea", value: ProductCategory.COFFEE_TEA },
    { id: "spices", name: "Spices", value: ProductCategory.SPICES },
    { id: "grains", name: "Grains", value: ProductCategory.GRAINS },
    { id: "others", name: "Others", value: ProductCategory.OTHERS }
  ];
  
  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange([0, 20]);
    
    // Reset input field
    const searchInput = document.getElementById("product-search") as HTMLInputElement;
    if (searchInput) searchInput.value = "";
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="animate-pulse space-y-8 w-full">
          <div className="h-10 bg-muted rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-forest text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-olive text-lg max-w-2xl mx-auto">
            Explore our complete collection of farm-fresh products, each grown with care using traditional methods. 
            Filter by category to find exactly what you're looking for.
          </p>
        </div>
        
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex justify-end mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:block overflow-hidden"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-32">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-forest text-xl font-semibold">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-primary hover:text-primary-dark"
                    >
                      Reset All
                    </Button>
                  </div>
                  
                  {/* Search */}
                  <div className="mb-8">
                    <Label htmlFor="product-search" className="text-foreground font-medium mb-2 block">
                      Search
                    </Label>
                    <div className="relative">
                      <Input
                        id="product-search"
                        placeholder="Search products..."
                        className="pl-10"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        defaultValue={searchQuery}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-8">
                    <h3 className="text-foreground font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-normal",
                            selectedCategory === category.value
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                          )}
                          onClick={() => setSelectedCategory(category.value)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="text-foreground font-medium mb-3">Price Range</h3>
                    <div className="mb-6">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
                  </p>
                  {/* Could add sorting options here */}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="scroll-animation">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                
                {/* Pagination - would implement with real API */}
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-primary text-white hover:bg-primary-dark"
                    >
                      1
                    </Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-foreground text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any products matching your criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
