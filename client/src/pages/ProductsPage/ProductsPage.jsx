import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import DeleteProductModal from "../../features/products/components/DeleteProductModal";
import ProductFormModal from "../../features/products/components/ProductFormModal";
import ProductsFilters from "../../features/products/components/ProductsFilters";
import ProductsList from "../../features/products/components/ProductsList";
import { selectOrders as selectGroups } from "../../features/orders/ordersSelectors";
import { fetchOrders as fetchGroups } from "../../features/orders/ordersSlice";
import {
  selectDeleteModalProduct,
  selectDeleteModalProductId,
  selectEditingProduct,
  selectFilteredProducts,
  selectProductFormMode,
  selectProductFormOpen,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductsMutationLoading,
  selectProductSpecifications,
  selectProductTypes,
  selectSelectedSpecification,
  selectSelectedType,
} from "../../features/products/productsSelectors";
import {
  closeDeleteProductModal,
  closeProductFormModal,
  createProduct,
  fetchProducts,
  openCreateProductModal,
  openDeleteProductModal,
  openEditProductModal,
  removeProduct,
  setSelectedSpecification,
  setSelectedType,
  updateProduct,
} from "../../features/products/productsSlice";
import { getProductRequestId } from "../../utils/productHelpers";
import "./ProductsPage.css";

const getGroupProductLinkId = (group) =>
  group?.legacyId ?? group?._id ?? group?.id ?? null;

const getGroupOptionLabel = (group, value) => {
  if (group?.title) {
    return group.title;
  }

  return `Группа ${value}`;
};

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const groups = useSelector(selectGroups);
  const filteredProducts = useSelector(selectFilteredProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const selectedType = useSelector(selectSelectedType);
  const selectedSpecification = useSelector(selectSelectedSpecification);
  const productTypes = useSelector(selectProductTypes);
  const productSpecifications = useSelector(selectProductSpecifications);
  const isProductFormOpen = useSelector(selectProductFormOpen);
  const productFormMode = useSelector(selectProductFormMode);
  const editingProduct = useSelector(selectEditingProduct);
  const deleteModalProductId = useSelector(selectDeleteModalProductId);
  const deleteModalProduct = useSelector(selectDeleteModalProduct);
  const mutationLoading = useSelector(selectProductsMutationLoading);
  const productGroups = groups
    .map((group) => {
      const value = getGroupProductLinkId(group);

      if (value === null || value === undefined) {
        return null;
      }

      return {
        value: String(value),
        label: getGroupOptionLabel(group, value),
      };
    })
    .filter(Boolean);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleTypeChange = (event) => {
    dispatch(setSelectedType(event.target.value));
  };

  const handleSpecificationChange = (event) => {
    dispatch(setSelectedSpecification(event.target.value));
  };

  const handleOpenCreateProductModal = () => {
    dispatch(openCreateProductModal());
  };

  const handleOpenEditProductModal = (product) => {
    dispatch(openEditProductModal(product));
  };

  const handleCloseProductFormModal = () => {
    dispatch(closeProductFormModal());
  };

  const handleOpenDeleteProductModal = (productId) => {
    dispatch(openDeleteProductModal(productId));
  };

  const handleCloseDeleteProductModal = () => {
    dispatch(closeDeleteProductModal());
  };

  const handleProductSubmit = (payload) => {
    if (productFormMode === "create") {
      dispatch(createProduct(payload));
      return;
    }

    const productId = getProductRequestId(editingProduct);

    if (productId !== null && productId !== undefined) {
      dispatch(updateProduct({ productId, productPayload: payload }));
    }
  };

  const handleProductDelete = () => {
    if (deleteModalProductId !== null && deleteModalProductId !== undefined) {
      dispatch(removeProduct(deleteModalProductId));
    }
  };

  if (isLoading && products.length === 0) {
    return <Loader text="Loading products..." />;
  }

  if (error && products.length === 0) {
    return <ErrorMessage message={`Failed to load products: ${error}`} />;
  }

  return (
    <section className="products-page">
      <header className="products-page__header">
        <h1 className="products-page__heading">Продукты / {products.length}</h1>

        <button
          className="products-page__add-button"
          type="button"
          onClick={handleOpenCreateProductModal}
        >
          + Добавить продукт
        </button>

        <ProductsFilters
          productTypes={productTypes}
          productSpecifications={productSpecifications}
          selectedType={selectedType}
          selectedSpecification={selectedSpecification}
          onTypeChange={handleTypeChange}
          onSpecificationChange={handleSpecificationChange}
        />
      </header>

      {error && (
        <ErrorMessage message={`Не удалось загрузить продукты: ${error}`} />
      )}

      {isLoading && <Loader text="Загрузка продуктов..." />}

      {filteredProducts.length === 0 ? (
        <EmptyState
          message={
            products.length === 0
              ? "Продукты не найдены."
              : "Нет продуктов, соответствующих фильтрам."
          }
        />
      ) : (
        <ProductsList
          products={filteredProducts}
          onEditProduct={handleOpenEditProductModal}
          onDeleteProduct={handleOpenDeleteProductModal}
        />
      )}

      <ProductFormModal
        isOpen={isProductFormOpen}
        mode={productFormMode}
        product={editingProduct}
        isLoading={mutationLoading}
        productTypes={productTypes}
        productSpecifications={productSpecifications}
        productGroups={productGroups}
        onClose={handleCloseProductFormModal}
        onSubmit={handleProductSubmit}
      />

      <DeleteProductModal
        product={deleteModalProduct}
        isOpen={
          deleteModalProductId !== null && deleteModalProductId !== undefined
        }
        isLoading={mutationLoading}
        onClose={handleCloseDeleteProductModal}
        onConfirm={handleProductDelete}
      />
    </section>
  );
};
