import express from "express"

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to tour manaagaement db"
    })
})

export default app;