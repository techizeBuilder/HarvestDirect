import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cart from "./Cart";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Check if current route is home to manage full-width layout
  const isHome = location === "/";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Cart />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
