import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Nav from '../components/layout/Nav';
import Section from '../components/layout/Section';
import styles from './Apply.module.css';

const buildingOptions = [
  'Building a startup',
  'Running a business',
  'Building a product or project',
  'Creating a personal brand / content',
  'Freelancing / independent work',
  'Inventing / experimenting',
  'Exploring an idea',
  'Other',
];

const meetOptions = [
  'Founder',
  'Business owner',
  'Creator',
  'Designer',
  'Developer',
  'Marketer',
  'Investor',
  'Mentor',
  'Someone with industry experience',
  'Potential collaborator',
  'Other',
];

const commitmentOptions = [
  "I'll actively participate.",
  "I'll come prepared to share something useful.",
  "I'll contribute when I can.",
  "I'll respect everyone's time.",
  'All of the above.',
];

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  profileLink: '',
  buildingCategory: '',
  currentlyBuilding: '',
  biggestChallenge: '',
  triedSolutions: '',
  whatDidntWork: '',
  learnedHardWay: '',
  canHelpWith: '',
  helpedSomeoneStory: '',
  wantToMeet: [],
  wantFromCommunity: '',
  willingToOffer: '',
  whyApplying: '',
  shouldNotBecome: '',
  commitment: '',
  wishKnown: '',
};

const TOTAL_STEPS = 10;

const stepLabels = [
  '01 \u2014 About you',
  '02 \u2014 What you\u2019re building',
  '03 \u2014 Where you are right now',
  '04 \u2014 What you can contribute',
  '05 \u2014 Who you want to meet',
  '06 \u2014 The culture question',
  '07 \u2014 Why you want to join',
  '08 \u2014 One more thing',
  '09 \u2014 If we meet',
  '10 \u2014 Last question',
];

export default function Apply() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleMeet = (option) => {
    setForm((prev) => {
      const has = prev.wantToMeet.includes(option);
      return {
        ...prev,
        wantToMeet: has
          ? prev.wantToMeet.filter((o) => o !== option)
          : [...prev.wantToMeet, option],
      };
    });
  };

  const validateStep = () => {
    switch (step) {
      case 0: return form.fullName.trim() !== '' && form.email.trim() !== '';
      case 1: return form.buildingCategory !== '' && form.currentlyBuilding.trim() !== '';
      case 2: return form.biggestChallenge.trim() !== '';
      case 3: return form.canHelpWith.trim() !== '';
      case 5: return form.willingToOffer.trim() !== '';
      case 6: return form.whyApplying.trim() !== '';
      case 7: return form.shouldNotBecome.trim() !== '';
      case 8: return form.commitment !== '';
      default: return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      setError('Please complete the required fields before continuing.');
      return;
    }
    setError('');
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        const usersRef = collection(db, 'users');
        await addDoc(usersRef, {
          ...form,
          status: 'pending',
          adminNotes: '',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          createdAt: serverTimestamp()
        });
        navigate('/thank-you');
      } catch (err) {
        console.error(err);
        setError('Error submitting application. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setError('');
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className={styles.row2}>
              <Field label="Full name" required>
                <input type="text" value={form.fullName} onChange={update('fullName')} />
              </Field>
              <Field label="Email address" required>
                <input type="email" value={form.email} onChange={update('email')} />
              </Field>
            </div>
            <div className={styles.row2}>
              <Field label="Phone / WhatsApp">
                <input type="text" value={form.phone} onChange={update('phone')} />
              </Field>
              <Field label="City">
                <input type="text" value={form.city} onChange={update('city')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="LinkedIn / Instagram / Website &mdash; whichever best represents what you do">
                <input type="text" value={form.profileLink} onChange={update('profileLink')} />
              </Field>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className={styles.row1}>
              <Field label="What best describes what you're working on right now?" required>
                <div className={styles.checkGrid}>
                  {buildingOptions.map((opt) => (
                    <label key={opt} className={styles.checkItem}>
                      <input
                        type="radio"
                        name="buildingCategory"
                        value={opt}
                        checked={form.buildingCategory === opt}
                        onChange={update('buildingCategory')}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="Tell us what you're currently building or working on." required>
                <textarea value={form.currentlyBuilding} onChange={update('currentlyBuilding')} />
              </Field>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className={styles.row1}>
              <Field label="What are you working through right now?" required>
                <textarea value={form.biggestChallenge} onChange={update('biggestChallenge')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What have you explored so far?">
                <textarea value={form.triedSolutions} onChange={update('triedSolutions')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What remains unresolved?">
                <textarea value={form.whatDidntWork} onChange={update('whatDidntWork')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What have you learned along the way?">
                <textarea value={form.learnedHardWay} onChange={update('learnedHardWay')} />
              </Field>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className={styles.row1}>
              <Field label="What can you genuinely help another member with?" required>
                <textarea value={form.canHelpWith} onChange={update('canHelpWith')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="Tell us about a time you helped someone work through a problem.">
                <textarea value={form.helpedSomeoneStory} onChange={update('helpedSomeoneStory')} />
              </Field>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className={styles.row1}>
              <Field label="What kind of person would you genuinely benefit from knowing? (select all that apply)">
                <div className={styles.checkGrid}>
                  {meetOptions.map((opt) => (
                    <label key={opt} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={form.wantToMeet.includes(opt)}
                        onChange={() => toggleMeet(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What would you like to take away from being part of this community?">
                <textarea value={form.wantFromCommunity} onChange={update('wantFromCommunity')} />
              </Field>
            </div>
          </>
        );

      case 5:
        return (
          <div className={styles.row1}>
            <Field label="If another member came to you for help or perspective, what would you be willing to offer?" required>
              <textarea value={form.willingToOffer} onChange={update('willingToOffer')} />
            </Field>
          </div>
        );

      case 6:
        return (
          <div className={styles.row1}>
            <Field label="Why do you want to be part of this community?" required>
              <textarea value={form.whyApplying} onChange={update('whyApplying')} />
            </Field>
          </div>
        );

      case 7:
        return (
          <div className={styles.row1}>
            <Field label="What do you think a community like this should never become?" required>
              <textarea value={form.shouldNotBecome} onChange={update('shouldNotBecome')} />
            </Field>
          </div>
        );

      case 8:
        return (
          <div className={styles.row1}>
            <Field label="If you're invited to a gathering, what can the people in the room expect from you?" required>
              <div className={styles.radioList}>
                {commitmentOptions.map((opt) => (
                  <label key={opt} className={styles.radioItem}>
                    <input
                      type="radio"
                      name="commitment"
                      value={opt}
                      checked={form.commitment === opt}
                      onChange={update('commitment')}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        );

      case 9:
        return (
          <div className={styles.row1}>
            <Field label="What's something you wish you'd understood earlier about what you're doing now?">
              <textarea value={form.wishKnown} onChange={update('wishKnown')} />
            </Field>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <>
      <Nav />

      <Section noBorder>
        <div className={styles.intro}>
          <span className={styles.num}>N&deg; 02 &mdash; APPLICATION</span>
          <h1 className={styles.h1}>Tell us about<br />what you&rsquo;re building.</h1>
          <p className={styles.sub}>
            Applications are reviewed personally. We&rsquo;re looking for people who are genuinely building something and want to be part of a community where that matters.
          </p>
        </div>
      </Section>

      <Section noBorder>
        {/* Step header */}
        <div className={styles.slideHeader}>
          <div className={styles.slideMeta}>
            <span className={styles.groupLabel}>{stepLabels[step]}</span>
            <span className={styles.stepCount}>{step + 1} / {TOTAL_STEPS}</span>
          </div>
          <div className={styles.progress}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Current step fields */}
        <div className={styles.slideFields}>
          {renderStep()}
        </div>

        {/* Error */}
        {error && <p className={styles.slideError}>{error}</p>}

        {/* Navigation */}
        <div className={styles.slideNav}>
          {step > 0 && (
            <button type="button" className={styles.slideBack} onClick={handleBack}>
              &larr; Back
            </button>
          )}
          <button type="button" className={styles.submitBtn} onClick={handleNext}>
            {step === TOTAL_STEPS - 1 ? 'Submit application \u2192' : 'Continue \u2192'}
          </button>
          {step === TOTAL_STEPS - 1 && (
            <p className={styles.formNote}>
              Applications are reviewed personally. You&rsquo;ll hear from us directly.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

function Field({ label, required = false, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
    </div>
  );
}
