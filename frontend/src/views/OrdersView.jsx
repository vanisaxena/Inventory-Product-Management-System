import React from "react";

function OrdersView({
  orderForm,
  setOrderForm,
  customers,
  products,
  handlePlaceOrder,
  ordersList,
  handleViewOrderDetails,
  handleDeleteOrder,
}) {
  const selectedProduct = products.find((p) => p.id === parseInt(orderForm.product_id));
  const estimatedTotal = selectedProduct
    ? (selectedProduct.price * parseInt(orderForm.quantity || 0)).toFixed(2)
    : 0;

  return (
    <div className="tab-split-grid">
      <div className="modern-card">
        <h3>Order Checkout</h3>
        <form onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label>Select Customer</label>
            <select
              value={orderForm.customer_id}
              onChange={(e) => setOrderForm({ ...orderForm, customer_id: e.target.value })}
              required
            >
              <option value="">-- Active Customers --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Product</label>
            <select
              value={orderForm.product_id}
              onChange={(e) => setOrderForm({ ...orderForm, product_id: e.target.value })}
              required
            >
              <option value="">-- Active Products --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Product Quantity</label>
            <input
              type="number"
              min="1"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
              required
            />
          </div>
          {orderForm.product_id && orderForm.quantity && (
            <div className="pricing-preview">
              <span>Total Invoice Valuation:</span>
              <strong>${estimatedTotal}</strong>
            </div>
          )}
          <button type="submit" className="btn-checkout">Place Order</button>
        </form>
      </div>

      <div className="modern-card">
        <h3>Order History</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Valuation</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((o) => (
                <tr key={o.id}>
                  <td><code>#ORD-{o.id}</code></td>
                  <td><strong>{o.customer?.full_name || `Client ID: ${o.customer_id}`}</strong></td>
                  <td style={{ color: "#2ecc71", fontWeight: "bold" }}>${o.total_amount?.toFixed(2)}</td>
                  <td style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleViewOrderDetails(o.id)}
                      style={{ padding: "4px 8px", fontSize: "12px", backgroundColor: "#f39c12", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(o.id)}
                      style={{ padding: "4px 8px", fontSize: "12px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {ordersList.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#7f8c8d" }}>
                    No transactions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersView;