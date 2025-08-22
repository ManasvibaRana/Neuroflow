import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

// This is the view-only version of your Eisenhower Matrix.
// It takes the grouped tasks and total score as props and just displays them.
const ProductivityMatrixView = ({ tasks, totalScore, date }) => {
  const quadrants = [
    { id: "1", title: "Do (Urgent & Important)", color: "bg-blue-100" },
    { id: "2", title: "Decide (Important, Not Urgent)", color: "bg-green-100" },
    { id: "3", title: "Delegate (Urgent, Not Important)", color: "bg-orange-100" },
    { id: "4", title: "Delete (Not Urgent & Not Important)", color: "bg-red-100" },
  ];

  return (
    <ProductivityCard>
      <CardHeader>
        <h3>
          {new Date(date).toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          })}
        </h3>
        <p className="text-lg font-bold text-green-700 mt-2">
          ✅ Average Score: {totalScore}%
        </p>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => (
          <div key={q.id} className={`p-4 rounded-lg ${q.color} flex flex-col h-[250px]`}>
            <h2 className="text-lg font-bold mb-2 text-gray-700">{q.title}</h2>
            <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
              <ul className="flex flex-col gap-2">
                {tasks[q.id] && tasks[q.id].map((task, index) => (
                  <li key={index} className="flex items-center bg-white p-2 rounded shadow-sm text-sm">
                    <span className={`mr-2 ${task.completed ? 'text-green-500' : 'text-gray-400'}`}>
                      {task.completed ? '✓' : '○'}
                    </span>
                    <span className={`${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.text}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto whitespace-nowrap pl-2">
                      {task.completed ? `(Took: ${task.took})` : `(Ideal: ${task.time})`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </ProductivityCard>
  );
};


// This is the main page component that fetches the data.
const ProductivityHistory = () => {
  const [tasks, setTasks] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [totalScore, setTotalScore] = useState(0);
  const [logDate, setLogDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState("Select a date to see your productivity log.");
  
  // Helper function to group tasks fetched from the backend
  const groupTasks = (fetchedTasks) => {
    const grouped = { 1: [], 2: [], 3: [], 4: [] };
    const getQuadrantId = (type) => {
      switch (type) {
        case "DO": return "1";
        case "DECIDE": return "2";
        case "DELEGATE": return "3";
        case "DELETE": return "4";
        default: return "1";
      }
    };
    const formatDuration = (iso) => {
        if (!iso) return "00:00";
        const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        if (match) {
          const h = match[1] ? match[1] : "0";
          const m = match[2] ? match[2] : "0";
          return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
        }
        return "00:00";
    };

    fetchedTasks.forEach((task) => {
      const qid = getQuadrantId(task.type_of_task);
      grouped[qid].push({
        id: task.id,
        text: task.task,
        time: formatDuration(task.ideal_time),
        completed: task.status,
        took: task.taken_time !== "PT0H0M" ? formatDuration(task.taken_time) : null,
        score: task.score,
      });
    });
    return grouped;
  };

  useEffect(() => {
    fetchProductivityForDate(selectedDate);
  }, [selectedDate]);

  const fetchProductivityForDate = (date) => {
    const token = sessionStorage.getItem("token");
    const userid = sessionStorage.getItem("userid");

    if (token && userid) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setTasks({ 1: [], 2: [], 3: [], 4: [] }); // Reset state
      setTotalScore(0);
      setLogDate("");
      setMessage("Loading...");

      axios
        .get(`http://localhost:8000/productivity/history/${userid}/${formattedDate}/`, {
           headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const data = res.data;
          if (data.message || !data.tasks || data.tasks.length === 0) {
            setMessage(data.message || "No productivity log found for this date.");
          } else {
            setLogDate(data.date);
            const groupedTasks = groupTasks(data.tasks);
            setTasks(groupedTasks);

            const completedTasks = data.tasks.filter((t) => t.status);
            const total = completedTasks.length > 0
                ? completedTasks.reduce((sum, task) => sum + (task.score || 0), 0) / completedTasks.length
                : 0;
            setTotalScore(Math.round(total));
            setMessage("");
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.status === 404) {
            setMessage("No productivity log found for this date.");
          } else {
            setMessage("Error fetching data. Please try again.");
          }
        });
    } else {
        setMessage("Please log in to view your history.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
        <CalendarWrapper>
          <h2 className="text-xl font-semibold text-center mb-4">Productivity History</h2>
          <Calendar onChange={setSelectedDate} value={selectedDate} maxDate={new Date()} />
        </CalendarWrapper>

        <DisplayWrapper>
          {message && <Message>{message}</Message>}
          {!message && <ProductivityMatrixView tasks={tasks} totalScore={totalScore} date={logDate} />}
        </DisplayWrapper>
    </div>
  );
};

export default ProductivityHistory;

// --- STYLED COMPONENTS ---

const CalendarWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
`;

const DisplayWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const ProductivityCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
  h3 { margin: 0; color: #333; font-weight: 600; }
`;

const Message = styled.p`
  text-align: center;
  font-size: 18px;
  color: #777;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;