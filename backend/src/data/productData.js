import { ProductCategory } from "../../../shared/schema.js";

export const productData = [
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
    imageUrl: "https://news.grainpro.com/hs-fs/hubfs/15388486202_1eac022edd_o.jpg?width=2832&name=15388486202_1eac022edd_o.jpg",
    imageUrls: [],
    videoUrl: null,
    farmerId: 3,
    stockQuantity: 150,
    featured: true
  },
  {
    id: 5,
    name: "Premium Tea Leaves",
    description: "Hand-rolled orthodox tea with delicate floral notes from high-altitude gardens.",
    price: 11.75,
    category: ProductCategory.COFFEE_TEA,
    imageUrl: "https://images.pexels.com/photos/5947030/pexels-photo-5947030.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageUrls: [],
    videoUrl: null,
    farmerId: 2,
    stockQuantity: 90,
    featured: true
  }
];