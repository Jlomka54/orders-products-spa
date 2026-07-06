import { calculateOrderTotal } from "../../../utils/calculateOrderTotal";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import {
  getOrderDate,
  getOrderProducts,
  getProductsCount,
} from "../../../utils/orderHelpers";

const OrderItem = ({ order, isSelected, onSelect, onDelete, onEdit }) => {
  const products = getOrderProducts(order);
  const orderDate = getOrderDate(order);

  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit(order);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`orders-page__order${
        isSelected ? " orders-page__order--selected" : ""
      }`}
    >
      <button
        className="orders-page__order-main"
        type="button"
        onClick={onSelect}
      >
        <span className="orders-page__title">{order.title}</span>
        <span className="orders-page__products-count">
          {getProductsCount(order)}
        </span>
        <span className="orders-page__short-date">
          {formatShortDate(orderDate)}
        </span>
        <span className="orders-page__long-date">
          {formatLongDate(orderDate)}
        </span>
        <span className="orders-page__total-usd">
          {formatPrice(calculateOrderTotal(products, "USD"), "USD")}
        </span>
        <span className="orders-page__total-uah">
          {formatPrice(calculateOrderTotal(products, "UAH"), "UAH")}
        </span>
      </button>

      <button
        className="orders-page__edit-button"
        type="button"
        onClick={handleEditClick}
      >
        Изменить
      </button>

      <button
        className="orders-page__delete-button"
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
    </div>
  );
};

export default OrderItem;
