export function initMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  let animationId;
  let columns, drops;

  const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';
  const fontSize = 14;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(15, 17, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
  };
}
