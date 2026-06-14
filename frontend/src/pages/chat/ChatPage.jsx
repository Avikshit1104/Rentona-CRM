import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChatBox from "../../components/ChatBox";

const ChatPage = () => {
  const { jobId } = useParams();

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

          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold">
              Chat
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Chat related to this assigned worker job.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-2 md:p-4 shadow-sm">
          <ChatBox jobId={jobId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;