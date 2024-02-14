<script setup lang="ts">
import { computed } from "vue";
import { Search } from "lucide-vue-next";

type Props = {
  icon: typeof Search;
  size?: number;
  color?: string;
  strokeWidth?: number;
  defaultClass?: string;
};

const props = defineProps<Props>();
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
  />
</template>
