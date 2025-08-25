import express, { Request, Response } from "express"
import cors from "cors"
import { UserRoutes } from "./app/modules/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { authRoutes } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser"
import expressSession from "express-session"
import passport from "passport";
import "./app/config/passport";
import { DivisionRoutes } from "./app/modules/division/division.route";
import { TourRoutes } from "./app/modules/tour/tour.route";
import { BookingRoute } from "./app/modules/booking/booking.route";
import { PaymentRoute } from "./app/modules/payment/payment.route";
import { OtpRoute } from "./app/modules/otp/otp.route";
import { StatsRoutes } from "./app/modules/stats/stats.route";

const app = express();
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/division", DivisionRoutes)
app.use("/api/v1/tour", TourRoutes)
app.use("/api/v1/booking", BookingRoute)
app.use("/api/v1/payment", PaymentRoute)
app.use("/api/v1/otp", OtpRoute)
app.use("/api/v1/stats", StatsRoutes)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to PH tour management db"
    })
})

app.use(globalErrorHandler)

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})


export default app;