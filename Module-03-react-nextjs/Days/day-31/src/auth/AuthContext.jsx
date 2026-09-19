import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(function () {
        const savedUser = localStorage.getItem("addiseats-user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const [loading] = useState(false);

    function login(phone) {
        const newUser = { phone: phone };

        localStorage.setItem(
            "addiseats-user",
            JSON.stringify(newUser)
        );

        setUser(newUser);
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider;