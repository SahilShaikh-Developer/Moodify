import { create } from "zustand";
import { getMeAPI, loginAPI } from "../api/auth.api";

const useAuthStoreLogin = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  login: async (formData) => {
    try {
      set({ loading: true });
      const data = await loginAPI(formData);

      set({
        user: data.user,
        loading: false,
        });
      return { success: true, message: data.message };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  checkAuth: async () => {
    try {
      const data = await getMeAPI();
      set({ user: data.user, checkingAuth: false });
    } catch (error) {
      if(error.response?.status === 401){
        set({ user: null, checkingAuth: false });
      }else{
        console.error("Auth check failed:", error)
        set({ user: null, checkingAuth: false });
      }
      
      
    }
  },
}));

export default useAuthStoreLogin;
