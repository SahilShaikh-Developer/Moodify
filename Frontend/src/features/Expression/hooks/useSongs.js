import { useEffect } from "react";
import { useSongStore } from "../store/song.store";

const useSongs = (mood) => {
  const { songs, loading, currentSong, error, getSongs } = useSongStore();

  useEffect(() => {
    if (!mood || mood === "Idle" || mood === "No Face") return;
    getSongs(mood);
  }, [mood, getSongs]);
  return { songs, currentSong, loading, error };
};
export default useSongs;
