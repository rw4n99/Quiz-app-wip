import React from "react";
import styles from './EndGame.module.css';
import Button from '../Button/Button';

export default function EndGame ({ score, progress, lives }) {
    
    const handleClick = () => {
        window.location.reload();
    };

    return (
        <div className={styles.wrapper}>
            <h1>Game Over ☠</h1>
            <h2 className={styles.text}>Progress : {progress}/15</h2>
            <h2 className={styles.score}>Final Score : {score}</h2>
            <h2 className={styles.text}>Lives Left : {lives}</h2>
            <Button onClick={handleClick}>Try again</Button>
        </div>
    );
}