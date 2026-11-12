# Правила работы с Git

- Не коммитим в `main` (блокирует хук `.githooks/pre-commit`) и не пушим в `main`
  напрямую (блокирует `.githooks/pre-push`).
- Каждая задача — отдельная ветка, созданная от актуального `main`:
  `feature/<short-description>` для новых функций, `fix/<short-description>` для исправлений.
- Изменения попадают в `main` только через Pull Request.
