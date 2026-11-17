# Datheon Full Stack Development Internship

Welcome to the **Datheon Full Stack Development Internship** project repository! This repository contains a portfolio of web applications developed during the internship, showcasing modern front-end web development practices, asynchronous API integration, state management, client-side persistence, and responsive UI/UX design.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Projects Overview](#projects-overview)
  - [1. ShopSphere — E-Commerce Storefront](#1-shopsphere--e-commerce-storefront)
  - [2. FORMA — Premium E-Commerce Storefront](#2-forma--premium-e-commerce-storefront)
  - [3. Atmos — Live Weather Telemetry Dashboard](#3-atmos--live-weather-telemetry-dashboard)
  - [4. TaskFlow — Productivity Task Manager](#4-taskflow--productivity-task-manager)
- [Repository Structure](#repository-structure)
- [Getting Started & Local Setup](#getting-started--local-setup)
- [Tech Stack & Concepts Demonstrated](#tech-stack--concepts-demonstrated)
- [Author & Acknowledgments](#author--acknowledgments)

---

## 🌟 Overview

This repository demonstrates practical proficiency in building client-side web applications using clean vanilla technologies (HTML5, modern CSS3, ES6+ JavaScript) and external APIs. Each project focuses on solving distinct real-world problems:
- **E-Commerce & Retail Experience**: Product catalogs, search, filtering, shopping carts, price/tax calculations, and simulated checkouts.
- **Real-Time Telemetry & External APIs**: Geolocation-based weather querying, forecast aggregation, async fetching, and dynamic theming.
- **Productivity & State Management**: Interactive CRUD workflows, client-side persistence via `localStorage`, data filtering, and responsive design.

---

## 🚀 Projects Overview

### 1. ShopSphere — E-Commerce Storefront
> **Location:** [`Ecommerce-Store/Ecommerce-Store`](./Ecommerce-Store/Ecommerce-Store)

A responsive, dynamic online shopping storefront powered by the [FakeStoreAPI](https://fakestoreapi.com/).

- **Key Features:**
  - Real-time catalog fetching via REST API.
  - Category-based product filtering and keyword search.
  - Interactive shopping cart with quantity adjustments and item removal.
  - Dynamic fee calculations (5% sales tax, conditional flat-rate or free shipping for orders over $100).
  - Persistent cart state across sessions using browser `localStorage`.
  - Simulated checkout with user validation.
- **Tech Stack:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+ Fetch API, DOM manipulation).

---

### 2. FORMA — Premium E-Commerce Storefront
> **Location:** [`FORMA_Ecommerce_Source_Code/premium-ecommerce-store`](./FORMA_Ecommerce_Source_Code/premium-ecommerce-store)

An upscale, editorial-grade e-commerce storefront designed with high-end visual aesthetics and sophisticated user interactions.

- **Key Features:**
  - Curated luxury layout with dynamic product cards, badges, and rating stars.
  - Multi-criteria filtering (Electronics, Jewelry, Men's Clothing, Women's Clothing).
  - Multi-parameter sorting: Featured, Price (Low-to-High / High-to-Low), Customer Rating, and Name.
  - Sleek slide-out shopping drawer/bag with quantity controls.
  - Smart order summary logic: configurable 8% tax calculation, free shipping threshold ($75+), and flat delivery rates.
  - Seamless simulated checkout flow with confirmation modal.
- **Tech Stack:** Semantic HTML5, CSS3 Custom Properties (Modern CSS Variables, Transitions), Vanilla JS (Modular State Architecture).

---

### 3. Atmos — Live Weather Telemetry Dashboard
> **Location:** [`Live_Weather_Telemetry_Project/live_weather_telemetry`](./Live_Weather_Telemetry_Project/live_weather_telemetry)

A weather telemetry dashboard that delivers global meteorological data and 5-day forecasts with reactive UI themes.

- **Key Features:**
  - Worldwide city search with support for country codes (e.g., `Paris, FR`).
  - Real-time atmospheric metrics: temperature, humidity, wind velocity, atmospheric pressure, and visibility.
  - 5-Day forecast cards derived and calculated from 3-hour forecast chunks.
  - Adaptive UI: dynamic background gradients and icons that react to ambient weather conditions (clear, rain, clouds, snow, storm).
  - In-browser API key configuration modal stored securely in client-side storage.
  - Graceful handling of network timeouts, invalid locations, and rate-limiting errors.
- **Tech Stack:** HTML5, CSS3, Asynchronous JavaScript (`Promise.all()`, `async/await`), OpenWeatherMap API.

---

### 4. TaskFlow — Productivity Task Manager
> **Location:** [`TaskFlow_Productivity_App/productivity_task_manager`](./TaskFlow_Productivity_App/productivity_task_manager)

A lightweight productivity application designed for managing daily tasks and workflows without external dependencies.

- **Key Features:**
  - Full CRUD operations: Create, Read, Inline Edit, and Delete tasks.
  - Task categorization (Work, Personal, Study) with color-coded tagging.
  - Due date assignment with automatic overdue detection and indicators.
  - Real-time status filtering: All, Active, and Completed tasks.
  - Instant text search across task descriptions and categories.
  - Live analytics counters displaying total, pending, and completed task metrics.
  - Full data persistence using `localStorage`.
- **Tech Stack:** Semantic HTML5, CSS3 (Keyframe animations, Flexbox), Vanilla JavaScript.

---

## 📁 Repository Structure

```text
Datheon_FullStack_Development_Internship/
├── .gitignore
├── README.md
├── Ecommerce-Store/
│   └── Ecommerce-Store/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── README.md
├── FORMA_Ecommerce_Source_Code/
│   └── premium-ecommerce-store/
│       ├── index.html
│       ├── styles.css
│       ├── app.js
│       └── README.md
├── Live_Weather_Telemetry_Project/
│   └── live_weather_telemetry/
│       ├── index.html
│       ├── style.css
│       ├── app.js
│       └── README.md
└── TaskFlow_Productivity_App/
    └── productivity_task_manager/
        ├── index.html
        ├── style.css
        ├── script.js
        └── README.md
```

---

## 💻 Getting Started & Local Setup

All applications in this repository are built with standard web technologies and do not require heavy server runtimes or package installations (`npm install`).

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- (Recommended) [VS Code](https://code.visualstudio.com/) with the **Live Server** extension.

### Running a Project
1. Clone the repository:
   ```bash
   git clone https://github.com/Kishangowda-06/Datheon_FullStack_Development_Internship.git
   cd Datheon_FullStack_Development_Internship
   ```
2. Navigate to any project folder (for example, `FORMA_Ecommerce_Source_Code/premium-ecommerce-store`).
3. Open using your preferred method:
   - **Method A (VS Code Live Server - Recommended):** Right-click `index.html` and choose **"Open with Live Server"**.
   - **Method B (Python 3):**
     ```bash
     python -m http.server 5500
     ```
     Then open `http://localhost:5500` in your browser.
   - **Method C (Node.js serve):**
     ```bash
     npx serve .
     ```

*(Note: Because API integrations utilize browser `fetch()`, running via a local HTTP server avoids browser `CORS` or `file://` protocol restrictions).*

---

## 🛠️ Tech Stack & Concepts Demonstrated

- **Languages:** HTML5, CSS3, JavaScript (ES6+)
- **APIs & Data Services:**
  - [FakeStoreAPI](https://fakestoreapi.com/) for mock e-commerce product catalogs
  - [OpenWeatherMap API](https://openweathermap.org/) for real-time weather & 5-day forecasts
- **Core Concepts:**
  - Asynchronous JavaScript (`async/await`, `Promise.all`, Fetch API, Error Handling)
  - DOM Manipulation & Event-Driven Architecture
  - Client-Side State Management & Persistence (`localStorage`)
  - CSS Grid & Flexbox Responsive Design
  - Dynamic Theming & Transitions

---

## 👤 Author

**Kishan Gowda**
- GitHub: [@Kishangowda-06](https://github.com/Kishangowda-06)
- Repository: [Datheon_FullStack_Development_Internship](https://github.com/Kishangowda-06/Datheon_FullStack_Development_Internship)

---
*Developed as part of the Datheon Full Stack Development Internship.*
