import React, { createContext, useContext, useMemo, useState } from "react";
import { uiText } from "../i18n/uiText";

const AppLanguageContext = createContext(null);

export function AppLanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("app-ui-language") || "en");

  const value = useMemo(() => {
    const t = (key) => uiText[language]?.[key] || uiText.en[key] || key;

    const setAppLanguage = (nextLanguage) => {
      setLanguage(nextLanguage);
      localStorage.setItem("app-ui-language", nextLanguage);
    };

    return {
      language,
      setLanguage: setAppLanguage,
      t
    };
  }, [language]);

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(AppLanguageContext);

  if (!context) {
    throw new Error("useAppLanguage must be used inside AppLanguageProvider");
  }

  return context;
}
