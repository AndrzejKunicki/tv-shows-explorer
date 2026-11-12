# Правила тестирования

- Расположение файлов тестов описано в `ARCHITECTURE.md` (§6): тест лежит рядом с тестируемым файлом.
- Каждый файл `.ts`/`.tsx` (кроме стилей, `types.ts`, `main.tsx` и фикстур `test*.ts(x)`) должен иметь
  тест `FileName.test.ts(x)`. Новый файл без теста не проходит code review.
- E2E-тесты в браузере выполняет агент `playwright-tester` (`.claude/agents/playwright-tester.md`)
  через Playwright MCP (`.mcp.json`). Запускаем его после каждой задачи, меняющей поведение UI,
  перед открытием Pull Request.
