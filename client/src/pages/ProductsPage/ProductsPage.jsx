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
    return <div className="products-page__state">Loading products...</div>;
  }

  if (error && products.length === 0) {
    return (
      <div className="products-page__state">
        Failed to load products: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="products-page__state">No products found.</div>;
  }

  return (
    <section className="products-page">
      {error && (
        <div className="products-page__state">
          Failed to load products: {error}
        </div>
      )}

      {isLoading && (
        <div className="products-page__state">Loading products...</div>
      )}

      <ProductsFilters
        productTypes={productTypes}
        productSpecifications={productSpecifications}
        selectedType={selectedType}
        selectedSpecification={selectedSpecification}
        onTypeChange={handleTypeChange}
        onSpecificationChange={handleSpecificationChange}
      />

      {filteredProducts.length === 0 ? (
        <div className="products-page__state">No products match filters.</div>
      ) : (
        <ProductsList products={filteredProducts} />
      )}
    </section>
  );
};
