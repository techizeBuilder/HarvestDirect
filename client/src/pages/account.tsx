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
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
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

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('GET', '/api/payments/history');
      console.log('Payment data:', data);
      setPayments(Array.isArray(data) ? data : []);
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
      const response = await apiRequest('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptions(data.subscriptions || []);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch subscriptions',
          variant: 'destructive'
        });
      }
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
      const response = await apiRequest(`/api/subscriptions/${subscriptionId}/cancel`, {
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
          <TabsList className="mb-8 w-full grid grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
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