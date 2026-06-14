import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import ChatBox from "../../components/ChatBox";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const { clearUnreadChats } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    clearUnreadChats?.();
  }, [clearUnreadChats]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/workers/job/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post("/reviews", {
        jobId: job.id,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      });

      toast.success("Review submitted");
      setReviewData({
        rating: 5,
        comment: "",
      });
      fetchJob();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  if (loading) {
    return (
      <div className="md:flex bg-gray-50">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            Loading job details...
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="md:flex bg-gray-50">
        <Sidebar />

        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            Job not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="mb-6">
          <Link
            to={-1}
            className="inline-block text-sm text-indigo-600 hover:underline mb-4"
          >
            ← Back
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Job Details
              </h1>

              <p className="text-gray-500 mt-1 text-sm md:text-base">
                View complaint, property, worker, chat, and review details.
              </p>
            </div>

            <div className="flex">
              <StatusBadge status={job.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Complaint
            </h2>

            <h3 className="text-xl md:text-2xl font-semibold break-words">
              {job.complaint?.title}
            </h3>

            <p className="text-gray-600 mt-3 break-words">
              {job.complaint?.description}
            </p>

            {job.complaint?.image && (
              <img
                src={job.complaint.image}
                alt={job.complaint?.title}
                className="w-full h-52 md:h-72 object-cover rounded-xl mt-5"
              />
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">
                Complaint Status:
              </span>
              <StatusBadge status={job.complaint?.status} />
            </div>
          </div>

          <InfoCard title="Worker">
            <p className="font-semibold text-lg break-words">
              {job.worker?.name}
            </p>

            <p className="text-gray-500 mt-1 break-words">
              {job.worker?.email}
            </p>

            <p className="text-gray-600 mt-3">
              Skill:{" "}
              <span className="font-medium">
                {job.worker?.skill || "Worker"}
              </span>
            </p>

            <p className="text-gray-600 mt-2">
              Rating: ⭐ {job.worker?.rating || 0}
            </p>

            <p className="text-gray-600 mt-2">
              Completed Jobs: {job.worker?.completedJobs || 0}
            </p>
          </InfoCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <InfoCard title="Property">
            {job.complaint?.property?.image && (
              <img
                src={job.complaint.property.image}
                alt={job.complaint.property.title}
                className="w-full h-44 object-cover rounded-xl mb-4"
              />
            )}

            <p className="font-semibold text-lg break-words">
              {job.complaint?.property?.title}
            </p>

            <p className="text-gray-500 mt-2 break-words">
              {job.complaint?.property?.description}
            </p>

            <p className="text-gray-600 mt-3 break-words">
              📍 {job.complaint?.property?.location}
            </p>

            <p className="text-indigo-600 font-bold mt-2">
              ₹ {job.complaint?.property?.price}
            </p>
          </InfoCard>

          <InfoCard title="Tenant">
            <p className="font-semibold text-lg break-words">
              {job.complaint?.createdBy?.name}
            </p>

            <p className="text-gray-500 mt-1 break-words">
              {job.complaint?.createdBy?.email}
            </p>

            <p className="text-gray-600 mt-3">
              Role: {job.complaint?.createdBy?.role}
            </p>
          </InfoCard>

          <InfoCard title="Timeline">
            <p className="text-gray-600 break-words">
              Created: {new Date(job.createdAt).toLocaleString()}
            </p>

            <p className="text-gray-600 mt-3">
              Current Status:
            </p>

            <div className="mt-2">
              <StatusBadge status={job.status} />
            </div>
          </InfoCard>
        </div>

        {job.status === "DONE" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Worker Review
            </h2>

            {job.review ? (
              <div>
                <p className="text-lg font-semibold">
                  Rating: ⭐ {job.review.rating}
                </p>

                <p className="text-gray-600 mt-2 break-words">
                  {job.review.comment || "No comment added."}
                </p>
              </div>
            ) : (
              <form onSubmit={submitReview} className="grid gap-4">
                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      rating: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg w-full"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>

                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      comment: e.target.value,
                    })
                  }
                  placeholder="Write your review..."
                  className="border p-3 rounded-lg min-h-28 w-full"
                />

                <button className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700">
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mb-8">
          <ChatBox jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
    <h2 className="text-lg md:text-xl font-bold mb-4">
      {title}
    </h2>
    {children}
  </div>
);

export default JobDetails;