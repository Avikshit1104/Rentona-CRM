import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyPayments, markPaymentSuccess } from "../../api/paymentApi";

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
    return <div className="p-6">Loading payments...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Payments
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
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
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="p-4">{payment.month}</td>

                  <td className="p-4">
                    {payment.property?.title || "Property"}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{payment.amount}
                  </td>

                  <td className="p-4">
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

                  <td className="p-4">
                    {payment.transactionId || "-"}
                  </td>

                  <td className="p-4">
                    {payment.status === "PENDING" ? (
                      <button
                        onClick={() => handlePayNow(payment.id)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray-400">Paid</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantPayments;