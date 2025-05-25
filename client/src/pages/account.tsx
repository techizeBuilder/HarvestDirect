import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Account() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, token, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
      });
    }
  }, [user, form]);

  // Fetch payment history
  useEffect(() => {
    if (token && activeTab === 'payments') {
      fetchPayments();
    }
  }, [token, activeTab]);

  // Fetch subscription data
  useEffect(() => {
    if (token && activeTab === 'subscriptions') {
      fetchSubscriptions();
    }
  }, [token, activeTab]);
  
  // Fetch order history
  useEffect(() => {
    if (token && activeTab === 'orders') {
      fetchOrders();
    }
  }, [token, activeTab]);
  
  // Fetch cancelled orders
  useEffect(() => {
    if (token && activeTab === 'cancelled-orders') {
      fetchCancelledOrders();
    }
  }, [token, activeTab]);
  
  // Fetch delivered orders
  useEffect(() => {
    if (token && activeTab === 'delivered-orders') {
      fetchDeliveredOrders();
    }
  }, [token, activeTab]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Payment data:', data);
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Subscription data:', data);
      setSubscriptions(Array.isArray(data.subscriptions) ? data.subscriptions : []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch subscription details',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Order data:', data);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch order history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCancelledOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders/cancelled', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Cancelled order data:', data);
      setCancelledOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cancelled orders',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchDeliveredOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders/delivered', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Delivered order data:', data);
      setDeliveredOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error('Error fetching delivered orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch delivered orders',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const success = await updateProfile(data.name);
    if (success) {
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully'
      });
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your subscription has been canceled'
        });
        // Refresh subscriptions list
        fetchSubscriptions();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to cancel subscription',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 w-full grid grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="cancelled-orders">Cancelled Orders</TabsTrigger>
            <TabsTrigger value="delivered-orders">Delivered Orders</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center gap-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" type="button" onClick={logout}>
                        Logout
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View your recent payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading payment history...</div>
                ) : payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Amount</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Payment ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment: any) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-2 px-4">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4">
                              {payment.currency} {payment.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-sm text-gray-600">
                              {payment.razorpayPaymentId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You don't have any payment history yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  Track all your previous orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading orders...</div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Order ID</th>
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Total</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{order.id}</td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">View Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You haven't placed any orders yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancelled Orders Tab */}
          <TabsContent value="cancelled-orders">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Orders</CardTitle>
                <CardDescription>
                  View your cancelled orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading cancelled orders...</div>
                ) : cancelledOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Order ID</th>
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Total</th>
                          <th className="py-2 px-4 text-left">Cancellation Reason</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cancelledOrders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{order.id}</td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {order.cancellationReason || 'No reason provided'}
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm">View Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You don't have any cancelled orders.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivered Orders Tab */}
          <TabsContent value="delivered-orders">
            <Card>
              <CardHeader>
                <CardTitle>Delivered Orders</CardTitle>
                <CardDescription>
                  View your successfully delivered orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading delivered orders...</div>
                ) : deliveredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Order ID</th>
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Total</th>
                          <th className="py-2 px-4 text-left">Delivery Date</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveredOrders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">#{order.id}</td>
                            <td className="py-3 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              {order.deliveredAt ? 
                                new Date(order.deliveredAt).toLocaleDateString() : 
                                'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">View Details</Button>
                                <Button variant="outline" size="sm">Buy Again</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You don't have any delivered orders yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>
                  Manage your active subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading subscriptions...</div>
                ) : subscriptions.length > 0 ? (
                  <div className="space-y-6">
                    {subscriptions.map((subscription: any) => (
                      <div key={subscription.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">{subscription.planName}</h3>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'canceled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          <div>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</div>
                          <div>End Date: {new Date(subscription.endDate).toLocaleDateString()}</div>
                          <div className="mt-1">Subscription ID: {subscription.razorpaySubscriptionId}</div>
                        </div>
                        {subscription.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCancelSubscription(subscription.id)}
                            disabled={isLoading}
                          >
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You don't have any active subscriptions.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}