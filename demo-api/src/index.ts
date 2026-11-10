import express from "express"
import "dotenv/config"

const app = express()
app.use(express.json())

import userRouter from "./routes/user.js"
import orderRouter from "./routes/order.js"
import productRouter from "./routes/product.js"

app.use("/user", userRouter)
app.use("/", productRouter)
app.use("/orders", orderRouter)

app.listen(4000, ()=> {
    console.log("Demo API running at http://localhost:4000")
})