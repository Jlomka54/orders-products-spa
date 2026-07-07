import "./RemoveProductFromGroupModal.css";

const RemoveProductFromGroupModal = ({
  product,
  isOpen,
  isLoading,
  error,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  const productTitle = product?.title || "этот продукт";

  return (
    <div className="remove-product-from-group-modal__backdrop">
      <section
        className="remove-product-from-group-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-product-from-group-modal-title"
      >
        <button
          className="remove-product-from-group-modal__close-button"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          disabled={isLoading}
        />

        <h2
          className="remove-product-from-group-modal__title"
          id="remove-product-from-group-modal-title"
        >
          Убрать продукт из группы?
        </h2>

        <p className="remove-product-from-group-modal__text">
          Продукт {productTitle} останется в общем списке продуктов.
        </p>

        {error && (
          <p className="remove-product-from-group-modal__error">{error}</p>
        )}

        <div className="remove-product-from-group-modal__actions">
          <button
            className="remove-product-from-group-modal__button"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Отменить
          </button>
          <button
            className="remove-product-from-group-modal__button remove-product-from-group-modal__button--primary"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Удаление..." : "Убрать из группы"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default RemoveProductFromGroupModal;
