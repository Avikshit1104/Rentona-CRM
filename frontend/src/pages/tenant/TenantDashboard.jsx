import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

const TenantDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [complaintData, setComplaintData] = useState({
    title: "",
    description: "",
    propertyId: "",
    image: null,
  });

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data.properties || res.data.data || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.complaints || res.data.data || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchComplaints();
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

  const handleComplaintChange = (e) => {
    if (e.target.name === "image") {
      setComplaintData({
        ...complaintData,
        image: e.target.files[0],
      });
      return;
    }

    setComplaintData({
      ...complaintData,
      [e.target.name]: e.target.value,
    });
  };

  const createComplaint = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", complaintData.title);
      data.append("description", complaintData.description);
      data.append("propertyId", complaintData.propertyId);

      if (complaintData.image) {
        data.append("image", complaintData.image);
      }

      await API.post("/complaints", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Complaint created");

      setComplaintData({
        title: "",
        description: "",
        propertyId: "",
        image: null,
      });

      fetchComplaints();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Complaint failed");
    }
  };

  return (
    <div className="md:flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Tenant Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Browse properties, apply, pay rent, raise complaints, and chat
              with assigned workers.
            </p>
          </div>

          <Link
            to="/tenant/payments"
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition text-center"
          >
            View Payments
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-10">
          <StatCard title="Available Properties" value={properties.length} />
          <StatCard title="My Complaints" value={complaints.length} />
          <StatCard title="Saved Budget" value="₹20K" />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Browse Properties</h2>
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title="No properties available"
            subtitle="New listings will appear here soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
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

                <p className="mb-2 break-words">📍 {property.location}</p>

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

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold mb-4">Create Complaint</h2>

          <form
            onSubmit={createComplaint}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="title"
              value={complaintData.title}
              onChange={handleComplaintChange}
              placeholder="Complaint title"
              className="border p-3 rounded-lg"
            />

            <select
              name="propertyId"
              value={complaintData.propertyId}
              onChange={handleComplaintChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Select Property</option>

              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>

            <input
              name="description"
              value={complaintData.description}
              onChange={handleComplaintChange}
              placeholder="Description"
              className="border p-3 rounded-lg md:col-span-2"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleComplaintChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <button className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 md:col-span-2">
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">My Complaints</h2>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints yet"
            subtitle="Your submitted complaints will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition duration-300"
              >
                <h2 className="text-lg md:text-xl font-semibold break-words">{complaint.title}</h2>

                <p className="text-gray-500 mt-2 break-words">{complaint.description}</p>

                {complaint.image && (
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="w-full h-48 object-cover rounded-xl mt-4"
                  />
                )}

                <p className="mt-3 flex flex-wrap items-center gap-2">
                  Status: <StatusBadge status={complaint.status} />
                </p>

                {complaint.property?.title && (
                  <p className="text-sm text-gray-500 mt-2">
                    Property: {complaint.property.title}
                  </p>
                )}

                {complaint.jobs?.length > 0 ? (
                  <Link
                    to={`/job/${complaint.jobs[0].id}`}
                    className="block text-center mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Chat With Worker
                  </Link>
                ) : (
                  <p className="text-sm text-gray-400 mt-4">
                    Worker not assigned yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;