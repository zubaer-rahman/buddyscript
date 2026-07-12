import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("BuddyScript API is running.");
});

export default app;
