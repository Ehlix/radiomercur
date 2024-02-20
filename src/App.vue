<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import HomeMain from "@/components/home/HomeMain.vue";
var elements = document.getElementsByTagName("*");

///
</script>

<template>
  <div class="container flex shrink grow basis-auto flex-col pb-1">
    <nav-main />
    <section class="h-full shrink grow select-none">
      <home-main />
    </section>
  </div>
</template>
