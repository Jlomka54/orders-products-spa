import { useState } from "react";

const getTodayInputValue = () => new Date().toISOString().slice(0, 10);

const toDateInputValue = (value) => {
  if (!value) {
    return getTodayInputValue();
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return getTodayInputValue();
  }

  return parsedDate.toISOString().slice(0, 10);
};

const findPrice = (prices, symbol) => {
  if (!Array.isArray(prices)) {
    return null;
  }

  return prices.find((price) => price?.symbol === symbol) || null;
};

const getInitialFormState = (product) => ({
  title: product?.title ?? "",
  serialNumber: product?.serialNumber ?? "",
  photo: product?.photo ?? "pathToFile.jpg",
  type: product?.type ?? "",
  specification: product?.specification ?? "",
  guaranteeStart: toDateInputValue(product?.guarantee?.start),
  guaranteeEnd: toDateInputValue(product?.guarantee?.end),
  usdPrice: findPrice(product?.price, "USD")?.value ?? "",
  uahPrice: findPrice(product?.price, "UAH")?.value ?? "",
  isNew: product?.isNew ?? true,
  date: toDateInputValue(product?.date),
});

const AddProductModal = ({
  isOpen,
  isLoading,
  mode = "add",
  orderLinkId,
  orderTitle,
  product,
  error,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(() => getInitialFormState(product));

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "isNew" ? value === "true" : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (orderLinkId === null || orderLinkId === undefined) {
      return;
    }

    onSubmit({
      serialNumber: Number(form.serialNumber),
      isNew: form.isNew,
      photo: form.photo.trim(),
      title: form.title.trim(),
      type: form.type.trim(),
      specification: form.specification.trim(),
      guarantee: {
        start: form.guaranteeStart,
        end: form.guaranteeEnd,
      },
      price: [
        {
          value: Number(form.usdPrice),
          symbol: "USD",
          isDefault: false,
        },
        {
          value: Number(form.uahPrice),
          symbol: "UAH",
          isDefault: true,
        },
      ],
      order: orderLinkId,
      date: form.date,
    });
  };

  const hasOrderLink = orderLinkId !== null && orderLinkId !== undefined;

  return (
    <div className="orders-page__modal-backdrop">
      <div
        className="orders-page__modal orders-page__modal--form"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="orders-page__modal-close"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          disabled={isLoading}
        />

        <h2 className="orders-page__modal-title">
          {mode === "edit"
            ? `Редактировать ${product?.title || "продукт"}`
            : `Добавить продукт в ${orderTitle || "приход"}`}
        </h2>

        <form className="orders-page__product-form" onSubmit={handleSubmit}>
          <label className="orders-page__product-field">
            <span>Название</span>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Серийный номер</span>
            <input
              name="serialNumber"
              type="number"
              min="1"
              value={form.serialNumber}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Тип</span>
            <input
              name="type"
              type="text"
              value={form.type}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Спецификация</span>
            <input
              name="specification"
              type="text"
              value={form.specification}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field orders-page__product-field--wide">
            <span>Фото</span>
            <input
              name="photo"
              type="text"
              value={form.photo}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Гарантия с</span>
            <input
              name="guaranteeStart"
              type="date"
              value={form.guaranteeStart}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Гарантия до</span>
            <input
              name="guaranteeEnd"
              type="date"
              value={form.guaranteeEnd}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Цена USD</span>
            <input
              name="usdPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.usdPrice}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Цена UAH</span>
            <input
              name="uahPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.uahPrice}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Дата</span>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </label>

          <label className="orders-page__product-field">
            <span>Статус</span>
            <select
              className="orders-page__product-select"
              name="isNew"
              value={String(form.isNew)}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="true">Свободен</option>
              <option value="false">В ремонте</option>
            </select>
          </label>

          {(!hasOrderLink || error) && (
            <p className="orders-page__product-form-error">
              {!hasOrderLink
                ? "У выбранного прихода нет числового идентификатора для привязки продукта."
                : error}
            </p>
          )}

          <div className="orders-page__modal-actions">
            <button
              className="orders-page__modal-button"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Отменить
            </button>
            <button
              className="orders-page__modal-button orders-page__modal-button--primary"
              type="submit"
              disabled={isLoading || !hasOrderLink}
            >
              {isLoading
                ? mode === "edit"
                  ? "Сохранение..."
                  : "Добавление..."
                : mode === "edit"
                  ? "Сохранить"
                  : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
