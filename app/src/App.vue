<template>
  <v-app :theme="theme">
    <v-app-bar class="px-3">
      <v-container>
      <img src="./assets/diversition.png" alt="" width="150">
      </v-container>
    </v-app-bar>

    <v-main>
        <galleryComponents/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import galleryComponents from "./components/gallery.components.vue";
</script>
