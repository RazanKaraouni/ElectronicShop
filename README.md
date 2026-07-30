# Electronic Shop

A full-stack e-commerce web application for browsing and purchasing electronic products. Built with ASP.NET Core Web API and a React frontend.

## Features

### Customer
- Browse products and view product details
- Register and login with JWT authentication
- Add items to cart and checkout
- View order history

### Admin
- Manage categories (create, update, delete)
- Manage products (create, update, delete)
- View and update order status
- Delete protection:
  - A product **cannot** be deleted if it has a **Pending** order
  - A category **cannot** be deleted if it contains products with **Pending** orders

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core Web API (.NET 10) |
| Frontend | React 19, Vite, React Router, Axios, Bootstrap 5 |
| Database | SQL Server (Entity Framework Core) |
| Auth | JWT Bearer tokens |

## Project Structure

```
Shop/
└── ElectronicShopApi/
    ├── Controllers/          # API endpoints
    ├── Models/               # Data models
    ├── Data/                 # DbContext
    ├── wwwroot/              # Built frontend (served by API)
    └── electronicshopclient/ # React source code
        └── src/
            ├── pages/        # Home, Products, Cart, Admin, etc.
            ├── components/   # Navbar, ProtectedRoute
            └── api/          # Axios client
```

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB or full instance)

## Getting Started

### 1. Database

Update the connection string in `ElectronicShopApi/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ElectronicShopDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Ensure the `ElectronicShopDB` database exists with the required tables (`Users`, `Categories`, `Products`, `CartItems`, `Orders`).

### 2. Run the API

```bash
cd ElectronicShopApi
dotnet run --urls "http://localhost:5240;https://localhost:7240"
```

The app is available at:
- **http://localhost:5240** — Web app + API
- **https://localhost:7240** — HTTPS
- **http://localhost:5240/swagger** — API documentation (Development mode)

### 3. Frontend Development (optional)

To run the React app with hot reload during development:

```bash
cd ElectronicShopApi/electronicshopclient
npm install
npm run dev
```

The dev server runs on **http://localhost:58843** and proxies API requests to the backend.

### 4. Build Frontend for Production

After making frontend changes, rebuild and copy to `wwwroot`:

```bash
cd ElectronicShopApi/electronicshopclient
npm run build
```

Then copy the contents of `dist/` into `ElectronicShopApi/wwwroot/`.

## API Endpoints

| Endpoint | Description | Auth |
|----------|-------------|------|
| `POST /api/auth/register` | Register a new customer | Public |
| `POST /api/auth/login` | Login and receive JWT token | Public |
| `GET /api/products` | List active products | Public |
| `GET /api/categories` | List categories | Public |
| `GET /api/cart/my` | Get cart items | Customer |
| `POST /api/cart` | Add to cart | Customer |
| `POST /api/cart/checkout` | Place order | Customer |
| `GET /api/orders/my` | Customer order history | Customer |
| `GET /api/products/all` | All products (admin) | Admin |
| `POST/PUT/DELETE /api/products` | Manage products | Admin |
| `POST/PUT/DELETE /api/categories` | Manage categories | Admin |
| `GET /api/orders` | All orders | Admin |
| `PUT /api/orders/{id}` | Update order status | Admin |

## User Roles

- **Customer** — Can browse, add to cart, checkout, and view their orders
- **Admin** — Full access to product/category management and all orders

Admin users must exist in the database with `Role = 'Admin'`.

## Configuration

JWT settings are in `appsettings.json`:

```json
"Jwt": {
  "Key": "YourSecretKeyMustBeAtLeast32Characters!",
  "Issuer": "ElectronicShopApi",
  "Audience": "ElectronicShopClient"
}
```

