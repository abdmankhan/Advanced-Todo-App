import { create } from "zustand";
import axios from "axios";

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
      console.log(res.data);
      set({ user: res.data.user }); // Store user data
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
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
      console.log(res.data);
      set({ user: res.data.user });
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
