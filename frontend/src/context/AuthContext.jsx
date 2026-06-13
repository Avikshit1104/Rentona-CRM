import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadChats, setUnreadChats] = useState(0);

  const socketRef = useRef(null);

  const connectSocket = (userData) => {
    if (!userData?.id) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("register-user", userData.id);
    });

    newSocket.on("new-notification", (notification) => {
      toast.success(notification.title || "New notification");
    });

    newSocket.on("chat-notification", (data) => {
      if (data.senderId !== userData.id) {
        setUnreadChats((prev) => prev + 1);
        toast.success("New chat message");
      }
    });

    newSocket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      connectSocket(parsedUser);
    }

    setLoading(false);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    connectSocket(userData);
  };

  const logout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    localStorage.clear();
    setUser(null);
    setSocket(null);
    setUnreadChats(0);
    window.location.href = "/login";
  };

  const clearUnreadChats = () => {
    setUnreadChats(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        socket,
        login,
        logout,
        loading,
        unreadChats,
        clearUnreadChats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);