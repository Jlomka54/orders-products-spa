import { useEffect } from "react";
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
  setSelectedSpecification,
  setSelectedType,
} from "../../features/products/productsSlice";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import ProductsFilters from "../../features/products/components/ProductsFilters";
import ProductsList from "../../features/products/components/ProductsList";
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleTypeChange = (event) => {
    dispatch(setSelectedType(event.target.value));
  };

  const handleSpecificationChange = (event) => {
    dispatch(setSelectedSpecification(event.target.value));
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

      {isLoading && (
        <Loader text="Loading products..." />
      )}

      {filteredProducts.length === 0 ? (
        <EmptyState message="No products match filters." />
      ) : (
        <ProductsList products={filteredProducts} />
      )}
    </section>
  );
};
