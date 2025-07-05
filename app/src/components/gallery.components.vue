<template>
  <v-container>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="10" lg="8">
        <div class="d-flex justify-center flex-wrap">
          <v-chip
            class="ma-2"
            :variant="activeTag === null ? 'elevated' : 'tonal'"
            color="primary"
            @click="setFilterTag(null)"
          >
            All
          </v-chip>

          <v-chip
            v-for="tag in tags"
            :key="tag.id"
            class="ma-2"
            :variant="activeTag === tag.name ? 'elevated' : 'tonal'"
            color="primary"
            @click="setFilterTag(tag.name)"
          >
            #{{ tag.name }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-infinite-scroll @load="load" :key="infiniteScrollKey">
      <div class="masonry-container">
        <div v-for="(image, index) in images" :key="index" class="masonry-item">
          <v-img
            :src="image.image_url"
            :alt="image.tags.join(', ')"
            class="mb-3"
          ></v-img>
          <div class="tags-container pa-2">
            <v-chip
              v-for="tag in image.tags"
              :key="tag"
              class="mr-1 mb-1"
              size="small"
              color="primary"
            >
              #{{ tag }}
            </v-chip>
          </div>
        </div>
      </div>

      <template #empty>
        <v-alert class="mt-4">No more images.</v-alert>
      </template>
    </v-infinite-scroll>
  </v-container>
</template>

<script>
export default {
  name: "galleryComponents",
};
</script>

<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";

const images = ref([]);
const page = ref(1);
const activeTag = ref(null);
const tags = ref([]);
const infiniteScrollKey = ref(0);

const fetchTags = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/tags");
    tags.value = res.data;
  } catch (err) {
    console.log(`fetch API Tags error: ` + err);
    done("error");
  }
};

async function load({ done }) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.value);
    params.append("limit", 10);

    if (activeTag.value) {
      params.append("tag", activeTag.value);
    }

    const res = await axios.get(
      `http://localhost:3000/api/gallery?${params.toString()}`
    );

    const newImages = res.data.gallery;

    if (Object.keys(newImages).length > 0) {
      images.value.push(...newImages);
      page.value++;
      done("ok");
    } else {
      done("empty");
    }
  } catch (err) {
    console.log(`fetch API Gallery error: ` + err);
    done("error");
  }
}

watch(activeTag, () => {
  images.value = [];
  page.value = 1;
  infiniteScrollKey.value++;
});

const setFilterTag = (tagName) => {
  activeTag.value = tagName;
};

onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.masonry-container {
  column-count: 3;
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.tags-container {
  background-color: #f9f9f9;
}

@media (max-width: 960px) {
  .masonry-container {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .masonry-container {
    column-count: 1;
  }
}
</style>
