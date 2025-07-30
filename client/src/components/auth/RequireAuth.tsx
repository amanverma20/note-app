import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
