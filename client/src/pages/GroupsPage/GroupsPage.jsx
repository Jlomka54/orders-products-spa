import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import OrderDetailsPanel from "../../features/orders/components/OrderDetailsPanel";
import OrderFormModal from "../../features/orders/components/OrderFormModal";
import ProductFormModal from "../../features/products/components/ProductFormModal";
import OrdersList from "../../features/orders/components/OrdersList";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectOrderFormOpen,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersMutationLoading,
  selectSelectedOrderId,
  selectSelectedOrderDetails,
} from "../../features/orders/ordersSelectors";
import {
  clearSelectedOrder,
  closeDeleteModal,
  closeOrderFormModal,
  createOrder,
  fetchOrderById,
  fetchOrders,
  openCreateOrderModal,
  openDeleteModal,
  removeOrder,
  setSelectedOrderId,
} from "../../features/orders/ordersSlice";
import {
  selectProductFormOpen,
  selectProductsMutationLoading,
} from "../../features/products/productsSelectors";
import {
  closeProductFormModal,
  createProduct,
  openCreateProductModal,
  removeProduct,
} from "../../features/products/productsSlice";
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
  const isProductFormOpen = useSelector(selectProductFormOpen);
  const mutationLoading = useSelector(selectOrdersMutationLoading);
  const productMutationLoading = useSelector(selectProductsMutationLoading);

  const selectedDetailsId = getOrderId(selectedOrderDetails);
  const activeSelectedOrderDetails = isSameOrder(
    selectedDetailsId,
    selectedOrderId,
  )
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

  const handleCloseDetailsPanel = () => {
    dispatch(clearSelectedOrder());
  };

  const handleOpenCreateOrderModal = () => {
    dispatch(openCreateOrderModal());
  };

  const handleCloseOrderFormModal = () => {
    dispatch(closeOrderFormModal());
  };

  const handleOrderSubmit = (payload) => {
    const groupOrderPayload = {
      title: payload.name,
      date: new Date().toISOString(),
      description: payload.description,
    };

    dispatch(createOrder(groupOrderPayload));
  };

  const handleOpenDeleteModal = (orderId) => {
    dispatch(openDeleteModal(orderId));
  };

  const handleOpenCreateProductModal = () => {
    dispatch(openCreateProductModal());
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleCloseProductFormModal = () => {
    dispatch(closeProductFormModal());
  };

  const handleDeleteProduct = async (productId) => {
    if (productId !== null && productId !== undefined) {
      const result = await dispatch(removeProduct(productId));

      if (result?.meta?.requestStatus === "fulfilled" && selectedOrderId) {
        dispatch(fetchOrderById(selectedOrderId));
      }
    }
  };

  const handleProductSubmit = (payload) => {
    const productPayload = selectedOrderId
      ? { ...payload, order: Number(selectedOrderId) }
      : payload;

    dispatch(createProduct(productPayload));
  };

  const handleConfirmDelete = () => {
    if (deleteModalOrderId === null || deleteModalOrderId === undefined) {
      return;
    }

    dispatch(removeOrder(deleteModalOrderId));
  };

  if (isInitialLoading) {
    return <Loader text="Загрузка групп..." />;
  }

  if (hasBlockingError) {
    return <ErrorMessage message={`Не удалось загрузить группы: ${error}`} />;
  }

  return (
    <section className="groups-page">
      <header className="orders-page__header">
        <button
          className="orders-page__create-button"
          type="button"
          aria-label="Создать группу"
          onClick={handleOpenCreateOrderModal}
        >
          + Создать группу
        </button>
        <h1 className="orders-page__heading">Группы / {orders.length}</h1>
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
        <div className="orders-page__content">
          <OrdersList
            orders={orders}
            selectedOrderId={selectedOrderId}
            onOrderSelect={handleOrderClick}
            onDeleteOrder={handleOpenDeleteModal}
          />

          <OrderDetailsPanel
            selectedOrderDetails={activeSelectedOrderDetails}
            onAddProduct={handleOpenCreateProductModal}
            onDeleteProduct={handleDeleteProduct}
            onClose={handleCloseDetailsPanel}
          />
        </div>
      ) : (
        <EmptyState message="Группы не найдены." />
      )}

      <OrderFormModal
        isOpen={isOrderFormOpen}
        isLoading={mutationLoading}
        onClose={handleCloseOrderFormModal}
        onSubmit={handleOrderSubmit}
      />

      <ProductFormModal
        isOpen={isProductFormOpen}
        mode="create"
        product={
          selectedOrderId
            ? { order: Number(selectedOrderId), date: new Date().toISOString() }
            : undefined
        }
        isLoading={productMutationLoading}
        onClose={handleCloseProductFormModal}
        onSubmit={handleProductSubmit}
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
