export const STORAGE_KEYS = {
  cart: "igromir_cart_v1",
  completedOrders: "igromir_completed_orders_v1"
};

export function readStoredArray(key) {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error(`Не удалось прочитать данные ${key} из localStorage:`, error);
    return [];
  }
}

export function saveStoredArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Не удалось сохранить данные ${key} в localStorage:`, error);
    return false;
  }
}

export function normalizeCartItems(items) {
  return items
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1
    }));
}

export function loadCart() {
  return normalizeCartItems(readStoredArray(STORAGE_KEYS.cart));
}

export function loadCompletedOrders() {
  return readStoredArray(STORAGE_KEYS.completedOrders);
}

export function persistCart(cart) {
  return saveStoredArray(STORAGE_KEYS.cart, cart);
}

export function persistCompletedOrders(orders) {
  return saveStoredArray(STORAGE_KEYS.completedOrders, orders);
}
