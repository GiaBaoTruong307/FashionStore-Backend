import express from "express";
import routes from "./routes";
import cors from "cors";
import connectCloudinary from "./config/cloudinary";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// cloudinary configuration
connectCloudinary();

// routes
app.use("/api", routes);

export default app;
