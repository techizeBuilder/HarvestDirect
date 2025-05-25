import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Home, 
  Settings, 
  LogOut, 
  Tag, 
  BarChart
} from 'lucide-react';

export default function AdminNav() {
  const [, setLocation] = useLocation();
  const [currentPath] = useLocation();
  const [username, setUsername] = useState<string>('Admin');

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        if (userData.username) {
          setUsername(userData.username);
        }
      } catch (e) {
        console.error('Error parsing admin user data', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin/login');
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">FarmConnect Admin</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/dashboard') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <Home size={18} />
                <span>Dashboard</span>
              </a>
            </Link>
            <Link href="/admin/products">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/products') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <Package size={18} />
                <span>Products</span>
              </a>
            </Link>
            <Link href="/admin/orders">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/orders') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <ShoppingCart size={18} />
                <span>Orders</span>
              </a>
            </Link>
            <Link href="/admin/users">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/users') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <Users size={18} />
                <span>Users</span>
              </a>
            </Link>
            <Link href="/admin/analytics">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/analytics') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <BarChart size={18} />
                <span>Analytics</span>
              </a>
            </Link>
            <Link href="/admin/discounts">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/discounts') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <Tag size={18} />
                <span>Discounts</span>
              </a>
            </Link>
            <Link href="/admin/settings">
              <a className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                ${isActive('/admin/settings') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-700 dark:text-gray-300'}`}>
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Welcome, {username}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}