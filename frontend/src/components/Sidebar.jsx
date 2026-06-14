import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, unreadChats } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            rentona
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            {user?.role} Panel
          </p>
        </div>

        <button
          onClick={closeMenu}
          className="md:hidden text-slate-300 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {user?.role === "OWNER" && (
          <>
            <NavItem
              to="/owner"
              label="Dashboard"
              currentPath={location.pathname}
              onClick={closeMenu}
            />

            <NavItem
              to="/owner/analytics"
              label="Analytics"
              currentPath={location.pathname}
              onClick={closeMenu}
            />

            <NavItem
              to="/owner/payments"
              label="Revenue"
              currentPath={location.pathname}
              onClick={closeMenu}
            />
          </>
        )}

        {user?.role === "TENANT" && (
          <>
            <NavItem
              to="/tenant"
              label="Dashboard"
              currentPath={location.pathname}
              onClick={closeMenu}
            />

            <NavItem
              to="/tenant/payments"
              label="Payments"
              currentPath={location.pathname}
              onClick={closeMenu}
            />
          </>
        )}

        {user?.role === "WORKER" && (
          <NavItem
            to="/worker"
            label="Dashboard"
            currentPath={location.pathname}
            onClick={closeMenu}
          />
        )}

        <NavItem
          to="/notifications"
          label="Notifications"
          currentPath={location.pathname}
          onClick={closeMenu}
        />

        <div className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 bg-slate-900">
          <span>Chat Messages</span>

          {unreadChats > 0 && (
            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unreadChats}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-5 mt-6">
        <p className="text-sm text-slate-400 mb-3 break-words">
          {user?.name}
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-950 text-white px-4 py-3 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">
          rentona
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="text-2xl leading-none"
        >
          ☰
        </button>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-slate-950 text-white p-6 flex flex-col z-50 transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      <div className="hidden md:flex w-64 min-h-screen bg-slate-950 text-white p-6 flex-col shrink-0">
        <SidebarContent />
      </div>
    </>
  );
};

const NavItem = ({
  to,
  label,
  currentPath,
  onClick,
}) => {
  const active =
    currentPath === to ||
    (to !== "/" && currentPath.startsWith(`${to}/`));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
};

export default Sidebar;