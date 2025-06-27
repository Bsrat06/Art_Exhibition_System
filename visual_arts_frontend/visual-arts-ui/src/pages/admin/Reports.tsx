import { useEffect, useState } from "react"
import API from "../../lib/api"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]

export default function Reports() {
  const [data, setData] = useState([])

  useEffect(() => {
    API.get("/artwork/category_analytics/")
      .then(res => setData(res.data))
      .catch(() => console.warn("Failed to fetch analytics"))
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Artwork Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">By Category & Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" fill="#10B981" name="Approved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Total Artworks by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
