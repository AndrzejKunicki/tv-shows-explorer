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
