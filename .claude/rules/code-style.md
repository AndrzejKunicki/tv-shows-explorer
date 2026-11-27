---
paths:
  - "src/**/*.{ts,tsx}"
---

# Правила форматирования кода

Дополняют `ARCHITECTURE.md`. Пункты, отмеченные **(lint)**, проверяет `npm run lint` (`.oxlintrc.json`),
остальные — на code review.

## 1. Пустая строка перед `return`

Перед `return` всегда пустая строка. Исключение: `return` — первая инструкция в блоке.

```ts
// ✅
const shows = results.map((result) => result.show);

return shows;

if (!isVisible) {
  return null;
}

// ❌
const shows = results.map((result) => result.show);
return shows;
```

## 2. `return` всегда с новой строки **(lint: `curly`)**

Никаких однострочных `if (...) return ...;` — тело `if`/`else`/циклов всегда в фигурных скобках,
`return` на отдельной строке. Правило `curly: all` распространяется на все инструкции, не только на `return`.

```ts
// ✅
if (status === 'loading') {
  return 'Searching…';
}

// ❌
if (status === 'loading') return 'Searching…';
```

Стрелочные функции с телом-выражением (`(a) => a + 1`) допустимы — в них нет `return`.

## 3. Сначала вычисления, потом `return` готового значения

Все вычисления (вызовы, `.map`/`.filter`, операторы, тернарники) — в переменных до `return`.
`return` только отдаёт готовый результат:

- переменную: `return shows;`
- объект из готовых значений (shorthand): `return { isVisible, label, handleNext };`
- литерал: `return null;`, `return 'Searching…';`, в том числе шаблонная строка с готовыми переменными:
  `` return `Something went wrong: ${error}`; ``

Исключения: JSX во view (`return (<nav>…</nav>)`) и функция, например cleanup в `useEffect`
(`return () => clearTimeout(timer);`).

```ts
// ✅
const results: SearchResult[] = await response.json();
const shows = results.map((result) => result.show);

return shows;

const isVisible = pageCount > 1;
const label = `Page ${page} of ${pageCount}`;

return { isVisible, label };

// ❌
const results: SearchResult[] = await response.json();

return results.map((result) => result.show);

return {
  isVisible: pageCount > 1,
  label: `Page ${page} of ${pageCount}`,
};
```

## 4. Импорты через алиас `@src/...` **(lint: `no-restricted-imports`)**

- Общие каталоги (`src/store`, `src/api`, `src/components` и т. д.) импортируются через алиас:
  `@src/store/hooks`, `@src/api/types`.
- `./` — только для своих файлов и детей (подкаталогов) компонента.
- Импорты через `../` запрещены.

```ts
// ✅
import { useAppDispatch } from '@src/store/hooks';
import { usePresenter } from './usePresenter';

// ❌
import { useAppDispatch } from '../../../store/hooks';
```

Алиас настроен в двух местах, и они должны совпадать: `tsconfig.app.json` (`paths`) для TypeScript
и `vite.config.ts` (`resolve.alias`) для Vite и Vitest.
В `vi.mock(...)` используется тот же путь, что и в импорте.

## 5. Нет неиспользуемых переменных **(lint: `no-unused-vars`, tsc: `noUnusedLocals`, `noUnusedParameters`)**

- Неиспользуемые переменные, импорты, параметры и пойманные ошибки запрещены.
- Исключение — параметр с префиксом `_`, который нужен по сигнатуре: обработчик ошибок Express обязан иметь
  4 параметра (`_request`, `_response`, `_next`), иначе Express не считает его обработчиком ошибок.
  Такие параметры не удаляем. Для пойманной ошибки, которая не нужна, пишем `catch {` без переменной.
- Локальные переменные с `_` не исключение: TypeScript их тоже запрещает.

## 6. API Vitest — только в тестах **(lint: `no-restricted-globals`, tsc: отдельные tsconfig)**

- `describe`, `it`, `test`, `expect`, `vi`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll` глобальные,
  но доступны только в `*.test.ts(x)`: их типы подключены в `tsconfig.test.json` и `server/tsconfig.test.json`,
  а `tsconfig.app.json` и `server/tsconfig.app.json` тесты исключают. Корневые `tsconfig.json` (клиент и `server/`)
  содержат только ссылки на эти конфиги — так редактор подбирает нужный конфиг для каждого файла. Вне тестов это ошибка и `tsc`, и линтера.
