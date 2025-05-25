import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Lock, User } from 'lucide-react';

const adminLoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for hardcoded admin credentials
      if (data.username === 'admin' && data.password === 'admin123') {
        // Store admin session
        localStorage.setItem('admin_authenticated', 'true');
        
        // Show success message
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin dashboard',
        });
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-10">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-muted-foreground">
                            <User className="h-4 w-4" />
                          </span>
                          <Input 
                            placeholder="admin" 
                            className="pl-8"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-muted-foreground">
                            <Lock className="h-4 w-4" />
                          </span>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-8"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login to Admin Panel'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center text-muted-foreground">
              <a href="/" className="text-primary hover:underline">
                Return to main website
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}