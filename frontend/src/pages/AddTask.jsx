import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000";

const AddTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        { title, description },
        { withCredentials: true }
      );
      toast.success("Task created successfully!");
      navigate("/app/tasks"); // Redirect to tasks page
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default AddTask;
