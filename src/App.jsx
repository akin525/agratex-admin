import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Plans from './pages/Plans';
import Investments from './pages/Investments';
import Staking from './pages/Staking';
import BotCast from './pages/BotCast';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import LegacyLevels from './pages/LegacyLevels';
import LegacyLevelRequirements from './pages/LegacyLevelRequirements';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="plans" element={<Plans />} />
            <Route path="investments" element={<Investments />} />
            <Route path="staking" element={<Staking />} />
            <Route path="legacy-levels" element={<LegacyLevels />} />
            <Route path="legacy-requirements" element={<LegacyLevelRequirements />} />
            <Route path="bot-cast" element={<BotCast />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;