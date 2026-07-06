import { useState } from "react";
import { getOrderProducts } from "../../../utils/orderHelpers";
import { getProductId } from "../../../utils/productHelpers";

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
  onDeleteProduct,
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
                onClick={() => onDeleteProduct(getProductId(product))}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19 6L18.1569 19.1195C18.1096 19.6608 17.6262 20.0773 17.0836 20.0773H6.91638C6.37377 20.0773 5.89039 19.6608 5.84309 19.1195L5 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 11V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
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
