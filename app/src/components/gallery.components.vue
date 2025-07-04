<template>
  <h1>gallary components</h1>

  <v-infinite-scroll :height="300" :items="items" @load="load">
    <template v-for="(item, index) in items" :key="item">
      <div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
        Item number #{{ item }}
      </div>
    </template>
  </v-infinite-scroll>
</template>

<script>
export default {
  name: "galleryComponents",
};
</script>

<script setup>
import { ref } from "vue";
import axios from "axios";

const items = ref([]);
const page = ref(1)
const activeTag = ref(null)

const fetchGallery = async () => {
  try {
    
  } catch (err) {
    console.log(`fech Gallery error: ` + err);
  }
};
</script>
