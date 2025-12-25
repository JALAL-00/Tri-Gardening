# TriGardening : Full-Stack E-Commerce Platform

**TriGardening** is a robust, production-grade e-commerce solution tailored for gardening enthusiasts. It features a high-performance public storefront, a comprehensive customer dashboard with wallet & referral systems, and a powerful Admin Panel for complete business management.

Beyond standard e-commerce, it integrates **Google Gemini AI** to power a "Plant Clinic," offering real-time diagnosis for plant diseases.

## Live Demo & Access

Access the application locally (or via deployed links if available):

*   **Public Storefront:** [http://localhost:3000](http://localhost:3000)
*   **Admin Dashboard:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

---

## Login Credentials

Use these credentials to test the different role-based workflows:

### **1. Admin Access**
*   **Login URL:** [http://localhost:3000/login](http://localhost:3000/login)
*   **Phone:** `+8801875627698`
*   **Password:** `admin123` (or your local config password)

### **2. Customer Access**
*   **Login URL:** [http://localhost:3000/login](http://localhost:3000/login)
*   **Phone:** `+8801234567890`
*   **Password:** `password123`

---

## Tech Stack Summary

The project utilizes a modern Monorepo-style structure separating the Backend API and the Next.js Frontend.

| Component | Technology | Key Libraries / Features |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | TypeScript, Tailwind CSS, **Shadcn UI** |
| **State** | React Query (TanStack) | **Zustand** (Global Store for Auth/Cart) |
| **Backend** | **NestJS** | Modular Architecture, TypeScript |
| **Database** | **PostgreSQL** | **TypeORM** (Relational Data Mapping) |
| **AI Integration** | Google Generative AI | Gemini 1.5 Pro (Plant Diagnosis) |
| **Authentication** | JWT (JSON Web Tokens) | Passport.js, BCrypt |

---

## Key Features

### Customer Storefront
*   **Dynamic Product Discovery:** Advanced filtering by category, price range, and tags.
*   **Smart Cart System:** Persistent shopping cart with real-time stock validation.
*   **Wallet & Referrals:** Users earn credits via referrals and can apply wallet balances as discounts during checkout.
*   **Plant Clinic (AI):** Users can upload plant photos to get instant, AI-generated diagnosis and treatment advice.
*   **Profile Management:** Manage address book, view order history, and security settings.

### Admin Dashboard
*   **Analytics Dashboard:** Real-time visualization of Revenue, Sales trends (Charts), and Low Stock alerts.
*   **Product Management:** Complete CRUD for products with **Dynamic Variants** (Size, Color, Price) and multi-image uploads.
*   **Order Management:** Workflow to track orders from *Processing* to *Delivered*. Includes Bulk Invoice Printing and CSV Exports.
*   **CMS (Website Settings):** Dynamic control over the Navbar, Hero Sections, and Footer content directly from the admin panel.

---

## Local Setup and Installation

### A. Prerequisites
1.  **Node.js:** v18 or higher.
2.  **PostgreSQL:** Ensure a local instance is running on port `5432`.
3.  **Database:** Create an empty database named `gardening`.

### B. Backend Setup (`/backend`)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in the `backend` root and add your credentials:
    ```env
    PORT=5005
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=postgres
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=gardening
    JWT_SECRET=super_secret_jwt_key
    GOOGLE_API_KEY=your_gemini_api_key
    ```
4.  Start the Server:
    ```bash
    npm run start:dev
    ```
    *(The API will be live at `http://localhost:5005/api/v1`)*

### C. Frontend Setup (`/frontend`)

1.  Open a new terminal and navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env.local` file in the `frontend` root:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5005/api/v1
    ```
4.  Start the Next.js App:
    ```bash
    npm run dev
    ```
    *(Access the UI at `http://localhost:3000`)*

---

## Project Screenshots

### 1. Admin Dashboard & Analytics
Real-time insights into business performance with interactive charts.
![Dashboard](https://via.placeholder.com/800x450.png?text=Admin+Dashboard+Screenshot)

### 2. Product Management (Dynamic Variants)
Sophisticated form handling for products with multiple sizes, colors, and stock limits.
![Products](https://via.placeholder.com/800x450.png?text=Product+Management+Screenshot)

### 3. Customer Plant Clinic (AI Powered)
Users chat with "Gardy" (AI) to diagnose plant health issues via image recognition.
![Plant Clinic](https://via.placeholder.com/800x450.png?text=Plant+Clinic+AI+Screenshot)

### 4. Checkout with Wallet Support
Seamless checkout flow integrating shipping addresses and wallet credit usage.
![Checkout](https://via.placeholder.com/800x450.png?text=Checkout+Flow+Screenshot)

---

## Contribution & Workflow

1.  **Backend First:** Ensure Entities and DTOs are updated before frontend integration.
2.  **Type Safety:** Both Frontend and Backend share strict TypeScript interfaces.
3.  **UI Components:** Built using **Shadcn UI** for consistency and accessibility.

---

© 2025 **TriGardening**. All Rights Reserved.