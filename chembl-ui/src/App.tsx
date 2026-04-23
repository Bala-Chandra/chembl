import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import AppLayout from './layout/AppLayout';
import ProtectedRoute, { AdminRoute } from './auth/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED + LAYOUT */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div>Admin Dashboard</div>
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}