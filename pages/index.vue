<template>
  <div class="min-h-screen pb-4 bg-black text-white">
    <div class="flex justify-between items-center mb-2">
      <h1 class="m-0 text-2xl font-bold text-[#FFB823]">
        Inventory ({{ items.length || 0 }})
      </h1>
      <div
        @click="refreshInventory()"
        class="relative flex items-center justify-center cursor-pointer"
        :class="{ 'pointer-events-none opacity-50': isRefreshButtonDisabled }"
      >
        <Transition name="fade">
          <div
            v-if="isRefreshButtonDisabled"
            class="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded shadow"
          >
            {{ remainingSeconds }}s qoldi
          </div>
        </Transition>
        <img
          class="pointer-events-none"
          src="/images/restart.svg"
          width="26"
          height="26"
          alt="Refresh"
        />
      </div>
    </div>

    <input
      v-model="search"
      type="text"
      placeholder="Qidirish..."
      class="w-full mb-4 p-2 rounded bg-[#1a1a1a] text-white border border-[#FFB823] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB823]"
    />

    <div
      v-if="inventoryFetched && filteredItems.length"
      class="grid grid-cols-2 gap-4 mb-20"
    >
      <div
        v-for="item in filteredItems"
        :key="item._id"
        class="bg-[#0f0f0f] border border-[#FFB823] rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition-transform duration-300 h-full"
      >
        <div class="flex flex-col h-full">
          <img
            :src="item.image_url"
            :alt="item.market_hash_name"
            class="w-full bg-zinc-900 h-32 object-contain border-b border-[#FFB823]"
            loading="lazy"
          />
          <div class="flex flex-col justify-between flex-1 p-3">
            <div>
              <h2 class="text-base font-semibold text-[#FFB823] mb-1 truncate">
                {{ item.market_hash_name }}
              </h2>
              <p class="text-sm text-gray-300">
                O'rtacha narxi:
                <span v-if="item.steam_price">{{ item.steam_price }} USD</span>
                <span v-else class="italic text-gray-500">yo'q</span>
              </p>
              <p class="text-sm text-gray-300 mb-2">
                Taklif narxi:
                <span v-if="item.suggested_price"
                  >{{ item.suggested_price }} USD</span
                >
                <span v-else class="italic text-gray-500">yo'q</span>
              </p>
            </div>
            <div v-if="isItemOnCooldown(item)" class="mt-2">
              <div class="text-center text-sm text-gray-400 mb-2">
                {{ formatCooldown(item.nextAnnounce) }}
              </div>
              <button
                @click="openManagementModal(item)"
                :disabled="!item.messageId"
                class="w-full bg-[#3a3f47] text-white py-1 rounded transition duration-150 shadow-md hover:bg-[#4a505a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3a3f47]"
              >
                Boshqarish
              </button>
            </div>
            <button
              v-else
              @click="sellItem(item)"
              :disabled="!item.steam_price"
              class="w-full bg-[#FFB823] text-black py-1 rounded hover:bg-yellow-400 transition mt-2 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Sotish
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center text-center text-gray-400 mt-20"
    >
      <span class="text-xl">Hech qanday item topilmadi</span>
    </div>

    <Transition name="fade-scale">
      <div
        v-if="selectedItem"
        class="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center"
        @click.self="closeModal"
      >
        <div
          class="h-fit mt-24 bg-[#111] border border-[#FFB823] rounded-xl p-5 w-80 text-white shadow-xl"
        >
          <div
            class="flex justify-between items-start mb-4 border-b border-[#FFB823] pb-3"
          >
            <img
              :src="selectedItem.image_url"
              :alt="selectedItem.market_hash_name"
              class="h-24 w-24 object-contain mr-3 rounded"
            />
            <div class="flex-1">
              <h2 class="text-[18px] font-semibold text-[#FFB823] mb-1">
                {{ selectedItem.market_hash_name }}
              </h2>
              <p class="text-sm text-gray-300">
                Steam narxi:
                <span v-if="selectedItem.steam_price"
                  >{{ selectedItem.steam_price }} USD</span
                >
                <span v-else class="italic text-gray-500">yo'q</span>
              </p>
              <p class="text-sm text-gray-300">
                Taklif narxi:
                <span v-if="selectedItem.suggested_price"
                  >{{ selectedItem.suggested_price }} USD</span
                >
                <span v-else class="italic text-gray-500">yo'q</span>
              </p>
            </div>
          </div>

          <label class="flex items-center justify-between gap-2 mb-3">
            <span class="text-sm">Bepul berish</span>
            <input
              type="checkbox"
              v-model="isFree"
              class="accent-[#FFB823] w-5 h-5"
            />
          </label>

          <input
            v-model.number="customPrice"
            :disabled="isFree"
            type="number"
            placeholder="Narx (USD)"
            class="w-full mb-3 p-2 rounded bg-black text-white border border-[#FFB823] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB823] disabled:bg-[#1a1a1a] disabled:text-gray-500 disabled:placeholder-gray-600 disabled:cursor-not-allowed"
          />

          <p
            v-if="commentRes.status !== 200"
            class="text-sm text-red-500 mb-3 text-center"
          >
            {{ commentRes.message }}
          </p>

          <textarea
            v-model="comment"
            rows="2"
            placeholder="Izoh..."
            class="w-full mb-4 p-2 rounded bg-black text-white border border-[#FFB823] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB823]"
          ></textarea>

          <div class="flex justify-between gap-x-3">
            <button
              @click="submitSell"
              class="flex-1 bg-[#FFB823] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
            >
              Yuborish
            </button>
            <button
              @click="closeModal"
              class="flex-1 text-gray-300 hover:text-white underline"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade-scale">
      <div
        v-if="showManagementModal"
        class="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-start pt-20"
        @click.self="closeManagementModal"
      >
        <div
          class="w-[22rem] bg-[#0f0f0f] border border-[#FFB823] rounded-2xl p-6 text-white"
        >
          <h2 class="text-2xl font-bold text-[#FFB823] mb-1 text-center">
            E'lonni Boshqarish
          </h2>

          <p
            class="w-full text-lg text-gray-400 mb-4 text-center leading-relaxed whitespace-pre-line break-words"
          >
            {{ formatCooldown(manageNextAnnounce) }}
          </p>

          <input
            v-model.number="managementPrice"
            :disabled="managementIsFree"
            type="number"
            placeholder="Yangi narx (USD)"
            class="w-full mb-4 p-3 rounded-lg bg-[#000] text-white border border-[#FFB823] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFB823] transition duration-150"
          />

          <label class="flex items-center gap-3 mb-4 text-sm">
            <input
              type="checkbox"
              v-model="managementIsFree"
              class="w-5 h-5 accent-[#FFB823]"
            />
            <span>Bepulga o'zgartirish</span>
          </label>

          <textarea
            v-model="managementComment"
            rows="3"
            placeholder="Yangi izoh..."
            class="w-full p-3 mb-4 rounded-lg bg-[#000] text-white border border-[#FFB823] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFB823] transition duration-150"
          ></textarea>

          <div class="flex gap-3">
            <button
              @click="deleteAnnouncement"
              :disabled="!itemToManage.messageId"
              class="w-full border-2 border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:text-white transition duration-150"
            >
              O'chirish
            </button>

            <button
              @click="updateAnnouncement"
              class="w-full border-2 border-[#FFB823] text-[#FFB823] hover:bg-[#FFB823] hover:text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#1fa067] hover:text-white transition duration-150"
            >
              Saqlash
            </button>
          </div>

          <div class="flex justify-center">
            <button
              @click="closeManagementModal"
              class="w-fit text-gray-400 hover:text-[#FFB823] text-sm text-center mt-4 underline transition"
            >
              Bekor Qilish
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade-scale">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        @click.self="showModal = false"
      >
        <div
          class="bg-[#111] border border-[#FFB823] text-white rounded-2xl px-6 py-6 max-w-sm w-[90%] text-center shadow-xl relative"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full"
            :class="modalType === 'success' ? 'bg-green-500' : 'bg-red-500'"
          >
            <svg
              v-if="modalType === 'success'"
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h3 class="text-lg font-bold mb-2">
            {{ modalType === "success" ? "Muvaffaqiyatli!" : "Xatolik!" }}
          </h3>
          <p class="text-sm text-gray-300">{{ modalMessage }}</p>

          <div class="flex flex-col gap-3 mt-4">
            <button
              @click="showModal = false"
              class="px-4 py-2 rounded bg-[#FFB823] text-black hover:bg-yellow-400 font-bold"
            >
              Yopish
            </button>
            <a
              v-if="modalType === 'success'"
              href="https://t.me/skinChanger_official"
              target="_blank"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-bold block"
            >
              Kanalga qo'shilish
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import axios from "axios";
import { useInventoryStore } from "~/stores/user";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch, computed, onUnmounted } from "vue";

const config = useRuntimeConfig();
const InventoryStore = useInventoryStore();
const { inventoryFetched } = storeToRefs(InventoryStore);

const items = ref([]);
const search = ref("");

const selectedItem = ref(null);
const isFree = ref(false);
const customPrice = ref("");
const comment = ref("");

const showModal = ref(false);
const modalMessage = ref("E'lon yuborildi.");
const modalType = ref("success");

const commentRes = ref({});

const isRefreshButtonDisabled = ref(false);
const remainingSeconds = ref(0);
let refreshCountdownInterval = null;

const itemCooldownTimeouts = new Map();

const showManagementModal = ref(false);
const itemToManage = ref(null);
const managementPrice = ref("");
const managementComment = ref("");
const managementIsFree = ref(false);
const manageNextAnnounce = ref(0);

onMounted(() => {
  if (inventoryFetched.value) fetchInventory();
  checkRefreshCooldown();
});

onUnmounted(() => {
  clearInterval(refreshCountdownInterval);
  itemCooldownTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  itemCooldownTimeouts.clear();
});

watch(inventoryFetched, async (newVal) => {
  if (newVal) {
    await fetchInventory();
  }
});

async function fetchInventory() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get(`${config.public.url}/users/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    items.value = res.data.data || [];
    items.value.forEach((item) => {
      if (item.nextAnnounce) {
        startItemCountdown(item);
      }
    });
  } catch (err) {
    console.error("Inventar olishda xatolik:", err);
  }
}

async function refreshInventory() {
  if (isRefreshButtonDisabled.value) return;

  const now = Date.now();
  localStorage.setItem("lastRefreshTime", now.toString());

  startRefreshCountdown(300);
  isRefreshButtonDisabled.value = true;

  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.put(
      `${config.public.url}/users/update-inventory`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    items.value = res.data.data || [];
    items.value.forEach((item) => {
      if (item.nextAnnounce) {
        startItemCountdown(item);
      }
    });
  } catch (err) {
    console.error("Inventory yangilashda xatolik:", err);
    clearInterval(refreshCountdownInterval);
    isRefreshButtonDisabled.value = false;
    remainingSeconds.value = 0;
    localStorage.removeItem("lastRefreshTime");
    modalType.value = "error";
    modalMessage.value = "Inventarni yangilashda xatolik yuz berdi.";
    showModal.value = true;
  }
}

function checkRefreshCooldown() {
  const lastTime = localStorage.getItem("lastRefreshTime");
  if (!lastTime) return;

  const elapsed = Math.floor((Date.now() - Number(lastTime)) / 1000);
  const secondsLeft = 300 - elapsed;

  if (secondsLeft > 0) {
    isRefreshButtonDisabled.value = true;
    startRefreshCountdown(secondsLeft);
  } else {
    localStorage.removeItem("lastRefreshTime");
  }
}

function startRefreshCountdown(seconds) {
  remainingSeconds.value = seconds;
  clearInterval(refreshCountdownInterval);

  refreshCountdownInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--;
    } else {
      clearInterval(refreshCountdownInterval);
      isRefreshButtonDisabled.value = false;
      localStorage.removeItem("lastRefreshTime");
    }
  }, 1000);
}

function sellItem(item) {
  selectedItem.value = item;
  isFree.value = false;
  customPrice.value = item.suggested_price
    ? item.suggested_price.toString()
    : "";
  comment.value = "";
}

function closeModal() {
  selectedItem.value = null;
}

function openManagementModal(item) {
  itemToManage.value = item;
  managementPrice.value = item.user_price || item.suggested_price;
  managementComment.value = item.comment || "";
  managementIsFree.value = item.isFree || false;
  showManagementModal.value = true;
  manageNextAnnounce.value = item.nextAnnounce || 0;
}

function closeManagementModal() {
  showManagementModal.value = false;
  itemToManage.value = null;
  managementPrice.value = "";
  managementComment.value = "";
  managementIsFree.value = false;
}

async function updateAnnouncement() {
  if (!itemToManage.value) return;

  if (
    !managementIsFree.value &&
    (isNaN(Number(managementPrice.value)) || Number(managementPrice.value) <= 0)
  ) {
    modalType.value = "error";
    modalMessage.value = "Narxni to'g'ri kiriting.";
    showModal.value = true;
    return;
  }

  try {
    const payload = {
      price: managementIsFree.value ? 0 : parseFloat(managementPrice.value),
      comment: managementComment.value,
      isFree: managementIsFree.value,
    };

    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.put(
      `${config.public.url}/user-inventory/${itemToManage.value._id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedItem = res.data.data;
    const index = items.value.findIndex((item) => item._id === updatedItem._id);
    if (index !== -1) {
      Object.assign(items.value[index], updatedItem);
    }

    closeManagementModal();
    modalType.value = "success";
    modalMessage.value = "E'lon muvaffaqiyatli o'zgartirildi.";
    showModal.value = true;
  } catch (err) {
    modalType.value = "error";
    modalMessage.value = "E'lonni o'zgartirishda xatolik yuz berdi.";
    showModal.value = true;
    console.error("E'lonni yangilashda xatolik:", err);
  }
}

async function deleteAnnouncement() {
  if (!itemToManage.value) return;

  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(
      `${config.public.url}/user-inventory/${itemToManage.value._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    closeManagementModal();
    modalType.value = "success";
    modalMessage.value = "E'lon muvaffaqiyatli o'chirildi.";
    showModal.value = true;
  } catch (err) {
    modalType.value = "error";
    modalMessage.value = "E'lonni o'chirishda xatolik yuz berdi.";
    showModal.value = true;
    console.error("E'lonni o'chirishda xatolik:", err);
  }
}

function checkMessageForSpam(message) {
  const lowerCaseMessage = message.toLowerCase();

  if (message.length > 500) {
    return {
      status: 400,
      message: "Xabar uzunligi ruxsat etilgan chegaradan tashqarida.",
    };
  }

  const spamKeywords = [
    "aksiya",
    "chegirma",
    "pul ishlang",
    "qo'shiling",
    "kanal",
    "guruh",
    "investitsiya",
    "tez pul",
    "daromad",
    "kripto",
    "sayt",
    "link",
    "bot",
    "admin",
    "aloqa",
    "telegram",
    "instagram",
    "tiktok",
    "facebook",
  ];
  for (const keyword of spamKeywords) {
    if (lowerCaseMessage.includes(keyword)) {
      return {
        status: 400,
        message: `Xabarda potentsial reklama kalit so'zi (${keyword}) topildi.`,
      };
    }
  }

  const urlRegex =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\.[a-z]{2,4}\/)|(t\.me\/)|(instagram\.com\/)|(facebook\.com\/)/g;
  if (urlRegex.test(lowerCaseMessage)) {
    return {
      status: 400,
      message: "Xabarda link yoki sayt manzili topildi.",
    };
  }

  const repetitionRegex = /(.)\1{3,}/g;
  if (repetitionRegex.test(message)) {
    return {
      status: 400,
      message: "Xabarda takrorlanuvchi belgilar mavjud.",
    };
  }

  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const emojiMatches = message.match(emojiRegex);
  if (emojiMatches && emojiMatches.length > 5) {
    return {
      status: 400,
      message: "Xabarda juda ko'p emojilar mavjud.",
    };
  }

  const uppercaseCount = (message.match(/[A-Z]/g) || []).length;
  if (message.length > 0 && uppercaseCount / message.length > 0.5) {
    return {
      status: 400,
      message: "Xabarning katta qismi katta harflarda yozilgan.",
    };
  }

  return {
    status: 200,
    message: "Xabar reklama belgilarini o'z ichiga olmaydi.",
  };
}

async function submitSell() {
  const checkMessageRes = checkMessageForSpam(comment.value);
  if (checkMessageRes.status !== 200) {
    commentRes.value = checkMessageRes;
    return;
  }

  if (isItemOnCooldown(selectedItem.value)) {
    const diff = Math.ceil(
      (selectedItem.value.nextAnnounce - Date.now()) / (1000 * 60)
    );
    modalType.value = "error";
    modalMessage.value = `Bu item uchun keyingi e'lon ${diff} daqiqadan keyin mumkin.`;
    showModal.value = true;
    return;
  }

  if (
    !isFree.value &&
    (isNaN(Number(customPrice.value)) || Number(customPrice.value) <= 0)
  ) {
    modalType.value = "error";
    modalMessage.value = "Narxni to‘g‘ri kiriting.";
    showModal.value = true;
    return;
  }

  try {
    const payload = {
      price: isFree.value ? 0 : parseFloat(customPrice.value),
      comment: comment.value,
      isFree: isFree.value,
    };

    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(
      `${config.public.url}/user-inventory/${selectedItem.value._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedItem = res.data.data;
    const index = items.value.findIndex((item) => item._id === updatedItem._id);
    if (index !== -1) {
      Object.assign(items.value[index], updatedItem);
      startItemCountdown(items.value[index]);
    }

    modalType.value = "success";
    modalMessage.value =
      "E'lon muvaffaqiyatli yuborildi! E'lonni ko'rish uchun kanalga qo'shiling.";
    showModal.value = true;
    closeModal();
  } catch (err) {
    modalType.value = "error";
    modalMessage.value = "Xatolik yuz berdi. Qaytadan urinib ko‘ring.";
    showModal.value = true;
    console.error("E'lon yuborishda xatolik:", err);
  }
}

const filteredItems = computed(() => {
  if (!search.value.trim()) return items.value;
  const lowerCaseSearch = search.value.toLowerCase();
  return items.value.filter((item) =>
    item.market_hash_name.toLowerCase().includes(lowerCaseSearch)
  );
});

function isItemOnCooldown(item) {
  return item.nextAnnounce && Date.now() < item.nextAnnounce;
}

function formatCooldown(timestamp) {
  const now = Date.now();
  let timeLeft = timestamp - now;

  if (timeLeft <= 0) {
    return "Sotish";
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function startItemCountdown(item) {
  if (itemCooldownTimeouts.has(item._id)) {
    clearTimeout(itemCooldownTimeouts.get(item._id));
  }

  const updateCooldown = () => {
    const index = items.value.findIndex((i) => i._id === item._id);
    if (index === -1) {
      itemCooldownTimeouts.delete(item._id);
      return;
    }

    const currentItem = items.value[index];
    if (Date.now() >= currentItem.nextAnnounce) {
      delete currentItem.nextAnnounce;
      itemCooldownTimeouts.delete(item._id);
    } else {
      const timeLeft = currentItem.nextAnnounce - Date.now();
      const nextUpdateDelay = timeLeft % 1000 || 1000;
      const timeoutId = setTimeout(updateCooldown, nextUpdateDelay);
      itemCooldownTimeouts.set(currentItem._id, timeoutId);
    }
  };

  updateCooldown();
}
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
