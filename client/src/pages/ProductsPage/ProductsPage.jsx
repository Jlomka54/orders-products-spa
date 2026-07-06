import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import DeleteProductModal from "../../features/products/components/DeleteProductModal";
import ProductFormModal from "../../features/products/components/ProductFormModal";
import ProductsFilters from "../../features/products/components/ProductsFilters";
import ProductsList from "../../features/products/components/ProductsList";
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

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
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

  useEffect(() => {
    dispatch(fetchProducts());
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
        <h1 className="products-page__heading">
          Продукты / {products.length}
        </h1>

        <button
          className="products-page__add-button"
          type="button"
          onClick={handleOpenCreateProductModal}
        >
          + Add product
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
        <ErrorMessage message={`Failed to load products: ${error}`} />
      )}

      {isLoading && (
        <Loader text="Loading products..." />
      )}

      {filteredProducts.length === 0 ? (
        <EmptyState
          message={
            products.length === 0
              ? "No products found."
              : "No products match filters."
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
        onClose={handleCloseProductFormModal}
        onSubmit={handleProductSubmit}
      />

      <DeleteProductModal
        product={deleteModalProduct}
        isOpen={deleteModalProductId !== null && deleteModalProductId !== undefined}
        isLoading={mutationLoading}
        onClose={handleCloseDeleteProductModal}
        onConfirm={handleProductDelete}
      />
    </section>
  );
};
