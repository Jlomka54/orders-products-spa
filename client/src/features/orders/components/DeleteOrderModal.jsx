const DeleteOrderModal = ({
  deleteModalOrderId,
  order,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (deleteModalOrderId === null || deleteModalOrderId === undefined) {
    return null;
  }

  const orderTitle = order?.title || "этот приход";

  return (
    <div className="orders-page__modal-backdrop">
      <div className="orders-page__modal" role="dialog" aria-modal="true">
        <button
          className="orders-page__modal-close"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          disabled={isLoading}
        />
        <h2 className="orders-page__modal-title">
          Вы уверены, что хотите удалить этот приход?
        </h2>
        <div className="orders-page__modal-product">
          <span className="orders-page__modal-dot" aria-hidden="true" />
          <span className="orders-page__modal-photo" aria-hidden="true" />
          <span className="orders-page__modal-product-info">
            <span className="orders-page__modal-product-title">{orderTitle}</span>
            <span className="orders-page__modal-product-serial">SN-12.3456789</span>
          </span>
        </div>
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
            className="orders-page__modal-button orders-page__modal-button--danger"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
