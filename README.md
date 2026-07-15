# Forever - Full Stack E-Commerce Platform

A full-stack e-commerce application built with the MERN stack and TypeScript. Includes a customer-facing storefront, a separate admin panel, and a RESTful backend API with JWT authentication, Stripe payments, and Cloudinary image hosting.

---

## Project Structure

```
forever/
├── backend/       # Node.js + Express + TypeScript API
├── frontend/      # React customer storefront
└── admin/         # React admin panel (separate app)
```

---

## Tech Stack

### Backend

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js                       |
| Framework      | Express 5                     |
| Language       | TypeScript 6                  |
| Database       | MongoDB + Mongoose 9          |
| Authentication | JWT (access + refresh tokens) |
| File uploads   | Multer + Cloudinary           |
| Payments       | Stripe                        |
| Validation     | Zod                           |
| Security       | bcrypt, cookie-parser, cors   |

### Frontend & Admin

| Category      | Technology     |
| ------------- | -------------- |
| Framework     | React 19       |
| Language      | TypeScript 6   |
| Build tool    | Vite           |
| Routing       | React Router 7 |
| HTTP client   | Axios          |
| Styling       | Tailwind CSS   |
| Notifications | React Toastify |

---

## Prerequisites

- Node.js v22 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account
- Stripe account

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
NODE_ENV="development"

# Database
MONGO_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Auth
JWT_SECRET="your_long_random_jwt_secret"
JWT_REFRESH_SECRET="your_long_random_refresh_secret"

# Admin credentials
ADMIN_EMAIL="admin@yourstore.com"
ADMIN_PASSWORD="your_admin_password"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
```

To generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_URL="http://localhost:4000"
```

Create a `.env` file in `admin/`:

```env
VITE_BACKEND_URL="http://localhost:4000"
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/forever.git
cd forever
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

### 3. Run in development

Open three terminal windows:

```bash
# Terminal 1 — Backend (watches for changes, no build needed)
cd backend
npm run server

# Terminal 2 — Frontend
cd frontend
npm run dev

# Terminal 3 — Admin
cd admin
npm run dev
```

| Service     | URL                   |
| ----------- | --------------------- |
| Backend API | http://localhost:4000 |
| Frontend    | http://localhost:5173 |
| Admin panel | http://localhost:5174 |

---

## API Overview

### User routes `/api/user`

| Method | Endpoint    | Auth | Description                                       |
| ------ | ----------- | ---- | ------------------------------------------------- |
| POST   | `/register` | —    | Register a new user                               |
| POST   | `/login`    | —    | Login, returns access token + sets refresh cookie |
| POST   | `/refresh`  | —    | Refresh access token using httpOnly cookie        |
| POST   | `/logout`   | —    | Clear refresh token cookie                        |

### Product routes `/api/product`

| Method | Endpoint  | Auth  | Description                   |
| ------ | --------- | ----- | ----------------------------- |
| POST   | `/add`    | Admin | Add a new product with images |
| GET    | `/list`   | —     | Get all products              |
| POST   | `/single` | —     | Get a single product by ID    |
| POST   | `/remove` | Admin | Remove a product              |

### Cart routes `/api/cart`

| Method | Endpoint  | Auth | Description          |
| ------ | --------- | ---- | -------------------- |
| POST   | `/add`    | User | Add item to cart     |
| POST   | `/update` | User | Update item quantity |
| POST   | `/get`    | User | Get user's cart      |

### Order routes `/api/order`

| Method | Endpoint        | Auth  | Description                      |
| ------ | --------------- | ----- | -------------------------------- |
| POST   | `/place`        | User  | Place a COD order                |
| POST   | `/stripe`       | User  | Create a Stripe checkout session |
| POST   | `/verifyStripe` | User  | Verify Stripe payment            |
| POST   | `/userorders`   | User  | Get logged-in user's orders      |
| POST   | `/list`         | Admin | Get all orders                   |
| POST   | `/status`       | Admin | Update order status              |

---

## Authentication Flow

```
Login
  → server issues short-lived access token (15min) in response body
  → server sets long-lived refresh token (30 days) in httpOnly cookie

Every request
  → Axios interceptor attaches access token to headers automatically

Access token expires
  → Axios interceptor catches 401
  → silently calls /api/user/refresh (cookie sent automatically)
  → gets new access token, retries original request
  → user notices nothing

Refresh token expires (after 30 days)
  → user is redirected to login
```

---

## Payment Flow (Stripe)

```
User submits order
  → POST /api/order/stripe creates order in DB + Stripe checkout session
  → frontend redirects to Stripe hosted checkout page
  → on success, Stripe redirects to /verify?success=true&orderId=...
  → POST /api/order/verifyStripe confirms payment, updates order status
```

---

## Project Scripts

### Backend

```bash
npm run server      # development — watches for changes, no build needed
npm run build       # compile TypeScript to dist/ (production only)
npm run start       # run compiled output (production only)
npm run type-check  # check types without emitting files
npm run lint        # run ESLint
```

### Frontend / Admin

```bash
npm run dev         # development server
npm run build       # production build
npm run preview     # preview production build locally
npm run lint        # run ESLint
```

---

## Folder Structure

### Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB connection
│   │   ├── cloudinary.ts       # Cloudinary setup
│   │   └── env.ts              # Zod-validated environment variables
│   ├── controllers/
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   └── orderController.ts
│   ├── middleware/
│   │   ├── auth.ts             # User JWT middleware
│   │   ├── adminAuth.ts        # Admin JWT middleware
│   │   ├── validate.middleware.ts  # Zod validation wrapper
│   │   └── multer.ts           # File upload config
│   ├── models/
│   │   ├── userModel.ts
│   │   ├── productModel.ts
│   │   └── orderModel.ts
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── cartRoutes.ts
│   │   └── orderRoutes.ts
│   ├── validations/
│   │   ├── user.validation.ts
│   │   ├── product.validation.ts
│   │   ├── cart.validation.ts
│   │   └── order.validation.ts
│   ├── utils/
│   │   └── generateTokens.ts
│   └── app.ts
├── server.ts
├── tsconfig.json
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── context/
│   │   └── ShopContext.tsx     # Global state — products, cart, auth
│   ├── lib/
│   │   └── axios.ts            # Axios instance with interceptors
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Collection.tsx
│   │   ├── Product.tsx
│   │   ├── Cart.tsx
│   │   ├── Login.tsx
│   │   ├── PlaceOrder.tsx
│   │   ├── Orders.tsx
│   │   └── Verify.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── utils/
│   │   └── getErrorMessage.ts
│   └── App.tsx
└── package.json
```

---

## Key Implementation Notes

**Why `npm run server` instead of `npm start` during development**
`tsx watch` runs TypeScript directly in memory with auto-restart on save — no build step needed. `npm start` runs compiled output from `dist/` and is only used in production.

**Why tokens aren't stored in localStorage**
Access tokens live in memory (a module-level variable in `src/lib/axios.ts`). Refresh tokens live in an `httpOnly` cookie the browser manages automatically. Neither is accessible to JavaScript running on the page, protecting against XSS attacks.

**Why Zod validation runs on the backend when TypeScript already types the frontend**
TypeScript types are erased at runtime and the frontend can be bypassed entirely with tools like curl or Postman. Backend Zod validation is the only guarantee that data hitting your database is structurally valid and safe.

---

## .gitignore

Make sure these are in your `.gitignore` across all three projects:

```
node_modules/
dist/
.env
```

Never commit `.env` files — they contain secrets.

---

## License

MIT
