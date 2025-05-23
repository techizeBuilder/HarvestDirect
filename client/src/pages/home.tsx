import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedText } from "@/components/ui/animated-text";
import { ParallaxSection } from "@/components/ui/parallax-section";
import ProductCard from "@/components/ProductCard";
import FarmerCard from "@/components/FarmerCard";
import ProcessStep from "@/components/ProcessStep";
import Testimonial from "@/components/Testimonial";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAnimations } from "@/hooks/use-animations";
import { ChevronDown, Leaf, Truck, Sprout, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const newsletterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function Home() {
  // Get products and farmers data
  const { data: products = [] } = useQuery({ 
    queryKey: ['/api/products/featured'] 
  });
  
  const { data: farmers = [] } = useQuery({ 
    queryKey: ['/api/farmers/featured'] 
  });
  
  const { data: testimonials = [] } = useQuery({ 
    queryKey: ['/api/testimonials'] 
  });

  // Animation controller for scroll animations
  const { setupScrollAnimation } = useAnimations();

  // Category buttons state
  const categoryButtons = [
    { id: "all", label: "All Products" },
    { id: "coffee-tea", label: "Coffee & Tea" },
    { id: "spices", label: "Spices" },
    { id: "grains", label: "Grains" },
    { id: "others", label: "Others" }
  ];
  
  // Set up scroll animations
  useEffect(() => {
    setupScrollAnimation();
  }, []);
  
  // Newsletter form
  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      name: '',
      email: '',
      agreedToTerms: false
    }
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      await apiRequest('POST', '/api/newsletter/subscribe', data);
      toast({
        title: "Subscription successful!",
        description: "Thank you for joining our community.",
      });
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Ultra Modern Hero Section with Video and Grid Layout */}
      <section className="relative min-h-screen overflow-hidden">
        {/* High-quality Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-farm-worker-carrying-a-basket-of-vegetables-28107-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Grid Overlay Pattern */}
        <div className="absolute inset-0 z-5 opacity-30 mix-blend-soft-light">
          <div className="h-full w-full" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0V40M40 0V40M0 0H40M0 40H40' stroke='%23E9E2D0' stroke-width='0.5' stroke-opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Noise Texture Overlay for depth */}
        <div className="absolute inset-0 z-5 opacity-10 mix-blend-overlay" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover'
        }}></div>
        
        {/* Color Gradient Overlays for visual interest */}
        <div className="absolute inset-0 z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-cream/30 via-cream/10 to-transparent"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-forest/50 via-forest/20 to-transparent"
          ></motion.div>
        </div>
        
        {/* Main Content Container */}
        <div className="container mx-auto relative z-20 h-screen flex flex-col">
          {/* Hero Content Grid - Full Height */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-16">
            
            {/* Left Side Content (Main Headline and CTA) - 7 columns on lg */}
            <div className="lg:col-span-7 text-white text-center lg:text-left px-4 lg:px-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto lg:mx-0"
              >
                {/* Staggered Entrance Animation for Headline */}
                <div className="overflow-hidden mb-4">
                  <motion.h1 
                    className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <span className="block text-white">Harvest</span>
                    <span className="block text-secondary">Pure</span> 
                    <span className="block text-white">Taste</span>
                    <span className="block text-secondary">Natural</span>
                  </motion.h1>
                </div>
                
                {/* Description with staggered entrance */}
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl mt-6 mb-8 text-cream/90 max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Experience authentic flavors from traditional farmers who preserve ancient growing methods.
                </motion.p>
                
                {/* Button Group */}
                <motion.div 
                  className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                >
                  <Link href="/all-products">
                    <motion.div 
                      whileHover={{ scale: 1.05, backgroundColor: "#D4A24C" }} 
                      whileTap={{ scale: 0.98 }}
                      className="bg-secondary text-white font-semibold py-4 px-8 rounded-md transition-all duration-300"
                    >
                      Shop Products
                    </motion.div>
                  </Link>
                  
                  <Link href="/farmers">
                    <motion.div 
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }} 
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-cream/60 text-cream hover:text-white font-semibold py-4 px-8 rounded-md transition-all duration-300"
                    >
                      Meet Our Farmers
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Animated Stats Row */}
              <motion.div 
                className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.div 
                  className="text-center lg:text-left"
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <p className="text-secondary text-3xl md:text-4xl font-bold">100%</p>
                  <p className="text-cream/80 text-sm md:text-base">Natural</p>
                </motion.div>
                
                <motion.div 
                  className="text-center lg:text-left"
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <p className="text-secondary text-3xl md:text-4xl font-bold">50+</p>
                  <p className="text-cream/80 text-sm md:text-base">Farmer Families</p>
                </motion.div>
                
                <motion.div 
                  className="text-center lg:text-left"
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <p className="text-secondary text-3xl md:text-4xl font-bold">0</p>
                  <p className="text-cream/80 text-sm md:text-base">Preservatives</p>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right Side Content (Product Card) - 5 columns on lg */}
            <div className="lg:col-span-5 px-4 lg:px-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1,
                  ease: "easeOut" 
                }}
                className="relative max-w-sm mx-auto"
              >
                {/* Floating circle decorations */}
                <motion.div 
                  className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-r from-secondary/30 to-cream/40 blur-md z-0" 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 0.9, 0.7]
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                ></motion.div>
                <motion.div 
                  className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-l from-primary/30 to-secondary/30 blur-md z-0" 
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                ></motion.div>
                
                {/* Product Card */}
                <motion.div
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 relative z-10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className="w-20 h-20 rounded-full overflow-hidden bg-secondary/10 flex-shrink-0 border-2 border-secondary/20"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                        alt="Coffee beans" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="font-heading text-forest text-xl font-bold"
                        whileHover={{ color: "#D4A24C", transition: { duration: 0.2 } }}
                      >
                        Mountain Coffee
                      </motion.h3>
                      
                      {/* Label */}
                      <div className="inline-flex items-center bg-secondary/10 text-secondary text-xs rounded-full px-2 py-1 mt-1">
                        <Leaf className="h-3 w-3 mr-1" />
                        <span>Chemical-Free</span>
                      </div>
                      
                      <p className="text-forest/80 text-sm mt-2">Hand-picked arabica beans from 5000ft elevation</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <motion.span 
                      className="text-forest text-2xl font-bold"
                      whileHover={{ scale: 1.1, color: "#D4A24C", transition: { duration: 0.2 } }}
                    >
                      $12.50
                    </motion.span>
                    <Link href="/products/1">
                      <motion.div 
                        whileHover={{ scale: 1.05, backgroundColor: "#254D3A" }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-white font-medium py-2 px-4 rounded-md"
                      >
                        View Details
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 1.5, duration: 0.8 }
            }}
          >
            <Link href="#story">
              <motion.div 
                className="text-white bg-black/30 p-3 rounded-full backdrop-blur-sm hover:bg-secondary/50 transition-all duration-300 cursor-pointer"
                animate={{ 
                  y: [0, 10, 0],
                  transition: { 
                    y: {
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.2, 
                  backgroundColor: "rgba(212, 162, 76, 0.5)",
                  transition: { duration: 0.2 } 
                }}
              >
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section id="story" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-olive text-lg">
              We connect you directly with farmers who've dedicated their lives to growing the purest, most flavorful products using sustainable, traditional methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="scroll-animation">
              <img 
                src="https://pixabay.com/get/g029f60e084e024e3524c1cfb27f9a43717992ed4217a153c0fdc38fae80d598a70bf61b03e6daf57f560ee774e36db2bd1ac01dafb890a0141ef0d6a13ad355f_1280.jpg" 
                alt="Farmer harvesting coffee beans" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div className="scroll-animation">
              <h3 className="font-heading text-forest text-2xl md:text-3xl font-semibold mb-4">Celebrating Our Farmers</h3>
              <p className="text-olive mb-4">
                For generations, these dedicated men and women have cultivated the earth using knowledge passed down through families. Their hands tell stories of hard work, persistence, and deep respect for nature.
              </p>
              <p className="text-olive mb-6">
                Without chemical pesticides or artificial enhancers, they grow foods with authentic flavors and natural goodness that factory farming simply cannot replicate.
              </p>
              <div className="flex flex-wrap items-center">
                <div className="mr-4 mb-4">
                  <span className="block text-secondary text-3xl font-bold">24+</span>
                  <span className="text-olive text-sm">Partner Farms</span>
                </div>
                <div className="h-10 w-px bg-olive/20 mx-4 hidden md:block"></div>
                <div className="mx-4 mb-4">
                  <span className="block text-secondary text-3xl font-bold">100%</span>
                  <span className="text-olive text-sm">Chemical-Free</span>
                </div>
                <div className="h-10 w-px bg-olive/20 mx-4 hidden md:block"></div>
                <div className="ml-4 mb-4">
                  <span className="block text-secondary text-3xl font-bold">8+</span>
                  <span className="text-olive text-sm">Product Categories</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 scroll-animation">
              <h3 className="font-heading text-forest text-2xl md:text-3xl font-semibold mb-4">From Soil to Soul</h3>
              <p className="text-olive mb-4">
                Every product in our collection has a story. It begins in the rich soil of family farms, where generations of agricultural wisdom merge with sustainable practices.
              </p>
              <p className="text-olive mb-6">
                We bypass middlemen to ensure farmers receive fair compensation for their remarkable work while delivering exceptionally fresh products to your doorstep.
              </p>
              <Link href="#process">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold transition duration-300">
                  Learn About Our Process
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2 scroll-animation">
              <img 
                src="https://pixabay.com/get/g3c7fce4bad5822c4fe6acb44660b5b0f67c5325b8e6c3ce7d9c0352c57d0cfbbc78922c99a72e5f47ab0e0b233260e81d089393c565f4bca758d16861eda3ef3_1280.jpg" 
                alt="Traditional farming methods" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Showcase */}
      <section id="products" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-olive text-lg">
              Explore our collection of premium farm-fresh products, each grown with care and harvested at peak ripeness.
            </p>
          </div>
          
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 scroll-animation">
            {categoryButtons.map((button, index) => (
              <Button
                key={button.id}
                variant="ghost"
                className={`category-btn ${index === 0 ? 'active' : ''} px-5 py-2 rounded-full font-medium transition duration-200`}
              >
                {button.label}
              </Button>
            ))}
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="scroll-animation">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-3 rounded-md transition duration-300">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Parallax Quote Section */}
      <ParallaxSection 
        backgroundUrl="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
        className="py-28"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-accent text-cream text-3xl md:text-4xl mb-6">
              "The care of the earth is our most ancient and most worthy responsibility."
            </p>
            <p className="text-white text-lg">— Traditional Farming Wisdom</p>
          </div>
        </div>
      </ParallaxSection>
      
      {/* Meet Our Farmers */}
      <section id="farmers" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Meet Our Farmers</h2>
            <p className="text-olive text-lg">
              The passionate individuals whose expertise and dedication bring you nature's finest bounty, cultivated with care and respect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmers.map((farmer) => (
              <div key={farmer.id} className="scroll-animation">
                <FarmerCard farmer={farmer} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/farmers">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-3 rounded-md transition duration-300">
                Meet All Our Farmers
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Our Process Section */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Process</h2>
            <p className="text-olive text-lg">
              From seed to harvest to your doorstep, discover how we maintain quality and sustainability at every step.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scroll-animation">
              <ProcessStep
                number={1}
                title="Sustainable Cultivation"
                description="Our partner farmers use traditional, chemical-free methods that preserve soil health and biodiversity. Many practice polyculture, growing multiple crops that support each other naturally."
              />
            </div>
            
            <div className="scroll-animation">
              <ProcessStep
                number={2}
                title="Careful Harvesting"
                description="Products are harvested by hand at peak ripeness to ensure optimal flavor and nutritional value. This careful approach preserves quality that mechanical harvesting can't match."
              />
            </div>
            
            <div className="scroll-animation">
              <ProcessStep
                number={3}
                title="Traditional Processing"
                description="Using time-tested methods like sun-drying and small-batch processing, our farmers preserve the natural characteristics of each product without artificial additives or preservatives."
              />
            </div>
            
            <div className="scroll-animation">
              <ProcessStep
                number={4}
                title="Quality Control"
                description="Every batch is carefully inspected for quality and authenticity. We verify that products meet our strict standards for flavor, appearance, and purity before packaging."
              />
            </div>
            
            <div className="scroll-animation">
              <ProcessStep
                number={5}
                title="Sustainable Packaging"
                description="Our products are packaged in eco-friendly materials that preserve freshness while minimizing environmental impact. We're constantly improving our packaging to reduce waste."
              />
            </div>
            
            <div className="scroll-animation">
              <ProcessStep
                number={6}
                title="Direct Delivery"
                description="We ship directly from farms to your doorstep, minimizing handling and ensuring maximum freshness. This direct approach also ensures farmers receive fair compensation for their work."
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Journey Map */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">From Farm to Your Table</h2>
            <p className="text-olive text-lg">
              Trace the journey of our products from the farms where they're grown to your doorstep.
            </p>
          </div>
          
          <div className="relative scroll-animation">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 relative">
              <div className="w-full h-[30rem] bg-background/50 rounded-lg flex items-center justify-center mb-8">
                {/* Placeholder for the interactive map */}
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 800 600" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="p-4"
                >
                  <path d="M400 50C450 200 600 250 700 300" stroke="#DDA15E" strokeWidth="3" strokeDasharray="10 5"/>
                  <path d="M400 50C350 200 200 250 100 300" stroke="#DDA15E" strokeWidth="3" strokeDasharray="10 5"/>
                  <path d="M100 300C200 350 300 400 400 500" stroke="#5A6F43" strokeWidth="3" strokeDasharray="10 5"/>
                  <path d="M700 300C600 350 500 400 400 500" stroke="#5A6F43" strokeWidth="3" strokeDasharray="10 5"/>
                  
                  {/* Farm locations */}
                  <circle cx="400" cy="50" r="20" fill="#606C38"/>
                  <circle cx="700" cy="300" r="15" fill="#DDA15E"/>
                  <circle cx="100" cy="300" r="15" fill="#DDA15E"/>
                  <circle cx="400" cy="500" r="20" fill="#BC4749"/>
                  
                  {/* Labels */}
                  <text x="400" y="40" textAnchor="middle" fill="#283618" fontFamily="Mulish" fontSize="12">Central Processing</text>
                  <text x="700" y="290" textAnchor="middle" fill="#283618" fontFamily="Mulish" fontSize="12">Highland Farms</text>
                  <text x="100" y="290" textAnchor="middle" fill="#283618" fontFamily="Mulish" fontSize="12">Lowland Farms</text>
                  <text x="400" y="530" textAnchor="middle" fill="#283618" fontFamily="Mulish" fontSize="12">Your Home</text>
                </svg>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="text-secondary text-3xl" />
                  </div>
                  <h3 className="font-heading text-forest text-xl font-semibold mb-2">24+ Partner Farms</h3>
                  <p className="text-olive">Family-owned farms across diverse regions, each with unique growing conditions.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="text-secondary text-3xl" />
                  </div>
                  <h3 className="font-heading text-forest text-xl font-semibold mb-2">Direct Shipping</h3>
                  <p className="text-olive">Products travel directly from farms to our central facility to your home.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="text-secondary text-3xl" />
                  </div>
                  <h3 className="font-heading text-forest text-xl font-semibold mb-2">100% Traceability</h3>
                  <p className="text-olive">Each product can be traced back to the exact farm and farmer who grew it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-[#283618] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 scroll-animation">
            <h2 className="font-heading text-[#FEFAE0] text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-white/80 text-lg">Discover why people across the country choose our farm-direct products.</p>
          </div>
          
          <div className="relative max-w-6xl mx-auto scroll-animation">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Testimonial key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
            
            <div className="flex justify-center mt-12 space-x-3">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section id="contact" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden scroll-animation">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image side */}
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900" 
                  alt="Farmer working in terraced fields" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content side */}
              <div className="p-8 md:p-12">
                <h2 className="font-heading text-forest text-3xl font-bold mb-6">Join Our Community</h2>
                <p className="text-olive mb-6">
                  Subscribe to receive seasonal recipes, farmer stories, and exclusive offers on our fresh, farm-direct products.
                </p>
                
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label htmlFor="name" className="block text-forest text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-md border border-olive/20"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-forest text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-md border border-olive/20"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreedToTerms"
                      {...register("agreedToTerms")}
                      className="mt-1"
                    />
                    <label
                      htmlFor="agreedToTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to receive newsletters about products and special offers.
                    </label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="text-destructive text-sm">{errors.agreedToTerms.message}</p>
                  )}
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md transition duration-300">
                    Subscribe Now
                  </Button>
                </form>
                
                <p className="text-olive/70 text-sm mt-6">
                  By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
