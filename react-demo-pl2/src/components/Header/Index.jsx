import './Header.css';
import DesktopLogo from './media/logos/desktop.png';
import MobileLogo from './media/logos/mobile.png';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logotipo-mobile">
          <img
            src={MobileLogo}
            alt="Logotipo CACA"
          />
        </div>
        <div className="logotipo-desktop">
          <img
            src={DesktopLogo}
            alt="Logotipo CACA"
          />
        </div>

        <button
          className="menu-toggle"
          onClick={handleMenuToggle}
        >
          ☰
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'open' : 'closed'}`}>
          <li><a href="#Missao">Missão</a></li>
          <li><a href="#Investigacao">Investigação</a></li>
          <li><a href="#Parcerias">Parcerias</a></li>
          <li><a href="#Conquistas">Conquistas</a></li>
          <li><a href="#Eventos">Eventos</a></li>
          <li><a href="#Newsletter">Newsletter</a></li>
          <li><a href="#Noticias">Noticias</a></li>
          <li><a href="#Contactos">Contactos</a></li>
        </ul>
      </div>
    </header>
  );
}