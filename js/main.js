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

    container.append(heading, sixPlayersResult, strategyResult);
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

const catalogContainer = document.querySelector("#catalog-container");

if (catalogContainer) {
    renderCatalog(boardGames, catalogContainer);

    const gamesForSixPlayers = getGamesForSixPlayers(boardGames);
    const strategyTotalPrice = calculateStrategyTotalPrice(boardGames);
    const analyticsContainer = document.querySelector("#catalog-analytics");

    renderAnalytics(gamesForSixPlayers, strategyTotalPrice, analyticsContainer);
    logAnalytics(gamesForSixPlayers, strategyTotalPrice);
}
