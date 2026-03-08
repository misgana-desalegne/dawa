import React from "react";

function LanguagePicker({ nativeLanguage, teachingLanguages, selectedCode, onSelect }) {
  return (
    <section className="card">
      <h2>Choose your learning language</h2>
      <p className="subtext">Native language: {nativeLanguage.nativeLabel} ({nativeLanguage.label})</p>
      <div className="options-grid">
        {teachingLanguages.map((language) => (
          <button
            key={language.code}
            type="button"
            className={selectedCode === language.code ? "option active" : "option"}
            onClick={() => onSelect(language.code)}
          >
            <span>{language.label}</span>
            <small>{language.nativeLabel}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default LanguagePicker;
