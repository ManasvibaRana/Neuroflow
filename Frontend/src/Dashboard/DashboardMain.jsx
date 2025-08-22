import React, { useEffect, useState } from "react";
import {
  Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, CartesianGrid, Treemap, Bar
} from "recharts";

// --- Helper Components & Constants (from your AnalysisPage) ---

const EMOTION_COLORS = { happy: "#00C9A7", joy: "#38BDF8", sad: "#6A67CE", sadness: "#8B5CF6", anger: "#F87171", angry: "#EF4444", disgust: "#D946EF", fear: "#FB923C", surprise: "#FACC15", neutral: "#9CA3AF" };

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200/50">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-sm my-1">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-inner" style={{ backgroundColor: entry.color || entry.stroke || (entry.payload && entry.payload.fill) }}></div>
              <span className="font-medium text-gray-600">{entry.name}:</span>
            </div>
            <span className="font-bold text-gray-800 ml-2">{entry.value?.toFixed?.(2) || entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const renderCustomizedPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#1f2937" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const CustomizedTreemapContent = (props) => {
  const { x, y, width, height, name, fill } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: '#fff', strokeWidth: 2, rx: 4, ry: 4 }} />
      {width > 80 && height > 20 && (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">
          {name}
        </text>
      )}
    </g>
  );
};


// --- Main Dashboard Component ---

export default function DashboardMain() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/analysis/?userid=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((userData) => {
        // We need at least 2 days of data for a meaningful trend chart
        if (userData && userData.correlation_details?.sample_size >= 2) {
          setData(userData);
        } else {
          setError("You need at least 2 days of data to view the dashboard charts.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p className="font-bold">Could not load dashboard</p>
        <p>{error || "An unknown error occurred."}</p>
      </div>
    );
  }

  // --- Process data for the charts ---
  const trendData = data.labels_weekly.map((label, i) => ({
    name: label,
    "Mood Score": data.mood_trend_weekly[i],
    "Productivity Score": data.productivity_trend_weekly[i],
  }));

  const emotionData = Object.entries(data.all_emotions_weekly).map(([emotion, count]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: count,
    fill: EMOTION_COLORS[emotion] || '#A3E635'
  }));
  
  const completionRate = (data.task_stats.completed + data.task_stats.not_completed) > 0 
    ? Math.round((data.task_stats.completed / (data.task_stats.completed + data.task_stats.not_completed)) * 100) 
    : 0;
  
  const taskCompletionData = [
    { name: "Completed", value: data.task_stats.completed, fill: "#10B981" },
    { name: "Incomplete", value: data.task_stats.not_completed, fill: "#EF4444" },
  ];

  const taskTypeTreemapData = Object.entries(data.task_type_stats).map(([name, size]) => ({
    name: name,
    size: size || 0,
    fill: { DO: "#3B82F6", DECIDE: "#10B981", DELEGATE: "#F59E0B", DELETE: "#EF4444" }[name]
  }));

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back!</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Mood vs Productivity Trend */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" stroke="#8884d8" label={{ value: 'Mood', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Productivity', angle: -90, position: 'insideRight' }}/>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="right" dataKey="Productivity Score" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="Mood Score" stroke="#8884d8" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 2: Emotion Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={emotionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedPieLabel}>
                {emotionData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 3: Task Completion */}
        <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Task Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={taskCompletionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {taskCompletionData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-700">{completionRate}%</text>
                </PieChart>
            </ResponsiveContainer>
        </Card>

      
      </div>
    </div>
  );
}