import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className="status">Checking your account...</p>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default RequireAuth;