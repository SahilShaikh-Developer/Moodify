import { Trash2, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CreateSong from "./CreateSong";
import { useSongStore } from "../store/song.store";

//Duration formatting
const formatDuration = (seconds) => {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const Playlists = () => {
  const { songs, loading, getSongs, deleteSong, toggleFavourite } = useSongStore();
  const [selectedMood, setSelectedMood] = useState("");
  const [showFavourites, setShowFavourites] = useState(false);

  useEffect(() => {
    getSongs();
  }, []);

  const moods = useMemo(() => [...new Set(songs.map((s) => s.mood))], [songs]);

  //Filter songs by mood
  const filteredSongs = useMemo(() => {
    if (showFavourites) return songs.filter((s) => s.isFavourite);
    return selectedMood ? songs.filter((s) => s.mood === selectedMood) : songs;
  }, [showFavourites, selectedMood, songs]);

  // Delete handler
  const handleDelete = async (id) => {
    await deleteSong(id);
    toast.success("Songs deleted successfully");
  };

  return (
    <section className="playlist-wrapper">
      <div className="outer">
        <div className="top-wrapper">
          <div className="title">
            <p>Personalized Playlists</p>
            <span>Based on your current facial micro-expressions</span>
          </div>
          <div className="categories">
            <span>{moods.length}</span>
            <p>Categories</p>
          </div>
        </div>
        <div className="mood-section">
          <div className="mood-header">
            <select
              className="mood-select"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
            >
              <option value="">All Moods</option>
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              className={`fav-filter-btn ${showFavourites ? "active" : ""}`}
              onClick={() => setShowFavourites(!showFavourites)}
            >
              <Heart fill={showFavourites ? "currentColor" : "none"} />
              Favourites
            </button>
            <CreateSong />
            <p className="track-count">{filteredSongs.length} Tracks</p>
          </div>
          <div className="track-list">
            {filteredSongs.map((song) => (
              <div className="track-item" key={song._id}>
                <div className="track-icon">
                  <img src={song.coverUrl} alt={song.title} />
                </div>
                <div className="track-info">
                  <p className="track-name">{song.title}</p>
                  <p className="track-artist">{song.artist}</p>
                </div>
                <p className="track-duration">
                  {formatDuration(song.duration)}
                </p>
                <span
                  className={`fav-btn ${song.isFavourite ? "active" : ""}`}
                  onClick={() => toggleFavourite(song._id)}
                >
                  <Heart fill={song.isFavourite ? "currentColor" : "none"} />
                </span>
                <span
                  className="delete-btn"
                  onClick={() => handleDelete(song._id)}
                >
                  <Trash2 />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playlists;
