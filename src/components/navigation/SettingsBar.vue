<script setup lang="ts">
import { Settings2 } from "lucide-vue-next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
</script>

<template>
  <Sheet >
    <SheetTrigger>
      <Settings2 class="text-tc-2" />
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>
          
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
