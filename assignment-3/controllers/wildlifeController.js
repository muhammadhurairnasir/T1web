const Product = require("../models/Product");

// Get all products with pagination and filtering
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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

