import { Button, ButtonGroup, TextField, Box } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const ProductForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const isEditing = id ? true : false;
  const [image, setImage] = React.useState("");
  const [progress, setProgess] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [product, setProduct] = React.useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  // Fetch product data when editing
  React.useEffect(function () {
    if (isEditing && params.id) {
      axiosInstance
        .get("/api/products/" + params.id)
        .then((res) => {
          setProduct({
            name: res.data.name || "",
            price: res.data.price || "",
            category: res.data.category || "",
            description: res.data.description || "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isEditing, params.id]);

  // Fetch existing categories for dropdown
  React.useEffect(function () {
    axiosInstance
      .get("/api/products")
      .then((res) => {
        // Extract unique categories from products
        const uniqueCategories = [...new Set(res.data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories.sort());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getFormData = () => {
    var form_data = new FormData();
    form_data.append("name", product.name);
    form_data.append("price", product.price);
    form_data.append("category", product.category);
    form_data.append("description", product.description);
    if (image) {
      form_data.append("image", image);
    }
    return form_data;
  };

  return (
    <div>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
        size="small"
      >
        <Button component={Link} to="/">
          Back To Products
        </Button>
        <Button
          variant="contained"
          disabled={sending}
          onClick={(e) => {
            setSending(true);
            if (isEditing)
              axiosInstance
                .put("/api/products/" + params.id, getFormData(), {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (ProgressEvent) => {
                    let progressValue = Math.round(
                      (ProgressEvent.loaded / ProgressEvent.total) * 100
                    );
                    setProgess(progressValue);
                  },
                })
                .then((res) => {
                  setSending(false);
                  navigate("/");
                })
                .catch((err) => {
                  console.log(err);
                  alert("Error updating product");
                  setSending(false);
                });
            else
              axiosInstance
                .post("/api/products", getFormData(), {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (ProgressEvent) => {
                    let progressValue = Math.round(
                      (ProgressEvent.loaded / ProgressEvent.total) * 100
                    );
                    setProgess(progressValue);
                  },
                })
                .then((res) => {
                  setSending(false);
                  navigate("/");
                })
                .catch((err) => {
                  console.log(err);
                  alert("Error creating product");
                  setSending(false);
                });
          }}
        >
          {isEditing ? "Edit Product" : "Add Product"}
        </Button>
      </ButtonGroup>
      <br />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          disabled={sending}
          value={product.name}
          label="Name"
          fullWidth
          required
          variant="outlined"
          onChange={(e) => {
            setProduct({ ...product, name: e.target.value });
          }}
        />

        <TextField
          disabled={sending}
          value={product.price}
          label="Price"
          type="number"
          fullWidth
          required
          variant="outlined"
          inputProps={{ step: "0.01", min: "0" }}
          onChange={(e) => {
            setProduct({ ...product, price: e.target.value });
          }}
        />

        <TextField
          disabled={sending}
          value={product.category}
          label="Category"
          fullWidth
          required
          variant="outlined"
          placeholder="Enter category (e.g., electronics, clothing, food)"
          helperText={categories.length > 0 ? `Existing categories: ${categories.join(", ")}` : "Enter a category name"}
          onChange={(e) => {
            setProduct({ ...product, category: e.target.value });
          }}
        />

        <TextField
          disabled={sending}
          value={product.description}
          label="Description"
          fullWidth
          required
          multiline
          rows={4}
          variant="outlined"
          onChange={(e) => {
            setProduct({ ...product, description: e.target.value });
          }}
        />

        <Box>
          <input
            disabled={sending}
            type="file"
            accept="image/*"
            style={{ marginBottom: "10px" }}
            onChange={(e) => {
              setProgess(0);
              const file = e.target.files[0];
              if (file) {
                setImage(file);
              }
            }}
          />
          {progress > 0 && (
            <div style={{ width: "100%", backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "4px" }}>
              <div style={{ width: `${progress}%`, backgroundColor: "#1976d2", color: "white", padding: "4px", borderRadius: "4px", textAlign: "center" }}>
                Upload Progress: {progress}%
              </div>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ProductForm;
