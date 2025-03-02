import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, {
        withCredentials: true,
      });
      const incompleteTasks = response.data.filter((task) => !task.completed);
      setTasks(incompleteTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const markAsCompleted = async (taskId) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${taskId}`,
        { completed: true },
        {
          withCredentials: true,
        }
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };


  // Add a new function to delete a task
  const handleDelete = async (taskId) => {
    
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        withCredentials: true,
      });

      // console.log("Deleted task ID:", taskId); // Verify correct ID is sent
      toast.success("Task deleted successfully");

      // Update state by filtering out the deleted task
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task._id !== taskId);
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };


  return (
    <div>
      <h2>All Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: task.completed ? "#d4edda" : "#f8d7da",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => markAsCompleted(task._id)}
              
            />{" "}
            Completed
            <br />
            <Link to={`/app/task/${task._id}`}>View | </Link>
            <Link to={`/app/edit-task/${task._id}`}> Edit | </Link>
            <button onClick={() => handleDelete(task._id)}> Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
