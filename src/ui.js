export function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("ru-RU")} ₽`;
}

export function getCartQuantity(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(cart, games) {
  const gamesById = new Map(games.map((game) => [game.id, game]));
  return cart.reduce((total, item) => {
    const game = gamesById.get(item.id);
    return total + (game ? Number(game.price) * item.quantity : 0);
  }, 0);
}

class ItemCard {
  constructor(data) {
    this.id = data.id;
    this.data = data;
  }

  createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = text;
    return element;
  }

  render() {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = this.id;
    card.setAttribute("aria-label", `Настольная игра: ${this.data.title}`);

    const imageContainer = document.createElement("div");
    imageContainer.className = "product-card__image";

    const image = document.createElement("img");
    image.setAttribute("src", this.data.image);
    image.setAttribute("alt", `Иллюстрация настольной игры «${this.data.title}»`);
    image.setAttribute("width", "520");
    image.setAttribute("height", "380");
    image.setAttribute("loading", "lazy");
    imageContainer.append(image);

    const body = document.createElement("div");
    body.className = "product-card__body";
    card.append(imageContainer, body);
    return card;
  }
}

class BoardGame extends ItemCard {
  render(quantityInCart = 0) {
    const card = super.render();
    const body = card.querySelector(".product-card__body");
    const game = this.data;
    const rating = Number(game.rating);

    const genre = this.createTextElement("p", "product-card__badge", game.genre || "Настольная игра");
    const title = this.createTextElement("h3", "product-card__title", game.title);
    const description = this.createTextElement("p", "product-card__description", game.description || "");
    const players = this.createTextElement(
      "p",
      "product-card__facts",
      `Игроки: ${game.minPlayers}–${game.maxPlayers}${Number.isFinite(rating) ? ` · Рейтинг: ${rating.toFixed(1)}/10` : ""}`
    );
    const article = this.createTextElement("p", "product-card__meta", `Артикул: ${game.id}`);

    const actions = document.createElement("div");
    actions.className = "product-card__actions";
    const price = this.createTextElement("strong", "product-card__price", formatPrice(game.price));
    const availability = this.createTextElement(
      "span",
      "product-card__availability",
      game.available ? "В наличии" : "Нет в наличии"
    );
    actions.append(price, availability);

    const addButton = this.createTextElement(
      "button",
      "button button_primary button_small product-card__add",
      quantityInCart > 0 ? `В корзине: ${quantityInCart}` : "Добавить в корзину"
    );
    addButton.type = "button";
    addButton.dataset.action = "add-to-cart";
    addButton.setAttribute("aria-label", `Добавить игру «${game.title}» в корзину`);
    addButton.disabled = !game.available;
    actions.append(addButton);

    body.append(genre, title, description, players, article, actions);
    return card;
  }
}

export function renderCatalog(games, container, cart) {
  if (!container) return;

  const cartById = new Map(cart.map((item) => [item.id, item.quantity]));
  const fragment = document.createDocumentFragment();
  container.replaceChildren();

  games.forEach((game) => {
    fragment.append(new BoardGame(game).render(cartById.get(game.id) || 0));
  });

  container.append(fragment);
}

export function renderAnalytics(games, container) {
  if (!container) return;

  const gamesForSixPlayers = games.filter((game) => game.minPlayers <= 6 && game.maxPlayers >= 6);
  const strategyTotalPrice = games
    .filter((game) => game.genre === "Стратегия")
    .reduce((total, game) => total + Number(game.price), 0);
  const gameTitles = gamesForSixPlayers.map((game) => game.title);

  const heading = document.createElement("h3");
  heading.className = "catalog-analytics__title";
  heading.textContent = "Результаты обработки данных";

  const sixPlayersResult = document.createElement("p");
  sixPlayersResult.className = "catalog-analytics__text";
  sixPlayersResult.textContent = `Для компании из 6 человек подходят ${gameTitles.length} игр: ${gameTitles.join(", ")}.`;

  const strategyResult = document.createElement("p");
  strategyResult.className = "catalog-analytics__text";
  strategyResult.textContent = `Суммарная стоимость игр жанра «Стратегия»: ${formatPrice(strategyTotalPrice)}.`;

  container.replaceChildren(heading, sixPlayersResult, strategyResult);

  console.group("Лабораторная работа № 6 — анализ каталога, данные получены GET-запросом");
  console.log("Игры, подходящие для компании из 6 человек:", gameTitles);
  console.log("Количество подходящих игр:", gameTitles.length);
  console.log("Суммарная стоимость игр жанра «Стратегия»:", formatPrice(strategyTotalPrice));
  console.groupEnd();
}

export function updateCartWidgets(cart) {
  const quantity = getCartQuantity(cart);
  document.querySelectorAll(".cart-widget").forEach((widget) => {
    const count = widget.querySelector(".cart-widget__count");
    if (count) count.textContent = String(quantity);
    widget.setAttribute("aria-label", `Перейти в корзину, ${quantity} товаров`);
  });
}

export function renderCartTable(cart, games) {
  const tableBody = document.querySelector("#cart-table-body");
  if (!tableBody) return;

  const gamesById = new Map(games.map((game) => [game.id, game]));
  tableBody.replaceChildren();

  const validCart = cart.filter((item) => gamesById.has(item.id));
  if (validCart.length === 0) {
    const row = document.createElement("tr");
    row.className = "order-table__row";
    const cell = document.createElement("td");
    cell.className = "order-table__cell";
    cell.colSpan = 5;
    cell.textContent = "Корзина пуста. Перейдите в каталог и добавьте настольные игры.";
    row.append(cell);
    tableBody.append(row);
  } else {
    validCart.forEach((item) => {
      const game = gamesById.get(item.id);
      const row = document.createElement("tr");
      row.className = "order-table__row";
      row.dataset.id = game.id;

      const titleCell = document.createElement("td");
      titleCell.className = "order-table__cell";
      titleCell.textContent = game.title;

      const idCell = document.createElement("td");
      idCell.className = "order-table__cell";
      idCell.textContent = game.id;

      const quantityCell = document.createElement("td");
      quantityCell.className = "order-table__cell cart-quantity";
      const decreaseButton = createCartActionButton("decrease", "−", `Уменьшить количество игры «${game.title}»`);
      const quantityValue = document.createElement("span");
      quantityValue.className = "cart-quantity__value";
      quantityValue.textContent = String(item.quantity);
      const increaseButton = createCartActionButton("increase", "+", `Увеличить количество игры «${game.title}»`);
      quantityCell.append(decreaseButton, quantityValue, increaseButton);

      const priceCell = document.createElement("td");
      priceCell.className = "order-table__cell";
      priceCell.textContent = formatPrice(game.price);

      const totalCell = document.createElement("td");
      totalCell.className = "order-table__cell";
      totalCell.textContent = formatPrice(Number(game.price) * item.quantity);

      row.append(titleCell, idCell, quantityCell, priceCell, totalCell);
      tableBody.append(row);
    });
  }

  const total = getCartTotal(validCart, games);
  const totalCell = document.querySelector("#cart-total");
  if (totalCell) totalCell.textContent = formatPrice(total);

  const itemCount = document.querySelector("#cart-summary-count");
  if (itemCount) itemCount.textContent = `${validCart.length} позиций, ${getCartQuantity(validCart)} экземпляров товаров`;

  const totalSummary = document.querySelector("#cart-summary-total");
  if (totalSummary) totalSummary.textContent = formatPrice(total);
}

function createCartActionButton(action, symbol, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button_secondary button_small cart-quantity__button";
  button.dataset.action = action;
  button.setAttribute("aria-label", label);
  button.textContent = symbol;
  return button;
}

export function renderCheckoutSummary(cart, games, completedOrders) {
  const countElement = document.querySelector("#checkout-cart-count");
  if (countElement) countElement.textContent = `${getCartQuantity(cart)} экземпляров товаров`;

  const totalElement = document.querySelector("#checkout-cart-total");
  if (totalElement) totalElement.textContent = formatPrice(getCartTotal(cart, games));

  const ordersElement = document.querySelector("#completed-orders-count");
  if (ordersElement) ordersElement.textContent = String(completedOrders.length);
}

export function setRequestStatus(element, message, kind = "loading") {
  if (!element) return;
  element.hidden = false;
  element.textContent = message;
  element.className = `request-status request-status_${kind}`;
}

export function clearRequestStatus(element) {
  if (!element) return;
  element.hidden = true;
  element.textContent = "";
}

export function bindCatalogDelegation(container, onAdd) {
  if (!container) return;

  container.addEventListener("click", (event) => {
    const addButton = event.target.closest('[data-action="add-to-cart"]');
    if (!addButton || !container.contains(addButton) || addButton.disabled) return;

    const card = addButton.closest(".product-card");
    if (card?.dataset.id) onAdd(card.dataset.id);
  });
}

export function bindCartDelegation(container, onChange) {
  if (!container) return;

  container.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton || !container.contains(actionButton)) return;

    const row = actionButton.closest("tr[data-id]");
    if (row) onChange(row.dataset.id, actionButton.dataset.action);
  });
}
