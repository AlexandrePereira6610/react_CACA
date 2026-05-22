import './Mapa.css';
import { useState, useEffect, useRef } from 'react';
import { inicializarMapa, mostrarLocalEventoNoMapa, mostrarTodosEventosNoMapa } from '../apis/mapAPI';

export default function Mapa() {
  const [pesquisa, setPesquisa] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const mapaInicializado = useRef(false);

  useEffect(() => {
    if (!mapaInicializado.current) { inicializarMapa(); mapaInicializado.current = true; }}, []);

  const pesquisarLocalizacao = () => {
    if (pesquisa.trim() === '') {
      alert('Por favor, insira uma localização para pesquisar');
      return; }
    mostrarLocalEventoNoMapa(pesquisa, 'Local pesquisado', setMensagem); };

  return (
    <div className="mapa-section">
      <div className="mapa-container">
        <h3>Mapa de Eventos CACA</h3>
        <div className="mapa-pesquisa">
          <input
            type="text"
            id="mapa-pesquisa-local"
            placeholder="Pesquisar localização (ex: Ponta Delgada, Angra do Heroísmo...)"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
          <button onClick={pesquisarLocalizacao}>Pesquisar</button>
        </div>
        <div className="mapa-botoes">
          <button onClick={() => mostrarTodosEventosNoMapa([], setMensagem)}>Mostrar todos os eventos</button>
        </div>
        <div id="mapa-container"></div>
        {mensagem.texto && (
          <div className={`mapa-mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}
        <small style={{ color: '#666' }}>Mapa fornecido por OpenStreetMap - Dados geográficos abertos e gratuitos</small>
      </div>
    </div>
  );
}