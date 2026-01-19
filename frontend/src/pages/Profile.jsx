import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, error, clearError, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear success message when user makes changes
    setSuccessMessage("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage("");
    clearError();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    const result = await updateUser(formData);

    setIsSubmitting(false);

    if (result.success) {
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: "500px" }}>
          <div className="auth-header">
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>

          {successMessage && (
            <div className="auth-success" style={{
              background: "#f0fff4",
              color: "#276749",
              padding: "var(--spacing-md)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid #9ae6b4",
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "var(--spacing-md)",
            }}>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-error" style={{ marginBottom: "var(--spacing-md)" }}>
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={validationErrors.name ? "input-error" : ""}
                />
                {validationErrors.name && (
                  <span className="field-error">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={validationErrors.email ? "input-error" : ""}
                />
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="profile-field" style={{
                padding: "var(--spacing-md)",
                background: "var(--bg-light)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "var(--spacing-md)",
              }}>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "var(--spacing-xs)",
                  fontWeight: "600",
                }}>Name</label>
                <span style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{user.name}</span>
              </div>

              <div className="profile-field" style={{
                padding: "var(--spacing-md)",
                background: "var(--bg-light)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "var(--spacing-md)",
              }}>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "var(--spacing-xs)",
                  fontWeight: "600",
                }}>Email</label>
                <span style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{user.email}</span>
              </div>

              <div className="profile-field" style={{
                padding: "var(--spacing-md)",
                background: "var(--bg-light)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "var(--spacing-lg)",
              }}>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "var(--spacing-xs)",
                  fontWeight: "600",
                }}>Member Since</label>
                <span style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
                  {formatDate(user.created_at)}
                </span>
              </div>

              <button
                className="btn btn-primary auth-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
