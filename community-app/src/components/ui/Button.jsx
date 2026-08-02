import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({ to, href, children, variant = 'dark' }) {
  const className = `${styles.btn} ${variant === 'accent' ? styles.accent : styles.dark}`;
  if (to) return <Link to={to} className={className}>{children}</Link>;
  return <a href={href || '#'} className={className}>{children}</a>;
}
