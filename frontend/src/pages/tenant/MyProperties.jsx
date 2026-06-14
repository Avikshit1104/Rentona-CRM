import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get("/applications/my-approved");
      setProperties(res.data.properties || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  if (loading) {
    return (
      <div className="md:flex bg-gray-50">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
          Loading your properties...
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
        <h1 className="text-2xl md:text-3xl font-bold">
          My Properties
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Properties where your application has been approved.
        </p>

        {properties.length === 0 ? (
          <EmptyState
            title="No approved properties yet"
            subtitle="Once an owner approves your application, it will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm"
              >
                {property.image && (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-52 object-cover rounded-xl mb-4"
                  />
                )}

                <h2 className="text-xl font-bold break-words">
                  {property.title}
                </h2>

                <p className="text-gray-500 mt-2 break-words">
                  {property.description}
                </p>

                <p className="text-gray-600 mt-3">
                  📍 {property.location}
                </p>

                <p className="text-indigo-600 font-bold mt-2">
                  ₹ {property.price}
                </p>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Property Complaints
                  </h3>

                  {property.complaints?.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No complaints for this property yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {property.complaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="border border-gray-100 rounded-xl p-4"
                        >
                          <h4 className="font-semibold break-words">
                            {complaint.title}
                          </h4>

                          <p className="text-gray-500 text-sm mt-1 break-words">
                            {complaint.description}
                          </p>

                          {complaint.image && (
                            <img
                              src={complaint.image}
                              alt={complaint.title}
                              className="w-full h-40 object-cover rounded-lg mt-3"
                            />
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge status={complaint.status} />

                            <span className="text-xs text-gray-400">
                              by {complaint.createdBy?.name || "Tenant"}
                            </span>
                          </div>

                          {complaint.jobs?.length > 0 && (
                            <Link
                              to={`/job/${complaint.jobs[0].id}`}
                              className="block text-center mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                              Open Chat
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;