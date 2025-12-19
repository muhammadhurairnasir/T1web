import React from "react";
import Login from "./components/views/auth/Login";
import Register from "./components/views/auth/Register";
import Products from "./products/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProductDetails from "./products/ProductDetails";
import ProductForm from "./products/ProductForm";
import { Container } from "@mui/material";
import { Provider } from "react-redux";
import store from "./store";
import NavBar from "./components/layout/NavBar";
import MenuColorChanger from "./components/redux-examples/MenuColorChanger";
import ReduxThunkExample from "./components/redux-examples/ReduxThunkExample";
import Dashboard from "./components/views/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderList from "./components/views/OrderList";
import OrderStats from "./components/views/OrderStats";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router basename={"/admin"}>
          <NavBar />
          <Container maxWidth="lg">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
              <Route path="/products/create" element={<ProtectedRoute element={<ProductForm />} />} />
              <Route path="/products/edit/:id" element={<ProtectedRoute element={<ProductForm />} />} />
              <Route
                path="/products/details/:id"
                element={<ProtectedRoute element={<ProductDetails />} />}
              />
              <Route path="/orders" element={<ProtectedRoute element={<OrderList />} />} />
              <Route path="/orders/stats" element={<ProtectedRoute element={<OrderStats />} />} />
              <Route
                path="/redux-thunk-example"
                element={<ProtectedRoute element={<ReduxThunkExample />} />}
              />
              <Route path="/redux-example" element={<ProtectedRoute element={<MenuColorChanger />} />} />
            </Routes>
          </Container>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
