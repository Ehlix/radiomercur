import type { FunctionDirective } from "vue";

import styles from "./tooltip.module.css";

const posTable = ["top", "bottom", "left", "right"];

export const tooltip: FunctionDirective = (el, binding) => {
  el.setAttribute("data-tooltip", binding.value?.toString() || "");
  el.classList.add(styles["v-tooltip"]);
  const arg = binding.arg;
  if (arg && posTable.includes(arg)) {
    el.classList.add(styles["v-tooltip-" + binding.arg]);
  }
};
