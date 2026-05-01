import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

function AdminPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // users, create, details
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, token]);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
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
        setActiveTab("users");
      }
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
      setActiveTab("users");
      fetchUsers();
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
      setActiveTab("details");
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={`tab-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create User
        </button>
        {selectedUser && (
          <button
            className={`tab-button ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details: {selectedUser.name}
          </button>
        )}
      </div>

      <div className="admin-content">
        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="users-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                        <td colSpan="5" className="no-users">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create User Tab */}
        {activeTab === "create" && (
          <div className="create-section">
            <h2>Create New User</h2>
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

        {/* Details Tab */}
        {activeTab === "details" && selectedUser && (
          <div className="details-section">
            <h2>User Details</h2>
            <div className="details-card">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
