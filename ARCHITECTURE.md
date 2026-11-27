# Simple Architecture

Стек: клиент — React + Vite + TypeScript + Redux Toolkit (`src/`), backend — Express + Node + TypeScript (`server/`).
Источник данных: TVMaze API (https://api.tvmaze.com); к нему обращается только backend.

Этот файл — общая схема и правила клиента. Правила backend — в `.claude/rules/backend.md`
(загружаются при работе с `server/`), форматирование — в `.claude/rules/code-style.md`.

## Frontend и backend

```
View ──событие──▶ Presenter ──вызов──▶ Task ──▶ Store
                     ▲                   │  └─▶ src/api/ ──HTTP──▶ server/ (routes → tasks → storage, TVmaze)
                     └────результат──────┘
```

### Кто за что отвечает

Бизнес-логика — правила, которые не зависят от того, как данные показаны, — живёт на backend.
Frontend отвечает за взаимодействие с пользователем и отображение.

| Backend (`server/`) | Frontend (`src/`) |
| --- | --- |
| Обращения к TVmaze и кэш ответов на 5 минут | Обращения только к своему API (`src/api/`) |
| Поиск: фильтр по жанру, сортировка, пагинация, список жанров | Параметры поиска в store, отмена устаревших запросов, debounce ввода |
| Какие сериалы попадают в ряды стартовой страницы и в каком порядке (популярность, рейтинг, «скрытые жемчужины», случайные страницы) | Сколько сериалов помещается в ряд, раскладка стены постеров, подсказки «Popular on TV today» из первых сериалов |
| Проверка параметров запросов (`400`), ошибки TVmaze (`502`) | Показ загрузки и ошибок, локальное состояние UI |
| Избранное: хранение, проверка id, данные шоу берёт у TVmaze сам, повторное добавление ничего не меняет, порядок «новые первыми» | Копия списка избранного в store, обновляется только после ответа сервера; звёздочка, счётчик, панель, toast с результатом |
| — | Повторная загрузка упавшей подборки при следующем показе стартовой страницы |

Правило: если правило можно сформулировать без слов «экран», «кнопка», «ряд из N карточек» — его место на backend.

## 1. Дерево каталогов = иерархия компонентов

- Структура каталогов повторяет дерево компонентов. Корень — `src/App/`, страницы (`SearchPage`) — его дети.
- Компонент, который используется только как дочерний для одного родителя, лежит в каталоге родителя.
- Компонент может импортировать только: своих детей (подкаталоги), `src/components/`, `src/api/`,
  `src/store/`, `src/tasks/` и другие общие каталоги. Импорты из каталогов соседей/«кузенов» запрещены.
- Когда компонент начинает использоваться вторым родителем — переносим его в `src/components/`.

## 2. Переиспользуемые компоненты

- Лежат в `src/components/` и подчиняются тем же правилам (каталог, view, presenter), например `FavoriteStar`.

## 3. Устройство компонента: View + Presenter + Tasks

```
ComponentName/
  ComponentName.tsx        ← view: только JSX
  ComponentName.module.css
  logic/
    usePresenter.ts        ← presenter и все хуки компонента
    tasks/
      doSomething.ts       ← задачи, которые вызывает только этот компонент
```

- `ComponentName.tsx` (view) — только JSX. Единственная логика: вызов `usePresenter(props)`.
  Никаких `useState`, `useEffect`, обработчиков и вычислений во view.
- `logic/usePresenter.ts` — логика компонента: состояние UI, эффекты, обработчики, подготовка данных для view,
  вызов задач, навигация. Бизнес-логики в presenter нет — она в задачах. Возвращает готовые данные и обработчики.
- `logic/` необязателен: компонент, который лишь отображает пропсы, состоит из одного view.

### Задачи (tasks)

Задача — вариант использования (use case): то, что пользователь просит приложение сделать
(«найти сериал», «добавить в избранное»). Её можно описать словами, не упомянув ни одного инструмента.

- **Обычная функция** (TypeScript): параметры → тело → `return`. Не thunk, не сага, не хук, не класс
  и не метод store. Может быть `async`.
- **Название — глагол**: `findShows`, `toggleFavorite`, `goToNextPage`. Один файл — одна задача,
  имя файла совпадает с именем функции. Не влезает в 120 строк — задача становится папкой.
- **Расположение:** `ComponentName/logic/tasks/`. Задача, которую вызывают несколько компонентов, —
  в общем `src/tasks/` (например, `findShows` вызывают `SearchBar` и `PopularToday`).
- **Одна задача — одна функция снаружи.** Внутри её можно разбить на мелкие функции, а самостоятельный кусок,
  нужный в разных сценариях, — вынести в отдельную задачу и вызвать как обычную функцию
  (`goToNextPage` → `loadResults`).
- **В задаче нет React:** ни хуков, ни JSX, ни импортов из `react`, ни локального состояния UI, ни навигации,
  ни уведомлений. Если понадобился хук — этот кусок относится к presenter.
- **Со store задача работает напрямую через фасад домена** (`showsStore`, `discoverStore`, `favoritesStore`):
  вызывает его именованные операции — `showsStore.getPage()`, `favoritesStore.add(show)`. Задача — контроллер:
  ей доступен любой домен. `redux-thunk`, `createAsyncThunk`, `redux-saga` не используем: они мешают `await`
  и возврату результата.
- **С сервером задача говорит через `src/api/`** (`searchShows`, `addFavorite`), а не через `fetch`.
- **Задача возвращает результат** (`{ error }`, новое состояние). Presenter дожидается её через `await`
  и по результату решает, что показать: ошибку, toast, новое состояние кнопки.

Пример — `src/tasks/toggleFavorite.ts` и presenter, который её вызывает
(`src/components/FavoriteStar/logic/usePresenter.ts`):

```ts
// Задача: API + фасад store, результат вызывающему. Store меняется только после ответа сервера.
// waitBeforeAdding — обычная функция от presenter (анимация); задача про React и DOM ничего не знает.
export const toggleFavorite = async (show: Show, waitBeforeAdding = async () => {}) => {
  const wasFavorite = favoritesStore.isFavorite(show.id);

  try {
    if (wasFavorite) {
      await removeFavorite(show.id);
      favoritesStore.remove(show.id);
    } else {
      const saved = await addFavorite(show.id);
      await waitBeforeAdding();
      favoritesStore.add(saved);
    }

    return { error: null, isFavorite: !wasFavorite };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message, isFavorite: wasFavorite };
  }
};

// Presenter: loading локально, анимация как шаг задачи, по результату — toast.
const handleClick = async () => {
  setIsPending(true);
  const result = await toggleFavorite(show, () => flyToFavorites(buttonRef.current));
  dispatch(toastShown(toToastMessage(show.name, result), result.error ? 'error' : 'success'));
  setIsPending(false);
};
```

### Явный вызов задач вместо реактивных цепочек

- Действие пользователя → обработчик в presenter → **явный вызов задачи**. Нужна другая страница —
  вызываем задачу (`goToNextPage`), а не меняем `page` в store в расчёте, что `useEffect` это заметит.
- Несколько шагов вызываем **по очереди** (`await` одной задачи за другой). Порядок действий виден в коде;
  когда много эффектов подписано на разные поля, неясно, что запустило загрузку.
- Ошибка не должна оставлять store в противоречивом состоянии: либо пишем по результату (данные меняются
  только после успешного ответа, как в `toggleFavorite`), либо оптимистично с откатом или явным
  состоянием ошибки. В явном подходе откат безопасен — на поле не подписан ни один эффект.
- `useEffect` не используем для запуска сценариев по изменению store или пропсов. Допустимо: вызов задачи
  при монтировании и подписка на внешние источники (таймер, события окна) с cleanup.
  Debounce — таймер в задаче (`findShowsDebounced`), а не эффект на изменение текста поля.

```ts
// ❌ Реактивно: смена page запускает эффект. Загрузка упала — в store уже page = 2,
// а вернуться нельзя без флагов: смена page снова запустит эффект.
useEffect(() => {
  dispatch(fetchShows(page));
}, [page]);

// ✅ Явно (Pagination/logic/tasks/goToNextPage.ts): проверка границы, запись, загрузка.
export const goToNextPage = async () => {
  const page = showsStore.getPage();
  if (page >= showsStore.getPageCount()) {
    return { error: null };
  }

  showsStore.setPage(page + 1);
  const result = await loadResults();

  return result;
};
```

### Presenter и store

- **Чтение** store из presenter — через `useAppSelector`: он подписывает компонент на store, и view
  перерисовывается при изменении. `store.getState()` — разовый снимок без подписки, для отображения не подходит.
- **Запись** из presenter — только примитивная: один `dispatch` без условий и шагов, на который не реагирует
  ни один эффект (например, показать toast). Как только запись обрастает логикой (проверки, несколько шагов,
  вызов API) — выносим её в задачу.
- **Loading и error** одного действия, нужные только этому компоненту, держим в presenter (`useState`).
  В store кладём то, что нужно нескольким компонентам.

## 4. Код, который не является компонентом

- Вызовы API — в `src/api/` (`request.ts` — общий `fetch` к backend, `showsApi.ts`, `favoritesApi.ts`).
  Функции из `src/api/` вызывают задачи; `fetch` напрямую не вызывает никто, кроме `src/api/request.ts`.
- Адрес backend в production-сборке — `VITE_API_URL`; локально Vite проксирует `/api` на `localhost:3000`.
- Типы лежат рядом с тем, к чему относятся: типы компонента — в его каталоге, типы API — в `src/api/types.ts`.
- Общий принцип (colocation): код лежит как можно ближе к месту использования; только когда он
  становится общим, он переносится в общий каталог на уровне `src/`.

## 5. Store: Redux (Redux Toolkit)

- Store глобальный и лежит в `src/store/`:
  - `store.ts` — конфигурация и типы `RootState`, `AppDispatch`,
  - `hooks.ts` — типизированные `useAppDispatch` и `useAppSelector`,
  - `<domain>/` (`shows`, `discover`, `favorites`, `toasts`) — slice, `selectors.ts` и фасад для задач
    `<domain>Store.ts`.
- Store — это база данных: состояние и именованные операции записи/чтения в терминах предметной области.
  Сценариев (последовательность шагов, вызовы API, проверки) в store нет — они в задачах.
- **Фасад** `<domain>Store.ts` — единственное место, где задачи встречаются с API Redux (`getState`, `dispatch`,
  экшены, селекторы). При смене библиотеки переписывается фасад, а задачи остаются прежними.
  Других абстракций над store заранее не вводим.
- С store работают presenter (через типизированные хуки) и задачи (через фасад). View никогда не импортирует store.
- Производные данные, которые клиент считает сам, — только то, что относится к отображению (сколько сериалов
  помещается в ряд, раскладка стены постеров), — в селекторах (`createSelector`), а не в компонентах.
- Локальное состояние UI, которое не нужно другим компонентам (значение инпута, loading/error одного
  действия, открыт ли список), остаётся в presenter (`useState`).
- Уведомления (toast) — общее состояние UI в `src/store/toasts/`: показать его может любой presenter,
  отображает `App/Toaster`. Задача уведомлений не показывает: она возвращает результат.

## 6. Стили и тесты

- Стили и тесты лежат рядом с файлами, к которым относятся, — в том же каталоге.
- Стили: `ComponentName.module.css` рядом с `ComponentName.tsx`.
- Тесты: `FileName.test.ts(x)` рядом с тестируемым файлом; расширение теста совпадает с расширением файла.
- `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` — глобальные (`globals: true` в `vite.config.ts`,
  типы `vitest/globals` только в `tsconfig.test.json`): из `vitest` их не импортируем, только типы
  (`import type { Mock } from 'vitest'`). Вне `*.test.ts(x)` они недоступны (см. `code-style.md`, §6).
  Testing Library при этом сам очищает DOM после каждого теста.
- У каждого файла `.ts`/`.tsx` есть свой тест. Исключения: стили, файлы только с типами (`types.ts`, `*.d.ts`),
  точка входа `main.tsx` и тестовые фикстуры/хелперы (`test*.ts(x)`, например `testShows.ts`, `testStore.tsx`).
- View тестируем с замоканным `usePresenter` (`vi.mock('./logic/usePresenter')`) и замоканными дочерними
  компонентами, presenter — через `renderHookWithStore` из `@src/store/testStore` с замоканными задачами.
- Задачи тестируем как обычные функции, без React. API мокаем (`vi.mock('@src/api/showsApi')`).
  - Обычно мокаем фасад (`vi.mock('@src/store/shows/showsStore')`) и проверяем вызовы его операций —
    такой тест не зависит от библиотеки store.
  - Когда важно реальное поведение данных (гонки запросов), используем настоящий store: мокаем модуль store
    фабрикой `mockStoreModule` из `@src/store/testAppStore`, в `beforeEach` берём свежий store через
    `resetAppStore()` и проверяем `store.getState()`. Так же тестируем сами фасады.

## 7. Размер файлов

- Каждый файл — максимум 120 строк (включая импорты и типы).
- Если файл длиннее — разбиваем его на абстракции (дочерние компоненты, отдельные хуки, вспомогательные функции).
