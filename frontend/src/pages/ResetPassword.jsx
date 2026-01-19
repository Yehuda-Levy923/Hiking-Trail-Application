import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await authApi.resetPassword(token, formData.password, formData.confirmPassword);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container">
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Password Reset Successful</h1>
              <p>Your password has been updated successfully.</p>
            </div>

            <div style={{
              background: "#f0fff4",
              padding: "var(--spacing-lg)",
              borderRadius: "var(--radius-sm)",
              textAlign: "center",
              marginBottom: "var(--spacing-lg)",
              border: "1px solid #9ae6b4",
            }}>
              <p style={{ color: "#276749", marginBottom: "var(--spacing-md)" }}>
                You can now log in with your new password.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Redirecting to login page...
              </p>
            </div>

            <Link to="/login" className="btn btn-primary auth-btn">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container">
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Invalid Link</h1>
              <p>This password reset link is invalid or has expired.</p>
            </div>

            <div className="auth-error" style={{ marginBottom: "var(--spacing-lg)" }}>
              {error || "Invalid or missing reset token."}
            </div>

            <Link to="/forgot-password" className="btn btn-primary auth-btn">
              Request New Reset Link
            </Link>

            <div className="auth-footer">
              <p>
                <Link to="/login">Back to Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={validationErrors.password ? "input-error" : ""}
              />
              {validationErrors.password && (
                <span className="field-error">{validationErrors.password}</span>
              )}
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Must be at least 8 characters
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={validationErrors.confirmPassword ? "input-error" : ""}
              />
              {validationErrors.confirmPassword && (
                <span className="field-error">{validationErrors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/login">Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
