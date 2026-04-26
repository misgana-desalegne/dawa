import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import QuizPanel from "../components/QuizPanel";
import SectionChain from "../components/SectionChain";
import TitleBar from "../components/TitleBar";
import { useAppLanguage } from "../context/AppLanguageContext";
import { getCourse } from "../data/courses";
import { nativeLanguages, teachingLanguages } from "../data/languages";

function LearningPage() {
  const { t } = useAppLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nativeCode = searchParams.get("native") || localStorage.getItem("learning-native") || "am";
  const targetCode = searchParams.get("target") || localStorage.getItem("learning-target") || "en";
  const level = searchParams.get("level") || localStorage.getItem("learning-level") || "A1";

  const activeNativeLanguage = nativeLanguages.find((item) => item.code === nativeCode);
  const activeTargetLanguage = teachingLanguages.find((item) => item.code === targetCode);
  const activeCourse = getCourse(nativeCode, targetCode, level);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("completed-lessons");
    return saved ? JSON.parse(saved) : {};
  });
  const [completionPopup, setCompletionPopup] = useState(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [quizHistory, setQuizHistory] = useState(() => {
    const saved = localStorage.getItem("quiz-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("learning-native", nativeCode);
    localStorage.setItem("learning-target", targetCode);
    localStorage.setItem("learning-level", level);
  }, [nativeCode, targetCode, level]);

  useEffect(() => {
    localStorage.setItem("completed-lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("quiz-history", JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    if (!activeCourse || activeCourse.lessons.length === 0 || selectedLessonId || hasAutoOpened) {
      return;
    }
    // Auto-open only once per route so finished sections do not loop back to section 1.
    setSelectedLessonId(activeCourse.lessons[0].id);
    setHasAutoOpened(true);
  }, [activeCourse, selectedLessonId, hasAutoOpened]);

  const selectedLesson = useMemo(() => {
    if (!selectedLessonId || !activeCourse) {
      return null;
    }
    return activeCourse.lessons.find((lesson) => lesson.id === selectedLessonId) || null;
  }, [selectedLessonId, activeCourse]);

  const completedCount = useMemo(() => {
    if (!activeCourse) {
      return 0;
    }
    return Object.keys(completedLessons).filter((lessonId) =>
      activeCourse.lessons.some((lesson) => lesson.id === lessonId)
    ).length;
  }, [completedLessons, activeCourse]);

  function handleLessonFinish(result) {
    setCompletedLessons((prev) => ({
      ...prev,
      [result.lessonId]: result
    }));

    setQuizHistory((prev) => [
      ...prev,
      {
        ...result,
        timestamp: new Date().toISOString(),
        nativeCode,
        targetCode,
        level
      }
    ]);

    const currentIndex = activeCourse.lessons.findIndex((lesson) => lesson.id === result.lessonId);
    const nextLesson = currentIndex >= 0 ? activeCourse.lessons[currentIndex + 1] : null;

    setCompletionPopup({
      lessonTitle: result.lessonTitle,
      score: result.score,
      total: result.total,
      nextLessonId: nextLesson?.id || null,
      nextLessonTitle: nextLesson?.title || null,
      isCourseComplete: !nextLesson
    });

    setSelectedLessonId(null);
  }

  if (!activeCourse) {
    return (
      <main className="app-shell">
        <section className="card summary modern-card">
          <h2>{t("noRouteTitle")}</h2>
          <p>{t("noRouteBody")}</p>
          <button type="button" className="primary" onClick={() => navigate("/")}>
            {t("backToLanding")}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <TitleBar>
        <Link className="title-link" to="/">
          {t("navHome")}
        </Link>
        <Link className="title-link" to="/about">
          {t("navAbout")}
        </Link>
      </TitleBar>

      {/* Hero Section with Course Info */}
      <section className="learning-hero">
        <div className="hero-content">
          <h1>{activeCourse?.title}</h1>
          <div className="hero-metadata">
            <span className="meta-badge">{activeNativeLanguage?.label}</span>
            <span className="meta-arrow">→</span>
            <span className="meta-badge">{activeTargetLanguage?.label}</span>
            <span className="meta-divider">·</span>
            <span className="meta-level">{level}</span>
          </div>
          <p className="hero-description">Level {level} · {activeCourse?.lessons.length} sections</p>
        </div>
        <button type="button" className="secondary" onClick={() => navigate("/")}>
          {t("changeRoute")}
        </button>
      </section>

      {/* Progress Overview */}
      <section className="card progress-overview modern-card">
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">{t("sections")}</span>
            <span className="stat-value">{completedCount}/{activeCourse?.lessons.length}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${activeCourse?.lessons?.length ? (completedCount / activeCourse.lessons.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Chain */}
      {activeCourse?.lessons.length > 0 && (
        <section className="card section-path modern-card">
          <h2>{t("sectionChain")}</h2>
          <p className="subtext">{t("sectionHint")}</p>
          <SectionChain
            lessons={activeCourse.lessons}
            completedLessons={completedLessons}
            completedCount={completedCount}
            onSelectSection={setSelectedLessonId}
          />
        </section>
      )}

      {/* Current Lesson Summary */}
      {selectedLesson && (
        <section className="card lesson-summary modern-card">
          <div className="lesson-header">
            <h2>{t("currentLesson")}</h2>
            <span className="lesson-badge">In Progress</span>
          </div>
          <p className="lesson-title">{selectedLesson.title}</p>
          <p className="lesson-description">{t("selectedLessonHint")}</p>
        </section>
      )}

      {/* Quiz Panel */}
      {selectedLesson && (
        <QuizPanel
          lesson={selectedLesson}
          nativeLanguage={activeNativeLanguage}
          targetLanguage={activeTargetLanguage}
          onFinish={handleLessonFinish}
        />
      )}

      {/* Recent Results */}
      {selectedLessonId === null && completedCount > 0 && (
        <section className="card recent-results modern-card">
          <h2>{t("recentResults")}</h2>
          <div className="results-list">
            {activeCourse?.lessons
              .filter((lesson) => completedLessons[lesson.id])
              .map((lesson) => {
                const result = completedLessons[lesson.id];
                return (
                  <div key={lesson.id} className="result-item">
                    <span className="result-title">{lesson.title}</span>
                    <span className="result-score">{result.score}/{result.total}</span>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Completion Popup */}
      {completionPopup && (
        <div className="popup-backdrop" role="presentation" onClick={() => setCompletionPopup(null)}>
          <section
            className="popup-card"
            role="dialog"
            aria-modal="true"
            aria-label={t("sectionCompleteTitle")}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setCompletionPopup(null)}
              aria-label="Close popup"
            >
              x
            </button>

            <h2>{t("sectionCompleteTitle")}</h2>
            <p className="completion-score">
              {completionPopup.lessonTitle}: {completionPopup.score}/{completionPopup.total}
            </p>
            <p className="completion-message">
              {completionPopup.isCourseComplete
                ? t("courseCompletedBody")
                : `${t("sectionCompleteBody")} ${completionPopup.nextLessonTitle}`}
            </p>

            <div className="quiz-actions popup-action-row">
              {completionPopup.nextLessonId && (
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setSelectedLessonId(completionPopup.nextLessonId);
                    setCompletionPopup(null);
                  }}
                >
                  {t("startNextSection")}
                </button>
              )}

              <button
                type="button"
                className="secondary"
                onClick={() => setCompletionPopup(null)}
              >
                {t("backToSections")}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default LearningPage;
