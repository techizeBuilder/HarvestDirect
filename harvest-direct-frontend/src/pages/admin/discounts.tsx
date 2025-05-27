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
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Sample discount data for demonstration
const SAMPLE_DISCOUNTS = [
  {
    id: 1,
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    description: 'Welcome discount for new customers',
    minPurchase: 50,
    usageLimit: 1,
    perUser: true,
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    status: 'active',
    used: 45,
    applicableProducts: 'all',
    applicableCategories: 'all'
  },
  {
    id: 2,
    code: 'SUMMER10',
    type: 'percentage',
    value: 10,
    description: 'Summer sale discount',
    minPurchase: 0,
    usageLimit: 0,
    perUser: false,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    used: 78,
    applicableProducts: 'all',
    applicableCategories: 'all'
  },
  {
    id: 3,
    code: 'FREESHIPPING',
    type: 'shipping',
    value: 100,
    description: 'Free shipping on all orders',
    minPurchase: 75,
    usageLimit: 0,
    perUser: false,
    startDate: '2025-05-15',
    endDate: '2025-06-15',
    status: 'active',
    used: 120,
    applicableProducts: 'all',
    applicableCategories: 'all'
  },
  {
    id: 4,
    code: 'COFFEELOVER',
    type: 'percentage',
    value: 15,
    description: 'Discount on coffee products',
    minPurchase: 0,
    usageLimit: 0,
    perUser: false,
    startDate: '2025-04-01',
    endDate: '2025-05-15',
    status: 'expired',
    used: 93,
    applicableProducts: 'selected',
    applicableCategories: 'Coffee & Tea'
  },
  {
    id: 5,
    code: 'FLAT25',
    type: 'fixed',
    value: 25,
    description: 'Flat discount on orders above $100',
    minPurchase: 100,
    usageLimit: 1,
    perUser: true,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: 'scheduled',
    used: 0,
    applicableProducts: 'all',
    applicableCategories: 'all'
  }
];

// Product categories for demonstration
const PRODUCT_CATEGORIES = [
  'Coffee & Tea',
  'Dairy',
  'Spices',
  'Sweeteners',
  'Oils',
  'Snacks',
  'Beverages'
];

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState(SAMPLE_DISCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any | null>(null);
  const [formType, setFormType] = useState('percentage');
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    description: '',
    minPurchase: 0,
    usageLimit: 0,
    perUser: false,
    startDate: '',
    endDate: '',
    applicableProducts: 'all',
    applicableCategories: 'all'
  });
  
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Filter discounts based on search term and status
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = 
      discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || discount.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiscounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const openCreateDialog = () => {
    // Set default form values for a new discount
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      description: '',
      minPurchase: 0,
      usageLimit: 0,
      perUser: false,
      startDate: today,
      endDate: nextMonth.toISOString().split('T')[0],
      applicableProducts: 'all',
      applicableCategories: 'all'
    });
    
    setFormType('percentage');
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (discount: any) => {
    setSelectedDiscount(discount);
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
      minPurchase: discount.minPurchase,
      usageLimit: discount.usageLimit,
      perUser: discount.perUser,
      startDate: discount.startDate,
      endDate: discount.endDate,
      applicableProducts: discount.applicableProducts,
      applicableCategories: discount.applicableCategories
    });
    
    setFormType(discount.type);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (discount: any) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateDiscount = () => {
    // In a real application, you would call your API to create the discount
    const newDiscount = {
      id: Math.max(...discounts.map(d => d.id)) + 1,
      code: formData.code,
      type: formData.type,
      value: formData.value,
      description: formData.description,
      minPurchase: formData.minPurchase,
      usageLimit: formData.usageLimit,
      perUser: formData.perUser,
      startDate: formData.startDate,
      endDate: formData.endDate,
      applicableProducts: formData.applicableProducts,
      applicableCategories: formData.applicableCategories,
      status: new Date(formData.startDate) > new Date() ? 'scheduled' : 'active',
      used: 0
    };
    
    setDiscounts([...discounts, newDiscount]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Discount created",
      description: `Discount code ${formData.code} has been created successfully.`,
    });
  };

  const handleUpdateDiscount = () => {
    if (selectedDiscount) {
      // In a real application, you would call your API to update the discount
      const updatedDiscounts = discounts.map(discount => {
        if (discount.id === selectedDiscount.id) {
          let status = discount.status;
          const today = new Date();
          const startDate = new Date(formData.startDate);
          const endDate = new Date(formData.endDate);
          
          if (startDate > today) {
            status = 'scheduled';
          } else if (endDate < today) {
            status = 'expired';
          } else {
            status = 'active';
          }
          
          return {
            ...discount,
            code: formData.code,
            type: formData.type,
            value: formData.value,
            description: formData.description,
            minPurchase: formData.minPurchase,
            usageLimit: formData.usageLimit,
            perUser: formData.perUser,
            startDate: formData.startDate,
            endDate: formData.endDate,
            applicableProducts: formData.applicableProducts,
            applicableCategories: formData.applicableCategories,
            status
          };
        }
        return discount;
      });
      
      setDiscounts(updatedDiscounts);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Discount updated",
        description: `Discount code ${formData.code} has been updated successfully.`,
      });
    }
  };

  const handleDeleteDiscount = () => {
    if (selectedDiscount) {
      // In a real application, you would call your API to delete the discount
      setDiscounts(discounts.filter(discount => discount.id !== selectedDiscount.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Discount deleted",
        description: `Discount code ${selectedDiscount.code} has been deleted.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    } else if (status === 'scheduled') {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discounts & Coupons</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </Button>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Discount Codes</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discounts..."
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
                    <SelectItem value="all">All Discounts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
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
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Minimum Purchase</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-mono">{discount.code}</div>
                          <div className="text-xs text-muted-foreground mt-1">{discount.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {discount.type === 'percentage' ? 'Percentage' : 
                         discount.type === 'fixed' ? 'Fixed Amount' : 'Free Shipping'}
                      </TableCell>
                      <TableCell>
                        {discount.type === 'percentage' ? `${discount.value}%` : 
                         discount.type === 'fixed' ? `$${discount.value.toFixed(2)}` : '100%'}
                      </TableCell>
                      <TableCell>
                        {discount.minPurchase > 0 ? `$${discount.minPurchase.toFixed(2)}` : 'None'}
                      </TableCell>
                      <TableCell>
                        {discount.usageLimit > 0 ? (
                          <div>
                            <div>{discount.used} / {discount.usageLimit}</div>
                            <div className="text-xs text-muted-foreground">
                              {discount.perUser ? 'Per user' : 'Total'}
                            </div>
                          </div>
                        ) : (
                          'Unlimited'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <div className="text-xs">
                            <div>{discount.startDate}</div>
                            <div>to {discount.endDate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(discount.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(discount)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(discount)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
      </div>

      {/* Create Discount Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Discount</DialogTitle>
            <DialogDescription>
              Set up a new discount or coupon code for your store.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="usage">Usage Limits</TabsTrigger>
              <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (internal)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="e.g. Summer sale discount"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select 
                  value={formType} 
                  onValueChange={(value) => {
                    setFormType(value);
                    handleFormChange('type', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Discount</SelectItem>
                    <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formType !== 'shipping' && (
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {formType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleFormChange('value', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={formType === 'percentage' ? 100 : undefined}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Usage Limits Tab */}
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minPurchase">Minimum Purchase Amount ($)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => handleFormChange('minPurchase', parseFloat(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">Set to 0 for no minimum</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleFormChange('usageLimit', parseInt(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">Set to 0 for unlimited usage</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="perUser"
                  checked={formData.perUser}
                  onCheckedChange={(checked) => handleFormChange('perUser', checked)}
                  disabled={formData.usageLimit === 0}
                />
                <Label htmlFor="perUser">Limit usage to once per customer</Label>
              </div>
            </TabsContent>
            
            {/* Restrictions Tab */}
            <TabsContent value="restrictions" className="space-y-4">
              <div className="space-y-2">
                <Label>Product Restrictions</Label>
                <Select 
                  value={formData.applicableProducts} 
                  onValueChange={(value) => handleFormChange('applicableProducts', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="selected">Selected Products</SelectItem>
                    <SelectItem value="categories">Selected Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.applicableProducts === 'categories' && (
                <div className="space-y-2">
                  <Label>Applicable Categories</Label>
                  <Select 
                    value={formData.applicableCategories} 
                    onValueChange={(value) => handleFormChange('applicableCategories', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formData.applicableProducts === 'selected' && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Product selection would be implemented here in a real application, allowing you to select specific products to which this discount applies.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDiscount}>
              <Tag className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog (Same structure as Create) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>
              Update the settings for this discount code.
            </DialogDescription>
          </DialogHeader>
          {/* Same tabs and form as the Create Dialog */}
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="usage">Usage Limits</TabsTrigger>
              <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Coupon Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (internal)</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="e.g. Summer sale discount"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select 
                  value={formType} 
                  onValueChange={(value) => {
                    setFormType(value);
                    handleFormChange('type', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Discount</SelectItem>
                    <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formType !== 'shipping' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-value">
                    {formType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                  </Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleFormChange('value', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={formType === 'percentage' ? 100 : undefined}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Usage Limits Tab */}
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minPurchase">Minimum Purchase Amount ($)</Label>
                <Input
                  id="edit-minPurchase"
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => handleFormChange('minPurchase', parseFloat(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">Set to 0 for no minimum</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                <Input
                  id="edit-usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleFormChange('usageLimit', parseInt(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">Set to 0 for unlimited usage</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-perUser"
                  checked={formData.perUser}
                  onCheckedChange={(checked) => handleFormChange('perUser', checked)}
                  disabled={formData.usageLimit === 0}
                />
                <Label htmlFor="edit-perUser">Limit usage to once per customer</Label>
              </div>
            </TabsContent>
            
            {/* Restrictions Tab */}
            <TabsContent value="restrictions" className="space-y-4">
              <div className="space-y-2">
                <Label>Product Restrictions</Label>
                <Select 
                  value={formData.applicableProducts} 
                  onValueChange={(value) => handleFormChange('applicableProducts', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="selected">Selected Products</SelectItem>
                    <SelectItem value="categories">Selected Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.applicableProducts === 'categories' && (
                <div className="space-y-2">
                  <Label>Applicable Categories</Label>
                  <Select 
                    value={formData.applicableCategories} 
                    onValueChange={(value) => handleFormChange('applicableCategories', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDiscount}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this discount code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDiscount && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 text-red-600 rounded-full p-2">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{selectedDiscount.code}</p>
                  <p className="text-sm text-muted-foreground">{selectedDiscount.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiscount}>
              Delete Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}