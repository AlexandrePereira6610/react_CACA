import './Eventos.css';
import { useState, useEffect, useCallback } from 'react';
import { adicionarEvento, obterTodosEventos, atualizarEvento, removerEvento, obterEventoPorId } from '../../indexedDB';
import { buscarPrevisaoMeteorologica } from '../apis/weatherAPI';
import { validarEvento, formatarData, truncarDescricao } from './eventos';

const formInicial = { titulo: '', descricao: '', data: '', hora: '', local: '', imagem: '' };

export default function EventosAdm() {
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [previsao, setPrevisao] = useState(null);

  const carregarEventos = useCallback(async () => {
    try {
      const lista = await obterTodosEventos();
      setEventos(lista);

    } catch (error) {
      mostrarMensagem('Erro ao carregar eventos', 'erro');  }}, []);

  useEffect(() => { carregarEventos();
   }, [carregarEventos]);

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    const erro = validarEvento(form.titulo, form.descricao, form.data, form.hora, form.local);
    if (erro) { mostrarMensagem(erro, 'erro'); return; }

    try {
      if (editandoId) {
        await atualizarEvento(editandoId, form);
        mostrarMensagem('Evento atualizado com sucesso!', 'sucesso');
        setEditandoId(null);

      } else {
        await adicionarEvento(form);
        mostrarMensagem('Evento adicionado com sucesso!', 'sucesso');
      }
      setForm(formInicial);

      await carregarEventos();

    } catch (error) {
      mostrarMensagem(error, 'erro');
    }
  };

  const editarEvento = async (id) => {
    try {
      const evento = await obterEventoPorId(id);
      setForm({ titulo: evento.titulo, descricao: evento.descricao,
        data: evento.data, hora: evento.hora, local: evento.local, imagem: evento.imagem || '' });
      setEditandoId(id);

      document.querySelector('.eventos-form-section').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      mostrarMensagem('Erro ao carregar evento para edição', 'erro'); }
  };

  const confirmarRemover = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este evento?')) {

      try {
        await removerEvento(id);
        mostrarMensagem('Evento removido com sucesso!', 'sucesso');
        await carregarEventos();
      } catch (error) {
        mostrarMensagem('Erro ao remover evento', 'erro');}
    }
  };

  const cancelarEdicao = () => {  setEditandoId(null); setForm(formInicial);};

  const verPrevisaoTempo = async (local, data) => {
    mostrarMensagem(`A buscar previsão do tempo para ${local}...`, 'sucesso');

    try {
      const resultado = await buscarPrevisaoMeteorologica(local, data);
      setPrevisao({ ...resultado, localEvento: local, dataEvento: formatarData(data) });
    } catch (error) {
      mostrarMensagem('Erro ao buscar previsão do tempo', 'erro');
    }
  };

  return (
    <section className="eventos-section">
      <div id="Eventos" className="scroll-anchor" />
      <h1>Gestão de Eventos</h1>

      <div className="eventos-container">

        <div className="eventos-form-section">
          <h3>{editandoId ? 'Editar Evento' : 'Adicionar Novo Evento'}</h3>
          <form className="form-evento" onSubmit={salvarEvento}>
            <input id="titulo" type="text" placeholder="Título do Evento*"
              value={form.titulo} onChange={handleChange} required  />

            <textarea  id="descricao" placeholder="Descrição do Evento*"
              value={form.descricao} onChange={handleChange} required />
            <div className="form-row">
              <input  id="data"  type="date" value={form.data}  onChange={handleChange} required/>
              <input id="hora" type="time" value={form.hora} onChange={handleChange} required />
            </div>
            <input id="local" type="text" placeholder="Local do Evento*" value={form.local} onChange={handleChange} required />
            <input id="imagem" type="url" placeholder="Link da imagem (opcional)" value={form.imagem} onChange={handleChange} />
            
            <div className="form-buttons">
              <button type="submit">Salvar Evento</button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicao}>Cancelar Edição</button> )}
            </div>
          </form>
          {mensagem.texto && (
            <div className={`evento-mensagem ${mensagem.tipo}`}>{mensagem.texto}</div> )}
        </div>

        <div className="eventos-list-section">
          <h3>Eventos Programados</h3>

          {previsao && (
            <div className="previsao-tempo-resultado">
              <div className="previsao-card">
                <h4>🌤️ Previsão para {previsao.localEvento}</h4>
                <p><strong>Data:</strong> {previsao.dataEvento}</p>
                <p><strong>Condição:</strong> {previsao.condicao}</p>
                <p><strong>Temperatura:</strong> {previsao.temperatura}</p>
                <p><strong>Humidade:</strong> {previsao.humidade}</p>
                <p><strong>Vento:</strong> {previsao.vento}</p>
                <small>Fonte: Open-Meteo </small>
              </div>
            </div>
          )}

          <div className="eventos-tabela">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Local</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {eventos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum evento encontrado</td>
                  </tr>
                ) : (
                  eventos.map((evento) => (
                    <tr key={evento.id}>
                      <td>{evento.titulo}</td>
                      <td>{truncarDescricao(evento.descricao)}</td>
                      <td>{formatarData(evento.data)}</td>
                      <td>{evento.hora}</td>
                      <td>{evento.local}</td>
                      <td>
                        <div className="eventos-actions">
                          <button className="btn-editar" onClick={() => editarEvento(evento.id)}>✎</button>
                          <button className="btn-remover" onClick={() => confirmarRemover(evento.id)}>🗑️</button>
                          <button className="btn-tempo" onClick={() => verPrevisaoTempo(evento.local, evento.data)}>☁</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}