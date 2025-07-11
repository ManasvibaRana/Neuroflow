import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const PendingTasks = () => {
  const [tasks, setTasks] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [showTookModal, setShowTookModal] = useState(false);
  const [tookTime, setTookTime] = useState({ h: "", m: "0" });
  const [currentToggledTask, setCurrentToggledTask] = useState({ id: null, index: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const fetchPendingTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/productivity/?pending=true&user=Manu");
      const data = await res.json();
      console.log("Fetched pending tasks:", data);

      const today = new Date().toISOString().split("T")[0];
      const grouped = { 1: [], 2: [], 3: [], 4: [] };

      data.forEach((task) => {
        if (!task.status && task.date < today) {
          const qid = getQuadrantId(task.type_of_task);
          grouped[qid].push({
            id: task.id,
            text: task.task,
            date: task.date,
            time: formatDuration(task.ideal_time),
            completed: false,
          });
        }
      });

      const totalTasks = Object.values(grouped).flat().length;
      if (totalTasks === 0) {
        navigate("/productivity");
        return;
      }

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

  const toggleTask = (id, index) => {
    setCurrentToggledTask({ id, index });
    setShowTookModal(true);
  };

  const updateTaskStatus = async (taskId, tookDuration) => {
    const payload = { status: true, taken_time: tookDuration };
    try {
      await fetch(`http://127.0.0.1:8000/productivity/${taskId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const confirmTookTime = async () => {
    const { h, m } = tookTime;
    if ((!h || !m) || (h<=0 && m<=0)) {
      alert("Please enter time.");
      return;
    }
    const tookDuration = `PT${parseInt(h)}H${parseInt(m)}M`;
    const { id, index } = currentToggledTask;

    // Mark as done in DB
    await updateTaskStatus(tasks[id][index].id, tookDuration);

    // Mark as done visually
    const updated = [...tasks[id]];
    updated[index].completed = true;
    setTasks({ ...tasks, [id]: updated });

    // Wait 3 sec → then remove
    setTimeout(() => {
      const removed = [...updated];
      removed.splice(index, 1);
      const newTasks = { ...tasks, [id]: removed };
      setTasks(newTasks);

      const totalLeft = Object.values(newTasks).flat().length;
      if (totalLeft === 0) {
        navigate("/productivity");
      }
    }, 3000);

    setShowTookModal(false);
    setTookTime({ h: "", m: "0" });
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>

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
                                onChange={() =>
                                  !task.completed && toggleTask(q.id, index)
                                }
                              />
                              <span
                                className={`ml-2 ${
                                  task.completed ? "line-through text-gray-500" : ""
                                }`}
                              >
                                {task.text}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({task.date})
                              </span>
                              <span className="text-xs text-gray-600 ml-2">
                                ⏰ {task.time}
                              </span>
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
        <div className="fixed inset-0 flex justify-center items-center z-50">
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
                onClick={() => setShowTookModal(false)}
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

export default PendingTasks;
