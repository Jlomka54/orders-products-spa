import axios from "axios";

const httpClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const fallbackStatusMessages = {
  400: "Проверьте поля формы: часть данных заполнена неверно.",
  401: "Сессия истекла. Войдите в аккаунт еще раз.",
  403: "У вас нет доступа для выполнения этого действия.",
  404: "Запрошенная запись не найдена. Обновите страницу и попробуйте снова.",
  409: "Такая запись уже существует. Измените данные и попробуйте снова.",
  422: "Проверьте поля формы: сервер не смог обработать эти данные.",
  500: "На сервере произошла ошибка. Попробуйте еще раз немного позже.",
  502: "Не удалось связаться с API-сервером. Убедитесь, что backend запущен на http://127.0.0.1:3000, затем попробуйте снова.",
  503: "API-сервер временно недоступен. Попробуйте еще раз немного позже.",
};

const serverMessageTranslations = {
  "Enter your name and password to continue":
    "Введите имя и пароль, чтобы продолжить.",
  "Enter your name to continue": "Введите имя, чтобы продолжить.",
  "Enter your password to continue": "Введите пароль, чтобы продолжить.",
  "Password must be at least 6 characters":
    "Пароль должен быть не менее 6 символов.",
  "This name is already in use. Try another one":
    "Это имя уже занято. Попробуйте другое.",
  "We couldn't find an account with this name":
    "Аккаунт с таким именем не найден.",
  "Incorrect password. Please try again":
    "Неверный пароль. Попробуйте еще раз.",
  "Authentication is temporarily unavailable. Please try again later":
    "Авторизация временно недоступна. Попробуйте позже.",
  "We couldn't create your account right now. Please try again later":
    "Не удалось создать аккаунт. Попробуйте позже.",
  "We couldn't sign you in right now. Please try again later":
    "Не удалось войти в аккаунт. Попробуйте позже.",
  "Your account was not found. Please sign in again":
    "Аккаунт не найден. Войдите еще раз.",
  "Your session could not be verified. Please sign in again":
    "Не удалось проверить сессию. Войдите еще раз.",
  "Required product fields are missing":
    "Заполните все обязательные поля продукта.",
  "Guarantee start and end dates are required": "Укажите обе даты гарантии.",
  "Product date and guarantee dates must be valid dates":
    "Укажите корректные даты продукта и гарантии.",
  "At least one price is required": "Укажите хотя бы одну цену продукта.",
  "Each price must include a non-negative value and currency symbol":
    "Цена должна быть неотрицательным числом с указанной валютой.",
  "Product already exists": "Такой продукт уже существует.",
  "Product not found":
    "Продукт не найден. Обновите страницу и попробуйте снова.",
  "Failed to create product": "Не удалось создать продукт на сервере.",
  "Failed to update product": "Не удалось сохранить изменения продукта.",
  "Failed to delete product": "Не удалось удалить продукт.",
  "Failed to get order":
    "Действие выполнено, но не удалось обновить данные прихода. Обновите страницу.",
  "Order not found":
    "Выбранный приход не найден. Обновите страницу и попробуйте снова.",
};

const translateServerMessage = (message) => {
  if (!message) {
    return "";
  }

  if (serverMessageTranslations[message]) {
    return serverMessageTranslations[message];
  }

  if (message.startsWith("Product with this")) {
    return "Продукт с такими уникальными данными уже существует.";
  }

  return message;
};

const getResponseMessage = (error) => {
  const status = error.response?.status;
  const responseData = error.response?.data;
  const requestUrl = error.config?.url ?? "";
  const serverMessage =
    typeof responseData === "string" ? "" : responseData?.message;

  if (status === 401 && requestUrl.includes("/auth/login")) {
    return (
      translateServerMessage(serverMessage) ||
      "Неверный пароль. Попробуйте еще раз."
    );
  }

  if (status === 502) {
    return fallbackStatusMessages[502];
  }

  return (
    translateServerMessage(serverMessage) ||
    fallbackStatusMessages[status] ||
    (error.code === "ERR_NETWORK"
      ? "Нет соединения с API-сервером. Проверьте, что backend запущен и доступен."
      : "") ||
    error.message ||
    "Что-то пошло не так. Попробуйте еще раз."
  );
};

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      getResponseMessage(error) || error.message || "Something went wrong";

    const err = new Error(message);
    err.originalError = error;
    err.response = error.response;

    return Promise.reject(err);
  },
);

export default httpClient;
