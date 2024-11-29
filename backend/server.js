import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { deleteExpiredTrashedFiles } from "./controllers/trashCntroller.js";
import helmet from "helmet"
import cors from "cors"
import path from "path";
import { S3Client, PutObjectCommand }  from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const port = process.env.PORT || 8800;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  exposedHeaders: ["X-Auth-Token", "Authorization"],
}));

const s3Client = new S3Client({
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.BUCKET_NAME 



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileDirectory = path.join(__dirname, 'uploads'); 
app.use('/uploads', express.static(fileDirectory));

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled task to delete expired trashed files...");
  try {
    await deleteExpiredTrashedFiles();
    console.log("Expired trashed files deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired trashed files:", error.message);
  }
});

// Routes
import route from "./routes/index.js";
app.use("/", route);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// middleware
import error from "./middleware/error.js";
import { fileURLToPath } from "url";
app.use(error);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
