<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import PlayerMain from "@/components/player/PlayerMain.vue";
</script>

<template>
  <div class="flex flex-col shrink grow basis-auto">
    <nav-main/>
    <main class="container grow py-4">
      <router-view />
    </main>
    <player-main/>
  </div>
</template>
