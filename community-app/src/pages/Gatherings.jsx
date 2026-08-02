import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import styles from './Gatherings.module.css';

const howCards = [
  {
    number: '01',
    title: 'What you\u2019re building and dealing with',
    text: 'We look at where each person is right now \u2014 what they\u2019re working on, what\u2019s challenging them, and what stage they\u2019re at. This shapes who they\u2019ll find most useful to sit with.',
  },
  {
    number: '02',
    title: 'What you\u2019ve already been through',
    text: 'Experience is valuable precisely because someone else hasn\u2019t had it yet. A person who has navigated a particular problem before can change how another person sees the same situation entirely.',
  },
  {
    number: '03',
    title: 'What you can bring to the table',
    text: 'Members arrive with different knowledge, skills, and connections. A well-built gathering is one where everyone has something genuine to contribute \u2014 and something genuine to gain.',
  },
];

const examples = [
  {
    who: 'BUSINESS OWNER \u2014 STUCK ON HIRING',
    quote: '\u201cEvery time I bring someone new in, the team dynamic changes in ways I can\u2019t predict. I\u2019ve tried different approaches and I still haven\u2019t found something that works consistently.\u201d',
  },
  {
    who: 'FOUNDER \u2014 BUILT A TEAM OF TWELVE',
    quote: '\u201cWe had the same problem for almost two years. Here\u2019s what we eventually understood about it \u2014 and the one thing we changed that actually made a difference.\u201d',
  },
];

export default function Gatherings() {
  return (
    <>
      <Nav />

      {/* HEADER */}
      <Section noBorder>
        <div className={styles.header}>
          <span className={styles.num}>N&deg; 04 &mdash; GATHERINGS</span>
          <h1 className={styles.h1}>Small groups.<br />Chosen deliberately.</h1>
        </div>
      </Section>

      {/* WHAT A TABLE IS */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>What is a Table?</span>
          <h2 className={styles.h2}>A small group brought<br />together with purpose.</h2>
        </div>
        <p className={styles.body}>
          A Table is a curated gathering of members selected based on what they&rsquo;re building, what they&rsquo;re working through, and what they can meaningfully offer the people around them.
          Every Table is different. Some are built around shared challenges. Others bring together people with complementary experience or perspective.
          The goal is always the same: a room where there is a genuine reason for everyone to be sitting together.
        </p>
      </Section>

      {/* HOW IT'S CURATED */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How a Table is built</span>
          <h2 className={styles.h2}>More than<br />a job title.</h2>
        </div>
        <div className={styles.reasonsGrid}>
          {howCards.map((card) => (
            <div key={card.number} className={styles.reasonCard}>
              <span className={styles.cardNum}>{card.number}</span>
              <h3 className={styles.reasonTitle}>{card.title}</h3>
              <p className={styles.reasonText}>{card.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* EXAMPLE */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>What the conversation looks like</span>
          <h2 className={styles.h2}>Honest.<br />Specific. Useful.</h2>
        </div>
        <div className={styles.fragments}>
          {examples.map((ex) => (
            <div key={ex.who} className={styles.fragment}>
              <span className={styles.who}>{ex.who}</span>
              <p>{ex.quote}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA STRIP */}
      <Section>
        <div className={styles.ctaStrip}>
          <h2 className={styles.h2}>Want to sit<br />at a Table?</h2>
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
