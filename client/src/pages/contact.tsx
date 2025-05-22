import { useEffect } from "react";
import { motion } from "framer-motion";
import { ParallaxSection } from "@/components/ui/parallax-section";
import { useAnimations } from "@/hooks/use-animations";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  // Set up animations
  const { setupScrollAnimation } = useAnimations();
  const { toast } = useToast();

  useEffect(() => {
    setupScrollAnimation();
  }, [setupScrollAnimation]);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    // In a real application, this would send data to an API
    console.log("Form submitted:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    reset();
  };

  return (
    <>
      {/* Hero Section */}
      <ParallaxSection 
        backgroundUrl="https://images.pexels.com/photos/2347011/pexels-photo-2347011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        className="pt-48 pb-24"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-white text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream text-lg max-w-3xl mx-auto text-shadow"
          >
            Have questions, suggestions, or feedback? We'd love to hear from you. Our team is here to help.
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="scroll-animation">
              <h2 className="font-heading text-forest text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-olive mb-8">
                Whether you have a question about our products, farmers, or ordering process, we're here to help. Fill out the form below and we'll respond as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-forest font-medium mb-2">Your Name</label>
                  <Input 
                    id="name"
                    placeholder="Enter your name" 
                    className="w-full"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-forest font-medium mb-2">Email Address</label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-forest font-medium mb-2">Subject</label>
                  <Input 
                    id="subject"
                    placeholder="Enter subject" 
                    className="w-full"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-forest font-medium mb-2">Message</label>
                  <Textarea 
                    id="message"
                    placeholder="Type your message here" 
                    className="w-full min-h-[150px]"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="scroll-animation">
              <h2 className="font-heading text-forest text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-olive mb-8">
                You can reach out to us through any of the channels below. We aim to respond to all inquiries within 24 hours during business days.
              </p>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Phone className="text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Phone Support</h3>
                    <p className="text-olive mb-1">+1 (800) 555-1234</p>
                    <p className="text-olive text-sm">Monday to Friday, 9am to 5pm EST</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Mail className="text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-olive mb-1">customer.service@harvestdirect.com</p>
                    <p className="text-olive text-sm">For general inquiries and support</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <MapPin className="text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Office Address</h3>
                    <p className="text-olive mb-1">123 Farm Street, Suite 101</p>
                    <p className="text-olive mb-1">Green Valley, CA 94103</p>
                    <p className="text-olive text-sm">United States</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Clock className="text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Business Hours</h3>
                    <p className="text-olive mb-1">Monday - Friday: 9am - 5pm EST</p>
                    <p className="text-olive mb-1">Saturday: 10am - 2pm EST</p>
                    <p className="text-olive">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10 scroll-animation">
            <h2 className="font-heading text-forest text-3xl font-bold mb-4">Visit Our Headquarters</h2>
            <p className="text-olive">
              Located in beautiful Green Valley, our office is where we coordinate with farmers and process orders.
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden scroll-animation h-[400px] bg-white shadow-md">
            {/* This would be a real map in a production environment */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-forest text-xl font-bold mb-2">Harvest Direct HQ</h3>
                <p className="text-olive">123 Farm Street, Green Valley, CA 94103</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 scroll-animation">
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-olive text-lg">
              Here are answers to some common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-animation">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">How do you ensure product quality?</h3>
              <p className="text-olive">
                We work directly with carefully selected farmers who follow traditional growing methods. All products undergo multiple quality checks before reaching you, ensuring exceptional flavor and purity.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">What are your shipping options?</h3>
              <p className="text-olive">
                We offer standard shipping (3-5 business days) and expedited shipping (1-2 business days) options. Free standard shipping is available for orders over $50.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Can I return products if I'm not satisfied?</h3>
              <p className="text-olive">
                Yes, we offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, simply contact us for a return or replacement.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-heading text-forest text-xl font-semibold mb-3">Are your products certified organic?</h3>
              <p className="text-olive">
                Many of our partner farms follow organic practices but don't always have formal certification due to cost constraints. We personally verify all farming methods to ensure they meet our standards for chemical-free production.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}