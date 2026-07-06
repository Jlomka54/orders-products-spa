const DeleteProductModal = ({
  product,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  const productTitle = product?.title || "this product";

  return (
    <div className="products-page__modal-backdrop">
      <div
        className="products-page__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-modal-title"
      >
        <button
          className="products-page__modal-close"
          type="button"
          aria-label="Close delete product confirmation"
          onClick={onClose}
          disabled={isLoading}
        />

        <h2 className="products-page__modal-title" id="delete-product-modal-title">
          Delete product?
        </h2>

        <p className="products-page__modal-text">
          Are you sure you want to delete {productTitle}?
        </p>

        <div className="products-page__modal-actions">
          <button
            className="products-page__modal-button"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="products-page__modal-button products-page__modal-button--danger"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
