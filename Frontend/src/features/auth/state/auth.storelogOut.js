import { create } from "zustand";
import { logOutAPI } from "../api/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  logout: async () => {
    try {
      set({ loading: true });
      await logOutAPI();
      set({ user: null });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore
