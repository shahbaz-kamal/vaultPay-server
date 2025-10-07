"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvironmentVariables = () => {
    const requiredVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_TOKEN_SECRET",
        "JWT_ACCESS_TOKEN_EXPIRES_IN",
        "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRES_IN",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "EXPRESS_SESSION_SECRET",
        "BACKENED_URL",
        "SSL_STORE_ID",
        "SSL_STORE_PASS",
        "SSL_ADDMONEY_API",
        "SSL_VALIDATION_API",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
    ];
    requiredVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environments variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
        JWT_ACCESS_TOKEN_EXPIRES_IN: process.env
            .JWT_ACCESS_TOKEN_EXPIRES_IN,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_TOKEN_EXPIRES_IN: process.env
            .JWT_REFRESH_TOKEN_EXPIRES_IN,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        BACKENED_URL: process.env.BACKENED_URL,
        SSL: {
            STORE_ID: process.env.SSL_STORE_ID,
            STORE_PASS: process.env.SSL_STORE_PASS,
            ADDMONEY_API: process.env.SSL_ADDMONEY_API,
            VALIDATION_API: process.env.SSL_VALIDATION_API,
            SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
            SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
        },
    };
};
exports.envVars = loadEnvironmentVariables();
