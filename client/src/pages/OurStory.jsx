import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const OurStory = () => {
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
              backgroundImage: "url('https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
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
            Our Story
          </motion.h1>
          <motion.p 
            className="text-white text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How a journey to rediscover authentic farming traditions led to the creation of Harvest Direct
          </motion.p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="scroll-animation"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">How It All Began</h2>
              <p className="text-olive mb-6">
                Harvest Direct was born from a simple yet profound realization. During travels through rural villages, our founder Arjun witnessed the stark contrast between the vibrant, flavorful foods grown by traditional farmers and the bland, mass-produced alternatives dominating supermarket shelves.
              </p>
              <p className="text-olive mb-6">
                What stood out most was the deep wisdom these farmers possessed—techniques passed down through generations that produced foods with exceptional flavor while nurturing the land. Yet many of these farmers struggled to reach markets beyond their local areas, while consumers in cities had lost connection to the source of their food.
              </p>
              <p className="text-olive">
                This disconnect inspired a mission: to create a bridge between traditional farmers preserving ancient growing methods and conscious consumers seeking authentic, natural foods grown with care and expertise.
              </p>
            </motion.div>
            <motion.div
              className="scroll-animation"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/1084545/pexels-photo-1084545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Farmers in a traditional farm" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision and Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Vision & Values</h2>
            <p className="text-olive text-lg">
              We envision a world where traditional farming knowledge is valued and preserved, where farmers receive fair compensation for their expertise, and where consumers can access truly natural, chemical-free foods directly from their source.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md scroll-animation"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                </svg>
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-4">Authenticity</h3>
              <p className="text-olive">
                We believe in foods as nature intended—grown without shortcuts, artificial inputs, or genetic modification. True flavor and nutrition come from traditional methods that respect natural processes.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md scroll-animation"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-4">Fair Partnership</h3>
              <p className="text-olive">
                We pay our farmers significantly above market rates to honor their knowledge and commitment to quality. This creates sustainable livelihoods that allow them to continue traditional practices.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md scroll-animation"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-4">Transparency</h3>
              <p className="text-olive">
                We share the story behind each product—who grew it, how it was cultivated, and its journey to your table. We believe consumers deserve to know the full story of their food.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16 scroll-animation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-olive text-lg">
              The passionate individuals working behind the scenes to connect farmers with consumers while preserving traditional growing methods.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Arjun Sharma",
                title: "Founder & CEO",
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                bio: "With deep roots in farming communities and a background in agricultural economics, Arjun bridges traditional knowledge with modern markets."
              },
              {
                name: "Priya Nair",
                title: "Head of Farmer Relations",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                bio: "A third-generation farmer herself, Priya works directly with our partner farmers to document practices and ensure quality standards."
              },
              {
                name: "Raj Kumar",
                title: "Operations Director",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                bio: "With expertise in sustainable supply chains, Raj oversees our logistics network that brings products from remote farms to your doorstep."
              },
              {
                name: "Anjali Mehta",
                title: "Sustainability Manager",
                image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                bio: "With a background in environmental science, Anjali works on reducing our ecological footprint and developing regenerative farming initiatives."
              }
            ].map((member, index) => (
              <motion.div 
                key={member.name}
                className="bg-white rounded-lg overflow-hidden shadow-md scroll-animation"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="font-heading text-forest text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-secondary text-sm font-medium mb-4">{member.title}</p>
                  <p className="text-olive text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-forest text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Experience the difference that traditionally grown, natural products can make in your life while supporting the farmers who preserve these valuable practices.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/products"
                className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-md transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Farm-Direct Products
              </motion.a>
              <motion.a
                href="/contact"
                className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white font-semibold rounded-md transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;