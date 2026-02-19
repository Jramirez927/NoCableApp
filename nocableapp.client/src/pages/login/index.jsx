import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function validate() {
        if (!email) return "Email is required.";
        // simple email check
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email.";
        if (!password) return "Password is required.";
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
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
        <div>
            <form onSubmit={handleSubmit} aria-label="Login form" style={{ display: "flex", flexDirection: "column" }}>
                <h1>Sign in</h1>

                {error && <div style={{padding:'0px'}} role="alert">{error}</div>}

                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", height: '32px' , width:'100%'}}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        placeholder="Email"
                        style={{width: '100%'}}
                    />
                </label>

                <label style={{ marginBottom:'12px', display: "flex", flexDirection: "row", height: '32px', width:'100%', position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        placeholder="Password"
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

                <button type="submit" disabled={loading} style={{marginBottom: '12px'}}>
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
