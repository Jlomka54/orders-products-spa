import OrderItem from "./OrderItem";

const getOrderId = (order) => order.id ?? order._id;

const OrdersList = ({
  orders,
  selectedOrderId,
  onOrderSelect,
  onDeleteOrder,
}) => {
  return (
    <ul className="orders-page__list">
      {orders.map((order, index) => {
        const orderId = getOrderId(order);
        const isSelected = String(orderId) === String(selectedOrderId);

        return (
          <li className="orders-page__item" key={orderId ?? index}>
            <OrderItem
              order={order}
              isSelected={isSelected}
              onSelect={() => onOrderSelect(orderId)}
              onDelete={() => onDeleteOrder(orderId)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default OrdersList;
