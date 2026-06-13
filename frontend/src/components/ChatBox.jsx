import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ jobId }) => {
  const { user, socket } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/chat/${jobId}`);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadMessages();
    }
  }, [jobId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !jobId) return;

    socket.emit("join-room", jobId);

    const handleReceiveMessage = (msg) => {
      if (msg.jobId === jobId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, jobId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageData = {
      jobId,
      message: text.trim(),
      senderId: user.id,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };

    try {
      socket?.emit("send-message", messageData);

      setText("");

      await API.post("/chat", {
        jobId,
        message: messageData.message,
      });
    } catch (error) {
      console.log(error);
      toast.error("Message failed");
    }
  };

  if (!jobId) {
    return (
      <div className="bg-white border rounded-2xl p-6 text-gray-500">
        Select a job to start chatting.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Job Chat</h2>
        <p className="text-sm text-gray-500">
          Real-time conversation for this worker job.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user.id;

            return (
              <div
                key={msg.id || `${msg.senderId}-${msg.createdAt}-${index}`}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border rounded-bl-sm"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1 text-gray-500">
                      {msg.sender?.name || "User"}
                    </p>
                  )}

                  <p className="text-sm">{msg.message}</p>

                  <p
                    className={`text-[10px] mt-2 ${
                      isMe ? "text-indigo-100" : "text-gray-400"
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;