import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'wouter';
import { Leaf, Shield, Award, MapPin, Star, ChevronLeft, ChevronRight, PlayCircle, Plus, Minus, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  // Add to cart success state
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    // Fetch product data
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        // Fetch product
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        setProduct(productData);
        
        // Fetch farmer
        const farmerRes = await fetch(`/api/farmers/${productData.farmerId}`);
        const farmerData = await farmerRes.json();
        setFarmer(farmerData);
        
        // Fetch related products
        const relatedRes = await fetch(`/api/products/category/${productData.category}`);
        const relatedData = await relatedRes.json();
        // Filter out current product
        setRelatedProducts(relatedData.filter(p => p.id !== productId).slice(0, 4));
        
        // Fetch reviews
        const reviewsRes = await fetch(`/api/products/${productId}/reviews`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchProductData();
    }
  }, [productId]);
  
  // Sample additional images
  const additionalImages = [
    "https://images.unsplash.com/photo-1580933073521-dc49bab0c80d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1585827693631-555a2f10b55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1598526724533-83c05e43a752?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  ];
  
  // Default video
  const videoUrl = "https://www.youtube.com/embed/B1wpUvgZ9ew";
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        }),
      });
      
      if (response.ok) {
        // Show success message
        setAddedToCart(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Previous and next image controls
  const handlePrevImage = () => {
    if (showVideo) {
      setShowVideo(false);
      setActiveImageIndex(additionalImages.length);
      return;
    }
    
    setActiveImageIndex(prev => 
      prev === 0 ? additionalImages.length : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (showVideo) return;
    
    if (activeImageIndex === additionalImages.length) {
      setShowVideo(true);
    } else {
      setActiveImageIndex(prev => 
        prev === additionalImages.length ? 0 : prev + 1
      );
    }
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="pt-40 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!product) {
    return (
      <div className="pt-40 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-forest mb-4">Product Not Found</h1>
          <p className="text-olive mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products">
            <a className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors">
              View All Products
            </a>
          </Link>
        </div>
      </div>
    );
  }
  
  const allImages = [product.imageUrl, ...additionalImages];
  
  return (
    <div className="pt-40 pb-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Back button */}
        <Link href="/products">
          <a className="inline-flex items-center text-olive hover:text-forest mb-8 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Products
          </a>
        </Link>
        
        {/* Product main section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main image display */}
            <div className="relative rounded-xl overflow-hidden bg-white shadow-md aspect-square mb-4">
              <AnimatePresence mode="wait">
                {showVideo ? (
                  <motion.iframe
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={videoUrl}
                    title={`${product.name} video`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <motion.img
                    key={`image-${activeImageIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={allImages[activeImageIndex]}
                    alt={`${product.name} - view ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>
              
              {/* Image navigation buttons */}
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-forest pointer-events-auto"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-forest pointer-events-auto"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <motion.div
                  key={`thumb-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-md overflow-hidden w-20 h-20 flex-shrink-0 border-2 ${
                    activeImageIndex === index && !showVideo 
                      ? 'border-primary' 
                      : 'border-transparent'
                  }`}
                  onClick={() => {
                    setActiveImageIndex(index);
                    setShowVideo(false);
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
              
              {/* Video thumbnail */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer rounded-md overflow-hidden w-20 h-20 flex-shrink-0 border-2 bg-gray-100 flex items-center justify-center ${
                  showVideo ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setShowVideo(true)}
              >
                <PlayCircle className="h-10 w-10 text-primary" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-between mb-3">
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              
              <div className="flex items-center mt-2 sm:mt-0">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-olive">
                  {reviews.length > 0 
                    ? `${averageRating.toFixed(1)} (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
                    : 'No reviews yet'}
                </span>
              </div>
            </div>
            
            {/* Product title */}
            <h1 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="text-2xl font-bold text-secondary mb-4">
              {formatPrice(product.price)}
            </div>
            
            {/* Description */}
            <p className="text-olive mb-6">
              {product.description}
            </p>
            
            {/* Features */}
            <div className="bg-white/50 rounded-lg p-4 mb-6 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <span className="text-forest text-sm font-medium">Natural</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-forest text-sm font-medium">Pesticide-Free</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="text-forest text-sm font-medium">Premium</span>
              </div>
            </div>
            
            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <label className="font-medium text-forest">Quantity:</label>
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-forest"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  
                  <span className="mx-4 font-medium text-forest min-w-[20px] text-center">
                    {quantity}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-forest"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
                
                <span className="text-olive text-sm">
                  {product.stockQuantity} available
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-md font-semibold flex items-center justify-center ${
                  addedToCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-white hover:bg-primary/90'
                } transition-colors`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </div>
            
            {/* Farmer info */}
            {farmer && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center mb-3">
                  <img
                    src={farmer.imageUrl}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-heading text-forest font-semibold">
                      Grown by {farmer.name}
                    </h3>
                    <div className="flex items-center text-sm text-olive">
                      <MapPin className="h-3 w-3 mr-1" />
                      {farmer.location}
                    </div>
                  </div>
                </div>
                <p className="text-olive text-sm italic">
                  "{farmer.story.substring(0, 150)}..."
                </p>
                <Link href={`/farmers/${farmer.id}`}>
                  <a className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                    Learn more about this farmer
                  </a>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mb-20">
          <motion.div
            className="border-b border-gray-200 flex flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button className="text-forest font-medium py-3 px-6 border-b-2 border-primary">
              Description
            </button>
            <button className="text-olive hover:text-forest font-medium py-3 px-6 border-b-2 border-transparent">
              Instructions
            </button>
            <button className="text-olive hover:text-forest font-medium py-3 px-6 border-b-2 border-transparent">
              Shipping
            </button>
          </motion.div>
          
          <motion.div
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading text-forest text-xl font-semibold mb-3">
              Product Details
            </h3>
            <p className="text-olive mb-4">
              {product.description}
            </p>
            <p className="text-olive mb-4">
              Our {product.name} is grown using traditional methods that have been passed down through generations. This product is carefully harvested at peak ripeness and processed to preserve its natural flavors and nutritional benefits.
            </p>
            <p className="text-olive">
              Unlike mass-produced alternatives, our {product.name} is cultivated without chemical pesticides or fertilizers, allowing for authentic flavor development. Each batch is inspected for quality to ensure only the best reaches your table.
            </p>
          </motion.div>
        </div>
        
        {/* Reviews Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-forest text-2xl font-bold mb-8">
            Customer Reviews
          </h2>
          
          {reviews.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <p className="text-olive mb-4">There are no reviews yet for this product.</p>
              <button className="px-6 py-2 bg-secondary/10 text-secondary font-medium rounded-md hover:bg-secondary/20 transition-colors">
                Write the First Review
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="bg-white shadow-sm rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between flex-wrap gap-4 mb-3">
                    <div>
                      <h4 className="font-heading text-forest font-semibold">
                        {review.customerName}
                      </h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-olive">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-olive">{review.reviewText}</p>
                </motion.div>
              ))}
              
              <div className="text-center mt-8">
                <button className="px-6 py-2 bg-primary/10 text-primary font-medium rounded-md hover:bg-primary/20 transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-forest text-2xl font-bold mb-8">
            You Might Also Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md group"
              >
                <Link href={`/products/${relatedProduct.id}`}>
                  <a className="block relative overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-heading text-forest font-semibold group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-olive line-clamp-2 mt-1 mb-2 h-10">
                        {relatedProduct.description}
                      </p>
                      <div className="font-bold text-secondary">
                        {formatPrice(relatedProduct.price)}
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;