import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import ArrivalsList from "../../features/arrivals/components/ArrivalsList";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersMutationLoading,
} from "../../features/orders/ordersSelectors";
import {
  closeDeleteModal,
  fetchOrders,
  openDeleteModal,
  removeOrder,
} from "../../features/orders/ordersSlice";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);

  const hasOrders = orders.length > 0;
  const isInitialLoading = isLoading && !hasOrders;
  const hasBlockingError = error && !hasOrders;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

  if (isInitialLoading) {
    return <Loader text="Loading orders..." />;
  }

  if (hasBlockingError) {
    return <ErrorMessage message={`Failed to load orders: ${error}`} />;
  }

  return (
    <section className="orders-page orders-page--arrivals">
      <header className="orders-page__header">
        <h1 className="orders-page__heading">Приходы / {orders.length}</h1>
      </header>

      {(error || isLoading) && (
        <div className="orders-page__status">
          {error && (
            <ErrorMessage message={`Failed to load orders: ${error}`} />
          )}

          {isLoading && <Loader text="Loading orders..." />}
        </div>
      )}

      {hasOrders ? (
        <ArrivalsList orders={orders} onDeleteOrder={handleOpenDeleteModal} />
      ) : (
        <EmptyState message="No orders found." />
      )}

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
