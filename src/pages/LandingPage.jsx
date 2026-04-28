import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { useAppLanguage } from "../context/AppLanguageContext";
import { cefrLevels, nativeLanguages, teachingLanguages } from "../data/languages";
import { startStripeDonation } from "../lib/donation";
import { landingFrenchQuiz } from "../data/landingFrenchQuiz";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";

function LandingPage() {
  const { t } = useAppLanguage();
  const navigate = useNavigate();
  const [nativeCode, setNativeCode] = useState(() => localStorage.getItem("landing-native") || "am");
  const [teachingCode, setTeachingCode] = useState(() => localStorage.getItem("landing-target") || "en");
  const [cefrLevel, setCefrLevel] = useState(() => localStorage.getItem("landing-level") || "A1");
  const [activePopup, setActivePopup] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Show quiz by default on larger screens, hide on mobile
    const shouldShow = window.innerWidth > 640;
    setShowQuiz(shouldShow);
  }, []);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    localStorage.setItem("landing-native", nativeCode);
  }, [nativeCode]);

  useEffect(() => {
    localStorage.setItem("landing-target", teachingCode);
  }, [teachingCode]);

  useEffect(() => {
    localStorage.setItem("landing-level", cefrLevel);
  }, [cefrLevel]);

  const currentQuiz = landingFrenchQuiz[quizIndex];

  function handleQuizChoice(choice) {
    setSelectedChoice(choice);
    if (choice === currentQuiz.answer) {
      setQuizScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (quizIndex < landingFrenchQuiz.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedChoice(null);
      } else {
        setQuizFinished(true);
      }
    }, 700);
  }

  function handleQuizRestart() {
    setQuizIndex(0);
    setSelectedChoice(null);
    setQuizScore(0);
    setQuizFinished(false);
  }

  const nativeLabel = useMemo(() => {
    return nativeLanguages.find((item) => item.code === nativeCode)?.nativeLabel || "";
  }, [nativeCode]);

  const selectedTeaching = useMemo(() => {
    return teachingLanguages.find((item) => item.code === teachingCode);
  }, [teachingCode]);

  function goToLearningGround() {
    navigate(`/learn?native=${nativeCode}&target=${teachingCode}&level=${cefrLevel}`);
  }

  const topLinks = [
    { label: t("navAbout"), key: "about", type: "route", to: "/about" },
    { label: t("navSignup"), key: "signup", type: "popup" },
    { label: t("navLogin"), key: "login", type: "popup" },
    { label: t("navDonate"), key: "donate", type: "action" }
  ];

  return (
    <main className="app-shell">
      <TitleBar>
        {topLinks.map((link) => (
          link.type === "route" ? (
            <Link key={link.label} to={link.to} className="title-link" aria-label={link.label}>
              {link.label}
            </Link>
          ) : (
            <button
              key={link.key}
              type="button"
              className={`title-link title-link-button ${link.key === "donate" ? "donate-cta" : ""}`.trim()}
              onClick={() => (link.key === "donate" ? void startStripeDonation() : setActivePopup(link.key))}
              aria-label={link.label}
            >
              {link.label}
            </button>
          )
        ))}
      </TitleBar>

      {/* Setup Section */}
      <section className="card setup-section modern-card">
        <div className="setup-header">
          <h2>{t("setupTitle")}</h2>
          <p className="setup-intro">Choose your learning path below</p>
        </div>

        <div className="setup-selectors">
          <div className="selector-group">
            <label className="selector-label">{t("nativeLanguage")}</label>
            <div className="chip-grid">
              {nativeLanguages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`chip-option ${nativeCode === item.code ? "active" : ""}`}
                  onClick={() => setNativeCode(item.code)}
                  aria-pressed={nativeCode === item.code}
                >
                  <span>{item.nativeLabel}</span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <label className="selector-label">{t("learnLanguage")}</label>
            <div className="chip-grid">
              {teachingLanguages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`chip-option ${teachingCode === item.code ? "active" : ""}`}
                  onClick={() => setTeachingCode(item.code)}
                  aria-pressed={teachingCode === item.code}
                >
                  <span>{item.flag} {item.nativeLabel}</span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <label className="selector-label">{t("level")}</label>
            <div className="chip-grid level-chip-grid">
              {cefrLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`chip-option ${cefrLevel === level ? "active" : ""}`}
                  onClick={() => setCefrLevel(level)}
                  aria-pressed={cefrLevel === level}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="setup-summary">
          <p className="summary-text">
            Learning <strong>{selectedTeaching?.nativeLabel}</strong> · {nativeLabel} speaker · <strong>{cefrLevel}</strong> level
          </p>
          <button type="button" className="primary" onClick={goToLearningGround}>
            {t("enterLearningGround")}
          </button>
        </div>
      </section>

      {/* Optional Quiz Section */}
      <section className="card quiz-section modern-card">
        <div className="quiz-header">
          <h2>Try a Quick Quiz</h2>
          <button
            type="button"
            className="quiz-toggle-btn"
            onClick={() => setShowQuiz(!showQuiz)}
            aria-expanded={showQuiz}
          >
            {showQuiz ? "Hide" : "Show"} Quiz
          </button>
        </div>

        {showQuiz && (
          <div className="quiz-content">
            {quizFinished ? (
              <div className="quiz-results">
                <h3>You scored {quizScore} out of {landingFrenchQuiz.length}!</h3>
                <p>Great effort! Ready to start learning?</p>
                <button className="primary" onClick={handleQuizRestart}>
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="quiz-progress">
                  <span>Question {quizIndex + 1} of {landingFrenchQuiz.length}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((quizIndex + 1) / landingFrenchQuiz.length) * 100}%` }}></div>
                  </div>
                </div>
                <p className="quiz-question">{currentQuiz.question}</p>
                <div className="quiz-choices">
                  {currentQuiz.choices.map((choice) => {
                    let btnClass = "quiz-choice-btn";
                    if (selectedChoice === choice) {
                      btnClass += choice === currentQuiz.answer ? " correct" : " wrong";
                    }
                    return (
                      <button
                        key={choice}
                        className={btnClass}
                        onClick={() => !selectedChoice && handleQuizChoice(choice)}
                        disabled={!!selectedChoice}
                        aria-pressed={selectedChoice === choice}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {selectedChoice && (
                  <p className={`quiz-feedback ${selectedChoice === currentQuiz.answer ? "correct" : "wrong"}`}>
                    {selectedChoice === currentQuiz.answer ? "Correct! 🎉" : `Wrong! Correct answer: ${currentQuiz.answer}`}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </section>

      {/* Popup Modal */}
      {activePopup && (
        <div className="popup-backdrop" role="presentation" onClick={() => setActivePopup(null)}>
          <section
            className="popup-card"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setActivePopup(null)}
              aria-label="Close popup"
            >
              x
            </button>
            {activePopup === "signup" ? (
              <SignupPage
                popupMode
                onClose={() => setActivePopup(null)}
                onSwitch={() => setActivePopup("login")}
              />
            ) : (
              <LoginPage
                popupMode
                onClose={() => setActivePopup(null)}
                onSwitch={() => setActivePopup("signup")}
              />
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default LandingPage;
