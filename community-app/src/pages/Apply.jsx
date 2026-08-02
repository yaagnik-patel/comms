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
  'Building a personal brand / creator career',
  'Freelancing / independent work',
  'Building products or software',
  'Designing / creating content',
  'Investing / mentoring',
  'Exploring an idea',
  'Other',
];

const freelanceOptions = [
  'Web development',
  'UI/UX design',
  'Graphic design',
  'Video editing',
  'Content creation',
  'Branding',
  'Marketing',
  'Photography',
  'Writing',
  'Automation / AI solutions',
  'Other',
];

const meetOptions = [
  'Founders',
  'Developers',
  'Designers',
  'Business owners',
  'Creators',
  'Marketers',
  'Investors',
  'Mentors',
  'People from different industries',
  'Other builders',
];

const commitmentOptions = [
  'I will openly share my experiences',
  'I will ask meaningful questions',
  'I will help where I can',
  'I will come prepared',
  'I will actively participate',
  "I will respect others' time and experiences",
];

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  profileLink: '',
  buildingCategory: '',
  freelanceWork: [],
  currentlyBuilding: '',
  previousWorkLink: '',
  proudWorkStory: '',
  meaningfulWorkStory: '',
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
  commitment: [],
  wishKnown: '',
};

const TOTAL_STEPS = 11;

const stepLabels = [
  '01 \u2014 About You',
  '02 \u2014 What You\'re Building / Working On',
  '03 \u2014 Show Us What You Do',
  '04 \u2014 Where You Are Right Now',
  '05 \u2014 What You Can Contribute',
  '06 \u2014 Who You Want To Meet',
  '07 \u2014 Culture Question',
  '08 \u2014 Why You Want To Join',
  '09 \u2014 Community Mindset',
  '10 \u2014 If We Meet',
  '11 \u2014 Last Question',
];

export default function Apply() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleArray = (field, option) => {
    setForm((prev) => {
      const has = prev[field].includes(option);
      return {
        ...prev,
        [field]: has
          ? prev[field].filter((o) => o !== option)
          : [...prev[field], option],
      };
    });
  };

  const validateStep = () => {
    switch (step) {
      case 0: return form.fullName.trim() !== '' && form.email.trim() !== '';
      case 1: return form.buildingCategory !== '' && form.currentlyBuilding.trim() !== '';
      case 2: 
        const isCreatorOrFreelancer = ['Building a personal brand / creator career', 'Freelancing / independent work', 'Designing / creating content'].includes(form.buildingCategory);
        if (isCreatorOrFreelancer) {
            return form.previousWorkLink.trim() !== '';
        }
        return true;
      case 3: return form.biggestChallenge.trim() !== '';
      case 4: return form.canHelpWith.trim() !== '';
      case 6: return form.willingToOffer.trim() !== '';
      case 7: return form.whyApplying.trim() !== '';
      case 8: return form.shouldNotBecome.trim() !== '';
      case 9: return form.commitment.length > 0;
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
              <Field label={<>Where can we see your work? <br/><small style={{fontWeight:'normal',opacity:0.8}}>LinkedIn / Instagram / Portfolio Website / GitHub / Behance / Dribbble / YouTube / Other. Share the place that best represents what you create or work on.</small></>}>
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
              <Field label={<>If you freelance or work independently, what best describes your work? <small style={{fontWeight:'normal',opacity:0.8}}>(Allow multiple selections)</small></>}>
                <div className={styles.checkGrid}>
                  {freelanceOptions.map((opt) => (
                    <label key={opt} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={form.freelanceWork.includes(opt)}
                        onChange={() => toggleArray('freelanceWork', opt)}
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
              <Field label={<>Where can we see your previous work? <br/><small style={{fontWeight:'normal',opacity:0.8}}>(Required for creators/freelancers. Examples: Portfolio website, GitHub repository, Behance / Dribbble, Instagram page, YouTube channel, Published products, Case studies, Other)</small></>} required={['Building a personal brand / creator career', 'Freelancing / independent work', 'Designing / creating content'].includes(form.buildingCategory)}>
                <input type="text" value={form.previousWorkLink} onChange={update('previousWorkLink')} placeholder="Link:" />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label={<>Tell us about one piece of work you're proud of. <br/><small style={{fontWeight:'normal',opacity:0.8}}>What was the problem? What did you create? What was your role?</small></>}>
                <textarea value={form.proudWorkStory} onChange={update('proudWorkStory')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What makes this work meaningful to you?">
                <textarea value={form.meaningfulWorkStory} onChange={update('meaningfulWorkStory')} />
              </Field>
            </div>
          </>
        );

      case 3:
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

      case 4:
        return (
          <>
            <div className={styles.row1}>
              <Field label={<>What can you genuinely help another member with? <br/><small style={{fontWeight:'normal',opacity:0.8}}>Examples: Technical knowledge, Design feedback, Business perspective, Marketing ideas, Content strategy, Industry experience, Connections, Something else</small></>} required>
                <textarea value={form.canHelpWith} onChange={update('canHelpWith')} />
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="Tell us about a time you helped someone solve a problem.">
                <textarea value={form.helpedSomeoneStory} onChange={update('helpedSomeoneStory')} />
              </Field>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className={styles.row1}>
              <Field label="What kind of people would you genuinely benefit from knowing?">
                <div className={styles.checkGrid}>
                  {meetOptions.map((opt) => (
                    <label key={opt} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={form.wantToMeet.includes(opt)}
                        onChange={() => toggleArray('wantToMeet', opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
            <div className={styles.row1}>
              <Field label="What would you like to take away from this community?">
                <textarea value={form.wantFromCommunity} onChange={update('wantFromCommunity')} />
              </Field>
            </div>
          </>
        );

      case 6:
        return (
          <div className={styles.row1}>
            <Field label={<>If another member came to you for help or perspective, what would you be willing to offer? <br/><small style={{fontWeight:'normal',opacity:0.8}}>This helps us understand whether someone is here to contribute or only receive.</small></>} required>
              <textarea value={form.willingToOffer} onChange={update('willingToOffer')} />
            </Field>
          </div>
        );

      case 7:
        return (
          <div className={styles.row1}>
            <Field label="Why do you want to be part of this community?" required>
              <textarea value={form.whyApplying} onChange={update('whyApplying')} />
            </Field>
          </div>
        );

      case 8:
        return (
          <div className={styles.row1}>
            <Field label="What do you think a community like this should never become?" required>
              <textarea value={form.shouldNotBecome} onChange={update('shouldNotBecome')} />
            </Field>
          </div>
        );

      case 9:
        return (
          <div className={styles.row1}>
            <Field label="If you're invited to a gathering, what can people in the room expect from you?" required>
              <div className={styles.checkGrid}>
                {commitmentOptions.map((opt) => (
                  <label key={opt} className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={form.commitment.includes(opt)}
                      onChange={() => toggleArray('commitment', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        );

      case 10:
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
