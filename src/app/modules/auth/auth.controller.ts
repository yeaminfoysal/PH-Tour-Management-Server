import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { setCookie } from "../../utils/setCookie";

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

export const authController = { credentialsLogin, getNewAccessToken }