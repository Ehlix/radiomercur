<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import HomeMain from "@/components/home/HomeMain.vue";
var elements = document.getElementsByTagName("*");
</script>

<template>
  <div
    class="container flex shrink grow basis-auto select-none flex-col gap-2 py-2"
  >
  <nav-main />
    <section class="h-full shrink grow">
      <home-main />
    </section>
  </div>
</template>
