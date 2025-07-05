<template>
  <v-app :theme="theme">
    <v-app-bar class="px-3">
        <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="
            theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
          "
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
    </v-app-bar>

    <v-main>
        <galleryComponents/>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import galleryComponents from "./components/gallery.components.vue";
const theme = ref("light");

function onClick() {
  theme.value = theme.value === "light" ? "dark" : "light";
}
</script>
