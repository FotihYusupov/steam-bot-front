<template>
  <div class="h-screen bg-black text-white p-4 overflow-y-auto">
    <!-- Back Button -->
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        class="flex items-center text-[#FFB823] font-semibold hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 19l-7-7 7-7" />
        </svg>
        Orqaga
      </button>
    </div>

    <!-- Title -->
    <h1 class="text-2xl font-bold text-[#FFB823] mb-4">📘 Ilovadan foydalanish shartlari</h1>

    <!-- Body -->
    <div class="space-y-4 text-sm leading-relaxed text-gray-300">

      <!-- 1 -->
      <p>
        Ushbu ilova foydalanuvchilarga Steam akkauntlaridagi buyumlar (inventory) haqida ma’lumot olish, ularning narxini ko‘rish, baholash va boshqa foydalanuvchilar bilan savdo qilish imkonini beradi.
      </p>

      <!-- 2 -->
      <p>
        Ilova mustaqil platforma bo‘lib, <span class="text-red-400">Valve Corporation yoki Steam</span> bilan hech qanday huquqiy yoki texnik aloqaga ega emas.
      </p>

      <!-- 3 -->
      <p>
        Ilova faqat <span class="text-[#FFB823]">vositachi sifatida xizmat ko‘rsatadi</span>. Platforma orqali amalga oshiriladigan har qanday bitim (sotish, sotib olish yoki almashish) foydalanuvchilarning o‘zaro kelishuvi asosida bo‘ladi.
      </p>

      <!-- 4 -->
      <p>
        <span class="text-yellow-400 font-medium">Platforma bitimlar uchun javobgar emas</span>. Har qanday moddiy zarar, firibgarlik yoki noto‘g‘ri bitimlar uchun foydalanuvchilar o‘zlari javobgardir.
      </p>

      <!-- 5 -->
      <p>
        Foydalanuvchilar <span class="text-green-400">halol, hurmatli va qonuniy</span> yo‘l bilan ilovadan foydalanishlari shart.
      </p>

      <!-- 6 -->
      <p>
        Quyidagi holatlar taqiqlanadi va foydalanuvchi bloklanishiga olib keladi:
        <ul class="list-disc pl-6 mt-2 space-y-1 text-gray-300">
          <li>Firibgarlik yoki boshqa foydalanuvchini aldatishga urinish</li>
          <li>Spam, so‘kinish, tahdid va haqoratli xatti-harakatlar</li>
          <li>Soxta yoki noto‘g‘ri ma’lumotlar bilan savdo qilish</li>
          <li>Ilovani noqonuniy maqsadlarda ishlatish</li>
        </ul>
      </p>

      <!-- 7 -->
      <p>
        Har qanday <span class="text-[#FFB823] font-semibold">shubhali faoliyat</span> aniqlansa, foydalanuvchi hisobiga cheklov qo‘yilishi yoki doimiy bloklanishi mumkin.
      </p>

      <!-- 8 -->
      <p>
        <span class="text-red-400">Platforma har qanday bitim yoki tranzaksiya uchun javobgar emas.</span> Foydalanuvchilar o‘z harakatlari, qarorlari va bitimlari uchun mustaqil ravishda javobgardir.
      </p>

      <!-- 9 -->
      <p>
        Foydalanuvchilar o‘z shaxsiy ma’lumotlarini (login, trade link, token) boshqa foydalanuvchilar bilan baham ko‘rmasliklari kerak. Maxfiylikni ta’minlash sizning zimangizdagi majburiyatdir.
      </p>

      <!-- 10 -->
      <p>
        Ilovadan foydalanish orqali foydalanuvchi quyidagilarga <span class="text-green-400 font-semibold">to‘liq rozilik bildiradi:</span>
        <ul class="list-disc pl-6 mt-2 space-y-1 text-gray-300">
          <li>Yuqoridagi barcha shartlarni o‘qib chiqqani va qabul qilgani</li>
          <li>O‘z harakatlari uchun shaxsan javobgar bo‘lishi</li>
          <li>Firibgarlik holatlarida platformani emas, faqat ishtirokchi tomonlarni aybdor deb bilishi</li>
          <li>Shikoyat yuzasidan ma’muriyat qarorlarini hurmat qilishi</li>
        </ul>
      </p>

      <!-- 11 -->
      <p>
        Ilova ba’zi xizmatlar uchun <span class="text-[#FFB823] font-semibold">pullik imkoniyatlar</span> (masalan: reklama joylashtirish, ilgari surilgan profil, alohida statuslar) taqdim etishi mumkin.
      </p>

      <!-- 12 -->
      <p>
        Qonuniy yoki platforma siyosatiga zid har qanday holatda ilova o‘z foydalanuvchilarini bloklash, o‘chirish yoki kerakli choralarni ko‘rish huquqiga ega.
      </p>

      <!-- 13 -->
      <p>
        Ushbu sahifadagi shartlar va ogohlantirishlar doimiy ravishda yangilanib borilishi mumkin. Oxirgi versiyasini ilovada tekshirib boring.
      </p>

      <!-- 14 -->
      <p>
        <span class="text-green-400 font-semibold">Hurmat bilan foydalaning. Ilovani adolatli hamjamiyat uchun birgalikda rivojlantiraylik.</span>
      </p>

    </div>
  </div>
</template>


<script setup>
function goBack() {
  navigateTo('/profile')
}
</script>

<script>
definePageMeta({
  layout: 'empty'
})
</script>
