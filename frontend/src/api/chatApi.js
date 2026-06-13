import axios from "./axios";

export const getMessages = async (jobId) => {
  const res = await axios.get(`/chat/${jobId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await axios.post("/chat", data);
  return res.data;
};c