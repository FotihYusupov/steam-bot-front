import { defineStore } from 'pinia';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryFetched: false,
  }),
  actions: {
    updateInventory(value) {
      this.inventoryFetched = value;
    },
  },
});
