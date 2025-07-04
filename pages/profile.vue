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

    <div class="flex justify-center my-4">
      <button
        @click="isDeleteModalOpen = true"
        class="w-full bg-[#FFB823] hover:bg-yellow-400 text-black font-semibold py-2 rounded shadow transition duration-200"
      >
        Akkauntni o‘chirish
      </button>
    </div>

    <!-- Versiya -->
    <div class="flex justify-center items-center mt-6">
      <p class="text-gray-400">Versiya: {{ config.public.version }}</p>
    </div>

    <div
      v-if="isTradeModalOpen"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70"
    >
      <div
        class="relative h-fit bg-[#111] border border-[#FFB823] p-4 rounded-lg w-80 mt-48"
      >
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
            href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
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

    <!-- Akkauntni o‘chirish modal oynasi -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70 px-4"
    >
      <div
        class="relative h-fit bg-[#111] border border-[#FFB823] p-5 mt-36 rounded-2xl w-full max-w-sm text-white shadow-lg"
      >
        <button
          @click="isDeleteModalOpen = false"
          class="absolute top-2 right-3 text-gray-400 hover:text-white text-3xl"
        >
          &times;
        </button>

        <h2 class="text-center text-[#FFB823] font-bold text-xl mb-2">
          Diqqat!
        </h2>

        <p class="text-center text-gray-300 text-sm mb-3">
          Haqiqatdan ham akkauntingizni o‘chirmoqchimisiz?
        </p>

        <p class="text-center text-red-400 text-xs mb-5 leading-snug">
          ⚠️ Akkaunt o‘chirilgandan so‘ng barcha e'lonlaringiz va
          shaxsiy ma'lumotlar o'chiriladi va ularni qayta tiklashning iloji yo'q.
        </p>

        <div class="flex gap-3">
          <button
            @click="deleteAccount"
            class="w-full bg-[#FFB823] hover:bg-yellow-400 text-black font-semibold py-2 rounded transition"
          >
            Ha, o‘chirish
          </button>
          <button
            @click="isDeleteModalOpen = false"
            class="w-full border border-gray-400 text-gray-300 py-2 rounded font-semibold hover:bg-gray-800 transition"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isProfileModalOpen"
      class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-70"
    >
      <div
        class="relative h-fit bg-[#111] border border-[#FFB823] p-4 rounded-lg w-80 mt-48"
      >
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
const isDeleteModalOpen = ref(false);
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
    console.log(err);
  }
}

async function deleteAccount() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(`${config.public.url}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  } catch (err) {
    console.error("Akkauntni o‘chirishda xatolik:", err);
    alert("Akkauntni o‘chirishda xatolik yuz berdi.");
  }
}
</script>
