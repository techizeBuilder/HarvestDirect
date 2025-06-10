import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ChevronRight, FolderOpen, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  createdAt: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<{ [key: number]: Category[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateSubcategoryDialog, setShowCreateSubcategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryDescription, setSubcategoryDescription] = useState("");

  // Fetch all categories and subcategories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch('/api/admin/categories/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const allCategories = await response.json();
        const mainCategories = allCategories.filter((cat: Category) => !cat.parentId);
        const subCats: { [key: number]: Category[] } = {};
        
        allCategories.forEach((cat: Category) => {
          if (cat.parentId) {
            if (!subCats[cat.parentId]) {
              subCats[cat.parentId] = [];
            }
            subCats[cat.parentId].push(cat);
          }
        });

        setCategories(mainCategories);
        setSubcategories(subCats);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new category
  const createCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription
        })
      });

      if (response.ok) {
        await fetchCategories();
        setShowCreateDialog(false);
        setCategoryName("");
        setCategoryDescription("");
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  // Create a new subcategory
  const createSubcategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token || !selectedCategory) return;

      const response = await fetch(`/api/admin/categories/${selectedCategory.id}/subcategories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: subcategoryName,
          description: subcategoryDescription
        })
      });

      if (response.ok) {
        await fetchCategories();
        setShowCreateSubcategoryDialog(false);
        setSubcategoryName("");
        setSubcategoryDescription("");
        toast({
          title: 'Success',
          description: 'Subcategory created successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create subcategory',
        variant: 'destructive',
      });
    }
  };

  // Update a category
  const updateCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token || !editingCategory) return;

      const endpoint = editingCategory.parentId 
        ? `/api/admin/subcategories/${editingCategory.id}`
        : `/api/admin/categories/${editingCategory.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription
        })
      });

      if (response.ok) {
        await fetchCategories();
        setShowEditDialog(false);
        setEditingCategory(null);
        setCategoryName("");
        setCategoryDescription("");
        toast({
          title: 'Success',
          description: `${editingCategory.parentId ? 'Subcategory' : 'Category'} updated successfully`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  // Delete a category or subcategory
  const deleteCategory = async (category: Category) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const endpoint = category.parentId 
        ? `/api/admin/subcategories/${category.id}`
        : `/api/admin/categories/${category.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCategories();
        toast({
          title: 'Success',
          description: `${category.parentId ? 'Subcategory' : 'Category'} deleted successfully`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setShowEditDialog(true);
  };

  // Open create subcategory dialog
  const openCreateSubcategoryDialog = (category: Category) => {
    setSelectedCategory(category);
    setShowCreateSubcategoryDialog(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-forest">Category Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage product categories and subcategories
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-description">Description (Optional)</Label>
                <Input
                  id="category-description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createCategory}
                  disabled={!categoryName.trim()}
                >
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground mb-2">No Categories Found</p>
              <p className="text-muted-foreground text-center mb-4">
                Create your first category to organize your products
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="p-1"
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            expandedCategories.has(category.id) ? 'rotate-90' : ''
                          }`} 
                        />
                      </Button>
                      <Folder className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {subcategories[category.id]?.length || 0} subcategories
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCreateSubcategoryDialog(category)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Subcategory
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              {subcategories[category.id]?.length > 0 && (
                                <span className="block mt-2 text-orange-600">
                                  This category has {subcategories[category.id].length} subcategories that will also be deleted.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCategory(category)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedCategories.has(category.id) && subcategories[category.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0">
                        <div className="ml-8 space-y-2">
                          {subcategories[category.id].map((subcategory) => (
                            <div
                              key={subcategory.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{subcategory.name}</p>
                                  {subcategory.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {subcategory.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(subcategory)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{subcategory.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteCategory(subcategory)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editingCategory?.parentId ? 'Subcategory' : 'Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="edit-category-description">Description (Optional)</Label>
              <Input
                id="edit-category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateCategory}
                disabled={!categoryName.trim()}
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Subcategory Dialog */}
      <Dialog open={showCreateSubcategoryDialog} onOpenChange={setShowCreateSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Subcategory to "{selectedCategory?.name}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subcategory-name">Subcategory Name</Label>
              <Input
                id="subcategory-name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </div>
            <div>
              <Label htmlFor="subcategory-description">Description (Optional)</Label>
              <Input
                id="subcategory-description"
                value={subcategoryDescription}
                onChange={(e) => setSubcategoryDescription(e.target.value)}
                placeholder="Enter subcategory description"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateSubcategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createSubcategory}
                disabled={!subcategoryName.trim()}
              >
                Create Subcategory
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}