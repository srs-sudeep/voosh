import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import ProtectedRoute from './contexts/ProtectedRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
            <AuthProvider>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/" element={<Layout />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route
            path="tasks"
            element={<ProtectedRoute><Tasks/> </ProtectedRoute>}
          />
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
