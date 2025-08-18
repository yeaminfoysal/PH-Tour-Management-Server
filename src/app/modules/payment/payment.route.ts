import { Router } from "express";
import { PaymentController } from "./payment.controller";

export const PaymentRoute = Router()

PaymentRoute.post("/success", PaymentController.successPayment)