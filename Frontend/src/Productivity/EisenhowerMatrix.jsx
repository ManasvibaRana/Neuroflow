import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { toast } from "sonner";
import useSound from "use-sound";
import useChimes from "../usechimes";

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
  const [showPendingButton, setShowPendingButton] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const { startChimeRef, successChimeRef, errorChimeRef } = useChimes();

  const navigate = useNavigate();

  useEffect(() => {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[random]);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const userid = sessionStorage.getItem("userid");
      if (!userid) {
        console.error("No userid found in sessionStorage");
        return;
      }

      const res = await fetch(`http://127.0.0.1:8000/productivity/?user=${userid}`);
      const data = await res.json();
      console.log("Fetched tasks:", data);

      const grouped = { 1: [], 2: [], 3: [], 4: [] };
      const today = new Date().toISOString().split("T")[0];
      let hasPending = false;

      data.forEach((task) => {
        const qid = getQuadrantId(task.type_of_task);

        if (task.date === today) {
          grouped[qid].push({
            id: task.id,
            text: task.task,
            time: formatDuration(task.ideal_time),
            completed: task.status,
            took: task.taken_time !== "PT0H0M" ? formatDuration(task.taken_time) : null,
            score: task.score,
          });
        }

        if (!task.status && task.date < today) {
          hasPending = true;
        }
      });

      const completedTasks = Object.values(grouped)
        .flat()
        .filter((t) => t.completed);
      const total =
        completedTasks.length > 0
          ? completedTasks.reduce((sum, task) => sum + (task.score || 0), 0) /
            completedTasks.length
          : 0;
      setTotalScore(Math.round(total));
      setTasks(grouped);
      setShowPendingButton(hasPending);
    } catch (err) {
      toast.error("❌ Failed to fetch tasks.");
      errorChimeRef.current?.play();
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
    if (!iso) return "00:00";
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const h = match[1] ? match[1] : "0";
      const m = match[2] ? match[2] : "0";
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }
    return "00:00";
  };

  const isTimeValid = () => tempTime.h !== "" && tempTime.m !== "";

  const addTask = async () => {
   if (!newTask.trim()) {
      errorChimeRef.current?.play();
      toast.warning("Please enter a task.");
      return;
    }
    const { h, m } = tempTime;
    if ((h === "0" || h === "") && (m === "0" || m === "")) {
      errorChimeRef.current?.play(); 
      toast.warning("⏰ Please set a time greater than 0.");
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const payload = {
      user: sessionStorage.getItem("userid"),
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

      toast.success("🎯 Task added successfully!");
      startChimeRef.current?.play();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding task.");
      errorChimeRef.current?.play();
    }
  };


  const deleteTask = async (id, index) => {
    const task = tasks[id][index];
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${task.id}/`, { method: "DELETE" });
      const updated = tasks[id].filter((_, i) => i !== index);
      setTasks({ ...tasks, [id]: updated });
      toast.success("🗑️ Task deleted!");
      successChimeRef.current?.play();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error deleting task.");
      errorChimeRef.current?.play();
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
      toast("📝 Task marked incomplete.");
      startChimeRef.current?.play();
      fetchTasks();
    }
  };

  const updateTaskStatus = async (taskId, status, tookDuration) => {
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          taken_time: tookDuration,
        }),
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating task status.");
      errorChimeRef.current?.play();
    }
  };

  const confirmTookTime = async () => {
    const { h, m } = tookTime;
    if ((!h || !m) || (h <= 0 && m <= 0)) {
      errorChimeRef.current?.play()
      toast.warning("⏱️ Please enter full completion time.");
      return;
    }

    const tookDuration = `PT${parseInt(h)}H${parseInt(m)}M`;
    const { id, index } = currentToggledTask;
    const task = tasks[id][index];

    try {
      await updateTaskStatus(task.id, true, tookDuration);
      successChimeRef.current?.play();
      toast.success("Task marked completed with score: ");
      fetchTasks();
    } catch (err) {
      toast.error("❌ Failed to update task.");
      errorChimeRef.current?.play();
    }

    setTookTime({ h: "", m: "0" });
    setShowTookModal(false);
  };

  const updateTaskQuadrant = async (taskId, newQuadrantId) => {
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${taskId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type_of_task: getTypeLabel(newQuadrantId),
        }),
      });
    } catch (err) {
      console.error("Error updating quadrant:", err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcId = source.droppableId;
    const destId = destination.droppableId;
    const sourceTasks = [...tasks[srcId]];
    const [removed] = sourceTasks.splice(source.index, 1);

    if (removed.completed) return;

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
      await updateTaskQuadrant(removed.id, destId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 font-mono bg-white min-h-screen relative">
      <h1 className="text-3xl mb-2 font-bold">TO-DO List</h1>
      <p className="text-lg font-bold text-green-700 mb-2">
        ✅ Total Score: {totalScore}%
      </p>
      <p className="text-sm text-gray-600 italic mb-4">{quote}</p>

      <div className="flex flex-wrap gap-2 w-full max-w-4xl mb-8 items-center">
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
            className="bg-gray-200 px-2 py-1 rounded"
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
                    if (!isTimeValid()) return toast.error("Please enter full time.");
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

      {showPendingButton && (
        <button
          onClick={() => navigate("/pending-tasks")}
          className="fixed top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg z-50"
        >
          View Pending Tasks
        </button>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
          {quadrants.map((q) => (
            <Droppable key={q.id} droppableId={q.id}>
              {(provided) => (
                                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 border ${q.color} flex flex-col h-[250px] rounded-lg`}
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
                              {task.completed && task.took && (
                                <span className="text-xs text-gray-600 ml-2">
                                  🕓 Took: {task.took}
                                </span>
                              )}
                              <span className="text-xs text-gray-600 ml-2">
                                ⏰ {task.time}
                              </span>
                              {task.completed && (
                                <span className="text-xs text-green-700 ml-2">
                                  ✅ Score: {task.score}%
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

      {showTookModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">How long did it take?</h3>
            <div className="flex gap-2 items-center mb-4">
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
                  setTookTime({ h: "", m: "0" });
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

