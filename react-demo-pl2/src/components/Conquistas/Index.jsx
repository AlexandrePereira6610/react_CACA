import React, { useEffect, useRef } from "react";
import "./Conquistas.css";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Chart, CategoryScale, LinearScale, BarController,
    BarElement, Title, Tooltip, Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

export default function Conquistas() {
    const canvasRef = useRef(null);
    const chartInstance = useRef(null);

    //  MOVI O useInView PARA DENTRO DO COMPONENTE
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const loadData = async (file, title) => {
        try {
            const response = await fetch(file);
            const data = await response.json();

            const labels = data.map((item) => item.month);
            const values = data.map((item) => item.income);

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        label: title,
                        data: values,
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }],
                },
                options: { responsive: true, maintainAspectRatio: false },
            });
        } catch (error) {
            console.error("Erro ao carregar JSON:", error);
        }
    };

    useEffect(() => {
        loadData("/utils/datainvestigacao.json", "Número de investigadores mensal");
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
        >
            <div id="Conquistas">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    Conquistas
                </motion.h1>
            </div>

            <div className="conquistas">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2 }}
                >
                    Em 2026 houve um aumento geral de 30%
                </motion.p>

                <div className="conquistas-container">
                    <div className="chart_types">
                        <button onClick={() => loadData("/utils/datainvestigacao.json", "Número de investigadores mensal")}>
                            Investigadores
                        </button>
                        <button onClick={() => loadData("/utils/dataparceiros.json", "Número de parceiros mensais")}>
                            Parceiros
                        </button>
                        <button onClick={() => loadData("/utils/dataprojetos.json", "Número de projetos mensais")}>
                            Projetos
                        </button>
                    </div>

                    <div className="grafico">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}