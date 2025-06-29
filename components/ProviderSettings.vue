<template>
  <section class="bg-white shadow-xl rounded-2xl p-6 max-w-8xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Providerlar</h2>
      <button
        @click="openCreateModal"
        class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Qo‘shish
      </button>
    </div>

    <!-- Providers Table -->
    <div class="overflow-x-auto rounded-xl">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b border-gray-200">
            <th class="px-5 py-3 text-left text-sm font-semibold text-gray-700">Nomi</th>
            <th class="px-5 py-3 text-left text-sm font-semibold text-gray-700">Website</th>
            <th class="px-5 py-3 text-right text-sm font-semibold text-gray-700">Amallar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="provider in providers"
            :key="provider._id"
            class="bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
          >
            <td class="px-5 py-3 font-medium text-gray-800">{{ provider.name }}</td>
            <td class="px-5 py-3">
              <a
                :href="provider.website"
                target="_blank"
                class="text-sm text-blue-600 hover:underline break-all"
              >
                {{ provider.website }}
              </a>
            </td>
            <td class="px-5 py-3 flex justify-end gap-4">
              <button
                @click="openEditModal(provider)"
                class="text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors duration-150 focus:outline-none focus:underline"
                aria-label="Providerni tahrirlash"
              >
                Tahrirlash
              </button>
              <button
                @click="deleteProvider(provider._id)"
                class="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-150 focus:outline-none focus:underline"
                aria-label="Providerni o‘chirish"
              >
                O‘chirish
              </button>
            </td>
          </tr>
          <tr v-if="!providers.length" class="bg-gray-50">
            <td colspan="3" class="text-center text-gray-500 py-6">
              Hozircha providerlar mavjud emas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4"
      @keydown.esc="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative "
      >
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ isEditMode ? "Providerni tahrirlash" : "Yangi provider qo‘shish" }}
        </h3>
        <form
          @submit.prevent="isEditMode ? updateProvider() : createProvider()"
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provider nomini kiriting"
              aria-required="true"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              v-model="form.website"
              type="url"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
              aria-required="true"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="isSubmitting"
            >
              {{ isEditMode ? "Saqlash" : "Qo‘shish" }}
            </button>
          </div>
        </form>
        <button
          @click="closeModal"
          class="absolute top-7 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const config = useRuntimeConfig()
const token = ref(null)

const providers = ref([])
const showModal = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)
const isSubmitting = ref(false)

const form = ref({
  name: '',
  website: ''
})

onMounted(() => {
  token.value = JSON.parse(localStorage.getItem('token'))
  fetchProviders()
})

async function fetchProviders() {
  try {
    const res = await axios.get(`${config.public.url}/providers`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    providers.value = res.data.data
  } catch (err) {
    toast.error('Providerlarni yuklab bo‘lmadi')
  }
}

function openCreateModal() {
  resetForm()
  showModal.value = true
  isEditMode.value = false
}

function openEditModal(provider) {
  form.value = {
    name: provider.name,
    website: provider.website
  }
  editingId.value = provider._id
  isEditMode.value = true
  showModal.value = true
}

async function createProvider() {
  isSubmitting.value = true
  try {
    await axios.post(`${config.public.url}/providers`, form.value, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    toast.success('Provider qo‘shildi')
    fetchProviders()
    closeModal()
  } catch (err) {
    toast.error('Qo‘shishda xatolik')
  } finally {
    isSubmitting.value = false
  }
}

async function updateProvider() {
  isSubmitting.value = true
  try {
    await axios.put(`${config.public.url}/providers/${editingId.value}`, form.value, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    toast.success('Provider yangilandi')
    fetchProviders()
    closeModal()
  } catch (err) {
    toast.error('Yangilashda xatolik')
  } finally {
    isSubmitting.value = false
  }
}

async function deleteProvider(id) {
  if (!confirm("Haqiqatan ham o‘chirishni xohlaysizmi?")) return
  try {
    await axios.delete(`${config.public.url}/providers/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    toast.success('Provider o‘chirildi')
    fetchProviders()
  } catch (err) {
    toast.error('O‘chirishda xatolik')
  }
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  form.value = { name: '', website: '' }
  editingId.value = null
  isEditMode.value = false
}
</script>

<style scoped>
/* Smooth modal animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .flex.justify-between.items-center {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>