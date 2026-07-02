import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectSelectedOrderId,
} from "../../features/orders/ordersSelectors";
import {
  fetchOrderById,
  fetchOrders,
  setSelectedOrderId,
} from "../../features/orders/ordersSlice";
import { calculateOrderTotal } from "../../utils/calculateOrderTotal";
import { formatShortDate, formatLongDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import "./OrdersPage.css";

const getOrderId = (order) => order.id || order._id;

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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrderId = useSelector(selectSelectedOrderId);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = (orderId) => {
    dispatch(setSelectedOrderId(orderId));
    dispatch(fetchOrderById(orderId));
  };

  if (isLoading && orders.length === 0) {
    return <div className="orders-page__state">Loading orders...</div>;
  }

  if (error && orders.length === 0) {
    return <div className="orders-page__state">Failed to load orders: {error}</div>;
  }

  if (orders.length === 0) {
    return <div className="orders-page__state">No orders found.</div>;
  }

  return (
    <section className="orders-page">
      {error && (
        <div className="orders-page__state">Failed to load orders: {error}</div>
      )}

      {isLoading && (
        <div className="orders-page__state">Loading orders...</div>
      )}

      <ul className="orders-page__list">
        {orders.map((order) => {
          const orderId = getOrderId(order);
          const products = getOrderProducts(order);
          const orderDate = getOrderDate(order);
          const isSelected = String(orderId) === String(selectedOrderId);

          return (
            <li className="orders-page__item" key={orderId}>
              <button
                className={`orders-page__order${
                  isSelected ? " orders-page__order--selected" : ""
                }`}
                type="button"
                onClick={() => handleOrderClick(orderId)}
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
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default OrdersPage;
