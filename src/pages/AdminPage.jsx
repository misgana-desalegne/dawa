import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

function AdminPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, feedback
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  const [feedbackFilter, setFeedbackFilter] = useState("all"); // all, new, read, resolved

  useEffect(() => {
    if (user && token) {
      fetchData();
    }
  }, [user, token]);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");
      
      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await usersResponse.json();
      setUsers(usersData.users);

      // Fetch feedback
      const feedbackResponse = await fetch("/api/admin/feedback", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json();
        setFeedback(feedbackData.feedback);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleChangeRole(userId, newRole) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update role");
      }

      const data = await response.json();
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser(data.user);
      }
      setSuccess("User role updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setError("");

    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      setError("All fields are required");
      return;
    }

    if (newUserForm.password !== newUserForm.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create user");
      }

      setNewUserForm({ name: "", email: "", password: "", passwordConfirm: "" });
      setSuccess("User created successfully");
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSelectUser(userId) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setSelectedUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteFeedback(feedbackId) {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete feedback");
      }

      setFeedback(feedback.filter(f => f.id !== feedbackId));
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(null);
      }
      setSuccess("Feedback deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateFeedbackStatus(feedbackId, newStatus) {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }

      setFeedback(feedback.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f));
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
      setSuccess("Feedback status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedback = feedback.filter(f => {
    if (feedbackFilter !== "all" && f.status !== feedbackFilter) {
      return false;
    }
    return true;
  });

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === "admin").length,
    totalFeedback: feedback.length,
    newFeedback: feedback.filter(f => f.status === "new").length
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
      </div>

      {error && <div className="admin-alert admin-error">{error}</div>}
      {success && <div className="admin-alert admin-success">{success}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users ({users.length})
        </button>
        <button
          className={`tab-button ${activeTab === "feedback" ? "active" : ""}`}
          onClick={() => setActiveTab("feedback")}
        >
          💬 Feedback ({stats.newFeedback})
        </button>
      </div>

      <div className="admin-content">
        {loading && activeTab === "dashboard" && <div className="loading">Loading dashboard...</div>}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && !loading && (
          <div className="dashboard-section">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.adminUsers}</div>
                  <div className="stat-label">Admin Users</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalFeedback}</div>
                  <div className="stat-label">Total Feedback</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🆕</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.newFeedback}</div>
                  <div className="stat-label">New Feedback</div>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <button className="btn-secondary" onClick={() => setActiveTab("users")}>
                Manage Users →
              </button>
              <button className="btn-secondary" onClick={() => setActiveTab("feedback")}>
                View Feedback →
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="users-section">
            <div className="section-toolbar">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn-primary" 
                onClick={() => setActiveTab("users")}
              >
                + Create User
              </button>
            </div>

            <div className="users-wrapper">
              <div className="users-list">
                <h3>Users List</h3>
                {loading ? (
                  <div className="loading">Loading users...</div>
                ) : (
                  <div className="users-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(u => (
                            <tr key={u.id}>
                              <td>{u.name}</td>
                              <td>{u.email}</td>
                              <td>
                                <span className={`role-badge role-${u.role}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="actions">
                                <button
                                  className="btn-view"
                                  onClick={() => handleSelectUser(u.id)}
                                >
                                  View
                                </button>
                                {u.id !== user?.id && (
                                  <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteUser(u.id)}
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="no-data">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="users-panel">
                {selectedUser ? (
                  <div className="details-card">
                    <h3>User Details</h3>
                    <div className="detail-row">
                      <label>Name:</label>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>Role:</label>
                      <div className="role-selector">
                        <select
                          value={selectedUser.role}
                          onChange={(e) =>
                            handleChangeRole(selectedUser.id, e.target.value)
                          }
                          disabled={selectedUser.id === user?.id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {selectedUser.id === user?.id && (
                          <small className="note">You cannot change your own role</small>
                        )}
                      </div>
                    </div>
                    <div className="detail-row">
                      <label>Created:</label>
                      <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="details-actions">
                      {selectedUser.id !== user?.id && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(selectedUser.id)}
                        >
                          Delete User
                        </button>
                      )}
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedUser(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="create-card">
                    <h3>Create New User</h3>
                    <form onSubmit={handleCreateUser} className="create-form">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          type="text"
                          value={newUserForm.name}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          id="password"
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) =>
                            setNewUserForm({ ...newUserForm, password: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="passwordConfirm">Confirm Password</label>
                        <input
                          id="passwordConfirm"
                          type="password"
                          value={newUserForm.passwordConfirm}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              passwordConfirm: e.target.value
                            })
                          }
                          required
                        />
                      </div>

                      <button type="submit" className="btn-primary">
                        Create User
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="feedback-section">
            <div className="section-toolbar">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${feedbackFilter === "all" ? "active" : ""}`}
                  onClick={() => setFeedbackFilter("all")}
                >
                  All ({feedback.length})
                </button>
                <button
                  className={`filter-btn ${feedbackFilter === "new" ? "active" : ""}`}
                  onClick={() => setFeedbackFilter("new")}
                >
                  New ({feedback.filter(f => f.status === "new").length})
                </button>
                <button
                  className={`filter-btn ${feedbackFilter === "read" ? "active" : ""}`}
                  onClick={() => setFeedbackFilter("read")}
                >
                  Read ({feedback.filter(f => f.status === "read").length})
                </button>
                <button
                  className={`filter-btn ${feedbackFilter === "resolved" ? "active" : ""}`}
                  onClick={() => setFeedbackFilter("resolved")}
                >
                  Resolved ({feedback.filter(f => f.status === "resolved").length})
                </button>
              </div>
            </div>

            <div className="feedback-wrapper">
              <div className="feedback-list">
                <h3>Feedback Items</h3>
                {loading ? (
                  <div className="loading">Loading feedback...</div>
                ) : filteredFeedback.length > 0 ? (
                  <div className="feedback-items">
                    {filteredFeedback.map(f => (
                      <div 
                        key={f.id} 
                        className={`feedback-item status-${f.status} ${selectedFeedback?.id === f.id ? "selected" : ""}`}
                        onClick={() => setSelectedFeedback(f)}
                      >
                        <div className="feedback-header">
                          <div className="feedback-from">
                            <strong>{f.name}</strong>
                            <small>{f.email}</small>
                          </div>
                          <span className={`status-badge status-${f.status}`}>
                            {f.status}
                          </span>
                        </div>
                        <div className="feedback-preview">
                          {f.comment.substring(0, 100)}...
                        </div>
                        <div className="feedback-date">
                          {new Date(f.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">No feedback found</div>
                )}
              </div>

              <div className="feedback-panel">
                {selectedFeedback ? (
                  <div className="feedback-detail">
                    <h3>Feedback Details</h3>
                    <div className="detail-row">
                      <label>From:</label>
                      <span>{selectedFeedback.name}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedFeedback.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>Date:</label>
                      <span>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <label>Status:</label>
                      <div className="status-selector">
                        <select
                          value={selectedFeedback.status}
                          onChange={(e) =>
                            handleUpdateFeedbackStatus(selectedFeedback.id, e.target.value)
                          }
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                    <div className="detail-row full">
                      <label>Message:</label>
                      <div className="message-content">
                        {selectedFeedback.comment}
                      </div>
                    </div>

                    <div className="details-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedFeedback(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-selection">
                    <p>Select a feedback item to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
