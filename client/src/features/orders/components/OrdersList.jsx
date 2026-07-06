import {
  getOrderId,
  isSameOrder,
} from "../../../utils/orderHelpers";
import OrderItem from "./OrderItem";

const OrdersList = ({
  orders,
  selectedOrderId,
  onOrderSelect,
  onDeleteOrder,
  onEditOrder,
}) => {
  return (
    <ul className="orders-page__list">
      {orders.map((order, index) => {
        const orderId = getOrderId(order);

        if (orderId === null) {
          return null;
        }

        const isSelected = isSameOrder(orderId, selectedOrderId);

        return (
          <li className="orders-page__item" key={orderId ?? index}>
            <OrderItem
              order={order}
              isSelected={isSelected}
              onSelect={() => onOrderSelect(orderId)}
              onDelete={() => onDeleteOrder(orderId)}
              onEdit={onEditOrder}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default OrdersList;
