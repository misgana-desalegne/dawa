import React, { useState } from "react";
import { useAppLanguage } from "../context/AppLanguageContext";

function FeedbackPanel() {
  const { t } = useAppLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !comment.trim()) {
      setFeedback("error");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, comment })
      });

      if (response.ok) {
        setFeedback("success");
        setName("");
        setEmail("");
        setComment("");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback("error");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setFeedback("error");
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card feedback-panel modern-card">
      <h2>{t("feedbackTitle")}</h2>
      <p className="feedback-intro">{t("feedbackBody")}</p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="feedback-name">{t("feedbackName")}</label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
            disabled={isSubmitting}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="feedback-email">{t("feedbackEmail")}</label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            disabled={isSubmitting}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="feedback-comment">{t("feedbackComment")}</label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("feedbackCommentPlaceholder")}
            disabled={isSubmitting}
            className="form-textarea"
            rows="4"
          />
        </div>

        {feedback === "success" && (
          <div className="feedback-message success">
            {t("feedbackSent")}
          </div>
        )}

        {feedback === "error" && (
          <div className="feedback-message error">
            {t("feedbackError")}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary feedback-submit"
        >
          {isSubmitting ? "..." : t("sendFeedback")}
        </button>
      </form>
    </section>
  );
}

export default FeedbackPanel;
