import styles from './GridBlock.module.css';

export default function GridBlock({ number, label, className = '' }) {
  return (
    <div className={`${styles.block} ${className}`}>
      <div className={styles.num}>{number}</div>
      <div className={styles.word}>{label}</div>
    </div>
  );
}
