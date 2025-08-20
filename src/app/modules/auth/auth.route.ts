import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import passport from "passport";

export const authRoutes = Router();

authRoutes.post("/login", authController.credentialsLogin);

authRoutes.post("/refresh-token", authController.getNewAccessToken);

authRoutes.post("/logout", authController.logout)

authRoutes.post(
    "/change-password",
    checkAuth("USER", "GUIDE", "ADMIN", "SUPER_ADMIN"),
    authController.changePassword
);

authRoutes.post(
    "/set-password",
    checkAuth("USER", "GUIDE", "ADMIN", "SUPER_ADMIN"),
    authController.setPassword
);

authRoutes.post(
    "/forgot-password",
    authController.forgotPassword
);

authRoutes.post(
    "/reset-password",
    checkAuth("USER", "GUIDE", "ADMIN", "SUPER_ADMIN"),
    authController.resetPassword
);

// /login -> succesful google login -> / frontend
authRoutes.get(
    "/google",
    async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || "/"
        passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
    })

// api/v1/auth/google/callback?state=/booking
authRoutes.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login?error=There_is_some_issues_with_your_account` }),
    authController.googleCallbackController
)