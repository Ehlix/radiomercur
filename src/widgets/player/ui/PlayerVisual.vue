<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  player: HTMLAudioElement;
  mode: "1" | "2";
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const animationDisableId = ref<number | null>(null);
let topYCache = {} as Record<number, number>;
let bottomYCache2 = {} as Record<number, number>;
const maxX = 1022;
const maxY = 256;
const stepX = 28;

const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(props.player);
const analyser = audioCtx.createAnalyser();
// Подключаем анализатор к элементу audio
source.connect(analyser);
// Без этой строки нет звука, но анализатор работает.
analyser.connect(audioCtx.destination);
const frequencyData = new Uint8Array(analyser.frequencyBinCount);

const first = () => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx || !canvas.value) {
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
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

  ctx.strokeStyle = `hsl(${getComputedStyle(ctx!.canvas).getPropertyValue(
    "--main-color-3",
  )}`;
  ctx.beginPath();
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
  ctx.lineWidth = 4;
  for (let i = 0; i < maxX; i += stepX) {
    ctx.lineTo(i, maxY - frequencyData[i]);
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

  // ctx.beginPath();
  // ctx.lineWidth = 2;
  // for (let i = 0; i < maxX; i += stepX) {
  //   ctx.lineTo(i, maxY * 2 - topYCache[i]);
  // }
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.lineWidth = 4;
  // for (let i = 0; i < maxX; i += stepX) {
  //   ctx.lineTo(i, maxY + frequencyData[i]);
  // }
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.lineWidth = 2;
  // for (let i = 0; i < maxX; i += stepX) {
  //   ctx.lineTo(i, maxY * 2 - bottomYCache2[i]);
  // }
  // ctx.stroke();

  animationDisableId.value = requestAnimationFrame(first);
};
const second = () => {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx || !canvas.value) {
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
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

  for (let i = 0; i < 1024; i += stepX) {
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
    // const height = freq - topYCache[i] > 0 ? freq - topYCache[i] : 2;
    ctx.fillStyle = color1;
    ctx.fillRect(i, topYCache[i], stepX, 4);
    ctx.fillRect(i, maxY - frequencyData[i], stepX, frequencyData[i]);
    // ctx.fillRect(i, maxY + frequencyData[i], stepX, frequencyData[i] * -1);
    // ctx.fillRect(i, maxY * 2 - topYCache[i] + 4, stepX, -4);
  }
  animationDisableId.value = requestAnimationFrame(second);
};

watch(
  [() => props.mode, canvas],
  () => {
    if (animationDisableId.value) {
      cancelAnimationFrame(animationDisableId.value);
    }
    if (props.mode === "1") {
      first();
    } else if (props.mode === "2") {
      second();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 mt-1 h-fit w-[calc(110%)] opacity-60"
  >
    <canvas
      ref="canvas"
      class="h-[11.6rem] w-full sm:h-[9.6rem]"
      width="1024"
      height="512"
    />
  </div>
</template>

<style scoped></style>
