# FORMA — Premium E-Commerce Storefront

A responsive storefront built with plain HTML, CSS and JavaScript. Product data comes from [FakeStoreAPI](https://fakestoreapi.com/products).

## Features
- Live product catalog with product images, prices, ratings and curated badges.
- Category filters: Electronics, Jewelry, Men's Clothing and Women's Clothing.
- Search across product names, descriptions and categories.
- Sorting by featured order, price, rating and name.
- Slide-out shopping bag with quantity increment/decrement and remove actions.
- Cart persistence using `localStorage`.
- Subtotal, estimated 8% tax, shipping fee and complimentary-shipping threshold calculations.
- Simulated checkout form and order confirmation. No payment is processed.
- Responsive desktop, tablet and mobile layouts.

## Run locally
Because the app uses `fetch()` to call an API, run it from a local web server rather than opening `index.html` as a `file://` URL.

### Option 1: VS Code Live Server
1. Extract the ZIP.
2. Open the `premium-ecommerce-store` folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.

### Option 2: Python
Open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

### Option 3: Node.js
If Node.js is installed:

```bash
npx serve .
```

## Customize calculations
Open `app.js` and edit these constants near the top:

```js
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FEE = 6.95;
```

The displayed currency is USD because FakeStoreAPI product prices are represented in USD. Change the currency formatter in `money()` if you want a different display currency.

## Project structure

```text
premium-ecommerce-store/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Notes
- FakeStoreAPI is a demo API; product availability and images depend on that external service.
- The checkout is intentionally simulated. It does not collect payment details, create a real order, or arrange delivery.
- Cart contents are saved in the browser's local storage on the current device/browser.
