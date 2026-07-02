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
import { formatLongDate, formatShortDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import "./ProductsPage.css";

const findPrice = (prices, symbol) => {
  if (!Array.isArray(prices)) {
    return null;
  }

  return prices.find((price) => price?.symbol === symbol) || null;
};

const getOrderTitle = (product) => {
  if (product.orderTitle) {
    return product.orderTitle;
  }

  if (product.order?.title) {
    return product.order.title;
  }

  if (product.order === null || product.order === undefined) {
    return "";
  }

  return String(product.order);
};

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

      <div className="products-page__filters">
        <label className="products-page__filter">
          <span className="products-page__filter-label">Type</span>
          <select
            className="products-page__select"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="all">All types</option>
            {productTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {productSpecifications.length > 0 && (
          <label className="products-page__filter">
            <span className="products-page__filter-label">Specification</span>
            <select
              className="products-page__select"
              value={selectedSpecification}
              onChange={handleSpecificationChange}
            >
              <option value="all">All specifications</option>
              {productSpecifications.map((specification) => (
                <option value={specification} key={specification}>
                  {specification}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="products-page__state">No products match filters.</div>
      ) : (
        <ul className="products-page__list">
          {filteredProducts.map((product, index) => {
            const usdPrice = findPrice(product.price, "USD");
            const uahPrice = findPrice(product.price, "UAH");

            return (
              <li
                className="products-page__item"
                key={product.id ?? product._id ?? product.serialNumber ?? index}
              >
                <article className="products-page__product">
                  <span className="products-page__title">{product.title}</span>
                  <span className="products-page__type">{product.type}</span>
                  <span className="products-page__specification">
                    {product.specification}
                  </span>
                  <span className="products-page__serial-number">
                    {product.serialNumber}
                  </span>
                  <span className="products-page__guarantee-start">
                    {formatShortDate(product.guarantee?.start)}
                  </span>
                  <span className="products-page__guarantee-end">
                    {formatShortDate(product.guarantee?.end)}
                  </span>
                  <span className="products-page__price-usd">
                    {formatPrice(usdPrice?.value, usdPrice?.symbol)}
                  </span>
                  <span className="products-page__price-uah">
                    {formatPrice(uahPrice?.value, uahPrice?.symbol)}
                  </span>
                  <span className="products-page__order-title">
                    {getOrderTitle(product)}
                  </span>
                  <span className="products-page__date">
                    {formatLongDate(product.date)}
                  </span>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
