import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import dotenv from 'dotenv'
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

dotenv.config()

let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`)

        console.log("connected to db");

        server = app.listen(3000, () => {
            console.log(`Server is listening to port 3000`);
        })
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()

// "Unhandled rejection"
process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected.... Server shutting down....", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

// "Uncought rejection"
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected.... Server shutting down....", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

// "Uncought rejection"
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved.... Server shutting down....");
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})