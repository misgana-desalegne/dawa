import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandHero from "../components/BrandHero";
import ChipSelector from "../components/ChipSelector";
import TitleBar from "../components/TitleBar";
import { useAppLanguage } from "../context/AppLanguageContext";
import { cefrLevels, nativeLanguages, teachingLanguages } from "../data/languages";
import { startStripeDonation } from "../lib/donation";

import { landingFrenchQuiz } from "../data/landingFrenchQuiz";

function LandingPage() {
  const { t } = useAppLanguage();
  const navigate = useNavigate();
  const [nativeCode, setNativeCode] = useState("am");
  const [teachingCode, setTeachingCode] = useState("en");
  const [cefrLevel, setCefrLevel] = useState("A1");
  const [activePopup, setActivePopup] = useState(null);

  // Quiz state for landing page
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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

  const setupGroups = [
    {
      id: "native",
      title: t("nativeLanguage"),
      items: nativeLanguages,
      selectedValue: nativeCode,
      onSelect: setNativeCode,
      getValue: (item) => item.code,
      getPrimaryLabel: (item) => item.nativeLabel,
      getSecondaryLabel: (item) => item.label,
      ariaLabel: t("nativeLanguage")
    },
    {
      id: "target",
      title: t("learnLanguage"),
      items: teachingLanguages,
      selectedValue: teachingCode,
      onSelect: setTeachingCode,
      getValue: (item) => item.code,
      getPrimaryLabel: (item) => item.nativeLabel,
      getSecondaryLabel: (item) => item.label,
      getBadge: (item) => item.flag,
      ariaLabel: t("learnLanguage")
    },
    {
      id: "level",
      title: t("level"),
      items: cefrLevels,
      selectedValue: cefrLevel,
      onSelect: setCefrLevel,
      getValue: (item) => item,
      getPrimaryLabel: (item) => item,
      ariaLabel: t("level"),
      className: "level-chip-grid"
    }
  ];

  const topLinks = [
    { label: t("navSignup"), key: "signup", type: "popup" },
    { label: t("navLogin"), key: "login", type: "popup" },
    { label: t("navAbout"), key: "about", type: "route", to: "/about" },
    { label: t("navDonate"), key: "donate", type: "action" }
  ];

  const popupContent = {
    signup: {
      title: t("popupSignupTitle"),
      description: t("popupSignupBody"),
      action: t("createAccount")
    },
    login: {
      title: t("popupLoginTitle"),
      description: t("popupLoginBody"),
      action: t("loginAction")
    },
  };

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

      <BrandHero
        className="hero-landing"
        headline={t("landingHeadline")}
        subtitle={t("landingSubtitle")}
      />

      <section className="card landing-pro-strip modern-card">
        <article className="pro-pill">
          <h3>Immersive</h3>
          <p>Voice + meaning + sentence examples in one tap.</p>
        </article>
        <article className="pro-pill">
          <h3>Structured</h3>
          <p>CEFR-based sections with guided progression.</p>
        </article>
        <article className="pro-pill">
          <h3>Mobile-first</h3>
          <p>Designed for fast, thumb-friendly learning sessions.</p>
        </article>
      </section>

      <section className="card landing-setup modern-card">
        <h2>{t("setupTitle")}</h2>

        {setupGroups.map((group) => (
          <ChipSelector
            key={group.id}
            title={group.title}
            items={group.items}
            selectedValue={group.selectedValue}
            onSelect={group.onSelect}
            getValue={group.getValue}
            getPrimaryLabel={group.getPrimaryLabel}
            getSecondaryLabel={group.getSecondaryLabel}
            ariaLabel={group.ariaLabel}
            className={group.className}
          />
        ))}

        <div className="setup-actions">
          <button type="button" className="primary" onClick={goToLearningGround}>
            {t("enterLearningGround")}
          </button>
        </div>
      </section>

      {/* Quiz Section: 8 French MCQs */}
      <section className="card landing-quiz modern-card">
        <h2>French Quick Quiz</h2>
        {quizFinished ? (
          <div className="quiz-results">
            <p>You scored {quizScore} out of {landingFrenchQuiz.length}!</p>
            <button className="primary" onClick={handleQuizRestart}>Try Again</button>
          </div>
        ) : (
          <>
            <p><strong>Question {quizIndex + 1} of {landingFrenchQuiz.length}</strong></p>
            <p>{currentQuiz.question}</p>
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
              <p className="quiz-feedback">
                {selectedChoice === currentQuiz.answer ? "Correct!" : `Wrong! Correct answer: ${currentQuiz.answer}`}
              </p>
            )}
          </>
        )}
      </section>

      <section className="card summary modern-card">
        <h2>{t("currentRoute")}</h2>
        <p>
          {t("nativeLanguage")}: {nativeLabel} | {t("learnLanguage")}: {selectedTeaching?.flag} {selectedTeaching?.nativeLabel} | {t("level")}: {cefrLevel}
        </p>
      </section>

      {activePopup && (
        <div className="popup-backdrop" role="presentation" onClick={() => setActivePopup(null)}>
          <section
            className="popup-card"
            role="dialog"
            aria-modal="true"
            aria-label={popupContent[activePopup].title}
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
            <h2>{popupContent[activePopup].title}</h2>
            <p>{popupContent[activePopup].description}</p>

            {(activePopup === "signup" || activePopup === "login") && (
              <form className="popup-form">
                <input type="email" placeholder={t("popupEmail")} aria-label={t("popupEmail")} />
                <input type="password" placeholder={t("popupPassword")} aria-label={t("popupPassword")} />
              </form>
            )}

            <button
              type="button"
              className="primary popup-action-btn"
              onClick={() => setActivePopup(null)}
            >
              {popupContent[activePopup].action}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default LandingPage;
