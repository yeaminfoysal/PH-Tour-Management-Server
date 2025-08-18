import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as JwtPayload;
        const payload = req.body;

        const booking = await bookingService.createBooking(payload, user.userId)

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        })

    } catch (error) {
        next(error)
    }
}

export const bookingController = { createBooking }