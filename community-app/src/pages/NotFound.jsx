import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <Nav />

      <Section noBorder>
        <div className={styles.block}>
          <span className={styles.num}>N&deg; 00 &mdash; NOT FOUND</span>
          <h1 className={styles.h1}>Wrong<br />turn.</h1>
          <p className={styles.text}>This page doesn&rsquo;t exist, but the community does.</p>
          <div className={styles.backLink}>
            <Button to="/" variant="dark">&larr; Back to homepage</Button>
          </div>
        </div>
      </Section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>&copy; 2026 Name&trade;</span>
          <span>A curated community of builders</span>
        </div>
      </footer>
    </>
  );
}
