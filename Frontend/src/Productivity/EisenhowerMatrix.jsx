import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

const quadrants = [
  { id: "1", title: "DO THIS", color: "bg-blue-100" },
  { id: "2", title: "DECIDE THIS", color: "bg-green-100" },
  { id: "3", title: "DELEGATE THIS", color: "bg-orange-100" },
  { id: "4", title: "DELETE THIS", color: "bg-red-100" },
];

const motivationalQuotes = [
  "\"Small steps every day lead to big results.\"",
  "\"Your only limit is your mind.\"",
  "\"Push yourself, because no one else is going to do it for you.\"",
  "\"Dream it. Wish it. Do it.\"",
  "\"Success doesn't come from what you do occasionally. It comes from what you do consistently.\"",
  "\"Stay focused and never give up.\"",
  "\"You don’t have to be extreme, just consistent.\"",
  "\"Believe in yourself and all that you are.\"",
  "\"Discipline is the bridge between goals and accomplishment.\"",
  "\"Your future is created by what you do today, not tomorrow.\"",
  "\"Doubt kills more dreams than failure ever will.\"",
  "\"Don’t watch the clock; do what it does. Keep going.\"",
  "\"The secret of getting ahead is getting started.\"",
  "\"Hard work beats talent when talent doesn’t work hard.\"",
  "\"You are capable of amazing things.\"",
  "\"Start where you are. Use what you have. Do what you can.\"",
  "\"Success is not for the lazy.\"",
  "\"Make today count.\"",
  "\"Your time is now.\"",
  "\"Progress, not perfection.\"",
  "\"Success is the sum of small efforts repeated day in and day out.\"",
  "\"The only way to do great work is to love what you do.\"",
  "\"Be stronger than your excuses.\"",
  "\"Every accomplishment starts with the decision to try.\"",
  "\"Don’t wait for opportunity. Create it.\"",
  "\"Don’t stop until you’re proud.\"",
  "\"Push yourself because no one else is going to do it for you.\"",
  "\"Your only limit is you.\"",
  "\"You can do anything, but not everything.\"",
  "\"It always seems impossible until it’s done.\"",
  "\"Winners are not afraid of losing.\"",
  "\"Stay positive, work hard, make it happen.\"",
  "\"You didn’t come this far to only come this far.\"",
  "\"Be so good they can’t ignore you.\"",
  "\"Do something today that your future self will thank you for.\"",
  "\"You are your only limit.\"",
  "\"Success starts with self-discipline.\"",
  "\"A little progress each day adds up to big results.\"",
  "\"Keep going. Everything you need will come to you at the perfect time.\"",
  "\"Don’t be afraid to give up the good to go for the great.\"",
];

const EisenhowerMatrix = () => {
  const [tasks, setTasks] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [newTask, setNewTask] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("1");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState({ h: "", m: "0" });
  const [quote, setQuote] = useState("");
  const [showTookModal, setShowTookModal] = useState(false);
  const [tookTime, setTookTime] = useState({ h: "", m: "0" });
  const [currentToggledTask, setCurrentToggledTask] = useState({ id: null, index: null });

  useEffect(() => {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[random]);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/productivity/");
      const data = await res.json();
      const grouped = { 1: [], 2: [], 3: [], 4: [] };
      data.forEach((task) => {
        const qid = getQuadrantId(task.type_of_task);
        grouped[qid].push({
          id: task.id,
          text: task.task,
          time: formatDuration(task.ideal_time),
          completed: task.status,
          took: task.taken_time !== "PT0H0M" ? formatDuration(task.taken_time) : null,
        });
      });
      setTasks(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const getQuadrantId = (type) => {
    switch (type) {
      case "DO": return "1";
      case "DECIDE": return "2";
      case "DELEGATE": return "3";
      case "DELETE": return "4";
      default: return "1";
    }
  };

  const getTypeLabel = (id) => {
    switch (id) {
      case "1": return "DO";
      case "2": return "DECIDE";
      case "3": return "DELEGATE";
      case "4": return "DELETE";
      default: return "DO";
    }
  };

  const formatDuration = (iso) => {
    const match = iso.match(/PT(\d+)H(\d+)M/);
    if (match) {
      const [, h, m] = match;
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }
    return "00:00";
  };

  const isTimeValid = () => tempTime.h !== "" && tempTime.m !== "";

  const addTask = async () => {
    if (!newTask.trim()) return alert("Please enter a task.");
    const { h, m } = tempTime;
    if ((h === "0" || h === "") && (m === "0" || m === ""))
      return alert("Please set a time greater than 0.");

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];


    const payload = {
      user: sessionStorage.getItem("userid"), // 🟢 TODO: replace with logged-in user ID
      task: newTask,
      type_of_task: getTypeLabel(selectedQuadrant),
      ideal_time: `PT${parseInt(h)}H${parseInt(m)}M`,
      taken_time: "PT0H0M",
      status: false,
      date: formattedDate,
     
      score: 0,
      reflection: ""
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/productivity/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to add task.");

      const data = await response.json();
      console.log("DATA FROM BACKEND:", data);

      setTasks((prev) => ({
        ...prev,
        [selectedQuadrant]: [
          ...prev[selectedQuadrant],
          {
            id: data.id,
            text: newTask,
            time: formatDuration(payload.ideal_time),
            completed: false,
            took: null,
          },
        ],
      }));
      setNewTask("");
      setTempTime({ h: "", m: "0" });
      setShowTimeModal(false);
    } catch (err) {
      console.error(err);
      alert("Error adding task.");
    }
  };

  const deleteTask = async (id, index) => {
    const task = tasks[id][index];
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${task.id}/`, { method: "DELETE" });
      const updated = tasks[id].filter((_, i) => i !== index);
      setTasks({ ...tasks, [id]: updated });
    } catch (err) {
      console.error(err);
      alert("Error deleting task.");
    }
  };

  const toggleTask = (id, index) => {
    const task = tasks[id][index];
    if (!task.completed) {
      setCurrentToggledTask({ id, index });
      setShowTookModal(true);
    } else {
      updateTaskStatus(task.id, false, "PT0H0M");
      const updated = [...tasks[id]];
      updated[index].completed = false;
      updated[index].took = null;
      setTasks({ ...tasks, [id]: updated });
    }
  };

  const updateTaskStatus = async (taskId, status, tookDuration) => {
    const payload = { status: status, taken_time: tookDuration };
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${taskId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const confirmTookTime = async () => {
    const { h, m } = tookTime;
    if (!h || !m) return alert("Please enter full completion time.");

    const tookDuration = `PT${parseInt(h)}H${parseInt(m)}M`;
    const { id, index } = currentToggledTask;
    const task = tasks[id][index];

    await updateTaskStatus(task.id, true, tookDuration);

    const updated = [...tasks[id]];
    updated[index].completed = true;
    updated[index].took = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    setTasks({ ...tasks, [id]: updated });
    setTookTime({ h: "", m: "0" });
    setShowTookModal(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcId = source.droppableId;
    const destId = destination.droppableId;
    const sourceTasks = [...tasks[srcId]];
    const [removed] = sourceTasks.splice(source.index, 1);

    if (srcId === destId) {
      sourceTasks.splice(destination.index, 0, removed);
      setTasks({ ...tasks, [srcId]: sourceTasks });
    } else {
      const destTasks = [...tasks[destId]];
      destTasks.splice(destination.index, 0, removed);
      setTasks({
        ...tasks,
        [srcId]: sourceTasks,
        [destId]: destTasks,
      });
    }
  };

  // Your full return stays SAME — unchanged styles
  return (
    <div className="flex flex-col items-center justify-center px-4 font-mono mt-1/8 bg-white min-h-screen relative"
      style={{ backgroundColor: "#838beb/50" }}>
      <h1 className="text-3xl mb-2 font-bold">TO-DO List</h1>
      <p className="text-sm text-gray-600 italic mb-4">{quote}</p>

      {/* Input Area */}
      <div className="flex flex-wrap gap-2 w-full max-w-4xl mb-8 items-center relative">
        <input
          type="text"
          placeholder="Add task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        <div className="relative">
          <button
            onClick={() => setShowTimeModal((prev) => !prev)}
            className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
          >
            🕒 Set Time
          </button>

          {showTimeModal && (
            <div className="absolute top-full mt-1 left-0 z-10 bg-white border p-4 rounded shadow-md">
              <h3 className="text-sm font-semibold mb-2">Set Time (HH:MM)</h3>
              <div className="flex gap-2 items-center">
                {["h", "m"].map((unit) => (
                  <input
                    key={unit}
                    type="number"
                    placeholder={unit.toUpperCase()}
                    min="0"
                    max={unit === "h" ? "23" : "59"}
                    value={tempTime[unit]}
                    onChange={(e) =>
                      setTempTime({ ...tempTime, [unit]: e.target.value })
                    }
                    className="w-12 border rounded px-1"
                  />
                ))}
                <button
                  onClick={() => {
                    if (!isTimeValid()) return alert("Please enter full time.");
                    setShowTimeModal(false);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Set
                </button>
              </div>
            </div>
          )}
        </div>

        <select
          value={selectedQuadrant}
          onChange={(e) => setSelectedQuadrant(e.target.value)}
          className="border p-2 rounded"
        >
          {quadrants.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>

        <button
          onClick={addTask}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Axis Labels */}
      <div className="relative max-w-5xl w-full mt-10">
        <div className="hidden md:flex absolute top-[-4.5rem] left-0 right-0 justify-center text-sm font-semibold mt-6">
          <div className="flex justify-around w-full max-w-4xl">
            <div className="bg-gray-200 p-2 rounded-md w-1/2 text-center mr-2">
              Urgent
            </div>
            <div className="bg-gray-200 p-2 rounded-md w-1/2 text-center ml-2">
              Not Urgent
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute top-0 bottom-0 left-0 flex-col justify-between text-sm font-semibold h-full py-1 translate-x-[-3rem]">
          <div className="bg-gray-200 p-2 py-2 rounded-md transform -rotate-90 origin-top-left whitespace-nowrap mt-44 text-center px-12">
            Important
          </div>
          <div className="bg-gray-200 p-2 rounded-md transform -rotate-90 origin-top-left py-2 whitespace-nowrap mt-48 text-center px-12">
            Not Important
          </div>
        </div>

        {/* Task Grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
            {quadrants.map((q) => (
              <Droppable droppableId={q.id} key={q.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 border ${q.color} flex flex-col h-[200px] rounded-lg`}
                  >
                    <h2 className="text-xl font-bold mb-2">{q.title}</h2>
                    <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
                      <ul className="flex flex-col gap-1">
                        {tasks[q.id].map((task, index) => (
                          <Draggable
                            key={`${q.id}-${index}`}
                            draggableId={`${q.id}-${index}`}
                            index={index}
                          >
                            {(provided) => (
                             <li
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className="relative flex items-center bg-white p-2 rounded shadow-sm text-sm"
>
  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => toggleTask(q.id, index)}
  />
  <span className={`ml-2 ${task.completed ? "line-through text-gray-500" : ""}`}>
    {task.text}
  </span>
  <span className="text-xs text-gray-600 ml-2">⏰ {task.time}</span>
  {task.completed && task.took && (
    <span className="text-xs text-gray-600 ml-2">
      🕓 Took: {task.took}
    </span>
  )}
  <button
    onClick={() => deleteTask(q.id, index)}
    className="ml-auto text-red-600 font-bold"
  >
    ✕
  </button>
</li>

                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal for Took Time */}
      {showTookModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">How long did it take?</h3>
            <div className="flex gap-2 items-center mb-4 center">
              {["h", "m"].map((unit) => (
                <input
                  key={unit}
                  type="number"
                  placeholder={unit.toUpperCase()}
                  min="0"
                  max={unit === "h" ? "23" : "59"}
                  value={tookTime[unit]}
                  onChange={(e) =>
                    setTookTime({ ...tookTime, [unit]: e.target.value })
                  }
                  className="w-12 border rounded px-1"
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setTookTime({ h: "", m: "" });
                  setShowTookModal(false);
                }}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmTookTime}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EisenhowerMatrix;
