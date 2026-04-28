import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAppLanguage } from "../context/AppLanguageContext";

function QuizPanel({ lesson, nativeLanguage, targetLanguage, onFinish }) {
  const { t } = useAppLanguage();
  const practiceQuestions = useMemo(() => lesson.questions.slice(0, 5), [lesson]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [answeredMap, setAnsweredMap] = useState({});
  const [feedbackState, setFeedbackState] = useState(null);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedChoice("");
    setAnsweredMap({});
    setFeedbackState(null);
  }, [lesson.id]);

  useEffect(() => {
    setSelectedChoice("");
    setFeedbackState(null);
  }, [currentIndex]);

  const currentQuestion = practiceQuestions[currentIndex];
  const practicedCount = Object.keys(answeredMap).length;
  const totalWords = practiceQuestions.length;
  const allPracticed = totalWords > 0 && practicedCount === totalWords;
  const currentResult = answeredMap[currentIndex];
  const currentCorrect = currentResult?.isCorrect;
  const nativeLabel = nativeLanguage?.nativeLabel || nativeLanguage?.label || "";
  const targetLabel = targetLanguage?.nativeLabel || targetLanguage?.label || "";

  const speakingLang = targetLanguage?.code === "fr" ? "fr-FR" : targetLanguage?.code === "de" ? "de-DE" : "en-US";

  function pronounceWord(word) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = speakingLang;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function handleChoiceSelect(choice) {
    if (currentCorrect) {
      return;
    }

    const isCorrect = choice === currentQuestion.answer;
    setSelectedChoice(choice);
    setFeedbackState(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setAnsweredMap((prev) => ({
        ...prev,
        [currentIndex]: {
          choice,
          isCorrect: true
        }
      }));
      pronounceWord(currentQuestion.answer);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= totalWords) {
      return;
    }

    setCurrentIndex((index) => index + 1);
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

  if (!currentQuestion) {
    return null;
  }

  return (
    <section className="card quiz-panel">
      <div className="quiz-top-row">
       

        <div className="quiz-meta">
          <span>
            {t("wordsPracticed")}: {practicedCount}/{totalWords}
          </span>
          <span>
            {t("question")} {currentIndex + 1}/{totalWords}
          </span>
        </div>
      </div>

      <p className="practice-label">{t("selectAnswer")}</p>

      <div className="question-card">
        <p className="question-prompt">{currentQuestion.prompt}</p>

        <div className="choice-grid">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const isCorrectChoice = choice === currentQuestion.answer;
            const classNames = ["choice-button"];

            if (isSelected && feedbackState === "correct") {
              classNames.push("correct");
            }
            if (isSelected && feedbackState === "incorrect") {
              classNames.push("incorrect");
            }
            if (currentCorrect && isCorrectChoice) {
              classNames.push("correct");
            }

            return (
              <button
                type="button"
                key={choice}
                className={classNames.join(" ")}
                onClick={() => handleChoiceSelect(choice)}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className="choice-footer">
          <p className={`choice-feedback ${feedbackState === "incorrect" ? "incorrect" : ""}`}>
            {feedbackState === "correct" && t("correctAnswer")}
            {feedbackState === "incorrect" && t("incorrectAnswer")}
          </p>
          <button type="button" className="secondary listen-button" onClick={() => pronounceWord(currentQuestion.answer)}>
            {t("listenWord")}
          </button>
        </div>

        {currentCorrect && (
          <p className="meaning-sentence">
            <strong>{t("exampleSentence")}</strong> {currentQuestion.exampleSentence}
          </p>
        )}
      </div>

      <div className="quiz-actions-sticky">
        <p className="action-hint">{t("finishLessonHint")}</p>
        <div className="quiz-actions">
          {currentCorrect && currentIndex + 1 < totalWords && (
            <button type="button" className="secondary" onClick={handleNext}>
              {t("nextQuestion")}
            </button>
          )}
          <button type="button" className="primary" onClick={handleFinishLesson} disabled={!allPracticed}>
            {t("finishLesson")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default QuizPanel;
