import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import AllProducts from "@/pages/all-products";
import AllFarmers from "@/pages/all-farmers";
import Layout from "@/components/Layout";
import { CartProvider } from "@/context/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={AllProducts} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/farmers" component={AllFarmers} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <CartProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </CartProvider>
    </TooltipProvider>
  );
}

export default App;
