import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, ExternalLink, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  description: string | null;
  updatedAt: string;
}

const socialPlatforms = [
  { key: 'social_facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
  { key: 'social_instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/youraccount' },
  { key: 'social_twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/youraccount' },
  { key: 'social_linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' },
  { key: 'social_youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/yourchannel' },
  { key: 'social_website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
];

export default function AdminBranding() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // Fetch site settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['/api/admin/site-settings'],
    queryFn: () => apiRequest('/api/admin/site-settings'),
    onSuccess: (data: SiteSetting[]) => {
      const socialData: Record<string, string> = {};
      data.forEach(setting => {
        if (setting.key.startsWith('social_')) {
          socialData[setting.key] = setting.value || '';
        }
        if (setting.key === 'site_logo' && setting.value) {
          setLogoPreview(setting.value);
        }
      });
      setSocialLinks(socialData);
    },
  });

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: (data: { key: string; value: string; type?: string; description?: string }) =>
      apiRequest('/api/admin/site-settings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/site-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoSave = () => {
    if (logoFile && logoPreview) {
      updateSettingMutation.mutate({
        key: 'site_logo',
        value: logoPreview,
        type: 'image',
        description: 'Main site logo displayed in header and admin panel'
      });
      setLogoFile(null);
    }
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSocialLinkSave = (key: string) => {
    const value = socialLinks[key] || '';
    const platform = socialPlatforms.find(p => p.key === key);
    
    updateSettingMutation.mutate({
      key,
      value,
      type: 'text',
      description: `${platform?.label} social media link`
    });
  };

  const handleSaveAllSocialLinks = () => {
    const updates = socialPlatforms.map(platform => ({
      key: platform.key,
      value: socialLinks[platform.key] || '',
      type: 'text',
      description: `${platform.label} social media link`
    }));

    Promise.all(
      updates.map(update => 
        apiRequest('/api/admin/site-settings', {
          method: 'POST',
          body: JSON.stringify(update),
        })
      )
    ).then(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/site-settings'] });
      toast({
        title: "Success",
        description: "All social links updated successfully",
      });
    }).catch((error) => {
      toast({
        title: "Error",
        description: "Failed to update some social links",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branding & Social Links</h1>
          <p className="text-muted-foreground">
            Manage your site's branding and social media presence
          </p>
        </div>

        <Tabs defaultValue="logo" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logo">Site Logo</TabsTrigger>
            <TabsTrigger value="social">Social Media Links</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Site Logo Management</CardTitle>
                <CardDescription>
                  Upload and update your site's main logo. This will appear in the header and admin panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Logo Display */}
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Site Logo" 
                        className="max-h-32 mx-auto object-contain"
                      />
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="mx-auto h-12 w-12 mb-2" />
                        <p>No logo uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Upload New Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, SVG. Maximum size: 5MB
                  </p>
                </div>

                {/* Save Button */}
                {logoFile && (
                  <Button 
                    onClick={handleLogoSave}
                    disabled={updateSettingMutation.isPending}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {updateSettingMutation.isPending ? 'Saving...' : 'Save Logo'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Manage your social media links. Only links with values will appear in the footer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.key} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 w-32">
                          <Icon className="h-5 w-5" />
                          <Label className="text-sm font-medium">{platform.label}</Label>
                        </div>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            placeholder={platform.placeholder}
                            value={socialLinks[platform.key] || ''}
                            onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSocialLinkSave(platform.key)}
                            disabled={updateSettingMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          {socialLinks[platform.key] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(socialLinks[platform.key], '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={handleSaveAllSocialLinks}
                  disabled={updateSettingMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateSettingMutation.isPending ? 'Saving...' : 'Save All Social Links'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}