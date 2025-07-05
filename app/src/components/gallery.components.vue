<template>
   <v-container>
   <v-infinite-scroll @load="load">
      <!-- Masonry Layout with CSS Columns -->
      <div class="masonry-container">
        <div v-for="(image, index) in images" :key="index" class="masonry-item">
          <v-img
            :src="image.image_url"
            :alt="image.tags.join(', ')"
            :aspect-ratio="image.aspect_ratio || 1"
            cover
            class="mb-3"
          ></v-img>
        </div>
      </div>
      
      <template #empty>
        <v-alert type="info" class="mt-4">No more images.</v-alert>
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
import { computed, ref, watch } from "vue";

const images = ref([]);
const page = ref(1);
const activeTag = ref(null);

const imageLayout = computed(() => {
  const layout = [];
  let i = 0;
  
  while (i < images.value.length) {
    // รูปแบบที่ 1: รูปใหญ่ 1 รูป (cols: 6) และ รูปเล็ก 2 รูป (cols: 6)
    if (i + 2 < images.value.length) {
      layout.push({
        image: images.value[i],
        cols: 6,
      });
      layout.push({
        cols: 6,
        children: [
          { image: images.value[i + 1], cols: 12 },
          { image: images.value[i + 2], cols: 12 },
        ],
      });
      i += 3;
    }
    // รูปแบบที่ 2: รูปเหลือน้อยกว่า 3 รูป
    else if (i + 1 < images.value.length) {
      // 2 รูปสุดท้าย - แบ่งครึ่งหน้าจอ
      layout.push({
        image: images.value[i],
        cols: 6,
      });
      layout.push({
        image: images.value[i + 1],
        cols: 6,
      });
      i += 2;
    }
    // รูปแบบที่ 3: รูปสุดท้าย 1 รูป - เต็มความกว้าง
    else {
      layout.push({
        image: images.value[i],
        cols: 12,
      });
      i += 1;
    }
  }
  
  return layout;
});

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
});

const setFilterTag = (tagName) => {
  activeTag.value = tagName;
};
</script>

<style scoped>
.masonry-container {
  column-count: 3;
  column-gap: 16px;
  column-fill: balance;
}

.masonry-item {
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  margin-bottom: 16px;
}

/* Responsive columns */
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