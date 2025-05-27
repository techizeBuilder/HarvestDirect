import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Lock, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Smartphone,
  Upload
} from 'lucide-react';

// Schema for password change form
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Schema for store information form
const storeInfoSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteTagline: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Schema for social media form
const socialMediaSchema = z.object({
  facebook: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  twitter: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  instagram: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  youtube: z.string().url('Please enter a valid URL').or(z.string().length(0)),
});

export default function AdminSettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [storeLogoPreview, setStoreLogoPreview] = useState<string | null>(null);

  // Initialize forms
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const storeInfoForm = useForm<z.infer<typeof storeInfoSchema>>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: {
      siteName: 'Farm to Table',
      siteTagline: 'Fresh products from farms to your table',
      email: 'contact@farmtotable.com',
      phone: '(555) 123-4567',
      address: '123 Harvest Lane',
      city: 'Farmington',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
    },
  });

  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: 'https://facebook.com/farmtotable',
      twitter: 'https://twitter.com/farmtotable',
      instagram: 'https://instagram.com/farmtotable',
      youtube: 'https://youtube.com/farmtotable',
    },
  });

  // Submit handlers
  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    setIsUpdating(true);
    
    // In a real application, you would call your API to update the password
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: 'Password updated',
        description: 'Your admin password has been updated successfully.',
      });
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };

  const onStoreInfoSubmit = (data: z.infer<typeof storeInfoSchema>) => {
    setIsUpdating(true);
    
    // In a real application, you would call your API to update the store information
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: 'Store information updated',
        description: 'Your store information has been updated successfully.',
      });
    }, 1000);
  };

  const onSocialMediaSubmit = (data: z.infer<typeof socialMediaSchema>) => {
    setIsUpdating(true);
    
    // In a real application, you would call your API to update the social media links
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: 'Social media links updated',
        description: 'Your social media links have been updated successfully.',
      });
    }, 1000);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // In a real application, you would upload the file to your server or CDN
      // For this demo, we'll just display a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoreLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: 'Logo updated',
        description: 'Your store logo has been updated successfully.',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your store settings and configurations</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="store">Store Information</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your admin account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="password" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="password" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Password must be at least 6 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="password" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Account</CardTitle>
                <CardDescription>
                  Manage your admin account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Admin</p>
                      <p className="text-sm text-muted-foreground">admin@farmtotable.com</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Account Security</p>
                    <p className="text-sm text-muted-foreground">
                      It is recommended to use a strong password and change it regularly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Store Information */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Update your store details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...storeInfoForm}>
                  <form onSubmit={storeInfoForm.handleSubmit(onStoreInfoSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 space-y-4">
                          <h3 className="text-lg font-medium">Store Logo</h3>
                          <div className="border rounded-lg p-4 text-center">
                            {storeLogoPreview ? (
                              <div className="space-y-4">
                                <img 
                                  src={storeLogoPreview} 
                                  alt="Store Logo" 
                                  className="max-h-40 mx-auto" 
                                />
                                <Button 
                                  variant="outline" 
                                  onClick={() => setStoreLogoPreview(null)}
                                >
                                  Remove Logo
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="w-40 h-40 mx-auto bg-muted rounded-lg flex items-center justify-center">
                                  <Building className="h-10 w-10 text-muted-foreground" />
                                </div>
                                
                                <div>
                                  <label htmlFor="logo-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 text-primary">
                                      <Upload className="h-4 w-4" />
                                      <span>Upload Logo</span>
                                    </div>
                                    <input
                                      id="logo-upload"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleLogoUpload}
                                    />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 200x200px. Max file size: 2MB.
                          </p>
                        </div>
                        
                        <div className="md:w-2/3 space-y-4">
                          <h3 className="text-lg font-medium">Store Details</h3>
                          
                          <FormField
                            control={storeInfoForm.control}
                            name="siteName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={storeInfoForm.control}
                            name="siteTagline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site Tagline</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  A short description of your store that appears in the header.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={storeInfoForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeInfoForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-lg font-medium">Store Address</h3>
                      <div className="space-y-4">
                        <FormField
                          control={storeInfoForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={storeInfoForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={storeInfoForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={storeInfoForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={storeInfoForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : 'Save Store Information'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Connect your store with social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...socialMediaForm}>
                  <form onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={socialMediaForm.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Facebook className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="https://facebook.com/yourstorename" 
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
                        control={socialMediaForm.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Twitter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="https://twitter.com/yourstorename" 
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
                        control={socialMediaForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Instagram className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="https://instagram.com/yourstorename" 
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
                        control={socialMediaForm.control}
                        name="youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Youtube className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="https://youtube.com/yourstorename" 
                                  className="pl-8" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Saving...' : 'Save Social Media Links'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}