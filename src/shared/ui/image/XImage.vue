<script setup lang="ts">
import { cn } from "@/shared/lib/utils/twMerge";
import { XLogo } from "@/shared/ui/logo";
import { ref, watch, type HTMLAttributes } from "vue";

const props = defineProps<{
  src: string | undefined | null;
  alt?: string;
  class?: HTMLAttributes["class"];
  height?: number;
  width?: number;
}>();

const newImage = ref<string>();
const image: HTMLImageElement = new Image();

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
  />
  <x-logo v-else v-once :class="cn(props.class)" />
</template>
