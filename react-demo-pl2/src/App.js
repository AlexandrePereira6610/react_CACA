import './App.css';
import Header from './components/Header/Index';
import Hero from './components/Hero/Index';
import Investigacao from './components/Investigacao/Index';
import Parcerias from './components/Parcerias/Index';
import Conquistas from './components/Conquistas/Index';
import Mapa from './components/Mapa/Index';
import Newsletter from './components/Newsletter/Index';
import Noticias from './components/Noticias/Index';
import Contactos from './components/Contactos/Index';
import Weather from './components/Weather/Index';



function App() {
  return (
    <div className="container">
      <Header />
      <Hero id="missao" title="A nossa Missão" description="Ser uma instituição académica com o intuito de apoiar a realização de projetos locais, promovendo a inovação e rigor a fim de inspirar boa fé e confiança no setor medicinal e farmacêutico." />
      <Hero id="objetivo" title="Objetivo" description="Apoiar os seus associados e servir como ponto de referência para estes, com um foco em instituições clínicas e académicas locais e em alunos com interesse nestas áreas." />
      <Investigacao />
      <Parcerias/>
      <Conquistas/>
      <Mapa/>
      <Newsletter/>
      <Noticias/>
      <Contactos/>
      <Weather />
    </div>
  );
}

export default App;
