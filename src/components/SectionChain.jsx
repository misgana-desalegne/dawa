import React from "react";
import { useAppLanguage } from "../context/AppLanguageContext";

function SectionChain({ lessons, completedLessons, completedCount, onSelectSection }) {
  const { t } = useAppLanguage();

  return (
    <div className="section-chain" role="list" aria-label={t("sections")}>
      {lessons.map((lesson, index) => {
        const locked = index > completedCount;
        return (
          <React.Fragment key={lesson.id}>
            <button
              type="button"
              role="listitem"
              disabled={locked}
              className={
                completedLessons[lesson.id]
                  ? "section-node completed"
                  : locked
                    ? "section-node locked"
                    : "section-node"
              }
              onClick={() => onSelectSection(lesson.id)}
              aria-label={`Open section ${index + 1}`}
              title={lesson.title}
            >
              {index + 1}
            </button>
            {index < lessons.length - 1 && <span className="section-link" aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default SectionChain;
