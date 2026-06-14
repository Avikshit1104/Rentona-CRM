import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";

const OwnerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/payments/owner");
      setPayments(res.data.payments || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load owner payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = useMemo(() => {
    return payments
      .filter((payment) => payment.status === "SUCCESS")
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const pendingAmount = useMemo(() => {
    return payments
      .filter((payment) => payment.status === "PENDING")
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const revenueByMonth = useMemo(() => {
    const data = {};

    payments
      .filter((payment) => payment.status === "SUCCESS")
      .forEach((payment) => {
        data[payment.month] = (data[payment.month] || 0) + payment.amount;
      });

    return Object.keys(data).map((month) => ({
      month,
      revenue: data[month],
    }));
  }, [payments]);

  const statusData = [
    { name: "SUCCESS", value: successfulPayments },
    { name: "PENDING", value: pendingPayments },
    {
      name: "FAILED",
      value: payments.filter((payment) => payment.status === "FAILED").length,
    },
  ];

  if (loading) {
    return (
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50 p-10">
          Loading revenue dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-10 pt-20 md:pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track rent payments, pending dues, and monthly revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
          <StatCard title="Pending Amount" value={`₹${pendingAmount}`} />
          <StatCard title="Successful Payments" value={successfulPayments} />
          <StatCard title="Pending Payments" value={pendingPayments} />
        </div>

        {payments.length === 0 ? (
          <EmptyState
            title="No payments found"
            subtitle="Tenant payments will appear here once created."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Revenue by Month</h2>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByMonth}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Payment Status</h2>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={["#22c55e", "#f59e0b", "#ef4444"][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">All Payments</h2>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-4 text-left">Month</th>
                    <th className="p-4 text-left">Tenant</th>
                    <th className="p-4 text-left">Property</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Transaction ID</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="p-4">{payment.month}</td>

                      <td className="p-4">
                        {payment.tenant?.name || "Tenant"}
                      </td>

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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerPayments;