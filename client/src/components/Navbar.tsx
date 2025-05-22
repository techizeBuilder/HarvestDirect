import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingBasket, 
  Menu, 
  X
} from "lucide-react";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems, openCart } = useCart();
  const [location] = useLocation();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showSearch) setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showMobileMenu) setShowMobileMenu(false);
  };

  const navLinks = [
    { href: "/our-story", label: "Our Story" },
    { href: "/products", label: "Products" },
    { href: "/farmers", label: "Our Farmers" },
    { href: "/our-process", label: "Our Process" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <header>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 bg-background/90 backdrop-blur-sm ${
          scrolled ? "py-2 shadow-md" : "py-3 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-forest font-heading text-2xl font-bold">
              Harvest<span className="text-primary">Direct</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest hover:text-primary font-medium transition duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch} 
              className="text-forest hover:text-primary hover:bg-transparent"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openCart} 
              className="text-forest hover:text-primary hover:bg-transparent relative"
            >
              <ShoppingBasket className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="lg:hidden text-forest hover:text-primary hover:bg-transparent"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-background absolute w-full py-4 px-6 shadow-md">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-forest hover:text-primary font-medium py-2 transition duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className="bg-background absolute w-full py-4 px-6 shadow-md">
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 rounded-full border border-border/30 focus:border-primary"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
