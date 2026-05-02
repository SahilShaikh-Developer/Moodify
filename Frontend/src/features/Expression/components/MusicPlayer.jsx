import useSongs from "../hooks/useSongs";
import defaultCover from "../../../assets/images/music.jpg";
import {
  Ellipsis,
  MicVocal,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import useAudioPlayer from "../hooks/useAudioPlayer";
import { useSongStore } from "../store/song.store";

const MusicPlayer = ({ mood, shouldPlay }) => {
  const { currentSong } = useSongs(mood);
  const { nextSong, prevSong } = useSongStore();
  const {
    lineRef,
    isPlaying,
    currentTime,
    duration,
    progress,
    togglePlay,
    handleSeekClick,
    setIsDragging,
    formatTime,
    toggleMute,
    isMuted,
    volume,
    changeVolume,
  } = useAudioPlayer(currentSong?.audioUrl, shouldPlay);

  return (
    <section className="music-wrapper">
      <div className="musicplay-wrapper">
        <div className="top-wrapper">
          <div className="image">
            <img src={mood ? currentSong?.coverUrl : defaultCover} alt="music" />
            <div className="title">
              <p className="active">{mood ? currentSong?.title : "No song selected"}</p>
              <p>{mood ? currentSong?.artist : "Unknown Artist"}</p>
            </div>
          </div>
        </div>
        <div className="middle-wrapper">
          <div className="controls">
            <SkipBack onClick={prevSong} />
            <div className="pause" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </div>
            <SkipForward onClick={nextSong} />
          </div>
          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>
            <div
              className="line"
              ref={lineRef}
              onClick={handleSeekClick}
            >
              <div className="fill" style={{ width: `${progress}%` }}></div>
              <div
                className="circle"
                style={{ left: `${progress}%` }}
                onMouseDown={() => setIsDragging(true)}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="bottom-wrapper">
          {mood && <div className="mood-badge">{mood}</div>}
          <div className="volume-wrapper">
            <div className="volume-icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </div>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              style={{ '--volume-percent': `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
