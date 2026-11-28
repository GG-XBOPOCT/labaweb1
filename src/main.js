import "./styles/style.scss";
import { createOrder, getGames } from "./api.js";
import {
  loadCart,
  loadCompletedOrders,
  persistCart,
  persistCompletedOrders,
} from "./storage.js";
import {
  bindCartDelegation,
  bindCatalogDelegation,
  clearRequestStatus,
  formatPrice,
  getCartQuantity,
  getCartTotal,
  renderAnalytics,
  renderCartTable,
  renderCatalog,
  renderCheckoutSummary,
  setRequestStatus,
  updateCartWidgets
} from "./ui.js";

let games = [];
let gamesLoaded = false;
let cart = loadCart();
let completedOrders = loadCompletedOrders();

const catalogContainer = document.querySelector("#catalog-container");
const catalogStatus = document.querySelector("#catalog-status");
const analyticsContainer = document.querySelector("#catalog-analytics");
const cartTableBody = document.querySelector("#cart-table-body");
const cartDataStatus = document.querySelector("#cart-data-status");
const checkoutDataStatus = document.querySelector("#checkout-data-status");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutStatus = document.querySelector("#checkout-status");

function refreshViews() {
  updateCartWidgets(cart);

  if (catalogContainer && gamesLoaded) {
    renderCatalog(games, catalogContainer, cart);
  }
  if (cartTableBody && gamesLoaded) {
    renderCartTable(cart, games);
  }
  if (checkoutForm && gamesLoaded) {
    renderCheckoutSummary(cart, games, completedOrders);
  }
}

function addToCart(gameId) {
  const game = games.find((item) => item.id === gameId);
  if (!game || !game.available) return;

  const nextCart = cart.map((item) => ({ ...item }));
  const existingItem = nextCart.find((item) => item.id === gameId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    nextCart.push({ id: gameId, quantity: 1 });
  }

  if (!persistCart(nextCart)) {
    setRequestStatus(catalogStatus, "Не удалось сохранить корзину в браузере. Проверьте доступность localStorage.", "error");
    return;
  }

  cart = nextCart;
  refreshViews();
}

function changeCartItem(gameId, action) {
  const nextCart = cart.map((item) => ({ ...item }));
  const item = nextCart.find((cartItem) => cartItem.id === gameId);
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      const index = nextCart.findIndex((cartItem) => cartItem.id === gameId);
      nextCart.splice(index, 1);
    }
  } else {
    return;
  }

  if (!persistCart(nextCart)) {
    setRequestStatus(cartDataStatus, "Не удалось сохранить изменение корзины в браузере.", "error");
    return;
  }

  cart = nextCart;
  refreshViews();
}

function setCheckoutMessage(message, kind = "info") {
  if (!checkoutStatus) return;
  checkoutStatus.textContent = message;
  checkoutStatus.className = `checkout-status${kind === "success" ? " checkout-status_success" : ""}${kind === "error" ? " checkout-status_error" : ""}`;
}

async function submitCheckout(event) {
  event.preventDefault();

  if (!gamesLoaded) {
    setCheckoutMessage("Каталог пока не загружен. Проверьте, запущен ли сервер данных, и обновите страницу.", "error");
    return;
  }

  if (cart.length === 0) {
    setCheckoutMessage("Нельзя оформить заказ: корзина пуста. Вернитесь в каталог и добавьте товары.", "error");
    return;
  }

  const submitButton = checkoutForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || "Отправить заказ";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Отправка заказа...";
  }

  const formData = new FormData(checkoutForm);
  const customer = Object.fromEntries(formData.entries());
  const orderPayload = {
    createdAt: new Date().toISOString(),
    customer,
    items: cart.map((item) => {
      const game = games.find((entry) => entry.id === item.id);
      return {
        id: item.id,
        title: game.title,
        price: Number(game.price),
        quantity: item.quantity
      };
    }),
    itemCount: getCartQuantity(cart),
    total: getCartTotal(cart, games),
    address: String(customer.address || "")
  };

  setCheckoutMessage("Отправляем заказ на сервер...", "info");

  try {
    const serverOrder = await createOrder(orderPayload);
    const completedOrder = { ...orderPayload, ...serverOrder };

    completedOrders = [completedOrder, ...completedOrders];
    const historySaved = persistCompletedOrders(completedOrders);

    cart = [];
    const cartCleared = persistCart(cart);
    checkoutForm.reset();
    refreshViews();

    let message = `Заказ ${completedOrder.id ?? "без номера"} успешно отправлен на сервер. В массив завершённых заказов добавлена запись на сумму ${formatPrice(orderPayload.total)}. Корзина очищена.`;
    if (!historySaved) {
      message += " Не удалось сохранить локальную копию истории в браузере.";
    }
    if (!cartCleared) {
      message += " Не удалось сохранить пустую корзину в браузере; перед повторной отправкой проверьте заказ на сервере.";
    }
    setCheckoutMessage(message, "success");
    console.info("Заказ успешно создан на сервере:", completedOrder);
  } catch (error) {
    console.error("Ошибка отправки заказа:", error);
    setCheckoutMessage(`Не удалось отправить заказ: ${error.message}. Корзина не очищена, данные формы сохранены. Проверьте соединение с сервером и повторите попытку.`, "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
}

async function loadRemoteGames() {
  const statuses = [catalogStatus, cartDataStatus, checkoutDataStatus].filter(Boolean);
  statuses.forEach((status) => setRequestStatus(status, "Загружаем данные настольных игр с сервера...", "loading"));

  try {
    games = await getGames();
    const availableIds = new Set(games.map((game) => game.id));
    const validCart = cart.filter((item) => availableIds.has(item.id));
    if (validCart.length !== cart.length) {
      cart = validCart;
      persistCart(cart);
    }

    gamesLoaded = true;
    statuses.forEach(clearRequestStatus);
    refreshViews();

    if (checkoutForm) {
      setCheckoutMessage(
        cart.length > 0
          ? "Проверьте состав заказа и заполните данные доставки."
          : "Корзина пуста. Перейдите в каталог и добавьте настольные игры.",
        "info"
      );
    }

    if (catalogContainer) {
      renderAnalytics(games, analyticsContainer);
      console.info(`Каталог загружен: ${games.length} настольных игр получено GET-запросом.`);
    }
  } catch (error) {
    console.error("Ошибка загрузки каталога:", error);
    const message = `Не удалось получить список настольных игр с сервера: ${error.message}. Проверьте, запущен ли json-server на порту 3000.`;
    statuses.forEach((status) => setRequestStatus(status, message, "error"));
  }
}

updateCartWidgets(cart);
bindCatalogDelegation(catalogContainer, addToCart);
bindCartDelegation(cartTableBody, changeCartItem);
checkoutForm?.addEventListener("submit", submitCheckout);

const needsGames = Boolean(catalogContainer || cartTableBody || checkoutForm);
if (needsGames) {
  loadRemoteGames();
} else {
  console.info("Страница не требует загрузки серверного каталога.");
}
