import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";

const TenantDashboard = () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data.properties || res.data.data || res.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load properties");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const applyProperty = async (propertyId) => {
    try {
      await API.post("/applications", { propertyId });
      toast.success("Application submitted");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  return (
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Tenant Dashboard
            </h1>

            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Browse available properties and apply for the one you want.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/tenant/my-properties"
              className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition text-center"
            >
              My Properties
            </Link>

            <Link
              to="/tenant/payments"
              className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition text-center"
            >
              Payments
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-10">
          <StatCard title="Available Properties" value={properties.length} />
          <StatCard title="Applications" value="Apply & Wait" />
          <StatCard title="My Property" value="After Approval" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            Browse Properties
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Once an owner approves your application, the property will appear in
            My Properties.
          </p>
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title="No properties available"
            subtitle="New listings will appear here soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
              >
                {property.image && (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-44 object-cover rounded-xl mb-4"
                  />
                )}

                <h2 className="text-lg md:text-2xl font-bold mb-2 break-words">
                  {property.title}
                </h2>

                <p className="text-gray-600 mb-3 break-words">
                  {property.description}
                </p>

                <p className="mb-2 break-words">
                  📍 {property.location}
                </p>

                <p className="text-lg font-semibold text-indigo-600 mb-4">
                  ₹ {property.price}
                </p>

                <button
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => applyProperty(property.id)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;