"use client";
import React from "react";
import { Link } from "react-router-dom";

function ModuleCard({
  title,
  subtitle,
  url,
  description,
  datasets,
  iconUrl,
  external = false,
}) {
  const isExternal = external || /^https?:\/\//i.test(url || "");
  const content = (
    <div className="module-content">
      <div className="module-info">
        <div className="module-text">
          <div className="module-title-row">
            <h2 className="module-title">{title}</h2>
            {isExternal && <span className="external-badge">Tautan eksternal</span>}
          </div>
          {subtitle ? <p className="module-subtitle">{subtitle}</p> : null}
          <p className="module-description">{description}</p>
        </div>
        <div className="module-datasets">
          <img src={iconUrl} alt="" className="dataset-icon" />
          <span className="dataset-list">{datasets}</span>
        </div>
      </div>
    </div>
  );

  return (
    <article className="module-card">
      {isExternal ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="module-link">
          {content}
        </a>
      ) : (
        <Link to={url} className="module-link">
          {content}
        </Link>
      )}
      <div className="module-divider" aria-hidden="true" />

      <style jsx>{`
        .module-card {
          margin-top: 8px;
          width: 100%;
          font-family: Lato, sans-serif;
        }

        .module-link {
          text-decoration: none;
          color: inherit;
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }

        .module-link:hover,
        .module-link:focus-visible {
          background-color: #f4f8fb;
          box-shadow: 0 0 0 2px #205072 inset;
          outline: none;
        }

        .module-content {
          display: flex;
          width: 100%;
          align-items: flex-start;
        }

        .module-info {
          min-width: 240px;
          flex-grow: 1;
        }

        .module-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .module-title {
          color: #202020;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
        }

        .external-badge {
          font-size: 12px;
          color: #205072;
          border: 1px solid #205072;
          border-radius: 999px;
          padding: 2px 8px;
        }

        .module-subtitle {
          color: #b45309;
          font-size: 14px;
          font-weight: 600;
          margin: 4px 0 0;
        }

        .module-description {
          color: #7c7c7c;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          margin-top: 6px;
          margin-bottom: 0;
        }

        .module-datasets {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #202020;
          margin-top: 8px;
        }

        .dataset-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .module-divider {
          border: none;
          border-bottom: 1px solid #000;
          margin-top: 8px;
          width: 100%;
        }
      `}</style>
    </article>
  );
}

export default ModuleCard;
