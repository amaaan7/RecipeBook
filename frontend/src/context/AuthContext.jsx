import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // true during initial auth check

    // On page load, check if there's a stored token and fetch the user's profile
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            api.get('/api/auth/profile/')
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login/', { email, password });
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password, password2) => {
        const { data } = await api.post('/api/auth/register/', { name, email, password, password2 });
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,   // !! converts user object to true/false
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook — any component calls useAuth() instead of useContext(AuthContext)
export function useAuth() {
    return useContext(AuthContext);
}