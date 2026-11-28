const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getGames() {
  const response = await fetch(`${API_BASE_URL}/games`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const games = await response.json();
  if (!Array.isArray(games)) {
    throw new Error("Сервер вернул данные каталога в неверном формате.");
  }
  return games;
}
