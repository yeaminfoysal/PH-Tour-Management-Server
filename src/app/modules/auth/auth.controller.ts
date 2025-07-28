import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";

const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInfo = await authServices.credentialsLogin(req.body);

        res.status(200).json({
            message: "User login successfull",
            success: true,
            data: loginInfo
        })
    } catch (error) {
        next(error)
    }
}

export const authController = { credentialsLogin }