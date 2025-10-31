# 🌱 TriGardening API

![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 🌟 Overview

This repository contains the backend API for **TriGardening**, a comprehensive e-commerce platform designed for selling gardening supplies. The API is built with a modern, scalable, and secure architecture using **NestJS**, **TypeScript**, and **PostgreSQL**.

This project was developed as a technical task for the Backend Developer Intern position at **ShafaCode**. It demonstrates a robust, feature-complete backend system that powers a public-facing website, a customer account section, and a full-featured admin panel.

**[Link to Your Live API Demo]** `(e.g., https://trigardening-api.onrender.com)`

---

## ✨ Features

The API is structured into three main user experiences, each with a rich set of features.

### 👤 **Public User (No Authentication Required)**
- **Product Discovery:** Browse a full catalog of products with advanced, multi-parameter filtering (category, tags, price range, search query) and pagination.
- **Detailed Views:** Get detailed information for a single product, including its variants (sizes, prices) and all approved customer reviews.
- **Content Consumption:** Read blog posts from the "Gardening Journal," paginated for easy browsing.
- **Category & Tag Listing:** Fetch lists of all available categories and tags to populate frontend navigation and filters.
- **Dynamic Homepage:** A single, efficient endpoint (`/page-content/home`) aggregates all necessary data for the main homepage, including featured products, popular products, and top categories.

### 👨‍💼 **Registered Customer (Customer Role)**
- **Full Authentication:** Secure registration, login, and an OTP-based password reset flow via email.
- **Profile Management:** Customers can view their profile, update personal information, and securely change their password.
- **Address Book:** Full CRUD functionality for managing multiple shipping addresses.
- **Order Management:** Place new orders (checkout) and view a complete history of past orders. The API ensures users can only access their own data.
- **Review System:** Submit product reviews, which are then queued for admin approval.

### 🔐 **Administrator (Admin Role)**
- **Role-Based Access Control (RBAC):** All admin endpoints are protected to ensure only authorized users can perform management tasks.
- **Full Catalog Management:** Full CRUD (Create, Read, Update, Delete) functionality for Products (with variants), Categories, and Tags.
- **Order Management:** View a list of all customer orders with filtering (by date, status) and update order statuses (e.g., from "processing" to "shipped").
- **Content Management:** Full CRUD for blog posts.
- **User Moderation:** View a list of all registered customers.
- **Review Moderation:** List, filter (by pending/approved status), approve, and delete customer-submitted reviews. Add official replies to reviews.
- **File Uploads:** A secure endpoint for uploading images for products and blog posts.

---

## 🛠️ Technology Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) with JWT Strategy
- **Validation:** `class-validator` & `class-transformer`
- **File Uploads:** `multer`
- **Email:** `nodemailer`

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/download/) server running
- A package manager like `npm` or `yarn`

### **1. Clone the Repository**
```bash
git clone https://github.com/JALAL-00/Tri-Gardening.git
cd Tri-Gardening/Tri-Gardening-Backend