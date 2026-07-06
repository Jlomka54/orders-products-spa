import { useState } from "react";
import { getOrderProducts } from "../../../utils/orderHelpers";

const DetailProductPhoto = ({ product }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = product.photo && !hasImageError;

  return (
    <span className="orders-page__details-product-photo">
      {shouldShowImage ? (
        <img
          className="orders-page__details-product-image"
          src={product.photo}
          alt=""
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span className="orders-page__details-product-image-placeholder" />
      )}
    </span>
  );
};

const OrderDetailsPanel = ({
  selectedOrderDetails,
  onEditOrder,
  onAddProduct,
  onClose,
}) => {
  if (!selectedOrderDetails) {
    return null;
  }

  const products = getOrderProducts(selectedOrderDetails);

  return (
    <aside className="orders-page__details-panel orders-page__details-panel--visible">
      <button
        className="orders-page__details-close"
        type="button"
        aria-label="Close details"
        onClick={onClose}
      />
      <div className="orders-page__details-header">
        <h2 className="orders-page__details-title">
          {selectedOrderDetails.title}
        </h2>
        <button
          className="orders-page__details-add"
          type="button"
          onClick={onAddProduct}
        >
          <span aria-hidden="true">+</span>
          Добавить продукт
        </button>
        {onEditOrder && (
          <button
            className="orders-page__details-edit"
            type="button"
            onClick={() => onEditOrder(selectedOrderDetails)}
          >
            Редактировать приход
          </button>
        )}
      </div>

      {products.length > 0 ? (
        <ul className="orders-page__details-products">
          {products.map((product, index) => (
            <li
              className="orders-page__details-product"
              key={product.id ?? product._id ?? product.serialNumber ?? index}
            >
              <DetailProductPhoto product={product} />
              <span className="orders-page__details-product-info">
                <span className="orders-page__details-product-title">
                  {product.title}
                </span>
                <span className="orders-page__details-product-serial">
                  SN-{product.serialNumber}
                </span>
              </span>
              <span className="orders-page__details-product-status">
                {product.isNew ? "Свободен" : "В ремонте"}
              </span>
              <button
                className="orders-page__details-product-delete"
                type="button"
                aria-label="Удалить продукт"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="orders-page__details-empty">
          В этом приходе нет продуктов
        </p>
      )}
    </aside>
  );
};

export default OrderDetailsPanel;
