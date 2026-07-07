import { useEffect, useRef } from "react";
import {
  getProductId,
  isSameProduct,
} from "../../../utils/productHelpers";
import ProductItem from "./ProductItem";

const ProductsList = ({
  products,
  selectedProductId,
  onEditProduct,
  onDeleteProduct,
}) => {
  const highlightedProductRef = useRef(null);

  useEffect(() => {
    highlightedProductRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [products, selectedProductId]);

  return (
    <ul className="products-page__list">
      {products.map((product, index) => {
        const productId = getProductId(product);
        const isHighlighted = isSameProduct(productId, selectedProductId);

        return (
          <li
            className={`products-page__item${
              isHighlighted ? " products-page__item--highlighted" : ""
            }`}
            ref={isHighlighted ? highlightedProductRef : null}
            key={product.id ?? product._id ?? product.serialNumber ?? index}
          >
            <ProductItem
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ProductsList;
