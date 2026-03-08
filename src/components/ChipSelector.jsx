import React from "react";

function ChipSelector({
  title,
  items,
  selectedValue,
  onSelect,
  getValue,
  getPrimaryLabel,
  getSecondaryLabel,
  getBadge,
  className = "",
  ariaLabel
}) {
  return (
    <section>
      <p className="subtext">{title}</p>
      <div className={`chip-grid ${className}`.trim()} role="list" aria-label={ariaLabel}>
        {items.map((item) => {
          const value = getValue(item);
          const primary = getPrimaryLabel(item);
          const secondary = getSecondaryLabel ? getSecondaryLabel(item) : null;
          const badge = getBadge ? getBadge(item) : null;

          return (
            <button
              key={value}
              type="button"
              role="listitem"
              className={selectedValue === value ? "chip-option active" : "chip-option"}
              onClick={() => onSelect(value)}
            >
              {badge && <span className="chip-badge">{badge}</span>}
              <span>{primary}</span>
              {secondary && <small>{secondary}</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ChipSelector;
