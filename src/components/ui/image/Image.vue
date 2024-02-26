<script setup lang="ts">
import { ref, watchEffect, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils/twMerge";
type Props = {
  src: string | undefined | null;
  alt?: string;
  class?: HTMLAttributes["class"];
};
const props = defineProps<Props>();
const newImage = ref<string>();

watchEffect(() => {
  newImage.value = undefined;
  if (!props.src) {
    return;
  }
  const image = new Image();
  image.onload = () => {
    newImage.value = image.src;
  };
  image.src = props.src;
});
</script>

<template>
  <img
    :src="newImage || '/logo.svg'"
    :alt="alt || 'image'"
    :class="cn(props.class)"
  />
</template>
