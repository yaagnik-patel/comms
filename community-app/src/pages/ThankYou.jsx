import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import styles from './ThankYou.module.css';

export default function ThankYou() {
  return (
    <>
      <Nav />

      <Section noBorder>
        <div className={styles.confirm}>
          <span className={styles.num}>N&deg; &mdash; RECEIVED</span>
          <h1 className={styles.confirmH1}>Received.</h1>
          <p className={styles.confirmText}>
            Your application is with us. We review every submission personally and reach out directly to people we&rsquo;d like to take forward.
            If your application is a good fit, you&rsquo;ll hear from us.
          </p>
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
