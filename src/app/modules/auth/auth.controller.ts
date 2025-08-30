/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { setCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/createUserTokens";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";


const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // CUSTOM LOGIN
        /*  const loginInfo = await authServices.credentialsLogin(req.body);

            setCookie(res, loginInfo);

            res.status(200).json({
                message: "User login successfull",
                success: true,
                data: loginInfo
            })
        */


        // PASSPORT LOCAL LOGIN
        passport.authenticate("local", async (err: any, user: any, info: any, status: number) => {

            if (err) {
                // ❌❌❌❌❌
                // throw new AppError(401, "Some error")
                // next(err)
                // return new AppError(401, err)

                // ✅✅✅✅
                // return next(err)
                // console.log("from err");
                // console.log("STATUS",status);
                return next(new AppError(status ? status : 401, err))
            }

            if (!user) {
                // console.log("from !user");
                // return new AppError(401, info.message)
                return next(new AppError(info?.status ? info?.status : 404, info.message))
            }

            const userTokens = createUserToken(user)

            // delete user.toObject().password

            const { password: pass, ...rest } = user.toObject()

            setCookie(res, userTokens)

            res.status(200).json({
                message: "User Logged In Successfully",
                success: true,
                data: {
                    accessToken: userTokens.accessToken,
                    refreshToken: userTokens.refreshToken,
                    user: rest
                }
            })
        })(req, res, next)

    } catch (error) {
        next(error)
    }
}

const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const tokenInfo = await authServices.getNewAccessToken(refreshToken);

        setCookie(res, tokenInfo)

        res.status(200).json({
            message: "User login successfull",
            success: true,
            data: tokenInfo
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(200).json({
            message: "User logged out successfull",
            success: true,
            data: null
        })
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const decodedToken = req.user;

        if (!decodedToken) {
            throw new AppError(400, "Invalid decoded token");
        }

        await authServices.changePassword(oldPassword, newPassword, decodedToken);

        res.status(200).json({
            message: "Password changed successfull",
            success: true,
            data: null
        })
    } catch (error) {
        next(error)
    }
}

const setPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        const { userId } = req.user as JwtPayload;

        await authServices.setPassword(userId, password);

        res.status(200).json({
            message: "Password set successfull",
            success: true,
            data: null
        })
    } catch (error) {
        next(error)
    }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        await authServices.forgotPassword(email);

        res.status(200).json({
            message: "Email send successfull",
            success: true,
            data: null
        })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user

        await authServices.resetPassword(req.body, decodedToken as JwtPayload);

        res.status(201).json({
            success: true,
            message: "Password Changed Successfully",
            data: null,
        })
    } catch (error) {
        next(error)
    }
}

const googleCallbackController = async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
        throw new AppError(404, "User Not Found")
    }

    const tokenInfo = createUserToken(user)

    setCookie(res, tokenInfo)

    res.redirect(`${process.env.FRONTEND_URL}/${redirectTo}`)
}


export const authController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    googleCallbackController
}