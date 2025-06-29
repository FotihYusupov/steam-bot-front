<template>
  <div class="min-h-screen bg-black text-white p-2 pb-24 flex justify-center">
    <div class="w-full max-w-2xl space-y-6">
      <div
        v-for="giveaway in giveaways"
        :key="giveaway._id"
        class="bg-zinc-900 rounded-xl p-3 shadow-lg border border-[#FFB823]"
      >
        <img
          :src="giveaway.image"
          :alt="giveaway.title"
          class="w-full h-40 object-contain rounded-md border border-gray-700 mb-3"
        />

        <h1 class="text-xl font-bold text-[#FFB823] mb-2">
          {{ giveaway.title }}
        </h1>

        <p class="text-gray-300 text-sm mb-4">
          {{ giveaway.desc }}
        </p>

        <a
          :href="giveaway.url"
          target="_blank"
          class="block text-center bg-[#FFB823] hover:bg-yellow-400 text-black font-semibold py-2 rounded"
        >
          Telegramda qatnashish
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

const config = useRuntimeConfig();

const giveaways = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get(`${config.public.url}/giveaways`);
    giveaways.value = res.data.data;
  } catch (err) {
    console.error("Giveawaysni olishda xatolik:", err);
  }
});
</script>
