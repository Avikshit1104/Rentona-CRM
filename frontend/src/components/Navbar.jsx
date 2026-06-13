import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Rentora</h1>

      <div className="flex items-center gap-5">
        <p>
          {user?.name} ({user?.role})
        </p>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;