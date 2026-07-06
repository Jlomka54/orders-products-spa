import { useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

const findPrice = (prices, symbol) => {
  if (!Array.isArray(prices)) {
    return null;
  }

  return prices.find((price) => price?.symbol === symbol) || null;
};

const getOrderTitle = (product) => {
  if (product.orderTitle) {
    return product.orderTitle;
  }

  if (product.order?.title) {
    return product.order.title;
  }

  if (product.order === null || product.order === undefined) {
    return "";
  }

  return String(product.order);
};

const ProductItem = ({ product, isLoading, onEdit, onDelete }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const usdPrice = findPrice(product.price, "USD");
  const uahPrice = findPrice(product.price, "UAH");
  const shouldShowImage = product.photo && !hasImageError;

  return (
    <article className="products-page__product">
      <span
        className={`products-page__status-dot${
          product.isNew ? " products-page__status-dot--new" : ""
        }`}
        aria-hidden="true"
      />

      <div className="products-page__photo">
        {shouldShowImage ? (
          <img
            className="products-page__image"
            src={product.photo}
            alt={product.title}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <span className="products-page__image-placeholder">No image</span>
        )}
      </div>

      <div className="products-page__main-info">
        <span className="products-page__title">{product.title}</span>
        <span className="products-page__serial-number">
          SN: {product.serialNumber}
        </span>
        <StatusBadge isNew={product.isNew} />
      </div>

      <span className="products-page__type">{product.type}</span>
      <span className="products-page__specification">
        {product.specification}
      </span>

      <div className="products-page__guarantee">
        <span className="products-page__guarantee-label">Guarantee</span>
        <span className="products-page__guarantee-start">
          {formatShortDate(product.guarantee?.start)}
        </span>
        <span className="products-page__guarantee-end">
          {formatShortDate(product.guarantee?.end)}
        </span>
      </div>

      <div className="products-page__prices">
        <span className="products-page__price-usd">
          {formatPrice(usdPrice?.value, usdPrice?.symbol)}
        </span>
        <span className="products-page__price-uah">
          {formatPrice(uahPrice?.value, uahPrice?.symbol)}
        </span>
      </div>

      <span className="products-page__order-title">
        {getOrderTitle(product)}
      </span>

      <span className="products-page__date">
        {formatLongDate(product.date)}
      </span>

      <div className="products-page__actions">
        <button
          className="products-page__edit-button"
          type="button"
          onClick={() => onEdit(product)}
          disabled={isLoading}
        >
          Изменить
        </button>
        <button
          className="products-page__delete-button"
          type="button"
          onClick={() => onDelete(product)}
          disabled={isLoading}
        >
          Удалить
        </button>
      </div>
    </article>
  );
};

export default ProductItem;
