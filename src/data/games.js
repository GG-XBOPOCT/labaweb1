// Исходный массив каталога вынесен в отдельный модуль данных.
// Тот же db.json используется локальным json-server в лабораторной работе № 6.
import database from "../../db.json";

export const gamesData = database.games;
