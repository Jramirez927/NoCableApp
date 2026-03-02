import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authentication";
import styles from "./login.module.css"

export default function LoginPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        email: "",
        password: ""
    });

    function validate() {
        let errors = {
            email: "",
            password: ""
        }
        if (!input.email) errors.email = "Email is required.";
        // simple email check
        else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email.";
        if (!input.password) errors.password = "Password is required.";
        return errors;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError({
            email: "",
            password: ""
        });
        const v = validate();
        if (v.email || v.password) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            await login(input.email, input.password);
            navigate("/webapp", { replace: true });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Network error. Try again.";
            setError({ email: "", password: message });
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} aria-label="Login form" className={styles.form}>
                <h1>Sign in</h1>

                {error.email && <div className={styles.errorMessage} role="alert">{error.email}</div>}

                <label className={styles.emailLabel}>
                    <input
                        type="email"
                        value={input.email}
                        onChange={(e) => setInput({ ...input, email: e.target.value })}
                        autoComplete="email"
                        required
                        placeholder="Email"
                    />
                </label>

                {error.password && <div className={styles.errorMessage} role="alert">{error.password}</div>}
                <label className={styles.passwordLabel}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={input.password}
                        onChange={(e) => setInput({ ...input, password: e.target.value })}
                        autoComplete="current-password"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className={styles.togglePassword}
                    >
                        {showPassword ? (
                            <span className="material-symbols-outlined">
                                visibility_off
                            </span>
                        ) : (
                            <span className="material-symbols-outlined">
                                visibility
                            </span>
                        )}
                    </button>
                </label>

                <div className={styles.rememberRow}>
                    <a href="/forgot">Forgot Password?</a>
                </div>

                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div>
                    <span>Don't have an account? </span>
                    <a href="/register">Create account</a>
                </div>
            </form>
        </div>
    );
}
