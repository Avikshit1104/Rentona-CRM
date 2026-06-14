import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";

import OwnerDashboard from "../pages/owner/OwnerDashboard";
import OwnerAnalytics from "../pages/owner/OwnerAnalytics";
import OwnerPayments from "../pages/owner/OwnerPayments";

import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";
import MyProperties from "../pages/tenant/MyProperties";

import WorkerDashboard from "../pages/worker/WorkerDashboard";

import Notifications from "../pages/Notifications";
import JobDetails from "../pages/job/JobDetails";
import ChatPage from "../pages/chat/ChatPage";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
          path="/owner/payments"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRole="TENANT">
              <TenantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tenant/my-properties"
          element={
            <ProtectedRoute allowedRole="TENANT">
              <MyProperties />
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

        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRole="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["OWNER", "TENANT", "WORKER"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["OWNER", "TENANT", "WORKER"]}
            >
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["OWNER", "TENANT", "WORKER"]}
            >
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;