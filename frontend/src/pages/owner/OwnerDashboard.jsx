import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties/my");
      setProperties(res.data.properties || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications/owner");
      setApplications(res.data.applications || []);
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

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/workers");
      setWorkers(res.data.workers || res.data.data || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchApplications();
    fetchComplaints();
    fetchWorkers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const propertyData = new FormData();

      propertyData.append("title", formData.title);
      propertyData.append("description", formData.description);
      propertyData.append("location", formData.location);
      propertyData.append("price", formData.price);

      if (formData.image) {
        propertyData.append("image", formData.image);
      }

      await API.post("/properties", propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Property created");

      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        image: null,
      });

      fetchProperties();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create property");
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await API.put("/applications/decision", {
        applicationId,
        status,
      });

      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update application");
    }
  };

  const assignWorker = async (complaintId, workerId) => {
    if (!workerId) return;

    try {
      await API.post("/workers/assign", {
        complaintId,
        workerId,
      });

      toast.success("Worker assigned");
      fetchComplaints();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Owner Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage properties, applications, complaints, and workers
            </p>
          </div>

          <Link
            to="/owner/payments"
            className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition text-center"
          >
            Revenue Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <StatCard title="Total Properties" value={properties.length} />
          <StatCard title="Applications" value={applications.length} />
          <StatCard
            title="Pending Apps"
            value={applications.filter((app) => app.status === "PENDING").length}
          />
          <StatCard title="Complaints" value={complaints.length} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 mb-8 md:mb-10 shadow-sm hover:shadow-lg transition duration-300">
          <h2 className="text-lg font-semibold mb-4">Add New Property</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-3 rounded-lg w-full"
            />

            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-3 rounded-lg w-full md:col-span-2"
            />

            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full md:col-span-2 text-sm"
            />

            <button className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 md:col-span-2">
              Create Property
            </button>
          </form>
        </div>

        <SectionTitle title="Tenant Applications" />

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            subtitle="Tenant applications will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-lg transition duration-300"
              >
                <h2 className="text-lg md:text-xl font-semibold break-words">
                  {app.property?.title}
                </h2>

                <p className="text-gray-500 mt-2 break-words">
                  Tenant: {app.tenant?.name}
                </p>

                <p className="text-gray-500 break-words">
                  Email: {app.tenant?.email}
                </p>

                <p className="mt-3 flex flex-wrap items-center gap-2">
                  Status: <StatusBadge status={app.status} />
                </p>

                {app.status === "PENDING" && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => updateApplicationStatus(app.id, "APPROVED")}
                      className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                      className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <SectionTitle title="Complaints" />

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints yet"
            subtitle="Tenant complaints will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-lg transition duration-300"
              >
                <h2 className="text-lg md:text-xl font-semibold break-words">
                  {complaint.title}
                </h2>

                <p className="text-gray-500 mt-2 break-words">
                  {complaint.description}
                </p>

                {complaint.image && (
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="w-full h-44 md:h-48 object-cover rounded-xl mt-4"
                  />
                )}

                <p className="mt-3 flex flex-wrap items-center gap-2">
                  Status: <StatusBadge status={complaint.status} />
                </p>

                <select
                  className="border p-3 rounded-lg mt-4 w-full"
                  onChange={(e) => assignWorker(complaint.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Assign Worker</option>

                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.skill || "Worker"}
                    </option>
                  ))}
                </select>

                {complaint.jobs?.length > 0 && (
                  <Link
                    to={`/job/${complaint.jobs[0].id}`}
                    className="block text-center mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Open Chat
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        <SectionTitle title="Your Properties" />

        {loading ? (
          <EmptyState title="Loading properties..." />
        ) : properties.length === 0 ? (
          <EmptyState
            title="No properties yet"
            subtitle="Create your first listing above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:shadow-lg transition duration-300"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-44 md:h-48 object-cover rounded-xl mb-4"
                  />
                )}

                <h2 className="text-lg md:text-xl font-semibold break-words">
                  {p.title}
                </h2>

                <p className="text-gray-500 mt-2 break-words">
                  {p.description}
                </p>

                <p className="mt-3 text-sm text-gray-600 break-words">
                  📍 {p.location}
                </p>

                <p className="mt-2 text-indigo-600 font-bold">
                  ₹ {p.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="mb-4 md:mb-6 mt-8 md:mt-10">
    <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
  </div>
);

export default OwnerDashboard;