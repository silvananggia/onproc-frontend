"use client";
import React from "react";

function DisclaimerSection({ id, title, content }) {
  return (
    <section
      id={id}
      className="disclaimer-section"
      aria-labelledby={`section-title-${id}`}
    >
      <h2 id={`section-title-${id}`} className="section-title">
        {title}
      </h2>
      <div className="section-content">
        {content.map((paragraph, index) =>
          typeof paragraph === "string" ? (
            <p key={index} className="content-paragraph">
              {paragraph}
            </p>
          ) : (
            React.cloneElement(paragraph, {
              key: index,
              className: "content-paragraph",
            })
          ),
        )}
      </div>

      <style jsx>{`
        .disclaimer-section {
          margin-top: 20px;
          width: 100%;
          padding: 0 var(--page-pad-x);
          margin-bottom: 16px;
        }

        .section-title {
          color: #205072;
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .section-content {
          color: #202020;
          font-family: Lato, sans-serif;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.55;
          letter-spacing: 0px;
          margin-top: 8px;
        }

        .content-paragraph {
          margin: 0 0 8px 0;
        }

        .content-paragraph:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 991px) {
          .disclaimer-section {
            max-width: 100%;
            margin-top: 16px;
          }

          .section-title {
            max-width: 100%;
          }

          .section-content {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default DisclaimerSection;
