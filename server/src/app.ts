import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import config from "./config/index.js";
import router from "./routes/index.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import notFound from "./middlewares/notFound.js";
import { authLimiter, globalLimiter } from "./middlewares/rateLimiters.js";
import { helmetConfig } from "./config/helmet.js";

const app: Application = express();

app.use(helmetConfig);

app.use(
  cors({
    origin: [config.app_url, "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(compression());

app.use(json({ limit: "10kb" }));
app.use(urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

app.use(globalLimiter);
app.use("/api/v1/auth", authLimiter);

app.get("/", (req: Request, res: Response) => {
  res.send("BuddyScript API is running.");
});

app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
