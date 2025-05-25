import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

// Sample order data for demonstration
const SAMPLE_ORDERS = [
  {
    id: 'ORD-7291',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    date: '2025-05-24',
    total: 124.95,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    items: [
      { id: 1, name: 'Mountain Coffee Beans', quantity: 2, price: 12.50 },
      { id: 3, name: 'Organic Spice Mix', quantity: 1, price: 9.95 }
    ]
  },
  {
    id: 'ORD-7290',
    customer: 'Michael Davis',
    email: 'michael.d@example.com',
    date: '2025-05-24',
    total: 75.50,
    status: 'Processing',
    paymentMethod: 'Razorpay',
    items: [
      { id: 4, name: 'Fresh Valley Honey', quantity: 3, price: 8.75 },
      { id: 5, name: 'Organic Tea Sampler', quantity: 1, price: 19.95 }
    ]
  },
  {
    id: 'ORD-7289',
    customer: 'Emma Wilson',
    email: 'emma.w@example.com',
    date: '2025-05-23',
    total: 249.99,
    status: 'Shipped',
    paymentMethod: 'Razorpay',
    items: [
      { id: 2, name: 'Handcrafted Cheese', quantity: 2, price: 14.99 },
      { id: 1, name: 'Mountain Coffee Beans', quantity: 1, price: 12.50 }
    ]
  },
  {
    id: 'ORD-7288',
    customer: 'James Smith',
    email: 'james.s@example.com',
    date: '2025-05-22',
    total: 36.25,
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 3, name: 'Organic Spice Mix', quantity: 1, price: 9.95 },
      { id: 4, name: 'Fresh Valley Honey', quantity: 3, price: 8.75 }
    ]
  },
  {
    id: 'ORD-7287',
    customer: 'Olivia Brown',
    email: 'olivia.b@example.com',
    date: '2025-05-22',
    total: 178.00,
    status: 'Delivered',
    paymentMethod: 'Razorpay',
    items: [
      { id: 5, name: 'Organic Tea Sampler', quantity: 2, price: 19.95 },
      { id: 2, name: 'Handcrafted Cheese', quantity: 3, price: 14.99 }
    ]
  },
  {
    id: 'ORD-7286',
    customer: 'Noah Jones',
    email: 'noah.j@example.com',
    date: '2025-05-21',
    total: 67.80,
    status: 'Cancelled',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 1, name: 'Mountain Coffee Beans', quantity: 1, price: 12.50 },
      { id: 4, name: 'Fresh Valley Honey', quantity: 2, price: 8.75 }
    ]
  }
];

// Order status options with their corresponding badge colors
const ORDER_STATUSES = [
  { value: 'All', label: 'All Orders' },
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'Shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const ordersPerPage = 10;
  const { toast } = useToast();

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real application, you would call your API to update the order status
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
    
    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been updated to ${newStatus}.`,
    });
  };

  const handleExportCSV = () => {
    // In a real application, you would generate and download a CSV file
    toast({
      title: "Export started",
      description: "The order data is being exported as CSV.",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusOption = ORDER_STATUSES.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
          <Button onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Order List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Filter className="h-4 w-4 mr-1" />
                                Update
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {ORDER_STATUSES.filter(status => status.value !== 'All').map((status) => (
                                <DropdownMenuItem 
                                  key={status.value}
                                  onClick={() => handleUpdateStatus(order.id, status.value)}
                                  disabled={order.status === status.value}
                                >
                                  {status.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order details modal could be added here */}
      </div>
    </AdminLayout>
  );
}