import type { FunctionDirective } from "vue";
import { tooltip } from "./tooltip";

type Directive = {
  name: string;
  directive: FunctionDirective;
};

export const directives: Directive[] = [
  {
    name: "tooltip",
    directive: tooltip,
  },
];
