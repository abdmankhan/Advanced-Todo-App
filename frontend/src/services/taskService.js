// src/services/taskService.js
import axios, { Axios } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL; // Update with your backend URL

const createTask = async (taskData) => {
  
  return response.data;
};

const getTasks = async () => {
  console.log('Fetching tasks Before axios.post');
  
  const response = await axios.get(`${API_URL}/api/tasks`, {
    withCredentials: true,
  });
  console.log(response);
  return response.data;
};

const getTaskById = async (taskId) => {
  const response = await axios.get(`${API_URL}/${taskId}`);
  return response.data;
};

const updateTask = async (taskId, taskData) => {
  const response = await axios.put(`${API_URL}/${taskId}`, taskData);
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`);
  return response.data;
};

export default {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
