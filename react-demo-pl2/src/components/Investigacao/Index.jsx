import './Investigacao.css';
import { useState } from 'react';

import AI from './media/AI.png';
import Cirugia from './media/cirugia.png';
import SaudeMental from './media/saudeMental.png';
import PrimeirosSocorros from './media/primeirosSocorros.png';
import ReabilitacaoFisica from './media/reabilitacaoFisica.png';

const TOTAL = 5;
const VISIBLE = 3;

export default function Investigacao() {
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState(null);

  const max = TOTAL - VISIBLE;

  const moveSlide = (dir) => {
    setOffset((prev) => Math.max(0, Math.min(prev + dir, max)));
  };

  const toggleDesc = (i) => {
    setExpanded(expanded === i ? null : i);
  };

  return (
    <section className="investigacao-section">
      <div id="Investigacao" className="scroll-anchor" />
      <h1>Formação e Ensino</h1>
      <div className="investigacao-main">
        <button className="prev" onClick={() => moveSlide(-1)}>&#10094;</button>
        <div className="investigacao-viewport">

          <div className="investigacao-track"
            style={{ transform: `translateX(calc(-${offset} * (33.333% + 1rem)))` }}>

            <div className="investigacao-contentor">
              <img src={AI} alt="Investigacao AI" />
              <p>14 novembro 2025 - 12 dezembro 2025</p>
              <h2>Inteligência Artificial em Saúde</h2>

              <p className="saberTexto" style={{ display: expanded === 0 ? 'block' : 'none' }}>
                Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.
              </p>
              <button name="investigacaoBotao" onClick={() => toggleDesc(0)}>
                {expanded === 0 ? 'Fechar' : 'Saber Mais'}
              </button>
            </div>

            <div className="investigacao-contentor">
              <img src={Cirugia} alt="Cirurgia" />
              <p>14 novembro 2025 - 12 dezembro 2025</p>
              <h2>Currículo de Trauma de Coluna</h2>

              <p className="saberTexto" style={{ display: expanded === 1 ? 'block' : 'none' }}>
                Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.
              </p>
              <button name="investigacaoBotao" onClick={() => toggleDesc(1)}>
                {expanded === 1 ? 'Fechar' : 'Saber Mais'}
              </button>
            </div>

            <div className="investigacao-contentor">
              <img src={SaudeMental} alt="Saude Mental em Estudantes Universitarios" />
              <p>14 novembro 2025 - 12 dezembro 2025</p>
              <h2>Saúde Mental em Estudantes Universitários</h2>

              <p className="saberTexto" style={{ display: expanded === 2 ? 'block' : 'none' }}>
                Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.
              </p>
              <button name="investigacaoBotao" onClick={() => toggleDesc(2)}>
                {expanded === 2 ? 'Fechar' : 'Saber Mais'}
              </button>
            </div>

            <div className="investigacao-contentor">
              <img src={PrimeirosSocorros} alt="Primeiros Socorros" />
              <p>14 novembro 2025 - 12 dezembro 2025</p>
              <h2>Primeiros Socorros em Contexto Escolar</h2>

              <p className="saberTexto" style={{ display: expanded === 3 ? 'block' : 'none' }}>
                Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.
              </p>
              <button name="investigacaoBotao" onClick={() => toggleDesc(3)}>
                {expanded === 3 ? 'Fechar' : 'Saber Mais'}
              </button>
            </div>

            <div className="investigacao-contentor">
              <img src={ReabilitacaoFisica} alt="Reabilitacao Fisica" />
              <p>14 novembro 2025 - 12 dezembro 2025</p>
              <h2>Reabilitação Física Pós-Cirúrgica</h2>
              
              <p className="saberTexto" style={{ display: expanded === 4 ? 'block' : 'none' }}>
                Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.
              </p>
              <button name="investigacaoBotao" onClick={() => toggleDesc(4)}>
                {expanded === 4 ? 'Fechar' : 'Saber Mais'}
              </button>
            </div>

          </div>
        </div>
        <button className="next" onClick={() => moveSlide(1)}>&#10095;</button>
      </div>
    </section>
  );
}