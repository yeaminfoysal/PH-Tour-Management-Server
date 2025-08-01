import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserToken = (user : Partial<IUser>) =>{
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" })
    const accessToken = generateToken(jwtPayload, process.env.JWT_ACCESS_SECRET as string, "1d")

    const refreshToken = generateToken(jwtPayload, process.env.JWT_REFRESH_SECRET as string, "30d");

    return {accessToken, refreshToken}
}