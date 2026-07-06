import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import OrderDetailsPanel from "../../features/orders/components/OrderDetailsPanel";
import OrderFormModal from "../../features/orders/components/OrderFormModal";
import OrdersList from "../../features/orders/components/OrdersList";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectEditingOrder,
  selectOrderFormMode,
  selectOrderFormOpen,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersMutationLoading,
  selectSelectedOrderId,
  selectSelectedOrderDetails,
} from "../../features/orders/ordersSelectors";
import {
  closeDeleteModal,
  closeOrderFormModal,
  createOrder,
  fetchOrderById,
  fetchOrders,
  openCreateOrderModal,
  openDeleteModal,
  openEditOrderModal,
  removeOrder,
  setSelectedOrderId,
  updateOrder,
} from "../../features/orders/ordersSlice";
import {
  getOrderId,
  getOrderRequestId,
  isSameOrder,
} from "../../utils/orderHelpers";
import "./GroupsPage.css";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrderId = useSelector(selectSelectedOrderId);
  const selectedOrderDetails = useSelector(selectSelectedOrderDetails);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);
  const isOrderFormOpen = useSelector(selectOrderFormOpen);
  const orderFormMode = useSelector(selectOrderFormMode);
  const editingOrder = useSelector(selectEditingOrder);
  const mutationLoading = useSelector(selectOrdersMutationLoading);

  const selectedDetailsId = getOrderId(selectedOrderDetails);
  const activeSelectedOrderDetails =
    isSameOrder(selectedDetailsId, selectedOrderId)
      ? selectedOrderDetails
      : null;
  const hasOrders = orders.length > 0;
  const isInitialLoading = isLoading && !hasOrders;
  const hasBlockingError = error && !hasOrders;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = (orderId) => {
    dispatch(setSelectedOrderId(orderId));
    dispatch(fetchOrderById(orderId));
  };

  const handleOpenCreateOrderModal = () => {
    dispatch(openCreateOrderModal());
  };

  const handleOpenEditOrderModal = (order) => {
    dispatch(openEditOrderModal(order));
  };

  const handleCloseOrderFormModal = () => {
    dispatch(closeOrderFormModal());
  };

  const handleOrderSubmit = (payload) => {
    if (orderFormMode === "create") {
      dispatch(createOrder(payload));
      return;
    }

    const orderId = getOrderRequestId(editingOrder);

    if (orderId !== null && orderId !== undefined) {
      dispatch(updateOrder({ orderId, orderPayload: payload }));
    }
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

  if (isInitialLoading) {
    return <Loader text="Loading orders..." />;
  }

  if (hasBlockingError) {
    return <ErrorMessage message={`Failed to load orders: ${error}`} />;
  }

  return (
    <section className="groups-page">
      <header className="orders-page__header">
        <button
          className="orders-page__create-button"
          type="button"
          aria-label="Add order"
          onClick={handleOpenCreateOrderModal}
        >
          + Add order
        </button>
        <h1 className="orders-page__heading">Группы / {orders.length}</h1>
      </header>

      {(error || isLoading) && (
        <div className="orders-page__status">
          {error && (
            <ErrorMessage message={`Failed to load orders: ${error}`} />
          )}

          {isLoading && (
            <Loader text="Loading orders..." />
          )}
        </div>
      )}

      {hasOrders ? (
        <div className="orders-page__content">
          <OrdersList
            orders={orders}
            selectedOrderId={selectedOrderId}
            onOrderSelect={handleOrderClick}
            onDeleteOrder={handleOpenDeleteModal}
            onEditOrder={handleOpenEditOrderModal}
          />

          <OrderDetailsPanel
            selectedOrderDetails={activeSelectedOrderDetails}
            onEditOrder={handleOpenEditOrderModal}
          />
        </div>
      ) : (
        <EmptyState message="No orders found." />
      )}

      <OrderFormModal
        isOpen={isOrderFormOpen}
        mode={orderFormMode}
        order={editingOrder}
        isLoading={mutationLoading}
        onClose={handleCloseOrderFormModal}
        onSubmit={handleOrderSubmit}
      />

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

export default GroupsPage;
