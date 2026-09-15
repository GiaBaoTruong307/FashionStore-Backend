import express from "express";
import routes from "./routes";
import cors from "cors";
import helmet from "helmet";
import connectCloudinary from "./config/cloudinary";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectCloudinary();

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;