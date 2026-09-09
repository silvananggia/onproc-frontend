"use client";
import React from "react";

function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <section className="search-section" aria-label="Cari modul">
      <form className="search-container" onSubmit={handleSubmit}>
        <div className="search-field">
          <div className="search-input-wrapper">
            <div className="search-icon-container">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff304e6de55c7504ab5ca64e02d1cc4ac7d87ce3?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                alt=""
                className="search-icon-bg"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e12f6fc1d5e24425d7384a1af0601d07b51f5036?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
                alt=""
                className="search-icon"
              />
            </div>
            <input
              type="search"
              placeholder="Cari modul, dataset, atau topik"
              className="search-input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              aria-label="Cari modul"
            />
          </div>
        </div>
        <button type="submit" className="search-button">
          Cari
        </button>
      </form>

      <style jsx>{`
        .search-section {
          margin-bottom: 20px;
        }

        .search-container {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 991px) {
          .search-container {
            max-width: 100%;
          }
        }

        .search-field {
          min-height: 48px;
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
          width: fit-content;
        }

        .search-input-wrapper {
          border-radius: 4px;
          border: 1px solid rgba(32, 32, 32, 1);
          display: flex;
          width: 100%;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          height: 48px;
        }

        .search-icon-container {
          display: flex;
          position: relative;
          width: 24px;
          height: 24px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .search-icon-bg {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .search-icon {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .search-input {
          font-family: Lato, sans-serif;
          font-size: 16px;
          color: #202020;
          font-weight: 500;
          line-height: 1.4;
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          min-width: 160px;
        }

        .search-input::placeholder {
          color: #7c7c7c;
        }

        .search-button {
          border-radius: 8px;
          background-color: #205072;
          padding: 0 24px;
          height: 48px;
          font-family: Lato, sans-serif;
          font-size: 16px;
          color: #f1f1f1;
          font-weight: 400;
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }

        .search-button:hover {
          background-color: #163a54;
        }

        @media (max-width: 991px) {
          .search-button {
            padding: 16px 20px;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default SearchBar;
