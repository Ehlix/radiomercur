import { cva, type VariantProps } from "class-variance-authority";


export { default as XButton } from "./XButton.vue";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-base",
  {
    variants: {
      variant: {
        default: "bg-mc-2 text-mc-1 hover:bg-hc-2",
        destructive:
          "bg-red-500 text-mc-1 text-base font-semibold hover:bg-red-500/90",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
        reversed:
          "bg-mc-3 text-mc-1 hover:bg-hc-3 disabled:opacity-100 disabled:bg-mc-2 tracking-wide",
        ghost: "",
        link: "text-zinc-900  underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-8 min-w-20 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-8 w-6 p-0 min-w-6 max-w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
