import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: 'up' | 'down' | 'none';
  percentage?: string;
}

// Sample data for demo purposes
const SAMPLE_DATA = {
  totalOrders: 158,
  totalUsers: 2457,
  totalRevenue: 24650.75,
  totalProducts: 124,
  recentOrders: [
    { id: 'ORD-7291', customer: 'Sarah Johnson', date: '2025-05-24', total: '$124.95', status: 'Delivered' },
    { id: 'ORD-7290', customer: 'Michael Davis', date: '2025-05-24', total: '$75.50', status: 'Processing' },
    { id: 'ORD-7289', customer: 'Emma Wilson', date: '2025-05-23', total: '$249.99', status: 'Shipped' },
    { id: 'ORD-7288', customer: 'James Smith', date: '2025-05-22', total: '$36.25', status: 'Pending' },
    { id: 'ORD-7287', customer: 'Olivia Brown', date: '2025-05-22', total: '$178.00', status: 'Delivered' },
  ],
  lowStockProducts: [
    { id: 1, name: 'Mountain Coffee Beans', stock: 5, minStock: 10 },
    { id: 3, name: 'Organic Spice Mix', stock: 8, minStock: 15 },
    { id: 7, name: 'Fresh Valley Honey', stock: 3, minStock: 10 },
  ]
};

function StatCard({ title, value, icon, description, trend, percentage }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-full text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm mt-1">
          {trend === 'up' && (
            <>
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
              <span className="text-green-600">{percentage}</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
              <span className="text-red-600">{percentage}</span>
            </>
          )}
          <span className="text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(SAMPLE_DATA);

  useEffect(() => {
    // In a real application, you would fetch data from your API here
    // For now, we're using the sample data defined above
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={<ShoppingCart className="h-4 w-4" />}
            description="from last month"
            trend="up"
            percentage="12%"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalUsers.toString()}
            icon={<Users className="h-4 w-4" />}
            description="from last month"
            trend="up"
            percentage="8%"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4" />}
            description="from last month"
            trend="up"
            percentage="15%"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            icon={<Package className="h-4 w-4" />}
            description="from last month"
            trend="up"
            percentage="3%"
          />
        </div>

        {/* Recent Orders */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-3 text-left font-medium">Order ID</th>
                      <th className="py-2 px-3 text-left font-medium">Customer</th>
                      <th className="py-2 px-3 text-left font-medium">Date</th>
                      <th className="py-2 px-3 text-left font-medium">Amount</th>
                      <th className="py-2 px-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">{order.id}</td>
                        <td className="py-2 px-3">{order.customer}</td>
                        <td className="py-2 px-3">{order.date}</td>
                        <td className="py-2 px-3">{order.total}</td>
                        <td className="py-2 px-3">
                          <span 
                            className={`inline-block px-2 py-1 text-xs rounded-full
                              ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'}`
                            }
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <a href="/admin/orders" className="text-primary hover:underline text-sm">
                  View all orders
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-3 text-left font-medium">Product</th>
                      <th className="py-2 px-3 text-left font-medium">Current Stock</th>
                      <th className="py-2 px-3 text-left font-medium">Min. Stock</th>
                      <th className="py-2 px-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">{product.name}</td>
                        <td className="py-2 px-3">{product.stock}</td>
                        <td className="py-2 px-3">{product.minStock}</td>
                        <td className="py-2 px-3">
                          <span 
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <a href="/admin/inventory" className="text-primary hover:underline text-sm">
                  Manage inventory
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}