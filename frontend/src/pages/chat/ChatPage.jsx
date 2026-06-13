import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChatBox from "../../components/ChatBox";

const ChatPage = () => {
  const { jobId } = useParams();

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mb-6">
          <Link
            to={-1}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back
          </Link>

          <h1 className="text-3xl font-bold mt-3">Chat</h1>
          <p className="text-gray-500 mt-1">
            Chat related to this assigned worker job.
          </p>
        </div>

        <ChatBox jobId={jobId} />
      </div>
    </div>
  );
};

export default ChatPage;