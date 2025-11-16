import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);

// If user is google authenticated and also want to set a password for credentials login then this api will be used
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

//if user wants to change his password then this will be used
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);

// If user forgets his/her password then this route will be used to add new password through otp verification.
// Flow: User will provide email -> system will check user status(isVerified or not) and if all is ok then --> a short token (valid for 10 minutes) will be given to users--> system will send  email containing a frontend link(localhost:5173/reset-password?email=xyz?token=token)->frontend developer will extract email and token from query--> user will provide new password--> then  reset password in backened will be hit --> token for authorization-->nw password-->hash password
router.post("/forgot-password",  AuthControllers.forgotPassword);   

// If user forgets his/her password then this route will be used to add new password through otp verification
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req?.query?.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact Our Support team`,
  }),
  AuthControllers.googleCallbackController
);


export const AuthRoutes = router;
