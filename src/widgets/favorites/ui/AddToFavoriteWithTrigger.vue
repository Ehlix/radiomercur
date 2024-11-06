<script setup lang="ts">
import { ref } from "vue";
import { ListPlus } from "lucide-vue-next";

import { type ButtonVariants, XButton, XIcon } from "@/shared/ui";
import { AddToFavorite } from ".";


defineProps<{
  station?: Station;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
}>();

const dialogOpen = ref(false);
</script>

<template>
  <x-button
    v-if="station"
    v-tooltip:right="$t('buttons.addFavorite')"
    :variant="variant || 'ghost'"
    :size="size || 'icon'"
    @click="dialogOpen = true"
  >
    <add-to-favorite
      v-if="dialogOpen"
      :station="station"
      :open="dialogOpen"
      @close="dialogOpen = false"
    />
    <x-icon
      :icon="ListPlus"
      :size="22"
      :stroke-width="2"
      class="cursor-pointer"
    />
  </x-button>
</template>
