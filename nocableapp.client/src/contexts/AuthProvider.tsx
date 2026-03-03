import { createContext, useContext, useEffect, useState } from "react";
import {
    checkAuth as checkAuthApi,
    login as loginApi,
    register as registerApi,
    logout as logoutApi
} from "../api/authentication";

interface User {
    email: string;
    [key: string]: unknown;
}

type AuthResult = { data: unknown; error: string | null };

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<AuthResult>;
    register: (email: string, password: string) => Promise<AuthResult>;
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
        const { data } = await checkAuthApi();
        setUser(data as User | null);
        setLoading(false);
    }

    const login = async (email: string, password: string): Promise<AuthResult> => {
        const result = await loginApi(email, password);
        if (!result.error) {
            await checkAuth();
        }
        return result;
    }

    const register = async (email: string, password: string): Promise<AuthResult> => {
        const result = await registerApi(email, password);
        if (!result.error) {
            await checkAuth();
        }
        return result;
    }

    const logout = async () => {
        const result = await logoutApi();
        if (!result.error) {
            await checkAuth();
        }
        return result;
    }
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register,  checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
