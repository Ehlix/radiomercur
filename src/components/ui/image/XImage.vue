<script setup lang="ts">
import { ref, watchEffect, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils/twMerge";
import logoMain from "@/components/logo/logoMain.vue";

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
    v-if="newImage"
    :src="newImage || '/logo.svg'"
    :alt="alt || 'image'"
    :class="cn(props.class)"
  >
  <logo-main
    v-else
    :class="cn(props.class)"
  />
</template>
