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
}) => {
  const [form, setForm] = useState(() => getInitialForm(mode, product));

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit product" : "Create product";
  const submitText = isEditMode ? "Save product" : "Create product";

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
            aria-label="Close product form"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>

        <form className="product-form-modal__form" onSubmit={handleSubmit}>
          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Legacy ID</span>
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
            <span className="product-form-modal__label">Title</span>
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
            <span className="product-form-modal__label">Serial number</span>
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
            <span className="product-form-modal__label">New product</span>
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Photo URL</span>
            <input
              className="product-form-modal__input"
              type="url"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Type</span>
            <input
              className="product-form-modal__input"
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Specification</span>
            <input
              className="product-form-modal__input"
              type="text"
              name="specification"
              value={form.specification}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Guarantee start</span>
            <input
              className="product-form-modal__input"
              type="text"
              name="guaranteeStart"
              value={form.guaranteeStart}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Guarantee end</span>
            <input
              className="product-form-modal__input"
              type="text"
              name="guaranteeEnd"
              value={form.guaranteeEnd}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="product-form-modal__field">
            <span className="product-form-modal__label">Price USD</span>
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
            <span className="product-form-modal__label">Price UAH</span>
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
            <span className="product-form-modal__label">Order</span>
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
            <span className="product-form-modal__label">Date</span>
            <input
              className="product-form-modal__input"
              type="text"
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
              Cancel
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
