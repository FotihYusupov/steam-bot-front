<template>
  <div class="min-h-screen flex flex-col items-center bg-black text-white px-4 text-center">
    <div class="text-6xl mt-40 mb-6 animate-bounce">🛠</div>
    <h1 class="text-2xl font-bold text-[#FFB823] mb-2">
      Texnik ishlar olib borilmoqda
    </h1>
    <p class="text-gray-400 text-sm max-w-sm">
      Botda qisqa muddatli texnik ishlar olib borilmoqda.
      Iltimos, birozdan so‘ng qayta urinib ko‘ring. Noqulayliklar uchun uzr so‘raymiz.
    </p>

    <NuxtLink
      to="/"
      class="mt-6 inline-block px-6 py-2 bg-[#FFB823] text-black font-semibold rounded hover:bg-yellow-400 transition"
    >
      Qayta yuklash
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty'
})
</script>

<style scoped>
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 6s linear infinite;
}
</style>
