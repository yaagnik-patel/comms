import { Link, useLocation } from 'react-router-dom';
import styles from './Nav.module.css';

export default function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.mark}>Name&trade;</Link>
        {!isHome && (
          <Link to="/" className={styles.backArrow}>&larr; Home</Link>
        )}
        <Link to="/about" className={styles.navLink}>Why this exists</Link>
        <Link to="/apply" className={styles.cta}>Apply</Link>
      </nav>
    </div>
  );
}
