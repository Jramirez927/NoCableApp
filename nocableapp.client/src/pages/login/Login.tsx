import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css"
import { useAuth } from "../../contexts/AuthProvider";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        network: "",
        email: "",
        password: ""
    });

    function validate() {
        let errors = {
            network: "",
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
        setErrorMessage({
            network: "",
            email: "",
            password: ""
        });
        const v = validate();
        if (v.email || v.password) {
            setErrorMessage(v);
            return;
        }

        setLoading(true);
        const { error } = await login(input.email, input.password);
        if (error) {
            setErrorMessage({...errorMessage, network: error});
            setLoading(false);
        } else {
            navigate("/webapp", { replace: true });
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} aria-label="Login form" className={styles.form}>
                <h1>Sign in</h1>

                {errorMessage.network && <div className={styles.network} role="alert">{errorMessage.network}</div>}
                {errorMessage.email && <div className={styles.errorMessage} role="alert">{errorMessage.email}</div>}

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

                {errorMessage.password && <div className={styles.errorMessage} role="alert">{errorMessage.password}</div>}
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
