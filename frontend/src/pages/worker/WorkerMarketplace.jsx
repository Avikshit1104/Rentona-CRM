import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";

const WorkerMarketplace = () => {
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState("");

  const fetchWorkers = async () => {
    const res = await API.get("/workers");
    setWorkers(res.data.workers || []);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filtered = workers.filter((w) =>
    w.skill?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          Find Workers 🔧
        </h1>

        {/* SEARCH */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plumber, electrician..."
          className="w-full p-3 border rounded-xl mb-6"
        />

        {/* WORKERS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((worker) => (
            <div
              key={worker.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold">
                {worker.name}
              </h2>

              <p className="text-gray-500">
                {worker.skill}
              </p>

              <p className="text-sm mt-2">
                ⭐ Rating: {worker.rating || "4.5"}
              </p>

              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl w-full">
                Assign Worker
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerMarketplace;