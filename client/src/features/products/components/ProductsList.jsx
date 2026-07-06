import ProductItem from "./ProductItem";

const ProductsList = ({
  products,
  isLoading,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <ul className="products-page__list">
      {products.map((product, index) => (
        <li
          className="products-page__item"
          key={product.id ?? product._id ?? product.serialNumber ?? index}
        >
          <ProductItem
            product={product}
            isLoading={isLoading}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProductsList;
