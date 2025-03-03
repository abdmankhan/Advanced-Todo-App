import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore"; // Import the store
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Apps from "./pages/Apps";
import Navbar from "./components/Navbar.jsx";
import TaskList from "./pages/TaskList.jsx";
import AddTask from "./pages/AddTask.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import EditTask from "./pages/EditTask.jsx";
import TaskListCompleted from "./pages/TaskListCompleted.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ element }) {
  const user = useAuthStore((state) => state.user);
  return user ? element : <Navigate to="/login" />;
}

function App() {
  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* If logged in, redirect to dashboard, else show home */}
          <Route path="/" element={user ? <Navigate to="/app" /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected Routes */}
          <Route path="/app" element={<PrivateRoute element={<Apps />} />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route
            path="/app/tasks/"
            element={<PrivateRoute element={<TaskList />} />}
          />
          <Route
            path="/app/add-task"
            element={<PrivateRoute element={<AddTask />} />}
          />
          <Route
            path="/app/task/:id"
            element={<PrivateRoute element={<TaskDetails />} />}
          />
          <Route
            path="/app/edit-task/:id"
            element={<PrivateRoute element={<EditTask />} />}
          />
          <Route
            path="/app/tasks-completed"
            element={<PrivateRoute element={<TaskListCompleted />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
