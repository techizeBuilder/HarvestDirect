import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Leaf, Package, Clock, Award, ShieldCheck } from 'lucide-react';

const OurProcess = () => {
  // Scroll animation effect
  useEffect(() => {
    const handleScrollAnimation = () => {
      const scrollElements = document.querySelectorAll('.scroll-animation');
      
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate');
        }
      });
    };
    
    // Initial check
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  return (
    <div className="pt-32 bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/5913367/pexels-photo-5913367.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
              backgroundColor: "rgba(0,0,0,0.4)",
              backgroundBlendMode: "overlay"
            }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            className="font-heading text-white text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Farm-to-Table Process
          </motion.h1>
          <motion.p 
            className="text-white text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How we ensure the highest quality products make it from our partner farms directly to your table with transparency at every step
          </motion.p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">A Different Approach</h2>
            <p className="text-olive text-lg">
              Unlike conventional supply chains with numerous middlemen, our process creates a direct connection between farmers and consumers. This ensures you receive fresher products while farmers earn fair compensation for their dedication to quality.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="scroll-animation"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.pexels.com/photos/5913391/pexels-photo-5913391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Farmer inspecting crop quality" 
                className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
            <motion.div
              className="scroll-animation"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-heading text-forest text-2xl md:text-3xl font-semibold mb-4">Traceable From Seed to Table</h3>
              <p className="text-olive mb-4">
                Every product in our collection can be traced back to the exact farm where it was grown. We believe transparency builds trust and helps you make informed choices about the foods you eat.
              </p>
              <p className="text-olive mb-6">
                When you purchase from Harvest Direct, you're not just buying a product – you're supporting a system that values quality, sustainability, and fair compensation for farmers who are preserving traditional growing methods.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 z-0 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#000"></circle>
            </pattern>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Process Steps</h2>
            <p className="text-olive text-lg">
              From careful partner selection to your doorstep, here's how we ensure quality at every stage.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-1 bg-secondary/30 transform md:-translate-x-1/2 hidden md:block"></div>
            
            {/* Process steps */}
            <div className="space-y-16 md:space-y-0">
              {/* Step 1 */}
              <div className="relative">
                <motion.div 
                  className="md:grid md:grid-cols-2 gap-8 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-right hidden md:block">
                    <h3 className="font-heading text-forest text-2xl font-bold mb-3">1. Farmer Selection & Partnership</h3>
                    <p className="text-olive ml-auto">
                      We carefully select partner farmers based on their commitment to traditional farming methods, product quality, and sustainable practices. Each farm undergoes thorough evaluation before joining our network.
                    </p>
                    <div className="mt-4 flex flex-col items-end space-y-2">
                      <div className="flex items-center justify-end">
                        <span className="text-forest mr-2">Focus on chemical-free growing practices</span>
                        <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-forest mr-2">Evaluation of soil health and growing environment</span>
                        <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center circle - desktop */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 hidden md:block">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative">
                      1
                    </div>
                  </div>
                  
                  {/* Mobile version */}
                  <div className="md:hidden flex mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 mr-4">
                      1
                    </div>
                    <div>
                      <h3 className="font-heading text-forest text-xl font-bold mb-2">Farmer Selection & Partnership</h3>
                    </div>
                  </div>
                  
                  <div className="md:hidden">
                    <p className="text-olive mb-4">
                      We carefully select partner farmers based on their commitment to traditional farming methods, product quality, and sustainable practices. Each farm undergoes thorough evaluation before joining our network.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Focus on chemical-free growing practices</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Evaluation of soil health and growing environment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/2889401/pexels-photo-2889401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                      alt="Farmer selection process" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mt-24">
                <motion.div 
                  className="md:grid md:grid-cols-2 gap-8 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/5913245/pexels-photo-5913245.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                      alt="Harvesting process" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  
                  {/* Center circle - desktop */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 hidden md:block">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative">
                      2
                    </div>
                  </div>
                  
                  {/* Mobile version */}
                  <div className="md:hidden flex mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 mr-4">
                      2
                    </div>
                    <div>
                      <h3 className="font-heading text-forest text-xl font-bold mb-2">Harvest & Processing</h3>
                    </div>
                  </div>
                  
                  <div className="text-left md:pl-8">
                    <h3 className="font-heading text-forest text-2xl font-bold mb-3 hidden md:block">2. Harvest & Processing</h3>
                    <p className="text-olive mb-4">
                      Products are harvested at peak ripeness and processed using methods that preserve maximum flavor and nutrition. Our minimal processing approach ensures you taste the food as nature intended.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Careful hand-harvesting of many products</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Processing within hours of harvest when possible</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Step 3 */}
              <div className="relative mt-24">
                <motion.div 
                  className="md:grid md:grid-cols-2 gap-8 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-right hidden md:block">
                    <h3 className="font-heading text-forest text-2xl font-bold mb-3">3. Quality Control</h3>
                    <p className="text-olive ml-auto">
                      Every product undergoes rigorous quality checks to ensure it meets our high standards. We regularly test for purity and reject any items that don't meet our strict criteria.
                    </p>
                    <div className="mt-4 flex flex-col items-end space-y-2">
                      <div className="flex items-center justify-end">
                        <span className="text-forest mr-2">Visual inspection for quality indicators</span>
                        <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-forest mr-2">Sample testing for purity and taste</span>
                        <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center circle - desktop */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 hidden md:block">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative">
                      3
                    </div>
                  </div>
                  
                  {/* Mobile version */}
                  <div className="md:hidden flex mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 mr-4">
                      3
                    </div>
                    <div>
                      <h3 className="font-heading text-forest text-xl font-bold mb-2">Quality Control</h3>
                    </div>
                  </div>
                  
                  <div className="md:hidden">
                    <p className="text-olive mb-4">
                      Every product undergoes rigorous quality checks to ensure it meets our high standards. We regularly test for purity and reject any items that don't meet our strict criteria.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Visual inspection for quality indicators</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Sample testing for purity and taste</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/5428001/pexels-photo-5428001.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                      alt="Quality control inspection" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Step 4 */}
              <div className="relative mt-24">
                <motion.div 
                  className="md:grid md:grid-cols-2 gap-8 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hidden md:block">
                    <img 
                      src="https://images.pexels.com/photos/6169/woman-hand-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                      alt="Packaging and delivery" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  
                  {/* Center circle - desktop */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 hidden md:block">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative">
                      4
                    </div>
                  </div>
                  
                  {/* Mobile version */}
                  <div className="md:hidden flex mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 mr-4">
                      4
                    </div>
                    <div>
                      <h3 className="font-heading text-forest text-xl font-bold mb-2">Packaging & Delivery</h3>
                    </div>
                  </div>
                  
                  <div className="text-left md:pl-8">
                    <h3 className="font-heading text-forest text-2xl font-bold mb-3 hidden md:block">4. Packaging & Delivery</h3>
                    <p className="text-olive mb-4">
                      Products are packaged to preserve freshness using environmentally responsible materials. We work with reliable shipping partners to deliver your order promptly with minimal environmental impact.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Minimal, eco-friendly packaging</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-forest">Carbon-offset shipping options</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Sustainability Initiatives</h2>
            <p className="text-olive text-lg">
              We're committed to making our operations environmentally responsible at every step.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="text-secondary h-8 w-8" />,
                title: "Regenerative Agriculture",
                description: "We partner with farmers who practice regenerative methods that build soil health and sequester carbon, creating a positive environmental impact."
              },
              {
                icon: <Package className="text-secondary h-8 w-8" />,
                title: "Sustainable Packaging",
                description: "Our packaging is designed to minimize waste with recyclable, compostable, or biodegradable materials wherever possible."
              },
              {
                icon: <Truck className="text-secondary h-8 w-8" />,
                title: "Carbon-Offset Shipping",
                description: "We measure and offset the carbon footprint of our shipping operations by investing in verified environmental projects."
              },
              {
                icon: <Clock className="text-secondary h-8 w-8" />,
                title: "Waste Reduction",
                description: "We implement systems to minimize food waste through careful planning, multi-use applications, and composting programs."
              }
            ].map((initiative, index) => (
              <motion.div 
                key={initiative.title}
                className="bg-background p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  {initiative.icon}
                </div>
                <h3 className="font-heading text-forest text-xl font-semibold mb-3">{initiative.title}</h3>
                <p className="text-olive">{initiative.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <section className="py-16 bg-forest text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="mb-8 lg:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                See Our Process in Action
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Watch how we work directly with farmers to bring the best quality products to your table while maintaining traditional farming knowledge and practices.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="/products"
                  className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-md transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Our Products
                </motion.a>
                <motion.a 
                  href="/farmers"
                  className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white font-semibold rounded-md transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Meet Our Farmers
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div
              className="relative rounded-lg overflow-hidden shadow-xl aspect-video"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Video embed - YouTube placeholder */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/B1wpUvgZ9ew" 
                title="Our Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurProcess;