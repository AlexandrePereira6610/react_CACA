import React, {useEffect, useState,} from "react";

import "./Noticias.css";

import { carregarNoticias } from "../apis/newsAPI";

export default function Index() {
  const [noticias, setNoticias] = useState([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {buscarNoticias(false);}, []);

  async function buscarNoticias(
    forcarRefresh = false) { setLoading(true);

    setErro("");

    try {
      const noticiasCarregadas =
        await carregarNoticias( forcarRefresh,noticias);
      setNoticias(noticiasCarregadas);

      if ( noticiasCarregadas.length === 0) {
        setErro("Não foi possível carregar as notícias"  );  }
    } catch (error) {
      console.error(
        "Erro ao carregar notícias:",error );

      setErro("Erro ao carregar notícias" );

    } finally {
      setLoading(false); }
  }

  return (
    <div className="noticias-section">
      <div id="Noticias"></div>

      <div className="noticias-header">
        <h3>  Notícias de Saúde & CACA </h3>

        <button id="atualizar-noticias" onClick={() => buscarNoticias(true) } >Atualizar Notícias</button>
      </div>

      {loading && (
        <div id="noticias-loading">
          <p>📡 A carregar as últimas notícias... </p>
        </div>
      )}

      {erro && (<div id="noticias-erro"> {erro}</div>  )}

      <div className="noticias-container">
        {noticias.map(
          (noticia, index) => (
            <div className="noticia-card"key={index} >
              <div className="noticia-card-content">
                <div className="noticia-fonte"> {noticia.fonte}</div>

                <h3 className="noticia-titulo"> {noticia.titulo}</h3>

                <p className="noticia-descricao">  {noticia.descricao} </p>

                <div className="noticia-footer">
                  <span className="noticia-data">📅 {noticia.data}</span>

                    <a href={noticia.link}target="_blank" rel="noopener noreferrer" className="noticia-link" >Ler mais →</a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <small className="noticias-info">Fontes: RSS feeds públicos da área da saúde </small>
    </div>
  );
}