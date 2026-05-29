import './Header.css';
import DesktopLogo from './media/logos/desktop.png';
import MobileLogo from './media/logos/mobile.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header>
            <div className="header-container">
                <div className="logotipo-mobile">
                    <Link to="/" onClick={closeMenu}>
                        <img src={MobileLogo} alt="Logotipo CACA" />
                    </Link>
                </div>
                <div className="logotipo-desktop">
                    <Link to="/" onClick={closeMenu}>
                        <img src={DesktopLogo} alt="Logotipo CACA" />
                    </Link>
                </div>

                <button className="menu-toggle" onClick={handleMenuToggle}>
                    ☰
                </button>

                <ul className={`nav-links ${isMenuOpen ? 'open' : 'closed'}`}>
                    <li><a href="#Missao" onClick={closeMenu}>Missão</a></li>
                    <li><a href="#Investigacao" onClick={closeMenu}>Investigação</a></li>
                    <li><a href="#Parcerias" onClick={closeMenu}>Parcerias</a></li>
                    <li><a href="#Conquistas" onClick={closeMenu}>Conquistas</a></li>
                    <li><a href="#Eventos" onClick={closeMenu}>Eventos</a></li>
                    <li><a href="#Newsletter" onClick={closeMenu}>Newsletter</a></li>
                    <li><a href="#Noticias" onClick={closeMenu}>Noticias</a></li>
                    <li><a href="#Contactos" onClick={closeMenu}>Contactos</a></li>

                    {/*  */}
                    <li className="nav-divider"></li>

                    {/* Links de autenticação - aparecem conforme o estado do login */}
                    {!isAuthenticated ? (
                        <>
                            <li><Link to="/login" onClick={closeMenu}>🔐 Login</Link></li>
                            <li><Link to="/register" onClick={closeMenu}>📝 Registo</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/profile" onClick={closeMenu}>👤 Perfil ({user?.name})</Link></li>
                            {user?.role === 'admin' && (
                                <li><Link to="/admin" onClick={closeMenu}>👑 Admin</Link></li>
                            )}
                            <li><button className="logout-btn" onClick={handleLogout}>🚪 Sair</button></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}