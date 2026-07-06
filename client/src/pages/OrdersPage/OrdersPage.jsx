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
  removeProductFromOrder,
  removeOrder,
  setSelectedOrderId,
  updateProductInOrder,
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
  const [productModalMode, setProductModalMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productActionError, setProductActionError] = useState("");
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const selectedOrderId = useSelector(selectSelectedOrderId);
  const selectedOrderDetails = useSelector(selectSelectedOrderDetails);
  const deleteModalOrderId = useSelector(selectDeleteModalOrderId);
  const deleteModalOrder = useSelector(selectDeleteModalOrder);
  const isProductModalOpen = productModalMode !== null;

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
    setProductActionError("");
    setEditingProduct(null);
    setProductModalMode("add");
  };

  const handleOpenEditProductModal = (product) => {
    setProductActionError("");
    setEditingProduct(product);
    setProductModalMode("edit");
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
          setProductActionError("Не удалось определить ID продукта для редактирования.");
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

  const handleDeleteProduct = async (product) => {
    if (selectedOrderId === null || selectedOrderId === undefined) {
      return;
    }

    const productId = getProductRequestId(product);

    if (productId === null || productId === undefined) {
      setProductActionError("Не удалось определить ID продукта для удаления.");
      return;
    }

    if (!window.confirm(`Удалить продукт "${product.title}"?`)) {
      return;
    }

    setProductActionError("");

    try {
      await dispatch(
        removeProductFromOrder({
          orderId: selectedOrderId,
          productId,
        }),
      ).unwrap();
    } catch (deleteError) {
      setProductActionError(
        deleteError || "Не удалось удалить продукт. Попробуйте еще раз.",
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
          onEditProduct={handleOpenEditProductModal}
          onDeleteProduct={handleDeleteProduct}
          isLoading={isLoading}
        />
      </div>

      {productActionError && !isProductModalOpen && (
        <p className="orders-page__action-error">{productActionError}</p>
      )}

      {isProductModalOpen && (
        <AddProductModal
          key={`${productModalMode}-${getProductRequestId(editingProduct) ?? "new"}`}
          isOpen={isProductModalOpen}
          isLoading={isLoading}
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
