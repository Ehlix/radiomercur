<script setup lang="ts">
import { onMounted, ref, toRef } from "vue";

import { usePlayerVisual } from "../use/usePlayerVisual";

const props = defineProps<{
  player: HTMLAudioElement;
  mode: "1" | "2";
}>();

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  usePlayerVisual(
    canvas.value!,
    props.player,
    toRef(() => props.mode),
  );
});
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-60"
  >
    <canvas ref="canvas" class="h-full w-full" width="1024" height="200" />
  </div>
</template>

<style scoped></style>
