import type { FunctionDirective } from "vue";

const posTable = ["top", "bottom", "left", "right"];

export const tooltip: FunctionDirective = (el, binding) => {
  el.setAttribute("data-tooltip", binding.value?.toString() || "");
  el.classList.add("v-tooltip");
  const arg = binding.arg;
  if (arg && posTable.includes(arg)) {
    el.classList.add("v-tooltip-" + binding.arg);
  }
};
