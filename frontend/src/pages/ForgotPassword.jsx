import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError("");
    }
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container">
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Check Your Email</h1>
              <p>We've sent password reset instructions to your email address.</p>
            </div>

            <div style={{
              background: "var(--bg-light)",
              padding: "var(--spacing-lg)",
              borderRadius: "var(--radius-sm)",
              textAlign: "center",
              marginBottom: "var(--spacing-lg)",
            }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-md)" }}>
                If an account with <strong>{email}</strong> exists, you'll receive an email with a link to reset your password.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                The link will expire in 1 hour.
              </p>
            </div>

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
            <h1>Forgot Password</h1>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={validationError ? "input-error" : ""}
              />
              {validationError && (
                <span className="field-error">{validationError}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
