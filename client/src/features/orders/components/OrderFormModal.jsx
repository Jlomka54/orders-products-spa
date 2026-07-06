import { useState } from "react";

const createEmptyGroupForm = () => ({
  name: "",
  description: "",
});

const OrderFormModalContent = ({ isLoading, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => createEmptyGroupForm());
  const title = "Create group";
  const submitText = "Create group";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name,
      description: form.description,
    });
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
            <span className="order-form-modal__label">Group name</span>
            <input
              className="order-form-modal__input"
              type="text"
              name="name"
              value={form.name}
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

const OrderFormModal = ({ isOpen, isLoading, onClose, onSubmit }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <OrderFormModalContent
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default OrderFormModal;
