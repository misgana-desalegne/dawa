import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BrandHero from "../components/BrandHero";
import QuizPanel from "../components/QuizPanel";
import SectionChain from "../components/SectionChain";
import TitleBar from "../components/TitleBar";
import { useAppLanguage } from "../context/AppLanguageContext";
import { getCourse } from "../data/courses";
import { nativeLanguages } from "../data/languages";

function LearningPage() {
  const { t } = useAppLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nativeCode = searchParams.get("native") || "am";
  const targetCode = searchParams.get("target") || "en";
  const level = searchParams.get("level") || "A1";

  const activeNativeLanguage = nativeLanguages.find((item) => item.code === nativeCode);
  const activeCourse = getCourse(nativeCode, targetCode, level);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [completionPopup, setCompletionPopup] = useState(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    setSelectedLessonId(null);
    setCompletedLessons({});
    setCompletionPopup(null);
    setHasAutoOpened(false);
  }, [activeCourse?.id]);

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
        <Link className="title-link" to="/about">
          {t("navAbout")}
        </Link>
        <Link className="title-link" to="/">
          {t("navHome")}
        </Link>
      </TitleBar>

      <BrandHero
        className="hero-learning"
        headline={t("learningGround")}
        subtitle={`${activeCourse.title} | ${t("nativeLanguage")}: ${activeNativeLanguage?.nativeLabel} | ${t("level")}: ${level}`}
      />

      <section className="card progress-card modern-card">
        <h2>{t("learningGround")}</h2>
        <p>
          {t("sections")}: {completedCount}/{activeCourse.lessons.length}
        </p>
        <button type="button" className="secondary" onClick={() => navigate("/")}>
          {t("changeRoute")}
        </button>
      </section>

      {!selectedLesson && activeCourse.lessons.length > 0 && (
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

      {activeCourse.lessons.length === 0 && (
        <section className="card summary modern-card">
          <h2>{t("noRouteTitle")}</h2>
          <p>{t("noRouteBody")}</p>
        </section>
      )}

      {!selectedLesson && activeCourse.lessons.length > 0 && (
        <section className="card selected-section-hint modern-card">
          <h2>{t("sections")}</h2>
          {activeCourse.lessons.map((lesson, index) => (
            <p key={lesson.id}>
              {index + 1}. {lesson.title}
            </p>
          ))}
        </section>
      )}

      {selectedLesson && (
        <QuizPanel
          lesson={selectedLesson}
          onFinish={handleLessonFinish}
        />
      )}

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
            <p>
              {completionPopup.lessonTitle}: {completionPopup.score}/{completionPopup.total}
            </p>
            <p>
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

      {selectedLessonId === null && completedCount > 0 && (
        <section className="card summary modern-card">
          <h2>{t("recentResults")}</h2>
          {activeCourse.lessons
            .filter((lesson) => completedLessons[lesson.id])
            .map((lesson) => {
              const result = completedLessons[lesson.id];
              return (
                <p key={lesson.id}>
                  {lesson.title}: {result.score}/{result.total}
                </p>
              );
            })}
        </section>
      )}
    </main>
  );
}

export default LearningPage;
