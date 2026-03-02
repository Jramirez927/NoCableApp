import { createContext, useContext, useEffect, useState } from "react";

interface User {
    email: string;
    [key: string]: unknown;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        checkAuth();
    }, [])
    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include'})
            const data: User | null = res.ok ? await res.json() : null
            setUser(data)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
