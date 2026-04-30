import { create } from "zustand";

export const useAudioStore = create((set, get) => ({
  audio: typeof Audio !== "undefined" ? new Audio() : null,

  setSrc: (src) => {
    const audio = get().audio;
    if (!audio || !src) return;

    //Stop current audio
    audio.pause();
    audio.currentTime = 0;

    //Set new Source
    audio.src = src;
    audio.load();
  },
}));
