<script setup lang="ts">
import { ref, watch, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils/twMerge";
import logoMain from "@/components/logo/logoMain.vue";

const props = defineProps<{
  src: string | undefined | null;
  alt?: string;
  class?: HTMLAttributes["class"];
  height?: number;
  width?: number;
}>();

const newImage = ref<string>();
const image: HTMLImageElement | null = new Image();

watch(
  () => props.src,
  () => {
    newImage.value = undefined;
    if (props.src) {
      image.onload = () => {
        newImage.value = image.src;
      };
      image.src = props.src;
    }
  },
  { immediate: true },
);
</script>

<template>
  <img
    v-if="newImage"
    :src="newImage"
    :alt="alt || 'image'"
    :class="cn(props.class)"
    :height="height || image.height"
    :width="width || image.width"
    loading="lazy"
  >
  <logo-main
    v-else
    v-once
    :class="cn(props.class)"
  />
</template>
