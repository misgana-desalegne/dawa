import React from "react";

function BrandHero({ className = "", headline, subtitle }) {
  return (
    <header className={`hero ${className}`.trim()}>
      {headline && <h1>{headline}</h1>}
      <p>{subtitle}</p>
    </header>
  );
}

export default BrandHero;
