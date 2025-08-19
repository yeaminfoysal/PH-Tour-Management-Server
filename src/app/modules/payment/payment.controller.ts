import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service";

const initPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.bookingId;
        const result = await PaymentService.initPayment(bookingId as string)

        res.status(201).json({
            success: true,
            message: "Payment done successfully",
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

const successPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query
        const result = await PaymentService.successPayment(query as Record<string, string>)

        if (result.success) {
            res.redirect(`${process.env.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
        }
    } catch (error) {
        next(error)
    }
};

const failPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query
        const result = await PaymentService.failPayment(query as Record<string, string>)

        if (!result.success) {
            res.redirect(`${process.env.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
        }
    } catch (error) {
        next(error)
    }
};

const cancelPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query
        const result = await PaymentService.cancelPayment(query as Record<string, string>)

        if (!result.success) {
            res.redirect(`${process.env.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
        }
    } catch (error) {
        next(error)
    }
};

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment
};