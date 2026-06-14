import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="bg-black text-white px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          Rentona
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
          <p className="text-center sm:text-left text-sm md:text-base break-words">
            {user?.name} ({user?.role})
          </p>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;