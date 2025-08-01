import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // throw new AppError(404, 'fake error')
        const user = await UserServices.createUser(req.body)

        res.status(201).json({
            message: "User created successfully",
            user
        })
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        next(err)
    }
}
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // throw new AppError(404, 'fake error')
        const result = await UserServices.getAllUsers();

        res.status(201).json({
            message: "Users retrived successfully",
            data: result
        })
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        next(err)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // const token = req.headers.authorization
        // const verifiedToken = verifyToken(token as string, process.env.JWT_ACCESS_SECRET as string) as JwtPayload

        const verifiedToken = req.user;

        const payload = req.body;
        const user = await UserServices.updateUser(userId, payload, verifiedToken)

        res.status(200).json({
            message: "User updated Successfully",
            user
        })
    } catch (error) {
        next(error)
    }

}

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}