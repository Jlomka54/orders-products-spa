import { getOrderId } from "../../../utils/orderHelpers";
import ArrivalItem from "./ArrivalItem";

const hasUsableOrderId = (orderId) =>
  orderId !== null && orderId !== undefined && String(orderId).trim() !== "";

const ArrivalsList = ({ orders, onDeleteOrder }) => {
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <ul className="arrivals-list">
      {safeOrders.map((order, index) => {
        const orderId = getOrderId(order);

        if (!hasUsableOrderId(orderId)) {
          return null;
        }

        return (
          <li className="arrivals-list__item" key={orderId ?? index}>
            <ArrivalItem order={order} onDelete={onDeleteOrder} />
          </li>
        );
      })}
    </ul>
  );
};

export default ArrivalsList;
