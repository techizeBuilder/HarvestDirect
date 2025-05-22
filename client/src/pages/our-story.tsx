import { useEffect } from "react";
import { motion } from "framer-motion";
import { ParallaxSection } from "@/components/ui/parallax-section";
import { useAnimations } from "@/hooks/use-animations";
import { Leaf, Users, Globe, MapPin } from "lucide-react";

export default function OurStory() {
  // Set up animation
  const { setupScrollAnimation } = useAnimations();

  useEffect(() => {
    setupScrollAnimation();
  }, [setupScrollAnimation]);

  return (
    <>
      {/* Hero Section */}
      <ParallaxSection 
        backgroundUrl="https://images.pexels.com/photos/1213859/pexels-photo-1213859.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        className="pt-48 pb-24"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream text-lg max-w-3xl mx-auto text-shadow"
          >
            How Harvest Direct was born from a passion to connect consumers with authentic farmers and their traditional growing methods.
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-olive text-lg">
              We believe in a world where people can easily access pure, traditionally grown food direct from the farmers who grow it with care and passion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-animation">
            <div>
              <img 
                src="https://images.pexels.com/photos/2253916/pexels-photo-2253916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Farmer working in field" 
                className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <h3 className="font-heading text-forest text-2xl md:text-3xl font-semibold mb-4">The Beginning of Our Journey</h3>
              <p className="text-olive mb-4">
                Harvest Direct was founded in 2020 by a group of food enthusiasts who were concerned about the growing disconnect between consumers and the source of their food. We saw how traditional farmers were struggling to compete with industrial agriculture, despite growing products that were superior in both taste and nutrition.
              </p>
              <p className="text-olive mb-6">
                We started by partnering with just three farmers from different regions, helping them bring their products directly to consumers through our platform. Today, we work with over 24 farming families across diverse growing regions, each selected for their commitment to traditional farming practices and high-quality produce.
              </p>

              <div className="flex flex-wrap items-center">
                <div className="mr-8 mb-4">
                  <span className="block text-secondary text-3xl font-bold">2020</span>
                  <span className="text-olive text-sm">Founded</span>
                </div>
                <div className="h-10 w-px bg-olive/20 mx-4 hidden md:block"></div>
                <div className="mr-8 mb-4">
                  <span className="block text-secondary text-3xl font-bold">24+</span>
                  <span className="text-olive text-sm">Partner Farms</span>
                </div>
                <div className="h-10 w-px bg-olive/20 mx-4 hidden md:block"></div>
                <div className="mb-4">
                  <span className="block text-secondary text-3xl font-bold">5k+</span>
                  <span className="text-olive text-sm">Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-olive text-lg">
              The principles that guide everything we do at Harvest Direct.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-animation">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-secondary text-2xl" />
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Natural Purity</h3>
              <p className="text-olive">
                We believe in food as nature intended it – pure, chemical-free, and minimally processed to preserve its authentic flavors and nutritional benefits.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary text-2xl" />
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Farmer Partnerships</h3>
              <p className="text-olive">
                We're committed to fair partnerships with farmers, ensuring they receive proper compensation for their expertise and dedication to quality.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-secondary text-2xl" />
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-olive">
                We support farming practices that work in harmony with nature, preserving soil health and biodiversity for generations to come.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-secondary text-2xl" />
              </div>
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-olive">
                We believe you have the right to know exactly where your food comes from, who grew it, and how it reached your table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
            <p className="text-olive text-lg">
              Meet the passionate people working to connect you with traditional farmers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-animation">
            <div className="bg-background rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Priya Sharma - Founder" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="font-heading text-forest text-xl font-semibold mb-1">Priya Sharma</h3>
                <p className="text-secondary font-medium mb-3">Founder & CEO</p>
                <p className="text-olive">
                  After growing up on her family's farm, Priya spent 10 years in the food industry before founding Harvest Direct to help traditional farmers thrive.
                </p>
              </div>
            </div>
            
            <div className="bg-background rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.pexels.com/photos/2801829/pexels-photo-2801829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Michael Lee - Farming Coordinator" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="font-heading text-forest text-xl font-semibold mb-1">Michael Lee</h3>
                <p className="text-secondary font-medium mb-3">Farm Relations Lead</p>
                <p className="text-olive">
                  With a degree in agricultural sciences and experience working with farmers across three continents, Michael helps identify and partner with exceptional farming families.
                </p>
              </div>
            </div>
            
            <div className="bg-background rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Aisha Okoye - Quality Specialist" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="font-heading text-forest text-xl font-semibold mb-1">Aisha Okoye</h3>
                <p className="text-secondary font-medium mb-3">Quality Assurance Lead</p>
                <p className="text-olive">
                  A food scientist with expertise in natural preservation techniques, Aisha ensures that every product meets our high standards for quality and purity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us Call to Action */}
      <ParallaxSection
        backgroundUrl="https://images.pexels.com/photos/5529541/pexels-photo-5529541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        className="py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-white text-3xl md:text-4xl font-bold mb-6 text-shadow"
          >
            Join Our Mission
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream text-lg max-w-2xl mx-auto mb-8 text-shadow"
          >
            Discover the difference that traditionally grown, chemical-free foods can make in your life while supporting farmers who care deeply about their craft.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a 
              href="/products" 
              className="inline-block bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-md transition duration-300 text-lg"
            >
              Shop Our Products
            </a>
          </motion.div>
        </div>
      </ParallaxSection>
    </>
  );
}