import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/layout/Nav';
import Section from '../../components/layout/Section';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // This is temporary hardcoded auth for the mock UI phase.
    if (password === 'admin') {
      // In a real app, we'd use a context/token. For this mock, we just navigate.
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Section noBorder>
      <div className={styles.container}>
        <span className={styles.num}>N&deg; 99 &mdash; ADMIN</span>
        <h1 className={styles.h1}>Restricted.</h1>
        
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label className={styles.label}>Admin Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn}>Access Dashboard &rarr;</button>
        </form>
      </div>
    </Section>
  );
}
