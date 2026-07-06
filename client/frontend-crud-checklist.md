# Frontend CRUD Manual Checklist

## Setup

- [ ] Backend is running
- [ ] Frontend is running
- [ ] MongoDB has initial orders and products
- [ ] `VITE_API_URL` is correct or frontend proxy/default `/api` works

## Products CRUD

- [ ] Products list loads
- [ ] Create product works
- [ ] Created product appears in list
- [ ] Edit product works
- [ ] Edited product updates in list
- [ ] Delete product modal opens
- [ ] Cancel delete works
- [ ] Confirm delete removes product from list
- [ ] Validation errors are displayed or handled safely

## Orders CRUD

- [ ] Orders list loads
- [ ] Create order works
- [ ] Created order appears in list
- [ ] Edit order works
- [ ] Edited order updates in list
- [ ] Delete order modal opens
- [ ] Cancel delete works
- [ ] Confirm delete removes order from list
- [ ] Selected order is cleared after deleting it

## Products In Orders

- [ ] Order details load products
- [ ] Empty products message appears when order has no products
- [ ] Product count is correct after refresh

## Loading And Errors

- [ ] Initial loader works
- [ ] Mutation loading disables buttons
- [ ] Failed create/update/delete does not crash the page
