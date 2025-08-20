// /* eslint-disable no-constant-condition */

import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

export const UserRoutes = Router()

UserRoutes.post(
    "/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser
)

UserRoutes.get(
    "/all-users",
    checkAuth("ADMIN", "SUPER_ADMIN"),
    UserControllers.getAllUsers
)

UserRoutes.get(
    "/me",
    checkAuth("USER", "ADMIN", "SUPER_ADMIN"),
    UserControllers.getMe
)

UserRoutes.patch(
    "/:id",
    validateRequest(updateUserZodSchema),
    checkAuth("USER", "GUIDE", "ADMIN", "SUPER_ADMIN"),
    UserControllers.updateUser
)