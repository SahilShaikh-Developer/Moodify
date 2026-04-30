import { create } from "zustand";
import { getMeAPI, loginAPI } from "../api/auth.api";

const useAuthStoreLogin = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  login: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await loginAPI(formData);
      set({ user: response.user, loading: false });
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Login failed", 
        loading: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ checkingAuth: true });
      const data = await getMeAPI();
      set({ user: data.user, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },
}));

export default useAuthStoreLogin;
