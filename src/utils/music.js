const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63,
  F4: 349.23, G4: 392.00, A4: 440.00,
  Bb4: 466.16, B4: 493.88, C5: 523.25,
};

const MELODY = [
  ['C4', 0.3], ['C4', 0.3], ['D4', 0.6], ['C4', 0.6], ['F4', 0.6], ['E4', 1.2],
  ['C4', 0.3], ['C4', 0.3], ['D4', 0.6], ['C4', 0.6], ['G4', 0.6], ['F4', 1.2],
  ['C4', 0.3], ['C4', 0.3], ['C5', 0.6], ['A4', 0.6], ['F4', 0.6], ['E4', 0.6], ['D4', 1.2],
  ['Bb4', 0.3], ['Bb4', 0.3], ['A4', 0.6], ['F4', 0.6], ['G4', 0.6], ['F4', 1.2],
];

function playNote(audioCtx, freq, startTime, duration) {
  const harmonics = [
    { ratio: 1, gain: 0.3, type: 'sine' },
    { ratio: 2, gain: 0.1, type: 'sine' },
    { ratio: 3, gain: 0.04, type: 'sine' },
    { ratio: 4, gain: 0.015, type: 'sine' },
  ];

  harmonics.forEach(h => {
    const osc = audioCtx.createOscillator();
    osc.type = h.type;
    osc.frequency.setValueAtTime(freq * h.ratio, startTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(h.gain, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(h.gain * 0.5, startTime + 0.15);
    gain.gain.setValueAtTime(h.gain * 0.5, startTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });
}

export function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

export function playHappyBirthday(audioCtx) {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  let time = audioCtx.currentTime + 0.2;
  MELODY.forEach(([note, dur]) => {
    playNote(audioCtx, NOTES[note], time, dur * 0.9);
    time += dur;
  });
}
