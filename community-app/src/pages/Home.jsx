import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import GridBlock from '../components/ui/GridBlock';
import Button from '../components/ui/Button';
import styles from './Home.module.css';

const sequence = [
  { number: '01', label: 'Build' },
  { number: '02', label: 'Share' },
  { number: '03', label: 'Help' },
  { number: '04', label: 'Connect' },
  { number: '05', label: 'Grow' },
];

const reasons = [
  { number: '01', title: 'People worth knowing', text: 'Members come from different industries, stages, and paths. What they share is that they\u2019re actively building something \u2014 which makes their experience, perspective, and connections genuinely useful.' },
  { number: '02', title: 'Experience worth exchanging', text: 'Every member has learned something the hard way. Someone else\u2019s insight, mistake, or solution can save you months of figuring out the same thing yourself.' },
  { number: '03', title: 'Relationships that compound', text: 'People who are small today often won\u2019t stay that way. Relationships formed early grow in value as members grow \u2014 in capability, reach, and what they can offer each other.' },
];

const expectations = [
  'Show up when you commit.',
  'Be honest about where you are and what you\u2019re working through.',
  'Share what you\u2019ve learned \u2014 including what went wrong.',
  'Contribute before you expect something in return.',
  'Respect what others share inside the community.',
  'Be useful to the people around you.',
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <Section noBorder>
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <span className={styles.num}>N&deg; 01 &mdash; INVITATION ONLY</span>
            <h1 className={styles.h1}>People<br /><span className={styles.accentText}>building.</span></h1>
          </div>
          <div className={styles.heroRight}>
            <p className={styles.sub}>A curated community for people genuinely building something of their own &mdash; and the people worth knowing while you do it.</p>
            <Button to="/apply" variant="dark">Request Invite</Button>
          </div>
        </div>
      </Section>

      {/* WHY JOIN */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Why it matters</span>
          <h2 className={styles.h2}>People doing real things, together.</h2>
        </div>
        <div className={styles.reasonsGrid}>
          {reasons.map((r) => (
            <div key={r.number} className={styles.reasonCard}>
              <span className={styles.num}>{r.number}</span>
              <h3 className={styles.reasonTitle}>{r.title}</h3>
              <p className={styles.reasonText}>{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHILOSOPHY SEQUENCE */}
      <Section bordered={false}>
        <div className={styles.sequenceWrap}>
          {sequence.map((s) => (
            <GridBlock key={s.number} number={s.number} label={s.label} />
          ))}
        </div>
      </Section>

      {/* REAL CONVERSATION */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>What it sounds like</span>
          <h2 className={styles.h2}>An actual conversation.</h2>
        </div>
        <div className={styles.fragments}>
          <div className={styles.fragment}>
            <span className={styles.who}>FOUNDER &mdash; SIX MONTHS IN</span>
            <p>&ldquo;I&rsquo;ve been running on assumptions about who my customer actually is. None of it has been properly validated yet.&rdquo;</p>
          </div>
          <div className={styles.fragment}>
            <span className={styles.who}>OPERATOR &mdash; BEEN THROUGH IT</span>
            <p>&ldquo;That&rsquo;s a very common place to be. Here&rsquo;s how we found out we were wrong &mdash; and what we actually did about it.&rdquo;</p>
          </div>
        </div>
      </Section>

      {/* WHO IS HERE */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Who&rsquo;s here</span>
          <h2 className={styles.h2}>Different paths. Same drive to build.</h2>
        </div>
        <p className={styles.belongsCopy}>
          Founders, business owners, freelancers, creators, inventors, developers, marketers, and independent builders &mdash; people at different stages, from different industries, working on different things.
          The common ground is this: everyone here is genuinely building something. Mindset and contribution matter more than title or stage.
        </p>
        <p className={styles.notCopy}>
          Membership is invitation-only and reviewed. We look for people who are here to participate, share, and contribute &mdash; not to collect contacts or promote themselves.
        </p>
      </Section>

      {/* HOW PEOPLE COME TOGETHER */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How people come together</span>
          <h2 className={styles.h2}>Every gathering, built with intention.</h2>
        </div>
        <p className={styles.gatherCopy}>
          People are brought together based on what they&rsquo;re building, what they&rsquo;re currently working through, and what they can meaningfully contribute to the people around them.
        </p>
        <div className={styles.gatherBtn}>
          <Button to="/gatherings" variant="dark">See how it works &rarr;</Button>
        </div>
      </Section>

      {/* HOW WE SHOW UP */}
      <Section>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How we show up</span>
          <h2 className={styles.h2}>A few things we take seriously.</h2>
        </div>
        <ul className={styles.expectList}>
          {expectations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <div className={styles.ctaStrip}>
          <h2 className={styles.h2}>Join early.<br />Grow with it.</h2>
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
