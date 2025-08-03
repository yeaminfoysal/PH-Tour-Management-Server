import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" })
    const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET as string, "1d")

    const refreshToken = generateToken(jwtPayload, process.env.JWT_REFRESH_SECRET as string, "30d");

    return { accessToken, refreshToken }
}

export const createNewAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new AppError(400, "User is exist")
    }

    if (isUserExist?.isActive === "BLOCK" || isUserExist?.isActive === "INACTIVE") {
        throw new AppError(400, "User is blocked or inactive")
    }
    if (isUserExist?.isDeleted) {
        throw new AppError(400, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET as string, "1d");

    return accessToken;
}