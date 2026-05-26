import './Hero.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Hero({ id, title, description }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <motion.div
            ref={ref}
            id={id}
            className={id}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                {description}
            </motion.p>
        </motion.div>
    );
}