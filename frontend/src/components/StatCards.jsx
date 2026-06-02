import React from "react";

function StatCards({ stats }) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="card-icon">📦</span>
        <div>
          <h3>Total Products</h3>
          <p>{stats.total_products}</p>
        </div>
      </div>
      <div className={`stat-card ${stats.low_stock > 0 ? "danger-alert" : ""}`}>
        <span className="card-icon">⚠️</span>
        <div>
          <h3>Low Stock Items</h3>
          <p>{stats.low_stock}</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="card-icon">✅</span>
        <div>
          <h3>Orders Placed</h3>
          <p>{stats.total_orders}</p>
        </div>
      </div>
    </section>
  );
}

export default StatCards;