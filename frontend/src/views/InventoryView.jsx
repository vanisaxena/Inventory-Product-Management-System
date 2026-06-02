import React from "react";

function InventoryView({
  productForm,
  setProductForm,
  isEditing,
  setIsEditing,
  setEditProductId,
  handleProductSubmit,
  products,
  handleEditClick,
  handleDeleteProduct,
}) {
  return (
    <div className="tab-split-grid">
      <div className="modern-card">
        <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleProductSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Sony WH-1000XM5"
              required
            />
          </div>
          <div className="form-group">
            <label>SKU Code</label>
            <input
              type="text"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              placeholder="XYZ-CODE"
              required
              disabled={isEditing}
            />
          </div>
          <div className="form-group">
            <label>Unit Price ($)</label>
            <input
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="399"
              required
            />
          </div>
          <div className="form-group">
            <label>Product Quantity</label>
            <input
              type="number"
              value={productForm.quantity_in_stock}
              onChange={(e) => setProductForm({ ...productForm, quantity_in_stock: e.target.value })}
              placeholder="25"
              required
            />
          </div>
          <div className="form-actions-row" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" style={{ backgroundColor: isEditing ? "#e67e22" : "" }}>
              {isEditing ? "Save Changes" : "Add Product"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditProductId(null);
                  setProductForm({ name: "", sku: "", price: "", quantity_in_stock: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="modern-card">
        <h3>Current Stock</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={p.quantity_in_stock <= 5 ? "row-danger" : ""}>
                  <td><strong>{p.name}</strong></td>
                  <td><code>{p.sku}</code></td>
                  <td>${p.price}</td>
                  <td>
                    <span className={`stock-badge ${p.quantity_in_stock <= 5 ? "badge-low" : "badge-ok"}`}>
                      {p.quantity_in_stock} Units
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleEditClick(p)}
                      style={{ padding: "4px 8px", fontSize: "12px", backgroundColor: "#3498db" }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{ padding: "4px 8px", fontSize: "12px", backgroundColor: "#e74c3c" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryView;