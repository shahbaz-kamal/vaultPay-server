"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist)
            return done(null, false, {
                message: `User having email:${email}, does not exist`,
            });
        const isGoogleAuthenticated = isUserExist.auths.some((providerObject) => providerObject.provider === "google");
        if (isGoogleAuthenticated && !isUserExist.password)
            return done(null, false, {
                message: "You are authenticated with google . If you want to log in with credentials then please  login with google and set the password first",
            });
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched)
            return done(null, false, {
                message: `Password Does not match`,
            });
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            yield session.abortTransaction();
            session.endSession();
            return done(null, false, { message: "No Email Found" });
        }
        let user = yield user_model_1.User.findOne({ email }).session(session);
        if (!user) {
            const newUser = yield user_model_1.User.create([
                {
                    name: profile.displayName,
                    email,
                    profilePicture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                    role: user_interface_1.Role.USER,
                    isVerified: true,
                    auths: [{ provider: "google", providerId: profile.id }],
                },
            ], { session });
            user = newUser[0];
            // await newUser.save({ session });
            const wallet = yield wallet_model_1.Wallet.create([{ user: user._id }], { session });
            user.wallet = wallet[0]._id;
            yield user.save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        return done(null, user);
    }
    catch (error) {
        console.log("Google strategy error", error);
        yield session.abortTransaction();
        session.endSession();
        return done(error);
    }
})));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
