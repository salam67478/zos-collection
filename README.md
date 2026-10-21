# Zo’s Collection

A simple, mobile-friendly storefront for Zo’s Collection, built with plain HTML, CSS, and JavaScript. It needs no framework or build step.

## Preview the website

1. Download or clone this project to your computer.
2. Open the project folder.
3. Double-click `index.html` to view the home page in a browser.

The shop, product details, and cart work in the browser. The cart is saved in local storage on your device.

## Pages

- `index.html` — home page
- `shop.html` — product list and category filter
- `product.html?id=1` — product details (the number selects the product)
- `cart.html` — cart, delivery form, and payment choices
- `about.html` — brand story
- `contact.html` — contact details and FAQs

## Edit the products

Open `js/products.js` and edit the product list. Each item has an ID, name, category, price in rupees, image path, description, and available sizes. Keep IDs unique and put image files in the `images/` folder.

## Set your contact and payment details

Before taking real orders, open `js/main.js` and replace the sample WhatsApp number, phone number, and UPI ID in the `STORE` settings with your own details. Add your real UPI QR image in the payment section of `cart.html` as well. The checkout form prepares an order message in WhatsApp; it does not process online payments.

## Publish it

This is a static website. It can be published with GitHub Pages or another static website host without installing packages or running a build command. Use the project root as the published folder.
