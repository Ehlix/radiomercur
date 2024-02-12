<script setup lang="ts">
const listToShow = [
  {
    name: "Jazz",
  },
  {
    name: "Rock",
  },
  {
    name: "Pop",
  },
  {
    name: "Rap",
  },
  {
    name: "Electronic",
  },
  {
    name: "Classical",
  },
  {
    name: "Folk",
  },
  {
    name: "R&B",
  },
  {
    name: "Country",
  },
  {
    name: "Latin",
  },
];
</script>

<template>
  <div class="grid grid-cols-5 p-10 gap-10 bg-red-100">
    <RouterLink v-for="item of listToShow" to="/search" class="bg-gray-500 flex aspect-square h-full w-full justify-center items-center">
      <span>
        {{ item.name }}
      </span>
    </RouterLink>
  </div>
</template>
