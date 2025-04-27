import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useAuthStore = create((set) => ({
  user: null, // Stores the logged-in user
  isLoading: true, // Tracks loading state

  // Login function
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Sends & receives cookies
      );
      // toast.success("Login successful");
      console.log(res.data);
      
      set({ user: res.data.user }); // Store user data
    } catch (error) {
    //   const errorMessage = error.response?.data?.message || "Login failed";
    //   console.error("Login failed:", errorMessage);
      throw error; // Rethrow error for component to catch
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout function
  logout: async () => {
    await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    set({ user: null }); // Clear user data
  },

  // Fetch user from backend (for checking session persistence)
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/api/auth/getProfile`, {
        withCredentials: true, // Ensures JWT cookie is sent
      });
      // console.log(res.data);
      set({ user: res.data.user }); // Store user if authenticated
    } catch (error) {
      set({ user: null }); // Clear user if JWT is invalid
    } finally {
      set({ isLoading: false });
    }
  },

  // Signup function
  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      // console.log(res.data);
      set({ user: res.data.user });
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
  // Google login function
  googleLogin: async (token) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/google`,
        { token },
        { withCredentials: true }
      );
      console.log('Iske baad hain...');
      set({ user: res.data.user });
    } catch (error) {
      console.error("Google login failed:", error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
  // forgot - password fuction
  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success("Check your email for reset link");
    } catch (error) {
      console.error("Forgot password failed:", error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
  // reset - password function
  resetPassword: async (token, password) => {
    console.log("New Password is", password);
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { token, password },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success("Password reset successful");
    } catch (error) {
      console.error("Reset password failed:", error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
