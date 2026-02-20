import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [fetchError , setFetchError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function validate() {
        let errors = {}
        if (!input.email) errors.email = "Email is required.";
        // simple email check
        else if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email.";
        if (!input.password) errors.password = "Password is required.";
        if (!input.confirmPassword) errors.confirmPassword = "Confirmed password is required."
        else if (input.password !== input.confirmPassword) errors.confirmPassword = "Confirm password does not match."
        return errors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError({
            email: "",
            password: "",
            confirmPassword: ""
        });
        const v = validate();
        if (v.email || v.password || v.confirmPassword) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: input.email, password: input.password }),
            });

            const body = await res.json();
            if (!res.ok) {
                setFetchError(body?.message || "Registering your account failed.");
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
            setFetchError("Network error. Try again.");
            setLoading(false);
        }
    }

    return (
        <div style={{ minWidth: '360px' }}>
            <form onSubmit={handleSubmit} aria-label="Register form" style={{ display: "flex", flexDirection: "column" }}>
                <h1>Register</h1>
                {fetchError && <div style={{ padding: '0px' }} role="alert">{fetchError}</div>}
                {error.email && <div style={{ padding: '0px' }} role="alert">{error.email}</div>}

                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", height: '32px', width: '100%' }}>
                    <input
                        type="email"
                        value={input.email}
                        onChange={(e) => setInput({ ...input, email: e.target.value })}
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

                {error.confirmPassword && <div style={{ padding: '0px' }} role="alert">{error.confirmPassword}</div>}

                <label style={{ marginBottom: '12px', display: "flex", flexDirection: "row", height: '32px', width: '100%', position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={input.confirmPassword}
                        onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirm Password"
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

                <button type="submit" disabled={loading} style={{ marginBottom: '12px' }}>
                    {loading ? "Signing up..." : "Sign up"}
                </button>

                <div>
                    <span>Already have an account? </span>
                    <a href="/login">Login</a>
                </div>
            </form>
        </div>
    );
}