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
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Sample product data for demonstration
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Mountain Coffee Beans',
    description: 'Hand-picked arabica beans from 5000ft elevation, sun-dried and small-batch roasted.',
    price: 12.50,
    category: 'Coffee & Tea',
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    featured: true
  },
  {
    id: 2,
    name: 'Handcrafted Cheese',
    description: 'Artisanal cheese made from organic, grass-fed cow milk using traditional methods.',
    price: 14.99,
    category: 'Dairy',
    stockQuantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1566454419290-57a0589c9c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    featured: true
  },
  {
    id: 3,
    name: 'Organic Spice Mix',
    description: 'A blend of hand-ground spices sourced from sustainable farms.',
    price: 9.95,
    category: 'Spices',
    stockQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    featured: false
  },
  {
    id: 4,
    name: 'Fresh Valley Honey',
    description: 'Raw, unfiltered honey from mountain wildflowers.',
    price: 8.75,
    category: 'Sweeteners',
    stockQuantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    featured: true
  },
  {
    id: 5,
    name: 'Organic Tea Sampler',
    description: 'Collection of organic teas from different regions.',
    price: 19.95,
    category: 'Coffee & Tea',
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    featured: false
  }
];

export default function AdminProducts() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const { toast } = useToast();

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleDeleteProduct = (id: number) => {
    // In a real application, you would call your API to delete the product
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  const handleToggleFeatured = (id: number) => {
    // In a real application, you would call your API to update the product
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, featured: !product.featured } 
        : product
    ));
    
    const product = products.find(p => p.id === id);
    toast({
      title: product?.featured ? "Product unfeatured" : "Product featured",
      description: `${product?.name} has been ${product?.featured ? 'removed from' : 'added to'} featured products.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle>Product List</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-md" 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={product.stockQuantity < 10 ? "text-red-500" : ""}>
                        {product.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant={product.featured ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleToggleFeatured(product.id)}
                      >
                        {product.featured ? "Featured" : "Not Featured"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
    </AdminLayout>
  );
}