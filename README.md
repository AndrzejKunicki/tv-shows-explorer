# TV Shows Explorer

Помогает выбрать сериал: поиск, фильтр жанров, сортировка и подборки на стартовой странице.
Данные — [TVmaze API](https://www.tvmaze.com/api) через собственный backend.

- `src/` — клиент: React + Vite + Redux Toolkit.
- `server/` — backend: Express 5 на Node 24 (TypeScript запускается напрямую, без сборки).
  Ищет в TVmaze, фильтрует по жанру, сортирует, делит на страницы и кэширует ответы TVmaze на 5 минут.

Правила архитектуры — в [ARCHITECTURE.md](ARCHITECTURE.md).

## Запуск локально

Нужен Node.js 24 или новее.

```bash
npm install
npm install --prefix server
npm run dev:server   # backend на http://localhost:3000
npm run dev          # клиент; запросы /api/... Vite проксирует на backend
```

## Скрипты

| Скрипт | Что делает |
| --- | --- |
| `npm run dev` | Клиент (Vite) |
| `npm run dev:server` | Backend с перезапуском при изменениях (`node --watch`) |
| `npm test` | Тесты клиента и backend (Vitest, два проекта) |
| `npm run lint` | oxlint по всему репозиторию |
| `npm run build` | Проверка типов клиента и сборка в `dist/` |
| `npm run typecheck:server` | Проверка типов backend |

## API

| Запрос | Ответ |
| --- | --- |
| `GET /api/shows/search?q=lost&genre=Drama&sort=rating&page=2` | Страница результатов: `items`, `page`, `pageCount`, `total`, `genres` |
| `GET /api/shows/index?page=0` | Страница индекса TVmaze |
| `GET /api/schedule?country=US` | Сериалы с эпизодами сегодня |
| `GET /api/health` | `{ "status": "ok" }` |

## Деплой

| Часть | Где | Как |
| --- | --- | --- |
| Клиент | GitHub Pages | [`deploy.yml`](.github/workflows/deploy.yml) на каждый push в `main` |
| Backend | [Render](https://render.com), бесплатный Web Service | [`render.yaml`](render.yaml): каталог `server`, `npm ci`, `npm start` |

Настройка один раз:

1. На render.com: New → Blueprint → репозиторий `tv-shows-explorer`. Render создаст сервис по `render.yaml`
   и будет деплоить backend при каждом push в `main`.
2. В GitHub: Settings → Secrets and variables → Actions → Variables → `VITE_API_URL` = адрес сервиса Render
   (например, `https://tv-shows-explorer-api.onrender.com`), затем перезапустить деплой Pages.

Бесплатный Render засыпает после 15 минут без запросов: первый запрос после этого идёт до минуты,
а кэш в памяти обнуляется.
