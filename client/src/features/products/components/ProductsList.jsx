import ProductItem from "./ProductItem";

const ProductsList = ({ products }) => {
  return (
    <ul className="products-page__list">
      {products.map((product, index) => (
        <li
          className="products-page__item"
          key={product.id ?? product._id ?? product.serialNumber ?? index}
        >
          <ProductItem product={product} />
        </li>
      ))}
    </ul>
  );
};

export default ProductsList;
