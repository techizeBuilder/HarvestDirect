import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Cart from './Cart';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Pass these methods and state down to any component that needs them
  const cartContextValue = {
    isCartOpen,
    openCart,
    closeCart
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Make cart accessible to navbar */}
      <Navbar openCart={openCart} />
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cart overlay */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Layout;