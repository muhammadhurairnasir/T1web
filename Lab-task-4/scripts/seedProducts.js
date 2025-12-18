require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Counter = require("../models/Counter");

const sampleProducts = [
  {
    name: "Safari Tour Package",
    price: 299.99,
    category: "Tours",
    image: "/images/BG1.jpg",
    description: "Experience the wild beauty of Africa with our premium safari tour package."
  },
  {
    name: "Wildlife Photography Guide",
    price: 49.99,
    category: "Books",
    image: "/images/BG2.jpg",
    description: "Complete guide to capturing stunning wildlife photographs."
  },
  {
    name: "African Safari Hat",
    price: 29.99,
    category: "Accessories",
    image: "/images/square.png",
    description: "Stylish and practical hat for your safari adventure."
  },
  {
    name: "Binoculars Pro",
    price: 199.99,
    category: "Equipment",
    image: "/images/BG3.jpg",
    description: "High-quality binoculars for wildlife observation."
  },
  {
    name: "Safari Adventure Book",
    price: 24.99,
    category: "Books",
    image: "/images/BG4.jpg",
    description: "Stories and adventures from African safaris."
  },
  {
    name: "Camping Tent",
    price: 399.99,
    category: "Equipment",
    image: "/images/BG5.jpg",
    description: "Durable tent for your safari camping experience."
  },
  {
    name: "Wildlife T-Shirt",
    price: 19.99,
    category: "Clothing",
    image: "/images/square.png",
    description: "Comfortable t-shirt with wildlife designs."
  },
  {
    name: "Safari Backpack",
    price: 79.99,
    category: "Accessories",
    image: "/images/BG6.jpg",
    description: "Spacious backpack perfect for safari trips."
  },
  {
    name: "Animal Field Guide",
    price: 34.99,
    category: "Books",
    image: "/images/egypt.png",
    description: "Comprehensive guide to African wildlife."
  },
  {
    name: "Safari Boots",
    price: 129.99,
    category: "Clothing",
    image: "/images/congo.png",
    description: "Comfortable and durable boots for safari walks."
  },
  {
    name: "Camera Lens Kit",
    price: 599.99,
    category: "Equipment",
    image: "/images/sahara.png",
    description: "Professional camera lens kit for wildlife photography."
  },
  {
    name: "Safari Map Collection",
    price: 14.99,
    category: "Accessories",
    image: "/images/square.png",
    description: "Detailed maps of African safari destinations."
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/besafari");
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Reset counter
    await Counter.findByIdAndUpdate(
      { _id: "productId" },
      { seq: 0 },
      { upsert: true }
    );
    console.log("Reset product counter");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();

