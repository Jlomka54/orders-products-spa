import { createSelector } from "@reduxjs/toolkit";
import { calculateOrderTotal } from "../../utils/calculateOrderTotal";
import {
  matchesSearchQuery,
  normalizeSearchText,
} from "../../utils/searchHelpers";

const SEARCH_RESULT_LIMIT = 5;
const MIN_SEARCH_LENGTH = 2;

const selectOrdersStateItems = (state) => state.orders.items;
const selectProductsStateItems = (state) => state.products.items;

export const selectGlobalSearchQuery = (state) => state.ui.searchQuery;

const getOrderProducts = (order) => {
  if (Array.isArray(order?.products)) {
    return order.products;
  }

  if (Array.isArray(order?.items)) {
    return order.items;
  }

  return [];
};

const getProductsCount = (order) => {
  if (
    typeof order?.productsCount === "number" &&
    Number.isFinite(order.productsCount)
  ) {
    return order.productsCount;
  }

  return getOrderProducts(order).length;
};

const getPriceFields = (product) => {
  if (!Array.isArray(product?.price)) {
    return [];
  }

  return product.price.flatMap((price) => [price?.value, price?.symbol]);
};

const hasSearchableQuery = (query) =>
  normalizeSearchText(query).length >= MIN_SEARCH_LENGTH;

export const selectGroupSearchResults = createSelector(
  [selectOrdersStateItems, selectGlobalSearchQuery],
  (groups, query) => {
    if (!hasSearchableQuery(query)) {
      return [];
    }

    return groups
      .filter((group) => {
        const products = getOrderProducts(group);

        return matchesSearchQuery(
          [
            group?.title,
            group?.description,
            group?.date,
            getProductsCount(group),
            group?.totalUSD,
            group?.totalUAH,
            calculateOrderTotal(products, "USD"),
            calculateOrderTotal(products, "UAH"),
          ],
          query,
        );
      })
      .slice(0, SEARCH_RESULT_LIMIT);
  },
);

export const selectProductSearchResults = createSelector(
  [selectProductsStateItems, selectGlobalSearchQuery],
  (products, query) => {
    if (!hasSearchableQuery(query)) {
      return [];
    }

    return products
      .filter((product) =>
        matchesSearchQuery(
          [
            product?.title,
            product?.serialNumber,
            product?.type,
            product?.specification,
            product?.orderTitle,
            product?.date,
            ...getPriceFields(product),
          ],
          query,
        ),
      )
      .slice(0, SEARCH_RESULT_LIMIT);
  },
);

export const selectGlobalSearchResults = createSelector(
  [selectGroupSearchResults, selectProductSearchResults],
  (groups, products) => ({
    groups,
    products,
  }),
);

export const selectHasSearchResults = createSelector(
  [selectGlobalSearchResults],
  (results) => results.groups.length > 0 || results.products.length > 0,
);
