import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { insertFarmerSchema, type Farmer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw,
  Upload,
  ImageIcon,
  X
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Create a comprehensive validation schema for the farmer form
const farmerFormSchema = insertFarmerSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialty: z.string().min(2, "Specialty must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  story: z.string().min(10, "Story must be at least 10 characters"),
  farmName: z.string().optional(),
  certificationStatus: z.enum(["none", "organic", "certified", "pending"]).default("none"),
  certificationDetails: z.string().optional(),
  farmSize: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
  website: z.string().url().optional().or(z.literal("")),
  socialMedia: z.string().optional(),
  bankAccount: z.string().optional(),
  panNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL"),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  active: z.boolean().default(true)
});

// Type definition for our form
type FarmerFormValues = z.infer<typeof farmerFormSchema>;

export default function FarmerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

  // Fetch farmers data
  const { 
    data: farmers = [], 
    isLoading,
    refetch 
  } = useQuery<Farmer[]>({ 
    queryKey: ['/api/admin/farmers'],
  });

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Set the image URL for both forms
        addForm.setValue("imageUrl", result);
        editForm.setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview("");
    addForm.setValue("imageUrl", "");
    editForm.setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add farmer mutation
  const addFarmerMutation = useMutation({
    mutationFn: async (data: FarmerFormValues) => {
      return apiRequest("/api/admin/farmers", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Farmer added successfully",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/farmers'] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to add farmer",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Update farmer mutation
  const updateFarmerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FarmerFormValues }) => {
      return apiRequest(`/api/admin/farmers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Farmer updated successfully",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/farmers'] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update farmer",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Delete farmer mutation
  const deleteFarmerMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/farmers/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Farmer deleted successfully",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/farmers'] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete farmer",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  });

  // Set up add form
  const addForm = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      location: "",
      story: "",
      imageUrl: "",
      featured: false
    }
  });

  // Set up edit form
  const editForm = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      location: "",
      story: "",
      imageUrl: "",
      featured: false
    }
  });

  // Handle add form submission
  const onAddSubmit = (data: FarmerFormValues) => {
    addFarmerMutation.mutate(data);
  };

  // Handle edit form submission
  const onEditSubmit = (data: FarmerFormValues) => {
    if (currentFarmer) {
      updateFarmerMutation.mutate({ id: currentFarmer.id, data });
    }
  };

  // Open edit dialog and set form values
  const handleEditClick = (farmer: Farmer) => {
    setCurrentFarmer(farmer);
    editForm.reset({
      name: farmer.name,
      specialty: farmer.specialty,
      location: farmer.location,
      story: farmer.story,
      imageUrl: farmer.imageUrl,
      featured: farmer.featured || false
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (farmer: Farmer) => {
    setCurrentFarmer(farmer);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (currentFarmer) {
      deleteFarmerMutation.mutate(currentFarmer.id);
    }
  };

  // Filter farmers based on search term
  const filteredFarmers = farmers.filter((farmer: Farmer) => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Farmer Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()} 
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Farmer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Farmer</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new farmer to the platform.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Farmer's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialty</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Coffee, Spices" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={addForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Farm location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="story"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Story</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell the farmer's story..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Feature this farmer on the homepage
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addFarmerMutation.isPending}
                      >
                        {addFarmerMutation.isPending ? "Adding..." : "Add Farmer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-muted-foreground">Loading farmers...</div>
                </TableCell>
              </TableRow>
            ) : filteredFarmers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="text-muted-foreground">
                    {searchTerm ? "No farmers match your search" : "No farmers found"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredFarmers.map((farmer: Farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0"
                        style={{ backgroundImage: `url(${farmer.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      ></div>
                      <span>{farmer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{farmer.specialty}</TableCell>
                  <TableCell>{farmer.location}</TableCell>
                  <TableCell>
                    {farmer.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Regular
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(farmer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(farmer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Farmer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Farmer</DialogTitle>
            <DialogDescription>
              Update the farmer's information.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Feature this farmer on the homepage
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateFarmerMutation.isPending}
                >
                  {updateFarmerMutation.isPending ? "Updating..." : "Update Farmer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Farmer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentFarmer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteFarmerMutation.isPending}
            >
              {deleteFarmerMutation.isPending ? "Deleting..." : "Delete Farmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}