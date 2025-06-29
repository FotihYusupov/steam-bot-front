<template>
  <div class="min-h-screen bg-black text-white font-sans relative">
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
    >
      <div
        class="w-10 h-10 border-4 border-gray-700 border-t-[#FFB823] rounded-full animate-spin"
      ></div>
    </div>

    <!-- Header -->
    <nav
      class="fixed top-0 left-0 w-full px-6 py-3 bg-black border-b border-[#FFB823] z-40 flex justify-between items-center"
    >
      <h1 class="text-[#FFB823] text-xl font-semibold">
        👋 Salom, {{ user.firstName }}!
      </h1>
      <img
        :src="user.photo"
        alt="User"
        class="w-9 h-9 rounded-full border-2 border-[#FFB823]"
      />
    </nav>

    <!-- Main content -->
    <main class="pt-20 px-4">
      <slot />
    </main>

    <div class="fixed bottom-0 w-full bg-[#FFB823] border-t border-black z-40">
      <ul class="flex justify-between items-center px-4 py-2 text-black">
        <li class="flex flex-col items-center text-xs">
          <NuxtLink to="/" class="flex flex-col items-center">
            <img src="/images/home.svg" alt="Asosiy" class="w-6 h-6 mb-1" />
            Asosiy
          </NuxtLink>
        </li>
        <li class="flex flex-col items-center text-xs">
          <NuxtLink to="/giveaways" class="flex flex-col items-center">
            <img src="/images/gift.svg" alt="Giveawaylar" class="w-6 h-6 mb-1" />
            Giveawaylar
          </NuxtLink>
        </li>
        <li class="flex flex-col items-center text-xs">
          <NuxtLink to="/blacklist" class="flex flex-col items-center">
            <img
              src="/images/spam.svg"
              alt="Qora ro'yxat"
              class="w-6 h-6 mb-1"
            />
            Qora ro'yxat
          </NuxtLink>
        </li>
        <li class="flex flex-col items-center text-xs">
          <NuxtLink to="/profile" class="flex flex-col items-center">
            <img src="/images/user.svg" alt="Profil" class="w-6 h-6 mb-1" />
            Profil
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Trade URL Modal -->
    <div
      v-if="!user.steamId64 && !isLoading"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70"
    >
      <div
        class="h-fit mt-40 bg-[#111] border border-[#FFB823] p-4 rounded-lg w-80"
      >
        <p class="text-center text-[#FFB823] font-semibold mb-2">
          Steam Trade URL ingizni kiriting
        </p>
        <p class="text-center text-sm text-gray-300 mb-3">
          <a
            href="https://steamcommunity.com/id/fatihyusupov/tradeoffers/privacy#trade_offer_access_url"
            target="_blank"
            class="text-[#FFB823] underline"
          >
            Trade URL olish
          </a>
        </p>
        <textarea
          v-model="tradeUrl"
          placeholder="Trade URL..."
          class="w-full p-2 rounded bg-black text-white border border-[#FFB823] mb-3"
        ></textarea>
        <button
          @click="saveUrl"
          class="w-full bg-[#FFB823] hover:bg-yellow-400 text-black font-bold py-2 rounded"
        >
          Saqlash
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "vue3-toastify/dist/index.css";
import { ref, onMounted } from "vue";
import axios from "axios";

import { useInventoryStore } from "~/stores/user";

const InventoryStore = useInventoryStore();

const config = useRuntimeConfig();

const user = ref({});
const tradeUrl = ref("");
const inventoryFetched = ref(false);
const isLoading = ref(true); // yangi loading flag
const isWorking = ref(false);

onMounted(() => {
  const route = useRoute();
  const token = route.query.token || JSON.parse(localStorage.getItem("token"));
  localStorage.setItem("token", JSON.stringify(token));
  getMe(token);

  if (isWorking.value) {
    navigateTo("/working")
  }
});

async function getMe(token) {
  try {
    const res = await axios.get(`${config.public.url}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.data.steamId64) {
      InventoryStore.updateInventory(true);
    }
    user.value = res.data.data;
  } catch (err) {
    localStorage.removeItem("token");
  } finally {
    isLoading.value = false;
  }
}

async function saveUrl() {
  const res = await axios.put(
    `${config.public.url}/users/set-trade-url`,
    { tradeUrl: tradeUrl.value },
    {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }
  );
  inventoryFetched.value = true;
  user.value = res.data.data;
}
</script>

<style scoped>
.shadow-neon {
  box-shadow: 0 0 15px #ffb823, 0 0 30px #ffb823;
}
</style>
