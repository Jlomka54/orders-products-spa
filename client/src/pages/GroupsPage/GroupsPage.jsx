import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import AddExistingProductModal from "../../features/groups/components/AddExistingProductModal";
import RemoveProductFromGroupModal from "../../features/groups/components/RemoveProductFromGroupModal";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import OrderDetailsPanel from "../../features/orders/components/OrderDetailsPanel";
import OrderFormModal from "../../features/orders/components/OrderFormModal";
import OrdersList from "../../features/orders/components/OrdersList";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectGroupProductIds,
  selectIsProductLinking,
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
  openEditOrderModal,
  openDeleteModal,
  removeOrder,
  removeProductFromGroup,
  setSelectedOrderId,
} from "../../features/orders/ordersSlice";
import {
  getOrderId,
  isSameOrder,
} from "../../utils/orderHelpers";
import { getProductId } from "../../utils/productHelpers";
import "./GroupsPage.css";

export const GroupsPage = () => {
  const dispatch = useDispatch();
  const [isAddExistingProductModalOpen, setIsAddExistingProductModalOpen] =
    useState(false);
  const [productPendingRemoval, setProductPendingRemoval] = useState(null);
  const [removeProductError, setRemoveProductError] = useState("");
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrderId = useSelector(selectSelectedOrderId);
  const selectedOrderDetails = useSelector(selectSelectedOrderDetails);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);
  const isOrderFormOpen = useSelector(selectOrderFormOpen);
  const selectedGroupProductIds = useSelector(selectGroupProductIds);
  const mutationLoading = useSelector(selectOrdersMutationLoading);
  const isProductLinking = useSelector(selectIsProductLinking);

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

  const handleOpenAddExistingProductModal = () => {
    setIsAddExistingProductModalOpen(true);
  };

  const handleOpenEditOrderModal = (order) => {
    dispatch(openEditOrderModal(order));
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleCloseAddExistingProductModal = () => {
    setIsAddExistingProductModalOpen(false);
  };

  const handleOpenRemoveProductModal = (product) => {
    setProductPendingRemoval(product);
    setRemoveProductError("");
  };

  const handleCloseRemoveProductModal = () => {
    if (!isProductLinking) {
      setProductPendingRemoval(null);
      setRemoveProductError("");
    }
  };

  const handleConfirmRemoveProductFromGroup = async () => {
    const productId = getProductId(productPendingRemoval);

    if (
      selectedOrderId === null ||
      selectedOrderId === undefined ||
      productId === null ||
      productId === undefined
    ) {
      setRemoveProductError("Не удалось определить группу или продукт.");
      return;
    }

    try {
      await dispatch(
        removeProductFromGroup({
          groupId: selectedOrderId,
          productId,
        }),
      ).unwrap();
      setProductPendingRemoval(null);
      setRemoveProductError("");
    } catch (error) {
      setRemoveProductError(
        error ||
          "Не удалось убрать продукт из группы. Попробуйте еще раз.",
      );
    }
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
            onEditOrder={handleOpenEditOrderModal}
          />

          <OrderDetailsPanel
            selectedOrderDetails={activeSelectedOrderDetails}
            onAddProduct={handleOpenAddExistingProductModal}
            onDeleteProduct={handleOpenRemoveProductModal}
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

      {isAddExistingProductModalOpen && (
        <AddExistingProductModal
          isOpen={isAddExistingProductModalOpen}
          selectedGroupId={selectedOrderId}
          selectedGroupProductIds={selectedGroupProductIds}
          onClose={handleCloseAddExistingProductModal}
        />
      )}

      <RemoveProductFromGroupModal
        isOpen={productPendingRemoval !== null}
        product={productPendingRemoval}
        isLoading={isProductLinking}
        error={removeProductError}
        onClose={handleCloseRemoveProductModal}
        onConfirm={handleConfirmRemoveProductFromGroup}
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
