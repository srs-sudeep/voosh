import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');  // Token existence check
  };
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;

};

export default ProtectedRoute;
