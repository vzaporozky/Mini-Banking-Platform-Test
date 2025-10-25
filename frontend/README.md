# Mini Bank Frontend

Упрощенная банковская платформа с минимальными зависимостями и современным дизайном на Tailwind CSS.

## Особенности

- ✅ Минимальные зависимости (только необходимые пакеты)
- ✅ Современный дизайн с Tailwind CSS
- ✅ TypeScript для типобезопасности
- ✅ Простая система уведомлений
- ✅ Адаптивный дизайн
- ✅ Аутентификация пользователей
- ✅ Управление кошельками (USD/EUR)
- ✅ Переводы между пользователями
- ✅ Обмен валют

## Технологии

- **Next.js 13** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Lucide React** - Иконки
- **Custom API Client** - Работа с сервером

## Установка

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте файл переменных окружения:

```bash
cp env.example .env.local
```

3. Настройте переменные окружения в `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Запустите проект в режиме разработки:

```bash
npm run dev
```

## Структура проекта

```
frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Главная страница
│   ├── transactions/      # История транзакций
│   ├── layout.tsx         # Основной layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ui/               # Базовые UI компоненты
│   ├── auth-form.tsx     # Форма авторизации
│   ├── navbar.tsx        # Навигация
│   ├── wallet-card.tsx   # Карточка кошелька
│   ├── transfer-form.tsx # Форма перевода
│   ├── exchange-form.tsx # Форма обмена валют
│   └── recent-transactions.tsx # Последние транзакции
├── lib/                  # Утилиты и конфигурация
│   ├── api.ts           # API клиент
│   ├── auth-context.tsx # Контекст аутентификации
│   ├── types.ts         # TypeScript типы
│   ├── utils.ts         # Утилиты
│   └── toast.tsx        # Система уведомлений
└── package.json         # Зависимости
```

## API

Проект использует собственный API клиент для взаимодействия с backend:

- `authApi` - Аутентификация
- `walletsApi` - Управление кошельками
- `transactionsApi` - Транзакции

## Команды

```bash
npm run dev      # Запуск в режиме разработки
npm run build    # Сборка для продакшена
npm run start    # Запуск продакшен версии
npm run lint     # Проверка кода
npm run typecheck # Проверка типов
```

## Уменьшение зависимостей

Проект был оптимизирован для минимального количества зависимостей:

**Удалены:**

- Все Radix UI компоненты
- React Hook Form
- Zod валидация
- Sonner уведомления
- Date-fns
- Recharts
- И многие другие

**Оставлены только:**

- Next.js и React
- TypeScript
- Tailwind CSS
- Lucide React (иконки)
- clsx и tailwind-merge (утилиты)

Все UI компоненты переписаны с использованием только Tailwind CSS классов.
