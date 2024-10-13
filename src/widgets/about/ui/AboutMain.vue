<script setup lang="ts">
import { Github } from "lucide-vue-next";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogTrigger,
  ShadowOverlay,
  XIcon,
  XLogo,
} from "@/shared/ui";
</script>

<template>
  <div
    class="relative flex h-full w-20 min-w-20 items-center justify-center overflow-hidden rounded bg-mc-1 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
  >
    <shadow-overlay />
    <h1 class="sr-only">Radio Mercur</h1>
    <dialog-main>
      <dialog-trigger as-child>
        <x-logo
          class="size-20 cursor-pointer pl-1 transition-none sm:h-20 sm:pl-0.5"
        />
      </dialog-trigger>
      <dialog-content
        class="w-full max-w-[70dvw] bg-mc-2 p-1 transition-none sm:max-w-[425px]"
      >
        <div
          class="grid h-fit max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
        >
          <dialog-header class="border-b border-mc-2 p-2 px-6 xs:p-1 xs:px-4">
            <dialog-title class="text-2xl text-mc-2">
              {{ $t("about.title") }}
            </dialog-title>
            <dialog-description />
          </dialog-header>
          <div
            class="my-2 grid gap-2 overflow-y-auto overflow-x-hidden px-6 xs:px-4"
          >
            <div class="flex items-center gap-2">
              <x-icon
                :icon="Github"
                class="text-mc-2"
                :size="24"
                :stroke-width="1.5"
              />
              <a
                href="https://github.com/ehlix/radiomercur"
                target="_blank"
                class="text-base font-semibold text-mc-2 transition-colors hover:text-hc-2"
              >
                {{ $t("about.source") }}
              </a>
            </div>
          </div>
          <!-- <DialogFooter class="p-6 pt-0"> </DialogFooter> -->
        </div>
      </dialog-content>
    </dialog-main>
  </div>
</template>
