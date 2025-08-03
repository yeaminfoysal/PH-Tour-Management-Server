/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { setCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/createUserTokens";

const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInfo = await authServices.credentialsLogin(req.body);

        // res.cookie("refreshToken", loginInfo.refreshToken, {
        //     httpOnly: true,
        //     secure: false
        // })
        // res.cookie("accessToken", loginInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })

        setCookie(res, loginInfo);

        res.status(200).json({
            message: "User login successfull",
            success: true,
            data: loginInfo
        })
    } catch (error) {
        next(error)
    }
}

const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const tokenInfo = await authServices.getNewAccessToken(refreshToken);

        // res.cookie("accessToken", tokenInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })

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
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const decodedToken = req.user;

        if (!decodedToken) {
            throw new AppError(400, "Invalid decoded token");
        }

        await authServices.resetPassword(oldPassword, newPassword, decodedToken);

        res.status(200).json({
            message: "Password changed successfull",
            success: true,
            data: null
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

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${process.env.FRONTEND_URL}/${redirectTo}`)
}


export const authController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}