import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CasesPage from '../pages/cases/CasesPage';
import CaseDetailPage from '../pages/cases/CaseDetailPage';
import CaseFormPage from '../pages/cases/CaseFormPage';
import EvidencePage from '../pages/evidence/EvidencePage';
import EvidenceDetailPage from '../pages/evidence/EvidenceDetailPage';
import EvidenceUploadPage from '../pages/evidence/EvidenceUploadPage';
import TimelinePage from '../pages/timeline/TimelinePage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
      <Route path="/cases/new" element={<ProtectedRoute><CaseFormPage /></ProtectedRoute>} />
      <Route path="/cases/:caseId/edit" element={<ProtectedRoute><CaseFormPage /></ProtectedRoute>} />
      <Route path="/cases/:caseId" element={<ProtectedRoute><CaseDetailPage /></ProtectedRoute>} />
      <Route path="/evidence" element={<ProtectedRoute><EvidencePage /></ProtectedRoute>} />
      <Route path="/evidence/upload" element={<ProtectedRoute><EvidenceUploadPage /></ProtectedRoute>} />
      <Route path="/evidence/:evidenceId" element={<ProtectedRoute><EvidenceDetailPage /></ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
