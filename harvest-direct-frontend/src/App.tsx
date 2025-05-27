import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import AllProducts from "@/pages/all-products";
import AllFarmers from "@/pages/all-farmers";
import OurStory from "@/pages/our-story";
import OurProcess from "@/pages/our-process";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Account from "@/pages/account";
import Payment from "@/pages/payment";
import PaymentSuccess from "@/pages/payment-success";
import FAQs from "@/pages/faqs";
import ShippingReturns from "@/pages/shipping-returns";
import TrackOrder from "@/pages/track-order";
import PrivacyPolicy from "@/pages/privacy-policy";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminUsers from "@/pages/admin/users";
import AdminFarmers from "@/pages/admin/farmers";
import AdminInventory from "@/pages/admin/inventory";
import AdminDiscounts from "@/pages/admin/discounts";
import AdminSettings from "@/pages/admin/settings";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Layout from "@/components/Layout";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Switch>
              {/* Admin Routes - Without Main Layout */}
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/products" component={AdminProducts} />
              <Route path="/admin/orders" component={AdminOrders} />
              <Route path="/admin/users" component={AdminUsers} />
              <Route path="/admin/farmers" component={AdminFarmers} />
              <Route path="/admin/inventory" component={AdminInventory} />
              <Route path="/admin/discounts" component={AdminDiscounts} />
              <Route path="/admin/settings" component={AdminSettings} />
              
              {/* Main Store Routes - Wrapped in Layout */}
              <Route>
                {() => (
                  <Layout>
                    <Switch>
                      <Route path="/" component={Home} />
                      <Route path="/products" component={AllProducts} />
                      <Route path="/products/:id" component={ProductDetail} />
                      <Route path="/farmers" component={AllFarmers} />
                      <Route path="/checkout" component={Checkout} />
                      <Route path="/our-story" component={OurStory} />
                      <Route path="/our-process" component={OurProcess} />
                      <Route path="/contact" component={Contact} />
                      <Route path="/login" component={Login} />
                      <Route path="/register" component={Register} />
                      <Route path="/account" component={Account} />
                      <Route path="/payment" component={Payment} />
                      <Route path="/payment-success" component={PaymentSuccess} />
                      
                      {/* Customer Care Pages */}
                      <Route path="/faqs" component={FAQs} />
                      <Route path="/shipping-returns" component={ShippingReturns} />
                      <Route path="/track-order" component={TrackOrder} />
                      <Route path="/privacy-policy" component={PrivacyPolicy} />
                      
                      {/* 404 Route */}
                      <Route component={NotFound} />
                    </Switch>
                  </Layout>
                )}
              </Route>
            </Switch>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
