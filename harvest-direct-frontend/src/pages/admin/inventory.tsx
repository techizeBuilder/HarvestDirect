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
  AlertCircle,
  Plus,
  Minus,
  Save,
  ExternalLink
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
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Sample inventory data for demonstration
const SAMPLE_INVENTORY = [
  {
    id: 1,
    name: 'Mountain Coffee Beans',
    sku: 'MCB-001',
    category: 'Coffee & Tea',
    stockQuantity: 100,
    minStockLevel: 20,
    status: 'In Stock',
    location: 'Warehouse A',
    lastUpdated: '2025-05-20',
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  },
  {
    id: 2,
    name: 'Handcrafted Cheese',
    sku: 'HC-002',
    category: 'Dairy',
    stockQuantity: 45,
    minStockLevel: 15,
    status: 'In Stock',
    location: 'Warehouse B',
    lastUpdated: '2025-05-22',
    imageUrl: 'https://images.unsplash.com/photo-1566454419290-57a0589c9c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  },
  {
    id: 3,
    name: 'Organic Spice Mix',
    sku: 'OSM-003',
    category: 'Spices',
    stockQuantity: 8,
    minStockLevel: 15,
    status: 'Low Stock',
    location: 'Warehouse A',
    lastUpdated: '2025-05-21',
    imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  },
  {
    id: 4,
    name: 'Fresh Valley Honey',
    sku: 'FVH-004',
    category: 'Sweeteners',
    stockQuantity: 3,
    minStockLevel: 10,
    status: 'Low Stock',
    location: 'Warehouse C',
    lastUpdated: '2025-05-23',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  },
  {
    id: 5,
    name: 'Organic Tea Sampler',
    sku: 'OTS-005',
    category: 'Coffee & Tea',
    stockQuantity: 25,
    minStockLevel: 10,
    status: 'In Stock',
    location: 'Warehouse A',
    lastUpdated: '2025-05-19',
    imageUrl: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  },
  {
    id: 6,
    name: 'Artisanal Olive Oil',
    sku: 'AOO-006',
    category: 'Oils',
    stockQuantity: 0,
    minStockLevel: 5,
    status: 'Out of Stock',
    location: 'Warehouse B',
    lastUpdated: '2025-05-18',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
  }
];

export default function AdminInventory() {
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState<number>(0);
  const [minStockLevel, setMinStockLevel] = useState<number>(0);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Filter inventory based on search term and status
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'in-stock') {
      matchesStatus = item.status === 'In Stock';
    } else if (statusFilter === 'low-stock') {
      matchesStatus = item.status === 'Low Stock';
    } else if (statusFilter === 'out-of-stock') {
      matchesStatus = item.status === 'Out of Stock';
    }
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const openUpdateDialog = (product: any) => {
    setSelectedProduct(product);
    setUpdateQuantity(product.stockQuantity);
    setIsUpdateDialogOpen(true);
  };

  const openAlertDialog = (product: any) => {
    setSelectedProduct(product);
    setMinStockLevel(product.minStockLevel);
    setIsAlertDialogOpen(true);
  };

  const handleUpdateQuantity = () => {
    if (selectedProduct) {
      // In a real application, you would call your API to update the stock quantity
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedProduct.id) {
          let status = 'In Stock';
          if (updateQuantity <= 0) {
            status = 'Out of Stock';
          } else if (updateQuantity < item.minStockLevel) {
            status = 'Low Stock';
          }
          
          return {
            ...item,
            stockQuantity: updateQuantity,
            status,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      
      setInventory(updatedInventory);
      setIsUpdateDialogOpen(false);
      
      toast({
        title: "Inventory updated",
        description: `Stock quantity for ${selectedProduct.name} has been updated.`,
      });
    }
  };

  const handleUpdateMinStock = () => {
    if (selectedProduct) {
      // In a real application, you would call your API to update the min stock level
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedProduct.id) {
          let status = item.status;
          if (item.stockQuantity <= 0) {
            status = 'Out of Stock';
          } else if (item.stockQuantity < minStockLevel) {
            status = 'Low Stock';
          } else {
            status = 'In Stock';
          }
          
          return {
            ...item,
            minStockLevel,
            status,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      
      setInventory(updatedInventory);
      setIsAlertDialogOpen(false);
      
      toast({
        title: "Alert level updated",
        description: `Low stock alert for ${selectedProduct.name} has been set to ${minStockLevel} units.`,
      });
    }
  };

  const getStockStatusBadge = (status: string) => {
    if (status === 'In Stock') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
    } else if (status === 'Low Stock') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>;
    }
  };

  const getStockLevel = (current: number, min: number) => {
    if (current <= 0) return 0;
    const percentage = Math.min(100, (current / min) * 50); // Scale to make low stock more visible
    return percentage;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Inventory
          </Button>
        </div>

        {/* Low Stock Alert Summary */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-yellow-700">
                {inventory.filter(item => item.status === 'Low Stock').length} products are below their minimum stock level.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {inventory
                  .filter(item => item.status === 'Low Stock')
                  .map(item => (
                    <Badge key={item.id} variant="outline" className="bg-yellow-100 text-yellow-800">
                      {item.name} ({item.stockQuantity}/{item.minStockLevel})
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Inventory List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
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
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Min. Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-md object-cover" 
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={getStockLevel(item.stockQuantity, item.minStockLevel)} className="h-2" />
                          <div className="text-xs mt-1 text-right">{item.stockQuantity} units</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.minStockLevel}</TableCell>
                      <TableCell>
                        {getStockStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openUpdateDialog(item)}
                          >
                            Update Stock
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openAlertDialog(item)}
                          >
                            Set Alert
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

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Stock Quantity</DialogTitle>
            <DialogDescription>
              Adjust the current stock quantity for this product.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-12 h-12 rounded-md object-cover" 
                />
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock-quantity">Current Stock Quantity</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setUpdateQuantity(Math.max(0, updateQuantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="stock-quantity"
                    type="number" 
                    value={updateQuantity} 
                    onChange={(e) => setUpdateQuantity(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="text-center" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setUpdateQuantity(updateQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Stock Status:</p>
                <div className="mt-1">
                  {updateQuantity <= 0 ? (
                    <Badge variant="outline" className="bg-red-100 text-red-800">Out of Stock</Badge>
                  ) : updateQuantity < selectedProduct.minStockLevel ? (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuantity}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Alert Level Dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Low Stock Alert</DialogTitle>
            <DialogDescription>
              Set the minimum stock level at which you want to be alerted.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-12 h-12 rounded-md object-cover" 
                />
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">Current Stock: {selectedProduct.stockQuantity} units</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min-stock">Minimum Stock Level</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setMinStockLevel(Math.max(1, minStockLevel - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="min-stock"
                    type="number" 
                    value={minStockLevel} 
                    onChange={(e) => setMinStockLevel(Math.max(1, parseInt(e.target.value) || 1))} 
                    className="text-center" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setMinStockLevel(minStockLevel + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Alert Status:</p>
                <div className="mt-1">
                  {selectedProduct.stockQuantity < minStockLevel ? (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />
                      <span className="text-yellow-800">Will trigger low stock alert</span>
                    </div>
                  ) : (
                    <span className="text-green-600">Stock level is above minimum</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMinStock}>
              Save Alert Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}