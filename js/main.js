"use strict";

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
    render() {
        const card = super.render();
        const body = card.querySelector(".product-card__body");

        const genre = this.createTextElement("p", "product-card__badge", this.data.genre);
        const title = this.createTextElement("h3", "product-card__title", this.data.title);
        const description = this.createTextElement("p", "product-card__description", this.data.description);
        const players = this.createTextElement(
            "p",
            "product-card__facts",
            `Игроки: ${this.data.minPlayers}–${this.data.maxPlayers} · Рейтинг: ${this.data.rating.toFixed(1)}/10`
        );
        const article = this.createTextElement("p", "product-card__meta", `Артикул: ${this.id}`);

        const actions = document.createElement("div");
        actions.className = "product-card__actions";
        const price = this.createTextElement(
            "strong",
            "product-card__price",
            `${this.data.price.toLocaleString("ru-RU")} ₽`
        );
        const availability = this.createTextElement(
            "span",
            "product-card__availability",
            this.data.available ? "В наличии" : "Нет в наличии"
        );
        actions.append(price, availability);
        const addButton = this.createTextElement("button", "button button_primary button_small product-card__add", "Добавить в корзину");
        addButton.type = "button";
        addButton.dataset.action = "add-to-cart";
        addButton.setAttribute("aria-label", `Добавить игру «${this.data.title}» в корзину`);
        addButton.disabled = !this.data.available;
        actions.append(addButton);
        body.append(genre, title, description, players, article, actions);

        return card;
    }
}

const boardGames = [
    {
        id: "BG-001", title: "Колонизаторы", genre: "Стратегия",
        minPlayers: 3, maxPlayers: 4, price: 3490, rating: 8.1,
        description: "Осваивайте остров, добывайте ресурсы и развивайте поселения.",
        image: "images/colonizers.svg", age: { minimum: 10, label: "10+" },
        features: ["обмен ресурсами", "развитие поселений"], available: true
    },
    {
        id: "BG-002", title: "Каркассон", genre: "Семейная",
        minPlayers: 2, maxPlayers: 5, price: 2190, rating: 8.0,
        description: "Выкладывайте тайлы и постепенно создавайте города, дороги и поля.",
        image: "images/carcassonne.svg", age: { minimum: 7, label: "7+" },
        features: ["размещение тайлов", "планирование"], available: true
    },
    {
        id: "BG-003", title: "Имаджинариум", genre: "Ассоциации",
        minPlayers: 3, maxPlayers: 7, price: 1790, rating: 7.8,
        description: "Подбирайте ассоциации к необычным иллюстрациям и угадывайте замыслы игроков.",
        image: "images/imaginarium.svg", age: { minimum: 12, label: "12+" },
        features: ["ассоциации", "иллюстрации"], available: true
    },
    {
        id: "BG-004", title: "Билет на поезд: Европа", genre: "Стратегия",
        minPlayers: 2, maxPlayers: 5, price: 2990, rating: 8.3,
        description: "Стройте железнодорожные маршруты и соединяйте города Европы.",
        image: "images/ticket-europe.svg", age: { minimum: 8, label: "8+" },
        features: ["маршруты", "сбор комплектов"], available: true
    },
    {
        id: "BG-005", title: "Диксит", genre: "Ассоциации",
        minPlayers: 3, maxPlayers: 8, price: 2490, rating: 7.9,
        description: "Создавайте загадки по красочным картам и находите правильные ассоциации.",
        image: "images/dixit.svg", age: { minimum: 8, label: "8+" },
        features: ["карты с иллюстрациями", "творческое мышление"], available: true
    },
    {
        id: "BG-006", title: "Кодовые имена", genre: "Словесная",
        minPlayers: 2, maxPlayers: 8, price: 1590, rating: 7.7,
        description: "Объединяйте слова подсказками и находите агентов своей команды.",
        image: "images/codenames.svg", age: { minimum: 10, label: "10+" },
        features: ["командная игра", "ассоциации"], available: true
    },
    {
        id: "BG-007", title: "Мачи Коро", genre: "Экономическая",
        minPlayers: 2, maxPlayers: 5, price: 1890, rating: 7.1,
        description: "Развивайте небольшой город, получайте доход и открывайте новые предприятия.",
        image: "images/machi-koro.svg", age: { minimum: 7, label: "7+" },
        features: ["развитие города", "кубики"], available: true
    },
    {
        id: "BG-008", title: "Бэнг!", genre: "Карточная",
        minPlayers: 4, maxPlayers: 7, price: 1290, rating: 7.2,
        description: "Участвуйте в противостоянии на Диком Западе и раскройте роли соперников.",
        image: "images/bang.svg", age: { minimum: 8, label: "8+" },
        features: ["скрытые роли", "карточные действия"], available: true
    },
    {
        id: "BG-009", title: "Эволюция", genre: "Стратегия",
        minPlayers: 2, maxPlayers: 4, price: 2490, rating: 8.0,
        description: "Создавайте виды животных и приспосабливайте их к меняющимся условиям.",
        image: "images/evolution.svg", age: { minimum: 12, label: "12+" },
        features: ["развитие видов", "адаптация"], available: true
    },
    {
        id: "BG-010", title: "7 чудес", genre: "Стратегия",
        minPlayers: 3, maxPlayers: 7, price: 3290, rating: 8.2,
        description: "Развивайте древнюю цивилизацию, строя сооружения и развивая науку.",
        image: "images/seven-wonders.svg", age: { minimum: 10, label: "10+" },
        features: ["развитие цивилизации", "выбор карт"], available: true
    },
    {
        id: "BG-011", title: "Цитадели", genre: "Стратегия",
        minPlayers: 2, maxPlayers: 8, price: 1990, rating: 7.8,
        description: "Выбирайте роли, получайте доход и возводите кварталы своего города.",
        image: "images/citadels.svg", age: { minimum: 10, label: "10+" },
        features: ["выбор ролей", "строительство"], available: true
    },
    {
        id: "BG-012", title: "Саботёр", genre: "Карточная",
        minPlayers: 3, maxPlayers: 10, price: 990, rating: 7.0,
        description: "Ищите золото в шахте, не забывая о скрытых намерениях участников.",
        image: "images/saboteur.svg", age: { minimum: 8, label: "8+" },
        features: ["скрытые роли", "командное взаимодействие"], available: true
    },
    {
        id: "BG-013", title: "Пандемия", genre: "Кооперативная",
        minPlayers: 2, maxPlayers: 4, price: 2790, rating: 7.6,
        description: "Работайте сообща, чтобы остановить распространение опасных болезней.",
        image: "images/pandemic.svg", age: { minimum: 8, label: "8+" },
        features: ["совместная цель", "планирование"], available: true
    },
    {
        id: "BG-014", title: "Твистер", genre: "Развлекательная",
        minPlayers: 2, maxPlayers: 6, price: 1190, rating: 6.9,
        description: "Выполняйте задания ведущего и сохраняйте равновесие на игровом поле.",
        image: "images/twister.svg", age: { minimum: 6, label: "6+" },
        features: ["двигательная активность", "простые правила"], available: true
    },
    {
        id: "BG-015", title: "Элиас", genre: "Словесная",
        minPlayers: 4, maxPlayers: 12, price: 1690, rating: 7.5,
        description: "Объясняйте слова команде, не называя их напрямую, и успевайте до конца времени.",
        image: "images/alias.svg", age: { minimum: 10, label: "10+" },
        features: ["командная игра", "объяснение слов"], available: true
    }
];

function renderCatalog(games, container) {
    const catalogFragment = document.createDocumentFragment();
    container.replaceChildren();

    games.forEach((game) => {
        const card = new BoardGame(game);
        catalogFragment.append(card.render());
    });

    container.append(catalogFragment);
}

function getGamesForSixPlayers(games) {
    return games.filter((game) => game.minPlayers <= 6 && game.maxPlayers >= 6);
}

function calculateStrategyTotalPrice(games) {
    return games
        .filter((game) => game.genre === "Стратегия")
        .reduce((total, game) => total + game.price, 0);
}

function renderAnalytics(gamesForSixPlayers, strategyTotalPrice, container) {
    if (!container) {
        return;
    }

    const gameTitles = gamesForSixPlayers.map((game) => game.title);
    const heading = document.createElement("h3");
    heading.className = "catalog-analytics__title";
    heading.textContent = "Результаты обработки данных";

    const sixPlayersResult = document.createElement("p");
    sixPlayersResult.className = "catalog-analytics__text";
    sixPlayersResult.textContent = `Для компании из 6 человек подходят ${gameTitles.length} игр: ${gameTitles.join(", ")}.`;

    const strategyResult = document.createElement("p");
    strategyResult.className = "catalog-analytics__text";
    strategyResult.textContent = `Суммарная стоимость игр жанра «Стратегия»: ${strategyTotalPrice.toLocaleString("ru-RU")} ₽.`;

    container.replaceChildren(heading, sixPlayersResult, strategyResult);
}

function logAnalytics(gamesForSixPlayers, strategyTotalPrice) {
    const gameTitles = gamesForSixPlayers.map((game) => game.title);

    console.group("Лабораторная работа № 4 — анализ каталога");
    console.log("Игры, подходящие для компании из 6 человек:", gameTitles);
    console.log("Количество подходящих игр:", gameTitles.length);
    console.log(
        "Суммарная стоимость игр жанра «Стратегия»:",
        `${strategyTotalPrice.toLocaleString("ru-RU")} ₽`
    );
    console.groupEnd();
}

const STORAGE_KEYS = {
    cart: "igromir_cart_v1",
    completedOrders: "igromir_completed_orders_v1"
};

function readStoredArray(key) {
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

function saveStoredArray(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Не удалось сохранить данные ${key} в localStorage:`, error);
        return false;
    }
}

function normalizeCartItems(items) {
    return items
        .filter((item) => item && typeof item.id === "string")
        .map((item) => ({
            id: item.id,
            quantity: Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1
        }))
        .filter((item) => boardGames.some((game) => game.id === item.id));
}

let cart = normalizeCartItems(readStoredArray(STORAGE_KEYS.cart));
let completedOrders = readStoredArray(STORAGE_KEYS.completedOrders);

function getGameById(gameId) {
    return boardGames.find((game) => game.id === gameId);
}

function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const game = getGameById(item.id);
        return total + (game ? game.price * item.quantity : 0);
    }, 0);
}

function formatPrice(price) {
    return `${price.toLocaleString("ru-RU")} ₽`;
}

function updateCartWidgets() {
    const quantity = getCartQuantity();
    document.querySelectorAll(".cart-widget").forEach((widget) => {
        const count = widget.querySelector(".cart-widget__count");
        if (count) {
            count.textContent = String(quantity);
        }
        widget.setAttribute("aria-label", `Перейти в корзину, ${quantity} товаров`);
    });
}

function renderCartTable() {
    const tableBody = document.querySelector("#cart-table-body");
    if (!tableBody) {
        return;
    }

    tableBody.replaceChildren();

    if (cart.length === 0) {
        const row = document.createElement("tr");
        row.className = "order-table__row";
        const cell = document.createElement("td");
        cell.className = "order-table__cell";
        cell.colSpan = 5;
        cell.textContent = "Корзина пуста. Перейдите в каталог и добавьте настольные игры.";
        row.append(cell);
        tableBody.append(row);
    } else {
        cart.forEach((item) => {
            const game = getGameById(item.id);
            if (!game) {
                return;
            }

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
            totalCell.textContent = formatPrice(game.price * item.quantity);

            row.append(titleCell, idCell, quantityCell, priceCell, totalCell);
            tableBody.append(row);
        });
    }

    const totalCell = document.querySelector("#cart-total");
    if (totalCell) {
        totalCell.textContent = formatPrice(getCartTotal());
    }

    const itemCount = document.querySelector("#cart-summary-count");
    if (itemCount) {
        itemCount.textContent = `${cart.length} позиций, ${getCartQuantity()} экземпляров товаров`;
    }

    const totalSummary = document.querySelector("#cart-summary-total");
    if (totalSummary) {
        totalSummary.textContent = formatPrice(getCartTotal());
    }
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

function renderCheckoutSummary() {
    const countElement = document.querySelector("#checkout-cart-count");
    if (countElement) {
        countElement.textContent = `${getCartQuantity()} экземпляров товаров`;
    }

    const totalElement = document.querySelector("#checkout-cart-total");
    if (totalElement) {
        totalElement.textContent = formatPrice(getCartTotal());
    }

    const ordersElement = document.querySelector("#completed-orders-count");
    if (ordersElement) {
        ordersElement.textContent = String(completedOrders.length);
    }
}

function refreshStoredViews() {
    updateCartWidgets();
    renderCartTable();
    renderCheckoutSummary();
}

function addToCart(gameId) {
    const game = getGameById(gameId);
    if (!game || !game.available) {
        return;
    }

    const existingItem = cart.find((item) => item.id === gameId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: gameId, quantity: 1 });
    }

    if (saveStoredArray(STORAGE_KEYS.cart, cart)) {
        refreshStoredViews();
    }
}

function changeCartItem(gameId, action) {
    const item = cart.find((cartItem) => cartItem.id === gameId);
    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity += 1;
    } else if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter((cartItem) => cartItem.id !== gameId);
        }
    }

    if (saveStoredArray(STORAGE_KEYS.cart, cart)) {
        refreshStoredViews();
    }
}

function bindCatalogDelegation(container) {
    if (!container) {
        return;
    }

    container.addEventListener("click", (event) => {
        const addButton = event.target.closest('[data-action="add-to-cart"]');
        if (!addButton || !container.contains(addButton)) {
            return;
        }

        const card = addButton.closest(".product-card");
        if (!card || !card.dataset.id) {
            return;
        }

        addToCart(card.dataset.id);
        const item = cart.find((cartItem) => cartItem.id === card.dataset.id);
        if (item) {
            addButton.textContent = `В корзине: ${item.quantity}`;
        }
    });
}

function bindCartDelegation(container) {
    if (!container) {
        return;
    }

    container.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-action]");
        if (!actionButton || !container.contains(actionButton)) {
            return;
        }

        const row = actionButton.closest("tr[data-id]");
        if (row) {
            changeCartItem(row.dataset.id, actionButton.dataset.action);
        }
    });
}

function bindCheckoutForm(form) {
    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const status = document.querySelector("#checkout-status");
        if (cart.length === 0) {
            if (status) {
                status.textContent = "Нельзя оформить заказ: корзина пуста. Вернитесь в каталог и добавьте товары.";
                status.className = "checkout-status checkout-status_error";
            }
            return;
        }

        const formData = new FormData(form);
        const customer = Object.fromEntries(formData.entries());
        const order = {
            id: `IG-${Date.now()}`,
            createdAt: new Date().toISOString(),
            customer,
            items: cart.map((item) => {
                const game = getGameById(item.id);
                return {
                    id: item.id,
                    title: game.title,
                    price: game.price,
                    quantity: item.quantity
                };
            }),
            itemCount: getCartQuantity(),
            total: getCartTotal()
        };

        const updatedOrders = [order, ...completedOrders];
        if (!saveStoredArray(STORAGE_KEYS.completedOrders, updatedOrders)) {
            if (status) {
                status.textContent = "Не удалось сохранить заказ в localStorage. Данные корзины не удалены; попробуйте ещё раз.";
                status.className = "checkout-status checkout-status_error";
            }
            return;
        }

        if (!saveStoredArray(STORAGE_KEYS.cart, [])) {
            if (status) {
                status.textContent = "Заказ записан, но не удалось очистить корзину. Обновите страницу и проверьте её содержимое.";
                status.className = "checkout-status checkout-status_error";
            }
            completedOrders = updatedOrders;
            refreshStoredViews();
            return;
        }

        completedOrders = updatedOrders;
        cart = [];
        form.reset();
        refreshStoredViews();

        if (status) {
            status.textContent = `Заказ ${order.id} оформлен. ${order.itemCount} экземпляров товаров на сумму ${formatPrice(order.total)} перенесены в историю заказов. Корзина очищена.`;
            status.className = "checkout-status checkout-status_success";
        }
    });
}

const catalogContainer = document.querySelector("#catalog-container");
if (catalogContainer) {
    renderCatalog(boardGames, catalogContainer);
    const gamesForSixPlayers = getGamesForSixPlayers(boardGames);
    const strategyTotalPrice = calculateStrategyTotalPrice(boardGames);
    renderAnalytics(gamesForSixPlayers, strategyTotalPrice, document.querySelector("#catalog-analytics"));
    logAnalytics(gamesForSixPlayers, strategyTotalPrice);
    bindCatalogDelegation(catalogContainer);
}

bindCartDelegation(document.querySelector("#cart-table-body"));
bindCheckoutForm(document.querySelector("#checkout-form"));
refreshStoredViews();
