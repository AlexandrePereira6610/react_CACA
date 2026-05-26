import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Componentes existentes
import Header from './components/Header/Index';
import Hero from './components/Hero/Index';
import Investigacao from './components/Investigacao/Index';
import Parcerias from './components/Parcerias/Index';
import Conquistas from './components/Conquistas/Index';
import Mapa from './components/Mapa/Index';
import Newsletter from './components/Newsletter/Index';
import Noticias from './components/Noticias/Index';
import Contactos from './components/Contactos/Index';
import Eventos from './components/Eventos/Index';
import EventosAdm from './components/Eventos/IndexAdm';

// Novas páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function HomePage() {
    return (
        <>
            <Header />
            <Hero id="missao" title="A nossa Missão" description="Ser uma instituição académica com o intuito de apoiar a realização de projetos locais, promovendo a inovação e rigor a fim de inspirar boa fé e confiança no setor medicinal e farmacêutico." />
            <Hero id="objetivo" title="Objetivo" description="Apoiar os seus associados e servir como ponto de referência para estes, com um foco em instituições clínicas e académicas locais e em alunos com interesse nestas áreas." />
            <Investigacao />
            <Parcerias />
            <Conquistas />
            <Eventos />
            <Mapa />
            <Noticias />
            <Newsletter />
            <Contactos />
            <EventosAdm />
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminPanel />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;