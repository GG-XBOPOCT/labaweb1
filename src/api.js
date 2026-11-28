const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000";

async function readJsonResponse(response, operationName) {
  if (!response.ok) {
    throw new Error(`${operationName}: HTTP ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Получает список настольных игр из коллекции games на сервере. */
export async function getGames() {
  const response = await fetch(`${API_BASE_URL}/games`);
  const games = await readJsonResponse(response, "Не удалось загрузить каталог");

  if (!Array.isArray(games)) {
    throw new Error("Сервер вернул данные каталога в неверном формате.");
  }

  return games;
}

/** Отправляет сформированный заказ в коллекцию orders на сервере. */
export async function createOrder(order) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  return readJsonResponse(response, "Не удалось отправить заказ");
}
