import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { DivisionController } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { multerUpload } from "../../config/multer.config";

export const DivisionRoutes = Router();

DivisionRoutes.post(
    "/create",
    checkAuth("ADMIN", "SUPER_ADMIN"),
    multerUpload.single("file"),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);

DivisionRoutes.get("/", DivisionController.getAllDivisions);

DivisionRoutes.get("/:slug", DivisionController.getSingleDivision);

DivisionRoutes.patch(
    "/:id",
    checkAuth("ADMIN", "SUPER_ADMIN"),
    multerUpload.single("file"),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);

DivisionRoutes.delete(
    "/:id",
    checkAuth("ADMIN", "SUPER_ADMIN"),
    DivisionController.deleteDivision
);
