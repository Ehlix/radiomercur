<script setup lang="ts">
import { ref } from 'vue';
import {
  Info
} from "lucide-vue-next";

import { type ButtonVariants, XButton, XIcon } from "@/shared/ui";
import { ExtendedInfo } from '.';


defineProps<{
  station?: Station
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
}>()

const dialogOpen = ref(false);
</script>

<template>
  <x-button
    v-if="station"
    v-tooltip="$t('stationCard.extendedInfo')"
    :variant="variant || 'ghost'"
    :size="size || 'icon'"
    @click="dialogOpen = true"
  >
    <x-icon
      :icon="Info"
      :size="20"
      :stroke-width="2"
      class="cursor-pointer"
    />
    <extended-info
      v-if="dialogOpen"
      :station="station"
      :open="dialogOpen"
      @close="dialogOpen = false"
    />
  </x-button>
</template>
