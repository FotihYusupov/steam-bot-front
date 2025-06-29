<template>
  <div class="min-h-fit bg-black text-white p-2">
    <!-- Title -->
    <h1 class="text-xl font-bold mb-3 text-[#FFB823]">🚫 Qora ro'yxat</h1>

    <!-- Eslatma -->
    <div class="bg-red-900 text-red-200 text-xs p-2 rounded-lg mb-5 border border-red-600 ">
      <strong>Diqqat:</strong> Ushbu foydalanuvchilar <span class="underline">aldashga urinishgani</span> uchun
      admin tomonidan bloklangan. Ular bilan savdo qilishdan <span class="text-red-300 font-semibold">ehtiyot bo'ling!</span>
    </div>

    <!-- Foydalanuvchilar ro'yxati -->
    <ul class="space-y-3">
      <li
        v-for="user in blacklistedUsers"
        :key="user.id"
        class="flex items-center bg-zinc-900 p-2 rounded-md shadow hover:bg-zinc-800 transition"
      >
        <img
          :src="user.avatar"
          alt="Avatar"
          class="w-12 h-12 rounded-full border border-red-600 object-cover mr-3"
        />
        <div class="flex-1">
          <p class="text-base font-semibold text-[#FFB823]">{{ user.name }}</p>
          <p class="text-xs text-gray-400">@{{ user.username }}</p>
          <p class="text-xs mt-0.5 text-red-300">{{ user.reason }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const blacklistedUsers = [
  {
    id: 1,
    name: "Eshmat Toshmatov",
    username: "eshmat_trade",
    avatar: "/images/image.png",
    reason: "Soxta skinlar bilan aldashga uringan",
  },
  {
    id: 2,
    name: "G'ishmat Xurmatov",
    username: "brick_me",
    avatar: "/images/image.png",
    reason: "Pul yuborilmaganidan keyin blok qilgan",
  },
  {
    id: 3,
    name: "Bolta Tojiyev",
    username: "bolta_t",
    avatar: "/images/image.png",
    reason: "Savdo kelishuvini buzgan",
  },
];
</script>
