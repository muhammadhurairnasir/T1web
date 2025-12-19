import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { fetchProducts } from "../../store/actions/productActions";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsData.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const averagePrice =
    totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        boxShadow: 2,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", color }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color: color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={ShoppingCartIcon}
            color="#FF6B6B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`Rs. ${totalValue}`}
            icon={InventoryIcon}
            color="#4ECDC4"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Price"
            value={`Rs. ${averagePrice}`}
            icon={StorefrontIcon}
            color="#95E1D3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={categoriesCount}
            icon={StorefrontIcon}
            color="#F38181"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Quick Actions
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/products"
              size="small"
            >
              View Products
            </Button>
            <Button
              variant="contained"
              color="success"
              component={Link}
              to="/products/create"
              size="small"
            >
              Add Product
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
