import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";

export const BookingRoute = Router();

BookingRoute.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    bookingController.createBooking
);