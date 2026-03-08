import React from "react";

function LessonCard({ lesson, index, isSelected, isComplete, onStart }) {
  return (
    <button type="button" className={isSelected ? "lesson selected" : "lesson"} onClick={onStart}>
      <div>
        <p className="lesson-kicker">Lesson {index + 1}</p>
        <h3>{lesson.title}</h3>
      </div>
      <div className="lesson-meta">
        <span>{lesson.questions.length} questions</span>
        <span>{isComplete ? "Completed" : "Open"}</span>
      </div>
    </button>
  );
}

export default LessonCard;
