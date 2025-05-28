import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

// User Pages
import UserHome from './pages/user/Home';
import UserProducts from './pages/user/Products';
import UserLogin from './pages/user/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminLogin from './pages/admin/Login';

// Routes
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserHome />} />
            <Route path="/products" element={<UserProducts />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/user/*" element={<UserRoutes />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;