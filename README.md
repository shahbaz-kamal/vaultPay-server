<div align="center">
  <img height="400" src="https://github.com/shahbaz-kamal/book-nest-with-mongoose/blob/main/src/assets/git_banner/git_banner_2.JPG"  />
</div>

###

<h1 align="left"> 🏦 VaultPay - payment system</h1>

**VaultPay** is a secure digital wallet and payment platform built using **Express**, **TypeScript**, and **MongoDB (Mongoose)**. It enables users to **deposit**, **withdraw**, and **transfer** money securely with real-time transaction processing. The system includes **role-based access control** with **Admin**, **Agent**, and **User** roles — each having distinct privileges.

Users can **add balance to their wallets via SSLCommerz**, a reliable online payment gateway ensuring safe and verified transactions. Admins can manage **system balance**, **transaction charges**, and **commissions**. The platform is powered by **JWT authentication**, **Zod validation**, and **BcryptJS encryption** to ensure robust security and data integrity across all operations.

## 🔗 Live deployment link

###

[book-nest-olive.vercel.app](https://book-nest-olive.vercel.app)

<!-- ###
<!-- ## 👨‍💼 Admin Info
###
<p align="left">Admin Email: shahbaz@kamal.com</p>
<p align="left">Admin Password: 123456Aa</p> -->

## ✨ Features:

- **Role-Based Access Control** — Separate functionalities for **Admin**, **Agent**, and **User** roles.
- **Secure Authentication** — Implemented using **JWT** and **BcryptJS** for safe login and password protection.
- **Add Balance via SSLCommerz** — Users can easily add money to their wallets using the **SSLCommerz payment gateway**.
- **Deposit, Withdraw & Transfer** — Real-time transaction system for seamless fund management.
- **Admin Dashboard** — Admins can monitor total balance, manage commissions, and set transaction charges.
- **Agent Management** — Agents can process withdrawals and assist users with transactions.
- **Data Validation** — Robust input validation using **Zod** to ensure clean and error-free data.
- **Error Handling** — Centralized error management with descriptive responses for smooth debugging.
- **TypeScript Support** — Strongly typed backend ensuring better maintainability and scalability.
- **Database Management** — Built with **MongoDB (Mongoose)** for flexible and efficient data modeling.

###

## 🛠 Technology Used

###

 <div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=express" height="40" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://img.icons8.com/?size=48&id=gKfcEStXI1Hm&format=png" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://img.icons8.com/?size=48&id=rHpveptSuwDz&format=png" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://sslcommerz.com/wp-content/uploads/2021/11/logo.png" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://zod.dev/_next/image?url=%2Flogo%2Flogo-glow.png&w=256&q=100" height="40" alt="mongodb logo"  />
</div>

## 💥 Dependencies:

```json
{
  "axios": "^1.12.2",
  "bcryptjs": "^3.0.2",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "express": "^5.1.0",
  "express-session": "^1.18.2",
  "http-status-codes": "^2.3.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.18.0",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-local": "^1.0.0",
  "zod": "^4.1.5"
}
```

## 💥Dev Dependencies:

```json
{
  "@eslint/js": "^9.34.0",
  "@types/cookie-parser": "^1.4.9",
  "@types/cors": "^2.8.19",
  "@types/dotenv": "^6.1.1",
  "@types/express": "^5.0.3",
  "@types/express-session": "^1.18.2",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/passport": "^1.0.17",
  "@types/passport-google-oauth20": "^2.0.16",
  "@types/passport-local": "^1.0.38",
  "eslint": "^9.34.0",
  "ts-node-dev": "^2.0.0",
  "typescript": "^5.9.2",
  "typescript-eslint": "^8.41.0"
}
```

## 📁 Project Structure

```
vaultPay-server/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── passport.ts
│   │   ├── constants.ts
│   │   ├── errorHelpers/
│   │   │   └── AppError.ts
│   │   ├── helpers/
│   │   │   ├── handleCastError.ts
│   │   │   ├── handleDuplicateError.ts
│   │   │   ├── handleValidationError.ts
│   │   │   └── handleZodError.ts
│   │   ├── interfaces/
│   │   │   ├── error.types.ts
│   │   │   └── index.d.ts
│   │   ├── middlewares/
│   │   │   ├── checkAuth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── logger.ts
│   │   │   ├── notFoundError.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── sslCommerz/
│   │   │   │   ├── sslCommerze.interface.ts
│   │   │   │   └── sslCommerze.service.ts
│   │   │   ├── system/
│   │   │   │   ├── system.interface.ts
│   │   │   │   └── system.model.ts
│   │   │   ├── transaction/
│   │   │   │   ├── transaction.controller.ts
│   │   │   │   ├── transaction.interface.ts
│   │   │   │   ├── transaction.model.ts
│   │   │   │   ├── transaction.route.ts
│   │   │   │   ├── transaction.service.ts
│   │   │   │   └── transaction.validation.ts
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   │   └── wallet/
│   │   │       ├── wallet.controller.ts
│   │   │       ├── wallet.interface.ts
│   │   │       ├── wallet.model.ts
│   │   │       ├── wallet.route.ts
│   │   │       ├── wallet.service.ts
│   │   │       └── wallet.validation.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── calculateTransactionFee.ts
│   │       ├── catchAsync.ts
│   │       ├── generateTransactionId.ts
│   │       ├── jwt.ts
│   │       ├── QueryBuilder.ts
│   │       ├── seedSuperAdmin.ts
│   │       ├── seedSystemInformation.ts
│   │       ├── sendResponse.ts
│   │       ├── setAuthCookie.ts
│   │       └── userToken.ts
│   ├── app.ts
│   └── server.ts
└── tsconfig.json
```

## ✨ Sample Request with routes

### **User Routes:**

### 1. Register User

**POST** `/api/v1/register`

#### Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User and wallet created successfully",
  "data": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2b$10$sYdQfvIhCUXRmlkooXk7V.oCQNUD5DkvClAPMzfRJsK76ltNKbOxy",
      "role": "USER",
      "phone": null,
      "profilePicture": null,
      "address": null,
      "isDeleted": false,
      "isActive": "ACTIVE",
      "isVerified": true,
      "auths": [
        {
          "provider": "credentials",
          "providerId": "john@example.com"
        }
      ],
      "agentRequestStatus": "NONE",
      "agentRequestedAt": null,
      "agentApprovedAt": null,
      "_id": "68e3f321abc0a2581349ec62",
      "createdAt": "2025-10-06T16:49:37.114Z",
      "updatedAt": "2025-10-06T16:49:37.319Z",
      "wallet": "68e3f321abc0a2581349ec64"
    }
  ]
}
```

### 2. Get All Users (Accessible to admin and super admin)

**GET** `/api/v1/user/users`

Supports filtering, sorting, pagination, searching and field filtering.

#### Example Query:

`/api/v1/user/users?name=tamim chowdhury&searchTerm=chowdhury&sort=-name&fields=name,email&page=2&limit=1`

#### Query Parameters:

- `name` : Filter by name of users.
- `searchTerm` : Search by name, email, type, sources, status, notes, sender email and receiver email
- `sort` : sort by a specific field
- `field` : field to be filtered.
- `page` : Current page number (default 1)
- `limit` : Number of data to be showen (default 10) 

### 3. Get logged in User (accessible to logged in user)

**GET** `/api/v1/user/me`

### 4. Get user by id (Accessible to admin and super admin)

**GET** `/api/v1/user/:id`

### 5. Update user (Accessible to admin and super admin)

**PATCH** `/api/v1/user/:id`

#### Request:

```json
{
  "name": "John Doe khan",
}
```
#### Response:

```json
{
    "statusCode": 201,
    "success": true,
    "message": "user Updated successfully"
}
```





### 2\. Get All Books

**GET** `/api/books`

Supports filtering, and sorting.

#### Example Query:

`/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Query Parameters:

- `filter`: Filter by genre
- `sort`: `asc` or `desc`
- `limit`: Number of results (default: 10)

###

### 3\. Get Book by ID

**GET** `/api/books/:bookId`

###

### 4\. Update Book

**PUT** `/api/books/:bookId`

#### Request:

```json
{
  "copies": 50
}
```

###

### 5\. Delete Book

**DELETE** `/api/books/:bookId`

###

### 6\. Borrow a Book

**POST** `/api/borrow`

### 7\. Borrowed Books Summary (Using Aggregation)

`GET /api/borrow`

###

## 🔧 Installation Guidline:

###

1. First clone the project by running

```bash
  git clone https://github.com/shahbaz-kamal/book-nest-with-mongoose.git
```

2. Change your directory to the cloned folder by

```bash
  cd folder_name
```

3. Run the following to install dependencies:

```bash
npm install
```

4. Create a MongoDB user by keeping username and password collected & create a .env file in the root directory and put the following code with corresponding info's :

```bash
DB_USER=***************************
DB_PASS=***************************

```

5. Run the following command to build the project:

```bash
npm run build
```

5. Run the following command and open the website locally on port 5000:

```bash
npm start
```

###
