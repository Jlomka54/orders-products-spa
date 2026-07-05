# Orders Frontend Checklist

## Setup

- [ ] Backend is running.
- [ ] Frontend is running.
- [ ] MongoDB has orders and products.
- [ ] `VITE_API_URL` is correct or default `/api` is used.

## Orders list

- [ ] Orders are loaded from backend.
- [ ] Order title is visible.
- [ ] Product count is visible.
- [ ] Totals in USD and UAH are visible if products are loaded.

## Order details

- [ ] Clicking an order loads details.
- [ ] Products are shown in the details panel.
- [ ] Empty products message is shown if there are no products.

## Delete order

- [ ] Clicking delete opens modal.
- [ ] Cancel closes modal.
- [ ] Confirm deletes order from UI.
- [ ] Selected order is cleared after deleting selected order.

## Error and loading states

- [ ] Loader appears on initial loading.
- [ ] Error message appears on failed request.
- [ ] Page does not crash when order has missing products or date.
