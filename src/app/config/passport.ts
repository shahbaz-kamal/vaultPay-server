/* eslint-disable @typescript-eslint/no-unused-vars */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

import bcryptJs from "bcryptjs";
import { Wallet } from "../modules/wallet/wallet.model";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist)
          return done(null, false, {
            message: `User having email:${email}, does not exist`,
          });
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObject) => providerObject.provider === "google"
        );
        if (isGoogleAuthenticated && !isUserExist.password)
          return done(null, false, {
            message:
              "You are authenticated with google . If you want to log in with credentials then please  login with google and set the password first",
          });
        const isPasswordMatched = await bcryptJs.compare(
          password as string,
          isUserExist.password as string
        );
        if (!isPasswordMatched)
          return done(null, false, {
            message: `Password Does not match`,
          });

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const session = await User.startSession();
      session.startTransaction();
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          await session.abortTransaction();
          session.endSession();
          return done(null, false, { message: "No Email Found" });
        }
        let user = await User.findOne({ email }).session(session);

        if (!user) {
          const newUser = await User.create(
            [
              {
                name: profile.displayName,
                email,
                profilePicture: profile.photos?.[0].value,
                role: Role.USER,
                isVerified: true,
                auths: [{ provider: "google", providerId: profile.id }],
              },
            ],
            { session }
          );
          user = newUser[0];
          // await newUser.save({ session });
          const wallet=await Wallet.create([{ user: user._id }], { session });
          user.wallet = wallet[0]._id;
          await user.save({ session });
        }
        await session.commitTransaction();

        session.endSession();
        return done(null, user);
      } catch (error) {
        console.log("Google strategy error", error);
        await session.abortTransaction();
        session.endSession();

        return done(error);
      }
    }
  )
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
