import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilteredProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductSpecifications,
  selectProductTypes,
  selectSelectedSpecification,
  selectSelectedType,
} from "../../features/products/productsSelectors";
import {
  fetchProducts,
  removeProduct,
  setSelectedSpecification,
  setSelectedType,
  updateProduct,
} from "../../features/products/productsSlice";
import AddProductModal from "../../features/orders/components/AddProductModal";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import ProductsFilters from "../../features/products/components/ProductsFilters";
import ProductsList from "../../features/products/components/ProductsList";
import "./ProductsPage.css";

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const [editingProduct, setEditingProduct] = useState(null);
  const [productActionError, setProductActionError] = useState("");
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const selectedType = useSelector(selectSelectedType);
  const selectedSpecification = useSelector(selectSelectedSpecification);
  const productTypes = useSelector(selectProductTypes);
  const productSpecifications = useSelector(selectProductSpecifications);
  const isProductModalOpen = editingProduct !== null;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleTypeChange = (event) => {
    dispatch(setSelectedType(event.target.value));
  };

  const handleSpecificationChange = (event) => {
    dispatch(setSelectedSpecification(event.target.value));
  };

  const getProductRequestId = (product) => product?._id ?? product?.id ?? null;

  const getProductOrderLinkId = (product) => {
    const rawOrderLinkId =
      product?.order?.legacyId ?? product?.order?.id ?? product?.order;
    const numericOrderLinkId = Number(rawOrderLinkId);

    return Number.isFinite(numericOrderLinkId) ? numericOrderLinkId : null;
  };

  const handleOpenEditProductModal = (product) => {
    setProductActionError("");
    setEditingProduct(product);
  };

  const handleCloseEditProductModal = () => {
    if (isLoading) {
      return;
    }

    setEditingProduct(null);
    setProductActionError("");
  };

  const handleSaveProduct = async (product) => {
    const productId = getProductRequestId(editingProduct);

    if (productId === null || productId === undefined) {
      setProductActionError("Не удалось определить ID продукта для редактирования.");
      return;
    }

    setProductActionError("");

    try {
      await dispatch(
        updateProduct({
          productId,
          product,
        }),
      ).unwrap();
      setEditingProduct(null);
    } catch (submitError) {
      setProductActionError(
        submitError || "Не удалось сохранить продукт. Попробуйте еще раз.",
      );
    }
  };

  const handleDeleteProduct = async (product) => {
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
      await dispatch(removeProduct(productId)).unwrap();
    } catch (deleteError) {
      setProductActionError(
        deleteError || "Не удалось удалить продукт. Попробуйте еще раз.",
      );
    }
  };

  if (isLoading && products.length === 0) {
    return <Loader text="Loading products..." />;
  }

  if (error && products.length === 0) {
    return <ErrorMessage message={`Failed to load products: ${error}`} />;
  }

  if (products.length === 0) {
    return <EmptyState message="No products found." />;
  }

  return (
    <section className="products-page">
      <header className="products-page__header">
        <h1 className="products-page__heading">
          Продукты / {products.length}
        </h1>

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

      {productActionError && !isProductModalOpen && (
        <ErrorMessage message={productActionError} />
      )}

      {isLoading && (
        <Loader text="Loading products..." />
      )}

      {filteredProducts.length === 0 ? (
        <EmptyState message="No products match filters." />
      ) : (
        <ProductsList
          products={filteredProducts}
          isLoading={isLoading}
          onEditProduct={handleOpenEditProductModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {isProductModalOpen && (
        <AddProductModal
          key={`edit-${getProductRequestId(editingProduct)}`}
          isOpen={isProductModalOpen}
          isLoading={isLoading}
          mode="edit"
          orderLinkId={getProductOrderLinkId(editingProduct)}
          orderTitle={editingProduct?.orderTitle}
          product={editingProduct}
          error={productActionError}
          onClose={handleCloseEditProductModal}
          onSubmit={handleSaveProduct}
        />
      )}
    </section>
  );
};
