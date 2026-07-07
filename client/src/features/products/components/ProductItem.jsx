import StatusBadge from "../../../components/ui/StatusBadge";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import { getProductRequestId } from "../../../utils/productHelpers";

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

const ProductItem = ({ product, onEdit, onDelete }) => {
  const usdPrice = findPrice(product.price, "USD");
  const uahPrice = findPrice(product.price, "UAH");
  const productId = getProductRequestId(product);

  const handleImageError = (event) => {
    event.currentTarget.hidden = true;
    event.currentTarget.nextElementSibling?.removeAttribute("hidden");
  };

  return (
    <article className="products-page__product">
      <span
        className={`products-page__status-dot${
          product.isNew ? " products-page__status-dot--new" : ""
        }`}
        aria-hidden="true"
      />

      <div className="products-page__photo">
        {product.photo && (
          <img
            className="products-page__image"
            src={product.photo}
            alt={product.title}
            onError={handleImageError}
          />
        )}
        <span
          className="products-page__image-placeholder"
          hidden={Boolean(product.photo)}
        >
          Нет изображения
        </span>
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

      <button
        className="products-page__edit-button"
        type="button"
        onClick={() => onEdit(product)}
      >
        Изменить
      </button>

      <button
        className="products-page__delete-button"
        type="button"
        aria-label="Удалить продукт"
        onClick={() => onDelete(productId)}
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
    </article>
  );
};

export default ProductItem;
