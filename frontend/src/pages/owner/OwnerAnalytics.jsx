import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/Sidebar";

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

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const OwnerAnalytics = () => {
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/properties/my");
    setProperties(res.data.properties || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 💰 fake revenue logic (you can replace later with real backend)
  const revenueData = properties.map((p) => ({
    name: p.title,
    revenue: p.price * 12,
  }));

  const totalRevenue = revenueData.reduce(
    (acc, curr) => acc + curr.revenue,
    0
  );

  const chartData = [
    { name: "Revenue", value: totalRevenue },
    { name: "Costs", value: totalRevenue * 0.4 },
    { name: "Profit", value: totalRevenue * 0.6 },
  ];

  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 mb-10">
          Revenue & performance overview
        </p>

        {/* TOP KPI */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <KPI title="Total Revenue" value={`₹${totalRevenue}`} />
          <KPI title="Properties" value={properties.length} />
          <KPI title="Avg Income" value={`₹${Math.round(totalRevenue / (properties.length || 1))}`} />
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-10">
          <h2 className="font-semibold mb-4">Revenue per Property</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Financial Breakdown</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={100} label>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KPI = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

export default OwnerAnalytics;