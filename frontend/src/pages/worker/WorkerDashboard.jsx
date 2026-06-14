import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { io } from "socket.io-client";

const EVENTS = {
  JOB_UPDATED: "job-updated",
  NOTIFY: "notify",
};

const COLORS = ["#facc15", "#22c55e", "#ef4444"];

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const [socket] = useState(() =>
    io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    })
  );

  const fetchJobs = async () => {
    try {
      const res = await API.get("/workers/jobs");
      setJobs(res.data.jobs || res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleJobUpdate = () => fetchJobs();

    const handleNotify = (data) => {
      if (data?.message) {
        toast.success(data.message);
      }
    };

    socket.on(EVENTS.JOB_UPDATED, handleJobUpdate);
    socket.on(EVENTS.NOTIFY, handleNotify);

    return () => {
      socket.off(EVENTS.JOB_UPDATED, handleJobUpdate);
      socket.off(EVENTS.NOTIFY, handleNotify);
    };
  }, [socket]);

  const updateDecision = async (jobId, status) => {
    try {
      await API.put("/workers/decision", {
        jobId,
        status,
      });

      socket.emit(EVENTS.JOB_UPDATED);
      socket.emit(EVENTS.NOTIFY, {
        message: `Job ${status}`,
      });

      fetchJobs();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const markDone = async (jobId) => {
    try {
      await API.put("/workers/done", { jobId });

      socket.emit(EVENTS.JOB_UPDATED);
      socket.emit(EVENTS.NOTIFY, {
        message: "Job completed 🎉",
      });

      fetchJobs();
    } catch (error) {
      console.log(error);
      toast.error("Completion failed");
    }
  };

  const pending = jobs.filter((j) => j.status === "PENDING").length;
  const accepted = jobs.filter((j) => j.status === "ACCEPTED").length;
  const done = jobs.filter((j) => j.status === "DONE").length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Accepted", value: accepted },
    { name: "Done", value: done },
  ];

  const filteredJobs = jobs.filter(
    (job) => filter === "ALL" || job.status === filter
  );

  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Worker Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage assigned jobs in real-time
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 mb-10">
          <h2 className="text-lg font-semibold mb-4">Job Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={80} label>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Jobs" value={jobs.length} />
          <StatCard title="Active Jobs" value={accepted} />
          <StatCard title="Completed" value={done} />
        </div>

        <div className="flex gap-3 mb-6">
          {["ALL", "PENDING", "ACCEPTED", "DONE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg border transition ${
                filter === type ? "bg-black text-white" : "bg-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredJobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            subtitle="Assigned jobs will appear here."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold">
                  {job.complaint?.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {job.complaint?.description}
                </p>

                {job.complaint?.image && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${job.complaint.image}`}
                    alt={job.complaint?.title}
                    className="w-full h-48 object-cover rounded-xl mt-4"
                  />
                )}

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <StatusBadge status={job.status} />
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  {job.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateDecision(job.id, "ACCEPTED")}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => updateDecision(job.id, "REJECTED")}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {job.status === "ACCEPTED" && (
                    <>
                      <button
                        onClick={() => markDone(job.id)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Mark Done
                      </button>

                      <Link
                        to={`/job/${job.id}`}
                        className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                      >
                        Open Chat
                      </Link>
                    </>
                  )}

                  {job.status === "DONE" && (
                    <Link
                      to={`/job/${job.id}`}
                      className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                    >
                      View Chat
                    </Link>
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

export default WorkerDashboard;