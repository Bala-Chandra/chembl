import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}
