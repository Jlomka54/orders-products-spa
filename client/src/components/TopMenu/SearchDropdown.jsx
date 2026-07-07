import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectGlobalSearchQuery,
  selectGlobalSearchResults,
  selectHasSearchResults,
} from "../../features/search/searchSelectors";
import { clearSearchQuery, closeSearch } from "../../features/ui/uiSlice";
import { selectIsSearchOpen } from "../../features/ui/uiSelectors";

const MIN_SEARCH_LENGTH = 2;

const getProductsCount = (group) => {
  if (
    typeof group?.productsCount === "number" &&
    Number.isFinite(group.productsCount)
  ) {
    return group.productsCount;
  }

  if (Array.isArray(group?.products)) {
    return group.products.length;
  }

  if (Array.isArray(group?.items)) {
    return group.items.length;
  }

  return null;
};

const SearchDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector(selectGlobalSearchQuery);
  const results = useSelector(selectGlobalSearchResults);
  const hasResults = useSelector(selectHasSearchResults);
  const isSearchOpen = useSelector(selectIsSearchOpen);
  const isSearchable = query.trim().length >= MIN_SEARCH_LENGTH;

  if (!isSearchOpen || !isSearchable) {
    return null;
  }

  const handleResultClick = (path) => {
    dispatch(closeSearch());
    dispatch(clearSearchQuery());
    navigate(path);
  };

  return (
    <div className="top-menu__search-dropdown">
      {hasResults ? (
        <>
          <section className="top-menu__search-section">
            <h2 className="top-menu__search-title">Группы</h2>
            {results.groups.map((group) => {
              const productsCount = getProductsCount(group);

              return (
                <button
                  className="top-menu__search-result"
                  type="button"
                  key={group?._id ?? group?.id ?? group?.legacyId ?? group?.title}
                  onClick={() => handleResultClick("/groups")}
                >
                  <span>{group?.title}</span>
                  <span className="top-menu__search-result-label">Группа</span>
                  {productsCount !== null && (
                    <span>Товаров: {productsCount}</span>
                  )}
                </button>
              );
            })}
          </section>

          <section className="top-menu__search-section">
            <h2 className="top-menu__search-title">Продукты</h2>
            {results.products.map((product) => (
              <button
                className="top-menu__search-result"
                type="button"
                key={
                  product?._id ??
                  product?.id ??
                  product?.legacyId ??
                  product?.serialNumber ??
                  product?.title
                }
                onClick={() => handleResultClick("/products")}
              >
                <span>{product?.title}</span>
                <span className="top-menu__search-result-label">Продукт</span>
                {product?.serialNumber && <span>SN: {product.serialNumber}</span>}
                {product?.type && <span>{product.type}</span>}
              </button>
            ))}
          </section>
        </>
      ) : (
        <p className="top-menu__search-empty">Ничего не найдено</p>
      )}
    </div>
  );
};

export default SearchDropdown;
