import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerAnalytics from "../pages/owner/OwnerAnalytics";
import OwnerPayments from "../pages/owner/OwnerPayments";
import Notifications from "../pages/Notifications";


import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";

import WorkerDashboard from "../pages/worker/WorkerDashboard";
import JobDetails from "../pages/job/JobDetails";

import ProtectedRoute from "../components/ProtectedRoute";

import ChatPage from "../pages/chat/ChatPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Owner */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/analytics"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:jobId"
          element={
            <ProtectedRoute allowedRoles={["OWNER", "TENANT", "WORKER"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/payments"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={[
                "OWNER",
                "TENANT",
                "WORKER",
              ]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Tenant */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRole="TENANT">
              <TenantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant/payments"
          element={
            <ProtectedRoute allowedRole="TENANT">
              <TenantPayments />
            </ProtectedRoute>
          }
        />

        {/* Worker */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRole="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job/:jobId"
          element={
            <ProtectedRoute allowedRoles={["OWNER", "TENANT", "WORKER"]}>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;