# TriGardening : Full-Stack E-Commerce Platform

**TriGardening** is a robust, production-grade e-commerce solution tailored for gardening enthusiasts. It features a high-performance public storefront, a comprehensive customer dashboard with wallet & referral systems, and a powerful Admin Panel for complete business management.

Beyond standard e-commerce, it integrates **Google Gemini AI** to power a "Plant Clinic," offering real-time diagnosis for plant diseases.

---

## Project Screenshots

### Home Page
![Image](https://github.com/user-attachments/assets/598292f7-e50d-4306-b7d4-0b4bd403235e)

### Product Page
![Image](https://github.com/user-attachments/assets/e72c1648-8c82-4410-9b66-2e25f744281f)

### Product Types
![Image](https://github.com/user-attachments/assets/2fc4c217-a91d-43c6-bbed-e200e6bc49a9)

### Plant Clinic AI
![Image](https://github.com/user-attachments/assets/6e1ebc1b-68e0-4a3d-be76-31d4b0ac90b9)

### Cart Page
![Image](https://github.com/user-attachments/assets/afab4e75-a94b-483e-92ea-83cb1ef8b778)

### Checkout Page
![Image](https://github.com/user-attachments/assets/18c0cac7-81b5-4044-b11c-e914a0e72a9c)

### Customer Profile Dashboard
![Image](https://github.com/user-attachments/assets/c380e642-9f87-4568-86d4-d3f10e199c5b)

### Customer Profile - My Profile
![Image](https://github.com/user-attachments/assets/3d8f533f-6c42-42ca-b5ca-3f23920c79c0)

### Customer Profile - My Orders
![Image](https://github.com/user-attachments/assets/c0d5ef77-b6af-4b05-b85c-43398f6141f7)

### Blog Page
![Image](https://github.com/user-attachments/assets/20d80f5f-a4b2-42fa-a58a-db38bcc66652)

### Admin Dashboard
![Image](https://github.com/user-attachments/assets/f6ebd5f9-b619-497c-ac06-1bb132297806)

### Admin Order Page
![Image](https://github.com/user-attachments/assets/700b9571-4b5a-4f1e-b623-9788bed0288e)

### Admin - Products Page
![Image](https://github.com/user-attachments/assets/427d8e50-1335-4ec5-bb1e-79d04e9fd289)

### Admin - Add Product
![Image](https://github.com/user-attachments/assets/e70a6d94-ed9a-49e6-ad85-7ae749685822)

### Admin - Blog Page
![Image](https://github.com/user-attachments/assets/0883bb21-41c5-4dc4-bba2-50f887bc3e98)

### Admin - Customer Review
![Image](https://github.com/user-attachments/assets/cb3fe63b-6921-465c-845a-29cd8a96b68b)

### Admin -Finance & Analytics
![Image](https://github.com/user-attachments/assets/05465870-ed84-43e6-8558-67a8113307ac)

### Admin Customer Referral List Page
![Image](https://github.com/user-attachments/assets/2619768d-c548-46f7-9bd9-c02b53f66e49)

### Admin Settings
![Image](https://github.com/user-attachments/assets/9e2b64b5-8721-4ce3-915a-63ea7c7edfa8)

### Register Page
![Image](https://github.com/user-attachments/assets/116d79fc-0b96-4b52-b8e8-5051999ca812)

### Login Page
![Image](https://github.com/user-attachments/assets/66363d28-5c34-407a-a82c-9953a0d6f3b7)

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

## Contribution & Workflow

1.  **Backend First:** Ensure Entities and DTOs are updated before frontend integration.
2.  **Type Safety:** Both Frontend and Backend share strict TypeScript interfaces.
3.  **UI Components:** Built using **Shadcn UI** for consistency and accessibility.

---

© 2025 **TriGardening**. All Rights Reserved.
