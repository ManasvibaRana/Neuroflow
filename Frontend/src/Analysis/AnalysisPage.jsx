import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
    LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer, AreaChart, Area, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, ComposedChart, CartesianGrid, Treemap
} from "recharts";
import MainNavbar from '.././Navbar.jsx'; 
import { toast } from "sonner"; 
import useChimes from "../usechimes";

// --- Mock React Router DOM ---
const useNavigate = () => {
  return (path) => console.log(`Navigating to ${path}`);
};

// --- Color Palettes & Styling ---
const EMOTION_COLORS = { happy: "#00C9A7", joy: "#38BDF8", sad: "#6A67CE", sadness: "#8B5CF6", anger: "#F87171", angry: "#EF4444", disgust: "#D946EF", fear: "#FB923C", surprise: "#FACC15", neutral: "#9CA3AF", none: "#64748B", default: "#A3E635" };

const Card = ({ children, className = '' }) => (
  <div className={`relative rounded-2xl p-[2px] overflow-hidden shadow-lg ${className}`}>
    <div className="absolute inset-0 rounded-2xl animate-borderFlow" />
    <div className="relative z-10 h-full w-full bg-white/90 backdrop-blur-sm rounded-[15px] p-4 sm:p-6">
      {children}
    </div>
  </div>
);


const Tabs = ({ tabs,onTabClick }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-x-4 sm:gap-x-8" aria-label="Tabs">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                onTabClick?.(); //  <-- ✅ Call the function passed from the parent
              }}
              className={`${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">{tabs[activeTab]}</div>
    </div>
  );
};

// --- Main Analysis Page Component ---
const AnalysisPage = () => {
  const [data, setData] = useState(null);
  const [viewMode, setViewMode] = useState("Weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { successChimeRef, errorChimeRef, startChimeRef } = useChimes();

  useEffect(() => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      errorChimeRef.current?.play();
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/analysis/?userid=" + userId)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((userData) => {
        if (userData && Object.keys(userData).length > 0 && userData.correlation_details?.sample_size >= 5) {
          setData(userData);
          successChimeRef.current?.play();
        } else {
          setData(userData || {}); // still set data so render shows insufficient data screen
        }
      })
      .catch((err) => {
        setError(err.message);
        toast.error("❌ " + err.message);
        errorChimeRef.current?.play();
      })
      .finally(() => setLoading(false));
  }, []);

const hasEnoughData = data && data.correlation_details?.sample_size >= 5;

  if (!loading && data && !hasEnoughData) {
    errorChimeRef.current?.play()
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9fc] to-[#e6e6fa]">
        <MainNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center p-6">
          <h1 className="text-3xl font-bold text-[#796fc1] mb-4">📉 Insufficient Data</h1>
          <p className="text-lg text-gray-700 max-w-md mb-6">
            You need at least 5 days of journaling and task tracking to unlock detailed analytics.
          </p>
          <p className="text-gray-500">Start logging your mood and productivity daily to enable this feature.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9fc] to-[#e6e6fa]">
        <MainNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#796fc1] border-t-4 border-[#a78bfa] mb-6"></div>
          <div className="text-[#796fc1] text-lg font-semibold">Loading your analytics...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9fc] to-[#e6e6fa]">
        <MainNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-4">
          <div className="flex flex-col items-center justify-center bg-[#f3e8ff] rounded-xl shadow-lg border border-[#bfc7e6] p-6 sm:p-8 text-center">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-16 w-16 text-red-500 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
            <h2 className="text-xl sm:text-2xl font-bold text-[#796fc1] mb-2">An Error Occurred</h2>
            <p className="text-[#796fc1]">{error || "Could not retrieve data."}</p>
          </div>
        </div>
      </div>
    );
  }

  const trendData = (viewMode === "Weekly" ? data.labels_weekly : data.labels_monthly).map((label, i) => ({
    name: label,
    "Mood Score": viewMode === "Weekly" ? data.mood_trend_weekly[i] : data.mood_trend_monthly[i],
    "Productivity Score": viewMode === "Weekly" ? data.productivity_trend_weekly[i] : data.productivity_trend_monthly[i],
  }));
  const emotionDataForDisplay = Object.entries(viewMode === "Weekly" ? data.all_emotions_weekly : data.all_emotions_monthly).map(([emotion, count]) => ({ name: emotion.charAt(0).toUpperCase() + emotion.slice(1), value: count, color: EMOTION_COLORS[emotion] || '#A3E635' }));
  const correlationInsight = getCorrelationInsight(data.correlation_details);
  const emotionConsistencyData = Object.keys(data.all_emotions_weekly).map(emotion => ({ emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1), "This Week": data.all_emotions_weekly[emotion], "This Month": data.all_emotions_monthly[emotion] }));
  const taskTypeTreemapData = Object.entries(data.task_type_stats).map(([name, size]) => ({ name: `${name} Tasks`, size: size || 0, fill: { DO: "#10B981", DECIDE: "#3B82F6", DELEGATE: "#F59E0B", DELETE: "#EF4444" }[name] }));
  const growthData = data.growth_labels?.map((label, i) => ({ name: label, growth: data.monthly_growth?.[i] || 0 })) || [];
  const completionRate = (data.task_stats.completed + data.task_stats.not_completed) > 0 ? Math.round((data.task_stats.completed / (data.task_stats.completed + data.task_stats.not_completed)) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200/50">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm my-1">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-inner" style={{ backgroundColor: entry.color || entry.stroke || (entry.payload && (entry.payload.color || entry.payload.fill)) }}></div>
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
      <text x={x} y={y} fill="#1f2937" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight="bold" style={{ textShadow: '0px 1px 2px rgba(255,255,255,0.9)' }}>
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const CustomizedTreemapContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, rank, name, size, fill } = props;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: '#fff', strokeWidth: 2, rx: 4, ry: 4 }} />
        {width > 80 && height > 20 ? (
          <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">
            {name}
          </text>
        ) : null}
      </g>
    );
  };

  const TimeAnalysisBar = ({ label, value, maxValue, color }) => {
    const widthPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span className="font-semibold">{value.toFixed(2)}h</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${widthPercentage}%`, background: color }}></div>
        </div>
      </div>
    );
  };

  const ProductivityTabContent = () => {
    const taskCompletionDataForChart = [
      { name: "Completed", value: data.task_stats.completed, fill: "url(#glossyGreen)" },
      { name: "Incomplete", value: data.task_stats.not_completed, fill: "url(#glossyRed)" },
    ];
    const taskTimingDataForChart = [
      { name: "Early", value: data.task_stats.early, fill: "url(#glossyGreen)" },
      { name: "On Time", value: data.task_stats.on_time, fill: "url(#glossyBlue)" },
      { name: "Late", value: data.task_stats.late, fill: "url(#glossyRed)" },
    ];
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Completion</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  <linearGradient id="glossyGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6EE7B7" /><stop offset="100%" stopColor="#10B981" /></linearGradient>
                  <linearGradient id="glossyRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F87171" /><stop offset="100%" stopColor="#EF4444" /></linearGradient>
                </defs>
                <Pie data={taskCompletionDataForChart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {taskCompletionDataForChart.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-700">{completionRate}%</text>
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Timing</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskTimingDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="glossyBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {taskTimingDataForChart.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        {data.time_allocated !== undefined && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Time Analysis (Allocated vs. Used)</h2>
            <div className="space-y-4">
              <TimeAnalysisBar label="Allocated" value={data.time_allocated} maxValue={Math.max(data.time_allocated, data.time_used, 1)} color="linear-gradient(to right, #60A5FA, #3B82F6)" />
              <TimeAnalysisBar label="Used" value={data.time_used} maxValue={Math.max(data.time_allocated, data.time_used, 1)} color={data.time_used > data.time_allocated ? 'linear-gradient(to right, #F87171, #EF4444)' : 'linear-gradient(to right, #6EE7B7, #10B981)'} />
            </div>
          </Card>
        )}
      </div>
    );
  };

  const HabitTabContent = () => {
    const completedQuests = data.all_habits?.filter(h => h.completed) || [];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quest History Badges Card */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">🏆 Quest History</h2>
                    {completedQuests.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {completedQuests.map(quest => (
                                <div key={quest.id} className="group relative flex flex-col items-center" title={quest.name}>
                                    <div className="text-4xl bg-gray-200 p-3 rounded-full transition-transform group-hover:scale-110">
                                        {quest.avatar || '⭐'}
                                    </div>
                                    <span className="text-xs text-gray-600 mt-1 truncate w-16 text-center">{quest.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center">
                            <p className="text-gray-500">Your completed quest badges will appear here!</p>
                        </div>
                    )}
                </Card>

                {/* Active Quest Progress Card */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">🚀 Active Quest Progress</h2>
                    {data.active_habit_progress && data.active_habit_progress.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.active_habit_progress} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" tickFormatter={(day) => `Day ${day}`} />
                                <YAxis allowDecimals={false} domain={[0, 1]} tickFormatter={(tick) => tick === 1 ? 'Done' : ''} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="completed" name="Day Status" barSize={20}>
                                    {data.active_habit_progress.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.completed ? "#10B981" : "#e5e7eb"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center">
                            <p className="text-gray-500">No active quest. Start a new journey!</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
  };
  
  const tabContent = {
    Overview: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mood vs Productivity ({viewMode})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" stroke="#8884d8" domain={[-1, 1]} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="right" dataKey="Productivity Score" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="Mood Score" stroke="#8884d8" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Emotion Distribution ({viewMode})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={emotionDataForDisplay} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedPieLabel}>
                  {emotionDataForDisplay.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Mood-Productivity Correlation</h2>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: correlationInsight.gradient }}>
              {correlationInsight.coefficient.toFixed(2)}
            </div>
            <p className="text-gray-600 text-lg font-medium">{correlationInsight.strength.replace(/_/g, ' ')}</p>
          </div>
          {data.correlation_details && (
            <div className="max-w-md mx-auto space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-gray-100/50 rounded-lg"><span>Sample Size:</span><span className="font-semibold">{data.correlation_details.sample_size} days</span></div>
              <div className="flex justify-between p-3 bg-gray-100/50 rounded-lg"><span>P-Value:</span><span className="font-semibold">{data.correlation_details.p_value?.toFixed(4)}</span></div>
              <div className="flex justify-between p-3 bg-gray-100/50 rounded-lg items-center">
                <span>Statistically Significant:</span>
                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${data.correlation_details.significant ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {data.correlation_details.significant ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    ),
    Productivity: <ProductivityTabContent />,
    Habits: <HabitTabContent />,
    Patterns: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Emotion Consistency</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={emotionConsistencyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emotion" />
                <Radar name="This Week" dataKey="This Week" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="This Month" dataKey="This Month" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Task Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap data={taskTypeTreemapData} dataKey="size" ratio={4/3} stroke="#fff" content={<CustomizedTreemapContent />} />
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    ),
    Growth: (
      <div className="space-y-8">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Monthly Productivity Growth</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="growth" name="Avg. Productivity" stroke="#10B981" strokeWidth={3} fill="url(#growthGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    ),
    "AI Insights": (
      <Card>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">AI-Powered Personal Insights</h2>
        <div className="space-y-4">
          {data.ai_insights?.length > 0 ? data.ai_insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-purple-800 leading-relaxed">{insight}</p>
            </div>
          )) : <p className="text-gray-500">Not enough data for AI insights yet. Keep tracking!</p>}
        </div>
      </Card>
    ),
  };

  const emotionEntries = Object.entries(viewMode === "Weekly" ? data.all_emotions_weekly : data.all_emotions_monthly);
  const mostFrequentEmotion = emotionEntries.length > 0 ? emotionEntries.reduce((a, b) => a[1] > b[1] ? a : b, ["N/A", 0])[0] : 'N/A';
  const prodArr = viewMode === "Weekly" ? data.productivity_trend_weekly : data.productivity_trend_monthly;
  const labels = viewMode === "Weekly" ? data.labels_weekly : data.labels_monthly;
  const maxProd = prodArr.length > 0 ? Math.max(...prodArr) : 0;
  const bestProductivityDay = prodArr.indexOf(maxProd) !== -1 ? labels[prodArr.indexOf(maxProd)] : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9fc] to-[#e6e6fa]">
      <style>{`
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-borderFlow { background: linear-gradient(120deg, #a78bfa, #c084fc, #8b5cf6); background-size: 300% 300%; animation: gradientMove 6s ease-in-out infinite; filter: brightness(1.1); }
        @keyframes slide-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
      `}</style>
      <MainNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#796fc1] text-center sm:text-left">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            {["Weekly", "Monthly"].map(mode => (
              <button key={mode} onClick={() => {setViewMode(mode);toast(`📊 Switched to ${mode} view`);
              startChimeRef.current?.play();
      }}  className={`px-4 py-2 sm:px-6 rounded-full font-semibold transition-all duration-300 border-b-4 ${viewMode === mode ? "bg-[#796fc1] text-white shadow-lg transform scale-105 border-[#a78bfa]" : "bg-white text-[#796fc1] hover:bg-[#f3e8ff] border-transparent"}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold text-[#796fc1] mb-4">🔍 Key Insights ({viewMode})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-2">
                <div className="text-2xl font-bold text-[#796fc1] capitalize">{mostFrequentEmotion}</div>
                <div className="text-[#a78bfa] text-sm">Most Frequent Emotion</div>
              </div>
              <div className="text-center p-2">
                <div className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: correlationInsight.gradient }}>{correlationInsight.coefficient.toFixed(2)}</div>
                <div className="text-[#a78bfa] text-sm">Mood-Productivity Link</div>
              </div>
              <div className="text-center p-2">
                <div className="text-2xl font-bold text-green-600">{bestProductivityDay}</div>
                <div className="text-[#a78bfa] text-sm">Peak Productivity Day</div>
              </div>
            </div>
          </Card>
        </div>
        <Tabs tabs={tabContent} />
      </main>
    </div>
  );
};

function getCorrelationInsight(details) {
  const score = details?.coefficient || 0;
  const absScore = Math.abs(score);
  let gradient = 'linear-gradient(to right, #9CA3AF, #64748B)';
  if (details?.strength !== 'insufficient_data') {
    if (score > 0) {
      if (absScore >= 0.7) gradient = 'linear-gradient(to right, #34D399, #10B981)';
      else if (absScore >= 0.4) gradient = 'linear-gradient(to right, #6EE7B7, #34D399)';
      else if (absScore >= 0.2) gradient = 'linear-gradient(to right, #A7F3D0, #6EE7B7)';
    } else {
      if (absScore >= 0.7) gradient = 'linear-gradient(to right, #F87171, #EF4444)';
      else if (absScore >= 0.4) gradient = 'linear-gradient(to right, #FBBF24, #F59E0B)';
      else if (absScore >= 0.2) gradient = 'linear-gradient(to right, #FDE68A, #FBBF24)';
    }
  }
  return { ...details, gradient };
}

export default AnalysisPage;