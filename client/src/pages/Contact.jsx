import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, send data to server here
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We\'ll get back to you as soon as possible.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="pt-32 bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
            style={{ 
              backgroundImage: "url('https://images.pexels.com/photos/2347011/pexels-photo-2347011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
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
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-white text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have questions, suggestions, or feedback? We'd love to hear from you. Our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 
                variants={itemVariants}
                className="font-heading text-forest text-3xl font-bold mb-6"
              >
                Send Us a Message
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-olive mb-8"
              >
                Whether you have a question about our products, farmers, or ordering process, we're here to help. Fill out the form below and we'll respond as soon as possible.
              </motion.p>
              
              {formStatus.submitted && (
                <motion.div 
                  className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formStatus.message}
                </motion.div>
              )}
              
              <motion.form 
                onSubmit={handleSubmit}
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-forest font-medium mb-2">Your Name</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name" 
                    className={`w-full py-3 px-4 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-forest font-medium mb-2">Email Address</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email" 
                    className={`w-full py-3 px-4 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="subject" className="block text-forest font-medium mb-2">Subject</label>
                  <input 
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject" 
                    className={`w-full py-3 px-4 rounded-md border ${errors.subject ? 'border-red-500' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="message" className="block text-forest font-medium mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here" 
                    rows="5"
                    className={`w-full py-3 px-4 rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </motion.div>
                
                <motion.button 
                  type="submit" 
                  className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition duration-300 flex items-center justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </motion.button>
              </motion.form>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:pl-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="font-heading text-forest text-3xl font-bold mb-6"
              >
                Contact Information
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-olive mb-8"
              >
                You can reach out to us through any of the channels below. We aim to respond to all inquiries within 24 hours during business days.
              </motion.p>
              
              <div className="space-y-8">
                <motion.div 
                  className="flex"
                  variants={itemVariants}
                >
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Phone className="text-secondary h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Phone Support</h3>
                    <p className="text-olive mb-1">+1 (800) 555-1234</p>
                    <p className="text-olive text-sm">Monday to Friday, 9am to 5pm EST</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  variants={itemVariants}
                >
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Mail className="text-secondary h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-olive mb-1">customer.service@harvestdirect.com</p>
                    <p className="text-olive text-sm">For general inquiries and support</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  variants={itemVariants}
                >
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <MapPin className="text-secondary h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Office Address</h3>
                    <p className="text-olive mb-1">123 Farm Street, Suite 101</p>
                    <p className="text-olive mb-1">Green Valley, CA 94103</p>
                    <p className="text-olive text-sm">United States</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex"
                  variants={itemVariants}
                >
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Clock className="text-secondary h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-forest text-xl font-semibold mb-2">Business Hours</h3>
                    <p className="text-olive mb-1">Monday - Friday: 9am - 5pm EST</p>
                    <p className="text-olive mb-1">Saturday: 10am - 2pm EST</p>
                    <p className="text-olive">Sunday: Closed</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl font-bold mb-4">Visit Our Headquarters</h2>
            <p className="text-olive">
              Located in beautiful Green Valley, our office is where we coordinate with farmers and process orders.
            </p>
          </motion.div>
          
          <motion.div 
            className="rounded-lg overflow-hidden h-[400px] bg-white shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Map placeholder - in a real app, you would embed Google Maps or similar */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-forest text-xl font-bold mb-2">Harvest Direct HQ</h3>
                <p className="text-olive">123 Farm Street, Green Valley, CA 94103</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-forest text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-olive text-lg">
              Here are answers to some common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do you ensure product quality?",
                answer: "We work directly with carefully selected farmers who follow traditional growing methods. All products undergo multiple quality checks before reaching you, ensuring exceptional flavor and purity."
              },
              {
                question: "What are your shipping options?",
                answer: "We offer standard shipping (3-5 business days) and expedited shipping (1-2 business days) options. Free standard shipping is available for orders over $50."
              },
              {
                question: "Can I return products if I'm not satisfied?",
                answer: "Yes, we offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, simply contact us for a return or replacement."
              },
              {
                question: "Are your products certified organic?",
                answer: "Many of our partner farms follow organic practices but don't always have formal certification due to cost constraints. We personally verify all farming methods to ensure they meet our standards for chemical-free production."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-background p-6 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <h3 className="font-heading text-forest text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-olive">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;