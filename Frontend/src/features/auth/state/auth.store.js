import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  setLoading: (value) => set({ loading: value }),
}));

export default useAuthStore;
