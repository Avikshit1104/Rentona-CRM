import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT",
    phone: "",
    skill: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      };

      if (formData.role === "WORKER") {
        payload.skill = formData.skill;
      }

      await API.post("/auth/signup", payload);

      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8 text-sm md:text-base">
          Join Rentona as an owner, tenant, or worker.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            required
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            required
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
          >
            <option value="TENANT">Tenant</option>
            <option value="OWNER">Owner</option>
            <option value="WORKER">Worker</option>
          </select>

          {formData.role === "WORKER" && (
            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
              required
            >
              <option value="">Select Skill</option>
              <option value="PLUMBER">Plumber</option>
              <option value="ELECTRICIAN">Electrician</option>
              <option value="CARPENTER">Carpenter</option>
              <option value="CLEANER">Cleaner</option>
              <option value="PAINTER">Painter</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm md:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-3">
          Owner • Tenant • Worker
        </p>
      </div>
    </div>
  );
};

export default Signup;