import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import styles from './About.module.css';

const lookForList = [
  'Someone genuinely building, creating, or working on something of their own.',
  'Someone willing to share honestly \u2014 including the parts that are hard.',
  'Someone interested in the people around them, not just their own progress.',
  'Someone here for the long term, not just for a single interaction.',
];

export default function About() {
  return (
    <>
      <Nav />

      {/* HEADER */}
      <Section noBorder>
        <div className={styles.header}>
          <span className={styles.num}>N&deg; 03 &mdash; ABOUT</span>
          <h1 className={styles.h1}>Built for people<br />who are building.</h1>
        </div>
      </Section>

      {/* THE REASON THIS EXISTS */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Why this exists</span>
          <h2 className={styles.h2}>Building alone is harder than it needs to be.</h2>
        </div>
        <p className={styles.body}>
          Most people building something &mdash; a company, a product, a career, a business &mdash; spend a significant amount of time figuring things out in isolation.
          Not because others haven&rsquo;t faced the same problems, but because there&rsquo;s rarely a place where those conversations happen well.
          This community exists to change that.
        </p>
      </Section>

      {/* WHAT WE VALUE */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>What we value</span>
          <h2 className={styles.h2}>Curiosity. Generosity. Honesty.</h2>
        </div>
        <p className={styles.body}>
          We look for people who are genuinely curious about what others are building, generous enough to share what they know, and honest enough to talk about the parts that aren&rsquo;t going well.
          Those qualities matter more than title, stage, or background.
          A person six months into their first business can hold just as much value for another member as someone who has built and exited several companies.
        </p>
      </Section>

      {/* WHO FITS HERE */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Who fits here</span>
          <h2 className={styles.h2}>What we look for.</h2>
        </div>
        <ul className={styles.notList}>
          {lookForList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* THE LONG GAME */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>The long game</span>
          <h2 className={styles.h2}>Early relationships tend<br />to matter later.</h2>
        </div>
        <p className={styles.body}>
          Someone may join while their business is still small, their audience is still growing, or their product is still being figured out.
          A few years from now, that same person may have built something substantially larger.
          The relationships formed early often matter more as time passes &mdash; as members grow into different stages, different capabilities, and different positions to help each other.
          This community is built with that in mind.
        </p>
      </Section>

      {/* CTA STRIP */}
      <Section>
        <div className={styles.ctaStrip}>
          <h2 className={styles.h2}>Ready to be part of it?</h2>
          <Button to="/apply" variant="accent">Request Invite &rarr;</Button>
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
