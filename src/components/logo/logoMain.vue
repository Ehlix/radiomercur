<script setup lang="ts">
import type { HTMLAttributes } from "vue";

type Props = {
  class?: HTMLAttributes["class"];
};
const props = defineProps<Props>();
</script>

<template>
  <svg
    class="transition-all *:transition-all"
    :class="props.class"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 1000 1000"
  >
    <path
      id="svg-part-1"
      data-name="Эллипс 1"
      class="fill-hc-1"
      d="M484.757,115.192c211.971,0,383.808,171.837,383.808,383.808S696.728,882.808,484.757,882.808,100.949,710.971,100.949,499,272.786,115.192,484.757,115.192Z"
    />
    <path
      id="svg-part-2"
      data-name="Треугольник 1"
      class="fill-bgc-1"
      d="M867.661,456.476L169.653,865.328,58.727,456.063Z"
    />
  </svg>
</template>
