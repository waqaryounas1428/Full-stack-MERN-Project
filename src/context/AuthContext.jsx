/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { storage } from "../utils/storage";
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => storage.getUser());

    const login = (userData) => {
        const userObj = { 
            id: userData._id || userData.id || userData.email, 
            name: userData.name, 
            email: userData.email,
            role: userData.role || "user",
            token: userData.token
        };
        storage.setUser(userObj);
        setUser(userObj);
    };

    const logout = () => {
        const userName = user?.name || 'User';
        storage.removeUser();
        setUser(null);
        
        // Show professional logout success message
        toast.success(`👋 Goodbye, ${userName}! You've been logged out successfully`, {
            duration: 4000,
            icon: '✓',
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
