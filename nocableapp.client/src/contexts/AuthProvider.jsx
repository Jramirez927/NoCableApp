import { createContext,useContext, useState, useEffect } from "react";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include'})
            const data = res.ok ? await res.json() : null
            setUser(data)
        }
        finally {
            setLoading(false)
        }
    }
}