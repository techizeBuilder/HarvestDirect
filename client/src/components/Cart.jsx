import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

const Cart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch cart data when the component mounts or the cart is opened
    if (isOpen) {
      fetchCartData();
    }
  }, [isOpen]);

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      // If there's cart data with items, set it in state
      if (data && data.items) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await fetch(`/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      
      // Update the local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetch(`/api/cart/items/${productId}`, {
        method: 'DELETE',
      });
      
      // Update the local state by filtering out the removed item
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Animation variants
  const cartVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: {
        ease: 'easeInOut',
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Cart Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-xl z-50 flex flex-col"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-heading text-forest text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                Your Cart
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
            
            {/* Cart Content */}
            <div className="flex-grow overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-olive mt-4">Loading your cart...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="font-heading text-forest text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-olive mb-6">Looks like you haven't added any products to your cart yet.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-md"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product.id}
                      className="flex border-b border-gray-100 pb-4"
                      variants={itemVariants}
                      layout
                    >
                      {/* Product Image */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      
                      {/* Product Details */}
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-heading text-forest font-medium">
                            {item.product.name}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                        
                        <p className="text-sm text-secondary mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-forest"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          
                          <span className="mx-3 text-olive min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-forest"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                          
                          <div className="ml-auto font-medium text-forest">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-olive">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-olive">
                    <span>Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-forest pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition-colors"
                    onClick={onClose}
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ y: -2 }}
                  className="w-full text-center text-olive mt-4"
                  onClick={onClose}
                >
                  Continue Shopping
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;