import { join } from "path";
import experiencesRouter from "./api/experiences/index.js";
import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import postRouter from "./api/posts/index.js";
import usersRouter from "./api/users/index.js";
import mongoose from "mongoose";
import createHttpError from "http-errors";

const server = Express();
const port = process.env.PORT || 3001;

const publicFolderPath = join(process.cwd(), "./public");
server.use(Express.static(publicFolderPath));

// **************************************** MIDDLEWARES *****************************************
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);
server.use(Express.json());

// ****************************************** ENDPOINTS *****************************************
server.use("/users", experiencesRouter);

server.use("/posts", postRouter);
server.use("/users", usersRouter);

// **************************************** ERROR HANDLERS **************************************
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("✅ Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`✅ Server is running on port ${port}`);
  });
});
