import './Contactos.css';
import { useState } from 'react';
import { countries } from './js/paises';
import { validateEmail, validatePhone } from './js/form-handler';
import { searchCountry } from './js/telefone';

export default function Contactos() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [telNumber, setTelNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ name: 'United Kingdom', code: 'GB', phone: 44 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [notif, setNotif] = useState({ texto: '', tipo: '' });

  const quickReplies = [
    { value: '', label: 'Quick replies' },
    { value: 'Gostaria de Saber se o projeto [projeto] está disponível', label: 'Projetos de Investigação' },
    { value: 'Gostaria de saber quais formações são oferecidas pelo centro', label: 'Formação e Ensino' },
    { value: 'Estou interessado em realizar uma colaboração com o CACA', label: 'Parcerias e Protocolos' },
    { value: 'Gostaria de informar-me em como posso realizar os meus estudos no CACA', label: 'Apoio ao Estudante' },
  ];

  const mostrarNotif = (texto, tipo) => {
    setNotif({ texto, tipo });
    setTimeout(() => setNotif({ texto: '', tipo: '' }), 3000);
  };

  const enviarEmail = () => {
    if (nome === '') {
      mostrarNotif('Erro: Nome inválido', 'erro');

    } else if (email === '' || !validateEmail(email)) {
      mostrarNotif('Erro: Email Inválido', 'erro');

    } else if (mensagem === '') {
      mostrarNotif('Erro: Mensagem vazia', 'erro');

    } else if (!validatePhone(telNumber)) {
      mostrarNotif('Erro: Telefone Inválido', 'erro');

    } else {
      mostrarNotif('Mensagem enviada com sucesso', 'sucesso');
      setNome(''); setEmail('');setMensagem(''); setTelNumber(''); }
  };

  const paisesFiltrados = searchCountry(searchText, countries);

  return (
    <>
      <footer>
        <div id="Contactos" className="scroll-anchor" />
        <div className="footer-container">

          <div className="contactos">
            <h1>Contactos</h1>
            <p>Email: 2acaca@uac.pt</p>
            <p>Telefone: 250 620 910</p>
            <p>Morada: Rua das Hortênsias Azuis 3, 9520-509 Lagoa</p>
          </div>

          <div className="email">
            <h1>Envie Um Email<br /><span className="obrigatorio">(*) obrigatório</span></h1>
            <div className="email-conteudo">

              <div className="email-campos">
                <input  type="text"  placeholder="Nome*"  value={nome} onChange={(e) => setNome(e.target.value)}/>
                <input type="email"  placeholder="Email*" value={email} onChange={(e) => setEmail(e.target.value)} />

                <div className="select-box">
                  <div className="selected-option">
                    <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <span className="iconify" data-icon={`flag:${selectedCountry.code.toLowerCase()}-4x3`} />
                      <strong>+{selectedCountry.phone}</strong>
                    </div>
                    <input type="tel"  name="tel"  placeholder="Phone Number*" value={telNumber} onChange={(e) => setTelNumber(e.target.value)} />
                  </div>

                  {dropdownOpen && (
                    <div className="options active">
                      <input type="text" name="search-box" placeholder="Search Country Name"value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                      <ol>
                        {paisesFiltrados.map((country, i) => (
                          <li key={i} className="option"
                            onClick={() => {setSelectedCountry(country); setDropdownOpen(false); setSearchText(''); }}  >
                            <div>
                              <span className="iconify" data-icon={`flag:${country.code.toLowerCase()}-4x3`}  />
                              <span className="country-name">{country.name}</span>
                            </div>
                            <strong>+{country.phone}</strong>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                <button onClick={enviarEmail}>Enviar Mensagem</button>
              </div>

              <div className="mensagem-container">
                <select className="quick-message"  onChange={(e) => setMensagem(e.target.value)}  value="" >
                  {quickReplies.map((reply, i) => ( <option key={i} value={reply.value}>{reply.label}</option> ))}
                </select>
                <textarea maxLength={450} placeholder="Escreva a sua mensagem aqui... *" value={mensagem}
                 onChange={(e) => setMensagem(e.target.value)}/>
              </div>

            </div>
          </div>

        </div>
      </footer>

      <div className="direitos">
        <p> &#169;
           2026 Centro Académico Clinico dos Açores. Todos os direitos reservados<br />
          Financiado pela Universidade dos Açores<br />
          https://fct.uac.pt/
        </p>
      </div>

      {notif.texto && (
        <div className={notif.tipo === 'sucesso' ? 'envio-sucesso' : 'envio-erro'}>
          {notif.texto}
        </div>
      )}
    </>
  );
}