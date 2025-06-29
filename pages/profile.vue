<template>
  <div class="min-h-fit bg-black text-white">
    <!-- Profil -->
    <div class="flex flex-col items-center mb-6">
      <img
        :src="user.photo"
        alt="Avatar"
        class="w-32 h-32 rounded-full object-cover border-4 border-[#FFB823]"
      />
      <p class="mt-3 text-2xl font-semibold">
        {{ user.firstName || "Foydalanuvchi" }}
      </p>
    </div>

    <!-- Sozlamalar -->
    <div>
      <ul class="space-y-2 p-2 bg-zinc-900 rounded-lg">
        <li
          @click="isTradeModalOpen = true"
          class="flex justify-between p-1 border-b border-gray-700 font-semibold cursor-pointer hover:bg-zinc-800 rounded"
        >
          <div class="flex items-center">
            <p class="mr-1">🔗</p>
            <p>Trade Link ni o'zgartirish</p>
          </div>
          <img src="/images/arrow-right.svg" width="24" height="24" />
        </li>
        <li
          @click="isProfileModalOpen = true"
          class="flex justify-between p-1 border-b border-gray-700 font-semibold cursor-pointer hover:bg-zinc-800 rounded"
        >
          <div class="flex items-center">
            <p class="mr-1">⚙️</p>
            <p>Profileni sozlash</p>
          </div>
          <img src="/images/arrow-right.svg" width="24" height="24" />
        </li>
        <li
          class="flex justify-between p-1 border-b border-gray-700 font-semibold cursor-pointer hover:bg-zinc-800 rounded"
        >
          <NuxtLink to="/info" class="flex w-full items-center justify-between">
            <div class="flex items-center">
              <p class="mr-1">ℹ️</p>
              <p>Foydalanish shartlari</p>
            </div>
            <img src="/images/arrow-right.svg" width="24" height="24" />
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Versiya -->
    <div class="flex justify-center items-center mt-6">
      <p class="text-gray-400">Versiya: {{ config.public.version }}</p>
    </div>

    <!-- Trade Modal -->
    <div
      v-if="isTradeModalOpen"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70"
    >
      <div class="relative h-fit bg-[#111] border border-[#FFB823] p-4 rounded-lg w-80 mt-48">
        <button
          @click="isTradeModalOpen = false"
          class="absolute top-1.5 right-2 text-gray-300 hover:text-white text-4xl"
        >
          &times;
        </button>

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

    <!-- Profile Modal -->
    <div
      v-if="isProfileModalOpen"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70"
    >
      <div class="relative h-fit bg-[#111] border border-[#FFB823] p-4 rounded-lg w-80 mt-48">
        <button
          @click="isProfileModalOpen = false"
          class="absolute top-1 right-2 text-gray-300 hover:text-white text-4xl"
        >
          &times;
        </button>

        <p class="text-center text-[#FFB823] font-semibold mb-4">
          Profil ma'lumotlarini tahrirlash
        </p>
        <input
          v-model="user.firstName"
          placeholder="Ism"
          class="w-full p-2 mb-3 rounded bg-black text-white border border-[#FFB823]"
        />
        <button
          @click="updateProfile"
          class="w-full bg-[#FFB823] hover:bg-yellow-400 text-black font-bold py-2 rounded"
        >
          Saqlash
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const config = useRuntimeConfig();
const tradeUrl = ref("");
const isTradeModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const user = ref({});

onMounted(async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get(`${config.public.url}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = res.data.data;
    tradeUrl.value = "";
  } catch (err) {
    console.error("Profilni olishda xatolik:", err);
  }
});

async function saveUrl() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${config.public.url}/users/set-trade-url`,
      { tradeUrl: tradeUrl.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    user.value = res.data.data;
    isTradeModalOpen.value = false;
  } catch (err) {
    console.error("Trade URL saqlashda xatolik:", err);
    alert("Xatolik yuz berdi");
  }
}

async function updateProfile() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.put(
      `${config.public.url}/users`,
      {
        firstName: user.value.firstName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    user.value = res.data.data;
    localStorage.setItem("user", JSON.stringify(user.value));
    isProfileModalOpen.value = false;
  } catch (err) {
    console.log(err)
  }
}
</script>

