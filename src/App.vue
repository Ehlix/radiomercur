<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import Player from "@/components/player/Player.vue";
</script>

<template>
  <div class="flex flex-col shrink grow basis-auto">
    <NavMain/>
    <main class="container grow py-4">
      <RouterView />
    </main>
    <Player/>
  </div>
</template>
