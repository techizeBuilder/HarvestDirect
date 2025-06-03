import { Product, ProductCategory } from '@shared/schema';

export const productData: Product[] = [
  {
    id: 1,
    name: "Mountain Coffee Beans",
    description: "Hand-picked arabica beans from 5000ft elevation, sun-dried and small-batch roasted.",
    price: 12.50,
    category: ProductCategory.COFFEE_TEA,
    imageUrl: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageUrls: [],
    videoUrl: null,
    farmerId: 1,
    stockQuantity: 100,
    featured: true
  },
  {
    id: 2,
    name: "Organic Black Pepper",
    description: "Bold, aromatic peppercorns from heritage vines, traditionally sun-dried to preserve natural oils.",
    price: 8.95,
    category: ProductCategory.SPICES,
    imageUrl: "https://images.pexels.com/photos/4198772/pexels-photo-4198772.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageUrls: [],
    videoUrl: null,
    farmerId: 3,
    stockQuantity: 120,
    featured: true
  },
  {
    id: 3,
    name: "Premium Cardamom",
    description: "Large, intensely aromatic green cardamom pods grown in virgin forest shade.",
    price: 9.25,
    category: ProductCategory.SPICES,
    imageUrl: "https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageUrls: [],
    videoUrl: null,
    farmerId: 1,
    stockQuantity: 85,
    featured: true
  },
  {
    id: 4,
    name: "Heirloom Rice",
    description: "Ancient grain variety cultivated in terraced paddies using traditional methods for exceptional flavor.",
    price: 7.50,
    category: ProductCategory.GRAINS,
    imageUrl: "https://pixabay.com/get/g8d45ceb30e78f76250dab3a606aa18bf8214f4a0ab35e8d44c5664dbb366d041807b1c61aa3772ea91f20ad4d34d417b94ee538479705a1b1d187d7c9e95f5f0_1280.jpg",
    farmerId: 3,
    stockQuantity: 150,
    featured: true
  },
  {
    id: 5,
    name: "Premium Tea Leaves",
    description: "Tender top leaves hand-plucked from high-altitude tea gardens for exceptional aroma and flavor.",
    price: 14.75,
    category: ProductCategory.COFFEE_TEA,
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 2,
    stockQuantity: 90,
    featured: true
  },
  {
    id: 6,
    name: "Organic Ragi",
    description: "Nutrient-rich finger millet grown using traditional dryland farming techniques for optimal nutrition.",
    price: 6.95,
    category: ProductCategory.GRAINS,
    imageUrl: "https://images.unsplash.com/photo-1563746924237-f81952d6cd7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 3,
    stockQuantity: 110,
    featured: true
  },
  {
    id: 7,
    name: "Pure Moringa Leaves",
    description: "Naturally dried moringa leaves packed with nutrients, grown without chemicals in mineral-rich soil.",
    price: 8.25,
    category: ProductCategory.OTHERS,
    imageUrl: "https://pixabay.com/get/gc85c19a20739ac3b4ef12871ad4e90971fbb4c54b88b5d51f9bee4fab46619226ebf6e1df2b0d3dc1a6e021890ec01d286abc403540e3570930905326b40fac8_1280.jpg",
    farmerId: 2,
    stockQuantity: 75,
    featured: true
  },
  {
    id: 8,
    name: "Areca Catechu",
    description: "Traditional, naturally grown areca nuts harvested at optimal ripeness for authentic flavor.",
    price: 10.50,
    category: ProductCategory.OTHERS,
    imageUrl: "https://pixabay.com/get/g1aa85cd5e6c2f43a2e4529b16ad6d7e6bb4d0ed357fbdf9efe08baf8e60ed45f3d0d2a30d2ed93c374e0b87f05bdb53e85fb32f255de80f9783aafeffb045707_1280.jpg",
    farmerId: 1,
    stockQuantity: 60,
    featured: true
  },
  {
    id: 9,
    name: "Organic Dry Corn",
    description: "Sun-dried, non-GMO corn kernels grown using traditional farming methods.",
    price: 5.95,
    category: ProductCategory.GRAINS,
    imageUrl: "https://images.unsplash.com/photo-1588260693059-0c352a2f9905?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 3,
    stockQuantity: 130,
    featured: false
  },
  {
    id: 10,
    name: "Highland White Pepper",
    description: "Subtle, aromatic white peppercorns cultivated at high elevations for a delicate flavor profile.",
    price: 10.25,
    category: ProductCategory.SPICES,
    imageUrl: "https://images.unsplash.com/photo-1635178802105-86bfb6a2b7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 1,
    stockQuantity: 70,
    featured: false
  },
  {
    id: 11,
    name: "Dark Forest Coffee",
    description: "Robust, dark-roasted coffee grown in the shade of ancient forest canopies.",
    price: 13.75,
    category: ProductCategory.COFFEE_TEA,
    imageUrl: "https://images.unsplash.com/photo-1559525839-d9acfd03200f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 1,
    stockQuantity: 85,
    featured: false
  },
  {
    id: 12,
    name: "Traditional Brown Rice",
    description: "Unpolished, nutrient-rich brown rice grown using ancient farming techniques.",
    price: 8.95,
    category: ProductCategory.GRAINS,
    imageUrl: "https://images.unsplash.com/photo-1622621746668-59fb299bc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    farmerId: 3,
    stockQuantity: 120,
    featured: false
  }
];
