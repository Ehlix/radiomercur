<script setup lang="ts">
import DoublePanel from "./DoublePanel.vue";
import FavoriteMain from "@/components/favorite/FavoriteMain.vue";
import SearchMain from "@/components/search/SearchMain.vue";
</script>

<template>
  <double-panel>
    <template #left-panel>
      <favorite-main />
    </template>
    <template #right-panel>
      <search-main />
    </template>
  </double-panel>
</template>

<style scoped></style>
