<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import DoublePanel from "@/components/doublePanel/DoublePanel.vue";
import FavoriteMain from "@/components/favorite/FavoriteMain.vue";
import SearchMain from "@/components/search/SearchMain.vue";
var elements = document.getElementsByTagName("*");
</script>

<template>
  <div
    class="container relative flex h-full max-h-[100vh] w-full select-none flex-col gap-2 overflow-hidden p-2 py-2"
  >
    <nav-main />
    <double-panel>
      <template #left-panel>
        <favorite-main />
      </template>
      <template #right-panel>
        <search-main />
      </template>
    </double-panel>
  </div>
</template>
