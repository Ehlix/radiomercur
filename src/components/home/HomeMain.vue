<script setup lang="ts">
import StationsInspector from "./StationsInspector.vue";
import DoublePanel from "./DoublePanel.vue";
</script>

<template>
  <double-panel>
    <template #left-panel>
      <stations-inspector />
    </template>
    <template #right-panel>
      <stations-inspector />
    </template>
  </double-panel>
</template>

<style scoped></style>
