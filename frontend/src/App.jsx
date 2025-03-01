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


function PrivateRoute({element}){
  const user = useAuthStore((state) => state.user);
  return user ? element : <Navigate to="/login" />;
}


function App() {
  const {user, fetchUser} = useAuthStore();

  useEffect(()=>{
    fetchUser();
  }, [])
  
  
  return (
    <BrowserRouter>
      <Routes>
        {/* If logged in, redirect to dashboard, else show home */}
        <Route
          path="/"
          element={user ? <Navigate to="/app" /> : <Home />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes */}
        <Route
          path="/app"
          element={<PrivateRoute element={<Apps />} />}
        />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
