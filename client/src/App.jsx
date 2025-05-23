import React from 'react';
import { Switch, Route } from 'wouter';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import OurStory from './pages/OurStory';
import OurProcess from './pages/OurProcess';
import Contact from './pages/Contact';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:id" component={ProductDetail} />
            <Route path="/our-story" component={OurStory} />
            <Route path="/our-process" component={OurProcess} />
            <Route path="/contact" component={Contact} />
            <Route>
              {/* 404 Page */}
              <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-primary">404</h1>
                  <h2 className="text-2xl font-heading text-forest mt-4">Page Not Found</h2>
                  <p className="text-olive mt-2 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                  <a 
                    href="/" 
                    className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Return Home
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </AnimatePresence>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;