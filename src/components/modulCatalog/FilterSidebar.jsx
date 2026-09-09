"use client";
import React, { useState } from "react";
import { MODULE_CATEGORIES } from "./modulesData";

function FilterSidebar({
  datasets = [],
  selectedDatasets = [],
  onToggleDataset,
  selectedCategories = [],
  onToggleCategory,
  accessFilter = "all",
  onAccessChange,
  onReset,
  hasActiveFilters = false,
}) {
  const [openSections, setOpenSections] = useState({
    dataset: true,
    topic: true,
    access: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="filter-sidebar" aria-label="Opsi filter">
      <div className="filter-container">
        <div className="filter-header">
          <div className="filter-title-row">
            <h2 className="filter-title">Filter</h2>
            {hasActiveFilters && (
              <button type="button" className="reset-button" onClick={onReset}>
                Atur ulang
              </button>
            )}
          </div>

          <div className="filter-category">
            <button
              type="button"
              className="filter-dropdown"
              onClick={() => toggleSection("dataset")}
              aria-expanded={openSections.dataset}
            >
              <span className="filter-label">Dataset</span>
              <span className="filter-chevron">{openSections.dataset ? "−" : "+"}</span>
            </button>
            {openSections.dataset && (
              <div className="filter-options" id="dataset-options">
                {datasets.map((dataset) => (
                  <label key={dataset} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.includes(dataset)}
                      onChange={() => onToggleDataset(dataset)}
                    />
                    <span>{dataset}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="filter-divider" />
          </div>

          <div className="filter-category">
            <button
              type="button"
              className="filter-dropdown"
              onClick={() => toggleSection("topic")}
              aria-expanded={openSections.topic}
            >
              <span className="filter-label">Topik</span>
              <span className="filter-chevron">{openSections.topic ? "−" : "+"}</span>
            </button>
            {openSections.topic && (
              <div className="filter-options">
                {MODULE_CATEGORIES.map((category) => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onToggleCategory(category.id)}
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="filter-divider" />
          </div>

          <div className="filter-category">
            <button
              type="button"
              className="filter-dropdown"
              onClick={() => toggleSection("access")}
              aria-expanded={openSections.access}
            >
              <span className="filter-label">Akses</span>
              <span className="filter-chevron">{openSections.access ? "−" : "+"}</span>
            </button>
            {openSections.access && (
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="access-filter"
                    checked={accessFilter === "all"}
                    onChange={() => onAccessChange("all")}
                  />
                  <span>Semua</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="access-filter"
                    checked={accessFilter === "public"}
                    onChange={() => onAccessChange("public")}
                  />
                  <span>Publik</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="access-filter"
                    checked={accessFilter === "login"}
                    onChange={() => onAccessChange("login")}
                  />
                  <span>Perlu login</span>
                </label>
              </div>
            )}
            <div className="filter-divider" />
          </div>
        </div>
        <div className="filter-separator" aria-hidden="true" />
      </div>

      <style jsx>{`
        .filter-sidebar {
          display: flex;
          flex-direction: column;
          width: 24%;
        }

        @media (max-width: 991px) {
          .filter-sidebar {
            width: 100%;
          }
        }

        .filter-container {
          display: flex;
          align-items: stretch;
          gap: 16px;
          font-family: Lato, sans-serif;
          color: #202020;
        }

        .filter-header {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .filter-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .filter-title {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }

        .reset-button {
          border: none;
          background: none;
          color: #205072;
          cursor: pointer;
          font-size: 14px;
          text-decoration: underline;
          padding: 0;
        }

        .filter-category {
          margin-top: 8px;
          width: 100%;
        }

        .filter-dropdown {
          display: flex;
          width: 100%;
          padding: 8px 4px;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        .filter-label {
          font-size: 16px;
          font-weight: 500;
        }

        .filter-chevron {
          color: #205072;
          font-size: 22px;
          line-height: 1;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 8px 8px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 400;
          color: #202020;
          cursor: pointer;
        }

        .filter-option input {
          accent-color: #205072;
          width: 16px;
          height: 16px;
        }

        .filter-divider {
          border: none;
          border-bottom: 1px solid #202020;
          width: 100%;
        }

        .filter-separator {
          border: none;
          border-left: 1px solid #000;
          width: 1px;
          flex-shrink: 0;
          min-height: 400px;
        }

        @media (max-width: 991px) {
          .filter-separator {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}

export default FilterSidebar;
