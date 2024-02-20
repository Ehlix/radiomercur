<script setup lang="ts">
import { Settings2 } from "lucide-vue-next";
import XIcon from "../ui/icon/Icon.vue";
import {
  Sheet as XSheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
</script>

<template>
  <x-sheet >
    <sheet-trigger>
      <x-icon :icon="Settings2" class="text-tc-2"/>
    </sheet-trigger>
    <sheet-content side="right" class="backdrop-blur-md bg-mc-4">
      <sheet-header>
        <sheet-title>Settings</sheet-title>
        <sheet-description>

        </sheet-description>
      </sheet-header>
    </sheet-content>
  </x-sheet>
</template>
