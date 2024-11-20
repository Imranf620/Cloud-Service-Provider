import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { deleteExpiredTrashedFiles } from "./controllers/trashCntroller.js";

const port = process.env.PORT || 8800;
const app = express();
app.use(express.json());
app.use(cookieParser());

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
app.use(error);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
