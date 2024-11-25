import type { FunctionDirective } from "vue";

import { tooltip } from "./tooltip";

export const directives: { name: string; directive: FunctionDirective }[] = [
  { name: "tooltip", directive: tooltip },
];
