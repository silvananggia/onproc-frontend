import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../actions/authActions";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user ? user.name : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Yakin akan keluar dari GEOMIMO?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/");
      }
    });
  };

  return (
    <header className="header">
      <div className="logo-container">
        <a href="/" aria-label="Beranda GEOMIMO">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/469fc9c3b72499528f6a0413e43b45421fb0bda3?placeholderIfAbsent=true"
            alt="Logo BRIN"
            className="logo"
          />
        </a>
      </div>
      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
      <nav className={`navigation ${menuOpen ? "open" : ""}`}>
        <a href="/katalog-modul" className="nav-item">
          Katalog Modul
        </a>
        <a href="/infografis" className="nav-item">
          Infografis
        </a>
        <a href="/tentang" className="nav-item">
          Tentang Kami
        </a>
        <a href="/kontak" className="nav-item">
          Kontak
        </a>
        {userEmail ? (
          <div className="user-info">
            <span>{userEmail}</span>
            <button type="button" className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <a href="/signin-app" className="nav-item">
              Login
            </a>
            <a href="/register" className="nav-button">
              Daftar
            </a>
          </>
        )}
      </nav>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px var(--page-pad-x);
          background-color: #f1f1f1;
          position: relative;
          z-index: 20;
        }

        .logo {
          width: 116px;
          height: 45px;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #205072;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
        }

        .navigation {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .nav-item {
          font-family: "Lato", sans-serif;
          color: #205072;
          cursor: pointer;
          text-decoration: none;
          padding: 8px 10px;
        }

        .user-info {
          font-family: "Lato", sans-serif;
          color: #205072;
          display: flex;
          padding: 8px 16px;
          align-items: center;
          gap: 12px;
        }

        .nav-button {
          font-family: "Lato", sans-serif;
          font-size: 16px;
          color: #f1f1f1;
          cursor: pointer;
          padding: 8px 20px;
          border-radius: 8px;
          background-color: #205072;
          text-decoration: none;
          border: none;
        }

        @media (max-width: 991px) {
          .menu-toggle {
            display: block;
          }

          .navigation {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: #f1f1f1;
            padding: 16px 24px 24px;
            align-items: stretch;
            gap: 8px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
          }

          .navigation.open {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
