# Orders & Products SPA

SPA-приложение для управления приходами и продуктами.  
Проект реализован как fullstack-приложение: frontend на React, backend на Node.js/Express, база данных MongoDB.

---

## Запуск проекта

### Вариант 1: запуск через Docker

Для запуска проекта через Docker на компьютере должен быть установлен и запущен Docker Desktop.

В корне проекта выполните команду:

```bash
docker compose up --build
```

После успешного запуска будут подняты 3 контейнера:

```text
client  → frontend React/Vite через Nginx
server  → backend Express API
mongo   → база данных MongoDB
```

Адреса проекта:

```text
Frontend: http://localhost:8080
Backend API: http://localhost:3001/api
MongoDB: mongodb://mongo:27017/orders-products-spa
```

Для остановки контейнеров:

```bash
docker compose down
```

Для остановки контейнеров и удаления данных MongoDB:

```bash
docker compose down -v
```

Если после запуска база данных пустая, можно выполнить seed-команду:

```bash
docker compose exec server npm run seed:products
```

---

### Вариант 2: локальный запуск без Docker

#### 1. Клонировать репозиторий

```bash
git clone https://github.com/Jlomka54/orders-products-spa.git
cd orders-products-spa
```

#### 2. Установить зависимости для backend

```bash
cd server
npm install
```

#### 3. Создать `.env` файл для backend

В папке `server` создать файл `.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/orders-products-spa
JWT_SECRET=your_secret_key
NODE_ENV=development
```

#### 4. Запустить backend

```bash
npm run dev
```

Backend будет доступен по адресу:

```text
http://localhost:3001
```

#### 5. Установить зависимости для frontend

В новом терминале перейти в папку `client`:

```bash
cd client
npm install
```

#### 6. Создать `.env` файл для frontend

В папке `client` создать файл `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

#### 7. Запустить frontend

```bash
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:5173
```

---

## Основные страницы

В приложении реализованы отдельные страницы:

```text
/          → главная страница / редирект
/orders    → страница приходов
/products  → страница продуктов
```

Навигация между страницами реализована через React Router.

---

## Реализованный функционал

### Orders

На странице приходов реализовано:

- вывод списка приходов;
- отображение названия прихода;
- отображение количества продуктов в приходе;
- отображение даты создания в разных форматах;
- расчёт общей суммы прихода на основе стоимости продуктов;
- отображение суммы в разных валютах;
- открытие подробной информации о выбранном приходе;
- закрытие блока с подробной информацией;
- удаление прихода через popup-подтверждение.

---

### Products

На странице продуктов реализовано:

- вывод списка всех продуктов;
- отображение названия продукта;
- отображение типа продукта;
- отображение гарантийного срока;
- отображение цены в разных валютах;
- отображение названия прихода, к которому относится продукт;
- фильтрация продуктов по типу;
- добавление продукта;
- редактирование продукта;
- удаление продукта;
- обработка ошибок при запросах к серверу.

---

### TopMenu

В верхнем меню реализовано:

- отображение текущей даты;
- отображение текущего времени в реальном времени;
- счётчик активных вкладок/сессий приложения через WebSocket.

---

### Navigation Menu

В боковом меню реализована навигация между основными страницами приложения:

```text
Orders
Products
```

---

## Backend

Backend реализован на Node.js и Express.

Основные задачи backend:

- подключение к MongoDB;
- создание REST API;
- работа с приходами;
- работа с продуктами;
- обработка ошибок;
- поддержка WebSocket/Socket.IO;
- подключение Docker-окружения.

Пример API-адресов:

```text
GET    /api/orders
POST   /api/orders
PATCH  /api/orders/:id
DELETE /api/orders/:id

GET    /api/products
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

---

## Frontend

Frontend реализован на React + Vite.

В проекте используются:

- React;
- React Router;
- Redux;
- Axios / Fetch;
- CSS Modules / CSS;
- Bootstrap;
- анимации при работе с интерфейсом;
- компонентный подход;
- работа с REST API;
- работа с WebSocket.

---

## База данных

В качестве базы данных используется MongoDB.

Основные сущности проекта:

```text
Order
Product
```

Связь:

```text
Один приход может содержать несколько продуктов.
Один продукт относится к определённому приходу.
```

---

## Docker

Проект упакован в Docker.

Docker-конфигурация включает:

```text
client/Dockerfile       → сборка frontend и запуск через Nginx
server/Dockerfile       → сборка и запуск backend
docker-compose.yml      → запуск frontend, backend и MongoDB
client/nginx.conf       → настройка Nginx для SPA и проксирования API
.dockerignore           → исключение лишних файлов из Docker build
```

Docker позволяет запустить всё приложение одной командой:

```bash
docker compose up --build
```

---

## Deploy

Проект развёрнут на Vercel.

```text
Live demo: ВСТАВЬ_СЮДА_ССЫЛКУ_НА_VERCEL
GitHub: https://github.com/Jlomka54/orders-products-spa
```

---

## Стек технологий

### Frontend

```text
React
Vite
Redux
React Router
Axios / Fetch
Bootstrap
CSS
WebSocket / Socket.IO Client
```

### Backend

```text
Node.js
Express
MongoDB
Mongoose
Socket.IO
JWT
dotenv
cors
```

### Tools

```text
Git
GitHub
Docker
Docker Compose
Vercel
MongoDB Atlas / MongoDB Docker
Postman
VS Code
```

---

## Самопроверка

Перед сдачей проекта нужно проверить:

```text
1. Проект запускается через Docker.
2. Frontend открывается на http://localhost:8080.
3. Backend API работает на http://localhost:3001/api.
4. Страницы /orders и /products открываются после перезагрузки.
5. Данные приходят из MongoDB.
6. Нет ошибок в DevTools Console.
7. В README есть инструкция запуска проекта.
8. Live demo на Vercel открывается.
```

---

## Автор

Bohdan Haponiuk

GitHub: https://github.com/Jlomka54
