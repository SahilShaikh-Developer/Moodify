import { create } from "zustand";
import { fetchSongsByMood, uploadSong, deleteSongApi } from "../api/song.api";

export const useSongStore = create((set, get) => ({
  songs: [],
  currentSong: null,
  currentIndex: 0,
  loading: false,
  error: null,
  capturedMood: null,
  setCapturedMood: (mood) => set({ capturedMood: mood }),

  getSongs: async (mood) => {
    try {
      set({ loading: true, error: null });
      const response = await fetchSongsByMood(mood);
      const songsArray = response.song;
      set({
        songs: songsArray,
        currentSong: songsArray[0] || null,
        currentIndex: 0,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong",
        loading: false,
      });
    }
  },

  setCurrentSong: (song) => {
    set({ currentSong: song });
  },

  nextSong: () => {
    const { songs, currentIndex } = get();
    if (!songs.length) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    set({ currentIndex: nextIndex, currentSong: songs[nextIndex] });
  },

  prevSong: () => {
    const { songs, currentIndex } = get();
    if (!songs.length) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    set({ currentIndex: prevIndex, currentSong: songs[prevIndex] });
  },

  deleteSong: async (id) => {
    try {
      await deleteSongApi(id);
      set((state) => ({
        songs: state.songs.filter((s) => s._id !== id),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Delete failed" });
    }
  },

  uploadSong: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await uploadSong(formData);
      set((state) => ({
        songs: [...state.songs, response.song],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Upload failed",
      });
    }
  },

  toggleFavourite: async (id) => {
    try {
      const { toggleFavouriteApi } = await import("../api/song.api");
      const response = await toggleFavouriteApi(id);
      set((state) => ({
        songs: state.songs.map((s) =>
          s._id === id ? { ...s, isFavourite: response.song.isFavourite } : s
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to toggle favourite" });
    }
  },
}));
