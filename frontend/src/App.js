import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import StatCards from "./components/StatCards";
import OrderModal from "./components/OrderModal";

import InventoryView from "./views/InventoryView";
import CustomersView from "./views/CustomersView";
import OrdersView from "./views/OrdersView";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [stats, setStats] = useState({
    total_products: 0,
    low_stock: 0,
    total_orders: 0,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity_in_stock: "",
  });
  const [customerForm, setCustomerForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    product_id: "",
    quantity: "1",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pRes = await axios.get(`${API_URL}/products`);
      const cRes = await axios.get(`${API_URL}/customers`);
      const sRes = await axios.get(`${API_URL}/stats`);
      const oRes = await axios.get(`${API_URL}/orders`);
      setProducts(pRes.data);
      setCustomers(cRes.data);
      setStats(sRes.data);
      setOrdersList(oRes.data);
    } catch (err) {
      console.error("Error fetching execution schema state", err);
    }
  };

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/products/${editProductId}`, productForm);
        showMsg("Product updated successfully!", "success");
        setIsEditing(false);
        setEditProductId(null);
      } else {
        await axios.post(`${API_URL}/products`, productForm);
        showMsg("Product added successfully!", "success");
      }
      setProductForm({ name: "", sku: "", price: "", quantity_in_stock: "" });
      fetchData();
    } catch (err) {
      showMsg(
        err.response?.data?.error || "Error processing product request",
        "error",
      );
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product.id);
    setProductForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        showMsg("Product removed from inventory", "success");
        if (editProductId === id) {
          setIsEditing(false);
          setEditProductId(null);
          setProductForm({
            name: "",
            sku: "",
            price: "",
            quantity_in_stock: "",
          });
        }
        fetchData();
      } catch (err) {
        showMsg(
          err.response?.data?.error || "Failed to delete product",
          "error",
        );
      }
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/customers`, customerForm);
      showMsg("Customer registered successfully!", "success");
      setCustomerForm({ full_name: "", email: "", phone_number: "" });
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.error || "Registration failed", "error");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This will clear their profile.",
      )
    ) {
      try {
        await axios.delete(`${API_URL}/customers/${id}`);
        showMsg("Customer profiles updated successfully", "success");
        fetchData();
      } catch (err) {
        showMsg(
          err.response?.data?.error || "Failed to delete customer",
          "error",
        );
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const formattedPayload = {
        customer_id: parseInt(orderForm.customer_id),
        items: [
          {
            product_id: parseInt(orderForm.product_id),
            quantity: parseInt(orderForm.quantity || 1),
          },
        ],
      };
      await axios.post(`${API_URL}/orders`, formattedPayload);
      showMsg("🛒 Order processed and stock decremented!", "success");
      setOrderForm({ customer_id: "", product_id: "", quantity: "1" });
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.error || "Order placement failed", "error");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to cancel Order #ORD-${id}? This will reverse the product stock.`,
      )
    ) {
      try {
        await axios.delete(`${API_URL}/orders/${id}`);
        showMsg(`Order #ORD-${id} cancelled and stock restored!`, "success");
        fetchData();
      } catch (err) {
        showMsg(
          err.response?.data?.error || "Failed to cancel the order",
          "error",
        );
      }
    }
  };

  const handleViewOrderDetails = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/orders/${id}`);
      setSelectedOrderDetails(res.data);
      setIsModalOpen(true);
    } catch (err) {
      showMsg(
        err.response?.data?.error || "Failed to fetch order details",
        "error",
      );
    }
  };

  return (
    <div className="admin-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "inventory" && "Inventory Management"}
            {activeTab === "customers" && "Customer Management"}
            {activeTab === "orders" && "Order Panel"}
          </h1>
        </header>

        {message.text && (
          <div
            className={
              message.type === "success" ? "success-banner" : "error-banner"
            }
          >
            {message.text}
          </div>
        )}

        <StatCards stats={stats} />

        <div className="view-container">
          {activeTab === "dashboard" && (
            <div className="dashboard-view-grid">
              <div className="modern-card">
                <h3>System Quick Links</h3>
                <p>Welcome to your Inventory and Product Management System.</p>
                <div className="quick-actions-box">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="btn-accent"
                  >
                    Quick Order
                  </button>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="btn-secondary"
                  >
                    Check Stock
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <InventoryView
              productForm={productForm}
              setProductForm={setProductForm}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setEditProductId={setEditProductId}
              handleProductSubmit={handleProductSubmit}
              products={products}
              handleEditClick={handleEditClick}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === "customers" && (
            <CustomersView
              customerForm={customerForm}
              setCustomerForm={setCustomerForm}
              handleCustomerSubmit={handleCustomerSubmit}
              customers={customers}
              handleDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === "orders" && (
            <OrdersView
              orderForm={orderForm}
              setOrderForm={setOrderForm}
              customers={customers}
              products={products}
              handlePlaceOrder={handlePlaceOrder}
              ordersList={ordersList}
              handleViewOrderDetails={handleViewOrderDetails}
              handleDeleteOrder={handleDeleteOrder}
            />
          )}
        </div>

        <OrderModal
          isModalOpen={isModalOpen}
          selectedOrderDetails={selectedOrderDetails}
          setIsModalOpen={setIsModalOpen}
          setSelectedOrderDetails={setSelectedOrderDetails}
        />
      </main>
    </div>
  );
}

export default App;
