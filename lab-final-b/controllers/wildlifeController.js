const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/images";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).single("image");

// Get all products with pagination and filtering
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get products with pagination
    const products = await Product.find(filter)
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit);
    
    // Get unique categories for filter dropdown
    const categories = await Product.distinct("category");
    
    res.render("wildlife", {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      limit,
      categories,
      filters: {
        category: req.query.category || 'all',
        minPrice: req.query.minPrice || '',
        maxPrice: req.query.maxPrice || ''
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).render("wildlife", {
      products: [],
      error: "Error loading products",
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      limit: 10,
      categories: [],
      filters: { category: 'all', minPrice: '', maxPrice: '' }
    });
  }
};

// Create new product
exports.create = async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      category,
      image: image || "/images/square.png",
      description
    });
    await newProduct.save();
    res.redirect("/wildlife");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).redirect("/wildlife?error=Failed to create product");
  }
};

// Update existing product
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, image, description } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (description) updateData.description = description;

    const numericId = parseInt(id);
    const updated =
      (await Product.findOneAndUpdate({ id: numericId }, updateData, { new: true })) ||
      (await Product.findByIdAndUpdate(id, updateData, { new: true }));

    if (!updated) {
      return res.status(404).redirect("/wildlife?error=Product not found");
    }

    res.redirect("/wildlife");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).redirect("/wildlife?error=Failed to update product");
  }
};

// Delete product
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ id: parseInt(id) }) || 
                    await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).redirect("/wildlife?error=Product not found");
    }
    res.redirect("/wildlife");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).redirect("/wildlife?error=Failed to delete product");
  }
};

// Get all products as JSON (API endpoint)
exports.getAllJSON = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error loading products" });
  }
};

// Get single product by ID as JSON
exports.getByIdJSON = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id: parseInt(id) }) || 
                    await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error loading product" });
  }
};

// Create product (API with file upload)
exports.createJSON = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, price, category, description } = req.body;
      
      // Handle image upload
      let imagePath = "/images/square.png"; // default
      if (req.file) {
        imagePath = "/images/" + req.file.filename;
      }

      const newProduct = new Product({
        name: name || "",
        price: price ? parseFloat(price) : 0,
        category: category || "general",
        image: imagePath,
        description: description || "",
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });
};

// Update product (API with file upload)
exports.updateJSON = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const { name, price, category, description } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (category) updateData.category = category;
      if (description) updateData.description = description;

      // Handle image upload
      if (req.file) {
        updateData.image = "/images/" + req.file.filename;
      }

      const numericId = parseInt(id);
      const updated =
        (await Product.findOneAndUpdate(
          { id: numericId },
          updateData,
          { new: true }
        )) ||
        (await Product.findByIdAndUpdate(id, updateData, { new: true }));

      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });
};

// Delete product (API)
exports.deleteJSON = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted =
      (await Product.findOneAndDelete({ id: parseInt(id) })) ||
      (await Product.findByIdAndDelete(id));
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", product: deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

