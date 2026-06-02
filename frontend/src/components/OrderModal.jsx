import React from "react";

function OrderModal({ isModalOpen, selectedOrderDetails, setIsModalOpen, setSelectedOrderDetails }) {
  if (!isModalOpen || !selectedOrderDetails) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          padding: "25px",
          borderRadius: "8px",
          width: "450px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #34495e",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ margin: 0 }}>
            Invoice Details: #ORD-{selectedOrderDetails.id}
          </h3>
        </div>
        <p><strong>Customer Name:</strong> {selectedOrderDetails.customer?.full_name || "N/A"}</p>
        <p><strong>Customer Email:</strong> {selectedOrderDetails.customer?.email || "N/A"}</p>

        <h4 style={{ borderBottom: "1px solid #34495e", paddingBottom: "5px", marginTop: "20px" }}>
          Line Items
        </h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {selectedOrderDetails.items?.map((item) => (
            <li
              key={item.id}
              style={{
                padding: "8px 0",
                borderBottom: "1px dashed #34495e",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                📦 {item.product_name} <small style={{ color: "#bdc3c7" }}>(x{item.quantity})</small>
              </span>
              <strong>${(item.price_per_unit * item.quantity).toFixed(2)}</strong>
            </li>
          ))}
        </ul>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            paddingTop: "10px",
            borderTop: "2px solid #34495e",
          }}
        >
          <span><strong>Total Net Amount:</strong></span>
          <span style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "1.2em" }}>
            ${selectedOrderDetails.total_amount?.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(false);
            setSelectedOrderDetails(null);
          }}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
}

export default OrderModal;