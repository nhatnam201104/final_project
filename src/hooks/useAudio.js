import { useRef } from 'react';
import { createAudioContext, playHappyBirthday } from '../utils/music';

export function useAudio() {
  const audioCtxRef = useRef(null);

  function initAudio() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    return audioCtxRef.current;
  }

  function play() {
    const ctx = initAudio();
    playHappyBirthday(ctx);
  }

  return { initAudio, play };
}
