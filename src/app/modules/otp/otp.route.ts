import { Router } from "express";
import { OtpController } from "./otp.controller";

export const OtpRoute = Router();

OtpRoute.post("/send", OtpController.sendOTP)
OtpRoute.post("/verify", OtpController.verifyOTP)