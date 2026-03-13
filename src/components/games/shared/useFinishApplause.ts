import { useEffect, useRef } from "react";
import applauseSound from "../../../assets/sounds/applause.mp3";

export function useFinishApplause(shouldPlay: boolean, enabled = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(applauseSound);
    audio.volume = 0.8;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (shouldPlay && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    if (!shouldPlay) {
      hasPlayedRef.current = false;
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    }
  }, [enabled, shouldPlay]);
}
