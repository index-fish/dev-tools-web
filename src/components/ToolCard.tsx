import React from 'react';
import { motion } from 'framer-motion';
import styles from './ToolCard.module.css';

interface ToolCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.card}
        >
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </motion.div>
    );
};

export default ToolCard;
