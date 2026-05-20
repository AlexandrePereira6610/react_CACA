import './Parcerias.css';
import { useState, useEffect, useCallback } from 'react';

import uacBackground from './media/uacBackground.png';
import uacLogo from './media/uacLogo.png';
import espiritoSantoPaisagem from './media/espiritoSantoPaisagem.png';
import espiritoSantoLogo from './media/espiritoSantoLogo.png';
import cufPaisagem from './media/cufPaisagem.png';
import cufLogo from './media/cufLogo.png';
import associacaoDoentesPaisagem from './media/associacaoDoentesPaisagem.png';
import associacaoDoentesLogo from './media/associacaoDoentesLogo.png';

const TOTAL = 4;

export default function Parcerias() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent((index + TOTAL) % TOTAL);
  }, []);

  useEffect(() => {  const timer = setInterval(() => goTo(current + 1), 5000);
    
    return () => clearInterval(timer);}, [current, goTo]);

  return (
    <section className="parcerias-section">
      <div id="Parcerias" className="scroll-anchor" />
      <h1>Parcerias</h1>

      <div className="slideshow-container">

        <div className={`mySlides fade ${current === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${uacBackground})` }}>
          <div className="partner-logo-container">
            <img src={uacLogo} alt="Logotipo UAC" />
          </div>
          <div className="partner-text-container">
            <div className="text">Universidade dos Açores - Formação contínua, investigação científica e apoio a estudantes.</div>
          </div>
        </div>

        <div className={`mySlides fade ${current === 1 ? 'active' : ''}`} style={{ backgroundImage: `url(${espiritoSantoPaisagem})` }}>
          <div className="partner-logo-container">
            <img src={espiritoSantoLogo} alt="Logotipo Hospital Divino Espirito Santo" />
          </div>
          <div className="partner-text-container">
            <div className="text">Hospital Divino Espirito Santo - Referência em cuidados hospitalares e proximidade com a comunidade.</div>
          </div>
        </div>

        <div className={`mySlides fade ${current === 2 ? 'active' : ''}`} style={{ backgroundImage: `url(${cufPaisagem})` }}>
          <div className="partner-logo-container">
            <img src={cufLogo} alt="Logotipo CUF" />
          </div>
          <div className="partner-text-container">
            <div className="text">Hospital CUF - Suporte clínico especializado e excelência hospitalar.</div>
          </div>
        </div>

        <div className={`mySlides fade ${current === 3 ? 'active' : ''}`} style={{ backgroundImage: `url(${associacaoDoentesPaisagem})` }}>
          <div className="partner-logo-container">
            <img src={associacaoDoentesLogo} alt="Logotipo Associacao de Doentes de Dor Cronica" />
          </div>
          <div className="partner-text-container">
            <div className="text">Associação de Doentes de Dor Crónica - Apoio, sensibilização e melhoria da qualidade de vida dos doentes.</div>
          </div>
        </div>

        <button className="prev" onClick={() => goTo(current - 1)}>&#10094;</button>
        <button className="next" onClick={() => goTo(current + 1)}>&#10095;</button>
      </div>

      <div className="dots-container">
        <button className={`dot ${current === 0 ? 'active' : ''}`} onClick={() => goTo(0)} />
        <button className={`dot ${current === 1 ? 'active' : ''}`} onClick={() => goTo(1)} />
        <button className={`dot ${current === 2 ? 'active' : ''}`} onClick={() => goTo(2)} />
        <button className={`dot ${current === 3 ? 'active' : ''}`} onClick={() => goTo(3)} />
      </div>
    </section>
  );
}