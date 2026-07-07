import { useState } from "react";

const createGroupForm = (order = null) => ({
  name: order?.title ?? "",
  description: order?.description ?? "",
});

const OrderFormModalContent = ({
  isLoading,
  mode,
  order,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(() => createGroupForm(order));
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Изменить группу" : "Создать группу";
  const submitText = isEditMode ? "Сохранить" : "Создать группу";

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
            <span className="order-form-modal__label">Название группы</span>
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
            <span className="order-form-modal__label">Описание</span>
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
              Отменить
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
  isLoading,
  mode = "create",
  order = null,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <OrderFormModalContent
      isLoading={isLoading}
      mode={mode}
      order={order}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default OrderFormModal;
