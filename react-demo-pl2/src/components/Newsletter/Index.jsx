import './Newsletter.css';
import { useState } from 'react';
import { validarNome, validarEmailNewsletter } from './newsletter';
import { adicionarSubscritor, obterTodosSubscritores } from '../../indexedDB';

export default function Newsletter() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const atualizarContadorSubscritores = async () => {
    try {
      const subscritores = await obterTodosSubscritores();
      console.log('Total de subscritores:', subscritores.length);
    } catch (error) {
      console.error('Erro ao atualizar contador:', error);
    }
  };

  const subscreverNewsletter = async (e) => {
    e.preventDefault();

    if (!validarNome(nome)) {
      mostrarMensagem('Por favor, insira um nome válido (mínimo 2 caracteres)', 'erro');
      return;
    }

    if (!validarEmailNewsletter(email)) {
      mostrarMensagem('Por favor, insira um email válido', 'erro');
      return;
    }

    try {
      await adicionarSubscritor({ nome, email });
      mostrarMensagem(`Obrigado ${nome}! Subscrição confirmada com sucesso!`, 'sucesso');
      setNome('');
      setEmail('');
      
      await atualizarContadorSubscritores();

    } catch (error) {
      mostrarMensagem(error, 'erro');
    }
  };

  return (
    <div className="newsletter-section">
      <div id="Newsletter" className="scroll-anchor" />
      <div className="newsletter-container">
        <h3>Subscreva a nossa Newsletter</h3>
        <p>Receba as últimas novidades, eventos e investigações do CACA diretamente no seu email</p>

        <form className="form-newsletter" onSubmit={subscreverNewsletter}>
          <input type="text" placeholder="Seu nome completo*" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="email" placeholder="Seu email*" value={email}onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Subscrever Newsletter</button>
        </form>
        
        {mensagem.texto && (<div className={`newsletter-mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>)}
      </div>
    </div>
  );
}