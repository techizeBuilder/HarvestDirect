import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Create price ranges
        setPriceRanges([
          { label: 'Under $10', min: 0, max: 10 },
          { label: '$10 - $20', min: 10, max: 20 },
          { label: '$20 - $30', min: 20, max: 30 },
          { label: 'Over $30', min: 30, max: Infinity }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filter criteria change
    filterProducts();
  }, [selectedCategory, selectedPriceRange, searchQuery, products]);
  
  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    if (selectedPriceRange !== 'all') {
      const range = priceRanges.find(range => range.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price <= range.max
        );
      }
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const productVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <div className="pt-32 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-forest text-3xl md:text-5xl font-bold mb-4">
            Our Products
          </h1>
          <p className="text-olive text-lg max-w-2xl mx-auto">
            Discover our collection of traditionally-grown, natural products sourced directly from farmers who take pride in their craft.
          </p>
        </motion.div>
        
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pl-12 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg text-forest font-medium hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="h-5 w-5" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="font-heading text-forest font-semibold text-lg">Filter Products</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-primary flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-forest font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2 px-3 rounded border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-forest font-medium mb-2">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full py-2 px-3 rounded border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="all">All Prices</option>
                    {priceRanges.map(range => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-olive font-medium">Active Filters:</span>
              
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedPriceRange !== 'all' && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
                  {selectedPriceRange}
                  <button onClick={() => setSelectedPriceRange('all')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {searchQuery && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-96 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={productVariants}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-heading text-forest text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-olive mb-6">We couldn't find any products matching your filters.</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
        
        {/* Results Count */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="text-right mt-4 text-sm text-olive">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;