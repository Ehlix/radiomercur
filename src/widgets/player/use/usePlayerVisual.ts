import { onUnmounted, type Ref, watch } from "vue";


export const usePlayerVisual = (
  canvas: HTMLCanvasElement,
  player: HTMLAudioElement,
  mode: Ref<"1" | "2">,
) => {
  let animationDisableId: number | null = null;

  const topYCache = {} as Record<number, number>;
  const bottomYCache2 = {} as Record<number, number>;

  const maxX = 1024;
  const maxY = 202;
  const stepX = 32;

  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(player);
  const analyser = audioCtx.createAnalyser();
  // Подключаем анализатор к элементу audio
  source.connect(analyser);
  // Без этой строки нет звука, но анализатор работает.
  analyser.connect(audioCtx.destination);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);

  const waveVisual = () => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    // Записываем в массив данные уровней частот
    analyser.getByteFrequencyData(frequencyData);
    // Задаём цвет фона
    ctx.fillStyle = `hsl(${getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-1",
    )}`;
    ctx.globalAlpha = 0.4;
    // Полупрозрачно чистим экран
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `hsl(${getComputedStyle(ctx!.canvas).getPropertyValue(
      "--main-color-3",
    )}`;

    const step = maxX / 2;
    ctx.beginPath();
    ctx.lineWidth = 2;
    for (let i = 0; i <= step; i += stepX) {
      const freq = maxY - frequencyData[i];
      const diff = topYCache[i] - freq;
      if (topYCache[i]) {
        diff > 0
          ? (topYCache[i] = freq)
          : topYCache[i] < maxY &&
            (diff < -50 ? (topYCache[i] += 10) : (topYCache[i] += 0.5));
      } else {
        topYCache[i] = freq;
      }
      ctx.lineTo(i, topYCache[i]);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    for (let i = 0; i <= step; i += stepX) {
      ctx.lineTo(maxX - i, topYCache[i]);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 4;
    for (let i = 0; i <= step; i += stepX) {
      ctx.lineTo(i, maxY - frequencyData[i]);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 4;
    for (let i = 0; i <= step; i += stepX) {
      ctx.lineTo(maxX - i, maxY - frequencyData[i]);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    for (let i = 0; i <= step; i += stepX) {
      const freq = maxY - frequencyData[i];
      const diff = freq - bottomYCache2[i];
      if (bottomYCache2[i]) {
        diff > 0
          ? (bottomYCache2[i] = freq)
          : diff < -30
            ? (bottomYCache2[i] -= 10)
            : (bottomYCache2[i] -= 0.5);
      } else {
        bottomYCache2[i] = freq;
      }
      ctx.lineTo(i, bottomYCache2[i]);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    for (let i = 0; i <= step; i += stepX) {
      ctx.lineTo(maxX - i, bottomYCache2[i]);
    }
    ctx.stroke();
    animationDisableId = requestAnimationFrame(waveVisual);
  };

  const columnsVisual = () => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    const color1 = `hsl(${getComputedStyle(ctx!.canvas).getPropertyValue(
      "--main-color-3",
    )})`;
    // Записываем в массив данные уровней частот
    analyser.getByteFrequencyData(frequencyData);
    // Задаём цвет фона
    ctx.fillStyle = `hsl(${getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-1",
    )})`;
    ctx.globalAlpha = 1;
    // Полупрозрачно чистим экран
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= maxX / 2; i += stepX) {
      const freq = maxY - frequencyData[i];
      const diff = topYCache[i] - freq;
      if (topYCache[i]) {
        topYCache[i] - freq > 0
          ? (topYCache[i] = freq)
          : topYCache[i] < maxY &&
            (diff < -40 ? (topYCache[i] += 2) : (topYCache[i] += 0.5));
      } else {
        topYCache[i] = freq;
      }
      ctx.fillStyle = color1;
      ctx.fillRect(i, topYCache[i], stepX, 4);
      ctx.fillRect(maxX - i, topYCache[i], stepX, 4);
      ctx.fillRect(i, freq, stepX, frequencyData[i]);
      ctx.fillRect(maxX - i, freq, stepX, frequencyData[i]);
    }

    animationDisableId = requestAnimationFrame(columnsVisual);
  };

  watch(
    [mode],
    () => {
      if (animationDisableId) {
        cancelAnimationFrame(animationDisableId);
      }
      if (mode.value === "1") {
        waveVisual();
      } else if (mode.value === "2") {
        columnsVisual();
      }
    },
    {
      immediate: true,
    },
  );
  onUnmounted(() => {
    if (animationDisableId) {
      cancelAnimationFrame(animationDisableId);
    }
  });
};
