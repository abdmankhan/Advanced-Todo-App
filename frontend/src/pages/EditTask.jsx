import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks/${id}`, {
          withCredentials: true,
        });
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        { title, description },
        { withCredentials: true }
      );
      toast.success("Task updated successfully!");
      navigate("/app/tasks"); // Redirect after update
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <form onSubmit={handleUpdateTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
