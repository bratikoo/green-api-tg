# green-api-tg

Веб-приложение (React + TypeScript + Vite) для работы с GREEN API — чат-интерфейс в стиле Telegram.

## Требования

- [Node.js](https://nodejs.org/) 20+
- npm

## Локальный запуск

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev
```

Приложение откроется по адресу http://localhost:5173 (порт по умолчанию Vite).

## Скрипты

| Команда          | Описание                                  |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Запуск dev-сервера с HMR                  |
| `npm run build`  | Сборка production (tsc -b && vite build)  |
| `npm run preview`| Локальный просмотр собранной сборки       |
| `npm run lint`   | Проверка кода ESLint                      |

## Использование

Для работы нужен аккаунт [GREEN API](https://green-api.com/): создайте инстанс и получите `idInstance` и `apiTokenInstance`.

Укажите их в файле `.env` в корне проекта:

```env
VITE_API_URL=<apiUrl>
VITE_ID_INSTANCE=<idInstance>
VITE_API_TOKEN_INSTANCE=<apiTokenInstance>
```

После изменения `.env` перезапустите dev-сервер.
