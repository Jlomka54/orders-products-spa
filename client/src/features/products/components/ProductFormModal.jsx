import { useState } from "react";
import {
  buildProductPayload,
  createEmptyProductForm,
  createProductFormFromProduct,
  getProductId,
} from "../../../utils/productHelpers";

const getInitialForm = (mode, product) => {
  if (product) {
    return createProductFormFromProduct(product);
  }

  return createEmptyProductForm();
};

const ProductFormModalContent = ({
  mode,
  product,
  isLoading,
  onClose,
  onSubmit,
  productTypes = [],
  productSpecifications = [],
}) => {
  const [form, setForm] = useState(() => getInitialForm(mode, product));

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Редактировать продукт" : "Создать продукт";
  const submitText = isEditMode ? "Сохранить продукт" : "Создать продукт";

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildProductPayload(form));
  };

  return (
    <div className="product-form-modal__backdrop">
      <div
        className="product-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-modal-title"
      >
        <div className="product-form-modal__header">
          <h2
            className="product-form-modal__title"
            id="product-form-modal-title"
          >
            {title}
          </h2>
          <button
            className="product-form-modal__close-button"
            type="button"
            aria-label="Закрыть форму продукта"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>

        <form className="product-form-modal__form" onSubmit={handleSubmit}>
          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Устаревший ID</span>
            <input
              className="product-form-modal__input"
              type="number"
              name="legacyId"
              value={form.legacyId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Название</span>
            <input
              className="product-form-modal__input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Серийный номер</span>
            <input
              className="product-form-modal__input"
              type="number"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__checkbox-field">
            <input
              className="product-form-modal__checkbox"
              type="checkbox"
              name="isNew"
              checked={Boolean(form.isNew)}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="product-form-modal__label">Новый продукт</span>
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Тип</span>
            {productTypes.length > 0 ? (
              <select
                className="product-form-modal__input"
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="">Выберите тип</option>
                {productTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="product-form-modal__input"
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            )}
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Спецификация</span>
            {productSpecifications.length > 0 ? (
              <select
                className="product-form-modal__input"
                name="specification"
                value={form.specification}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="">Выберите спецификацию</option>
                {productSpecifications.map((specification) => (
                  <option value={specification} key={specification}>
                    {specification}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="product-form-modal__input"
                type="text"
                name="specification"
                value={form.specification}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            )}
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Гарантия с</span>
            <input
              className="product-form-modal__input"
              type="date"
              name="guaranteeStart"
              value={form.guaranteeStart}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Гарантия по</span>
            <input
              className="product-form-modal__input"
              type="date"
              name="guaranteeEnd"
              value={form.guaranteeEnd}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Цена USD</span>
            <input
              className="product-form-modal__input"
              type="number"
              name="priceUsd"
              value={form.priceUsd}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Цена UAH</span>
            <input
              className="product-form-modal__input"
              type="number"
              name="priceUah"
              value={form.priceUah}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Приход</span>
            <input
              className="product-form-modal__input"
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Дата поставки</span>
            <input
              className="product-form-modal__input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <div className="product-form-modal__actions">
            <button
              className="product-form-modal__button product-form-modal__button--secondary"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Отменить
            </button>
            <button
              className="product-form-modal__button product-form-modal__button--primary"
              type="submit"
              disabled={isLoading}
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductFormModal = ({
  isOpen,
  mode,
  product,
  isLoading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  const productKey = getProductId(product) ?? "new";

  return (
    <ProductFormModalContent
      key={`${mode}-${productKey}`}
      mode={mode}
      product={product}
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default ProductFormModal;
