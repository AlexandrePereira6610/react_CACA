import './Eventos.css';
import { useState, useEffect } from 'react';
import { obterTodosEventos } from '../../indexedDB';
import { buscarPrevisaoMeteorologica } from '../apis/weatherAPI';
import { formatarData } from './eventos';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const lista = await obterTodosEventos();
        setEventos(lista);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    }
    carregar();
  }, []);

  const verPrevisao = async (id, local, data) => {
    try {
      const resultado = await buscarPrevisaoMeteorologica(local, data);
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === id ? { ...ev, previsao: resultado } : ev
        )
      );
    } catch (error) {
      console.error('Erro ao buscar previsão:', error);
    }
  };

  return (
    <div className="eventos-section">
      <div id="Eventos" className="scroll-anchor" />
      <h1>Eventos Programados</h1>

      <div className="eventos-lista-publica">
        {eventos.length === 0 ? (
          <p className="eventos-vazio">Não há eventos programados de momento</p> ) : (
          eventos.map((evento) => (
            <div className="evento-card" key={evento.id}>

              {evento.imagem ? (
                <img src={evento.imagem} alt={evento.titulo} className="evento-card-imagem" />) : (
                
                <div className="evento-card-imagem-placeholder">
                  <span>Sem imagem</span></div>)}

              <div className="evento-card-body">
                <div className="evento-card-header">
                  <h3>{evento.titulo}</h3>
                  <span className="evento-data">📅 {formatarData(evento.data)} às {evento.hora}</span>
                </div>
                <p className="evento-descricao">{evento.descricao}</p>
                <p className="evento-local">📍 {evento.local}</p>

                <button className="btn-previsao"  onClick={() => verPrevisao(evento.id, evento.local, evento.data)} >
                  ☁ Ver Previsão do Tempo</button>

                {evento.previsao && (
                  <div className="previsao-card">
                    <h4>🌤️ Previsão para {evento.local}</h4>
                    <p><strong>Data:</strong> {formatarData(evento.data)}</p>
                    <p><strong>Condição:</strong> {evento.previsao.condicao}</p>
                    <p><strong>Temperatura:</strong> {evento.previsao.temperatura}</p>
                    <p><strong>Humidade:</strong> {evento.previsao.humidade}</p>
                    <p><strong>Vento:</strong> {evento.previsao.vento}</p>
                    <small>Fonte: Open-Meteo</small>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}