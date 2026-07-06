import { createSelector } from "@reduxjs/toolkit";
import { getProductId, isSameProduct } from "../../utils/productHelpers";

export const selectProducts = (state) => state.products.items;

export const selectProductsLoading = (state) => state.products.isLoading;

export const selectProductsError = (state) => state.products.error;

export const selectProductsMutationLoading = (state) =>
  state.products.mutationLoading;

export const selectSelectedType = (state) => state.products.selectedType;

export const selectSelectedSpecification = (state) =>
  state.products.selectedSpecification;

export const selectSelectedProductId = (state) =>
  state.products.selectedProductId;

export const selectProductFormOpen = (state) =>
  state.products.isProductFormOpen;

export const selectProductFormMode = (state) => state.products.productFormMode;

export const selectEditingProduct = (state) => state.products.editingProduct;

export const selectDeleteModalProductId = (state) =>
  state.products.deleteModalProductId;

export const selectDeleteModalProduct = createSelector(
  [selectProducts, selectDeleteModalProductId],
  (products, deleteModalProductId) =>
    products.find((product) =>
      isSameProduct(getProductId(product), deleteModalProductId),
    ) ?? null,
);

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
