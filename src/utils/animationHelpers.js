import gsap from 'gsap'

export function tweenTo(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve })
  })
}

export function tweenFromTo(target, fromVars, toVars) {
  return new Promise((resolve) => {
    gsap.fromTo(target, fromVars, { ...toVars, onComplete: resolve })
  })
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function shuffleArray(input) {
  const arr = input.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
