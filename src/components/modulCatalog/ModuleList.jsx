"use client";
import React, { useEffect, useRef, useState } from "react";
import ModuleCard from "./ModuleCard";

const SORT_OPTIONS = [
  { id: "default", label: "Urutan default" },
  { id: "az", label: "Nama A–Z" },
  { id: "za", label: "Nama Z–A" },
];

function ModuleList({
  modules = [],
  totalCount = 0,
  sortOrder = "default",
  onSortChange,
  onReset,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSort = SORT_OPTIONS.find((option) => option.id === sortOrder) || SORT_OPTIONS[0];

  return (
    <main className="module-list-container">
      <div className="module-list-content">
        <div className="module-list-header">
          <div className="module-list-title-container">
            <h1 className="module-list-title">Katalog Modul</h1>
            <p className="module-list-count">
              Menampilkan {modules.length} dari {totalCount} data
            </p>
          </div>
          <div className="sort-wrapper" ref={sortRef}>
            <button
              type="button"
              className="sort-button"
              aria-label="Sortir modul"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((open) => !open)}
            >
              <span className="sort-label">Sortir: {currentSort.label}</span>
            </button>
            {sortOpen && (
              <ul className="sort-menu" role="listbox">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className={`sort-option ${sortOrder === option.id ? "active" : ""}`}
                      onClick={() => {
                        onSortChange(option.id);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="modules-container">
          {modules.length === 0 ? (
            <div className="empty-state">
              <p>Tidak ada modul yang sesuai dengan pencarian atau filter Anda.</p>
              <button type="button" className="empty-reset" onClick={onReset}>
                Atur ulang pencarian
              </button>
            </div>
          ) : (
            modules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                subtitle={module.subtitle}
                url={module.url}
                description={module.description}
                datasets={module.datasets}
                iconUrl={module.iconUrl}
                external={module.external}
              />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .module-list-container {
          display: flex;
          flex-direction: column;
          width: 76%;
          margin-left: 20px;
        }

        @media (max-width: 991px) {
          .module-list-container {
            width: 100%;
            margin-left: 0;
          }
        }

        .module-list-header {
          display: flex;
          width: 100%;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .module-list-title-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          flex-wrap: wrap;
        }

        .module-list-title {
          color: #000;
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .module-list-count {
          color: #7c7c7c;
          font-family: Lato, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 4px;
        }

        .sort-wrapper {
          position: relative;
        }

        .sort-button {
          border-radius: 8px;
          background-color: #f1f1f1;
          border: 2px solid #205072;
          display: flex;
          padding: 10px 16px;
          align-items: center;
          cursor: pointer;
        }

        .sort-label {
          color: #205072;
          font-size: 14px;
          font-family: Lato, sans-serif;
        }

        .sort-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: #fff;
          border: 1px solid #205072;
          border-radius: 8px;
          list-style: none;
          margin: 0;
          padding: 8px 0;
          min-width: 180px;
          z-index: 20;
          box-shadow: 0 8px 20px rgba(32, 80, 114, 0.12);
        }

        .sort-option {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 10px 16px;
          cursor: pointer;
          color: #205072;
          font-family: Lato, sans-serif;
        }

        .sort-option:hover,
        .sort-option.active {
          background: #e8f1f6;
        }

        .empty-state {
          margin-top: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          text-align: center;
          color: #7c7c7c;
          font-family: Lato, sans-serif;
        }

        .empty-reset {
          margin-top: 12px;
          background: #205072;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}

export default ModuleList;
