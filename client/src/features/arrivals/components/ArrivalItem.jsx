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
      />
    </article>
  );
};

export default ArrivalItem;
