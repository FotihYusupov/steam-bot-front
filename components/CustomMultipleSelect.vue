<template>
  <div class="relative w-full">
    <!-- Selected options -->
    <div
      class="w-full flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      @click="toggleDropdown"
      @keydown.stop="handleKeydown"
      tabindex="0"
      id="selectedOptionsEl"
    >
      <span
        class="flex items-center bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow"
        v-for="(option, index) in selectedOptions"
        :key="index"
        @click.stop="removeOption(option)"
      >
        {{ option.username }}
        <button
          class="ml-2 text-xs bg-transparent text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </span>
      <span v-if="!selectedOptions.length && !searchQuery" class="text-gray-500 text-sm">
        Select options
      </span>
      <span v-else-if="searchQuery" class="text-gray-800 text-sm font-medium">
        {{ searchQuery }}
      </span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <!-- Options -->
      <div
        v-for="option in filteredOptions"
        :key="option._id"
        class="p-2 text-sm cursor-pointer hover:bg-blue-600 hover:text-white flex items-center justify-between"
        :class="{ 'bg-blue-500 text-white': isSelected(option) }"
        @click="selectOption(option)"
      >
        {{ option.username }}
        <span v-if="isSelected(option)" class="text-xs">✔</span>
      </div>
      <div v-if="filteredOptions.length === 0" class="p-2 text-gray-500 text-sm">
        No options found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Props
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const dropdownOpen = ref(false);
const searchQuery = ref("");

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option._id))
);

const filteredOptions = computed(() =>
  props.options.filter((option) =>
    option.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  if (!dropdownOpen.value) {
    searchQuery.value = "";
  }
};

const handleKeydown = (event) => {
  const key = event.key;
  if (key.length === 1 && key.match(/[a-zA-Z0-9]/)) {
    dropdownOpen.value = true;
    searchQuery.value += key;
  } else if (key === "Backspace") {
    searchQuery.value = searchQuery.value.slice(0, -1);
  }
};

const selectOption = (option) => {
  const valueIndex = props.modelValue.indexOf(option._id);
  if (valueIndex === -1) {
    emit("update:modelValue", [...props.modelValue, option._id]);
  } else {
    const newValues = [...props.modelValue];
    newValues.splice(valueIndex, 1);
    emit("update:modelValue", newValues);
  }
  searchQuery.value = "";
  dropdownOpen.value = true;
  selectedOptionsEl.focus();
};

const toggleOption = (option) => {
  selectOption(option);
};

const isSelected = (option) => props.modelValue.includes(option._id);

const removeOption = (option) => {
  const newValues = props.modelValue.filter((value) => value !== option._id);
  emit("update:modelValue", newValues);
  selectedOptionsEl.focus();
};
</script>
