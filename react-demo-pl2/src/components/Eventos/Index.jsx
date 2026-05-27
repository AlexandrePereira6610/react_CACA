import { motion, AnimatePresence } from 'framer-motion';
import './Eventos.css';
import { useState, useEffect } from 'react';
import { obterTodosEventos } from '../../indexedDB';
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

    return (
        <motion.div
            className="eventos-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div id="Eventos" className="scroll-anchor" />
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Eventos Programados
            </motion.h1>

            <motion.div className="eventos-lista-publica">
                <AnimatePresence>
                    {eventos.length === 0 ? (
                        <motion.p
                            className="eventos-vazio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            Não há eventos programados de momento
                        </motion.p>
                    ) : (
                        eventos.map((evento, index) => (
                            <motion.div
                                key={evento.id}
                                className="evento-card"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                            >
                                {evento.imagem && (
                                    <img src={evento.imagem} alt={evento.titulo} className="evento-card-imagem" />
                                )}

                                <div className="evento-card-body">
                                    <div className="evento-card-header">
                                        <h3>{evento.titulo}</h3>
                                        <span className="evento-data">
                                        {formatarData(evento.data)} • {evento.hora}
                                    </span>
                                    </div>
                                    <p className="evento-descricao">{evento.descricao}</p>
                                    <p className="evento-local">📍 {evento.local}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}