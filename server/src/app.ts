import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import router from "./routes/index.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app: Application = express();

app.use(
  cors({
    origin: [config.app_url, "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("BuddyScript API is running.");
});

app.use('/api/v1', router);
app.use(globalErrorHandler);

export default app;
