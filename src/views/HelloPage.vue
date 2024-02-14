<script setup lang="ts">
import XIcon from "@/components/ui/icon/Icon.vue";
import { navList } from "@/lib/static/navList";
import { useRouter } from "vue-router";

const router = useRouter();

const pushHandler = (link: string) => {
  router.push(link);
};
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="rhomb-list">
      <button
        v-for="item of navList"
        @click="pushHandler(item.link)"
        class="rhomb bg-mc-2"
      >
        <div class="inner-rhomb bg-red-100">
          <div class="flex gap-2">
            <x-icon :icon="item.icon"  class="sm:hidden"/>
            <span class="capitalize">
              {{ item.title }}
            </span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rhomb-list {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0.5rem 0;
  width: 90%;
  max-height: 100vh;
  height: auto;
  gap: 0.5rem;
  background: slategray;
}

.rhomb {
  margin-bottom: -8%;
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  width: calc(100% / 3);
  height: auto;
  aspect-ratio: 1 / 1;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  &:nth-child(1) {
    order: -2;
  }
  &:nth-child(3) {
    order: -1;
  }
  &:nth-child(2) {
    margin-bottom: -9%;
    transform: translate(0, calc(-26% - 0.25rem));
    /* margin-top: calc(-16% - 0.25rem); */
  }
  & > .inner-rhomb {
    animation: move-out 500ms ease both;
  }
  &:hover > .inner-rhomb {
    animation: move-in 500ms ease both;
  }
  /* &:nth-child(odd) {
    flex: 0 1 50%;
    background: green;
  } */
}

.inner-rhomb {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0.5rem;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

@keyframes move-in {
  0% {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  100% {
    clip-path: polygon(50% 30%, 100% 50%, 50% 100%, 0% 50%);
  }
}
@keyframes move-out {
  0% {
    clip-path: polygon(50% 30%, 100% 50%, 50% 100%, 0% 50%);
  }
  100% {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}

@media (max-width: 1279px) {
  .rhomb-list {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .rhomb-list {
    scale: 145%;
  }
}

@media (max-width: 639px) {
  .rhomb-list {
    scale: 145%;
    /* gap: 16%; */
  }
  /* .rhomb {
    scale: 140%;
    &:nth-child(2) {
      transform: translate(0, calc(-2%));
    }
  } */
}

@media (max-width: 400px) {
  .rhomb-list {
    scale: 155%;
  }
}
</style>
