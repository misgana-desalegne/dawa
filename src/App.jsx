import React, { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import InfoPage from "./components/InfoPage";
import { AppLanguageProvider, useAppLanguage } from "./context/AppLanguageContext";
import LandingPage from "./pages/LandingPage";
import LearningPage from "./pages/LearningPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function AppRoutes() {
  const { t } = useAppLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const handledReloadRedirectRef = useRef(false);

  useEffect(() => {
    if (handledReloadRedirectRef.current) {
      return;
    }

    handledReloadRedirectRef.current = true;

    // Handle GitHub Pages SPA redirect
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('/');

    if (redirectPath) {
      // Remove the leading slash if present and reconstruct the path
      const cleanPath = redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath;
      navigate(cleanPath, { replace: true });
      return;
    }

    const entries = globalThis.performance?.getEntriesByType?.("navigation") || [];
    const isReload = entries[0]?.type === "reload";

    if (isReload && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/learn" element={<LearningPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
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
      <Route path="/donate" element={<Navigate to="/" replace />} />
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
