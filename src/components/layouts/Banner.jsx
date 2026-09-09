"use client";
import React from "react";

function Banner({ title, subtitle, description }) {
  return (
    <section className="banner">
      <div className="banner-content">
        <h1 id="banner-title" className="banner-title">
          {title}
        </h1>
        <p className="banner-subtitle">{subtitle}</p>

        <p className="banner-description">{description}</p>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/649a74a0240d8164d375f767644164cfb887d124?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e"
        alt=""
        className="banner-background"
      />

      <style jsx>{`
        .banner {
          display: flex;
          align-items: center;
          gap: 24px;
          width: 100%;
          background-color: #32909c;
          padding: var(--page-pad-y) var(--page-pad-x);
        }


        .banner-content {
          color: #f1f1f1;
          font-family: var(--font-heading);
          margin-left: 0;
          flex: 1;
          width: 100%;
        }

        .banner-title {
          font-size: 28px;
          margin: 0 0 6px 0;
        }

        .banner-subtitle {
          font-family: Lato, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: 0px;
          margin: 0 0 8px 0;
        }

        .banner-description {
          font-family: "Lato", sans-serif;
          font-size: 15px;
          line-height: 1.55;
          margin: 0;
        }

        .banner-background {
          width: auto;
          height: 180px;
          margin-left: auto;
        }


        @media (max-width: 991px) {
          .banner {
            max-width: 100%;
          }

          .banner-background {
            max-width: 100%;
          }

          .banner-content {
            padding-left: 20px;
            padding-right: 20px;
          }

          .banner-header {
            max-width: 100%;
          }

          .banner-title {
            max-width: 100%;
          }

          .banner-subtitle {
            max-width: 100%;
          }

          .banner-description {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default Banner;
