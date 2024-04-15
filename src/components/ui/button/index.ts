import { type VariantProps, cva } from "class-variance-authority";

export { default as XButton } from "./XButton.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-mc-2 text-tc-4 hover:bg-hc-2",
        destructive:
          "bg-red-500 text-mc-1 text-base font-semibold hover:bg-red-500/90 dark:bg-red-900",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        reversed:
          "bg-mc-3 text-tc-1 hover:bg-hc-3 disabled:opacity-100 disabled:bg-mc-2 tracking-wide font-bold disabled:text-mc-1 ",
        ghost: "hover:bg-hc-1 hover:text-hc-1",
        link: "text-zinc-900  underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-8 min-w-20 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
