// /* eslint-disable no-constant-condition */

import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateReqest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";

export const UserRoutes = Router()

UserRoutes.post("/register", validateReqest(createUserZodSchema), UserControllers.createUser)

UserRoutes.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers)

UserRoutes.patch("/:id", checkAuth("USER", "GUIDE", "ADMIN", "SUPER_ADMIN"), UserControllers.updateUser)