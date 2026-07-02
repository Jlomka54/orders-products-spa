import { calculateOrderTotal } from "../../../utils/calculateOrderTotal";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

const getOrderProducts = (order) => {
  if (Array.isArray(order.products)) {
    return order.products;
  }

  if (Array.isArray(order.items)) {
    return order.items;
  }

  return [];
};

const getProductsCount = (order) => {
  if (Number.isFinite(Number(order.productsCount))) {
    return Number(order.productsCount);
  }

  return getOrderProducts(order).length;
};

const getOrderDate = (order) => order.date || order.createdAt;

const OrderItem = ({ order, isSelected, onSelect, onDelete }) => {
  const products = getOrderProducts(order);
  const orderDate = getOrderDate(order);

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
        className="orders-page__delete-button"
        type="button"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default OrderItem;
