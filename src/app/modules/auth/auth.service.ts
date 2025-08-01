import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/createUserTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(400, "User does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(400, "Incorrect password")
    }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }

    // // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" })
    // const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET as string, "1d")

    // const refreshToken = generateToken(jwtPayload, process.env.JWT_REFRESH_SECRET as string, "30d");

    const userTokens = createUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {

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

    const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET as string, "1d")

    return {
        accessToken
    }
}

export const authServices = {
    credentialsLogin,
    getNewAccessToken
}