import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.products.items;

export const selectProductsLoading = (state) => state.products.isLoading;

export const selectProductsError = (state) => state.products.error;

export const selectSelectedType = (state) => state.products.selectedType;

export const selectSelectedSpecification = (state) =>
  state.products.selectedSpecification;

export const selectProductTypes = createSelector([selectProducts], (products) =>
  Array.from(
    new Set(
      products
        .map((product) => product.type)
        .filter(Boolean),
    ),
  ));

export const selectProductSpecifications = createSelector(
  [selectProducts],
  (products) =>
    Array.from(
      new Set(
        products
          .map((product) => product.specification)
          .filter(Boolean),
      ),
    ),
);

export const selectFilteredProducts = createSelector(
  [selectProducts, selectSelectedType, selectSelectedSpecification],
  (products, selectedType, selectedSpecification) =>
    products.filter((product) => {
    const matchesType =
      selectedType === "all" ||
      product.type === selectedType;
    const matchesSpecification =
      selectedSpecification === "all" ||
      product.specification === selectedSpecification;

    return matchesType && matchesSpecification;
  }),
);
