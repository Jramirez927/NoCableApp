import { safeFetch } from "./safeFetch";

interface AuthResponse {
    message?: string;
    [key: string]: unknown;
}

export async function login(email: string, password: string) {
    return safeFetch(async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const body: AuthResponse = await res.json();
        if (!res.ok) throw new Error(body?.message || "Login failed.");
        return body;
    });
}

export async function register(email: string, password: string) {
    return safeFetch(async () => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const body: AuthResponse = await res.json();
        if (!res.ok) throw new Error(body?.message || "Registering your account failed.");
        return body;
    });
}

export async function checkAuth() {
    return safeFetch(async () => {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        return res.ok ? await res.json() : null;
    });
}

export async function logout() {
    return safeFetch( async () => {
        const res = await fetch('/api/auth/logout', { credentials: 'include' })
        return res.ok? await res.json() : null;
    })
}
