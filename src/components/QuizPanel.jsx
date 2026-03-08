import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAppLanguage } from "../context/AppLanguageContext";

function QuizPanel({ lesson, onFinish }) {
  const { t } = useAppLanguage();
  const practiceWords = useMemo(() => {
    return lesson.questions.slice(0, 5).map((question) => ({
        word: question.answer,
        meaning: question.prompt,
        exampleSentence: question.exampleSentence
      }));
  }, [lesson]);

  const [activeWord, setActiveWord] = useState(null);
  const [practicedWords, setPracticedWords] = useState({});

  useEffect(() => {
    setActiveWord(null);
    setPracticedWords({});
  }, [lesson.id]);

  useEffect(() => {
    if (!activeWord) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setActiveWord(null);
    }, 3200);

    return () => window.clearTimeout(timerId);
  }, [activeWord]);

  const practicedCount = Object.keys(practicedWords).length;
  const totalWords = practiceWords.length;
  const allPracticed = totalWords > 0 && practicedCount === totalWords;
  const teachingLang = lesson.id.startsWith("fr") ? "fr-FR" : lesson.id.startsWith("de") ? "de-DE" : "en-US";

  function pronounceWord(word) {
    if (!("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = teachingLang;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function handleWordClick(item) {
    setActiveWord(item);
    setPracticedWords((prev) => ({ ...prev, [item.word]: true }));
    pronounceWord(item.word);
  }

  function handleFinishLesson() {
    if (!allPracticed) {
      return;
    }

    onFinish({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      score: practicedCount,
      total: totalWords
    });
  }

  return (
    <section className="card quiz-panel">
      <div className="quiz-top-row">
        <h2>{lesson.title}</h2>
        <p>
          {t("wordsPracticed")}: {practicedCount}/{totalWords}
        </p>
      </div>

      <p className="practice-label">{t("practiceHint")}</p>

      <div className="word-button-list">
        {practiceWords.map((item) => {
          const isActive = activeWord?.word === item.word;

          return (
            <div key={item.word} className="word-cell">
              <button
                type="button"
                className={practicedWords[item.word] ? "word-button practiced" : "word-button"}
                onClick={() => handleWordClick(item)}
              >
                {item.word}
              </button>

              {isActive && (
                <aside className="meaning-popup local" role="status" aria-live="polite">
                  <p className="meaning-native">{activeWord.meaning}</p>
                  <p className="meaning-sentence">{item.exampleSentence}</p>
                </aside>
              )}
            </div>
          );
        })}
      </div>

      <div className="quiz-actions-sticky">
        <p className="action-hint">{t("finishLessonHint")}</p>
        <div className="quiz-actions">
          <button type="button" className="primary" onClick={handleFinishLesson} disabled={!allPracticed}>
            {t("finishLesson")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default QuizPanel;
