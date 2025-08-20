/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessToken, /* createUserToken */ } from "../../utils/createUserTokens";
// import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"
import { IAuthProvider } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";

/*
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

    const userTokens = createUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}
*/

const getNewAccessToken = async (refreshToken: string) => {

    const accessToken = await createNewAccessToken(refreshToken)

    return {
        accessToken
    }
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId);

    if (!user?.password) {
        throw new AppError(401, "User not exist")
    }

    const isOldPasswordMatched = bcryptjs.compare(oldPassword, user.password)

    if (!isOldPasswordMatched) {
        throw new AppError(401, "Old password does not matched")
    }

    const newHashedPassword = await bcryptjs.hash(newPassword, 10)

    user.password = newHashedPassword;
    user.save()
}

const setPassword = async (userId: string, password: string) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user?.password && user.auths.some(providerObject =>
        providerObject.provider === "google")) {
        throw new AppError(400, "You have already set you password. Now you can change the password from your profile password update")
    }

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user?.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    const newHashedPassword = await bcryptjs.hash(password, 10)

    user.password = newHashedPassword;
    user.auths = auths;

    user.save()
}

const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }
    if (!isUserExist.isVerified) {
        throw new AppError(401, "User is not verified")
    }
    if (isUserExist.isActive === "BLOCK" || isUserExist.isActive === "INACTIVE") {
        throw new AppError(401, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(401, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: "10m" }
    )

    const resetUILink = `${process.env.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
}

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {

    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        10
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}

export const authServices = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
}