import axiosInstance from "../../../lib/axios";

export const fetchSongsByMood = async (mood) => {
  const res = await axiosInstance.get("/song", {
    params: mood ? { mood } : {},
  });
  return res.data;
};

export const uploadSong = async (formData) => {
  const res = await axiosInstance.post("/song", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteSongApi = async (id) => {
  const res = await axiosInstance.delete(`/song/${id}`);
  return res.data;
};

export const toggleFavouriteApi = async (id) => {
  const res = await axiosInstance.patch(`/song/${id}/favourite`);
  return res.data;
};
