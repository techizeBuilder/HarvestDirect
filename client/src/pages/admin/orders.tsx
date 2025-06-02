import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
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
  Filter,
  Loader2
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Order type definition for API response
interface OrderData {
  id: number;
  userId: number | null;
  sessionId: string;
  total: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  cancellationReason: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
}

interface OrdersResponse {
  orders: OrderData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Order status options with their corresponding badge colors
const ORDER_STATUSES = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const ordersPerPage = 10;
  const { toast } = useToast();

  // Fetch orders from API
  const fetchOrders = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ordersPerPage.toString(),
        sort: 'createdAt',
        order: 'desc'
      });
      
      if (search) {
        params.append('search', search);
      }
      if (status) {
        params.append('status', status);
      }
      
      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders on component mount and when filters change
  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage]);

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Refresh orders list
      fetchOrders(currentPage, searchTerm, statusFilter);
      
      toast({
        title: "Order status updated",
        description: `Order ${orderId} has been updated to ${newStatus}.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Here you would implement CSV export functionality
      toast({
        title: "Export started",
        description: "The order data is being exported as CSV.",
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to export orders',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusOption = ORDER_STATUSES.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminAuthWrapper>
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-500">
                  {error}
                </div>
              ) : (
                <>
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
                        {orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No orders found
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">ORD-{order.id}</TableCell>
                              <TableCell>
                                <div>
                                  <div>{order.userName || 'Guest Customer'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {order.userEmail || 'No email'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>{formatCurrency(order.total)}</TableCell>
                              <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={getStatusBadgeClass(order.status)}
                                  variant="secondary"
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
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
                                      {ORDER_STATUSES.filter(status => status.value !== '').map((status) => (
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
                          ))
                        )}
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
                          onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Order details modal could be added here */}
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}