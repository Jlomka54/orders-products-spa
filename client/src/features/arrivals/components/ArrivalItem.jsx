import { calculateOrderTotal } from "../../../utils/calculateOrderTotal";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import {
  getOrderDate,
  getOrderId,
  getOrderProducts,
  getProductsCount,
} from "../../../utils/orderHelpers";

const ArrivalItem = ({ order, onDelete }) => {
  const orderId = getOrderId(order);
  const products = getOrderProducts(order);
  const orderDate = getOrderDate(order);

  const handleDeleteClick = () => {
    if (orderId === null || orderId === undefined || String(orderId).trim() === "") {
      return;
    }

    onDelete(orderId);
  };

  return (
    <article className="arrival-item">
      <span className="arrival-item__title">
        {order?.title ?? ""}
      </span>

      <div className="arrival-item__products">
        <span className="arrival-item__products-icon" aria-hidden="true" />
        <span className="arrival-item__products-count">
          {getProductsCount(order)}
        </span>
        <span className="arrival-item__products-label">Продукта</span>
      </div>

      <div className="arrival-item__date">
        <span className="arrival-item__date-short">
          {formatShortDate(orderDate)}
        </span>
        <span className="arrival-item__date-long">
          {formatLongDate(orderDate)}
        </span>
      </div>

      <div className="arrival-item__prices">
        <span className="arrival-item__price arrival-item__price--usd">
          {formatPrice(calculateOrderTotal(products, "USD"), "USD")}
        </span>
        <span className="arrival-item__price arrival-item__price--uah">
          {formatPrice(calculateOrderTotal(products, "UAH"), "UAH")}
        </span>
      </div>

      <button
        className="arrival-item__delete"
        type="button"
        aria-label="Удалить приход"
        onClick={handleDeleteClick}
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

export default ArrivalItem;
