import dotenv from "dotenv";
import Product from "../models/productModel.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const categoryImages = {
  'Air Conditioner': [
    'https://images.unsplash.com/photo-1585338107529-13afc5f0171f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591185473233-2999b5a14643?q=80&w=800&auto=format&fit=crop'
  ],
  'Television': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop'
  ],
  'Refrigerator': [
    'https://images.unsplash.com/photo-1571175439180-6ac6043bc281?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
  ],
  'Washing Machine': [
    'https://images.unsplash.com/photo-1626806819282-2c13b3ad5e81?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop'
  ],
  'Microwave Oven': [
    'https://images.unsplash.com/photo-1585659722982-7d634f37a851?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574265366533-547ca9539796?q=80&w=800&auto=format&fit=crop'
  ],
  'Laptop': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517336713914-89b9388c0ef5?q=80&w=800&auto=format&fit=crop'
  ],
  'Mobile Phone': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop'
  ],
  'Speakers': [
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=800&auto=format&fit=crop'
  ],
  'Smart Watch': [
    'https://images.unsplash.com/photo-1544117518-30df16413a48?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd1808068?q=80&w=800&auto=format&fit=crop'
  ]
};

const fixImages = async () => {
  try {
    const products = await Product.find({});
    console.log(`Analyzing ${products.length} products...`);

    let updatedCount = 0;

    for (const product of products) {
      if (product?.images?.some(img => img.includes('source.unsplash.com'))) {
        product.images = categoryImages[product.category] || [
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop'
        ];
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Success! Updated ${updatedCount} products with high-quality reliable images.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixImages();
