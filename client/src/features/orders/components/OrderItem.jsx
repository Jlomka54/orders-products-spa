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
      />
    </div>
  );
};

export default OrderItem;
