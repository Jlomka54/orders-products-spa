import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import ArrivalsList from "../../features/arrivals/components/ArrivalsList";
import AddProductModal from "../../features/orders/components/AddProductModal";
import DeleteOrderModal from "../../features/orders/components/DeleteOrderModal";
import {
  selectDeleteModalOrder,
  selectDeleteModalOrderId,
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersMutationLoading,
  selectSelectedOrderId,
  selectSelectedOrderDetails,
} from "../../features/orders/ordersSelectors";
import {
  addProductToOrder,
  closeDeleteModal,
  fetchOrders,
  openDeleteModal,
  removeOrder,
  updateProductInOrder,
} from "../../features/orders/ordersSlice";
import "./OrdersPage.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const [productModalMode, setProductModalMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productActionError, setProductActionError] = useState("");
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const mutationLoading = useSelector(selectOrdersMutationLoading);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);
  const selectedOrderId = useSelector(selectSelectedOrderId);
  const activeSelectedOrderDetails = useSelector(selectSelectedOrderDetails);
  const isProductModalOpen = productModalMode !== null;

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

  const handleCloseAddProductModal = () => {
    if (isLoading) {
      return;
    }

    setProductModalMode(null);
    setEditingProduct(null);
    setProductActionError("");
  };

  const getProductRequestId = (product) => product?._id ?? product?.id ?? null;

  const handleSaveProduct = async (product) => {
    if (selectedOrderId === null || selectedOrderId === undefined) {
      return;
    }

    setProductActionError("");

    try {
      if (productModalMode === "edit") {
        const productId = getProductRequestId(editingProduct);

        if (productId === null || productId === undefined) {
          setProductActionError(
            "Не удалось определить ID продукта для редактирования.",
          );
          return;
        }

        await dispatch(
          updateProductInOrder({
            orderId: selectedOrderId,
            productId,
            product,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addProductToOrder({
            orderId: selectedOrderId,
            product,
          }),
        ).unwrap();
      }

      setProductModalMode(null);
      setEditingProduct(null);
    } catch (submitError) {
      setProductActionError(
        submitError || "Не удалось добавить продукт. Попробуйте еще раз.",
      );
    }
  };

  if (isInitialLoading) {
    return <Loader text="Загрузка приходов..." />;
  }

  if (hasBlockingError) {
    return <ErrorMessage message={`Не удалось загрузить приходы: ${error}`} />;
  }

  return (
    <section className="orders-page orders-page--arrivals">
      <header className="orders-page__header">
        <h1 className="orders-page__heading">Приходы / {orders.length}</h1>
      </header>

      {(error || isLoading) && (
        <div className="orders-page__status">
          {error && (
            <ErrorMessage message={`Не удалось загрузить приходы: ${error}`} />
          )}

          {isLoading && <Loader text="Загрузка приходов..." />}
        </div>
      )}

      {hasOrders ? (
        <ArrivalsList orders={orders} onDeleteOrder={handleOpenDeleteModal} />
      ) : (
        <EmptyState message="Приходы не найдены." />
      )}

      {productActionError && !isProductModalOpen && (
        <p className="orders-page__action-error">{productActionError}</p>
      )}

      {isProductModalOpen && (
        <AddProductModal
          key={`${productModalMode}-${getProductRequestId(editingProduct) ?? "new"}`}
          isOpen={isProductModalOpen}
          isLoading={mutationLoading}
          mode={productModalMode}
          orderLinkId={orderLinkId}
          orderTitle={activeSelectedOrderDetails?.title}
          product={editingProduct}
          error={productActionError}
          onClose={handleCloseAddProductModal}
          onSubmit={handleSaveProduct}
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
