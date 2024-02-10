import { ref, computed } from "vue";
import { defineStore } from "pinia";


export const useCounterStore = defineStore("counter", () => {
  const state = ref<CounterState>({
    count: 0,
  });
  const doubleCount = computed(() => state.value.count * 2);
  function increment() {
    state.value.count++;
  }

  return { state, doubleCount, increment };
});
