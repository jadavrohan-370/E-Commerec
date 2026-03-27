import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateProducts } from "../utils/generateProducts.js";
import users from "../data/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../data/db.json");

const populate = () => {
  const adminId = "6798e9b0e1a1b1c1d1e1f201"; // Mock admin ID for local JSON DB
  const products = generateProducts(50, adminId);
  
  // Also provide unique IDs for all products
  const productsWithIds = products.map((p, index) => ({
    ...p,
    _id: `prod${index + 1}`.padStart(24, '0') // 24 chars to look like MongoDB ObjectId
  }));

  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      description: "Laptops, phones, and digital gadgets",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "gaming",
      name: "Gaming",
      description: "Consoles, controllers, and immersive gear",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cameras",
      name: "Cameras",
      description: "Professional DSLRs and photography kit",
      image: "https://images.unsplash.com/photo-1452784444945-3f4227083ea2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "audio",
      name: "Audio",
      description: "Headphones, speakers, and sound systems",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const dbData = {
    products: productsWithIds,
    categories,
    users: users.map((u, index) => ({
        ...u,
        _id: `user${index + 1}`.padStart(24, '0'),
        addresses: []
    })),
    orders: []
  };

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf8");
  console.log("db.json populated successfully with 50 products and initial users!");
};

populate();
