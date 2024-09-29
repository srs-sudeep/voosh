import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import ProtectedRoute from './contexts/ProtectedRoutes';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
