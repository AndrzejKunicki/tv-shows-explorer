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
- `usePresenter.ts` — вся логика компонента (состояние, эффекты, обработчики, подготовка данных).
  Возвращает готовые данные и обработчики для view.
- `usePresenter.ts` необязателен — только если у компонента есть логика.
  Компонент, который лишь отображает пропсы, состоит из одного view.

### Пример структуры

```
src/
  App/
    App.tsx
    SearchPage/
      SearchPage.tsx
      usePresenter.ts
      types.ts
      SearchBar/
        SearchBar.tsx
        usePresenter.ts
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
// SearchBar/usePresenter.ts
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
import { usePresenter } from './usePresenter';

export const SearchBar = (props: { onSearch: (q: string) => void }) => {
  const { query, handleChange, handleSubmit } = usePresenter(props);
  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
    </form>
  );
};
```

## 4. Код, который не является компонентом

- Вызовы API — в `src/api/`. Presenter не вызывает `fetch` напрямую, только функции из `src/api/`.
- Типы лежат рядом с тем, к чему относятся: типы view/компонента — в его каталоге,
  типы API — в `src/api/`.
- Общий принцип (colocation): код лежит как можно ближе к месту использования; только когда он
  становится общим, он переносится в общий каталог на уровне `src/`.

## 5. Store: Redux (Redux Toolkit)

- Store глобальный, поэтому лежит на уровне `src/store/`:
  - `store.ts` — конфигурация store и типы `RootState`, `AppDispatch`,
  - `hooks.ts` — типизированные `useAppDispatch` и `useAppSelector`,
  - `domainName/` — каталог домена (например, `shows/`) со slice (`showsSlice.ts`) и селекторами (`selectors.ts`).
- С Redux работает только presenter (`usePresenter.ts`). View никогда не импортирует store.
- Используем только типизированные хуки из `src/store/hooks.ts`, а не «голые» `useSelector`/`useDispatch`.
- Производные данные (фильтрация, пагинация, уникальные значения) вычисляем в селекторах (`createSelector`),
  а не в компонентах.
- Асинхронные операции — `createAsyncThunk`, который вызывает функции из `src/api/`.
- Локальное состояние UI, которое не нужно другим компонентам (например, значение инпута), остаётся
  в presenter (`useState`).

## 6. Стили и тесты

- Стили и тесты лежат рядом с файлами, к которым относятся, — в том же каталоге.
- Стили: `ComponentName.module.css` рядом с `ComponentName.tsx`.
- Тесты: `FileName.test.ts(x)` рядом с тестируемым файлом, например `SearchBar.test.tsx`,
  `usePresenter.test.ts`, `tvmaze.test.ts`. Расширение теста совпадает с расширением файла:
  `Foo.tsx` → `Foo.test.tsx`, `foo.ts` → `foo.test.ts`.
- У каждого файла `.ts`/`.tsx` в `src/` есть свой тест. Исключения: стили (`*.css`), файлы только
  с типами (`types.ts`), точка входа `main.tsx` и тестовые фикстуры/хелперы (`test*.ts(x)`,
  например `testShows.ts`, `testStore.tsx`).
- View тестируем с замоканным `usePresenter` (`vi.mock('./usePresenter')`), presenter — через
  `renderHookWithStore` из `@src/store/testStore` (настоящий store, API замокан).

```
SearchBar/
  SearchBar.tsx
  SearchBar.module.css
  SearchBar.test.tsx
  usePresenter.ts
  usePresenter.test.ts
```

## 7. Размер файлов

- Каждый файл — максимум 120 строк (включая импорты и типы).
- Если файл длиннее — разбиваем его на абстракции (дочерние компоненты, отдельные хуки, вспомогательные функции).
