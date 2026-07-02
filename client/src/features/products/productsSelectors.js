export const selectProducts = (state) => state.products.items;

export const selectProductsLoading = (state) => state.products.isLoading;

export const selectProductsError = (state) => state.products.error;

export const selectSelectedType = (state) => state.products.selectedType;

export const selectSelectedSpecification = (state) =>
  state.products.selectedSpecification;

export const selectProductTypes = (state) =>
  Array.from(
    new Set(
      state.products.items
        .map((product) => product.type)
        .filter(Boolean),
    ),
  );

export const selectProductSpecifications = (state) =>
  Array.from(
    new Set(
      state.products.items
        .map((product) => product.specification)
        .filter(Boolean),
    ),
  );

export const selectFilteredProducts = (state) =>
  state.products.items.filter((product) => {
    const matchesType =
      state.products.selectedType === "all" ||
      product.type === state.products.selectedType;
    const matchesSpecification =
      state.products.selectedSpecification === "all" ||
      product.specification === state.products.selectedSpecification;

    return matchesType && matchesSpecification;
  });
