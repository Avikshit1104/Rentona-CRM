import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import {
  getMyPayments,
  markPaymentSuccess,
} from "../../api/paymentApi";

const TenantPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getMyPayments();
      setPayments(data);
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (paymentId) => {
    try {
      await markPaymentSuccess(paymentId);
      toast.success("Payment successful");
      fetchPayments();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="md:flex bg-gray-50">
        <Sidebar />

        <div className="flex-1 min-h-screen p-4 md:p-10 pt-20 md:pt-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            Loading payments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen p-4 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Payments
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            View rent payments and pay pending dues.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-bold">
              Payment History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Month</th>
                  <th className="p-4 text-left">Property</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Transaction ID</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-gray-500"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="p-4 whitespace-nowrap">
                        {payment.month}
                      </td>

                      <td className="p-4 min-w-[180px]">
                        {payment.property?.title || "Property"}
                      </td>

                      <td className="p-4 font-semibold whitespace-nowrap">
                        ₹{payment.amount}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="p-4 min-w-[180px] break-all">
                        {payment.transactionId || "-"}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {payment.status === "PENDING" ? (
                          <button
                            onClick={() => handlePayNow(payment.id)}
                            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-400">
                            Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPayments;