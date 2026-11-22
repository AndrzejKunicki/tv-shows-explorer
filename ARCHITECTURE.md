# Simple Architecture

Стек: React + Vite + TypeScript. Источник данных: TVMaze API (https://api.tvmaze.com).

## 1. Дерево каталогов = иерархия компонентов

- Структура каталогов повторяет дерево компонентов. Корень — `src/App/`,
  страницы (например, `SearchPage`, `ShowDetailsPage`) — его дети.
- Компонент, который используется только как дочерний для одного родителя, лежит в каталоге родителя.
- Компонент может импортировать только: своих детей (подкаталоги), `src/components/`, `src/api/`
  и другие общие каталоги. Импорты из каталогов соседей/«кузенов» запрещены.
- Когда компонент начинает использоваться вторым родителем — переносим его в `src/components/`.

## 2. Переиспользуемые компоненты

- Лежат в `src/components/` и подчиняются тем же правилам (каталог, view, presenter).

## 3. Устройство компонента: View + Presenter

- У каждого компонента свой каталог `ComponentName/`.
- `ComponentName.tsx` (view) — только JSX. Единственная логика: вызов `usePresenter(props)`.
  Никаких `useState`, `useEffect`, обработчиков и вычислений во view.
- `logic/usePresenter.ts` — логика компонента (состояние UI, эффекты, обработчики, подготовка данных,
  вызов задач). Бизнес-логика — в задачах (`logic/tasks/`, см. ниже).
  Лежит в подкаталоге `logic/` того же компонента. Возвращает готовые данные и обработчики для view.
- `logic/usePresenter.ts` необязателен — только если у компонента есть логика.
  Компонент, который лишь отображает пропсы, состоит из одного view.

### Пример структуры

```
src/
  App/
    App.tsx
    SearchPage/
      SearchPage.tsx
      types.ts
      logic/
        usePresenter.ts
      SearchBar/
        SearchBar.tsx
        logic/
          usePresenter.ts
          tasks/
            findShows.ts
      ResultsList/
        ResultsList.tsx
        ShowCard/
          ShowCard.tsx
  components/
    Spinner/
      Spinner.tsx
  api/
    tvmaze.ts
    types.ts
```

### Пример компонента

```tsx
// SearchBar/logic/usePresenter.ts
import { useState } from 'react';

export const usePresenter = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };
  return { query, handleChange, handleSubmit };
};
```

```tsx
// SearchBar/SearchBar.tsx
import { usePresenter } from './logic/usePresenter';

export const SearchBar = (props: { onSearch: (q: string) => void }) => {
  const { query, handleChange, handleSubmit } = usePresenter(props);
  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
    </form>
  );
};
```

### Задачи (tasks)

Задача — вариант использования (use case): то, что пользователь просит приложение сделать
(«найти сериал», «выйти из аккаунта»). Это и есть бизнес-логика. Её можно описать словами, не упомянув
ни одного инструмента, — так же её пишем и в коде.

```
View ──событие──▶ Presenter ──вызов──▶ Task ──▶ Store
                     ▲                   │  └─▶ api/
                     └────результат──────┘
```

- **Задача — обычная функция** (TypeScript): параметры → тело → `return`. Не thunk, не сага, не хук,
  не класс и не метод store. Задача может быть `async`.
- **Название — глагол**, описывающий действие: `logout`, `unsubscribe`, `findShows`.
  Один файл — одна задача, имя файла совпадает с именем функции: `tasks/findShows.ts`.
- **Расположение:** каталог `tasks/` на том же уровне, что и `usePresenter.ts`: `ComponentName/logic/tasks/`.
  Задача, которую вызывают несколько компонентов, переносится в общий каталог `src/tasks/`
  (тот же принцип colocation, что в §4): например, `src/tasks/findShows.ts` вызывают `SearchBar` и `PopularToday`.
- **Одна задача — одна функция снаружи.** Внутри её можно разбить на сколько угодно мелких функций
  (и файлов), но вызывающий видит один вызов. Самостоятельный кусок, нужный в разных сценариях,
  выносится в отдельную задачу и вызывается из этой как обычная функция (`logout` → `unsubscribeFromPush`).
- **В задаче нет React:** ни хуков, ни JSX, ни импортов из `react`, ни компонентов, ни локального
  состояния UI, ни навигации. Если переписать UI на другой фреймворк, переписываются view и presenter,
  а задачи остаются почти без изменений. Если в задаче понадобился хук — этот кусок относится к presenter,
  а задача получает из него готовые значения параметрами.
- **Со store задача работает напрямую через фасад домена:** импортирует объект store домена
  (`showsStore`, `discoverStore`) и вызывает его именованные операции чтения/записи —
  `showsStore.getPage()`, `showsStore.setPage(2)`, `discoverStore.setFeed('index', shows)`.
  Задача — контроллер: ей доступен любой store / домен. Посредники (`redux-thunk`, `createAsyncThunk`,
  `redux-saga`) не используем — они мешают `await` и возврату результата.
- **Фасад store** — `src/store/<domain>/<domain>Store.ts`: store как база данных — только get/set
  в терминах предметной области, без сценариев. Это единственное место, где задачи встречаются
  с API библиотеки (`store.getState()`, `store.dispatch(...)`, экшены, селекторы). При смене библиотеки
  (Redux → Zustand/MobX) переписывается фасад, а задачи остаются прежними. Presenter читает store
  через хуки (`useAppSelector`) и фасад не использует — ему нужна реактивность.
- **Других абстракций над store заранее не вводим.** Универсальные адаптеры, интерфейсы или передачу store
  параметром добавляем только при конкретной потребности (несколько реализаций, реальная миграция,
  сложности с тестами).
- **С внешним миром задача говорит через `src/api/`:** вызывает функции API-клиента
  (`searchShows(query, signal)`), а не `fetch`. Задача не знает, HTTP это или веб-сокеты.
- **Задача возвращает результат** вызывающему. Presenter дожидается её через `await` и по результату
  решает, что показать: ошибку, редирект, новое состояние кнопки.

```ts
// SearchPage/logic/tasks/findShows.ts — без React, store домена импортируется напрямую
import { searchShows } from '@src/api/tvmaze';
import { showsStore } from '@src/store/shows/showsStore';

type FindShowsResult = { error: string | null };

export const findShows = async (query: string): Promise<FindShowsResult> => {
  try {
    const items = await searchShows(query);
    showsStore.receiveResults(query, items);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
```

```ts
// SearchPage/logic/usePresenter.ts — ждёт задачу, loading/error держит локально
import { useState } from 'react';
import { findShows } from './tasks/findShows';

export const usePresenter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    const result = await findShows(query);
    setIsLoading(false);
    setError(result.error);
  };

  return { isLoading, error, handleSearch };
};
```

#### Явный вызов задач вместо реактивных цепочек

- Действие пользователя → обработчик в presenter → **явный вызов задачи**. Нужна другая страница —
  вызываем задачу «загрузить сериалы страницы», а не меняем `page` в store в расчёте, что `useEffect`
  это заметит и загрузит данные.
- Несколько шагов вызываем **по очереди** (`await` одной задачи за другой) — в обработчике или внутри
  задачи. Порядок действий виден в коде. Когда много эффектов подписано на разные поля, неясно,
  что за чем происходит и что запустило загрузку.
- Изменения store при ошибке должны быть обратимы. Два варианта:
  - **предпочтительно — запись по результату:** новая страница и её данные записываются вместе и только
    после успешной загрузки; если загрузка не удалась, store остаётся прежним — откатывать нечего
    (`loadShowsPage` ниже);
  - **допустимо — оптимистичная запись с откатом** в той же задаче: сначала меняем `page`, при ошибке
    возвращаем прежнее значение (`goToPage` ниже). В явном подходе откат безопасен: на `page` не подписан
    ни один эффект. В реактивном откат снова запустил бы эффект и загрузку.
- `useEffect` не используем для запуска сценариев по изменению store или пропсов. Допустимо:
  вызов задачи при монтировании и подписка на внешние источники (таймер, события окна) с cleanup.
  Debounce — таймер в обработчике ввода, а не эффект на изменение `query`.

```ts
// ❌ Реактивно: смена page запускает эффект
const page = useAppSelector(selectPage);

useEffect(() => {
  dispatch(fetchShows(page));
}, [page]);

const handleNext = () => dispatch(pageChanged(page + 1));
// Загрузка страницы 2 упала, а в store уже page = 2: UI показывает «страницу 2»
// со старыми данными или пустой список. Вернуться на страницу 1 нельзя без
// дополнительных полей и флагов — смена page снова запустит эффект.
```

```ts
// ✅ Явно: SearchPage/logic/tasks/loadShowsPage.ts
import { fetchShowIndex } from '@src/api/tvmaze';
import { showsStore } from '@src/store/shows/showsStore';

type LoadShowsPageResult = { error: string | null };

export const loadShowsPage = async (page: number): Promise<LoadShowsPageResult> => {
  try {
    const shows = await fetchShowIndex(page);
    // Страница и данные меняются вместе и только при успехе.
    showsStore.setPageWithShows(page, shows);

    return { error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
```

```ts
// ✅ SearchPage/logic/usePresenter.ts — обработчик явно вызывает задачу
const handleNext = async () => {
  setIsLoading(true);
  const result = await loadShowsPage(page + 1);
  setIsLoading(false);
  // При ошибке page в store не изменился — пользователь остаётся на текущей странице.
  setError(result.error);
};
```

Оптимистичная запись с откатом и задача, которая вызывает другую задачу:

```ts
// ✅ SearchPage/logic/tasks/goToPage.ts
import { showsStore } from '@src/store/shows/showsStore';
import { loadShows } from './loadShows';

type GoToPageResult = { error: string | null };

export const goToPage = async (nextPage: number): Promise<GoToPageResult> => {
  const currentPage = showsStore.getPage();
  showsStore.setPage(nextPage);

  // loadShows читает page из store и возвращает { error }.
  const result = await loadShows();

  if (result.error) {
    // Откат возможен: на смену page не подписан ни один эффект.
    showsStore.setPage(currentPage);
  }

  return result;
};
```

```ts
// ✅ SearchPage/logic/tasks/goToNextPage.ts — проверка границы и вызов другой задачи
import { showsStore } from '@src/store/shows/showsStore';
import { goToPage } from './goToPage';

export const goToNextPage = async () => {
  const nextPage = showsStore.getPage() + 1;
  const isAfterLastPage = nextPage > showsStore.getPageCount();

  if (isAfterLastPage) {
    return { error: null };
  }

  const result = await goToPage(nextPage);

  return result;
};
```

Пока идёт загрузка, UI уже показывает новый номер страницы — кнопки пагинации на это время блокируем
(`isLoading` в presenter):

```ts
// ✅ Pagination/logic/usePresenter.ts — loading локально, на время задачи
import { useState } from 'react';
import { goToNextPage } from './tasks/goToNextPage';

export const usePresenter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setIsLoading(true);
    const result = await goToNextPage();
    setIsLoading(false);
    setError(result.error);
  };

  const isDisabled = isLoading;

  return { isDisabled, error, handleNext };
};
```

#### Presenter и store

- Presenter **не содержит бизнес-логику** — её выносим в задачи. Presenter готовит данные для view,
  держит локальное состояние UI, вызывает задачи и выполняет навигацию.
- **Чтение** store из presenter — можно и нужно: данные для view читаем через `useAppSelector`.
  Он подписывает компонент на store, и view перерисовывается при изменении.
  `store.getState()` — разовый снимок без подписки: для отображения не подходит.
- **Запись** в store из presenter — можно, если она примитивна: один `dispatch` без условий и
  последовательности шагов, и на это изменение не реагирует ни один эффект (например, смена страницы
  при пагинации уже загруженного списка). Как только запись обрастает логикой
  (проверки, несколько шагов, вызов API) — это сигнал вынести её в задачу.
- **Loading и error** одного действия, нужные только этому компоненту, держим в presenter (`useState`),
  а не в store. В store кладём то, что нужно нескольким компонентам (например, результаты поиска читают
  список, фильтр и пагинация).

```ts
// Pagination/logic/usePresenter.ts — примитивная запись, задача не нужна
export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectCurrentPage);

  const handleNext = () => dispatch(pageChanged(page + 1));

  return { page, handleNext };
};
```

## 4. Код, который не является компонентом

- Вызовы API — в `src/api/`. Функции из `src/api/` вызывают задачи (`tasks/`); `fetch` напрямую
  не вызывает никто, кроме `src/api/`.
- Типы лежат рядом с тем, к чему относятся: типы view/компонента — в его каталоге,
  типы API — в `src/api/`.
- Общий принцип (colocation): код лежит как можно ближе к месту использования; только когда он
  становится общим, он переносится в общий каталог на уровне `src/`.

## 5. Store: Redux (Redux Toolkit)

- Store глобальный, поэтому лежит на уровне `src/store/`:
  - `store.ts` — конфигурация store и типы `RootState`, `AppDispatch`,
  - `hooks.ts` — типизированные `useAppDispatch` и `useAppSelector`,
  - `domainName/` — каталог домена (например, `shows/`) со slice (`showsSlice.ts`), селекторами (`selectors.ts`)
    и фасадом для задач (`showsStore.ts`).
- Store — это база данных: состояние и именованные операции записи/чтения в терминах предметной
  области (`pageChanged`, `searchCleared`, селекторы). Бизнес-сценариев (последовательность шагов,
  вызовы API, проверки) в store нет — они в задачах.
- С store работают presenter (через хуки) и задачи (через фасад домена `showsStore`, `discoverStore`).
  View никогда не импортирует store.
- В presenter используем только типизированные хуки из `src/store/hooks.ts`, а не «голые»
  `useSelector`/`useDispatch`. Задачи хуки не используют и не импортируют `store`, экшены и селекторы
  напрямую — только фасад; `store.getState()` и `store.dispatch(...)` вызывает только фасад.
- Производные данные (фильтрация, пагинация, уникальные значения) вычисляем в селекторах (`createSelector`),
  а не в компонентах.
- Thunk и саги (`createAsyncThunk`, `redux-thunk`, `redux-saga`) не используем: асинхронные операции —
  это задачи, которые вызывают функции из `src/api/` и пишут результат в store.
- Локальное состояние UI, которое не нужно другим компонентам (значение инпута, loading/error одного
  действия), остаётся в presenter (`useState`).

## 6. Стили и тесты

- Стили и тесты лежат рядом с файлами, к которым относятся, — в том же каталоге.
- Стили: `ComponentName.module.css` рядом с `ComponentName.tsx`.
- Тесты: `FileName.test.ts(x)` рядом с тестируемым файлом, например `SearchBar.test.tsx`,
  `usePresenter.test.ts`, `tvmaze.test.ts`. Расширение теста совпадает с расширением файла:
  `Foo.tsx` → `Foo.test.tsx`, `foo.ts` → `foo.test.ts`.
- У каждого файла `.ts`/`.tsx` в `src/` есть свой тест. Исключения: стили (`*.css`), файлы только
  с типами (`types.ts`), точка входа `main.tsx` и тестовые фикстуры/хелперы (`test*.ts(x)`,
  например `testShows.ts`, `testStore.tsx`).
- View тестируем с замоканным `usePresenter` (`vi.mock('./logic/usePresenter')`), presenter — через
  `renderHookWithStore` из `@src/store/testStore` с замоканными задачами (`vi.mock('./tasks/findShows')`).
- Задачи тестируем как обычные функции, без React и `renderHook`: `tasks/findShows.test.ts` рядом с
  `tasks/findShows.ts`. API мокаем (`vi.mock('@src/api/tvmaze')`).
  - Обычно мокаем фасад (`vi.mock('@src/store/shows/showsStore')`) и проверяем вызовы его операций —
    такой тест не зависит от библиотеки store.
  - Когда важно реальное поведение данных (кэш, гонки запросов), используем настоящий store: мокаем модуль
    store фабрикой `mockStoreModule` из `@src/store/testAppStore`, в `beforeEach` берём свежий store
    через `resetAppStore()` и проверяем `store.getState()`. Так же тестируем сам фасад.

```
SearchBar/
  SearchBar.tsx
  SearchBar.module.css
  SearchBar.test.tsx
  logic/
    usePresenter.ts
    usePresenter.test.ts
    tasks/
      findShows.ts
      findShows.test.ts
```

## 7. Размер файлов

- Каждый файл — максимум 120 строк (включая импорты и типы).
- Если файл длиннее — разбиваем его на абстракции (дочерние компоненты, отдельные хуки, вспомогательные функции).
