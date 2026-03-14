import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import { useAuth } from '../../contexts/AuthProvider';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [input, setInput] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fetchError, setFetchError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
  } {
    const errors = { userName: '', email: '', password: '', confirmPassword: '' };
    if (!input.userName) errors.userName = 'Username is required.';
    if (!input.email) errors.email = 'Email is required.';
    // simple email check
    else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = 'Enter a valid email.';
    if (!input.password) errors.password = 'Password is required.';
    else {
      if (input.password.length < 8)
        errors.password = 'Password required to be a length of 8 or greater';
      if (!/[A-Z]/.test(input.password))
        errors.password = 'Password requires uppercase alphabet characters (A-Z)';
      if (!/[a-z]/.test(input.password))
        errors.password = 'Passowrd requires lowercase alphabt characters (a-z)';
      if (!/[0-9]/.test(input.password))
        errors.password = 'Password requires numeric characters (0-9)';
      //RequireNonAlphanumeric
      if (!/[^a-zA-Z0-9]/.test(input.password))
        errors.password = 'Password requires a non-alphanumeric character (e.g. @, #, !)';
      if (/\s/.test(input.password)) errors.password = 'Password must not contain spaces';
    }
    if (!input.confirmPassword) errors.confirmPassword = 'Confirmed password is required.';
    else if (input.password !== input.confirmPassword)
      errors.confirmPassword = 'Confirm password does not match.';
    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError({
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const v = validate();
    if (v.userName || v.email || v.password || v.confirmPassword) {
      setError(v);
      return;
    }

    setLoading(true);
    const { error } = await register(input.userName, input.email, input.password);
    if (error) {
      setFetchError(error);
      setLoading(false);
    } else {
      navigate('/webapp', { replace: true });
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} aria-label="Register form" className={styles.form}>
        <h1>Register</h1>
        {fetchError && (
          <div className={styles.errorMessage} role="alert">
            {fetchError}
          </div>
        )}
        {error.userName && (
          <div className={styles.errorMessage} role="alert">
            {error.userName}
          </div>
        )}

        <label className={styles.emailLabel}>
          <input
            type="text"
            value={input.userName}
            onChange={(e) => setInput({ ...input, userName: e.target.value })}
            required
            placeholder="Username"
          />
        </label>
        {error.email && (
          <div className={styles.errorMessage} role="alert">
            {error.email}
          </div>
        )}

        <label className={styles.emailLabel}>
          <input
            type="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            required
            placeholder="Email"
          />
        </label>
        {error.password && (
          <div className={styles.errorMessage} role="alert">
            {error.password}
          </div>
        )}

        <label className={styles.passwordLabel}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            required
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={styles.togglePassword}
          >
            {showPassword ? (
              <span className="material-symbols-outlined">visibility_off</span>
            ) : (
              <span className="material-symbols-outlined">visibility</span>
            )}
          </button>
        </label>

        {error.confirmPassword && (
          <div className={styles.errorMessage} role="alert">
            {error.confirmPassword}
          </div>
        )}

        <label className={styles.passwordLabel}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={input.confirmPassword}
            onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })}
            required
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={styles.togglePassword}
          >
            {showPassword ? (
              <span className="material-symbols-outlined">visibility_off</span>
            ) : (
              <span className="material-symbols-outlined">visibility</span>
            )}
          </button>
        </label>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        <div>
          <span>Already have an account? </span>
          <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
