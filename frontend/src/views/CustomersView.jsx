import React from "react";

function CustomersView({ customerForm, setCustomerForm, handleCustomerSubmit, customers, handleDeleteCustomer }) {
  return (
    <div className="tab-split-grid">
      <div className="modern-card">
        <h3>Register Client</h3>
        <form onSubmit={handleCustomerSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={customerForm.full_name}
              onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="type"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
              placeholder="name@xyz.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              value={customerForm.phone_number}
              onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
              placeholder="123-456-7890"
              required
            />
          </div>
          <button type="submit" className="btn-success">Register Customer</button>
        </form>
      </div>
      <div className="modern-card">
        <h3>Active Customers</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td><strong>{c.full_name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone_number}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(c.id)}
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

export default CustomersView;