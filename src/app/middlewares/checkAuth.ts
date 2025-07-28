import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = await req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "No access thoken");
        }
        // const verifiedToken = jwt.verify(accessToken, "secret");
        const verifiedToken = verifyToken(accessToken, process.env.JWT_SECRET as string) as JwtPayload

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permited to view this route")
        }

        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}