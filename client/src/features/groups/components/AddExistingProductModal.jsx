import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import Loader from "../../../components/ui/Loader";
import { selectIsProductLinking } from "../../orders/ordersSelectors";
import { addExistingProductToGroup } from "../../orders/ordersSlice";
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from "../../products/productsSelectors";
import { fetchProducts } from "../../products/productsSlice";
import {
  getProductId,
  getProductRequestId,
} from "../../../utils/productHelpers";
import "./AddExistingProductModal.css";

const getProductIds = (product) =>
  [product?._id, product?.id, product?.legacyId]
    .filter((productId) => productId !== null && productId !== undefined)
    .map((productId) => String(productId));

const productMatchesSearch = (product, searchQuery) => {
  const normalizedSearch = searchQuery.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [product.title, product.serialNumber]
    .filter((value) => value !== null && value !== undefined)
    .some((value) => String(value).toLowerCase().includes(normalizedSearch));
};

const AddExistingProductModal = ({
  isOpen,
  selectedGroupId,
  selectedGroupProductIds = [],
  onClose,
}) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isProductsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);
  const isProductLinking = useSelector(selectIsProductLinking);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const linkedProductIds = useMemo(
    () => new Set(selectedGroupProductIds.map((productId) => String(productId))),
    [selectedGroupProductIds],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          productMatchesSearch(product, searchQuery) &&
          !getProductIds(product).some((productId) =>
            linkedProductIds.has(productId),
          ),
      ),
    [linkedProductIds, products, searchQuery],
  );

  const hasAvailableProducts = products.some(
    (product) =>
      !getProductIds(product).some((productId) =>
        linkedProductIds.has(productId),
      ),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (products.length === 0) {
      dispatch(fetchProducts({ type: undefined, specification: undefined }));
    }
  }, [dispatch, isOpen, products.length]);

  if (!isOpen) {
    return null;
  }

  const handleProductSelect = (product) => {
    const productId = getProductRequestId(product);

    if (productId === null || productId === undefined) {
      return;
    }

    setSelectedProductId(productId);
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProductId) {
      setSubmitError("Выберите продукт.");
      return;
    }

    if (!selectedGroupId) {
      setSubmitError("Группа не выбрана.");
      return;
    }

    try {
      await dispatch(
        addExistingProductToGroup({
          groupId: selectedGroupId,
          productId: selectedProductId,
        }),
      ).unwrap();
      onClose();
    } catch (error) {
      setSubmitError(
        error || "Не удалось добавить продукт в группу. Попробуйте еще раз.",
      );
    }
  };

  const handleClose = () => {
    if (!isProductLinking) {
      onClose();
    }
  };

  return (
    <div className="add-existing-product-modal__backdrop">
      <section
        className="add-existing-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-existing-product-modal-title"
      >
        <button
          className="add-existing-product-modal__close-button"
          type="button"
          aria-label="Закрыть"
          onClick={handleClose}
          disabled={isProductLinking}
        />

        <header className="add-existing-product-modal__header">
          <h2
            className="add-existing-product-modal__title"
            id="add-existing-product-modal-title"
          >
            Добавить продукт в группу
          </h2>
          <input
            className="add-existing-product-modal__search"
            type="search"
            placeholder="Поиск по названию или серийному номеру"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            disabled={isProductLinking}
          />
        </header>

        <form className="add-existing-product-modal__form" onSubmit={handleSubmit}>
          {productsError && (
            <div className="add-existing-product-modal__status">
              <ErrorMessage message={productsError} />
            </div>
          )}

          {isProductsLoading && products.length === 0 ? (
            <div className="add-existing-product-modal__status">
              <Loader text="Загрузка продуктов..." />
            </div>
          ) : (
            <div className="add-existing-product-modal__list" role="listbox">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => {
                  const productId = getProductRequestId(product);
                  const isSelected =
                    productId !== null &&
                    productId !== undefined &&
                    String(productId) === String(selectedProductId);

                  return (
                    <button
                      className={`add-existing-product-modal__product${
                        isSelected
                          ? " add-existing-product-modal__product--selected"
                          : ""
                      }`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={
                        isProductLinking ||
                        productId === null ||
                        productId === undefined
                      }
                      key={getProductId(product) ?? product.serialNumber}
                      onClick={() => handleProductSelect(product)}
                    >
                      <span
                        className={`add-existing-product-modal__status-dot${
                          product.isNew
                            ? " add-existing-product-modal__status-dot--new"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span className="add-existing-product-modal__product-main">
                        <span className="add-existing-product-modal__product-title">
                          {product.title}
                        </span>
                        <span className="add-existing-product-modal__product-serial">
                          SN-{product.serialNumber}
                        </span>
                      </span>
                      <span className="add-existing-product-modal__product-meta">
                        {product.type}
                      </span>
                      <span className="add-existing-product-modal__product-meta">
                        {product.specification}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="add-existing-product-modal__empty">
                  {hasAvailableProducts
                    ? "Продукты не найдены."
                    : "Нет доступных продуктов."}
                </p>
              )}
            </div>
          )}

          {submitError && (
            <p className="add-existing-product-modal__error">
              {submitError}
            </p>
          )}

          <div className="add-existing-product-modal__actions">
            <button
              className="add-existing-product-modal__button"
              type="button"
              onClick={handleClose}
              disabled={isProductLinking}
            >
              Отменить
            </button>
            <button
              className="add-existing-product-modal__button add-existing-product-modal__button--primary"
              type="submit"
              disabled={!selectedProductId || isProductLinking}
            >
              {isProductLinking ? "Добавление..." : "Добавить продукт"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddExistingProductModal;
