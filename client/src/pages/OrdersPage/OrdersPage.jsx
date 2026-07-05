import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectSelectedOrderId,
  selectSelectedOrderDetails,
} from "../../features/orders/ordersSelectors";
import {
  closeDeleteModal,
  fetchOrderById,
  fetchOrders,
  openDeleteModal,
  removeOrder,
  setSelectedOrderId,
} from "../../features/orders/ordersSlice";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import OrderDetailsPanel from "../../features/orders/components/OrderDetailsPanel";
import OrdersList from "../../features/orders/components/OrdersList";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import {
  getOrderId,
  isSameOrder,
} from "../../utils/orderHelpers";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrderId = useSelector(selectSelectedOrderId);
  const selectedOrderDetails = useSelector(selectSelectedOrderDetails);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);

  const selectedDetailsId = getOrderId(selectedOrderDetails);
  const activeSelectedOrderDetails =
    isSameOrder(selectedDetailsId, selectedOrderId)
      ? selectedOrderDetails
      : null;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = (orderId) => {
    dispatch(setSelectedOrderId(orderId));
    dispatch(fetchOrderById(orderId));
  };

  const handleOpenDeleteModal = (orderId) => {
    dispatch(openDeleteModal(orderId));
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleConfirmDelete = () => {
    if (deleteModalOrderId === null || deleteModalOrderId === undefined) {
      return;
    }

    dispatch(removeOrder(deleteModalOrderId));
  };

  if (isLoading && orders.length === 0) {
    return <Loader text="Loading orders..." />;
  }

  if (error && orders.length === 0) {
    return <ErrorMessage message={`Failed to load orders: ${error}`} />;
  }

  if (orders.length === 0) {
    return <EmptyState message="No orders found." />;
  }

  return (
    <section className="orders-page">
      {error && (
        <ErrorMessage message={`Failed to load orders: ${error}`} />
      )}

      {isLoading && (
        <Loader text="Loading orders..." />
      )}

      <div className="orders-page__content">
        <OrdersList
          orders={orders}
          selectedOrderId={selectedOrderId}
          onOrderSelect={handleOrderClick}
          onDeleteOrder={handleOpenDeleteModal}
        />

        <OrderDetailsPanel selectedOrderDetails={activeSelectedOrderDetails} />
      </div>

      <DeleteOrderModal
        deleteModalOrderId={deleteModalOrderId}
        order={deleteModalOrder}
        isLoading={isLoading}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default OrdersPage;
