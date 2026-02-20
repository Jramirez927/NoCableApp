import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [remember, setRemember] = useState(false);
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
        if (!input.email)  errors.email = "Email is required.";
        // simple email check
        else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email.";
        if (!input.password) errors.password = "Password is required.";
        return errors;
    }

    async function handleSubmit(e) {
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: input.email, password: input.password }),
            });

            const body = await res.json();
            if (!res.ok) {
                setError(body?.message || "Login failed.");
                setLoading(false);
                return;
            }

            const token = body?.token;
            if (token) {
                if (remember) localStorage.setItem("auth_token", token);
                else sessionStorage.setItem("auth_token", token);
            }

            navigate("/", { replace: true });
        } catch (err) {
            setError("Network error. Try again.");
            setLoading(false);
        }
    }

    return (
        <div style={{ minWidth: '360px' }}>
            <form onSubmit={handleSubmit} aria-label="Login form" style={{ display: "flex", flexDirection: "column" }}>
                <h1>Sign in</h1>

                {error.email && <div style={{ padding: '0px' }} role="alert">{error.email}</div>}

                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", height: '32px', width: '100%' }}>
                    <input
                        type="email"
                        value={input.email}
                        onChange={(e) => setInput({ ...input, email: e.target.value })}
                        autoComplete="email"
                        required
                        placeholder="Email"
                        style={{ width: '100%' }}
                    />
                </label>

                {error.password && <div style={{ padding: '0px' }} role="alert">{error.password}</div>}
                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", height: '32px', width: '100%', position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={input.password}
                        onChange={(e) => setInput({ ...input, password: e.target.value })}
                        autoComplete="current-password"
                        placeholder="Password"
                        required
                        style={{ width: '100%', paddingRight: '36px' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0px' }}
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

                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                    <div>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </div>
                    <a href="/forgot">Forgot Password?</a>
                </label>

                <button type="submit" disabled={loading} style={{ marginBottom: '12px' }}>
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
