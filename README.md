# Electronic Shop

Simple online store for electronics. **Backend:** ASP.NET Core API. **Frontend:** React website (not React Native).

## What it does

**Customer:** browse products, register/login, cart, checkout, view orders  
**Admin:** manage products & categories, view/update all orders

## Tech used

| Part | Tools |
|------|-------|
| Backend | ASP.NET Core (.NET 10), SQL Server, JWT login |
| Frontend | **React**  + Bootstrap (runs in browser) |

## Folder layout


```
Shop/
└── ElectronicShopApi/        ← API + serves the website
    ├── Controllers/          ← API routes
    ├── Models/               ← database models
    ├── Data/                 ← DbContext
    ├── wwwroot/              ← built React files (production)
    └── electronicshopclient/ ← React source code
```

## Before you run

Install:
- .NET SDK 10
- Node.js 18+
- SQL Server (LocalDB is fine)

Create database **ElectronicShopDB** with tables: `Users`, `Categories`, `Products`, `CartItems`, `Orders`.

Edit connection string in `ElectronicShopApi/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ElectronicShopDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Admin users need `Role = 'Admin'` in the database.

## How to run

**1. Start the API (this also serves the website):**

```bash
cd ElectronicShopApi
dotnet run --urls "http://localhost:5240;https://localhost:7240"
```

Open: **http://localhost:5240**  
Swagger (dev only): **http://localhost:5240/swagger**

**2. Frontend dev mode (optional — hot reload while coding):**

```bash
cd ElectronicShopApi/electronicshopclient
npm install
npm run dev
```

Runs at **http://localhost:58843** (API calls go to the backend automatically).

**3. After changing the frontend, rebuild:**

```bash
cd ElectronicShopApi/electronicshopclient
npm run build
```


```json
"Jwt": {
  "Key": "YourSecretKeyMustBeAtLeast32Characters!",
  "Issuer": "ElectronicShopApi",
  "Audience": "ElectronicShopClient"
}
```

