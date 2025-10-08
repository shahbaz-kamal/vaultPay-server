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

- **Role-Based Access Control** — Separate functionalities for **Admin**, **Super Admin**, **Agent**, and **User** roles.
- **Secure Authentication** — Implemented using **JWT** and **BcryptJS** for safe login and password protection.
- **Add Balance via SSLCommerz** — Users can easily add money to their wallets using the **SSLCommerz payment gateway**. Also users can send money to other users.
- **Deposit, Withdraw & Transfer** — Real-time transaction system for seamless fund management.
- **Admin Dashboard** — Admins can monitor total balance, manage commissions, and set transaction charges.
- **Agent Management** — Agents can process cash in and assist users with transactions.
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

## ✨ Routes with sample request

Need to copy the accessToken from the response of login and paste it in Authorization header in postman for all private route. 

### **User Routes:**

### 1. Register User (public route)

**POST** `/api/v1/user/register`

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

### 2. Get All Users (Accessible to admin and super admin- Private route)

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

### 3. Get logged in User (accessible to logged in user- Private route)

**GET** `/api/v1/user/me`

### 4. Get user by id (Accessible to admin and super admin- Private route)

**GET** `/api/v1/user/:id`

### 5. Update user (Accessible to admin and super admin- Private route)

**PATCH** `/api/v1/user/:id`

#### Request:

```json
{
  "name": "John Doe khan"
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

### **Auth Routes:**

### 1. Login

**POST** `/api/v1/auth/login`

#### Request:

```json
{
  "email": "test1@gmail.com",
  "password": "123456Aa"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU0ZDVhZTJjNDk5YjcwMmQwODc0MDkiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU5ODI3NDQ5LCJleHAiOjE3NTk5MTM4NDl9.T_Vn9JfkjN5xFNy4NKxuzwK4Xa9zWYe7A7qhInQHmLY",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU0ZDVhZTJjNDk5YjcwMmQwODc0MDkiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU5ODI3NDQ5LCJleHAiOjE3NjI0MTk0NDl9.Vg04YLEuoKbwn6Hf5R4d5k2xap2iWPQ-ho5a6MYeQ9g",
    "user": {
      "_id": "68e4d5ae2c499b702d087409",
      "name": "Mr. Test",
      "email": "test1@gmail.com",
      "password": "$2b$10$1wmkQ9gmZ0b.xl45TKlgnO3qcjRxtdnM8eTH.XMvBQvvI.AHn3Y8u",
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
          "providerId": "test1@gmail.com"
        }
      ],
      "agentRequestStatus": "NONE",
      "agentRequestedAt": null,
      "agentApprovedAt": null,
      "createdAt": "2025-10-07T08:56:14.732Z",
      "updatedAt": "2025-10-07T08:56:14.891Z",
      "wallet": "68e4d5ae2c499b702d08740b"
    }
  }
}
```

### 2. Reset Password (Private route)

**POST** `/api/v1/auth/reset-password`

#### Request:

```json
{
  "oldPassword": "123456Aa",
  "newPassword": "123456aA"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Password changed successfully ",
  "data": null
}
```

### 3. Google Login (Public route)

**POST** `/api/v1/auth/google`

Initiates Google login

### 4. Get New Access Token with refresh-token (Private route)

**POST** `/api/v1/auth/refresh-token`

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "new access Token retrieved successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU0ZDVhZTJjNDk5YjcwMmQwODc0MDkiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU5ODI4NDkyLCJleHAiOjE3NTk5MTQ4OTJ9.-CPtpXkk3mU-fKd6ta1S7Bvmv-hJQERBTbhtmsIW0H8"
  }
}
```

### 4. Log out

**POST** `/api/v1/auth/logout`

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "logged out",
  "data": null
}
```

### **Transaction Routes:**

### 1. Add Money ( Private Route)

**POST** `/api/v1/transaction/add-money`

#### Request:

```json
{
  "receiverEmail": "test1@gmail.com",
  "amount": 1000,
  "notes": "User added money from bank account"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Add Money Successfull",
  "data": {
    "paymeent": "https://sandbox.sslcommerz.com/gwprocess/v3/gw.php?Q=PAY&SESSIONKEY=1B388E2A9372EC9296E14CDE94CAF14B",
    "result": [
      {
        "transactionId": "trans_1759830526490_d49ff7436a7b",
        "type": "ADD_MONEY",
        "source": "SSLCOMMERZ",
        "senderEmail": null,
        "senderId": null,
        "receiverEmail": "test1@gmail.com",
        "receiverId": "68e4d5ae2c499b702d087409",
        "amount": 1000,
        "agentCommission": null,
        "status": "PENDING",
        "notes": "User added money from bank account",
        "_id": "68e4e1feac0f381d75d4e88e",
        "createdAt": "2025-10-07T09:48:46.507Z",
        "updatedAt": "2025-10-07T09:48:46.507Z"
      }
    ]
  }
}
```

Upon clicking the `data.paymeent`, users will be redirect to payment gateway page and complete the process and result will be reflected on database if add money is successfull. If not an error will occur and associated data of this transaction in database will be cleared through transactional rollback.

### 2. Send Money ( Private Route - only for users ➡️ users)

**POST** `/api/v1/transaction/send-money`

Users can send money to other users.

#### Request:

```json
{
  "senderEmail": "test1@gmail.com", //logged in users email
  "receiverEmail": "shahbazkamal384@gmail.com", // the user who will get money
  "amount": 100,
  "notes": "User added money from bank account" // notes added by sender
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Send Money Successfull",
  "data": {
    "_id": "68e4ef418393126cd7eff488",
    "transactionId": "trans_1759833920972_b2d926653947",
    "type": "SEND_MONEY",
    "source": "USER",
    "senderEmail": "test1@gmail.com",
    "senderId": "68e4d5ae2c499b702d087409",
    "receiverEmail": "shahbazkamal384@gmail.com",
    "receiverId": "68d97d3eecc1f93336296b18",
    "amount": 100,
    "transactionFee": 5,
    "agentCommission": null,
    "status": "COMPLETED",
    "notes": "paying rent",
    "createdAt": "2025-10-07T10:45:21.041Z",
    "updatedAt": "2025-10-07T10:45:21.413Z"
  }
}
```

### 3. Cash out ( Private Route - only for users ➡️ agents)

**POST** `/api/v1/transaction/cash-out`

Users can cash out to agents and get cash out amount in cash from agents..

#### Request:

```json
{
  "senderEmail": "test1@gmail.com", //sender email (must be an logged in user)
  "receiverEmail": "testAgent@gmail.com", // any agents
  "amount": 1000,
  "notes": "User added money from bank account"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Cash out Successfull",
  "data": {
    "_id": "68e4f2d6eb0aa2133c28da0f",
    "transactionId": "trans_1759834838562_c8d9002c3d52",
    "type": "CASH_OUT",
    "source": "USER",
    "senderEmail": "test1@gmail.com",
    "senderId": "68e4d5ae2c499b702d087409",
    "receiverEmail": "testAgent@gmail.com",
    "receiverId": "68e4f182eb0aa2133c28d9f6",
    "amount": 1000,
    "transactionFee": 20,
    "agentCommission": 6,
    "status": "COMPLETED",
    "notes": "From stationary shop",
    "createdAt": "2025-10-07T11:00:38.638Z",
    "updatedAt": "2025-10-07T11:00:39.187Z"
  }
}
```

### 4. Cash In ( Private Route - only for Agents ➡️ users)

**POST** `/api/v1/transaction/cash-in`

Agents can cash in money to users wallet.

#### Request:

```json
{
  "senderEmail": "testAgent@gmail.com", //must be an logged in agent
  "receiverEmail": "test1@gmail.com", //must be any active  user
  "amount": 17,
  "notes": "User added money from bank account"
}
```

#### Response:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Cash in Successfull",
  "data": {
    "_id": "68e50a8672c9fda2852ccf40",
    "transactionId": "trans_1759840901962_4f6b8e42f2cf",
    "type": "CASH_IN",
    "source": "AGENT",
    "senderEmail": "testAgent@gmail.com",
    "senderId": "68e4f182eb0aa2133c28d9f6",
    "receiverEmail": "test1@gmail.com",
    "receiverId": "68e4d5ae2c499b702d087409",
    "amount": 17,
    "transactionFee": 0,
    "remainingBalance": null,
    "status": "COMPLETED",
    "notes": "User added money from bank account",
    "createdAt": "2025-10-07T12:41:42.042Z",
    "updatedAt": "2025-10-07T12:41:42.442Z"
  }
}
```

### 5. Get All Users (Accessible to admin and super admin- Private route)

**GET** `/api/v1/transaction/transactions`

Supports sorting,searching and pagination.

#### Example Query:

`/api/v1/transaction/transactions?sort=-amount&page=1&limit=2&searchTerm=shah`

#### Query Parameters:

- `searchTerm` : Search by name, email, type, sources, status, notes, sender email and receiver email
- `sort` : sort by a specific field
- `page` : Current page number (default 1)
- `limit` : Number of data to be showen (default 10)

### 6. Get Logged in users Transaction (Accessible to logged in user- Private route)

**GET** `/api/v1/transaction/myTransactions`

Supports filtering by date.

#### Example Query:

`/api/v1/transaction/myTransactions?from=2025-10-28T19:10:48.769+00:00&to=2025-10-29T13:44:54.099+00:01`

#### Query Parameters:

- `from` : From which date logged in user wants transactions
- `to` : upto which date logged in user wants transactions

### **Wallet Routes:**

### 1. Get All Wallets (Accessible to admin and super admin- Private route)

**GET** `/api/v1/wallet/wallets`

Supports sorting, pagination, and field filtering.

#### Example Query:

`/api/v1/wallet/wallets?sort=-name&fields=balance,isActive&page=1&limit=1`

#### Query Parameters:

- `sort` : sort by a specific field
- `field` : field to be filtered.
- `page` : Current page number (default 1)
- `limit` : Number of data to be showen (default 10)

### 2. Get logged in User (accessible to logged in user- Private route)

## 🔧 Installation Guidline:

###

1. First clone the project by running

```bash
  git clone https://github.com/shahbaz-kamal/vaultPay-server.git
```

2. Change your directory to the cloned folder by

```bash
  cd folder_name
```

3. Run the following to install dependencies:

```bash
npm install
```

4. Create a .env file in root directory of the project and add the following variables :

```bash
PORT=****
DB_URL=***************************
NODE_ENV=development

#jwt
JWT_ACCESS_TOKEN_SECRET=***************************
JWT_ACCESS_TOKEN_EXPIRES_IN=**  # 1d/2d
JWT_REFRESH_TOKEN_SECRET=***************************
JWT_REFRESH_TOKEN_EXPIRES_IN=**  # 1d,2d

#bcrypt
BCRYPT_SALT_ROUND=**  # 5/10

#SUPER_ADMIN
SUPER_ADMIN_EMAIL=*************************** # an email you want to create super admin (super@gmail.com)
SUPER_ADMIN_PASSWORD=***************************

#Google
GOOGLE_CLIENT_ID=*************************** # google OAuth Client Id
GOOGLE_CLIENT_SECRET=*************************** # google OAuth Client secret
GOOGLE_CALLBACK_URL=*************************** # google OAuth callback Url (ex: http://localhost:5000/api/v1/auth/google/callback)

#express-session
EXPRESS_SESSION_SECRET=***************************

#FRONTEND_URl
FRONTEND_URl=***************************   #example:http://localhost:5173

#Backened_URL
BACKENED_URL=***************************   #example:http://localhost:5000

# #SSLCommerze
SSL_STORE_ID=*************************** #sslCommerz store Id
SSL_STORE_PASS=*************************** #sslCommerz store Password
SSL_ADDMONEY_API=*************************** #sslCommerz Session API to generate transaction
SSL_VALIDATION_API=*************************** #sslCommerz Validation API


#SSL Commerze BAkened URl
SSL_SUCCESS_BACKEND_URL=*************************** # Backened URL to hit if SSLCommerze is successfull
SSL_FAIL_BACKEND_URL=*************************** # Backened URL to hit if SSLCommerze is failed
SSL_CANCEL_BACKEND_URL=*************************** # Backened URL to hit if SSLCommerze is Canceled

#SSL Commerze FRONTENDURL
SSL_SUCCESS_FRONTEND_URL=*************************** # Frontend URL to hit if SSLCommerze is successfull
SSL_FAIL_FRONTEND_URL=*************************** # Frontend URL to hit if SSLCommerze is failed
SSL_CANCEL_FRONTEND_URL=*************************** # Frontend URL to hit if SSLCommerze is failed

```

5. Run the following command to run the project:

```bash
npm run dev
```

6. Use Postman to send request as per above instructions

### Thank you:
