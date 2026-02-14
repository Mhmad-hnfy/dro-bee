import React from "react";
import { useShop } from "../context/ShopContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";

function Analytics() {
  const { products, orders } = useShop();

  // Calculate Metrics
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  // Data for View Trends (Last 7 days mock or mapped from real data if available)
  // Since we don't have daily tracking yet, let's map top products for a Bar Chart
  const topProductsData = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
      views: p.views || 0,
      sales: orders.filter((o) => o.items.some((item) => item.id === p.id))
        .length,
    }));

  // Data for Sales Curve (Last 10 orders)
  const salesCurveData = orders.slice(-10).map((o, idx) => ({
    name: `Order ${idx + 1}`,
    amount: o.total,
  }));

  const COLORS = ["#facc15", "#fbbf24", "#f59e0b", "#d97706", "#b45309"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic mb-1">
          Dro<span className="text-yellow-500">Bee</span>{" "}
          <span className="text-gray-400 not-italic font-medium">
            Analytics
          </span>
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          Real-time Performance Insights
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "Total Views",
            value: totalViews,
            icon: "👁️",
            color: "bg-blue-500",
          },
          {
            label: "Total Revenue",
            value: `EGP ${totalSales.toFixed(2)}`,
            icon: "💰",
            color: "bg-green-500",
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: "📦",
            color: "bg-yellow-500",
          },
          {
            label: "Avg. Order",
            value: `EGP ${avgOrderValue.toFixed(2)}`,
            icon: "📈",
            color: "bg-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-${stat.color.split("-")[1]}-100`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-black text-gray-900 mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Sales Curve */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            Sales Revenue Curve (Recent)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesCurveData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis dataKey="name" hide />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#facc15"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#000", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Views */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            Top 5 Most Viewed Products
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {topProductsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product List Table with Views & Discount */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Global Product Performance
          </h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Product
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                Views
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                Discount
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Base Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.slice(0, 10).map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {p.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                    {p.views || 0}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${p.discount > 0 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {p.discount > 0 ? `-${p.discount}%` : "None"}
                  </span>
                </td>
                <td className="px-8 py-5 text-right font-bold text-gray-500">
                  EGP{" "}
                  {parseFloat(
                    p.price.toString().replace(/[^\d.]/g, ""),
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
