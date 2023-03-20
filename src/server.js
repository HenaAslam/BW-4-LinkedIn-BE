import Express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import { badRequestHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import experiencesRouter from "./api/experiences/index.js";

const server = Express()
const port = process.env.PORT || 3001

// **************************************** MIDDLEWARES *****************************************
server.use(cors())
server.use(Express.json())

// ****************************************** ENDPOINTS *****************************************
server.use("/users", experiencesRouter)

// **************************************** ERROR HANDLERS **************************************
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("✅ Successfully connected to Mongo!")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`✅ Server is running on port ${port}`)
    })
})