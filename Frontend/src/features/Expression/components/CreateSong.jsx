import { Music, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSongStore } from "../store/song.store";

const MOODS = ["Sad", "Happy", "Angry", "Surprise"];

const CreateSong = () => {
  const { uploadSong } = useSongStore(); // ← matches your store action name
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ mood: "", file: null });

  const handleUpload = async () => {
    if (!formData.file || !formData.mood) {
      toast.error("Please select a file and mood");
      return;
    }

    const payload = new FormData();
    payload.append("song", formData.file); // ← "song" matches upload.single("song")
    payload.append("mood", formData.mood);

    setUploading(true);
    await uploadSong(payload);
    setUploading(false);
    toast.success("Song uploaded successfully");
    setShowModal(false);
    setFormData({ mood: "", file: null });
  };

  return (
    <>
      <div className="create" onClick={() => setShowModal(true)}>
        <Music />
        <p>Create Song</p>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <p>Upload Song</p>
              <span className="close-btn" onClick={() => setShowModal(false)}>
                <X />
              </span>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, mood: e.target.value }))
                  }
                >
                  <option value="">Select Mood</option>
                  {MOODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="file-upload">
                  <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, file: e.target.files[0] }))
                    }
                  />
                  {formData.file 
                    ? formData.file.name.length > 30 
                      ? formData.file.name.substring(0, 30) + "..." 
                      : formData.file.name 
                    : "Choose MP3 File"}
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSong;
