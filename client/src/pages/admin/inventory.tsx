import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, AlertTriangle, CheckCircle, Edit, Save, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stockQuantity: number;
  price: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  stockQuantity: number;
  threshold: number;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [stockInput, setStockInput] = useState<string>('');
  const [stockThreshold, setStockThreshold] = useState(10);
  const { toast } = useToast();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  // Fetch low stock products
  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(`/api/admin/low-stock?threshold=${stockThreshold}`);
      const data = await response.json();
      if (data.lowStockProducts) {
        setLowStockProducts(data.lowStockProducts);
      }
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
  };

  // Update product stock
  const updateProductStock = async (productId: number, newStock: number) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockQuantity: newStock }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Stock updated successfully",
        });
        
        // Update local state
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, stockQuantity: newStock, updatedAt: new Date().toISOString() }
            : product
        ));
        
        setEditingProduct(null);
        setStockInput('');
        
        // Refresh low stock alerts
        fetchLowStockProducts();
      } else {
        throw new Error(data.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Stock update error:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  // Validate stock availability
  const validateStock = async (productId: number, quantity: number) => {
    try {
      const response = await fetch('/api/admin/validate-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stock validation error:', error);
      return { available: false, currentStock: 0, requestedQuantity: quantity };
    }
  };

  // Handle stock edit
  const handleStockEdit = (product: Product) => {
    setEditingProduct(product.id);
    setStockInput(product.stockQuantity.toString());
  };

  // Handle stock save
  const handleStockSave = async (productId: number) => {
    const newStock = parseInt(stockInput);
    if (isNaN(newStock) || newStock < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid stock quantity",
        variant: "destructive",
      });
      return;
    }

    await updateProductStock(productId, newStock);
  };

  // Cancel stock edit
  const cancelStockEdit = () => {
    setEditingProduct(null);
    setStockInput('');
  };

  // Get stock status badge
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= stockThreshold) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchLowStockProducts()]);
      setIsLoading(false);
    };

    loadData();
  }, [stockThreshold]);

  if (isLoading) {
    return (
      <AdminAuthWrapper>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading inventory...</span>
          </div>
        </AdminLayout>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage product stock levels and monitor inventory status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="threshold">Low Stock Threshold:</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(Number(e.target.value))}
                  className="w-20"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Low Stock Alerts ({lowStockProducts.length})
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Products running low on inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="destructive">{product.stockQuantity} remaining</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inventory Overview Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.stockQuantity > stockThreshold).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {lowStockProducts.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.stockQuantity === 0).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                View and manage stock levels for all products. Changes sync automatically with Enhanced Products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku || 'N/A'}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>
                        {editingProduct === product.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              className="w-20"
                              min="0"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleStockSave(product.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelStockEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{product.stockQuantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStockEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStockStatus(product.stockQuantity)}</TableCell>
                      <TableCell>
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Validate Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Stock Validation - {product.name}</DialogTitle>
                              <DialogDescription>
                                Test stock availability for order processing
                              </DialogDescription>
                            </DialogHeader>
                            <StockValidationDialog 
                              product={product} 
                              validateStock={validateStock} 
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}

// Stock Validation Dialog Component
function StockValidationDialog({ 
  product, 
  validateStock 
}: { 
  product: Product; 
  validateStock: (productId: number, quantity: number) => Promise<any>; 
}) {
  const [testQuantity, setTestQuantity] = useState(1);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidation = async () => {
    setIsValidating(true);
    const result = await validateStock(product.id, testQuantity);
    setValidationResult(result);
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="test-quantity">Test Quantity</Label>
        <Input
          id="test-quantity"
          type="number"
          value={testQuantity}
          onChange={(e) => setTestQuantity(Number(e.target.value))}
          min="1"
        />
      </div>
      
      <Button onClick={handleValidation} disabled={isValidating}>
        {isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          'Validate Stock'
        )}
      </Button>
      
      {validationResult && (
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Validation Result</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Stock:</span>
              <span>{validationResult.currentStock}</span>
            </div>
            <div className="flex justify-between">
              <span>Requested Quantity:</span>
              <span>{validationResult.requestedQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Available:</span>
              <span className={validationResult.available ? 'text-green-600' : 'text-red-600'}>
                {validationResult.available ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}