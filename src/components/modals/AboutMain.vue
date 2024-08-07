<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import logoMain from "@/components/logo/logoMain.vue";
</script>

<template>
  <dialog-main>
    <dialog-trigger as-child>
      <logo-main class="h-24 w-fit cursor-pointer transition-none sm:h-20" />
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
</template>
