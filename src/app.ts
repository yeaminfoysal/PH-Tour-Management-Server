import express, { Request, Response } from "express"
import cors from "cors"
import { UserRoutes } from "./app/modules/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { authRoutes } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser"

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors())

app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/auth", authRoutes)

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