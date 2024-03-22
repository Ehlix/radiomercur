<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  player: HTMLAudioElement;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

const visualization = () => {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(props.player);
  const analyser = audioCtx.createAnalyser();
  // Подключаем анализатор к элементу audio
  source.connect(analyser);
  // Без этой строки нет звука, но анализатор работает.
  analyser.connect(audioCtx.destination);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const ctx = canvas.value?.getContext("2d");

  const maxX = 1024;
  const maxY = 256;
  const stepX = 18;

  let topYCache = {} as Record<number, number>;
  let bottomYCache2 = {} as Record<number, number>;

  const draw = () => {
    if (!ctx || !canvas.value) {
      return;
    }
    // Записываем в массив данные уровней частот
    analyser.getByteFrequencyData(frequencyData);
    // Задаём цвет фона
    ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-1",
    );
    ctx.globalAlpha = 0.4;
    // Полупрозрачно чистим экран
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-2",
    );
    ctx.lineWidth = 2;
    for (let i = 0; i < maxX; i += stepX) {
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
    for (let i = 0; i < maxX; i += stepX) {
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
    ctx.lineWidth = 4;
    for (let i = 0; i < maxX; i += stepX) {
      ctx.lineTo(i, maxY - frequencyData[i]);
    }
    ctx.stroke();

    requestAnimationFrame(draw);
  };
  draw();
};

onMounted(() => {
  visualization();
});
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 mt-1 h-full w-full opacity-60"
  >
    <canvas
      ref="canvas"
      class="h-full w-full"
      width="1024"
      height="256"
    ></canvas>
  </div>
</template>

<style scoped></style>
