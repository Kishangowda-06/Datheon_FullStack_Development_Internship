# ShopSphere - E-Commerce Storefront

A responsive front-end e-commerce demo using HTML, CSS, JavaScript, FakeStoreAPI and localStorage.

## Files
- `index.html` - page structure
- `style.css` - responsive styling
- `script.js` - API fetching, search, category filtering, cart and checkout logic

## Run in VS Code
1. Extract this folder.
2. Open `Ecommerce-Store` in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server**.

Internet access is required to fetch products from:
https://fakestoreapi.com/products

## Cart rules
- Tax: 5% of subtotal.
- Shipping: $10 when subtotal is below $100.
- Shipping: free when subtotal is $100 or more.
- Cart contents are stored in browser localStorage.

## Important
This is an educational front-end demonstration. Checkout is simulated; it does not process payments, create server-side orders, or provide user authentication.
