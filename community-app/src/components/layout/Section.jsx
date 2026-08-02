import styles from './Section.module.css';

export default function Section({ children, noBorder = false, bordered = true, className = '' }) {
  return (
    <section className={`${styles.section} ${noBorder ? styles.noBorder : ''} ${className}`}>
      <div className={`${styles.wrap} ${bordered ? '' : styles.noInnerBorder}`}>
        {children}
      </div>
    </section>
  );
}
