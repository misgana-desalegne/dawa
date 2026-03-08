import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import InfoPage from "./components/InfoPage";
import { AppLanguageProvider, useAppLanguage } from "./context/AppLanguageContext";
import LandingPage from "./pages/LandingPage";
import LearningPage from "./pages/LearningPage";

function AppRoutes() {
  const { t } = useAppLanguage();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/learn" element={<LearningPage />} />
      <Route
        path="/signup"
        element={
          <InfoPage
            title={t("signupTitle")}
            description={t("signupBody")}
            primaryCtaLabel={t("createAccount")}
          />
        }
      />
      <Route
        path="/login"
        element={
          <InfoPage
            title={t("loginTitle")}
            description={t("loginBody")}
            primaryCtaLabel={t("loginAction")}
          />
        }
      />
      <Route
        path="/about"
        element={
          <InfoPage
            title={t("aboutTitle")}
            description={t("aboutBody")}
            primaryCtaLabel={t("startLearning")}
            primaryCtaPath="/"
          />
        }
      />
      <Route
        path="/donate"
        element={
          <InfoPage
            title={t("donateTitle")}
            description={t("donateBody")}
            primaryCtaLabel={t("supportProject")}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppLanguageProvider>
      <AppRoutes />
    </AppLanguageProvider>
  );
}

export default App;
