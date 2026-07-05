import { calculateOrderTotal } from "../../../utils/calculateOrderTotal";
import { formatLongDate, formatShortDate } from "../../../utils/formatDate";
import { formatPrice, formatProductPrices } from "../../../utils/formatPrice";
import {
  getOrderDate,
  getOrderProducts,
} from "../../../utils/orderHelpers";

const OrderDetailsPanel = ({ selectedOrderDetails }) => {
  if (!selectedOrderDetails) {
    return null;
  }

  const products = getOrderProducts(selectedOrderDetails);
  const orderDate = getOrderDate(selectedOrderDetails);

  return (
    <aside className="orders-page__details-panel orders-page__details-panel--visible">
      <div className="orders-page__details-header">
        <h2 className="orders-page__details-title">
          {selectedOrderDetails.title}
        </h2>
        <div className="orders-page__details-dates">
          <span className="orders-page__details-short-date">
            {formatShortDate(orderDate)}
          </span>
          <span className="orders-page__details-long-date">
            {formatLongDate(orderDate)}
          </span>
        </div>
      </div>

      <div className="orders-page__details-totals">
        <span className="orders-page__details-total">
          {formatPrice(calculateOrderTotal(products, "USD"), "USD")}
        </span>
        <span className="orders-page__details-total">
          {formatPrice(calculateOrderTotal(products, "UAH"), "UAH")}
        </span>
      </div>

      {products.length > 0 ? (
        <ul className="orders-page__details-products">
          {products.map((product, index) => (
            <li
              className="orders-page__details-product"
              key={product.id ?? product._id ?? product.serialNumber ?? index}
            >
              <span className="orders-page__details-product-title">
                {product.title}
              </span>
              <span className="orders-page__details-product-price">
                {formatProductPrices(product.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products in this order</p>
      )}
    </aside>
  );
};

export default OrderDetailsPanel;
