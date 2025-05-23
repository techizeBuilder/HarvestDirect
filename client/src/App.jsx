import React from 'react';
import { Switch, Route } from 'wouter';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            {/* Add more routes here for other pages */}
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
    </>
  );
};

export default App;