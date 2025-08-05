import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { DivisionController } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { validateRequest } from "../../middlewares/validateRequest";

export const DivisionRoutes = Router();

DivisionRoutes.post(
    "/create",
    checkAuth("ADMIN", "SUPERADMIN"),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);
DivisionRoutes.get("/", DivisionController.getAllDivisions);
DivisionRoutes.get("/:slug", DivisionController.getSingleDivision);
DivisionRoutes.patch(
    "/:id",
    checkAuth("ADMIN", "SUPERADMIN"),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
DivisionRoutes.delete(
    "/:id",
    checkAuth("ADMIN", "SUPERADMIN"),
    DivisionController.deleteDivision
);
