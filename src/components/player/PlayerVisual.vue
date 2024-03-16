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
  source.connect(analyser); // Подключаем анализатор к элементу audio
  analyser.connect(audioCtx.destination); // Без этой строки нет звука, но анализатор работает.
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const ctx = canvas.value?.getContext("2d");

  setInterval(function () {
    if (!ctx || !canvas.value) {
      return;
    }
    analyser.getByteFrequencyData(frequencyData); // Записываем в массив данные уровней частот
    ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-1",
    ); // Задаём цвет фона
    ctx.globalAlpha = 0.5; // Это для получения эффекта плавного погасания полос
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height); // Полупрозрачно чистим экран
    ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue(
      "--main-color-2",
    ); // Задаём цвет полос
    ctx.globalAlpha = 1;
    for (let i = 0; i < 1024; i++) {
      ctx.fillRect(i, 255 - frequencyData[i], 1, frequencyData[i]); // рисуем полосу
    }
  }, 24);
};

onMounted(() => {
  visualization();
});
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 mt-1 h-full w-full opacity-40"
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
