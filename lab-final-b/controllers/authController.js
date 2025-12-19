// Simple authentication controller
// In production, use proper JWT with bcrypt and user model

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple hardcoded authentication for demo
    // In production, check against database with hashed passwords
    if (email === "admin@admin.com" && password === "admin") {
      // Generate a simple token (in production, use jsonwebtoken)
      const token = "demo-jwt-token-" + Date.now();
      res.json(token);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
