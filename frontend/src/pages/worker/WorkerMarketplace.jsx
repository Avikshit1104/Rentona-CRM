import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import EmptyState from "../../components/EmptyState";

const WorkerMarketplace = () => {
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/workers");
      setWorkers(res.data.workers || res.data.data || res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filtered = workers.filter((worker) => {
    const search = query.toLowerCase();

    return (
      worker.name?.toLowerCase().includes(search) ||
      worker.skill?.toLowerCase().includes(search) ||
      worker.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="md:flex bg-gray-50">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            Loading workers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Find Workers 🔧
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Search and discover available workers by name, email, or skill.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plumber, electrician, cleaner..."
            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No workers found"
            subtitle="Try searching with another skill or name."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((worker) => (
              <div
                key={worker.id}
                className="bg-white border border-gray-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-lg md:text-xl font-bold break-words">
                  {worker.name}
                </h2>

                <p className="text-gray-500 mt-1 break-words">
                  {worker.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    {worker.skill || "Worker"}
                  </span>

                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                    ⭐ {worker.rating || 0}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>
                    Completed Jobs:{" "}
                    <span className="font-medium">
                      {worker.completedJobs || 0}
                    </span>
                  </p>

                  <p>
                    Accepted Jobs:{" "}
                    <span className="font-medium">
                      {worker.acceptedJobs || 0}
                    </span>
                  </p>
                </div>

                <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl w-full transition">
                  Assign Worker
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerMarketplace;