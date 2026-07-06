import { useEffect, useState } from "react";
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
  addProductToOrder,
  closeDeleteModal,
  fetchOrderById,
  fetchOrders,
  openDeleteModal,
  removeOrder,
  setSelectedOrderId,
} from "../../features/orders/ordersSlice";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import AddProductModal from "../../features/orders/components/AddProductModal";
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
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [addProductError, setAddProductError] = useState("");
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
  const hasOrders = orders.length > 0;
  const isInitialLoading = isLoading && !hasOrders;
  const hasBlockingError = error && !hasOrders;
  const orderLinkId = (() => {
    const rawOrderLinkId =
      activeSelectedOrderDetails?.legacyId ?? activeSelectedOrderDetails?.id;
    const numericOrderLinkId = Number(rawOrderLinkId);

    return Number.isFinite(numericOrderLinkId) ? numericOrderLinkId : null;
  })();

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

  const handleOpenAddProductModal = () => {
    setAddProductError("");
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    if (isLoading) {
      return;
    }

    setIsAddProductModalOpen(false);
    setAddProductError("");
  };

  const handleAddProduct = async (product) => {
    if (selectedOrderId === null || selectedOrderId === undefined) {
      return;
    }

    setAddProductError("");

    try {
      await dispatch(
        addProductToOrder({
          orderId: selectedOrderId,
          product,
        }),
      ).unwrap();
      setIsAddProductModalOpen(false);
    } catch (submitError) {
      setAddProductError(
        submitError || "Не удалось добавить продукт. Попробуйте еще раз.",
      );
    }
  };

  if (isInitialLoading) {
    return <Loader text="Loading orders..." />;
  }

  if (hasBlockingError) {
    return <ErrorMessage message={`Failed to load orders: ${error}`} />;
  }

  if (!hasOrders) {
    return <EmptyState message="No orders found." />;
  }

  return (
    <section className="orders-page">
      <header className="orders-page__header">
        <button
          className="orders-page__add-button"
          type="button"
          aria-label="Добавить приход"
        >
          +
        </button>
        <h1 className="orders-page__heading">Приходы / {orders.length}</h1>
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

      <div className="orders-page__content">
        <OrdersList
          orders={orders}
          selectedOrderId={selectedOrderId}
          onOrderSelect={handleOrderClick}
          onDeleteOrder={handleOpenDeleteModal}
        />

        <OrderDetailsPanel
          selectedOrderDetails={activeSelectedOrderDetails}
          onAddProduct={handleOpenAddProductModal}
        />
      </div>

      {isAddProductModalOpen && (
        <AddProductModal
          isOpen={isAddProductModalOpen}
          isLoading={isLoading}
          orderLinkId={orderLinkId}
          orderTitle={activeSelectedOrderDetails?.title}
          error={addProductError}
          onClose={handleCloseAddProductModal}
          onSubmit={handleAddProduct}
        />
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
