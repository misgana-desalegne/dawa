import React from "react";
import { Link } from "react-router-dom";
import BrandHero from "./BrandHero";
import TitleBar from "./TitleBar";
import { useAppLanguage } from "../context/AppLanguageContext";

function InfoPage({ title, description, primaryCtaLabel, primaryCtaPath = "/" }) {
  const { t } = useAppLanguage();

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

      <BrandHero className="hero-learning" headline={title} subtitle={description} />

      <section className="card modern-card">
        <h2>{title}</h2>
        <p className="subtext">{t("infoReady")}</p>
        <div className="title-links info-links">
          <Link className="title-link" to={primaryCtaPath}>
            {primaryCtaLabel}
          </Link>
          <Link className="title-link" to="/">
            {t("backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default InfoPage;
