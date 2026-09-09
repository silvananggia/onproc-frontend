import React from "react";

function Card({ title, description, actionText, href }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <a href={href || "/katalog-modul"} className="card-action">
        {actionText}
      </a>
      <style jsx>{`
        .card {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .card-title {
          font-family: var(--font-heading);
          font-size: 20px;
          line-height: 1.3;
          font-weight: 700;
          color: #202020;
          margin: 0;
        }
        .card-description {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.55;
          font-weight: 400;
          color: #202020;
          margin: 0;
        }
        .card-action {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          line-height: 1.4;
          color: #205072;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          text-align: left;
          display: block;
          width: 100%;
          margin-bottom: 0;
        }
      `}</style>
    </article>
  );
}

export default Card;
