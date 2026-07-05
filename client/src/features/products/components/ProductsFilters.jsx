const ProductsFilters = ({
  productTypes,
  productSpecifications,
  selectedType,
  selectedSpecification,
  onTypeChange,
  onSpecificationChange,
}) => {
  return (
    <div className="products-page__filters">
      <label className="products-page__filter">
        <span className="products-page__filter-label">Тип:</span>
        <select
          className="products-page__select"
          value={selectedType}
          onChange={onTypeChange}
        >
          <option value="all">Все типы</option>
          {productTypes.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      {productSpecifications.length > 0 && (
        <label className="products-page__filter">
          <span className="products-page__filter-label">Спецификация:</span>
          <select
            className="products-page__select"
            value={selectedSpecification}
            onChange={onSpecificationChange}
          >
            <option value="all">Все спецификации</option>
            {productSpecifications.map((specification) => (
              <option value={specification} key={specification}>
                {specification}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};

export default ProductsFilters;
