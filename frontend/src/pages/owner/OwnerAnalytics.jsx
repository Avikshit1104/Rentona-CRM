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

  const revenueData = properties.map((p) => ({
    name:
      p.title.length > 10
        ? `${p.title.slice(0, 10)}...`
        : p.title,
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
    <div className="md:flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen p-4 md:p-10 pt-20 md:pt-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mb-8 md:mb-10">
          Revenue & performance overview
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <KPI title="Total Revenue" value={`₹${totalRevenue}`} />
          <KPI title="Properties" value={properties.length} />
          <KPI
            title="Avg Income"
            value={`₹${Math.round(
              totalRevenue / (properties.length || 1)
            )}`}
          />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10 overflow-hidden">
          <h2 className="font-semibold mb-4">
            Revenue per Property
          </h2>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow overflow-hidden">
          <h2 className="font-semibold mb-4">
            Financial Breakdown
          </h2>

          <div className="h-[280px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
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
    </div>
  );
};

const KPI = ({ title, value }) => (
  <div className="bg-white p-5 md:p-6 rounded-2xl shadow">
    <p className="text-gray-500 text-sm md:text-base">{title}</p>
    <h2 className="text-2xl md:text-3xl font-bold mt-2 break-words">
      {value}
    </h2>
  </div>
);

export default OwnerAnalytics;