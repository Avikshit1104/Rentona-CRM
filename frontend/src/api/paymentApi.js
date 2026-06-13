import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

const getToken = () => localStorage.getItem("token");

export const getMyPayments = async () => {
  const res = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.payments;
};

export const createPayment = async (paymentData) => {
  const res = await axios.post(`${API_URL}/create`, paymentData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const markPaymentSuccess = async (paymentId) => {
  const res = await axios.put(
    `${API_URL}/success`,
    {
      paymentId,
      transactionId: `TXN_${Date.now()}`,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};