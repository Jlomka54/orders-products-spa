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

  const orderTitle = order?.title || "this order";

  return (
    <div className="orders-page__modal-backdrop">
      <div className="orders-page__modal" role="dialog" aria-modal="true">
        <h2 className="orders-page__modal-title">Delete order</h2>
        <p className="orders-page__modal-text">
          Are you sure you want to delete {orderTitle}?
        </p>
        <div className="orders-page__modal-actions">
          <button
            className="orders-page__modal-button"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="orders-page__modal-button orders-page__modal-button--danger"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
