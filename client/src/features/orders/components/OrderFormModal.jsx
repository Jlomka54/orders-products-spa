import { useState } from "react";
import {
  buildOrderPayload,
  createEmptyOrderForm,
  createOrderFormFromOrder,
  getOrderId,
} from "../../../utils/orderHelpers";

const getInitialForm = (mode, order) => {
  if (mode === "edit" && order) {
    return createOrderFormFromOrder(order);
  }

  return createEmptyOrderForm();
};

const OrderFormModalContent = ({ mode, order, isLoading, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => getInitialForm(mode, order));
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit order" : "Create order";
  const submitText = isEditMode ? "Save order" : "Create order";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildOrderPayload(form));
  };

  return (
    <div className="order-form-modal__backdrop">
      <div
        className="order-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-form-modal-title"
      >
        <div className="order-form-modal__header">
          <h2 className="order-form-modal__title" id="order-form-modal-title">
            {title}
          </h2>
          <button
            className="order-form-modal__close-button"
            type="button"
            aria-label="Close order form"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>

        <form className="order-form-modal__form" onSubmit={handleSubmit}>
          <label className="order-form-modal__field">
            <span className="order-form-modal__label">Legacy ID</span>
            <input
              className="order-form-modal__input"
              type="number"
              name="legacyId"
              value={form.legacyId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </label>

          <label className="order-form-modal__field">
            <span className="order-form-modal__label">Title</span>
            <input
              className="order-form-modal__input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="order-form-modal__field">
            <span className="order-form-modal__label">Date</span>
            <input
              className="order-form-modal__input"
              type="text"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </label>

          <label className="order-form-modal__field">
            <span className="order-form-modal__label">Description</span>
            <textarea
              className="order-form-modal__textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />
          </label>

          <div className="order-form-modal__actions">
            <button
              className="order-form-modal__button order-form-modal__button--secondary"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="order-form-modal__button order-form-modal__button--primary"
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

const OrderFormModal = ({
  isOpen,
  mode,
  order,
  isLoading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  const orderKey = getOrderId(order) ?? "new";

  return (
    <OrderFormModalContent
      key={`${mode}-${orderKey}`}
      mode={mode}
      order={order}
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default OrderFormModal;
