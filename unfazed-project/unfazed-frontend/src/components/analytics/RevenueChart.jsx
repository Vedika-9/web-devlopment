import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  const chartData = data.map((d) => ({ month: d._id, revenue: d.totalRevenue / 100 }));
  return (
    <div className="border border-line rounded-card bg-white p-5 h-72">
      <p className="font-serif text-lg mb-3">Revenue trend</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#DDD8CC" strokeDasharray="3 3" />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Line type="monotone" dataKey="revenue" stroke="#3F6B5E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
