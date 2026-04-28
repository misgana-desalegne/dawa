import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppLanguage } from "../context/AppLanguageContext";

function LoginPage({ popupMode = false, onClose, onSwitch }) {
  const { t } = useAppLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (popupMode) {
        if (onClose) onClose();
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const content = (
    <div className={popupMode ? "auth-popup-body" : "auth-card"}>
      <h2>{popupMode ? t("popupLoginTitle") : t("loginTitle")}</h2>
      <p className="auth-intro">{popupMode ? t("popupLoginBody") : t("loginBody")}</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">{t("popupEmail")}</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t("popupPassword")}</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
            disabled={loading}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="primary auth-submit">
          {loading ? "..." : t("loginAction")}
        </button>
      </form>

      <p className="auth-footer">
        {popupMode ? t("noAccount") : t("noAccount") || "Don't have an account?"}{" "}
        <button
          type="button"
          className="link-button"
          onClick={() => {
            if (popupMode && onSwitch) {
              onSwitch();
            } else {
              navigate("/signup");
            }
          }}
        >
          {t("navSignup")}
        </button>
      </p>
    </div>
  );

  return popupMode ? content : (
    <main className="app-shell auth-page">
      <div className="auth-container">{content}</div>
    </main>
  );
}

export default LoginPage;
